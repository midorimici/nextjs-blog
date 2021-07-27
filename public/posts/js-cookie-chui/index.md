---
title: '【JavaScript】Cookie の設定がうまくいかない？'
date: 2020-07-22T12:00:00+09:00
lastmod: 2020-07-22T12:00:00+09:00
categories: [プログラミング, プログラミング一般]
tags: [JavaScript/TypeScript]
draft: false
---

JavaScript では Cookie を扱うことができます。

Cookie はブラウザが保持できる文字列のことで、

これを使うことで、ユーザがページを再読み込みしたりブラウザから離れたりしてもデータを保持させることができます。

<!--more-->

JavaScript で Cookie を扱う方法について、基本的なことはこちらに書かれています。

→ [Cookies(クッキー), document.cookie](https://ja.javascript.info/cookie)

ただし、なぜか Cookie の設定がうまくいかないことがあります。

<br>

## 一度に２つ以上の値を設定できない

異なるキー:値のペアを２つ以上同時に登録することはできません。

複数指定された場合、最初のペアのみ登録されます。

```js
// *NG
document.cookie = 'name=Mike; age=5; color=3';
console.log(document.cookie);
// -> "name=Mike"

// OK
document.cookie = 'name=Mike';
document.cookie = 'age=5';
document.cookie = 'color=3';
console.log(document.cookie);
// -> "name=Mike; age=5; color=3"
```

え？ドキュメントに次のような例があるじゃないか！

複数登録してるじゃないか！

```js
document.cookie = 'user=John; path=/; expires=Tue, 19 Jan 2038 03:14:07 GMT';
```

これは`path`と`expires`が特殊なオプションだからです。

特殊なオプションは同時に登録する必要があり、

別のところで登録することができません。

<br>

## オプションは別のところで登録できない

そうか、２つ以上を同時に登録できないんだな。

じゃあオプションもあらかじめ登録しておくとか後から登録するとかなんだな。

```js
// *NG
document.cookie = 'name=Mike';
document.cookie = 'age=5';
document.cookie = 'color=3';

document.cookie = 'max-age=3600';
document.cookie = 'secure';
console.log(document.cookie);
// -> "name=Mike; age=5; color=3; max-age=3600; secure"
```

`document.cookie`もいい感じじゃない？

と思ったら、これは適用されません。

`max-age`や`secure`は、その名前を持った、オプションとは別の値を指すと解釈されてしまいます。

デベロッパーツールを使って Cookie がどうなっているのか確認してみると、下のようになります。

{{< img src=invalid-expire-secure alt="Cookie 期限とsecureが設定されていない" >}}

`Expires / Max-Age`のところはすべて`Session`（ブラウザが閉じると終了）となっていて、`Secure`もすべて空欄です。

これでは Cookie の有効期限が反映されず、ブラウザが閉じると終了してしまいます。

これが正しく設定されていると、`Session`の代わりに日付が書かれ、`Secure`の欄にチェックマークがつきます。

<br>

## オプションは値ごとに登録する

この表を見ると気づくのですが、オプションは Cookie 全体に対して適用されるわけではなく、

Cookie の値ひとつひとつに対して適用されるようです。

正しい設定の仕方としては、次のようになります。

```js
// OK
document.cookie = 'name=Mike; max-age=3600; secure';
document.cookie = 'age=5; max-age=3600; secure';
document.cookie = 'color=3; max-age=3600; secure';
console.log(document.cookie);
// -> "name=Mike; age=5; color=3"
```

（`localhost`の場合は HTTPS ではないので、Cookie は登録されませんが、

デプロイすると登録されるようになります。）

以下は[ドキュメントのページ](https://ja.javascript.info/cookie)の Cookie ですが、

`Expires / Max-Age`や`Secure`などのオプションが正しく設定されています。

{{< img src=valid-expire-secure alt="Cookie 期限とsecureが正しく設定されている場合" >}}

<br>

## Cookie の調べ方

コンソールに`document.cookie`と打つことでも値を取得することはできますが、

オプションが正しく設定されているかどうかは確認できません。

より明確な情報を知るためには、

デベロッパーツールから Cookie の状態を調べます。

### Chrome の場合

まず右クリックや F12 キーからデベロッパーツールを開きます。

次に`Application`のタブ（ない場合は`>>`から開けます）を開き、

Cookies から目的の Cookie を開けば内容を見る事ができます。

{{< img src=chrome-cookie alt="Chrome Cookie" >}}

### Firefox の場合

まず右クリックや F12 キーからデベロッパーツールを開きます。

次に`ストレージ`のタブ（ない場合は`>>`から開けます）を開き、

Cookie から目的の Cookie を開けば内容を見る事ができます。

{{< img src=firefox-cookie alt="Firefox Cookie" >}}

---

参考になれば幸いです。

ではまた:wave: