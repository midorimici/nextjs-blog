---
title: "ガイスターアプリ開発(6) 勝敗判定"
date: 2021-01-01T12:00:00+09:00
lastmod: 2021-01-05T12:00:00+09:00
categories: [プログラミング, ガイスターアプリ開発]
tags: [プログラミング, Python, アプリ開発]
draft: false
---

Python でつくるガイスター、連載第 6 回です。

{{< pstlk 前回 geister-app-dev-5 >}}は駒の移動と手番の交代を実装しました。

今回は勝敗の判定と表示をしていきます。

<!--more-->

<br>

## 勝敗判定

勝敗の条件を関数で定義します。

```py {name="game.py", hl_lines=["2-29", "33-37"]}
...
def win_req(taken, board, side, moved):
    '''
    side が勝利条件を満たすか
    -> bool

    taken : list <- [{'R': int, 'B': int}]
        取った駒
    board : dict <- {(int, int): Piece}
        ゲームボード
    side : int <- 0 | 1
        先攻(0), 後攻(1)
    moved : bool
        side が今駒を動かしたか
    '''
    assert side == 0 or side == 1, 'game.win_req の引数 side は 0, 1 の値を取ります'
    if not moved:
        # 赤を4つ取らせた
        if taken[(side+1)%2]['R'] == 4:
            return True
    else:
        # 青を4つ取った
        if taken[side]['B'] == 4:
            return True
        # 青が盤外に出た
        if side == 0 and ((0, -1) in board or (5, -1) in board):
            return True
        if side == 1 and ((0, 6) in board or (5, 6) in board):
            return True
...
def main(screen, font, font_small, orders, move_snd, chturn_snd):
    ...
    # 取った駒 [{'R': int, 'B': int}]
    _taken_pieces = [{'R': 0, 'B': 0}, {'R': 0, 'B': 0}]
    # 勝者
    # 0 - 先攻, 1 - 後攻
    _winner = -1
    ...
```

取った駒の色とその数を変数`_taken_pieces`に代入して、引数に渡します。

判定のタイミングは、駒を動かし終わったときにしますので、

マウスイベントの内部です。

```py {name="game.py", hl_lines=[2, "21-23" "30-36"], inline_hl=[0:[15]]}
...
def main(screen, font, font_small, orders, move_snd, chturn_snd, win_snd):
    ...
    while True:
        ...
        # イベントハンドリング
        for event in pygame.event.get():
            ...
            # マウスクリック
            if event.type == MOUSEBUTTONDOWN:
                # 左
                if event.button == 1:
                    ...
                    if _square_pos in _board and _board[_square_pos].side == _turn:
                        # 駒を選択したとき
                        _selecting_pos = _square_pos
                    else:
                        # 行先を選択したとき
                        if (_selecting_pos in _board
                                and _square_pos in _board[_selecting_pos].covering_squares(_selecting_pos)):
                            # 行先が相手の駒のとき
                            if _square_pos in _board and _board[_square_pos].side != _turn:
                                _taken_pieces[_turn][_board[_square_pos].color] += 1
                            # 駒の移動
                            move_snd.play()
                            _board[_square_pos] = _board[_selecting_pos]
                            del _board[_selecting_pos]
                            # 移動完了
                            _move_finished = True
                            # 勝利判定
                            if win_req(_taken_pieces, _board, _turn, True):
                                win_snd.play()
                                _winner = _turn
                            if win_req(_taken_pieces, _board, (_turn+1)%2, False):
                                win_snd.play()
                                _winner = (_turn+1)%2
                        _selecting_pos = None
            ...
```

自分が駒を動かした瞬間に相手が勝つ場合（相手の悪いおばけをすべて取ったとき）もあるので、

条件分岐は2つになっています。

<br>

## 画面に勝者を表示

次に勝敗が決まったときに画面に結果を表示します。

表示するものを関数で定義します。

```py {name="draw.py"}
...
def win_message(screen, font, side):
    '''
    勝敗の結果を知らせるメッセージを表示する

    screen : pygame.display.set_mode
    font : pygame.font.SysFont
        フォント
    side : int <- 0 | 1
    '''
    assert side == 0 or side == 1, 'draw.win_message の引数 side は 0, 1 の値を取ります'
    _str = ('先' if side == 0 else '後') + '攻の勝ち！'
    _text = font.render(_str, True, BLACK)
    _margin = (DISP_SIZE-(3*SQUARE_SIZE, SQUARE_SIZE))/2
    screen.fill(WHITE, (*_margin, 3*SQUARE_SIZE, SQUARE_SIZE))
    screen.blit(_text, DISP_SIZE/2-(len(_str)*32/2, 32/2))
...
```

勝者が決まったときにこれを描画します。

さらに、その画面でスペースキーを押すと隠れていたすべての駒の色を表示するようにします。

```py {name="game.py", hl_lines=["9-11", "21-24"]}
...
def main(screen, font, font_small, orders, move_snd, chturn_snd, win_snd):
    ...
    while True:
        ...
        # 盤面
        draw.board(screen, _board, _turn)
        ...
        # 勝敗
        if _winner == 0 or _winner == 1:
            draw.win_message(screen, font, _winner)
        ...
        # イベントハンドリング
        for event in pygame.event.get():
            ...
            # キー
            if event.type == KEYDOWN:
                ...
                # Space キー
                if event.key == K_SPACE:
                    if _winner >= 0:
                        # 開示
                        _winner = 2
                        _turn = 2
                    ...
```

`_winner = 2`は勝敗の表示を消すため、

`_turn = 2`はすべての駒を開示するためのものです。

`draw.board`の第三引数に`2`を指定すると{{< pstlk すべての駒の色を隠すことなく表示します "geister-app-dev-4/#盤面を描画する" >}}。

{{< video src=win opt=1 >}}

---

これでガイスターが遊べるようになりました！

コードは [GitHub](https://github.com/midorimici/py-geister) からどうぞ。

読んでくれてありがとうございました。

では:wave: