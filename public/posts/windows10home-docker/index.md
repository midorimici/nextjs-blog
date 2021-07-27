---
title: "【Docker】Windows 10 Home で Docker をセットアップ"
date: 2020-08-29T12:00:00+09:00
lastmod: 2020-08-29T12:00:00+09:00
categories: [プログラミング, プログラミング一般]
tags: [ツール]
draft: false
---

Windows 10 Home で Docker を使えるようにする方法について説明します。

<br>

## Windows をバージョン2004に更新する

Windows バージョン2004では WSL2 が利用できるようになりました。

<!--more-->

まずは自分の Windows のバージョンを確認します。

`設定＞システム＞バージョン情報`です。

{{< img src=windows-version alt="Windos バージョン確認" >}}

「バージョン」が2004、OS ビルドが19018以上になっていることを確認します。

これが満たされていない場合は、手動で更新する必要があります。

<br>

こちらのページからアップデートができます。

→ [Windows 10 のダウンロード](https://www.microsoft.com/ja-jp/software-download/windows10)

結構時間がかかります。

全体で１時間以上はかかりました。

<br>

## WSL2 を有効化する

`コントロールパネル＞プログラム＞Windows の機能の有効化または無効化`から、

「Linux 用 Windows サブシステム」にチェックを入れます。

{{< img src=wsl2 alt="WSL2 有効化" >}}

Docker は Linux 上で動くのでこれが必要です。

<br>

## Docker Desktop for Windows をインストールする

Docker Hub から Docker Desktop for Windows をダウンロードします。

→ [Docker Desktop for Windows - Docker Hub](https://hub.docker.com/editions/community/docker-ce-desktop-windows/)

Stable（安定版） と Edge（最新版） がありますが、Stable で大丈夫です。

<br>

ダウンロードしたら`Docker Desktop Installer.exe`を実行してインストーラを起動します。

`Endable WSL 2 Windows Features`にチェックがついていることを確認してインストールを開始します。

インストールが完了したらターミナルで`docker --version`と入力し、

インストールできているか確認します。

<br>

## BIOS 設定で Virtualization Technology を有効にする

BIOS 設定に入るには、PC の起動直後に何らかのキー（機種による）を連打します。

「(メーカ) BIOS」のように検索すると BIOS 画面表示方法が見つかると思います。

BIOS で、`Virtualization Technology`の項目を`Enabled`に変更します。

<br>

以上で Docker が使えるようになりました。

Docker Desktop を起動すると使えるようになります。

---

お役に立てれば幸いです。

では:wave: