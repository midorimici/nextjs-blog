---
title: "【Rails API】CSRF 対策をあきらめないでちゃんとやる"
date: 2021-05-16T12:00:00+09:00
lastmod: 2021-05-16T12:00:00+09:00
categories: [プログラミング, Web アプリ]
tags: [プログラミング, アプリ開発]
draft: false
---

Ruby on Rails を API として、フロントエンドとの間で通信をしようとしたところ、

セッションが保存されなかったり、`Can't verify CSRF token authenticity` というエラーが出てくることがあります。

多くのページでは解決方法として CSRF 対策をあきらめていますが、

<!--more-->

ここでは**ちゃんとしたセキュアな**解消方法について書いていきます。

<br>

## エラーも出ないがセッションが保存されないとき

[この記事](https://qiita.com/take_webengineer/items/ddaf21366b68008ada3d)にもあるように、CSRF という攻撃からサイトを守るために、

Rails はリクエストが不正でないか確認できないとセッションを空にしてしまいます。

エラーも出ないのでわかりづらいですが、

`application_controller.rb` に `protect_from_forgery with: :exception` を記述すると

`Can't verify CSRF token authenticity` エラーを出すようになります。

Rails は問題のないリクエストであることを確認するために CSRF Token というパスワードのようなものを使用するのですが、それがきちんと確認できないというエラーです。

<br>

## CSRF とは

Cross Site Request Forgery のことで、ざっくり言うと、

認証後にセッションがある場合に他のサイトから他人が変なリクエストを送ってきて、

そのリクエストに応じて本人が知らないうちにデータが削除されたり変更されたりするという攻撃です。

Rails の場合、クライアントとの間で CSRF Token をやりとりして安全性を確認しています。

Rails 側で View も一緒に作る場合、このへんは特に意識しなくても Rails がよしなにやってくれるのですが、

**Rails を API として使用する場合は自前で設定をする必要があります**。

<br>

## CSRF Token の設定

[こちら](https://kappaz.hatenablog.com/entry/2020/08/17/141127)を参考にしました。

### Rails 側

まず API モードだと CSRF 用の機能が含まれていないらしく、`application_controller.rb` に `include ActionController::RequestForgeryProtection` を追加する必要があるそうです。

API モードでなければこの工程は不要です。

<br>

次に CSRF Token を生成して、レスポンスヘッダに設定します。

```ruby {name="application_controller.rb"}
class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  ...
  def set_csrf_token_header
    response.set_header('X-CSRF-Token', form_authenticity_token)
  end
end
```

`response.set_header` がレスポンスヘッダに引数をキー：値のペアを設定するメソッドで、

`form_authenticity_token` が CSRF Token を生成するメソッドです。

この `set_csrf_token_header` メソッドを使いたいコントローラで `after_action :set_csrf_token_header` とすれば、

レスポンスヘッダとしてクライアント側に送られます。

<br>

また、クライアント側とドメインが異なる場合、クロスオリジンの検証を無効にする必要があります。

```ruby {name="config/application.rb", hl_lines=[4]}
...
  class Application < Rails::Application
    ...
    config.action_controller.forgery_protection_origin_check = false
  end
...
```

そして CORS の設定で `X-CSRF-Token` ヘッダを expose します。

[`rack-cors`](https://github.com/cyu/rack-cors) の場合は次のようになります。

```ruby {name="config/initializers/cors.rb", hl_lines=[8]}
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'http://localhost:3000', 'https://frontend.url'

    resource '*',
             headers: :any,
             methods: %i[get post put patch delete options head],
             expose: ['X-CSRF-Token'],
             credentials: true
  end
end
```


### クライアント側

POST リクエストなどをする前にヘッダに Rails 側から取得した Token を設定する必要があります。

Axios の場合、

```js {hl_lines=[4]}
...
.then(res =>
  ...
  axios.defaults.headers.common['X-CSRF-Token'] = res.headers['x-csrf-token'];
)
...
```

のようになります。

<br>

## Cookie の SameSite 属性

Cookie の SameSite 属性によっても CSRF 対策がなされています。

デフォルトでは Lax に設定されていますが、

これはクロスオリジンの場合 GET リクエストしか許可しないので、None に設定する必要があります。

SameSite を None にしたときには Secure を True にする必要があるので、設定は次のようになります。

```ruby {name="config/initializers/session_store.rb", hl_lines=["4-5"]}
if Rails.env == 'production'
  Rails.application.config.session_store :cookie_store, key: '_api-key',
                                                        domain: 'backend.url',
                                                        same_site: :none,
                                                        secure: true
else
  Rails.application.config.session_store :cookie_store, key: '_api-key'
end
```

これによってセッションがうまく登録されなかった場合にも、たとえ Token が完全一致していたとしても、

依然として `Can't verify CSRF token authenticity` エラーを出すので非常にわかりづらいですが、

開発者ツールの Cookie の欄を見るとちゃんと警告が出ていたりします。

<br>

## 他のよくある解決策…

`Can't verify CSRF token authenticity` で調べたときによく出てくる解決策です。

### `protect_from_forgery with: :null_session`

Token が確認できないときにセッションを空にします。

セッションが必要ない場合はこれでも大丈夫なのですが、セッションが必要なときには全く役に立ちません。

### `skip_before_action :verify_authenticity_token`

これは Token による CSRF 対策を放棄するということです。

CSRF 対策の方法は他にもあり、そちらをしっかりやるということであれば大丈夫なのですが、

エラーを解消するためだけに訳もわからずに使うのは諸刃の剣かと思います。

---

お役に立てれば幸いです。

ではまた:wave: