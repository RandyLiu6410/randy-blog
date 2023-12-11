---
sidebar_position: 6
id: graphql-subscription
title: Subscription
tags: [GraphQL, NestJS, backend, websocket]
enableComments: true
---
# GraphQL 整併 Websocket 達到實時拉取資料: Subscription

相信大家一定很習慣使用 Websocket 去做 pub/sub pattern，讓 client 可以在第一時間知道 server 端通知的任何變動，包含資料創建、更改等，讓 client 的 UX 可以有大幅的提升。

GraphQL 提供了一個很好的 Operation 叫做 `Subscription`，跟 `Query` 類似的地方在於都是在拉取資料，不同的地方在於不同的地方在於 `Subscription` 會維持連線，讓 server 不斷地更新結果。

`Subscription` 適合的使用場景：
- 巨大的物件的某個屬性變動時，畢竟不斷地送 Request 拉取巨大物件取得最新狀態是非常沒效率的，可以逐漸地拉取新的屬性更新 client。
- 講求低延遲及即時更新的資訊，像是聊天室、線上共同編輯等。

## Protocols
- Websocket
    - [graphql-ws](https://github.com/enisdenjo/graphql-ws)
    - [subscriptions-transport-ws](https://github.com/apollographql/subscriptions-transport-ws)，**已不再維護**
- HTTP，使用 [chunked multipart responses](https://github.com/graphql/graphql-over-http/blob/main/rfcs/IncrementalDelivery.md): `Transfer-Encoding: chunked` + `Content-Type: multipart/mixed`

## NestJS 支持
``` ts
GraphQLModule.forRoot<ApolloDriverConfig>({
  driver: ApolloDriver,
  installSubscriptionHandlers: true, // default 使用 subscriptions-transport-ws
})
```

若要指定 `graphql-ws`，則是將設置改成
``` ts
GraphQLModule.forRoot<ApolloDriverConfig>({
  driver: ApolloDriver,
  subscriptions: {
    'graphql-ws': true
  },
}),
```

## 示例
> 總不可能一直用 `User` 打天下吧，我們來建個 `Comment`

我們新增個 Comment 的 table，並改一下 `Comment` 及 `User` 的 Schema:

``` ts
@ObjectType()
@Entity()
export class User {
  @Field(() => Int, { description: 'User ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String, { description: "User's first name" })
  @Column()
  firstName: string;

  @Field(() => String, { description: "User's last name" })
  @Column()
  lastName: string;

  @Field(() => String, { description: "User's phone" })
  @Column()
  phone: string;

  @Field(() => String, { description: "User's email" })
  @Column()
  email: string;

  @Field(() => [Comment], {
    description: "User's comments",
    defaultValue: [],
  })
  @OneToMany(() => Comment, (comment) => comment.creator)
  comments: Array<Comment>;

  @Field(() => Date)
  @CreateDateColumn({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
```

``` ts
@ObjectType()
@Entity()
export class Comment {
  @Field(() => Int, { description: 'Comment ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => User, { description: "Comment's creator" })
  @ManyToOne(() => User, (user) => user.comments)
  creator: User;

  @Field(() => String, { description: "Comment's content" })
  @Column()
  content: string;

  @Field(() => Date)
  @CreateDateColumn({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
```

並且加進 Foreign Key 的關聯進到這兩個 Schema。

> 原來 SQLite 不支援 `timestamp` 類型，以及不能在 `UpdateDateColumn` 裡設定 `onUpdate: 'CURRENT_TIMESTAMP'`

在開始實作 `Resolver` 前，我們要先裝 [graphql-subscriptions](https://www.npmjs.com/package/graphql-subscriptions) 已提供簡易的 `PubSub` 系統。

``` bash
$ npm i graphql-subscriptions
```

創建一個 Subscription Operation 到 `src/comment/comment.resolver.ts` 裡，並在 `createComment` 去發送一個事件到 `PubSub`，讓一個 comment 新增時去發送通知到 client:

``` ts
import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  Subscription,
} from '@nestjs/graphql';
import { CommentService } from './comment.service';
import { Comment } from './entities/comment.entity';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();

@Resolver(() => Comment)
export class CommentResolver {
  constructor(private readonly commentService: CommentService) {}

  @Mutation(() => Comment)
  createComment(
    @Args('createCommentInput') createCommentInput: CreateCommentInput,
  ) {
    const comment = this.commentService.create(createCommentInput);
    pubSub.publish('commentAdded', { commentAdded: comment });
    return comment;
  }

  @Subscription((returns) => Comment, {
    name: 'commentAdded',
  })
  subscribeToCommentAdded() {
    return pubSub.asyncIterator('commentAdded');
  }

  ...
}

```

同時因為我們加入了 Foreign Key Relation，所以 `src/comment/comment.service.ts` 的 `create` 需要創建 Comment 的 instance 後把 User instance 指到 `creator`:
``` ts
  async create(createCommentInput: CreateCommentInput) {
    const creatorId = createCommentInput.creatorId;

    const comment = new Comment();
    comment.content = createCommentInput.content;
    comment.creator = await this.userService.findOne(creatorId);

    await this.commentsRepository.manager.save(comment);

    return comment;
  }
```

這樣 Foreign Key 才會連結成功，同時到 Playground 試試看 Subscription:

> 目前看起來 `graphql-ws` 還不支援 Playground，所以使用 `subscriptions-transport-ws`
> ``` ts
> GraphQLModule.forRoot<ApolloDriverConfig>({
>   driver: ApolloDriver,
>   installSubscriptionHandlers: true,
> })
> ```

<img src="https://i.imgur.com/DLo4hbY.gif" loading="lazy" />

---

[Source code](https://github.com/RandyLiu6410/nestjs-graphql-sandbox/tree/main/nestjs-graphql-app1)

---

<iframe src="https://open.spotify.com/embed/track/6zp8BWzu4dzuygZTVf5H2H?utm_source=generator&theme=0" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>