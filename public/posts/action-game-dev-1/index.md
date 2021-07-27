---
title: "アクションゲーム開発(1) ブロック配置"
date: 2021-01-20T12:00:00+09:00
lastmod: 2021-01-20T12:00:00+09:00
categories: [プログラミング, アクションゲーム開発]
tags: [プログラミング, Python, アプリ開発]
draft: true
---

このブログでは今まで Python による[チェスアプリ開発](/categories/チェスアプリ開発/)や[ガイスターアプリ開発](/categories/ガイスターアプリ開発)を連載してきました。

今度は Python でこのようなアクションゲームを作っていく様子を書いていきたいと思います。

<!--more-->

{{< yout zGtRG_PvDZY >}}

<br>

いきなり完成形を見てもどこから着手していけばいいかわからなくなりがちですが、

まずは簡単なことから始めてそこに少しずつ機能を追加していきましょう。

<br>

## ライブラリ準備

今回使用するライブラリは、画面描画に [tkinter](https://docs.python.org/ja/3/library/tkinter.html)、

音声に [pygame](https://www.pygame.org/news) です。

tkinter は Python に付属してたりするので何もしなくてもすでに入っていることがあります。

```bash
# tkinter インストール確認
$ python -m tkinter
# pygame インストール
$ pip install pygame
```

ウィンドウを描画するだけのコードは以下のようになります。

```py {name="main.py"}
import tkinter as tk

WINDOW_WIDTH = 600
WINDOW_HEIGHT = 600

if __name__ == '__main__':
    root = tk.Tk()
    root.title("action game!")                              # ウィンドウタイトル指定
    root.geometry(f'{WINDOW_WIDTH}x{WINDOW_HEIGHT}+0+0')    # ウィンドウサイズ指定
    cv = tk.Canvas(root, width=WINDOW_WIDTH, height=WINDOW_HEIGHT, bg='white')  # キャンバス設定
    cv.pack()       # ウィジェット配置
    cv.focus_set()  # フォーカスする
    root.mainloop()
```

`geometry`メソッドの引数の文字列は、`ウィンドウ幅x高さ+スクリーン左端からの距離+上端からの距離`という指定方法です。

<br>

## ブロック配置

ではさっそくコードを書いていきます。

まずはブロックを画面に配置していきます。

各ブロックの位置座標を使ってブロックを描画します。