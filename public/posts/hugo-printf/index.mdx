---
title: "【Hugo】print・printf の使い方"
date: 2020-05-17T12:00:00+09:00
lastmod: 2020-05-17T12:00:00+09:00
categories: [プログラミング, サイト構築]
tags: [サイト構築, Hugo]
draft: false
---


<p>
{{% tooltip %}}Hugo((本ブログで使用している静的サイトジェネレータ<br>[公式サイト](https://gohugo.io){{% /tooltip %}}
のテンプレート文にたびたび出現する<code>print</code>関数と<code>printf</code>関数について、
</p>

その使い方を詳しく解説していきます。

<br>

## `print`関数の使い方

`print`関数は、与えられた引数をそのまま返します。

<!--more-->

次のように書きます。

```go-html-template {linenos=false}
print (入力)
```

以下は使用例です。

```go-html-template {linenos=false}
{{ print `foo` }}           -> foo
{{ print `foo` `bar` }}     -> foobar
{{ print (slice 1 2 3) }}   -> [1 2 3]
{{ print (dict `a` 2 `b` 4) }}  -> map[a:2 b:4]
```

変数を使うこともできます。

```go-html-template {linenos=false}
{{ $x := `foo` }}
{{ print $x }}

-> foo

{{ $x := `foo` }}
{{ $y := 3 }}
{{ print $x `+` $y }}

-> foo+3
```

単体で用いることでデバッグなどに使うこともできますが、

基本的には変数に代入することで使いまわしをすることが多いです。

```go-html-template {linenos=false}
{{ $dirname := `static` }}
{{ $filename := `image` }}
{{ $extention := `jpg` }}
{{ $path := print $dirname `/` $filename `.` $extention }}

-> static/image.jpg
```

この例では`print`関数が引数を５つも取っていて、可読性に乏しいため、

このような場面には後述する`printf`関数のほうが適しています。

{{< relpos hugo-scratch >}}

<br>

## `printf`関数の使い方

こちらは文字列をフォーマットして出力します。

書き方は次の通り。

```go-html-template {linenos=false}
printf (フォーマット) (入力)
```

申し訳ないことに、フォーマットとは何かを言葉で説明する能力がないので、

例を見てなんとなく理解していただければと思います…。

例えば次のように書きます。

```go-html-template {linenos=false}
{{ printf `My favorite color is %s.` `green` }}

-> My favorite color is green.
```

`%s`の部分に`green`が代入される感じですね。

こんな書き方をするのはまれで、だいたい第２引数以降は変数が来ます。

```go-html-template {linenos=false}
{{ $day_word := `Today` }}
{{ $year := 2020 }}
{{ $month := 5 }}
{{ $day := 17 }}
{{ printf `%s is %d/%d/%d.` $day_word $year $month $day }}

-> Today is 2020/5/16.
```

`%s`とか`%d`のところにどんな文字が来るかは、そこに入る変数の型によって決まります。

ブール型（`true`と`false`）なら`%t`、10進法整数なら`%d`、文字列なら`%s`です。

わからなければ`%v`を指定しまえば自動で判断してくれます。

詳細については [Go のドキュメント](https://golang.org/pkg/fmt/)にあります。

`printf`関数を使えば、さきほどの例もより簡潔に表すことができます。

```go-html-template {linenos=false}
{{ $dirname := `static` }}
{{ $filename := `image` }}
{{ $extention := `jpg` }}
{{ $path := printf `%s/%s.%s` $dirname $filename $extention }}

-> static/image.jpg
```

{{< relpos hugo-findre-replacere >}}

---

`printf`関数は特に、最初は何をしているのか理解しにくいですが、使えるようになるとたいへん重宝します。

この記事がお役に立てれば幸いです。

ではまた:wave: