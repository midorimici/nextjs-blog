---
title: "【Hugo】findRE・replaceRE の使い方"
date: 2020-04-12T12:00:00+09:00
lastmod: 2020-05-18T12:00:00+09:00
categories: [プログラミング, サイト構築]
tags: [サイト構築, Hugo]
draft: false
---

<p>
今回は、
{{% tooltip %}}Hugo((本ブログで使用している静的サイトジェネレータ<br>[公式サイト](https://gohugo.io){{% /tooltip %}}
で記事のマークダウンファイルや HTML 内の特定の内容を探し出したり書き換えたりするのに便利な
</p>

[`findRE`](https://gohugo.io/functions/findre/)と[`replaceRE`](https://gohugo.io/functions/replacere/)についてご紹介したいと思います。

<br>

## 正規表現を使って探索・置換するための関数

この2つの関数の語尾についている RE というのは Regular Expression（正規表現）のことです。

<!--more-->

正規表現とは、特定のパターンを満たす文字列を表現する方法です。

例えば、特定のアルファベット一文字の後ろに2桁までの数字が続くようなパターン（`h2`, `u11`）とか、

特定の文字列で挟まれたパターン（`<div>foo</div>`）とかを探したいときに使用します。

<br>

## findRE の使い方

指定された範囲の中で、指定された正規表現にマッチする部分のリストを返します。

次のように書きます。

```txt {linenos=false}
findRE (正規表現のパターン) (入力) [(最初から何番目までを返すか)]
```

### 例

例えば、

```go-html-template {linenos=false}
{{ findRE `a(.*?)e` `abcde apple je m'appelle apfel` }}

-> [abcde,
    apple,
    appe,
    apfe]
```

となります。

また、`$input`の中身が次のものだったとして、

```html
<div>
    <h2 class="omidashi">大見出し１</h2>
    <p>いろはにほへと</p>
    <p>ちりぬるを</p>
    <h3 class="komidashi" id="#小見出し１">小見出し１</h3>
    <p>わかよたれそ</p>
    <p>つねならむ</p>
    <h2 class="omidashi">大見出し２</h2>
    <h3 class="komidashi" id="#小見出し２">小見出し２</h3>
    <p>ういのおくやま</p>
    <p>けふこえて</p>
    <h3 class="komidashi" id="#小見出し３">小見出し３</h3>
    <p>あさきゆめみし</p>
    <p>えひもせす</p>
</div>
```

この中から`h3`タグで挟まれている部分だけ取り出したいときは次のようになります。

```go-html-template {linenos=false}
{{ findRE `<h3.*?>(.|\n)*?</h3>` $input }}
　
-> [<h3 class="komidashi" id="#小見出し１">小見出し１</h3>,
    <h3 class="komidashi" id="#小見出し２">小見出し２</h3>,
    <h3 class="komidashi" id="#小見出し３">小見出し３</h3>]
```

`h3`タグ直後の`p`タグを取り出したい場合は次のようになります。

```go-html-template {linenos=false}
{{ findRE `</h3>( |\n)*?<p>(.|\n)*?</p>` $input }}
　
-> [</h3>
    <p>わかよたれそ</p>,
    </h3>
    <p>ういのおくやま</p>,
    </h3>
    <p>あさきゆめみし</p>]
```

また、第三引数を指定することで、その個数分だけ取り出します。

```go-html-template {linenos=false}
{{ findRE `</h3>( |\n)*?<p>(.|\n)*?</p>` $input 1 }}
　
-> [</h3>
    <p>わかよたれそ</p>]
```

### 注意点

**返ってくる値はリスト**なので、ひとつひとつの要素を扱いたい場合には[`index`](https://gohugo.io/functions/index-function/)か[`range`](https://gohugo.io/functions/range/)を使うことになります。

正規表現のマッチがひとつしかない場合も

`index (findRE ...) 0`とする必要があります。

ただし、存在するかしないかで条件分岐するだけなら、空のリストは`false`となるため、

`if findRE ...`とそのまま書いても判定できます。

{{< relpos hugo-printf >}}

<br>

## replaceRE の使い方

指定された文字列の、指定された正規表現のパターンに該当する部分を、指定されたものに置き換えたあとのものを返します。

次のように書きます。

```txt {linenos=false}
replaceRE (正規表現のパターン) (置換先) (入力)
または
(入力) | replaceRE (正規表現のパターン) (置換先)
```

置換先に`$1`のように書くと、正規表現でマッチしたグループを表現できます。

`$1`なら1グループ目、`$2`なら2グループ目、`$0`ならマッチした部分全体です。

### 例

例えば、

```go-html-template {linenos=false}
{{ replaceRE `a(.*?)e` `a-e` `abcde apple je m'appelle apfel` }}
　
-> a-e a-e je m'a-elle a-el
　
{{ replaceRE `a(.*?)e` `$1` `abcde apple je m'appelle apfel` }}
　
-> bcd ppl je m'pplle pfl
```

となります。

また、`$input`の中身が次のものだったとすれば、

```html
<div>
    <h2 class="omidashi">大見出し１</h2>
    <p>いろはにほへと</p>
    <p>ちりぬるを</p>
    <h3>小見出し１</h3>
    <p>わかよたれそ</p>
    <p>つねならむ</p>
    <h2 class="omidashi">大見出し２</h2>
    <h3>小見出し２</h3>
    <p>ういのおくやま</p>
    <p>けふこえて</p>
    <h3>小見出し３</h3>
    <p>あさきゆめみし</p>
    <p>えひもせす</p>
</div>
```

```go-html-template {linenos=false, hl_lines=[8, 12, 15], inline_hl=[0:["2-7"], 1:["2-7"], 2:["2-7"]]}
{{ replaceRE `<h3>(.*?)</h3>` `<h3 class="komidashi" id="#$1">$1</h3>` $input }}
　
->
<div>
    <h2 class="omidashi">大見出し１</h2>
    <p>いろはにほへと</p>
    <p>ちりぬるを</p>
    <h3 class="komidashi" id="#小見出し１">小見出し１</h3>
    <p>わかよたれそ</p>
    <p>つねならむ</p>
    <h2 class="omidashi">大見出し２</h2>
    <h3 class="komidashi" id="#小見出し２">小見出し２</h3>
    <p>ういのおくやま</p>
    <p>けふこえて</p>
    <h3 class="komidashi" id="#小見出し３">小見出し３</h3>
    <p>あさきゆめみし</p>
    <p>えひもせす</p>
</div>
```

となります。

### 注意点

正規表現のパターンに該当する部分が置き換わるだけであり、

入力文全体が置き換わるわけではありません。

例えばさきほどの`findRE`の`$input`の例で、

`h3`タグ直後の`p`タグの内容を取得しようとして、

```go-html-template {linenos=false}
{{ $pattern := `</h3>(?: |\n)*?<p>((?:.|\n)*?)</p>` }}
{{ $find := findRE $pattern $input }}
{{ range $find }}
    {{ . | replaceRE $pattern `$1` }}
{{ end }}
```

とすれば

```txt {linenos=false}
わかよたれそ
ういのおくやま
あさきゆめみし
```

と、うまく取得できます。

しかし、

```go-html-template {linenos=false, hl_lines=[4], inline_hl=[0:[8]]}
{{ $pattern := `</h3>(?: |\n)*?<p>((?:.|\n)*?)</p>` }}
{{ $find := findRE $pattern $input }}
{{ range $find }}
    {{ . | replaceRE `<p>((?:.|\n)*?)</p>` `$1` }}
{{ end }}
```

とすれば

```txt {linenos=false}
</h3>
わかよたれそ
</h3>
ういのおくやま
</h3>
あさきゆめみし
```

というふうに、`</h3>`を残してしまいます。

割とはまりがちな上に気づきにくいので気をつけたいところです…。

なお、正規表現を使う必要がないなら、[`replace`](https://gohugo.io/functions/replace/)を使うこともできます。

{{< relpos hugo-scratch >}}

---

Hugo のテンプレートを使って書き換えを行う時には必ずと言っていいほど頻繁に使う関数なので、

ぜひ覚えておいてください。

この記事がお役に立てたならうれしいです。

それでは:wave: