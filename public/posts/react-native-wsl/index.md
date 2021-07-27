---
title: "WSL から React Native を Android Studio で動かす"
date: 2021-03-19T12:00:00+09:00
lastmod: 2021-05-02T12:00:00+09:00
categories: [プログラミング, プログラミング一般]
tags: [React, アプリ開発, ツール]
draft: false
---

React Native というモバイルアプリを作るツールがあります。

そこで作ったアプリを Android Studio のエミュレータで動かすことができます。

React Native のプロジェクトを WSL2(Windows Subsystem for Linux 2) の内部に置くこともできるのですが、

<!--more-->

やり方を調べても情報が古かったり日本語の記事が少なかったりうまくいってなかったりで結構苦労したので、ここにまとめたいと思います。

<br>

参考：[React Native no Emulador Android Studio com WSL2 · GitHub](https://gist.github.com/georgealan/353a548814fe9b82a3a502926c7a42c6#observa%C3%A7%C3%B5es)

地球の反対側の人の投稿が大いに役に立ちました。笑

私の動作環境は次の通りです。

- Windows 10 Home バージョン 2004
- Android Studio Version 4.1.2
- WSL 2
- Ubuntu 20.04.1 LTS

<br>

## [Windows] いろいろ設定

### セキュリティの除外設定

Windows セキュリティのウイルスと脅威の防止 > ウイルスと脅威の防止の設定 > 除外から

Ubuntu のフォルダ（`C:\Users\<username>\AppData\Local\Packages\CanonicalGroupLimited.UbuntuonWindows_...`）を除外します。

私のPCではこの項目が表示されていなかったので、レジストリエディタをいじって表示させて除外しました。

参考：[Windowsセキュリティでウイルスと脅威の防止が表示されない。 - マイクロソフト コミュニティ](https://answers.microsoft.com/ja-jp/protect/forum/protect_defender-protect_start-windows_10/windows%E3%82%BB%E3%82%AD%E3%83%A5%E3%83%AA/62dba1b7-e42d-486c-9b2d-ead4126c0b63)

これをしないと WSL で起動した Metro と Windows 側の Android Studio が繋がらないようです。

### インストールなど

Windows に [Android Studio](https://developer.android.com/studio) をインストールします。

Android Studio の設定は、基本的に[公式](https://reactnative.dev/docs/environment-setup)の Windows + Android の説明に沿っていきます。

インストールした後に Configure > SDK Manager から選択して追加でインストールできるので、

`Android SDK Platform 29`と

`Intel x86 Atom_64 System Image`または`Google APIs Intel x86 Atom System Image`をチェック。

さらに SDK Tools タブに移って`Android Sdk Build-Tools` > `29.0.2`をチェックしてインストールします。

<br>

その後、Android SDK のパスを通します。

環境変数に`C:\Users\<username>\AppData\Local\Android\Sdk\platform-tools`を追加します。

<br>

Android Studio では Configure > AVD Manager から Q API Level 29 image の仮想デバイスを作成しておきます。

{{< relpos windows10home-docker >}}

<br>

## [WSL] インストールなど

基本的には[この投稿](https://gist.github.com/georgealan/353a548814fe9b82a3a502926c7a42c6#passo-2%C2%BA)の通りですが、若干古い部分があるので改めて書きます。

```bash {linenos=false}
# ホームディレクトリに移動
$ cd

# unzip コマンドをインストール
~ $ sudo apt install unzip

# Linux 用 command line tools を入手する。
# 最新版は https://developer.android.com/studio#command-tools から確認できる。
~ $ wget https://dl.google.com/android/repository/commandlinetools-linux-6858069_latest.zip

# Android ディレクトリとして解凍する
~ $ unzip commandlinetools-linux-6858069_latest.zip -d Android

# zip を消す
~ $ rm -rf commandlinetools-linux-6858069_latest.zip

# JDK とエミュレータをインストール
# 9 以降だと tools.jar がないとかなんとかでエラーになるらしい
~ $ sudo apt install -y lib32z1 openjdk-8-jdk

# Java 確認
~ $ java -version

~ $ cd Android
# ディレクトリ構成変更
# こうしないと ./sdkmanager --install でコケる
# もともとは cmdline-tools/ の中にいろいろあるが、
# cmdline-tools/latest/ の中に移動する
~/Android $ mv cmdline-tools latest
~/Android $ mkdir cmdline-tools
~/Android $ mv latest cmdline-tools

~/Android $ cd cmdline-tools/latest/bin

# いろいろインストールする
# React Native の推奨が 29 だったので 29 を入れる
~/A/c/l/bin $ ./sdkmanager --install "platform-tools" "platforms;android-29" "build-tools;29.0.2"

# アップデート
~/A/c/l/bin $ sdkmanager --update

# Gradle をインストール
~/A/c/l/bin $ sudo apt install gradle

# Gradle 確認
~/A/c/l/bin $ gradle -v
```

ここからは元投稿に書いていなかったことです。

```bash {linenos=false}
~/A/c/l/bin $ cd ~/Android

# sdkmanager によってフォルダができている
~/Android $ ls
build-tools  cmdline-tools  emulator  licenses  patcher  platform-tools  platform-tools-2  platforms  tools

~/Android $ cd platform-tools

# platform-tools の中に adb コマンドがある
~/A/platform-tools $ ls adb
adb

# adb を無効化する
~/A/platform-tools $ mv adb adb2

# 代わりに Windows 側の adb を使うようにシンボリックリンクを貼る
~/A/platform-tools $ ln -s /mnt/c/Users/<username>/AppData/Local/Android/Sdk/platform-tools/adb.exe adb
```

React Native が`~/Android/platform-tools/adb`を使うみたいで、

この設定をしないと`sdkmanager`によって作られた`adb`を使ってしまい、`react-native run-android`したときにエラーになってしまいます。

Windows 側の`adb.exe`は Android Studio のものなので、これでつなげることができます。

<br>

つづいて環境変数を設定します。

これは、例えば fish を使用している場合はそれを呼び出している bash の`.bashrc`と fish の`.config/fish/config.fish`の両方に設定する必要があります。

```bashrc {name="~/.bashrc", id=0}
export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64
export PATH=$PATH:$JAVA_HOME/bin

export ANDROID_HOME=$HOME/Android
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

```bashrc {name="~/.config/fish/config.fish", id=1}
set JAVA_HOME /usr/lib/jvm/java-8-openjdk-amd64
set ANDROID_HOME $HOME/Android
set PATH $PATH $JAVA_HOME/bin $ANDROID_HOME/emulator $ANDROID_HOME/tools $ANDROID_HOME/tools/bin $ANDROID_HOME/platform-tools
```

<br>

## プロジェクトを実行

まず、Android Studio から AVD を起動します。

AVD Manager で仮想デバイスの一覧が表示されるので、さきほど作成したものを緑色の三角ボタン▶で起動します。

<br>

次に PowerShell を立ち上げ、次のコマンドを打ちます。

```powershell {linenos=false}
adb kill-server
adb -a nodaemon server start
```

<br>

新たに WSL Ubuntu を開き、まだ React Native のプロジェクトを作成していない場合は作成します。

```bash {linenos=false}
npx react-native init AwesomeProject
cd AwesomeProject
```

そして Metro を立ち上げます。

```bash {linenos=false}
npx react-native start --host 127.0.0.1
```

新たに WSL Ubuntu を開き、プロジェクトのルートディレクトリ以下で次のコマンドを打ちます。

```bash {linenos=false}
npx react-native run-android --variant=debug --deviceId emulator-5554
```

これでうまくいっていれば、Android Studio のエミュレータの表示が切り替わるはずです。

{{< img src=result alt=完成 >}}

これで fish を使いながら開発できる！うれしい！

<br>

2回目以降は Android Studio の AVD 起動

→ PowerShell で`adb`コマンド

→ WSL で Metro 立ち上げ

→ WSL で run-android または Android Studio エミュレータでアプリ再起動

これだけで OK！

---

この記事がお役に立てれば幸いです。

ではまた:wave: