---
sidebar_position: 2
id: graphql-init-db
title: Init Database
tags: [GraphQL, NestJS, backend]
---

# 設置簡單的 SQLite 3 Database 串接至 GraphQL

## SQLite
顧名思義是個輕量的 SQL database, 並具備足夠完整的 SQL 特色及語法，也因為是輕量關連式資料庫，所以常被嵌入在服務內，減少訪問延遲。

## TypeORM
TypeORM 是可以運行在 Node.js, Browser 等平台上的 ORM 框架，可以與 TypeScript, JavaScript 一同使用，並支援 Active Record 及 Data Mapper 模式，讓與資料庫互動過程中增加更多彈性。

## Install Dependencies
在 NestJS 上要順利運用 TypeORM 的特性與 SQLite 3 互動，我們需要安裝相關套件:

``` bash
$ npm install --save @nestjs/typeorm typeorm sqlite3
```

## 設置 Config
我們在 `app.module.ts` 中引入 TypeOrmModule:

```
... ts
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ...
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sql',
      autoLoadEntities: true,
      synchronize: true,
    }),
    ...
  ],
  ...
})
export class AppModule {}
```

- type: database 類型, 可以選擇 mysql, postgres, sqlite等, 我們使用 sqlite
- database: database 名稱, sqlite 的特性是可以將 `.sql` 文檔當作是 database, 因此我們設定 `db.sql`
- autoLoadEntities: 自動加載 TypeORM 的 entities, 也就是資料庫與 Orm 的映射
- synchronize: 是否同步 entity 的 orm 映射, 設定為 `true` 後, entity 的更動會自動映射到 database table 的 schema

## 更新 TypeORM 屬性到 User entity
我們簡單設計 User 並在之前產出的 `src/user/entities/user.entity.ts`，並透過 `typeorm` 支援的 decorator 加註在屬性上:

``` ts
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
```

## 更新 DTO
在 `src/user/dto` 裡有我們 API 提供的 DTO, 並在裡面更新上新的屬性，同時我們可以利用 NestJS 的框架與 `class-validator` 的整合，可以在參數型態錯誤時自動且適當地回報正確的錯誤訊息，e.x.
``` json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": ["email must be an email"]
}
```

### 安裝 class-validator
``` bash
$ npm i --save class-validator class-transformer
```
並且在 `main.ts` 讓 NestJS app 使用 `ValidationPipe`:
``` ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(8080);
}
bootstrap();
```

因此更新後的 dto，我們新增了 phone (台灣地區) 及 email 的 validator:

`create-user.input.ts`
``` ts
import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsPhoneNumber } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field(() => String, { description: "User's first name" })
  firstName: string;

  @Field(() => String, { description: "User's last name" })
  lastName: string;

  @Field(() => String, { description: "User's phone" })
  @IsPhoneNumber('TW')
  phone: string;

  @Field(() => String, { description: "User's email" })
  @IsEmail()
  email: string;
}

```

`update-user.input.ts`
``` ts
import { IsEmail, IsPhoneNumber } from 'class-validator';
import { CreateUserInput } from './create-user.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field(() => Int)
  id: number;

  @Field(() => String, { description: "User's first name" })
  firstName: string;

  @Field(() => String, { description: "User's last name" })
  lastName: string;

  @Field(() => String, { description: "User's phone" })
  @IsPhoneNumber('TW')
  phone: string;

  @Field(() => String, { description: "User's email" })
  @IsEmail()
  email: string;
}

```

## 實現 ORM 互動
我們現在 DTO 已準備好，我們可以在 `service` 裡與 `Model, Repository` 互動了，首先我們需要在 `User Module` 的作用域內引入 `User` 的 Orm module, 這樣我們才可以在 `User Module` 內與 `User Entity` 互動:

在 `src/user/user.module.ts`
``` ts
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserResolver, UserService],
})
export class UserModule {}
```

因此我們可以實作 `src/user/user.service.ts` 裡的 `createUserInput`:

``` ts
...
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  create(createUserInput: CreateUserInput) {
    return this.usersRepository.save(createUserInput);
  }

  ...
}

```

## 測試
我們可以進到 `http://localhost:8080/graphql` 去打開 GraphQL Playground 試著與 API 互動，我們先試著創建一個 create user 的 mutation:

``` graphql
mutation createUser($createUserInput: CreateUserInput!) {
  createUser(createUserInput: $createUserInput) {
    id
    firstName
    lastName
    phone
    email
  }
}
```

並在 Query Variables 帶上 createUserInput，同時我們也可以試驗 `class-validator` 有無作用，試著輸入錯誤的 `phone` 以及 `email`:

``` json
{
  "createUserInput": {
    "firstName": "Randy",
    "lastName": "Liu",
    "phone": "1234",
    "email": "myemail@gmail"
  }
}
```

我們使用 Playground 打出去的 API 會回吐我們:
``` json
{
  "errors": [
    {
      "message": "Bad Request Exception",
      "locations": [
        {
          "line": 2,
          "column": 3
        }
      ],
      "path": [
        "createUser"
      ],
      "extensions": {
        "code": "BAD_REQUEST",
        "stacktrace": [...],
        "originalError": {
          "message": [
            "phone must be a valid phone number",
            "email must be an email"
          ],
          "error": "Bad Request",
          "statusCode": 400
        }
      }
    }
  ],
  "data": null
}
```

可以看到他有回吐我們錯誤訊息，並提示我們哪些值是錯誤的，那我們改成正確格式試試看:

``` json
{
  "createUserInput": {
    "firstName": "Randy",
    "lastName": "Liu",
    "phone": "0912456789",
    "email": "myemail@gmail.com"
  }
}
```

我們可以看到 GraphQL 回傳給我們的回應是:

``` json
{
  "data": {
    "createUser": {
      "id": 1,
      "firstName": "Randy",
      "lastName": "Liu",
      "phone": "0912456789",
      "email": "myemail@gmail.com"
    }
  }
}
```

同時檢查 database，確定寫入我們的第一筆資料！

<img src="https://i.imgur.com/1lTT97C.png" loading="lazy" />

恭喜我們接通了 GraphQL 及 SQLite，並在中借助 TypeORM 讓我們輕鬆並彈性的在建立 `User` 介面時同時創建 `ORM Entity`, 以及 NestJS 的 `ValidationPipe` 與 `class-validator` 協助我們自動化生成參數型態的錯誤訊息，讓我們減去許多麻煩！

---
<iframe src="https://open.spotify.com/embed/track/7hhmf0Ccj8aM8lSorLgmKQ?utm_source=generator&theme=0" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>