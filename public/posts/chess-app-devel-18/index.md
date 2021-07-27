---
title: "チェスアプリ開発(18) キャスリングの拡張（条件の一般化）"
date: 2020-10-02T12:00:00+09:00
lastmod: 2020-11-23T12:00:00+09:00
categories: [プログラミング, チェスアプリ開発]
tags: [プログラミング, Python, アプリ開発, チェス]
draft: false
---

Python プログラムで動かすフェアリーチェスアプリ開発、連載第 18 回です。

{{< pstlk 前回 chess-app-devel-17 >}}はチェス960の初期配置を生成して、基本的な部分は遊べるようになりました。

しかしチェス960のキャスリングは通常のキャスリングを拡大解釈する必要があります。

<!--more-->

今回はキャスリングの部分のコードを書き換えていきます。

拡張前のキャスリングの実装は第12回に載せています。

{{< relpos chess-app-devel-12 >}}

<br>

## チェス960におけるキャスリング

チェス960におけるキャスリングは、**通常のチェスのキャスリング後のキングとルークの位置と同じになるように**キングとルークを動かします。

つまり、a ファイル（白から見て左側）へのキャスリング（通常のチェスでのロングキャスリング）ではキングが c ファイルに、ルークが d ファイルに移動し、

h ファイル（白から見て右側）へのキャスリング（通常のチェスでのショートキャスリング）ではキングが g ファイルに、ルークが f ファイルに移動します。

キャスリングの条件も通常のチェスと変わりません。

<br>

通常のチェスと異なるのは、初期位置が異なるために、

キングやルークが全く移動しなかったり、かなり大きく移動したりすることがあるということです。

キングが１歩しか移動しないキャスリングもありえ、その場合は**キャスリングなのかキングが動いただけなのかが曖昧**になります。

そのあたりも考えながらコードに落とし込んでいきます。

<br>

## キャスリングのコードを編集

通常のチェスのキャスリングの実装は{{< pstlk 第12回 chess-app-devel-12 >}}で行いました。

この時点では「キングは必ず２歩移動する」など固定的な性質を利用して書いていた部分がありますので、これを一般化していきます。

<br>

キャスリングの条件を満たすかどうかを返すメソッドでは、

`common_req`, `piece_req`, `special_req`という３つの条件がすべて`True`のときに`True`を返すようにしていました。

```py {name="main.py", hl_lines=[59, 60, "63-65", "68-75", "78-84", "87-89", "92-99", "102-108"]}
def castling_requirements(self, piece, endpos, side, gameboard):
    '''
    キャスリングの条件を満たすとき，True
    side == 0 -> aファイル側
    side == 1 -> hファイル側

    Parameters
    ----------
    piece : obj
        駒．キングでなければ return は False．
    endpos : tuple > (int, int)
        終了位置．絶対座標．
    side : int > 0, 1
        0 -- クイーンサイド
        1 -- キングサイド
    gameboard : dict > {(int, int): obj, ...}
        盤面．

    Returns
    -------
    bool
    '''
    def create_tmp_board(startpos_y, endpos):
        '''
        キングの通過するマスが攻撃されていないことを確認するために，
        キングがそのマスに動いたときに攻撃されるかを見るための
        仮の盤面を出力する
        
        Parameters
        ----------
        startpos_y : int
            開始位置y座標．
        endpos : tuple > (int, int)
            終了位置．絶対座標．

        Returns
        -------
        gameboard_tmp : dict > {(int, int): obj, ...}
        '''
        ...

    def path_is_not_attacked(startpos_y, king_route):
        '''
        キングが通るマスのどれかが相手の駒に攻撃されていれば False を返す
        
        Parameters
        ----------
        startpos_y : int
            開始位置y座標．
        king_route : list > [int, ...]
            キングが通る位置x座標のリスト．

        Returns
        -------
        bool
        '''
        ...

    common_req = (self.can_castling[piece.color][side]  # キャスリングに関与する駒が一度も動いていない
                    and not self.is_check(piece.color, gameboard))  # キングがチェックされていない
    # 白のキャスリング
    if piece.color == 'W':
        piece_req = (piece.name == 'WK'
                        and (7*side, 0) in gameboard
                        and gameboard[(7*side, 0)].name == 'WR')
        # クイーンサイド
        if side == 0:
            special_req = (endpos == (2, 0)
                            # キングとルークの間に駒がない
                            and (1, 0) not in self.gameboard
                            and (2, 0) not in self.gameboard
                            and (3, 0) not in self.gameboard
                            # キングが通過するマスが敵に攻撃されていない
                            and path_is_not_attacked(0, [2, 3])
                            )
        # キングサイド
        if side == 1:
            special_req = (endpos == (6, 0)
                            # キングとルークの通過するマスに駒がない
                            and (6, 0) not in self.gameboard
                            and (5, 0) not in self.gameboard
                            # キングが通過するマスが敵に攻撃されていない
                            and path_is_not_attacked(0, [6, 5])
                            )
    # 黒のキャスリング
    if piece.color == 'B':
        piece_req = (piece.name == 'BK'
                        and (7*side, 7) in gameboard
                        and gameboard[(7*side, 7)].name == 'BR')
        # クイーンサイド
        if side == 0:
            special_req = (endpos == (2, 7)
                            # キングとルークの通過するマスに駒がない
                            and (1, 7) not in self.gameboard
                            and (2, 7) not in self.gameboard
                            and (3, 7) not in self.gameboard
                            # キングが通過するマスが敵に攻撃されていない
                            and path_is_not_attacked(7, [2, 3])
                            )
        # キングサイド
        if side == 1:
            special_req = (endpos == (6, 7)
                            # キングとルークの通過するマスに駒がない
                            and (6, 7) not in self.gameboard
                            and (5, 7) not in self.gameboard
                            # キングが通過するマスが敵に攻撃されていない
                            and path_is_not_attacked(7, [6, 5])
                            )

    return common_req and piece_req and special_req
```

このうち`common_req`については編集する必要がありません。

これは「キャスリングに関与する駒が一度も動いていない」および「キングがチェックされていない」ことを保証する変数ですが、

これらはキングやルークの初期位置が関わらないからです。

<br>

`piece_req`はどうでしょう。

これは「動かす駒が自分のキングであること」と「キャスリングに関与するルークが初期位置にあること」を保証します。

前半は関係しませんが、後半は初期位置が関係してくるので、編集が必要です。

必要になるのはルークの初期位置です。

<br>

`special_req`も編集が必要です。

これには「キングのキャスリング後の位置」「ルークの通過するマスの座標」「キングが通過するマスの座標」の３つが必要であり、

このうち後ろの２つを変更しなければなりません。

それには「ルークの初期位置」「キングの初期位置」が最低限必要になります。

### ルーク・キングの初期位置を取得する

初期位置といっても x 座標しか使いませんので、それだけ取得できれば十分です。

初期位置は`games`モジュールに定義されている各クラスのプロパティ`placers`に、次のような形で定義されています。

```py
placers = {1: [Rook, Knight, Bishop, Queen, King, Bishop, Knight, Rook],
        2: [Pawn] * size}
```

x 座標はリストのインデックスと等しいので、`enumerate`関数を使って次のように初期位置のリストを取得することができます。

```py
rook_init_pos = [pos for pos, piece in enumerate(placers[1]) if piece == Rook]
king_init_pos = placers[1].index(King)
```

ルークは複数個存在しえますが、キングはひとつしか存在しえないので、`index`を使えばよいでしょう。

<br>

これらを使って、`piece_req`と`special_req`を書き換えると、例えば次のようになります。

```py {hl_lines=["2-5"], ins=["2-3"], del=["0-1"], inline_hl=[0:["2-5"], 1:["3-6"], 2:["2-5"], 3:["3-6"]]}
piece_req = (piece.name == 'WK'
                and (7*side, 0) in gameboard
                and gameboard[(7*side, 0)].name == 'WR')
                and (rook_init_pos[side], 0) in gameboard
                and gameboard[(rook_init_pos[side], 0)].name == 'WR')
```

```py {hl_lines=["1-9", "12-16", "18-19"], ins=["0-8", "12-13", 15], del=["9-11", 14], inline_hl=[14:["5-9"], 15:["5-16"]]}
gameboard_tmp = copy(gameboard)
# キャスリングに関与するキングとルークは除外して考える
if (king_init_pos, 0) in gameboard_tmp:
    del gameboard_tmp[(king_init_pos, 0)]
if (rook_init_pos[side], 0) in gameboard_tmp:
    del gameboard_tmp[(rook_init_pos[side], 0)]
# キングとルークの通過するマス
king_route = list(range(2, king_init_pos)) + list(range(2, king_init_pos, -1))
rook_route = list(range(3, rook_init_pos[side])) + list(range(3, rook_init_pos[side], -1))
special_req = (endpos == (2, 0)
                # キングとルークの通過するマスに駒がない
                and (1, 0) not in self.gameboard
                and (2, 0) not in self.gameboard
                and (3, 0) not in self.gameboard
                and not any((x, 0) in gameboard_tmp
                    for x in king_route + rook_route)
                # キングが通過するマスが敵に攻撃されていない
                and path_is_not_attacked(0, [2, 3])
                and path_is_not_attacked(0, list(x for x in range(2, king_init_pos))
                )
```

同様にして他の場合についても書き換えると次のようになります。

盤面の大きさはゲームによっては8とは限らないので、`size`から計算しています。

```py {name="main.py", hl_lines=["3-6", "13-22", "25-27", "30-34", "36-37", "41-45", "47-50" "52-53", "58-67", "70-74", "76-80", "82-83", "87-91", "93-96", "98-99"], ins=["0-3", "6-16", "20-21", "23-26", 28, "31-32", 34, "37-47", 49, "53-54", "56-59", 61, "64-65", 67], del=["4-5", "17-19", 22, 27, "29-30", 33, "35-36", 48, "50-52", 55, 60, "62-63", 66], inline_hl=[4:["2-5"], 5:["3-6"], 6:["2-5"], 7:["3-6"], 22:["5-9"], 23:["5-16"], 27:["6-7"], 28:["6-9"], 33:["5-9"], 34:["5-21"], 35:["2-5"], 36:["3-6"], 37:["2-5"], 38:["3-6"], 48:[8], 49:["8-10"], 55:["3-9"], 56:["3-18"], 60:["6-8"], 61:["6-12"], 66:["3-9"], 67:["3-23"]]}
def castling_requirements(self, piece, endpos, side, gameboard):
    ...
    size = self.kind.size
    
    rook_init_pos = [pos for pos, piece in enumerate(self.kind.placers[1]) if piece == Rook]
    king_init_pos = self.kind.placers[1].index(King)
    ...
    common_req = (self.can_castling[piece.color][side]  # キャスリングに関与する駒が一度も動いていない
                    and not self.is_check(piece.color, gameboard))  # キングがチェックされていない
    # 白のキャスリング
    if piece.color == 'W':
        piece_req = (piece.name == 'WK'
                        and (7*side, 0) in gameboard
                        and gameboard[(7*side, 0)].name == 'WR')
                        and (rook_init_pos[side], 0) in gameboard
                        and gameboard[(rook_init_pos[side], 0)].name == 'WR')
        gameboard_tmp = copy(gameboard)
        # キャスリングに関与するキングとルークは除外して考える
        if (king_init_pos, 0) in gameboard_tmp:
            del gameboard_tmp[(king_init_pos, 0)]
        if (rook_init_pos[side], 0) in gameboard_tmp:
            del gameboard_tmp[(rook_init_pos[side], 0)]
        # クイーンサイド
        if side == 0:
            # キングとルークの通過するマス
            king_route = list(range(2, king_init_pos)) + list(range(2, king_init_pos, -1))
            rook_route = list(range(3, rook_init_pos[side])) + list(range(3, rook_init_pos[side], -1))
            special_req = (endpos == (2, 0)
                            # キングとルークの間に駒がない
                            and (1, 0) not in self.gameboard
                            and (2, 0) not in self.gameboard
                            and (3, 0) not in self.gameboard
                            and not any((x, 0) in gameboard_tmp
                                for x in king_route + rook_route)
                            # キングが通過するマスが敵に攻撃されていない
                            and path_is_not_attacked(0, [2, 3])
                            and path_is_not_attacked(0, list(x for x in range(2, king_init_pos)))
                            )
        # キングサイド
        if side == 1:
            # キングとルークの通過するマス
            king_route = list(range(size - 2, king_init_pos)) + list(range(size - 2, king_init_pos, -1))
            rook_route = list(range(size - 3, rook_init_pos[side])) + list(range(size - 3, rook_init_pos[side], -1))
            special_req = (endpos == (6, 0)
            special_req = (endpos == (size - 2, 0)
                            # キングとルークの通過するマスに駒がない
                            and (6, 0) not in self.gameboard
                            and (5, 0) not in self.gameboard
                            and not any((x, 0) in gameboard_tmp
                                for x in king_route + rook_route)
                            # キングが通過するマスが敵に攻撃されていない
                            and path_is_not_attacked(0, [6, 5])
                            and path_is_not_attacked(0, list(x for x in range(size - 2, king_init_pos, -1)))
                            )
    # 黒のキャスリング
    if piece.color == 'B':
        piece_req = (piece.name == 'BK'
                        and (7*side, 7) in gameboard
                        and gameboard[(7*side, 7)].name == 'BR')
                        and (rook_init_pos[side], size - 1) in gameboard
                        and gameboard[(rook_init_pos[side], size - 1)].name == 'BR')
        gameboard_tmp = copy(gameboard)
        # キャスリングに関与するキングとルークは除外して考える
        if (king_init_pos, size - 1) in gameboard_tmp:
            del gameboard_tmp[(king_init_pos, size - 1)]
        if (rook_init_pos[side], size - 1) in gameboard_tmp:
            del gameboard_tmp[(rook_init_pos[side], size - 1)]
        # クイーンサイド
        if side == 0:
            # キングとルークの通過するマス
            king_route = list(range(2, king_init_pos)) + list(range(2, king_init_pos, -1))
            rook_route = list(range(3, rook_init_pos[side])) + list(range(3, rook_init_pos[side], -1))
            special_req = (endpos == (2, 7)
            special_req = (endpos == (2, size - 1)
                            # キングとルークの通過するマスに駒がない
                            and (1, 7) not in self.gameboard
                            and (2, 7) not in self.gameboard
                            and (3, 7) not in self.gameboard
                            and not any((x, size - 1) in gameboard_tmp
                                for x in king_route + rook_route)
                            # キングが通過するマスが敵に攻撃されていない
                            and path_is_not_attacked(7, [2, 3])
                            and path_is_not_attacked(size - 1, list(x for x in range(2, king_init_pos)))
                            )
        # キングサイド
        if side == 1:
            # キングとルークの通過するマス
            king_route = list(range(size - 2, king_init_pos)) + list(range(size - 2, king_init_pos, -1))
            rook_route = list(range(size - 3, rook_init_pos[side])) + list(range(size - 3, rook_init_pos[side], -1))
            special_req = (endpos == (6, 7)
            special_req = (endpos == (size - 2, size - 1)
                            # キングとルークの通過するマスに駒がない
                            and (6, 7) not in self.gameboard
                            and (5, 7) not in self.gameboard
                            and not any((x, size - 1) in gameboard_tmp
                                for x in king_route + rook_route)
                            # キングが通過するマスが敵に攻撃されていない
                            and path_is_not_attacked(7, [6, 5])
                            and path_is_not_attacked(size - 1, list(x for x in range(size - 2, king_init_pos, -1)))
                            )

    return common_req and piece_req and special_req
```

`create_tmp_board`の中身も変更しておきます。

```py {name="main.py", hl_lines=["21-26"], ins=["3-5"], del=["0-2"], inline_hl=[0:[2], 1:[7], 2:[3], 3:[2], 4:[7], 5:[3]]}
def castling_requirements(self, piece, endpos, side, gameboard):
    ...
    def create_tmp_board(startpos_y, endpos):
        '''
        キングの通過するマスが攻撃されていないことを確認するために，
        キングがそのマスに動いたときに攻撃されるかを見るための
        仮の盤面を出力する

        Parameters
        ----------
        startpos_y : int
            開始位置y座標．
        endpos : tuple > (int, int)
            終了位置．絶対座標．

        Returns
        -------
        gameboard_tmp : dict > {(int, int): obj, ...}
        '''
        gameboard_tmp = copy(gameboard)
        if (4, startpos_y) in gameboard_tmp:
            gameboard_tmp[endpos] = gameboard_tmp[(4, startpos_y)]
            del gameboard_tmp[(4, startpos_y)]
        if (king_init_pos, startpos_y) in gameboard_tmp:
                gameboard_tmp[endpos] = gameboard_tmp[(king_init_pos, startpos_y)]
                del gameboard_tmp[(king_init_pos, startpos_y)]
        return gameboard_tmp
```


<br>

これでキャスリングの条件判定は正しく行えるようになりました。

ただし、まだ駒の再配置のコードの変更や、キングが１歩しか移動しない場合の曖昧性の排除が必要です。

長くなってしまったので、それは{{< pstlk 次回 chess-app-devel-19 >}}以降にまわしたいと思います。

お読みいただきありがとうございました。

ではまた:wave: