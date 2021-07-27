---
title: "ガイスターアプリ開発(2) 駒を配置する画面（グリッド・駒・ボタン）"
date: 2020-12-11T12:00:00+09:00
lastmod: 2020-12-19T12:00:00+09:00
categories: [プログラミング, ガイスターアプリ開発]
tags: [プログラミング, Python, アプリ開発]
draft: false
---

Python でつくるガイスター、連載第 2 回です。

{{< pstlk 前回 geister-app-dev-1 >}}は pygame の導入とテキスト表示をしました。

今回は駒の配置を決める画面の残りの要素を描画していきます。

<!--more-->

<br>

ガイスターでの駒の開始時の並べ方はプレイヤーが自由に決めることができますが、

その位置は赤と青の 4 つずつを手前の 8 マスの中と決まっています。

8 マスを表すグリッドを描き、左クリックで赤、右クリックで青の駒をクリックしたマスに入れていくことにします。

<br>

## グリッド

まずマスを表すグリッドを描画します。

グリッド描画はゲーム本番のマス目の描画にも使いたいので関数としました。

ベクトルの計算がやりやすいように NumPy を使用します。

定数は別モジュールにまとめておきます。

```py {name="config.py"}
import numpy as np

# ウィンドウサイズ
DISP_SIZE = (600, 600)
# 色の設定
IVORY = (240, 227, 206)
BLACK = (0, 0, 0)
# マスの大きさ
SQUARE_SIZE = 90
# マージン幅
MARGIN = (np.asarray(DISP_SIZE) - 6*SQUARE_SIZE)/2
```

```py {name="draw.py", hl_lines=["5-25", 33]}
import numpy as np

from config import *

def _grid(screen, coord, col, row):
    '''
    一辺が SQUARE_SIZE のマスのグリッドを描く

    screen : pygame.display.set_mode
    coord : tuple <- (int, int)
        左上の座標
    col : int
        列数
    row : int
        行数
    '''
    _coord = np.asarray(coord)
    for i in range(row+1):
        pygame.draw.line(screen, BLACK,
            _coord + (0, SQUARE_SIZE*i),
            _coord + (SQUARE_SIZE*col, SQUARE_SIZE*i), 2)
    for i in range(col+1):
        pygame.draw.line(screen, BLACK,
            _coord + (SQUARE_SIZE*i, 0),
            _coord + (SQUARE_SIZE*i, SQUARE_SIZE*row), 2)

def setup(screen, font, turn):
    ...
    _text = font.render(
        ('先' if turn == 1 else '後') + '攻の駒の配置を決めてね（↓自分側　↑相手側）',
        True, BLACK)
    screen.blit(_text, (20, 20))
    _grid(screen, MARGIN + SQUARE_SIZE + (0, SQUARE_SIZE), 4, 2)
```

線分の描画には`pygame.draw.line`を使います。

引数はスクリーン、色、端点の座標、もう片方の端点の座標、太さです。

これで次のようになります。

{{< img src=grid alt="グリッド表示" >}}

<br>

## 駒

次に指定の色の駒を指定の位置に描く関数を定義します。

駒は三角形として描画します。

相手の駒なら逆三角形です。

```py {name="config.py", hl_lines=["6-7", "13-14"]}
...
# ウィンドウサイズ
DISP_SIZE = (600, 600)
# 色の設定
IVORY = (240, 227, 206)
RED = (200, 0, 0)
BLUE = (0, 0, 200)
BLACK = (0, 0, 0)
# マスの大きさ
SQUARE_SIZE = 90
# マージン幅
MARGIN = (np.asarray(DISP_SIZE) - 6*SQUARE_SIZE)/2
# 駒の大きさ
PIECE_SIZE = 60
```

```py {name="draw.py"}
...
def _piece(screen, color, pos, rev=False):
    '''
    駒を描画する

    screen : pygame.display.set_mode
    color : tuple <- (int, int, int)
        駒の色
    pos : tuple <- (int, int)
        盤面上の駒の位置
    rev : bool
        上下反転して表示する
    '''
    _padding = (SQUARE_SIZE - PIECE_SIZE)/2
    _coord = np.asarray(pos)*SQUARE_SIZE + MARGIN + _padding
    if rev:
        _points = [_coord,
            _coord + (PIECE_SIZE, 0),
            _coord + (PIECE_SIZE/2, PIECE_SIZE)]
    else:
        _points = [_coord + (0, PIECE_SIZE),
            _coord + (PIECE_SIZE, PIECE_SIZE),
            _coord + (PIECE_SIZE/2, 0)]
    pygame.draw.polygon(screen, color, _points)
```

`pygame.draw.polygon`で多角形を描画できます。

ためしに一か所に赤駒を置いてみます。

```py {name="draw.py", hl_lines=[8]}
def setup(screen, font, turn):
    ...
    _text = font.render(
        ('先' if turn == 1 else '後') + '攻の駒の配置を決めてね（↓自分側　↑相手側）',
        True, BLACK)
    screen.blit(_text, (20, 20))
    _grid(screen, MARGIN + SQUARE_SIZE + (0, SQUARE_SIZE), 4, 2)
    _piece(screen, RED, (3, 2))
```

{{< img src=pieces alt="駒の表示" >}}

<br>

## ボタン

配置を決定したあとに押す確定ボタンを描きます。

```py {name="draw.py", hl_lines=["2-24", 33]}
...
def _button(screen, font, coord, size, text, disabled=True):
    '''
    ボタンを描画する

    screen : pygame.display.set_mode
    font : pygame.font.SysFont
        フォント
    color : tuple <- (int, int, int)
        背景色
    coord : tuple <- (int, int)
        左上の座標
    size : tuple <- (int, int)
        横、縦のサイズ
    text : str
        中身のテキスト
    disabled : bool
        押せなくする
    '''
    _color = (160, 140, 120) if disabled else (200, 180, 160)
    screen.fill(_color, (*coord, *size))
    _text = font.render(text, True, BLACK)
    _fsize = np.asarray(font.size(text))
    screen.blit(_text, coord + (size-_fsize)/2)

def setup(screen, font, turn):
    ...
    _text = font.render(
        ('先' if turn == 1 else '後') + '攻の駒の配置を決めてね（↓自分側　↑相手側）',
        True, BLACK)
    screen.blit(_text, (20, 20))
    _grid(screen, MARGIN + SQUARE_SIZE + (0, SQUARE_SIZE), 4, 2)
    _button(screen, font, (500, 530), (80, 50), 'OK')
```

`fill`は矩形を描くメソッドです。

`size`メソッドはテキストに必要な幅と高さを返します。

これを使ってテキストをボタンの中央に配置しています。

`disabled`という引数をとっているのは、すべてを配置するまでボタンを押せないようにするため、

それを視覚的に示すためです。

<br>

ついでに左クリックで赤、右クリックで青の駒が配置できることを説明するテキストを加えておきます。

{{< img src=button alt="ボタンの表示" >}}

---

これ表示するものはすべて表示できました。

{{< pstlk 次回 geister-app-dev-3 >}}は駒をグリッドの中にマウス操作で入れていけるようにします。

お読みいただきありがとうございました。

では:wave: