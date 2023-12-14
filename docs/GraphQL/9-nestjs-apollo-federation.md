---
sidebar_position: 9
id: graphql-nestjs-apollo-federation
title: NestJS + Apollo Federation
tags: [GraphQL, NestJS, backend, API gateway]
enableComments: true
---

# 使用 NestJS 實作 Apollo Federation 來做到 API Gateway
我們來將之前做的 NestJS 應用拆成是兩個微服務: User service, Comment Service，分別管理用戶以及評論，這兩個服務即為 microservices。

## 安裝套件
我們需要先在這**兩個** microservices 去安裝必要的套件:

``` bash
$ npm i --save @apollo/federation@0.38.1
$ npm i --save @apollo/subgraph@2.6.2
```

## 導入 Apollo Federation 

在 `app.module.ts` 裡將之前已建立的 `GraphQLModule` 去做些更動，首先將 `driver` 更改成 `ApolloFederationDriver`:

```
GraphQLModule.forRoot<ApolloDriverConfig>({
    driver: ApolloFederationDriver
}),
```

### 踩雷經驗
在這邊更換 `driver` 後執行會出現錯誤:

``` bash
GraphQLError: The schema is not a valid GraphQL schema.. Caused by:
Invalid definition for directive "@tag": "@tag" should have locations FIELD_DEFINITION, OBJECT, INTERFACE, UNION, ARGUMENT_DEFINITION, SCALAR, ENUM, ENUM_VALUE, INPUT_OBJECT, INPUT_FIELD_DEFINITION, but found (non-subset) FIELD_DEFINITION, OBJECT, INTERFACE, UNION, ARGUMENT_DEFINITION, SCALAR, ENUM, ENUM_VALUE, INPUT_OBJECT, INPUT_FIELD_DEFINITION, SCHEMA
```
這時候我們會需要將 federation 版本更改成 **2**
> https://github.com/nestjs/graphql/issues/2646#issuecomment-1567381944

```
GraphQLModule.forRoot<ApolloDriverConfig>({
    driver: ApolloFederationDriver,
    autoSchemaFile: {
        path: 'schema.gql',
        federation: 2,
    },
    playground: true,
}),
```

## User service

### Entity
我們需要先將 User Entity 做更改:

``` ts
import { ObjectType, Field, Int, Directive } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity()
@Directive('@key(fields: "id")')
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

- 將 `id` 當作是外部微服務拿取 User 的關聯 `key`
- 將 `comments` 拿掉，放至 `comment service` 做處理

### Resolver
當其他服務與 User Entity 有關聯時，要拿著 user id 去問 User service，這時我們需要在 `User service` 的 resolver 去處理這樣的需求，但他不會透過我們之前開出來的 query `user`，而是會透過 **Reference** 的方式與 User service 溝通，因此 User service 的 resolver 需要透過 `ResolveReference` 去解析 reference:

```ts
@ResolveReference()
resolveReference(reference: { __typename: string; id: number }) {
    return this.userService.findOne(reference.id);
}
```

## Comment service

### Entity

Comment Entity 更改為:

``` ts
import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Comment {
  @Field(() => Int, { description: 'Comment ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int, { description: "Comment's creator ID" })
  @Column()
  creatorId: number;

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

- 將 `creator` 改成只儲存 id 的 `creatorId`

由於我們想要在 `User` 這個 Entity 底下有 `Comments` 這個屬性，意指需要知道每個 `User` 在 Comment service 儲存過的 comments，所以會需要在 Comment service 也創建一個 `User` Entity:

``` ts
import { ObjectType, Field, Int, Directive } from '@nestjs/graphql';
import { Comment } from './comment.entity';

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "id")')
export class User {
  @Field(() => Int, { description: 'User ID' })
  @Directive('@external')
  id: number;

  @Field(() => [Comment])
  comments: Array<Comment>;
}
```

同時在 `id` 這邊透過 `@Directive('@external')` 告知 GraphQL 這個是外部鍵，然後加上 `comments`。

### Resolver

因為我們在 comment service 定義了一個 reference 用的 entity，所以我們需要創建一個 User 的 resolver 跟 GraphQL 說 User 裡的 comments 怎麼拿到:

``` ts
import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { User } from '../entities/user.entity';
import { CommentService } from '../comment.service';
import { Comment } from '../entities/comment.entity';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly commentService: CommentService) {}

  @ResolveField(() => [Comment])
  public comments(@Parent() user: User) {
    return this.commentService.findAllByCreatorId(user.id);
  }
}
```

同時在 comment 的 service 裡實作 `findAllByCreatorId`:

``` ts
findAllByCreatorId(creatorId: number) {
    return this.commentsRepository.find({
        where: {
        creatorId,
        },
    });
}
```

## Gateway

我們將兩個 microservice 以及相對應的 subgraph 準備好後就可以實作 GraphQL Gateway 去打造 supergraph 來連結兩個 microservices，首先先起一個 NestJS + GraphQL 的服務，相關設定[參考](https://www.blog.randy-liu.com/docs/GraphQL/graphql-start-server/)。

安裝 Gateway 套件:

``` bash
$ npm i --save @apollo/gateway@2.6.2
```

在 `app.module.ts` 引入 GraphQL Gateway Module:

``` ts
import { IntrospectAndCompose } from '@apollo/gateway';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      gateway: {
        supergraphSdl: new IntrospectAndCompose({
          subgraphs: [
            { name: 'users', url: 'http://localhost:8080/graphql' },
            { name: 'comments', url: 'http://localhost:8081/graphql' },
          ],
        }),
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

> 我在這邊設定三個服務的通訊阜為
> - Gateway: 8000
> - User service: 8080
> - Comment service: 8081

## 測試
我們這時可以進入 http://localhost:8000/graphql 就可以看到我們成功把兩個微服務的 Schema 連結再一起，並可以針對兩者去下 query 同時拿到兩者的資料:

### 創建 user
``` graphql
mutation createUser($createUserInput: CreateUserInput!) {
  createUser(createUserInput: $createUserInput) {
    id
    firstName
    lastName
    fullName
    email
    phone
    comments {
      id
    }
  }
}
```

<img src="https://i.imgur.com/9uOfFz2.png" loading="lazy" />

### 創建 comment

``` graphql
mutation createComment($createCommentInput: CreateCommentInput!) {
  createComment(createCommentInput: $createCommentInput) {
    id
    creatorId
    content
  }
}
```

<img src="https://i.imgur.com/NPxhEdO.png" loading="lazy" />

### 獲取 user

``` graphql
query user($id: Int!) {
  user(id: $id) {
    id
    firstName
    lastName
    fullName
    email
    phone
    comments {
      id
      content
    }
  }
}
```

<img src="https://i.imgur.com/xU45WQl.png" loading="lazy" />

## Summary

我們成功打造出兩個微服務並透過 GraphQL Gateway 將兩者的 Schema 關聯在一起，雖然過程複雜且搭建起來比 monolith 還要久，可能會覺得這樣的 scope 還不如直接都寫在同個 service，但因為我們現在是一個人在做這些範例，並且 scope 只局限在 user, comment 兩種 schema，倘若 scope 拉大，並且有多個團隊在開發時，那帶來的優點包含:

- loose coupling，讓每個單一服務的職責、商業邏輯切分乾淨，並且互不影響。今天 comment 的商業邏輯變動時，若在 monolith 的開發環境下且團隊的開發習慣不好，導致過度耦合，那 user 的商業邏輯可能也會變動，更可能導致 `Circular dependency`。拆成維服務後，好處為 user service 團隊並不會知道 comment 是怎麼實作的，更不會知道有沒有更多 entities 依賴於 user，那該團隊的 repository 就會非常乾淨，放眼望去每個微服務，那每個團隊更能致力於開發自身專案的 features。
- 部屬更加輕便，今天透過 gateway 去連結多個微服務後，若今天某個微服務有更新並部屬新版後，只有該服務的專案 scope 會重新部署，若是 monolith 架構下，某個服務有更動，整個 monolith service 都需要重新部署，會導致時間拉長、複雜度變大、更難追蹤等。

---
[Source Code](https://github.com/RandyLiu6410/nestjs-graphql-sandbox)

---
References:
- https://docs.nestjs.com/graphql/federation

---
<iframe src="https://open.spotify.com/embed/track/2ypSwfDAy3LFPHinl3LFvj?utm_source=generator&theme=0" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>