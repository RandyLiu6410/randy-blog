---
sidebar_position: 8
id: graphql-apollo-federation
title: Apollo Federation
tags: [GraphQL, NestJS, backend, API gateway]
enableComments: true
---

#  Apollo Federation
Federation (聯盟) 讓 GraphQL 可以只開放出一個讓 client 對接的接口，client 不需知道裡面是否為 monolith 或是 microservices，Apollo Federation 在微服務建立各個 `subgraph` 間的關係，讓 subgraph a 的某個欄位可以連接至 subgraph b 的某個 entity 等。

Apollo Federation 基於以下規範:

> - **Building a graph should be declarative.** With federation, you compose a graph declaratively from within your schema instead of writing imperative schema stitching code.
> - **Code should be separated by concern, not by types.** Often no single team controls every aspect of an important type like a User or Product, so the definition of these types should be distributed across teams and codebases, rather than centralized.
> - **The graph should be simple for clients to consume.** Together, federated services can form a complete, product-focused graph that accurately reflects how it’s being consumed on the client.
> - **It’s just GraphQL, using only spec-compliant features of the language.** Any language, not just JavaScript, can implement federation.

關聯不同 graph 間的 entity 靠兩個基礎技術: `type references` 與 `type extensions`。

## Type references
當我們今天要開放某個 entity 讓其他微服務可以關聯，需要針對該 entity 定義可以識別的 `key` 去建立兩個不同服務的 entities 間的關聯性，舉管理 User 的 Account Service 為例: 

``` graphql
type User @key(fields: "id") {
  id: ID!
  username: String
}
```

## Type extensions
在需要 User entity 的服務中，例如 Review service，在 Review Service 裡的 scope 內還是需要知道 User entity 長怎樣，但只會需要簡單的資訊，例如:

```
extend type User @key(fields: "id") {
  id: ID! @external
  reviews: [Review]
}
```
我們不需要再重複定義 User 內的其他資訊，例如 `username`，這部分交由 Account Service 管理，在 Review Service 我們只需要在 graph 裡表達 User Entity 在 Review Service 裡會有個欄位是 Review Service 管理的 Review Entity，並且表示 `id` 為外部關聯鍵。

透過這樣的設計，其他服務可以透過 `User id` 去與 Account Service 建立 graph 間的關係。

除了以上的範例，Apollo Federation 更可以提供更彈性的關聯性:

- 多主鍵 (Multiple primary keys)，可以在 Entity 內在多個 field 加上 `@key` 的裝飾
- 複合式的主鍵 (Compound primary keys)，不止單一個 field 可以當作主鍵，nested object 也可以是主鍵
- 更快獲取資料的捷徑 (Shortcuts for faster data fetching)，可以透過 `@provides` 達到反正規化 (denormalization)

初步了解 Apollo Federation 在 GraphQL Gateway 架構中扮演的角色後，接下來我們就可以正式在 NestJS 上透過 Apollo Federation 實作 GraphQL Gateway 了！

---
來點饒舌，奉上 Drake 與不靠 feature 就可以霸佔排行榜的辣個男人 J. Cole 的

<iframe src="https://open.spotify.com/embed/track/6cmXX1EiigAAyvahpqfa4c?utm_source=generator&theme=0" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>

---
References:
- https://www.apollographql.com/blog/announcement/apollo-federation-f260cf525d21/
- https://www.apollographql.com/docs/federation/