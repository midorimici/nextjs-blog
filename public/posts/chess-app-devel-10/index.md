---
title: 'チェスアプリ開発(10) アンパッサンの実装'
date: 2020-04-30T12:00:00+09:00
lastmod: 2020-09-27T12:00:00+09:00
categories: [プログラミング, チェスアプリ開発]
tags: [プログラミング, Python, アプリ開発, チェス]
draft: false
---

Python プログラムで動かすフェアリーチェスアプリ開発、連載第 10 回です。

{{< pstlk 前回 chess-app-devel-9 >}}は駒の移動にアニメーションを追加しました。

今回はチェスの特殊ルールであるアンパッサンを実装していきたいと思います。

<!--more-->

<br>

## アンパッサンとは

アンパッサンとはフランス語で en passant と書きます。

en + passer の現在分詞なのでおそらくジェロンディフというもので、

同時性や手段などさまざまな意味を表します。

英語で言うと分詞構文 passing というようなところで、

「通りながら」というような意味合いでしょうか。

<br>

ポーンは最初に動くときにだけ２歩まで前進することができるのですが、

相手のポーンが２歩前進した直後で、自分のポーンがそのポーンとある位置関係にあるときにのみ、

相手のそのポーンを取ることができます。

これを**アンパッサン**といいます。

{{< img src="en-passant" ext=gif alt=アンパッサン >}}

これを実装するためには、アンパッサンができる条件をしっかりと把握しておく必要があります。

1. 取るのも取られるのもポーンである。
1. 相手のポーンが２マス進んだ直後である。
1. 関わるポーンは隣接している。つまり同じランク（行）にいて、隣のファイル（列）にいる。

これらの条件の判定に使うために、関わる２つの駒の位置情報が必要です。

<br>

## 相手のポーンが２歩進んだ直後にのみ値が入る変数を設定する

条件式に使うために、相手のポーンが２歩進んだ直後にのみその座標を表す変数を設定します。

```py:main.py {hl_lines=[4, "11-16"]}
class Game:
    def __init__(self):
        ...
        self.advanced2_pos = None
        ...
    ...
    def main(self):
        ...
            if target and target.color == self.playersturn:
                ...
                # 相手のポーンが2歩進んだ
                if target.abbr == 'P':
                    if endpos[1] == startpos[1] + 2*target.direction:
                        self.advanced2_pos = endpos
                    else:
                        self.advanced2_pos = None
                self.renew_gameboard(startpos, endpos, self.gameboard)
                ...
```

`self.advanced2`はポーンが２歩進んだときに、次に何かの駒が動かされるまで`endpos`（２歩進んだポーンの位置）となります。

ポーンの２歩の動きではないときには、この変数は`None`となります。

`if`文によって「相手のポーンが２歩進んだ直後である」という条件が判別されています。

<br>

## アンパッサンの条件式を定義する

条件が複雑なので、関数の返り値として条件式を返してもらうことにします。

下を白側とすると、位置関係は次の図のようになります。

{{< img src=position ext=png alt=位置関係 >}}

```py:main.py
def en_passant_requirements(self, piece, startpos, endpos):
    '''
    アンパッサンの条件を満たすとき True を返す

    Parameters
    ----------
    piece : obj
        動かす駒．
    startpos, endpos : tuple > (int, int)
        開始位置，終了位置．

    Returns
    -------
    bool
    '''
    return (piece.abbr == 'P'
        and self.advanced2_pos
        and startpos[1] == endpos[1] - piece.direction
        and startpos[1] == self.advanced2_pos[1]
        and endpos[1] == self.advanced2_pos[1] + piece.direction
        and abs(startpos[0] - endpos[0]) == 1
        and abs(startpos[0] - self.advanced2_pos[0]) == 1
        and endpos[0] == self.advanced2_pos[0])
```

`piece.abbr == 'P'`によって、取る駒がポーンであることが保証されます。

`self.advanced2_pos`は直前にポーンが２歩進んだとき以外は`None`を返すので、

取られる駒がポーンであること、相手のポーンが２マス進んだ直後であることも保証されます。

残りの条件は上図の位置関係を表しています。

## 条件を満たすとき、そのマスに駒を動かすことができるようにする

これは移動可能なマスのリストを出力するメソッド`valid_moves()`を編集します。

```py:main.py {hl_lines=["4-7"]}
def valid_moves(self, piece, startpos, gameboard):
    ...
    result = piece.available_moves(*startpos, gameboard, color=piece.color)
    # アンパッサン
    for endpos in ([(i, 2) for i in range(8)] + [(i, 5) for i in range(8)]):
        if self.en_passant_requirements(piece, startpos, endpos):
            result += [endpos]
    # チェック回避のため動き縛り
    ...
```

アンパッサンをしたポーンの移動先のマスの候補としては、３ランクと６ランクのマスがあります。

`[(i, 2) for i in range(8)] + [(i, 5) for i in range(8)]`は、これらのマスをリスト内包表記で取り出しているものです。

<br>

## アンパッサンをされた駒を取り除く

盤面を更新するメソッド`renew_gameboard()`を編集するのですが、ここではアンパッサンが起きたときにのみ駒を取り除きたいので、

<p>

アンパッサンが起きる可能性があるときにのみ`True`となる
{{% tooltip %}}ブール変数((`True`か`False`のどちらか一方の値が入る変数{{% /tooltip %}}
を新たに定義します。

</p>

```py:main.py {hl_lines=[3, 11, 14, 31, "34-43"]}
def __init__(self):
    ...
    self.en_passant = False
    ...
...
　
def valid_moves(self, piece, startpos, gameboard):
    ...
    result = piece.available_moves(*startpos, gameboard, color=piece.color)
    # アンパッサン
    self.en_passant = False
    for endpos in ([(i, 2) for i in range(8)] + [(i, 5) for i in range(8)]):
        if self.en_passant_requirements(piece, startpos, endpos):
            self.en_passant = True
            result += [endpos]
    # チェック回避のため動き縛り
    ...
...
　
def renew_gameboard(self, startpos, endpos, gameboard):
    '''
    盤面を更新する

    Parameters
    ----------
    startpos, endpos : tuple > (int, int)
        開始位置，終了位置．絶対座標．
    gameboard : dict > {(int, int): obj, ...}
        盤面．
    '''
    color = gameboard[startpos].color
    gameboard[endpos] = gameboard[startpos]
    del gameboard[startpos]
    # アンパッサン
    if self.en_passant:
        if (color == WHITE
                and gameboard.get((endpos[0], endpos[1] - 1))):
            if (gameboard[endpos[0], endpos[1] - 1].name == 'BP'):
                del gameboard[(endpos[0], endpos[1] - 1)]
        elif (color == BLACK
                and gameboard.get((endpos[0], endpos[1] + 1))):
            if (gameboard[endpos[0], endpos[1] + 1].name == 'WP'):
                del gameboard[(endpos[0], endpos[1] + 1)]
```

これでアンパッサンを実装することができました！

{{< img src="en-passant-success" ext=gif alt=アンパッサン完成 width=360 >}}

---

<br>

## （おまけ）これまでのコードまとめ

これまでにいろんなところをいじっていろんなところが変わってしまったため、もとのコードと大きく離れてしまっています。

10 回目ということで、今まで編集してきたコードをまとめたものを GitHub に置いておきます。

→ [Release codes after 10 articles · midorimici/chess-program-for-python-and-OpenGL](https://github.com/midorimici/chess-program-for-python-and-OpenGL/releases/tag/v.1.0)

---

{{< pstlk 次回 chess-app-devel-11 >}}はプロモーションを実装していきたいと思います。

お読みいただきありがとうございました。

では:wave: