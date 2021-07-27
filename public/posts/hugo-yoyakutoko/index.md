---
title: "【Hugo + Netlify + GitHub Actions】静的サイトジェネレータで予約投稿する"
date: 2020-04-17T12:00:00+09:00
lastmod: 2020-04-22T12:00:00+09:00
categories: [プログラミング, サイト構築]
tags: [ブログ, サイト構築, Hugo, Netlify, ツール]
draft: false
---

<p>
{{% tooltip %}}Hugo((本ブログで使用している静的サイトジェネレータ<br>[公式サイト](https://gohugo.io){{% /tooltip %}}
は WordPress などの動的なサイト生成ツールとは異なり、予約投稿機能がありません。
</p>

しかし、[Netlify](https://www.netlify.com/) と [GitHub Actions](https://github.co.jp/features/actions) を使って予約投稿を実現できたので、その方法をご紹介します。

ほとんどは[こちらのサイト](https://blog.5ebec.dev/posts/netlify-github-actions-%E3%81%A7-hugo-%E8%A3%BD%E3%83%96%E3%83%AD%E3%82%B0%E3%81%AE%E4%BA%88%E7%B4%84%E6%8A%95%E7%A8%BF/)と同じことをやっているのですが、

マークダウンファイル側や git まわりの準備も含めてお話したいと思います。

<!--more-->

{{< relpos ssg-toha >}}

<br>

## GitHub Actions とは

[GitHub Actions](https://github.co.jp/features/actions) は、ソフトウェアのビルドやデプロイを自動化する CI（継続的インテグレーション）、CD（継続的デリバリ）のようなサービスです。

GitHub ユーザならプライベートリポジトリでも Free プランから利用でき、

実行時間が毎月2000分（Windows なら1000分、macOS なら200分）までなら無料で利用できます。

<p>
ちなみに私の場合は
{{% tooltip %}}ワークフロー((実行条件と実行内容を表したもの{{% /tooltip %}}
の実行時間がだいたい0.5分なので、
</p>

macOS で一日12回実行しても大丈夫そうです。

<br>

## Netlify でビルド用 URL を取得する

Netlify にアクセスして、`Settings > Build & deploy > Build hooks > Add build hook`とします。

{{< img src=add-build-hook ext=png alt="Build hook 追加" >}}

`Build hook name`のところには任意の名前をつけます。

ここでは`scheduler`とします。

`Branch to build`は`master`のままで大丈夫です。

`Save`を押すと、ビルドを引き起こす URL が得られます。

{{< img src=build-hook-command ext=png alt="Build hook コマンド" >}}

展開すると下にコマンドが出てくるので、こちらをコピーします。

<br>

## 定期実行の内容を表す yml ファイルを作成する

<p>
ローカルの
{{% tooltip %}}ルートディレクトリ((一番最初の階層のディレクトリ（フォルダ）{{% /tooltip %}}
で
</p>

`/.github/workflows/schedule.yml`を作成します（フォルダ名は変更不可、ファイル名は任意）。

これがワークフローを定義するファイルとなります。

```yml {name="/.github/workflows/schedule.yml"}
# 任意の名前
name: scheduler
　
# ワークフローを起動する条件
on:
  # スケジュールに基づいて起動する
  schedule:
    - cron: '0 3 2-31/2 * *'
　
# 実行するジョブ
jobs:
  # ジョブ名
  build:
    # ジョブを実行する環境を指定する
    runs-on: ubuntu-latest
　
    steps:
    - name: post build hooks
      # コマンドを実行する
      run: curl -X POST -d {} ${{ secrets.BUILD_HOOKS_URL }}
```

`on.schedule`は、cron 構文というものを使用して指定した時間になると自動で`jobs`を行ってくれます。

ただし時間は UTC（協定世界時）なので、日本の時間から9時間引き算する必要があります。

cron の指定は`(分[0-59]) (時[0-23]) (日[1-31]) (月[1-12]) (曜日[0-7])`というふうに行い、

`/2`をつけるとステップ値を指定できます。

`0 3 2-31/2 * *`は、月や曜日に関係なく、偶数日の日本時間で正午に実行するという意味になります。

`run:`の行にはさきほどのコマンドをペーストしたのち、URL 部分を`${{ secrets.xxx }}`と書き換えます。

（`xxx`の部分は任意の名前。ここでは`BUILD_HOOKS_URL`。）

これは GitHub の Secrets から呼び出すことができます。

一度 push しておきましょう。

```
git add .
git commit -m "github actions: add workflow, scheduler"
git push origin master
```

<br>

## GitHub の Secrets を設定する

GitHub のリポジトリにアクセスし、`Settings > Secrets > Add a new secret`から値を登録します。

{{< img src=github-secret ext=png alt="GitHub Secrets" >}}

`Name`にはさきほどの変数名（`xxx`）を入れ、`Value`に Build hook の URL を入れます。

`Add secret`で登録すると、これで指定した時間に Netlify がビルドしてくれるようになります。

{{< relpos netlify-deploy-css-js >}}

<br>

## 予約投稿したい記事のマークダウンのフロントマターの日付を設定する

Netlify はデプロイをしてくれます。

デプロイは GitHub のリポジトリをもとに行われます。

つまり、あらかじめ公開したい記事を完成させた（`draft`も`false`にした）状態で push しておく必要があります。

そのまま push すると公開されてしまうので、

<p>
{{% tooltip %}}フロントマター((マークダウンファイルの先頭の、その記事に関する情報を書く部分{{% /tooltip %}}
の<strong><code>date</code>の日付を投稿したい日時に合わせます。
</strong></p>

こうするとその日時になるまではいくら push しようがデプロイしようが、その日時がまだ存在しないので、

記事が存在しないものとして扱われて表示されません。

例えばある記事を翌日の20時に予約投稿したいなら、フロントマターの`date`の部分をその日時に合わせてから push すれば、

翌日の20時以降にデプロイされたときにはじめて記事が出現するというわけです。

このデプロイの時刻を GitHub Actions で同じ日時に指定してやれば、

翌日の20時05分ぐらいにはうまくいけばちゃんと記事が公開されるはずです。

（たまにデプロイが失敗することもあるようですが…）

<br>

## 記事以外の場合

記事でない場合でも、時間によって操作を変えることができます。

Hugo には[`now`](https://gohugo.io/functions/now/)という、地域の時間を返す関数が用意されています。

これを利用して、例えば時間帯によって条件分岐して表示させるものを変えることができます。

```go-html-template
{{- /* 朝（06:00-11:59）のとき */ -}}
{{- if in (seq 6 11) (int (now.Format "15")) -}}
    おはよう！
{{- /* 昼（12:00-17:59）のとき */ -}}
{{- else if in (seq 12 17) (int (now.Format "15")) -}}
    こんにちは！
{{- /* 夜（18:00-05:59）のとき */ -}}
{{- else -}}
    こんばんは！
{{- end -}}
```

ワークフローの`on.schedule`はこんな感じになります。

```yml
// 6:00, 12:00, 18:00 に実行
cron: '0 6-18/6 * * *'
```

これで夜だけ背景色やデザインを変える、なんてこともできちゃいますよ。

なお、記事の場合で今回のやり方がうまくいかない（未来の日付の投稿が表示されてしまう）場合でも、

`.Site.RegularPages`をいじればおそらく実装は可能です。

関係各所の調整がちょっと面倒かもしれないですが。

<details>
<summary>たぶんこんな感じになるかと思います。</summary>
<br>
次のコードを必ず通る場所に置きます。

```go-html-template
{{ range .Site.RegularPages }}
    {{ if .PublishDate.Before now }}
        {{ .Scratch.Add "existing_pages" (slice .) }}
    {{ end }}
{{ end }}
```

これ以外のすべての`.Site.RegularPages`を

`.Scratch.Get "existing_pages"`に書き換えます。

</details>

{{< relpos add-toc >}}

---

予約投稿機能がないのは静的サイトジェネレータの弱点のひとつですが、

比較的簡単に、ほとんどの場合無料で実現できてしまいます。

この記事が参考になったら幸いです。

では:wave: