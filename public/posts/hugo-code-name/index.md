---
title: "【Hugo】コードブロック内にファイル名を表示する"
date: 2020-04-08T12:00:00+09:00
lastmod: 2020-04-21T12:00:00+09:00
categories: [プログラミング, サイト構築]
tags: [サイト構築, Hugo, HTML]
draft: false
---

<p>
{{% tooltip %}}Hugo((本ブログで使用している静的サイトジェネレータ<br>[公式サイト](https://gohugo.io){{% /tooltip %}}
では{{% tooltip %}}[シンタックスハイライト](https://gohugo.io/content-management/syntax-highlighting/)((可読性を高めるためにソースコードを単語ごとに色分けすること{{% /tooltip %}}機能があって、
</p>

マークダウンファイル内に[指定の書式](https://gohugo.io/content-management/syntax-highlighting/#highlighting-in-code-fences)で書くだけで、コードブロックをページに表示させることができます。

特定の行をハイライト表示したり、行番号を非表示にしたりいろいろとできるのですが、

ファイル名を表示することができません。

<!--more-->

そこで、JavaScript を使わずに Hugo のテンプレートを使って

コードブロックにファイル名を表示する方法をご紹介します。

<br>

## 完成イメージ

コードによってはファイル名が不要なものもあるので、切り替えができるようにします。

デフォルト状態では左図のようになっているので、

ファイル名を指定したときにのみ行番号の列とコードの列の位置を下に少しずらすか、コードブロックの天井を高くすることになります。

{{< img src=blueprint ext=png alt=完成イメージ >}}

<br>

## 手順

実装の手順としては次のようになります。

1. [ファイル名を識別させる方法を決める](#ファイル名を識別させる方法を決める)
1. [ファイル名をどの部分に挿入するか決める](#ファイル名をどの部分に挿入するか決める)
1. [テンプレートファイル内で、ファイル名を識別させる](#テンプレートファイル内でファイル名を識別させる)
1. [テンプレートファイル内で、ファイル名を表示するタグを作り、HTML ファイル内に挿入する](#テンプレートファイル内でbrファイル名を表示するタグを作りbrhtml-ファイル内に挿入する)
1. [CSS ファイルで見た目を調整する](#css-ファイルで見た目を調整する)

<br>

## ファイル名を識別させる方法を決める

思いつく方法としては2つあります。

### ①言語名の直後にファイル名をくっつける

例えば、マークダウンファイルに次のように書くと、（例は[公式ドキュメント](https://gohugo.io/content-management/syntax-highlighting/#highlighting-in-code-fences)より）

<pre>
<code>```go {linenos=table,hl_lines=[8,"15-17"],linenostart=199}
// ... code
```</code>
</pre>

HTML の該当のコードブロックには次のような構造が出来上がります。

```html
<div class="highlight">
    <div class="chroma">
        <table class="lntable">
            <tbody>
                <tr>
                    <td class="lntd">
                        <pre class="chroma">
                            <code>
                                <span class="lnt">199</span>
                            </code>
                        </pre>
                    </td>
                    <td class="lntd">
                        <pre class="chroma">
                            <code class="language-go" data-lang="go">
                                <span class="c1">// ... code</span>
                            </code>
                        </pre>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
```

言語名の直後にファイル名を次のように書いてもエラーは発生せず、シンタックスハイライトも（多くの場合は）正常に動作します。

（ファイル名の拡張子の表す言語と言語名の表す言語が一致しない場合には、拡張子が優先されることがあるようです。）

<pre>
<code>```go:foo.go {linenos=table,hl_lines=[8,"15-17"],linenostart=199}
// ... code
```</code>
</pre>

このときの HTML の構造は次のようになります。

```html {hl_lines=[15], inline_hl=[0:[4_7]]}
<div class="highlight">
    <div class="chroma">
        <table class="lntable">
            <tbody>
                <tr>
                    <td class="lntd">
                        <pre class="chroma">
                            <code>
                                <span class="lnt">199</span>
                            </code>
                        </pre>
                    </td>
                    <td class="lntd">
                        <pre class="chroma">
                            <code class="language-go:foo.go" data-lang="go:foo.go">
                                <span class="c1">// ... code</span>
                            </code>
                        </pre>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
```

ここに明示的に出現する`foo.go`を HTML から探し出して取り出すという方法です。

### ②{ }の中に独自の記述を追加する

<pre>
<code>```go {linenos=table,hl_lines=[8,"15-17"],linenostart=199}
// ... code
```</code>
</pre>

の1行目の`{}`の中では、行番号の表示方法やハイライトする行、行番号の始めの数字など、

そのコードブロックに関する情報を指定できます。

この書式に合わせる形で、

<pre>
<code>```go {name="foo.go",linenos=table,hl_lines=[8,"15-17"],linenostart=199}
// ... code
```</code>
</pre>

のように書き、マークダウンファイル内でその記述を探し出して取り出すという方法です。

<br>

## ファイル名をどの部分に挿入するか決める

CSS 次第ですが、おそらく選択肢としては次のうちのどこかになるでしょう。

```html {hl_lines=[3, 8, 10, 17, 19]}
<div class="highlight">
    <div class="chroma">
        <div class="code-name">foo.go</div>
        <table class="lntable">
            <tbody>
                <tr>
                    <td class="lntd">
                        <div class="code-name">foo.go</div>
                        <pre class="chroma">
                            <div class="code-name">foo.go</div>
                            <code>
                                <span class="lnt">199</span>
                            </code>
                        </pre>
                    </td>
                    <td class="lntd">
                        <div class="code-name">foo.go</div>
                        <pre class="chroma">
                            <div class="code-name">foo.go</div>
                            <code class="language-go:foo.go" data-lang="go:foo.go">
                                <span class="c1">// ... code</span>
                            </code>
                        </pre>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
```

最初のもの以外は、新たに置いた要素が行番号かコード本文のどちらか片方を動かすことはあっても、両方を動かすことはありません。

そのため3行目に置いたほうが楽だと思います。

ここではこの位置にタグを挿入していきます。

{{< relpos add-toc >}}

<br>

## テンプレートファイル内で、ファイル名を識別させる

ファイル名の識別方法でやり方が変わってきます。

### ①の場合

生成された HTML （`.Content`。テーマで独自に変更が加えられている場合は`.Scratch.Get "Content"`など）の中から

正規表現で特定のタグを探し出し、ファイル名を取り出します。

```go-html-template
{{- /* 正規表現で <div class="chroma">...</div> をさがす */ -}}
{{- $div_pattern := `<div class="chroma">(?:.|\n)*?</div>` -}}
{{- $div_chromas := (findRE $div_pattern (.Scratch.Get "Content")) -}}
　
{{- range $div_chromas -}}
    {{- /* 正規表現で <div class="chroma">...<code class="language-...:..." ...> をさがす */ -}}
    {{- $pattern := `<div class="chroma">(?:.|\n)*?<code class="language-.+?:(.+?)" data-lang=".+?:.+?">(?:.|\n)*?</div>` -}}
    {{- if findRE $pattern . -}}
        {{- /* ファイル名を取り出す */ -}}
        {{- $file_name := . | replaceRE $pattern `$1` -}}
        ...
    {{- end -}}
{{- end -}}
```

こちらは読み込むのも書き換えるのも HTML の同じ部分なので、比較的簡潔に書けます。

### ②の場合

マークダウンファイル（`.RawContent`）の中から

正規表現で`{..., name="...", ...}`となっている部分を探しだし、ファイル名を取り出します。

```go-html-template
{{- /* ローカルスクラッチ生成 */ -}}
{{- $scratch := newScratch -}}
　
{{- /* 正規表現でマークダウンファイルからコードブロックをさがす */ -}}
{{- $pattern_code_block := `\x60{3}\w+?(?:.|\n)*?\x60{3}\n` -}}
{{- $code_blocks := findRE $pattern_code_block .RawContent -}}
　
{{- /* 正規表現でコードブロックから */
    /* name が指定されているコードブロックをさがす */ -}}
{{- $pattern_name := `^\x60{3}.+?(?:{|,)(?: +?|\n+?)?name="(.+?)".*?}(?:.|\n)*` -}}
{{- $pattern_id := `^\x60{3}.+?(?:{|,)(?: +?|\n+?)?id=(\d+?).*?}(?:.|\n)*` -}}
{{- $scratch.Set "pattern_name" $pattern_name -}}
{{- $scratch.Set "pattern_id" $pattern_id -}}
{{- range $index, $code_block := $code_blocks -}}
    {{- $pattern_name := $scratch.Get "pattern_name" -}}
    {{- $pattern_id := $scratch.Get "pattern_id" -}}
　
    {{- /* ファイル名 */ -}}
    {{- $name := $code_block | replaceRE $pattern_name `$1` -}}
    {{- /* 何番目のコードか */ -}}
    {{- $id := $code_block | replaceRE $pattern_id `$1` -}}
　
    {{- /* ファイル名の指定があるとき */ -}}
    {{- if (findRE $pattern_name $code_block) -}}
        {{- $scratch.Add "name" (slice $name) -}}
        {{- /* 何番目のコードか指定があるとき */ -}}
        {{- if (findRE $pattern_id $code_block) -}}
            {{- $scratch.Add "ids" (slice (int $id)) -}}
        {{- else -}}
            {{- /* 何番目のコードか指定がなかったとき */
                /* コードブロックが上から何番目かの情報を使う */ -}}
            {{- $scratch.Add "ids" (slice $index) -}}
        {{- end -}}
    {{- end -}}
{{- end -}}
```

`\x60`というのはバッククォート（`）のことです。

読み込むのはマークダウンファイルですが、書き換えるのは HTML なので、

何番目のコードを書き換えるべきかの情報を伝達しなければなりません。

すべて手動で`id`を指定する（{..., id=4}などと常に指定する）こともできますが、こちらはある程度は自分で判断してくれるようなコードになっています。

ただおかしな挙動をしたときにも制御できるように手動で指定することもできます。

{{< relpos hugo-scratch >}}

<br>

## テンプレートファイル内で、<br>ファイル名を表示するタグを作り、<br>HTML ファイル内に挿入する

HTML の該当部分を挿入後のものに置き換えていきます。

### ①の場合

```go-html-template {hl_lines=[7, 8, "11-21"], ins=[1, "3-12"], del=[0, 2], inline_hl=[0:[6], 1:[6], 2:[14], 3:[14]]}
{{- /* 正規表現で <div class="chroma">...</div> をさがす */ -}}
{{- $div_pattern := `<div class="chroma">(?:.|\n)*?</div>` -}}
{{- $div_chromas := (findRE $div_pattern (.Scratch.Get "Content")) -}}
　
{{- range $div_chromas -}}
    {{- /* 正規表現で <div class="chroma">...<code class="language-...:..." ...> をさがす */ -}}
    {{- $pattern := `<div class="chroma">(?:.|\n)*?<code class="language-.+?:(.+?)" data-lang=".+?:.+?">(?:.|\n)*?</div>` -}}
    {{- $pattern := `<div class="chroma">((?:.|\n)*?<code class="language-.+?:(.+?)" data-lang=".+?:.+?">(?:.|\n)*?</div>)` -}}
    {{- if findRE $pattern . -}}
        {{- /* ファイル名を取り出す */ -}}
        {{- $file_name := . | replaceRE $pattern `$1` -}}
        {{- $file_name := . | replaceRE $pattern `$2` -}}
        {{- $rest := . | replaceRE $pattern `$1` -}}
　
        {{- /* ファイル名を示す div タグを作成 */ -}}
        {{- $div_name := printf `<div class="code-name">%s</div>` $file_name -}}
　
        {{- /* <div class="chroma"> の直後に <div class="code-name"></div> を挿入 */ -}}
        {{- $new_div := printf `<div class="chroma">%s%s` $div_name $rest -}}
        {{- $Content := replace ($.Scratch.Get "Content") . $new_div | safeHTML -}}
        {{- $.Scratch.Set "Content" $Content -}}
    {{- end -}}
{{- end -}}
```

正確な置き換えをするために、置き換えられる文を広めの範囲で判定していますが、

書き換えているのはほんの一部です。

変わっていない部分`$rest`も置き換える文に入れ込むことに注意です。

### ②の場合

HTML から書き換える部分を探し出し、マークダウンファイルから得た情報を使って

新しいタグを作成して挿入しています。

```go-html-template {hl_lines=[16]}
...
{{- /* 正規表現で HTML から */
    /* <div class="chroma">...</div> をさがす */ -}}
{{- $pattern_chroma := `<div class="chroma">((?:.|\n)*?</div>)` -}}
{{- $divs := findRE $pattern_chroma (.Scratch.Get "Content") -}}
{{- $scratch.Set "divs" $divs -}}
　
{{- $names := $scratch.Get "name" -}}
{{- range $index, $name := $names -}}
    {{- $id := index ($scratch.Get "ids") $index -}}
　
    {{- /* ファイル名を示す div タグを作成 */ -}}
    {{- $div_name := printf `<div class="code-name">%s</div>` $name -}}
　
    {{- /* 変更する div タグ */ -}}
    {{- $div := index ($scratch.Get "divs") $id -}}
    {{- $rest := replace $div `<div class="chroma">` `` -}}
　
    {{- /* <div class="chroma"> の直後に <div class="code-name"></div> を挿入 */ -}}
    {{- $new_div := printf `<div class="chroma">%s%s` $div_name $rest -}}
    {{- $Content := replace ($.Scratch.Get "Content") $div $new_div | safeHTML -}}
    {{- $.Scratch.Set "Content" $Content -}}
{{- end -}}
```

後半は①の場合とほぼ同じですが、

ハイライトで示した部分（16行目）でマークダウンファイルから取得した情報を HTML 要素の抽出に使用しています。

{{< relpos hugo-findre-replacere >}}

<br>

## CSS ファイルで見た目を調整する

あとは見た目の部分をお好みで調整するだけです。

例としてコードを挙げておきます。

```css
.code-name {
    display: inline;        /* 表示形式 */
    position: relative;     /* 配置方法 */
    top: 0.5em;             /* 位置調整 */
    left: 1em;              /* 位置調整 */
    border-bottom: solid thin #888888;  /* 下線を引く */
}
```

{{< relpos blog-fukidashi >}}

---

以上でコードブロックにファイル名を表示することができるようになりました。

お疲れ様でした。

参考になれば幸いです。

では:wave: