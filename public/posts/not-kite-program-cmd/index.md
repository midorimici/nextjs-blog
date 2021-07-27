---
title: "ターミナルから規定ではないプログラムでファイルを開く方法"
date: 2020-08-06T12:00:00+09:00
lastmod: 2020-08-06T12:00:00+09:00
categories: [プログラミング, プログラミング一般]
tags: [プログラミング, ツール]
draft: false
---

ターミナルからファイルを開きたいが、

規定のプログラムではなく他のプログラムを指定して開きたいというときのコマンドをご紹介します。

<!--more-->

今まではコマンドを使ってエクスプローラを開き、そこからGUI操作していたのですが、

コマンド一本で済ませられないかなーと試行錯誤した結果、うまくいきました。

<br>

## 規定のプログラムで開く場合

規定のプログラムで開く場合は簡単です。

Windows なら`start ファイル名`（コマンドプロンプトならファイル名のみも可）を、

Mac や Linux なら`open ファイル名`のコマンドを打てば、

規定のプログラムで開くことができます。

このとき、ファイル名へのパスはカレントディレクトリからの相対パスを指定します。

<br>

## 規定ではないプログラムで開く場合

「HTML ファイルはいつも VS Code で開くけど、今はブラウザで開いて確認したい」

というようなときには、規定のプログラム（VS Code）ではないプログラム（ブラウザ）を指定することになります。

<br>

Windows のコマンドプロンプトなら`start プログラム名 ファイル名`と指定します。

```bash
start firefox index.html
```


ファイル名へのパスはカレントディレクトリからの相対パスを指定します。

<br>

Mac や Linux なら`open -a プログラム名 ファイル名`です。

```bash
open -a Firefox index.html
```

こちらもファイル名へのパスはカレントディレクトリからの相対パスで大丈夫だと思います。

<br>

ここまでは特に問題ないのですが、

問題は Windows で Git Bash を使っているときです。

### Git Bash の場合

答えから言うと、`start プログラム名 $(cygpath -w $(pwd)/ファイル名)`です。

```bash
start firefox $(cygpath -w $(pwd)/index.html)
```

<br>

Git Bash で`start firefox index.html`と打つと、

`index.html`が URL とみなされて`http://www.index.html/`にアクセスしてしまいます。

Chrome でも同様です。

<br>

そこで絶対パスを指定しなければなりません。

それでいちいち絶対パスを打つのは面倒くさいと思って、

カレントディレクトリのパスを出力する`pwd`コマンドを使いたくなります。

でも`pwd`が出力するパスの形式は Windows のものとは異なります。

```bash
$ pwd
/c/Users/username/Documents
```

そこで、パスを Windows 形式に変更するために、`cygpath -w`を使います。

```bash
$ cygpath -w $(pwd)
C:\Users\username\Documents

$ cygpath -w $(pwd)\\index.html
C:\Users\username\Documents\index.html
```

コマンドを`$()`または<code>``</code>で囲むことで、その出力を別のコマンドに利用することができます。

これで絶対パスを取得できたので、これを引数として`start`コマンドに渡します。

```bash
start firefox $(cygpath -w $(pwd)\\index.html)
```

なお、URL のアドレスバーでは`\`は`/`になりますので、

```bash
start firefox $(cygpath -w $(pwd)/index.html)
```

でも大丈夫です。

<br>

## シェルスクリプトで簡略化

とはいえこのながーいコマンドをいちいち打つのは面倒です。

そこで**シェルスクリプト**（Windows ならバッチファイルもあり）です。

シェルスクリプトやバッチファイルはコマンドをまとめたものです。

Git Bash で使うならシェルスクリプトのほうがタイプ数が少ないし相性がいいと思います。

### ファイルを作成

まずシェルスクリプトを入れ込むディレクトリを作成します（任意）。

その中に`.sh`ファイルを作成します。

```bash
$ mkdir shellscripts

$ cd shellscripts

$ vi open.sh
```

ファイルの中には次のように書きます。

```bash {name="open.sh"}
#!/bin/bash

file=$1
bro=$2

if [ "$bro" == "c" ]
then
  bro="chrome"
else
  bro="firefox"
fi

start $bro $(cygpath -w $(pwd)/$file)

exit 0
```

`$1` `$2`は引数です。

3-4行目で変数に代入しています。

6-11行目では、ブラウザの指定が`c`のときには Chrome を、

特に指定がなかったときには Firefox をブラウザとして選択するという処理です。

13行目が本体のコマンドです。

### ファイルに権限を付与

ファイルに実行権限がないと直接実行できません。

まず実行権限を確認します。

```bash
$ ls -l open.sh
-rwxr-xr-x ...
```

一番左の`-rwxr-xr-x`が権限の状態を表しています。

2-4文字目が所有者の権限を表していて、`rwx`なら読み、書き、実行の権限があるということです。

もし`rw-`のように、実行権限がなくなっていたら、`chmod`コマンドで権限を付与します。

```bash
$ ls -l open.sh
-rw-r-xr-x ...

$ chmod 755 open.sh
または
$ chmod u+x open.sh

$ ls -l open.sh
-rwxr-xr-x ...
```

### パスを通す

次にパスを通して、どこからでも実行できるようにします。

シェルスクリプトへのパスを次のように指定します。

```bash
$ export PATH="$PATH:/c/Users/username/Documents/shellscripts"
```

コマンドを使わないなら、Windows なら`システム環境変数の編集 > 環境変数 > Path`から追加することもできます。

<br>

これでどこからでも`open.sh`を使えるようになりました。

`open.sh index.html`と打てば Firefox でカレントディレクトリ以下の`index.html`を立ち上げてくれるようになります。

`open.sh index.html c`とすれば Chrome で立ち上げてくれます。

<br>

また、`open.sh`としましたが、実は拡張子がなくても動きます。

```bash
$ mv open.sh open
```

これで`open index.html`のように、純粋なコマンドと同じような使い方ができるようになります。

こんなに短く書けるなんて感動です！

{{< relpos vim-kensaku-hanni >}}

---

参考になれば幸いです。

では～:wave: