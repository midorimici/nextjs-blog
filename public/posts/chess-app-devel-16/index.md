---
title: "チェスアプリ開発(16) 効果音の追加(Pygame)"
date: 2020-09-16T12:00:00+09:00
lastmod: 2020-10-07T12:00:00+09:00
categories: [プログラミング, チェスアプリ開発]
tags: [プログラミング, Python, アプリ開発, チェス]
draft: false
---

Python プログラムで動かすフェアリーチェスアプリ開発、連載第 16 回です。

{{< pstlk 前回 chess-app-devel-15 >}}まででフェアリー駒の作成やゲーム種類の拡張をすることができるようになりました。

今回は少し横道にそれて、ゲーム内で効果音を鳴らしてみます。

よりゲームっぽくなります。

<!--more-->

<br>

## Pygame を導入する

[Pygame](https://www.pygame.org/news) というモジュール集には、ゲーム制作のためのさまざまなモジュールが用意されています。

これを使うと簡単に効果音を鳴らすことができるようになります。

今更ですが描画もできるようです。

（最初から全部 Pygame で実装しろって話よな）

<br>

pip を使ってインストールします。

`pip install pygame`

<br>

## 効果音を鳴らす

次に効果音を用意して、ゲーム内で鳴らしてみます。

音声ファイル形式は`wav`にしておきましょう。

`mp3`だとうまくいきません。

<br>

まずは音声の初期設定をします。

```py {name="main.py"}
...
import pygame
...

# 音声の設定
pygame.mixer.init()
snd = pygame.mixer.Sound
# 各効果音の設定
select_snd = snd('../sounds/select.wav')
move_snd = snd('../sounds/move.wav')
...
```

これで、あとは音を鳴らしたいところで、`select_snd.play()`のように記述するだけです。

<br>

少ないですが、今回の変更も [GitHub](https://github.com/midorimici/chess-program-for-python-and-OpenGL/commit/8aec761cb64d1c12d8a43705ab0f7d804efbf09e) に上げておきます。

---

{{< pstlk 次回 chess-app-devel-17 >}}はチェス960を追加してみたいと思います。

お読みいただきありがとうございました～

ではでは:wave: