---
title: "【Hugo】.Scratch とは？"
date: 2020-03-14T12:00:00+09:00
lastmod: 2020-05-23T12:00:00+09:00
categories: [プログラミング, サイト構築]
tags: [サイト構築, Hugo]
draft: false
---

{{% tooltip %}}Hugo((本ブログで使用している静的サイトジェネレータ<br>[公式サイト](https://gohugo.io){{% /tooltip %}}  
のテンプレート文を眺めていると、

結構な頻度で[`.Scratch`](https://gohugo.io/functions/scratch/)というものがでてきます。

この`.Scratch`が果たしている役割についてお話したいと思います。

<!--more-->

<br>

## スコープ問題

Hugo で変数を定義するとき、その変数の
{{% tooltip %}}スコープ((変数を参照できる範囲{{% /tooltip %}}
は関数を超えることはできません。

例えば、[次のような例](https://github.com/golang/go/issues/10608)（原文ママ）があります。

```go-text-template {linenos=false}
{{ $v := "init" }}
{{ if true }}
    {{ $v := "changed" }}
{{ end }}
v: {{ $v }} {{/* => init */}}
```

`.Scratch`は、このような事態を解消するために用いられます。

関数内部から外部で定義された関数を参照することはできますが、逆はできません。

```go-html-template {linenos=false}
{{ $v := "init" }}
v: {{ $v }}
{{ range seq 0 1 }}
    before: {{ $v }}
    {{ $v := "changed" }}
    after: {{ $v }}
{{ end }}
v: {{ $v }}
　
-> v: init
before: init
after: changed
before: init
after: changed
v: init
```

関数内部の変数`$v`を`.Scratch`を使って関数外部に運ぶということですね。

逆に、外の変数を中に運ぶために`.Scratch`を使う必要はありません。

`.Scratch`の実際のスコープは「ページ単位」「ショートコード単位」だそうです。

<br>

## `.Scratch`の使い方

スクラッチはキーと値のペアからなるディクショナリ（辞書・マップ）のような構造をとります。

### `.Set`

スクラッチを作るには、`.Scratch.Set`を使います。

```go-html-template {linenos=false}
{{ .Scratch.Set "key" "value" }}
```

すでに指定したキーに対応する値があった場合、上書きをします。

```go-html-template {linenos=false}
{{ .Scratch.Set "key" "value" }}
{{ .Scratch.Set "key" "newvalue" }}
{{ .Scratch.Get "key" }} -> newvalue
```

### `.Get`

値を呼び出すには次のようにします。

```go-html-template {linenos=false}
{{ .Scratch.Get "key" }} -> value
```

### `.Add`

`.Add`は、与えられたキーに対応する値に、指定された値をプラスします。

golang で対応している + 演算子の使い方は使えるようです。

数値の加算、文字列の結合、リストの結合などができます。

```go-html-template {linenos=false}
{{ .Scratch.Add "key" "added" }}
{{ .Scratch.Get "key" }} -> valueadded
```

`.Set`の代わりに使ってもエラーになったりはしませんが、上書きはしません。

### `.SetInMap`

`.SetInMap`というものもあって、これはマップをスクラッチの値にとって管理したいときに便利そうですね。

次の例は[公式のもの](https://gohugo.io/functions/scratch/#setinmap)がもと。

```go-html-template {linenos=false}
{{ .Scratch.SetInMap "greetings" "english" "Hello" }}
--何か処理--
{{ .Scratch.SetInMap "greetings" "french" "Bonjour" }}
{{ .Scratch.Get "greetings" }} -> map[french:Bonjour english:Hello]
```

`.SetInMap`は Set という名前ですが Add 的な側面がある（上書きしない）ようです。

`.SetInMap`を使わなければ次のようになるでしょう。

```go-html-template {linenos=false}
{{ .Scratch.Set "greetings" (dict "english" "Hello") }}
--何か処理--
{{ .Scratch.Set "greetings" (merge (.Scratch.Get "greetings") (dict "french" "Bonjour")) }}
{{ .Scratch.Get "greetings" }} -> map[french:Bonjour english:Hello]
```

### `.GetSortedMapValues`

マップから値のみを取り出した配列を返します。この例も公式のがもとです。

```go-html-template {linenos=false}
{{ .Scratch.SetInMap "greetings" "english" "Hello" }}
{{ .Scratch.SetInMap "greetings" "french" "Bonjour" }}
{{ .Scratch.GetSortedMapValues "greetings" }} -> [Hello Bonjour]
```

使わなければこんな感じ。

```go-html-template {linenos=false}
{{ .Scratch.SetInMap "greetings" "english" "Hello" }}
{{ .Scratch.SetInMap "greetings" "french" "Bonjour" }}
{{ $greetings := .Scratch.Get "greetings" }}
{{ slice (index $greetings "english") ((index $greetings "french")) }}
    -> [Hello Bonjour]
```

### `.Delete`

スクラッチを削除します。

```go-html-template {linenos=false}
{{ .Scratch.Delete "key" }}
{{ .Scratch.Get "key" }} -> 
```

{{< relpos hugo-shortcode >}}

<br>

## ローカルスコープの`newScratch`

Hugo 0.43 からは、[`newScratch`](https://gohugo.io/functions/scratch/#get-a-scratch)によってローカルスコープのスクラッチを作ることができます。

`.Scratch`はファイル間を行き来できるのですが、こちらはそのようなことができません。

ただし`if`や`range`などの関数の内外を行き来することはできます。

名前衝突による上書きを避ける目的で私は積極的に使っています。

```go-html-template {linenos=false}
{{ $scr := newScratch }}
{{ $scr.Set "a" "b" }}
{{ if true }}
    {{ $scr.Add "a" "aa" }}
{{ end }}
{{ $scr.Get "a" }} -> baa
```

さきほど問題になっていたコードは、スクラッチによってこのように解決されます。

```go-html-template {linenos=false}
{{ $scr := newScratch }}
{{ $scr.Set "v" "init" }}
{{ if true }}
    {{ $scr.Set "v" "changed" }}
{{ end }}
{{ $scr.Get "v" }} -> changed
```

<br>

## `with`や`range`と併用する際の注意点

`newScratch`の場合は問題にならないのですが、

`.Scratch`を`with`や`range`の中で使うときには先頭に`$`が必要になります。

これは、`with A`や`range A`と書いたブロックの中での`.`は`A`や`A.`という意味に捉えられるからです。

```go-html-template {linenos=false, hl_lines=[3]}
{{ .Scratch.Set "v" "init" }}
{{ with .Scratch.Get "v" }}
    {{ . }}
{{ end }}
    -> init
```

```go-html-template {linenos=false, hl_lines=[3]}
{{ .Scratch.Set "v" "init" }}
{{ with .Scratch.Get "v" }}
    {{ .Scratch.Set "v" "changed" }}
{{ end }}
    -> ERROR: can't evaluate field Scratch in type string
```

先頭に`$`をつければこれが回避できます。

```go-html-template {linenos=false, hl_lines=[3]}
{{ .Scratch.Set "v" "init" }}
{{ with .Scratch.Get "v" }}
    {{ $.Scratch.Set "v" "changed" }}
{{ end }}
{{ .Scratch.Get "v" }} -> changed
```

{{< relpos hugo-findre-replacere >}}

---

プログラミングをやっていると、予期せぬ動きをしたりすることが多々ありますが、

変数のスコープ問題がその気づきにくい原因であることも多くあります。

Hugo の場合これはスクラッチによって解決できます。

使えるととても便利なので、ぜひ使ってみてください。

この記事がお役に立てたならうれしいです。

読んでくださりありがとうございました。:wave: