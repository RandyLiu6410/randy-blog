---
sidebar_position: 10
id: graphql-apollo-cache
title: GraphQL Cache - Apollo Client
tags: [GraphQL, Cache]
enableComments: true
---

# 如何在 GraphQL 做到 Cache - Apollo Client 的 Cache 機制

## 一般的 Cache
我們會透過 Server 回傳的 `Cache Control` 去做到不同的 Cache 機制，不管是設定 `max-age`, `Last-Modified`, `Etag`等，同時運用你的 Request Url 去做到 HTTP Cache, Memory Cache, Disk Cache 的識別，但在 GraphQL 並不容易用這種常見的方式做到 Cache。

跟到這邊的朋友應該都發現 GraphQL 只有一個 endpoint, e.x. `https://example.com/graphql`, 再透過 POST 這個 endpoint 以及 payload 的搭配告知 GraphQL server 你要做什麼操作，因此 HTTP Cache 的機制在這邊會失效。但也是有辦法可議做到 HTTP Cache，例如透過 `GET` 的方式與 GraphQL Server 溝通:

```
GET https://example.com/graphql?query=...&variables=....
```

但會有個問題是 GraphQL 是可以動態決定查詢的廣度、深度，因此這段 Request URL 會變得非常長，除了不易讀，還有可能會遇到瀏覽器、Proxy、Web Server 對於最大URL長度的限制，因此這並不是一個很好的方式。

但我們可以透過 GraphQL 的客戶端套件去幫我們管理 Cache: Apollo Client

## Apollo Client 的 Cache 機制

Apollo Client 是在客戶端可以引用來管理 GraphQL 請求的套件，目前透過官方以及社群維護已支援居多的框架以及 Mobile 框架，怎麼使用 Apollo Client 會在後面提到，今天專心講 Apollo Client 怎麼處理 Cache。

Apollo Client 會將你的請求結果存在 local, normalized, in-memory 的快取機制內 (InMemoryCache)，以下圖為例:

<img src="https://i.imgur.com/FlriLcu.png" loading="lazy" />

第一次查詢時發生 Cache Miss，因此向後問這筆資料的結果，但第二次查詢時就會 Cache Hit:

<img src="https://i.imgur.com/UzZPRe6.png" loading="lazy" />

因此連 Request 都不會送出！

### InMemoryCache

Apollo Client 的 InMemoryCache 將 data objects 存在 flat lookup table，並可以相互參考，例如一個回傳直是:

``` json
{
  "data": {
    "person": {
      "__typename": "Person",
      "id": "cGVvcGxlOjE=",
      "name": "Luke Skywalker",
      "homeworld": {
        "__typename": "Planet",
        "id": "cGxhbmV0czox",
        "name": "Tatooine"
      }
    }
  }
}
```

InMemoryCache 會將這兩個物件，分別是 id 為 `"cGVvcGxlOjE="` 的 Person 以及 id 為 `"cGxhbmV0czox"` 的 Planet，分別存成:

``` json
{
  "__typename": "Person",
  "id": "cGVvcGxlOjE=",
  "name": "Luke Skywalker",
  "homeworld": {
    "__ref": "Planet:cGxhbmV0czox"
  }
}
```

``` json
{
  "__typename": "Planet",
  "id": "cGxhbmV0czox",
  "name": "Tatooine"
}
```

透過 `__ref` 去參考該快取物件，並且 key 為 `__typename:id` 的格式。腦筋快的讀者會想到 GraphQL 是怎麼知道 `id` 的？

預設會透過 `id` 或 `_id` 去當作唯一識別鍵 (Cache ID)，但你也可以客製化你想要的 Cache ID:

```js
const cache = new InMemoryCache({
  typePolicies: {
    Product: {
      // In an inventory management system, products might be identified
      // by their UPC.
      // upc 為 Cache ID
      keyFields: ["upc"],
    },
    Person: {
      // In a user account system, the combination of a person's name AND email
      // address might uniquely identify them.
      // 透過 name, email 去組合成 Cache ID: 
      // Person:{"title":"Randy","email":"wert6410@gmail.com"}
      keyFields: ["name", "email"],
    },
    Book: {
      // If one of the keyFields is an object with fields of its own, you can
      // include those nested keyFields by using a nested array of strings:
      // 透過 title, author, 以及 author 的 name 去組合成 Cache ID: 
      // Book:{"title":"Fahrenheit 451","author":{"name":"Ray Bradbury"}}
      keyFields: ["title", "author", ["name"]],
    },
    AllProducts: {
      // Singleton types that have no identifying field can use an empty
      // array for their keyFields.
      keyFields: [],
    },
  },
});
```


並且可以透過 dev tool 去查看現在的快取 table:

<img src="https://i.imgur.com/OWdGxWz.jpg" loading="lazy" />

---
References:

- https://www.apollographql.com/docs/react/caching/overview
- https://www.apollographql.com/docs/react/caching/cache-configuration/#customizing-cache-ids
- https://blog.logrocket.com/http-caching-graphql/

---
<iframe src="https://open.spotify.com/embed/track/4PYzRKJF5qJUD2JAstC5p4?utm_source=generator&theme=0" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>