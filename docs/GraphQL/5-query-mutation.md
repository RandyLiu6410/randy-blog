---
sidebar_position: 5
id: graphql-query-mutation
title: Query & Mutation
tags: [GraphQL, NestJS, backend]
enableComments: true
---

# GraphQL 的 CRUD API
CRUD 是 API 常見的行為，CRUD 代表 Create (建立), Read (讀取), Update (更新), Delete (刪除)，說到 CRUD，我們應該都習慣 RESTful API 的 CRUD，以及對應的 http method:

- Create: 使用 POST
- Read: 使用 GET
- Update: 使用 PUT 或 PATCH
- Delete: 使用 DELETE

但是在 GraphQL 的世界，習慣都用 http method 的 `POST` 做 CRUD，並在 post body 裡放置參數，對應到的行為 (Operation) 會是:

- Query: Read
- Mutation: Create, Update, Delete

Query 的中文翻譯是`查詢`，因此非常直觀地就是跟 Read 有關，Mutation 的中文翻譯為`變化`，因此與資料的變動有關，不過與 RESTful 一樣沒辦法阻擋在*應該變動資料的行為*裡做*查詢資料*的動作，反之亦然，但怎麼使用 `Query` 與 `Mutation` 算是公約。

## Query
Query 通常會長得像:
``` graphql
query me {
  me {
    ...
  }
}
```
帶參數的 Query
``` graphql
query getUser($id: Int!) {
  user(id: $id) {
    ...
  }
}
```
眼尖的朋友會發現第二個範例第一層的名稱跟第二層不一樣，第一層的 `getUser` 稱作 Operation name，是可以客製化的，第二層的 `user` 是 server 定義的 query 名稱。

## Mutation
Mutation 通常會長得像:
``` graphql
mutation createUser($createUserInput: CreateUserInput!) {
  createUser(createUserInput: $createUserInput) {
    ...
  }
}
```

## Variables
GraphQL 對於資料的型態是很嚴格的，不管是參數還是回傳值，因此會在資料型態宣告經常看到 `String!`, `Int` 等不同類型，其中驚嘆號 `!` 意指該參數是 required (不可留空)及 non-null (不可為 null)、屬性是 non-null (不可為 null)。e.x.

``` graphql
query user($id: Int!) {
  user(id: $id) {
    ...
  }
}
```

代表 `id` 為 non-null，必須帶為 `Int` 的值，同時可以注意到 Operation 的參數是有前綴 `$`，variable object 的 `id` 等於 `$id`, Operation 再將 `$id` 傳遞至 query 裡的 `id`。


在 `Query` 參數不帶值會跳這樣的錯誤
<img src="https://i.imgur.com/PgdigOx.png" loading="lazy" />

在 `Query` 參數帶 null 會跳這樣的錯誤
<img src="https://i.imgur.com/R2Cs0zm.png" loading="lazy" />

同時在 Playground 也會善意提醒:
<img src="https://i.imgur.com/1sF5HZS.png" loading="lazy" />

### Default Variables
在參數是可以帶預設值的，e.x.
``` graphql
query user($id: Int! = 1) {
  user(id: $id) {
    id
    firstName
    lastName
    phone
    email
    fullName
  }
}
```

## Aliases
我們送一次 Request 後成功會得到這樣的回應:
<img src="https://i.imgur.com/eEMhJJu.png" loading="lazy" />

可以看到回傳值的 `data` 裡有個 `user` 的物件，該物件是我們想得到的結果，這個 `user` 可以定成別名，像是:
``` graphql
query user($id: Int! = 1) {
  currentUser: user(id: $id) {
    id
    firstName
    lastName
    phone
    email
    fullName
  }
}
```

這是新的結果，可以看到 `user` 已被改成 `currentUser`，讓回傳值更加彈性！
<img src="https://i.imgur.com/vmqyNex.png" loading="lazy" />


## Fragments
當回傳資料結構有可以重複利用的結構，舉例來說:

- `blog` 的資料裡有 `author` 屬性，而 `author` 的類型是 `User`
- `post` 的資料裡有 `creator` 屬性，而 `creator` 的類型是 `User`

這時若兩個 `Query` 裡的 `author` 或 `creator` 裡的回傳 fields 都一樣時，這時又有其他 `Query`, `Mutation`, `Subscription` 也有相同的情況時，重複寫這些 fields 一定很煩，可以透過 `Fragment` 去覆用，e.x.

``` graphql
fragment userFields on User {
    id
    firstName
    lastName
    phone
    email
    fullName
}

query getBlog($id: Int!) {
  blog(id: $id) {
    id
    title
    author {
        ...userFields
    }
  }
}

query getPost($id: Int!) {
  post(id: $id) {
    id
    title
    creator {
        ...userFields
    }
  }
}

mutation createBlog($createBlogInput: CreateBlogInput!) {
    createBlog(createBlogInput: $createBlogInput) {
        id
        title
        author {
            ...userFields
        }
    }
}
```

## Arguments
除了 Operation 可以塞參數，Field 也可塞參數喔！例如我們把 `fullName` 做 i18n，根據不同的 locale 回傳不同的值:

``` ts
  @ResolveField(() => String)
  fullName(
    @Parent() user: User,
    @Args({ name: 'locale', nullable: true }) locale?: string,
  ) {
    if (locale === 'zh-TW') return '劉小明';
    return `${user.firstName} ${user.lastName}`;
  }
```

而 Operation 會長這樣:

<img src="https://i.imgur.com/Ca61oNa.png" loading="lazy" />