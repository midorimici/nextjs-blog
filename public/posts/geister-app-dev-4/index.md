---
title: "ガイスターアプリ開発(4) 初期盤面"
date: 2020-12-19T12:00:00+09:00
lastmod: 2021-01-01T12:00:00+09:00
categories: [プログラミング, ガイスターアプリ開発]
tags: [プログラミング, Python, アプリ開発]
draft: false
---

Python でつくるガイスター、連載第 4 回です。

{{< pstlk 前回 geister-app-dev-3 >}}はマウス操作で駒の初期配置を決められるようになりました。

今回はゲーム本番での初期盤面を描画するところまでやっていきます。

<!--more-->

<br>

## モジュールに切り分ける

駒の初期配置を決定するモジュールと、ゲーム本番での動作を規定するモジュールを分けて書きたいので、

共通部分だけ`main.py`に置いて、そこから各モジュールを呼び出す形にします。

<details>
<summary><code>setup.py</code></summary>
<br>

```py {name="setup.py"}
import sys

import pygame
from pygame.locals import *

from config import IVORY
import draw, mouse


def _check_color(colors):
    '''
    駒がすべて配置済みで赤と青が半分ずつあるか
    -> bool

    colors : list <- [str]
        色のリスト
    '''
    return (len(colors) == 8
        and len([s for s in colors if s == 'R'])
            == len([s for s in colors if s == 'B']))


def main(screen, font, select_snd, decide_snd, forbid_snd):
    # 配置を決定する側
    # 0 - 先攻, 1 - 後攻
    _state = 0
    # 決定された初期配置
    # [{(int, int): Piece}]
    _order = [{}, {}]

    while True:
        satisfied = _check_color(list(_order[_state].values()))

        screen.fill(IVORY)
        draw.setup(screen, font, _state, _order[_state], not satisfied)
        pygame.display.update()

        # イベントハンドリング
        for event in pygame.event.get():
            # 閉じるボタン
            if event.type == QUIT:
                pygame.quit()
                sys.exit()
            # マウスクリック
            if event.type == MOUSEBUTTONDOWN:
                # 左
                if event.button == 1:
                    _mouse_pos = event.pos
                    _square_pos = tuple(mouse.chcoord(_mouse_pos))

                    for i in range(1, 5):
                        for j in range(2, 4):
                            if _square_pos == (i, j):
                                select_snd.play()
                                _order[_state][(i, j)] = 'R'
                    
                    if mouse.on_area(*_mouse_pos, 500, 530, 80, 50):
                        if satisfied:
                            decide_snd.play()
                            _state += 1
                        else:
                            forbid_snd.play()
                # 右
                elif event.button == 3:
                    _mouse_pos = event.pos
                    _square_pos = tuple(mouse.chcoord(_mouse_pos))

                    for i in range(1, 5):
                        for j in range(2, 4):
                            if _square_pos == (i, j):
                                select_snd.play()
                                _order[_state][(i, j)] = 'B'
            # キー
            if event.type == KEYDOWN:
                # Esc キー
                if event.key == K_ESCAPE:
                    pygame.quit()
                    sys.exit()
```

</details>

<details>
<summary><code>game.py</code></summary>
<br>

```py {name="game.py"}
import sys

import pygame
from pygame.locals import *

from config import IVORY


def main(screen):
    while True:
        screen.fill(IVORY)
        pygame.display.update()

        # イベントハンドリング
        for event in pygame.event.get():
            # 閉じるボタン
            if event.type == QUIT:
                pygame.quit()
                sys.exit()
            # キー
            if event.type == KEYDOWN:
                # Esc キー
                if event.key == K_ESCAPE:
                    pygame.quit()
                    sys.exit()
```

</details>

<details>
<summary><code>main.py</code></summary>
<br>

```py {name="main.py", hl_lines=["21-22"]}
import sys

import pygame
from pygame.locals import *

from config import DISP_SIZE
import setup, game


if __name__ == '__main__':
    pygame.init()
    # 音声の設定
    snd = pygame.mixer.Sound
    select_snd = snd('./sounds/select.wav')
    decide_snd = snd('./sounds/decide.wav')
    forbid_snd = snd('./sounds/forbid.wav')

    pygame.display.set_caption('Geister')
    font = pygame.font.SysFont('hg丸ｺﾞｼｯｸmpro', 16)

    setup.main(screen, font, select_snd, decide_snd, forbid_snd)
    game.main(screen)
```

</details>

<br>

`setup.py`での`while`ループが終了すれば`game.py`でのループが開始します。

<br>

## 駒クラスを作成する

盤面のデータは、位置：駒の辞書型にすることにします。

駒はオブジェクトとして、どちら側の駒か、色は何かなどの属性を持たせます。

```py {name="piece.py"}
import numpy as np

class Piece:
    def __init__(self, color, side):
        self.color = color  # 赤('R') or 青('B')
        self.side = side    # 先攻(0) or 後攻(1)
    
    def __repr__(self):
        return self.color + str(self.side)
    
    def covering_squares(self, pos):
        '''
        可能な移動先のマスのリスト
        -> list <- [(int, int)]

        pos : tuple <- (int, int)
            現在の位置
        '''
        pos_ = np.asarray(pos) + [(0, 1), (0, -1), (-1, 0), (1, 0)]
        dest = [(x, y) for x, y in pos_ if 0 <= x <= 5 and 0 <= y <= 5]
        if self.color == 'B':
            if self.side == 0:
                if pos == (0, 0):
                    dest += [(0, -1)]
                if pos == (5, 0):
                    dest += [(5, -1)]
            elif self.side == 1:
                if pos == (0, 5):
                    dest += [(0, 6)]
                if pos == (5, 5):
                    dest += [(5, 6)]

        return dest
```

`__repr__`メソッドはデバッグのときに役立ちます。

`print`したときに出力される文字列を返しますが、これがないとオブジェクトidだけを返すので属性の情報がわかりづらくなります。

<br>

`convering_squares`メソッドの条件分岐は、良いおばけが相手の陣地の角から脱出することができるようにするものです。

<br>

## 初期盤面を生成する

プレイヤーの配置から初期盤面を生成する関数を作ります。

```py {name="setup.py"}
...
from piece import Piece
...

def _init_board(order1, order2):
    '''
    駒の配置から初期盤面を出力
    -> dict <- {(int, int): Piece}

    order1, order2 : dict <- {(int, int): str}
        駒の初期配置. order1 が先攻
    '''
    return {**{(5-x, 3-y): Piece(s, 1) for (x, y), s in order2.items()},
        **{(x, y+2): Piece(s, 0) for (x, y), s in order1.items()}}

```

盤面は左上が`(0, 0)`から右下が`(5, 5)`までで座標を取っていて、

駒の位置は先手が`(1, 4)`から`(4, 5)`、後手が`(1, 0)`から`(4, 1)`までとなります。

マウスで登録したときには左上`(1, 2)`、右下`(4, 3)`になっているので、座標を変換しています。

先手は平行移動だけですが、後手は180度回転もしています。

<br>

これで`_init_board(*_order)`とすれば、初期盤面を返すことができます。

これを`setup.main()`の返り値として`main.py`に渡し、

さらに`game.py`に引数として渡すことで盤面を描画していきます。

```py {name="setup.py", hl_lines=[14]}
...
        # イベントハンドリング
        for event in pygame.event.get():
            ...
            # マウスクリック
            if event.type == MOUSEBUTTONDOWN:
                # 左
                if event.button == 1:
                    ...
                    
                    if mouse.on_area(*_mouse_pos, 500, 530, 80, 50):
                        if satisfied:
                            decide_snd.play()
                            if _state == 1: return _init_board(*_order)
                            _state += 1
                        ...
```

```py {name="main.py", hl_lines=["4-5"], inline_hl=[0:["0-1"], 1:["5-6"]]}
...
if __name__ == '__main__':
    ...
    orders = setup.main(screen, font, select_snd, decide_snd, forbid_snd)
    game.main(screen, orders)
```

```py {name="game.py", hl_lines=[2], inline_hl=[0:["4-5"]]}
...
def main(screen, orders):
    ...
```

### 盤面を描画する

さて、盤面を描画する関数を定義していきます。

ガイスターでは良いおばけが盤の角から外に出ると勝ちというルールがあるので、

角に矢印を描いています。

```py {name="draw.py"}
...
def _arrow(screen, coord, direction):
    '''
    矢印を描く

    screen : pygame.display.set_mode
    coord : tuple <- (int, int)
        矢先の座標
    direction : str <- 'U', 'D'
        'U' - 上, 'D' - 下
    '''
    assert direction == 'U' or direction == 'D',\
        'draw._arrow の引数 direction は "U", "D" の値を取ります'
    _coord = np.asarray(coord)
    if direction == 'D':
        pygame.draw.line(screen, BLACK,
            _coord, _coord + (PIECE_SIZE/2, -PIECE_SIZE/2), 2)
        pygame.draw.line(screen, BLACK,
            _coord, _coord - (PIECE_SIZE/2, PIECE_SIZE/2), 2)
        pygame.draw.line(screen, BLACK,
            _coord, _coord - (0, PIECE_SIZE), 2)
    else:
        pygame.draw.line(screen, BLACK,
            _coord, _coord + (PIECE_SIZE/2, PIECE_SIZE/2), 2)
        pygame.draw.line(screen, BLACK,
            _coord, _coord + (-PIECE_SIZE/2, PIECE_SIZE/2), 2)
        pygame.draw.line(screen, BLACK,
            _coord, _coord + (0, PIECE_SIZE), 2)
...
def board(screen, board, turn):
    '''
    ゲームボードと盤面上の駒を描く

    screen : pygame.display.set_mode
    board : dict <- {(int, int): Piece}
        駒の位置とオブジェクト
    turn : int <- 0, 1, 2
        0 - 先攻の駒を開く, 1 - 後攻の駒を開く, 2 - 両方開く,
    '''
    assert turn == 0 or turn == 1 or turn == 2, 'draw.board の引数 turn は 0, 1, 2 の値を取ります'
    # グリッド
    _grid(screen, MARGIN, 6, 6)
    # 角の矢印
    _padding = (SQUARE_SIZE - PIECE_SIZE)/2
    _arrow(screen, MARGIN+(SQUARE_SIZE/2, _padding), 'U')
    _arrow(screen, MARGIN+(11*SQUARE_SIZE/2, _padding), 'U')
    _arrow(screen, DISP_SIZE-MARGIN-(SQUARE_SIZE/2, _padding), 'D')
    _arrow(screen, DISP_SIZE-MARGIN-(11*SQUARE_SIZE/2, _padding), 'D')
    # 駒
    for pos, piece in board.items():
        if turn == 2:
            if piece.side == 0:
                _piece(screen, RED if piece.color == 'R' else BLUE, pos)
            else:
                _piece(screen, RED if piece.color == 'R' else BLUE, pos, True)
        elif turn == 0:
            if piece.side == 0:
                _piece(screen, RED if piece.color == 'R' else BLUE, pos)
            else:
                _piece(screen, GREY, pos, True)
        elif turn == 1:
            if piece.side == 0:
                _piece(screen, GREY, pos)
            else:
                _piece(screen, RED if piece.color == 'R' else BLUE, pos, True)
```

`BLACK`や`GREY`は色の定数で、`config.py`に定義しています。

<br>

これを`game.py`で呼び出します。

```py {name="game.py", hl_lines=[10]}
...
import draw
...
def main(screen, orders):
    # ゲームボード {(int, int): Piece}
    _board = orders

    while True:
        screen.fill(IVORY)
        draw.board(screen, _board, 0)
        pygame.display.update()
        ...
```

これで駒の配置を決定したあとに、初期盤面が表示されます。

{{< img src=board alt="初期盤面" >}}

---

{{< pstlk 次回 geister-app-dev-5 >}}は駒の移動とターン交代時の画面を用意します。

読んでくれてありがとうございました。

では:wave: