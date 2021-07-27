---
title: "チェスアプリ開発(17) チェス960 初期配置の決定"
date: 2020-09-26T12:00:00+09:00
lastmod: 2020-10-02T12:00:00+09:00
categories: [プログラミング, チェスアプリ開発]
tags: [プログラミング, Python, アプリ開発, チェス]
katex: true
draft: false
---

Python プログラムで動かすフェアリーチェスアプリ開発、連載第 17 回です。

{{< pstlk 前回 chess-app-devel-16 >}}は Pygame でゲームに効果音を追加しました。

今回は変則チェスのひとつである[チェス960](https://ja.wikipedia.org/wiki/%E3%83%81%E3%82%A7%E3%82%B9960)を追加してみたいと思います。

<!--more-->

<br>

## チェス960とは

チェスの初期配置を一定の条件のもとにランダム化するものです。

ポーンの位置は通常と同じで、残りの駒を次の条件を満たすよう白と黒が対称になるように配置します。

- 同色のビショップは色違いのマスに置く
- キングは自分のルークの間のどこかに置く

この条件を満たすような駒の配置は、

白マスのビショップの配置方法を決め、黒マスのビショップの配置方法を決め、

クイーンの配置方法を決め、そしてナイトの配置方法を決めれば、

キングがルークの間になければならないので、残りのルークとキングの配置は自動的に定まります。

よって合計で

$$ \begin{aligned}
4 \cdot 4 \cdot 6 \cdot {}_5 \mathrm{C} _2
&= 4 \cdot 4 \cdot 6 \cdot 10 \\\\ 
&= 960
\end{aligned} $$

より 960 通りの方法があります。

これがゲーム名の由来となっています。

通常の配置を除くと959通りになります。

<br>

## 初期配置生成

このチェス960をゲームに落とし込んでいきます。

まずは初期配置を生成します。

### シャッフルで生成する方法

条件を満たすまでポーン以外の駒の配置をシャッフルで生成する方法です。

```py {name="games.py"}
from random import shuffle

class Chess960:
    '''チェス960'''
    # 盤面のサイズ
    size = 8
    # キャスリングの有無
    castling = True
    # プロモーション先
    promote2 = [Knight, Bishop, Rook, Queen]
    # 駒の配置
    placers = {1: [Rook, Knight, Bishop, Queen, King, Bishop, Knight, Rook],
        2: [Pawn] * size}
    
    def __init__(self):
        # 駒の配置の決定
        while True:
            shuffle(self.placers[1])
            # 2つのビショップのマス色は違わなければならない
            bishops = [pos for pos, piece in enumerate(self.placers[1]) if piece == Bishop]
            if bishops[0] % 2 == bishops[1] % 2:
                continue
            # キングが2つのルークの間にいなければならない
            rooks = [pos for pos, piece in enumerate(self.placers[1]) if piece == Rook]
            if King not in self.placers[1][rooks[0]:rooks[1]]:
                continue
            # 通常の配置と異なる
            if self.placers[1] == [Rook, Knight, Bishop, Queen, King, Bishop, Knight, Rook]:
                continue
            break
    
    # 画像IDの割り当て
    ID = {}
    ...
```

全部で $ \frac{8!}{2!2!2!1!1!}=5040 $ 通りになるので、最悪 4000 通りほどの無駄が発生します。
### ID を使う方法

[ID番号](https://ja.wikipedia.org/wiki/%E3%83%81%E3%82%A7%E3%82%B9960#%E5%88%9D%E6%9C%9F%E4%BD%8D%E7%BD%AE%E3%81%AE_ID)から配置を割り出す方法があります。

0 - 959 までのランダムな数値を生成してから、対応する配置を生成することで、

無駄なく初期配置を生成できます。

> ID 番号から配置を割り出すには次のようにする。
>
> - ID番号を4で割った剰余は、白枡ビショップの位置を表す: 0 は b ファイル、1 は d ファイル、2 は f ファイル、3 は h ファイル。
> - 前項の商をさらに4で割った剰余は、黒枡ビショップの位置を表す: 0 は a ファイル、1 は c ファイル、2 は e ファイル、3 は g ファイル。
> - 前項の商をさらに6で割った剰余は、（2個のビショップを除いた）6個の空き枡におけるクイーンの位置を表す: 0 は いちばん左の空き枡、5 は いちばん右の空き枡。
> - 前項の商は、0 から 9 の間にある。これを KRN（カーン）コードと呼び、残り5つの枡におけるキング・ルーク・ナイトの位置を表す。

KRN コード|位置
:-------:| ---
0        | N N R K R
1        | N R N K R
2        | N R K N R
3        | N R K R N
4        | R N N K R
5        | R N K N R
6        | R N K R N
7        | R K N N R
8        | R K N R N
9        | R K R N N

（[チェス960 - Wikipedia](https://ja.wikipedia.org/wiki/%E3%83%81%E3%82%A7%E3%82%B9960#%E5%88%9D%E6%9C%9F%E4%BD%8D%E7%BD%AE%E3%81%AE_ID) より引用）

KRN コードの定義が少し面倒です。

キングがルークの間になければならないという制約があるので、ただ単にありえる順列を列挙すればいいというわけではありません。

```py {name="games.py", hl_lines=[1, "15-57"]}
from random import randint

class Chess960:
    '''チェス960'''
    # 盤面のサイズ
    size = 8
    # キャスリングの有無
    castling = True
    # プロモーション先
    promote2 = [Knight, Bishop, Rook, Queen]
    # 駒の配置
    placers = {1: [None] * size,
        2: [Pawn] * size}
    
    ID = {}
    
    def __init__(self):
        # 駒の配置の決定
        pos_id = randint(0, 959)
        while pos_id == 518:
            pos_id = randint(0, 959)
        krn = [
            [Knight, Knight, Rook, King, Rook],
            [Knight, Rook, Knight, King, Rook],
            [Knight, Rook, King, Knight, Rook],
            [Knight, Rook, King, Rook, Knight],
            [Rook, Knight, Knight, King, Rook],
            [Rook, Knight, King, Knight, Rook],
            [Rook, Knight, King, Rook, Knight],
            [Rook, King, Knight, Knight, Rook],
            [Rook, King, Knight, Rook, Knight],
            [Rook, King, Rook, Knight, Knight]
        ]

        q, r = pos_id//4, pos_id%4
        self.placers[1][2*r + 1] = Bishop

        q, r = q//4, q%4
        self.placers[1][2*r] = Bishop

        q, r = q//6, q%6
        for i in range(self.size):
            if self.placers[1][i] is None:
                if i == r:
                    self.placers[1][i] = Queen
                    break
            else: r += 1
        
        for piece in krn[q]:
            self.placers[1][self.placers[1].index(None)] = piece
            
        # 画像IDの割り当て
        for rk in self.placers:
            for fl in range(self.size):
                if self.placers[rk][fl] is not None:
                    self.ID['W' + self.placers[rk][fl].abbr] = self.size * rk + fl
                    self.ID['B' + self.placers[rk][fl].abbr] = -(self.size * rk + fl)
```

これで初期配置が生成できました。

<br>

## ゲーム追加

{{< pstlk 第15回 chess-app-devel-15 >}}の方法と同様にして、定義したゲームを追加していきます。

```py {name="games.py", hl_lines=[3, 4], ins=[1], del=[0], inline_hl=[1:[8]]}
...
# ゲーム選択画面に表示するゲーム
game_dict = {0: (Normal, withUnicorn)}
game_dict = {0: (Normal, Chess960, withUnicorn)}
```

```py {name="utils.py", hl_lines=[3, 4], ins=[1], del=[0], inline_hl=[1:[8]]}
...
# ゲーム選択画面に表示するゲーム名
game_name_dict = {0: ('Normal Chess', 'Unicorn')}
game_name_dict = {0: ('Normal Chess', 'Chess 960', 'Unicorn')}
...
```

これでチェス960が遊べるようになりました。

{{< img src=chess960 alt="チェス960 初期盤面" width=300 >}}

ところが、チェス960のキャスリングは少々特殊な処理を加える必要があります。

{{< pstlk 次回 chess-app-devel-18 >}}はキャスリング部分の実装をしていきます。

お読みいただきありがとうございました。

では:wave: