---
sidebar_position: 11
id: graphql-react
title: React 導入 GraphQL
tags: [GraphQL, React]
enableComments: true
---

# 使用 React 導入 GraphQL 
在前端與 GraphQL 溝通的方式有幾種，在這篇文章會一一介紹。而前端的框架會使用 React + TypeScript，首先我們先透過 vite 去起一個 React 專案:

``` bash
$ npm create vite@latest client --template react-ts
```
後續配置
```
Need to install the following packages:
create-vite@5.1.0
Ok to proceed? (y) y
✔ Select a framework: › React
✔ Select a variant: › TypeScript
```

其他配置參考: https://cn.vitejs.dev/guide/

接下來就把 `client` 專案裡不相關的雜魚清一清:

```
.
├── README.md
├── index.html
├── package-lock.json
├── package.json
├── public
│   └── vite.svg
├── src
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

`App.tsx`

``` ts
function App() {
  return <></>;
}

export default App;

```

## 畫面架設
我們透過 GraphQL 設計了 `User` 與 `Comment`，我們就簡單設計一個可以留言的 App，我直接使用 [Antd](https://ant.design/) 當作 UI library:

畫面大概有兩個:

1. 登入 (選擇使用者)

<img src="https://i.imgur.com/ZT64GIm.png" loading="lazy" />

2. 留言畫面

<img src="https://i.imgur.com/e1tMjlD.png" loading="lazy" />

## 串接 API
### 透過 fetch

我們可以直接透過 Web API - fetch 去將 query 轉換成 `string` 放進 `body` 後直接 `POST` 到 GraphQL Gateway:

``` ts
const ENDPOINT = "http://localhost:8000/graphql";

export const getUsers = async (): Promise<Array<User>> => {
  const query = `
    query {
        users {
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
        createdAt
        updatedAt
        }
    }
    `;

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ query }),
  });

  return await res.json();
};
```

若是 `mutation` 的話可以這樣寫，將參數帶入 body:

``` ts
export const addComment = async (value: CreateCommentInput) => {
  const mutation = `
  mutation createComment($createCommentInput: CreateCommentInput!) {
    createComment(createCommentInput: $createCommentInput) {
      id
      creatorId
      content
    }
  }
`;

  const variables = {
    createCommentInput: value,
  };

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ query: mutation, variables }),
  });

  return await res.json();
};
```

這樣就可以很簡單跟 GraphQL 溝通，不過上一篇我們有小介紹到 Apollo Client，這是個讓你更方便可以與 GraphQL Server 溝通的 library，除了管控 Cache 以外，也提供許多 hooks 以及 HOC 的整合方式，在下一篇我會開始接觸到 Apollo Client 的整合 React 方式。

---
[Source Code](https://github.com/RandyLiu6410/nestjs-graphql-sandbox)

---
<iframe src="https://open.spotify.com/embed/track/2Xdz0ZUPA71YcRwd4WBiGI?utm_source=generator&theme=0" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>