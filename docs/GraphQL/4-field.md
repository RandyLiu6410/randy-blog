---
sidebar_position: 4
id: graphql-field
title: Field
tags: [GraphQL, NestJS, backend]
enableComments: true
---

# 探討更多 Field 操作的有趣之處

## Field
我們前面透過 `Mutation` 建立了一筆資料後，現在資料庫已有資料，那代表我們可以開始搭建 `Query` 的 API 了，首先先到 `user.service.ts` 實現透過 id 拿到使用者:


``` ts
findOne(id: number) {
    return this.usersRepository.findOne({ where: { id } });
}
```

回到 Resolver，我們會看到 NestJS 已經幫我們處理好基本的 API 了，其中有 `Query` user 的方法:

``` ts
@Query(() => User, { name: 'user' })
findOne(@Args('id', { type: () => Int }) id: number) {
    return this.userService.findOne(id);
}
```

- `@Query`: 使用 decorator 告訴 GraphQL 這是個 `Query` API
- `() => User`: 這是個 `ReturnTypeFunc`, 跟 GraphQL 說這個 `Query` 會回傳什麼
- `{ name: 'user' }`: `QueryOptions`, 這邊只有定義這個 `Query` 名稱叫做 `user`
- `findOne`: 方法名稱, 如果你沒有在上面的 `QueryOptions` 定義 `name` 的話, 他會直接用方法名稱當作 `Query` 名稱
- `@Args('id', { type: () => Int })`: 方法的參數, 使用 `@Args` decorator 告訴 `GraphQL` 這個 `Query` 的參數, `'id'` 為參數名稱, `{ type: () => Int }` 為 `ArgsOptions`, 這邊只有定義參數型態

### QueryOptions
``` ts
/**
 * Determines whether field/argument/etc is nullable.
 * 回傳值是否可為 null
 * NullableList = 'items' | 'itemsAndList'
 * 若回傳為陣列可以進而定義是 陣列元素 或是 陣列以及陣列元素 可為 null
 */
nullable?: false | NullableList;
/**
 * Default value.
 * 預設值
 */
defaultValue?: T;
/**
 * Name of the query.
 * Query 的名稱
 */
name?: string;
/**
 * Description of the query.
 * Query 的描述
 */
description?: string;
/**
 * Query deprecation reason (if deprecated).
 * 如果已棄用, 棄用的原因
 */
deprecationReason?: string;
/**
 * Query complexity options.
 * 複雜度
 */
complexity?: Complexity;
```

### ArgsOptions
``` ts
/**
 * Determines whether field/argument/etc is nullable.
 * 回傳值是否可為 null
 * NullableList = 'items' | 'itemsAndList'
 * 若回傳為陣列可以進而定義是 陣列元素 或是 陣列以及陣列元素 可為 null
 */
nullable?: false | NullableList;
/**
 * Default value.
 * 預設值
 */
defaultValue?: T;
/**
 * Name of the argument.
 * 參數名稱
 */
name?: string;
/**
 * Description of the argument.
 * 參數描述
 */
description?: string;
/**
 * Function that returns a reference to the arguments host class.
 * 回傳型態
 */
type?: () => any;
```

### Query Complexity 查詢複雜度
GraphQL 給予回傳值有高度的關聯彈性，因此有可能會造成服務或資料庫的大量負載，更有可能會被有心人士導致 DDoS，因此開發者可以預估這個 Field Query 有可能會造成的負載，進而定義查詢複雜度，同時可以在 Apollo Server 客製 Plugin 去設定最大複雜度，當今天有個 Query 透過 GraphQL 計算後是超過最大複雜度的，可以阻擋該 Query

## Query
我們可以試著透過 Playground 送一次 Query:

``` graphql
query user($id: Int!) {
  user(id: $id) {
    id
    firstName
    lastName
    phone
    email
  }
}
```
並帶入參數，`"id": 1`，同時可以打開右邊的 Docs，這是一份 API Document，告訴你有哪些 API 可以使用及參數、回傳型態

<img src="https://i.imgur.com/Mz6q3av.png" loading="lazy" />

然後我們會成功拿到回應:

``` json
{
  "data": {
    "user": {
      "id": 1,
      "firstName": "Randy",
      "lastName": "Liu",
      "phone": "0912456789",
      "email": "myemail@gmail.com"
    }
  }
}
```

若我們今天想要回傳一個 Field 是 `fullName`，這個是透過組合 `firstName` 及 `lastName`，當然我們可以在前端做組合，但若是今天有個 Field 是想要去關聯其他 table 的資料，那我們在前端就必須分兩次 API 查詢，這樣會多浪費來回一次的 Request 的時間，因此我們可以使用 Field Resolver！

## Field Resolver
在 NestJS，我們可以透過 `@ResolveField` decorator 做到新開一個 Field:

``` ts
@ResolveField(() => String)
fullName(@Parent() user: User) {
    return `${user.firstName} ${user.lastName}`;
}
```

`@ResolveField` 的第二個參數是 `ResolveFieldOptions`:

``` ts
/**
 * Determines whether field/argument/etc is nullable.
 * 回傳值是否可為 null
 * NullableList = 'items' | 'itemsAndList'
 * 若回傳為陣列可以進而定義是 陣列元素 或是 陣列以及陣列元素 可為 null
 */
nullable?: false | NullableList;
/**
 * Default value.
 * 預設值
 */
defaultValue?: T;
/**
 * Name of the query.
 * Query 的名稱
 */
name?: string;
/**
 * Description of the query.
 * Query 的描述
 */
description?: string;
/**
 * Query deprecation reason (if deprecated).
 * 如果已棄用, 棄用的原因
 */
deprecationReason?: string;
/**
 * Query complexity options.
 * 複雜度
 */
complexity?: Complexity;
/**
 * Array of middleware to apply.
 * 在這個 Field 在被 resolved 之前及之後
 * 可以放入 middleware 做更多事情
 */
middleware?: FieldMiddleware[];
```

我們可以再 Query 一次 user，並多帶入 `fullName`，然後就會看到我們想要的結果:

<img src="https://i.imgur.com/yblG3w9.png" loading="lazy" />

---

[Source code](https://github.com/RandyLiu6410/nestjs-graphql-sandbox/tree/main/nestjs-graphql-app1)

---
剛好 2023 Spotify 回顧剛出，這首我下半年超級常聽！
<iframe src="https://open.spotify.com/embed/track/51Y0kkClSkknR2V0rvbOni?utm_source=generator&theme=0" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
---
References:
- https://typegraphql.com/docs/complexity.html