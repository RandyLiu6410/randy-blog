---
sidebar_position: 7
id: graphql-gateway
title: GraphQL Gateway
tags: [GraphQL, NestJS, backend, API gateway]
enableComments: true
---

# GraphQL 搞微服務必備良器: GraphQL Gateway

## API Gateway
微服務的其中一個目的就是拆分服務職責，把一個巨大的服務切分成許多微服務，讓各服務都有專門負責的項目，以一個社群網站來說，可能會有以下分工:

- 貼文服務: 負責與貼文相關的功能，例如編輯器、貼文渲染等
- 留言服務: 負責與留言相關的功能，例如留言區塊、留言按讚、留言回覆等
- 交友圈服務: 負責交友功能，例如加好友、管理好友等

以一個成熟服務來說，不太可能將以上這些功能整合在一個服務內，不僅有職責拆分上的管理麻煩、還可能導致高度耦合，因此希望透過微服務的拆分達到各司其職。但當服務都拆分開來後，我們需要管理各服務端點，像是 `api/post` 導向 `Post Server`、`api/comment` 導向 `Comment Server`等，RESTful API 的設計方式可以輕易讓 Ngnix 這類代理去做到，e.x.

```
location /api/ {
	location /api/post {
    	    proxy_pass https://post_service;
	}
 
	location /api/comment {
        proxy_pass https://comment_service;
	}
 
	return 404; # Catch-all
}
```

而這種方式就是 **API Gateway**，但是跟到這邊的讀者會發現 GraphQL 的端點都是 `/graphql`，當然我們可以透過不同服務更換端點去做到 API Gateway，在 NestJS 中更改 `path`，e.x.

``` ts
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      playground: true,
      // subscriptions: {
      //   'graphql-ws': true,
      // },
      installSubscriptionHandlers: true,
      path: '/post',
    }),
```

但是 GraphQL 最重要的是 Schema 的型態管制，在不同服務間需要外部關聯的時候能發揮 Schema 類型參照的功用，而透過 Ngnix 做的 API Gateway 是不會讓各服務間知道各自的 Schema 的，慶幸地，GraphQL 給予了一個很好的解法: **GraphQL Gateway**！

## GraphQL Gateway
在開始實作前，我們需要先了解在 GraphQL 是怎麼透過 GraphQL Gateway 讓微服務溝通的。每個微服務會依照自己的職責開發出 GraphQL 的服務，同時創造出該服務的 Graph，在 GraphQL Gateway 的架構底下稱之為 `subgraph`，而在這些微服務的上層會有個主要的服務，也就是 Gateway 本身，會將 `subgraph`s 集結成 `supergraph`，而這些 `subgraph` 則須遵守 GraphQL service 的架構，以 Apollo 來說，掌管 `subgraph` 的架構即為 [`Apollo Federation`](https://www.apollographql.com/docs/federation/)。

<img src="https://i.imgur.com/6F15nVX.png" loading="lazy" alt="supergraph & subgraph" />

---
<iframe src="https://open.spotify.com/embed/track/5B0kgjHULYJhAQkK5XsMoC?utm_source=generator&theme=0" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>

---
References:
- https://www.apollographql.com/docs/federation/