---
title: "ガイスターアプリ開発(1) 導入・駒を配置する画面（テキスト）"
date: 2020-12-10T12:00:00+09:00
lastmod: 2020-12-31T12:00:00+09:00
categories: [プログラミング, ガイスターアプリ開発]
tags: [プログラミング, Python, アプリ開発]
draft: false
---

[ガイスター](https://ja.wikipedia.org/wiki/%E3%82%AC%E3%82%A4%E3%82%B9%E3%82%BF%E3%83%BC)というボードゲームがあります。

お互いが相手の駒が何かわからない状態で取り合うという心理戦の側面を兼ねたゲームです。

<!--more-->

「いいオバケ」（青）と「悪いオバケ」（赤）の 2 種類の駒を手前の 8 マスに 1 個ずつ好きな順に配置できます。

相手の青を全部取るか、自分の赤を全部取らせるか、自分の青を相手の陣地の特定のマスから外に出すことが勝利の条件となります。

<br>

今回からこのガイスターを Python と [pygame](https://www.pygame.org/) を使って作っていく様子を連載したいと思います。

pygame について役に立つ日本語のサイトがあります。

→ [【Pygame入門】ゲームプログラミング【Python】  |  西住工房](https://algorithm.joho.info/programming/python/pygame/)

<br>

## pygame のインストール・画面表示

まずは pygame をインストールします。

```bash
$ pip install pygame
```

これで`import pygame`して使えるようになります。

<br>

ウィンドウを表示するコードは以下のようになります。

```py {name="main.py"}
import sys

import pygame
from pygame.locals import *

# ウィンドウサイズ
DISP_SIZE = (600, 600)

# 色の設定
IVORY = (240, 227, 206)

def main():
    pygame.init()   # 初期化
    screen = pygame.display.set_mode(DISP_SIZE)  # 画面作成
    pygame.display.set_caption('Geister')   # タイトルバーの表示

    while True:
        screen.fill(IVORY)          # 背景色塗りつぶし
        pygame.display.update()     # 画面更新

        # イベントハンドリング
        for event in pygame.event.get():
            # 閉じるボタン
            if event.type == QUIT:
                pygame.quit()   # pygame 終了
                sys.exit()      # プログラム終了

if __name__ == '__main__': main()
```

ところで`set_mode`の第二引数に`FULLSCREEN`を指定するとフルスクリーン表示できます。

コマンドライン引数を受け付けて表示変更できるようにすると、このようになります。

```py {name="main.py", hl_lines=["4-6"], inline_hl=[2:[12]]}
...
def main():
    pygame.init()
    args = sys.argv
    _flag = FULLSCREEN if len(args) == 2 and args[1] == 'f' else 0
    screen = pygame.display.set_mode(DISP_SIZE, _flag)
    ...
```

これで`py main.py f`のようにするとフルスクリーンになります。

<br>

## 駒配置画面の作成

ゲームを始める前に駒をどのように配置するか、それぞれのプレイヤーに決めてもらうための画面を作ります。

いろいろ描くので、ひとつの関数にまとめて別のモジュールに置きます。

```py {name="draw.py"}
import pygame
from pygame.locals import *

def setup():
    pass
```

```py {name="main.py", hl_lines=[2, 8]}
...
import draw
...
def main():
    ...
    while True:
        screen.fill(IVORY)
        draw.setup()
        pygame.display.update()
```

### テキストを描画

駒の配置を決めてほしい旨をテキストとして画面上に描いてみます。

pygame ではテキストに日本語フォントを使うこともできます。

使用できるフォントの一覧は`print(pygame.font.get_fonts())`で表示できます。

テキストを描くには、まずフォントを指定して、`render`メソッドで内容を指定し、

`blit`メソッドで位置を指定します。

```py {name="main.py", hl_lines=[4, 8]}
...
def main():
    ...
    font = pygame.font.SysFont('hg丸ｺﾞｼｯｸmpro', 16)

    while True:
        ...
        draw.setup(screen, font, 1)
        ...
```

```py {name="draw.py"}
...
def setup(screen, font, turn):
    '''
    screen : pygame.display.set_mode
    font : pygame.font.SysFont
        フォント
    turn : int
        先攻(0)か後攻(1)か
    '''
    assert turn == 0 or turn == 1, 'draw.setup の引数 turn は 0, 1 の値を取ります'
    _text = font.render(
        ('先' if turn == 1 else '後') + '攻の駒の配置を決めてね（↓自分側　↑相手側）',
        True, (0, 0, 0))
    screen.blit(_text, (20, 20))
```

ここまででプログラムを起動するとこのようになります。

{{< img src=text alt="テキスト表示" >}}

---

{{< pstlk 次回 geister-app-dev-2 >}}はグリッドや決定ボタンの描画をしていきます。

お読みいただきありがとうございました～

では:wave: