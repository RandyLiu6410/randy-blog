---
sidebar_position: 1
id: graphql-intro
title: Intro
tags: [GraphQL, backend]
---

# GraphQL Introduction

GraphQL 為 Facebook 開發的 API 查詢語言，達到更彈性地查詢資料，減少多餘的數據需求及數據傳輸，相較於傳統的 RESTful API 針對不同行為提供多端點，GraphQL 可以只提供單一端點並根據帶進端點的 GET query params / POST body 內定義的不同查詢行為及查詢內容提供彈性地回應。

舉以拿取單一用戶資訊的查詢為例:

**RESTful API**

Request:
```
Request URL: https://example.com/user/1
Request Method: GET
```

Response:
``` json
{
    "id": 1,
    "name": "Randy",
    "gender": "Male",
    "nationality": "Taiwan"
}
```

**GraphQL**

Request:
```
Request URL: https://example.com
Request Method: POST
```
Request body:
```
query {
    user (id: 1) {
        id
        name
        gender
        nationality
    }
}
```

Response:
``` json
{
    "user": {
        "id": 1,
        "name": "Randy",
        "gender": "Male",
        "nationality": "Taiwan"
    }
}
```

若今天我們不想要回傳 `gender`, `nationality`，在 RESTful API 我們在不動後端API開發邏輯的情況下我們只能無情地接受一整包 user data 的回傳，然後在 GraphQL 我們可以在送請求時定義我們想收到的資料

Request:
```
Request URL: https://example.com
Request Method: POST
```
Request body:
```
query {
    user (id: 1) {
        id
        name
    }
}
```

Response:
``` json
{
    "user": {
        "id": 1,
        "name": "Randy"
    }
}
```

這樣無疑地是大幅增加 API 的彈性, 同時我們在後端可以依照不同需求開出不同的 field，送需求時可以決定要不要 query 這個 field, 以及這個 field 裡的哪些屬性。
```
query {
    user (id: 1) {
        id
        name
        posts { // -> 後端在 Resolver 多開 posts field, 並去拉取該 user 的 posts data
            title
        }
    }
}
```

GraphQL 可帶來的好處包含:

1. 減少 Overfetching/Underfetching: 意思是過度的送數據需求，或是需求回傳的資訊不足，再進而送更多需求
2. 彈性並精準地拉取資料: 後端只需要開出相關的 fields, 前端去控制拿到的資料格式

劇透更多的優點:

3. 強大的類型系統: GraphQL 在資料型態上有嚴格的把關，當參數或回傳型態錯誤會提供適當的錯誤回報，減少錯誤發生的可能性
4. 資料訂閱功能: 原生支援 subscription，做到資料的 pub/sub，減少前後端開發時間
5. GraphQL Gateway: 在單一端點提供多個 microservice 的 GraphQL，進而達到 loose coupling
6. Schema Registry: 組合多服務間的 subgraph，增加協作及管理彈性

接下來我會用一個簡單的系統實作 GraphQL，實現以上的前後端及微服務整合上的優點。

---
<iframe src="https://open.spotify.com/embed/track/7tLTxOJY6cjQz4aJYMs8Nu?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>