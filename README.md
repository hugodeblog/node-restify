# Node.jsでRestifyを使ってAPIサーバー構築

RestifyはRestfulなWEBサービスを構築するためのフレームワーク。Expressとは違ってViewの管理とかまで含んでおらず、REST APIサービスを作るのに適した軽量なフレームワークだ。

今回はRestifyの使い方の勉強をかねて、簡単なユーザー認証をするサーバーを作る。ユーザー認証といっても、説明を簡易にするため、DBは使わない。また、細かいセキュリティ周りは気にしないで、あくまでもRestifyの基本的な使い方の流れまでとなっている。

実用的にするには何かしらのDBと連携させたり、セキュリティを良く考慮して実装する必要があるだろう。

https://sequelize.org/ - Sequelize ORM

## 実行手順

サーバーを起動させる。

```txt
$ npm run start

> node-restify@1.0.0 start
> node ./user-server.mjs

Rest-API-Test listening at http://127.0.0.1:4000
```

これで4000番ポートでサーバーが待ち受け状態となるので、
別のコンソールを開いて、curlコマンド等を使って動作を見る。

```txt
$ curl -i -X POST -H "Content-Type: application/json" \
> --user "test:password" \
> -d '{"username":"me", "password":"me123"}' \
> http://localhost:4000/password-check
HTTP/1.1 200 OK
Server: Rest-API-Test
Content-Type: application/json
Content-Length: 50
Date: Fri, 11 Dec 2020 14:05:06 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"user":"me","password":"me123","auth_check":"OK"}
```
