---
sidebar_position: 2
id: graphql-start-server
title: Start Server
tags: [GraphQL, NestJS, backend]
---

## NestJS + Apollo

NestJS 是我滿喜歡的 Node.js 框架，受到 Angular 的啟發，延續了 MVC 架構、依賴注入、以及 TypeScript 支持，並有強大的中間件支持、豐富的生態系統及社群支援，能夠輕易打造可擴張、可維護、可測試以及鬆耦合的服務，是能快速達到後端 MVP 的方式。

使用 **>= 16 的 Node.js** 環境，並透過 CLI 接初始 NestJS 專案:

``` bash
$ npm install -g @nestjs/cli
$ nest new project-name
```

> 原生用 Express 當作是預設的框架，另外也可以選擇用 Fastify

安裝好相關的套件後，我們可以先到 `main.ts` 更改服務的阜號
``` ts
await app.listen(8080);
```

並透過 Apollo 當作是我們的 GraphQL server，另外也可以選用 Mercurius + Fastify

``` bash
# For Express and Apollo (default)
$ npm i @nestjs/graphql @nestjs/apollo @apollo/server graphql

# For Fastify and Apollo
# npm i @nestjs/graphql @nestjs/apollo @apollo/server @as-integrations/fastify graphql

# For Fastify and Mercurius
# npm i @nestjs/graphql @nestjs/mercurius graphql mercurius
```

### 踩雷注意
透過 nestjs cli 初始的專案是搭配 `@nestjs/core@8.0.0`, `@nestjs/common@8.0.0` 以及其他相關的 nestjs dependencies 都是 `@8.0.0`, 而透過

``` bash
$ npm i @nestjs/graphql @nestjs/apollo @apollo/server graphql
```

安裝的套件是不相容 `@8.0.0`，因此需要將相關套件升級:

``` bash
$ npm i @nestjs/common@latest @nestjs/core@latest @nestjs/platform-express@latest @nestjs/cli@latest @nestjs/schematics@latest @nestjs/testing@latest --force
```

這樣就能相容 GraphQL 相關的套件。

## Schema First vs. Code First

GraphQL 開發模式有兩種，分別是 Schema First 與 Code First。

### Schema First
先定義出 GraphQL Schema Definition Language (SDL) schema 後再到 resolver 裡實作，好處是可以先討論介面，並且介面無關於實作，之後可以平行進行前後端分離。

### Code First
以實作為先，再透過實作內容產出 SDL schema。

開發方式取決於團隊合作偏好、習慣及產品規模。

## 引入 GraphQLModule

我們可以在 `app.module.ts` 引入 `GraphQLModule`，可以讓我們在 app module 以下的模塊使用這個配置。

``` ts
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      playground: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

- `driver`: 可以使用 Apollo 或是 Mercurius
- `autoSchemaFile`: 我們使用 Code First 開發方式，透過模塊去產出 schema，而這邊定義我們的 schema 檔案名稱
- `playground`: 是否建置 GraphQL Playground 或是客製化 Playground 的頁面渲染設定

此時我們會得到一個錯誤是:

```
GraphQLError: Query root type must be provided.
```

這是因為我們還沒有模組實作 GraphQL resolver，因此抓不到 Query 的型態。因此我們需要建立一個模塊，以建立 `User` 模塊為例:

``` bash
$ nest g resource user
```
會出現可互動的指令，並選擇:

```
? What transport layer do you use? GraphQL (code first)
? Would you like to generate CRUD entry points? Yes
```

這樣會自動在 `src/` 底下建立一個 `user` 的模塊，裡面包涵 `module`, `resolver`, `service`, `dto`, 以及 `entities`，並在 `app.module.app` 自動引入 `UserModule`，nest cli 就是這麼便利！

## Start Server
我們透過 `npm run start:dev` 就可以順利啟動服務，同時會發現自動產出一份 `schema.gql` 在根目錄。會看到裡面已經有 `Query`, `Mutation` 以及相關 input, output, field 的型態，這是因為我們在 generate resource 時選擇自動生成 CRUD，因此在 `src/user.resolver.ts` 裡有自動產出的 CRUD 行為及相關的 dto。是不是覺得 NestJS 真便利！尤其是對於 GraphQL 相較於 RESTful 學習曲線較高的服務。

## Next up
接下來會針對 User 設計簡單的 schema 以及 orm 串接。

---
<iframe src="https://open.spotify.com/embed/track/5RUyydoOehsN25zxdAppvs?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>