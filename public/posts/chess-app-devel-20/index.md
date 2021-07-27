---
title: "チェスアプリ開発(20) プロモーションの拡張"
date: 2020-11-23T12:00:00+09:00
lastmod: 2020-12-07T12:00:00+09:00
categories: [プログラミング, チェスアプリ開発]
tags: [プログラミング, Python, アプリ開発, チェス]
draft: false
---

Python プログラムで動かすフェアリーチェスアプリ開発、連載第 20 回です。

{{< pstlk 前回 chess-app-devel-19 >}}でフェアリーチェスへのキャスリングの拡張が完了しました。

今回はポーンのプロモーションの拡張をしていきます。

<!--more-->

拡張前のプロモーションの実装は第11回に載せています。

{{< relpos chess-app-devel-11 >}}

<br>

## ゲーム毎にプロモーション先候補を指定

まずはゲームによって異なるプロモーション先候補を、各ゲームクラスの
{{% tltp プロパティ %}}オブジェクトが参照できるデータ{{% /tltp %}}
として定義することが必要です。

これは{{< pstlk 第15回 "chess-app-devel-15/#ゲームを定義する" >}}ですでに完了しています。

```py {name="games.py", hl_lines=[7, 8]}
class Normal:
    '''通常のチェス'''
    # 盤面のサイズ
    size = 8
    # キャスリングの有無
    castling = True
    # プロモーション先
    promote2 = [Knight, Bishop, Rook, Queen]
    # 駒の配置
    placers = {1: [Rook, Knight, Bishop, Queen, King, Bishop, Knight, Rook],
        2: [Pawn] * size}
    # 画像IDの割り当て
    ID = {}
    for rk in placers:
        for fl in range(size):
            if placers[rk][fl] is not None:
                ID['W' + placers[rk][fl].abbr] = size * rk + fl
                ID['B' + placers[rk][fl].abbr] = -(size * rk + fl)
```

`promote2`というリストの中からポーンのプロモーション先が選択されます。

<br>

## プロモーション時に表示する選択肢を一般化

次にプロモーションの選択肢として表示される駒を、このリストに合わせて変更しなければなりません。

現在プロモーション選択肢の表示部分のコードは次のようになっています。

```py {name="main.py", hl_lines=["12-15"]}
...
class Game:
    ...
    def draw(self):
        '''描画コールバック'''
        ...
            # プロモーション
            if self.prom:
                draw_balloon(*self.endpos)
                piece_color = self.gameboard[self.endpos].color
                glEnable(GL_TEXTURE_2D)
                draw_img(2.0, 3.5, piece_ID[piece_color + 'N'])
                draw_img(3.0, 3.5, piece_ID[piece_color + 'B'])
                draw_img(4.0, 3.5, piece_ID[piece_color + 'R'])
                draw_img(5.0, 3.5, piece_ID[piece_color + 'Q'])
                glDisable(GL_TEXTURE_2D)
            ...
```

12-15行目がプロモーション先を固定してしまっているので、この部分を変更します。

どの位置座標にどの駒の画像を配置するかもゲームによって変化しますので、

表示幅は 4 列までとして行を増やしていく形で描画します。

```py {name="main.py", hl_lines=["6-14"], ins=["4-8"], del=["0-3"]}
# プロモーション
if self.prom:
    draw_balloon(*self.endpos)
    piece_color = self.gameboard[self.endpos].color
    glEnable(GL_TEXTURE_2D)
    draw_img(2.0, 3.5, piece_ID[piece_color + 'N'])
    draw_img(3.0, 3.5, piece_ID[piece_color + 'B'])
    draw_img(4.0, 3.5, piece_ID[piece_color + 'R'])
    draw_img(5.0, 3.5, piece_ID[piece_color + 'Q'])
    for i in range(len(self.kind.promote2)):
        draw_img(2.0 + i % 4,
            3.5 + ((len(self.kind.promote2) - 1)//4)/2 - i//4,
            self.kind.ID[piece_color +
                self.kind.promote2[i].abbr])
    glDisable(GL_TEXTURE_2D)
```

<br>

また、それに伴って吹き出しの縦幅も増やす必要があります。

吹き出しは`draw_balloon`関数が描画していますので、そちらの中身を書き換えます。

```py {name="utils.py", hl_lines=["1-2", "10-11", "15-22"], ins=["1-3", "8-11"], del=[0, "4-7"], inline_hl=[1:["6-9"], 6:["2-4"], 7:["2-4"], 8:["5-15"], 9:["5-15"], 10:["2-23"], 11:["2-23"]]}
def draw_balloon(x, y):
def draw_balloon(x, y, num=4):
    '''
    プロモーションのときの吹き出しを描画する

    Parameters
    ----------
    x, y : int
        駒の座標．
    num : int, default 4
        プロモーション選択肢数．
    '''
    glColor(0.5, 0.5, 0.5)  # 色の指定
    glBegin(GL_QUADS)       # 四角形を描画
    glVertex(1.0, 2.5)
    glVertex(1.0, 4.5)
    glVertex(6.0, 4.5)
    glVertex(6.0, 2.5)
    glVertex(1.0, 2.5 - ((num - 1) // 4) / 2)
    glVertex(1.0, 4.5 + ((num - 1) // 4) / 2)
    glVertex(2.0 + num if num <= 4 else 6.0, 4.5 + ((num - 1) // 4) / 2)
    glVertex(2.0 + num if num <= 4 else 6.0, 2.5 - ((num - 1) // 4) / 2)
    glEnd()
    glBegin(GL_TRIANGLES)   # 三角形を描画
    glVertex(3.0, 3.5)
    glVertex(4.0, 3.5)
    glVertex(x, y)
    glEnd()
```

`glBegin`から`glEnd`までの間の４つの`glVertex`が四角形の各頂点の位置を指定しています。

新たに追加いた引数`num`=プロモーション選択肢の数によってこの座標を調整しています。

`(num - 1) // 4`は`num`が`4`までのとき`0`、`8`までのとき`1`というように増えていくので、

縦方向の座標`2.5`と`4.5`を基準に縦幅が増えていくことになります。

横幅は`2.0 + num if num <= 4 else 6.0`というふうに、選択肢が４つ以下かどうかで変えています。

<br>

吹き出し描画部分のコードも変更します。

```py {name="main.py", hl_lines=["3-4"], ins=[1], del=[0], inline_hl=[1:["6-16"]]}
# プロモーション
if self.prom:
    draw_balloon(*self.endpos)
    draw_balloon(*self.endpos, num=len(self.kind.promote2))
    piece_color = self.gameboard[self.endpos].color
    glEnable(GL_TEXTURE_2D)
    for i in range(len(self.kind.promote2)):
        draw_img(2.0 + i % 4,
            3.5 + ((len(self.kind.promote2) - 1)//4)/2 - i//4,
            self.kind.ID[piece_color +
                self.kind.promote2[i].abbr])
    glDisable(GL_TEXTURE_2D)
```

これで通常のゲームのプロモーションでは下のようになり、

{{< img src=prom1 alt="プロモーション1" >}}

ユニコーンが加わったゲーム（`promote2 = [Knight, Bishop, Rook, Queen, Unicorn]`）では下のようになります。

{{< img src=prom2 alt="プロモーション2" >}}

縦幅が大きくなりました。

<br>

## マウスクリックを調整

マウスクリックでこの選択肢の中から駒を選択するわけですが、今のコードは次のようになっています。

```py {name="main.py", hl_lines=["12-23"]}
...
class Game:
    ...
    def mouse(self, button, state, x, y):
        '''
        マウス入力コールバック
        '''
        ...
            # プロモーション
            if self.prom:
                piece_color = self.gameboard[self.endpos].color
                if on_square(*self.mousepos, 1.5, 2.5, 3.0, 4.0):
                    self.gameboard[self.endpos] = Knight(piece_color)
                    self.prom = False
                if on_square(*self.mousepos, 2.5, 3.5, 3.0, 4.0):
                    self.gameboard[self.endpos] = Bishop(piece_color)
                    self.prom = False
                if on_square(*self.mousepos, 3.5, 4.5, 3.0, 4.0):
                    self.gameboard[self.endpos] = Rook(piece_color)
                    self.prom = False
                if on_square(*self.mousepos, 4.5, 5.5, 3.0, 4.0):
                    self.gameboard[self.endpos] = Queen(piece_color)
                    self.prom = False
            ...
```

座標も駒も固定になっていますので、これを変更します。

```py {name="main.py", hl_lines=["4-11"]}
# プロモーション
if self.prom:
    piece_color = self.gameboard[self.endpos].color
    for i in range(len(self.kind.promote2)):
        if on_square(*self.mousepos,
                        1.5 + i % 4,
                        2.5 + i % 4,
                        3.0 + ((len(self.kind.promote2) - 1)//4)/2 - i//4,
                        4.0 + ((len(self.kind.promote2) - 1)//4)/2 - i//4):
            self.gameboard[self.endpos] = self.kind.promote2[i](piece_color)
            self.prom = False
```

`on_square`関数の最後の４つの引数`left, right, bottom, top`が有効範囲を指定しています。

この範囲内に`self.mousepos`=クリック時のマウスカーソル位置があれば、ポーンが指定の駒に置き換わります。

<br>

これでプロモーションの拡張が完了しました！

今回の変更も [GitHub](https://github.com/midorimici/chess-program-for-python-and-OpenGL/commit/9c258e1aea99093d34222f4ca29aa200c1057376) に上げておきます。

---

これまで20回かけてチェスのコードの編集やフェアリーチェスへの拡張をやってきました。

これにさらにチェックやメイトを知らせるダイアログを表示したり、手数を戻せるようにしたり、

あるいはコンピュータ対戦を導入しても面白いでしょう。

が、いったんこのシリーズは一区切りついたことにしたいと思います。

お読みいただきありがとうございました～

では:wave: