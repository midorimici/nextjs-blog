---
title: 'チェスアプリ開発(7) Pillow で駒を表示'
date: 2020-03-22T12:00:00+09:00
lastmod: 2020-12-16T12:00:00+09:00
categories: [プログラミング, チェスアプリ開発]
tags: [プログラミング, Python, OpenGL, アプリ開発, チェス]
draft: false
---

Python プログラムで動かすフェアリーチェスアプリ開発、連載第 7 回です。

{{< pstlk 前回 chess-app-devel-6 >}}で駒を乗せるための盤面が準備できました。

今回は、盤面に配置する駒の画像を準備して読み込んで画面に表示していきたいと思います。

<!--more-->

<br>

## 画像を準備

こちらの画像を使わせていただいています。

→ [Clker-Free-Vector-Images](https://pixabay.com/ja/users/Clker-Free-Vector-Images-3736/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=26774)による[Pixabay](https://pixabay.com/ja/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=26774)からの[画像](https://pixabay.com/ja/vectors/%E3%83%81%E3%82%A7%E3%82%B9-%E4%BD%9C%E5%93%81-%E8%A8%AD%E5%AE%9A-%E3%82%B7%E3%83%B3%E3%83%9C%E3%83%AB-26774/)

こちらをダウンロードして、画像編集ソフト（私は [GIMP](https://www.gimp.org/) を使っています）で各 100x100 のサイズのものを白黒合わせて 12 枚作りました。

画像の名前は、例えば白のクイーンなら WQ.png、黒のナイトなら BN.png というように、

色と棋譜における駒を表す記号をもとにしています。

当初この画像ファイルは、メインのプログラムと同一階層に新たなフォルダをつくってその下に配置していました。

```
┬ chess
├─ main.py
├─ pieces.py
├┬ img
│├─ BB.png
│├─ ...
│└─ WR.png
```

今はコードが増えたので、 Python ファイルをまとめるフォルダを作り、次のような構成になっています。

```
┬ chess
├┬ codes
│├─ main.py
│└─ pieces.py
├┬ img
│├┬ B
││├─ BB.png
││├─ ...
││└─ BR.png
│├┬ W
││├─ WB.png
...
```

ここでは後者の構成に基づいてコードを書いていきます。

<br>

## 画像の読み込みと設定

<p>
{{% tooltip %}}[Pillow](https://pillow.readthedocs.io/en/stable/)((Python の画像処理ライブラリ{{% /tooltip %}}
を使って画像を処理します。
</p>

pip でインストールします。

```
pip install Pillow
```

### テクスチャの設定

ところで、画像の表示には[テクスチャマッピング](http://wisdom.sakura.ne.jp/system/opengl/gl23.html)というものを使っています。

テクスチャとは画像を貼り付ける板みたいなもので、板の角の座標と画像の角の座標を対応させることで、

板を移動させたり回転させたりしても画像が動いているように見えるという感じですね。

それでテクスチャの設定が必要なのですが、正直言って何をやっているかよくわかっていません。笑

こちらの記事とか読むとなんとなくわかるかも。

→ [OpenGL でゲームを作る　テクスチャを表示する](http://nn-hokuson.hatenablog.com/entry/2014/02/05/001602)

```py:utils.py
from PIL import Image
...
　
　
def set_img(name, path, imgID):
    '''画像の設定: name.pngを読み込む

    Parameters
    ----------
    name : str
        画像のファイル名．
    path : str > 'W', 'B'
        画像があるフォルダ名．
    imgID : int
        指定する画像ID．
    '''
    img = Image.open(f'../img/{path}/{name}.png')   # 画像を読み込む
    w, h = img.size                                 # 画像の横幅、縦幅
    glBindTexture(GL_TEXTURE_2D, imgID)             # imgID のテクスチャを有効化する
    # 画像とテクスチャを関連づける
    glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA, w, h, 0,
        GL_RGBA, GL_UNSIGNED_BYTE, img.tobytes())
    # テクスチャの設定
    glTexParameter(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR)
    glTexParameter(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR)
　
　
def draw_img(x, y, imgID):
    '''画像を描画する

    Parameters
    ----------
    x, y : float
        描画する座標．
    imgID : int
        画像ID．
    '''
    glPushMatrix()          # 変形範囲の開始
    glBindTexture(GL_TEXTURE_2D, imgID)     # imgID のテクスチャを有効化する
    glTranslate(x, y, 0)    # 平行移動
    glColor(1, 1, 1)        # 色指定
　
    # テクスチャ座標を指定する
    glBegin(GL_QUADS)
    glTexCoord(0.0, 1.0)
    glVertex(-1.0 / 2, -1.0 / 2)
    glTexCoord(1.0, 1.0)
    glVertex(1.0 / 2, -1.0 / 2)
    glTexCoord(1.0, 0.0)
    glVertex(1.0 / 2, 1.0 / 2)
    glTexCoord(0.0, 0.0)
    glVertex(-1.0 / 2, 1.0 / 2)
    glEnd()
　
    glPopMatrix()           # 変形範囲の終了
　
　
def draw_pieces(gameboard, imgID_dict, size=8):
    '''駒を描画する

    Parematers
    ----------
    gameboard : dict > {(int, int): obj, ...}
        盤面．
    imgID : int
        画像ID．
    size : int, default 8
        盤面の大きさ．
    '''
    glEnable(GL_TEXTURE_2D)    # テクスチャマッピングを有効化
    for i in range(size):
        for j in range(size):
            piece = gameboard.get((i, j))    # (i, j)にある駒オブジェクトを取得
            if piece:
                draw_img(i, j, imgID_dict[piece.name])
    glDisable(GL_TEXTURE_2D)   # テクスチャマッピングを無効化
```

テクスチャは整数の番号で管理されています。

`glTexImage2D()`の最後の引数は`img.tobytes()`というふうに、バイトに変換しなければならないようです。

`imgID_dict`は`{'WN': 1, 'WR': 2, ...}`みたいな感じの
{{% tooltip %}}ディクショナリ((キーと値が 1 対 1 に対応する形でまとめられた構造{{% /tooltip %}}
にしています。

```py:pieces.py
class Knight(Piece):
    abbr = 'N'
    def availableMoves(self, x, y, gameboard, Color=None):
        ...
　
class Rook(Piece):
    abbr = 'R'
    def availableMoves(self, x, y, gameboard, Color=None):
        ...
...
　
piece_names = [Knight, Rook, Bishop, Queen, King, Pawn]
　
# 画像IDの割り当て
piece_ID = {}
for i, piece in enumerate(piece_names):
    piece_ID['W' + piece.abbr] = i + 1
    piece_ID['B' + piece.abbr] = -(i + 1)
```

[元のコードの`uniDict`](https://gist.github.com/rsheldiii/2993225#file-chess-py-L234)は、あとからまとめて指定している感じですが、

これから駒が増えていくのに備えて、各駒のクラス内で駒を表す新たな
{{% tooltip %}}プロパティ((オブジェクトが参照できるデータ{{% /tooltip %}}
（`abbr`）を定義しました。

`uniDict`を使わなくなったので、関係各所で調整を入れつつ、

画像関連の処理も入れ込みます。

```py {name="main.py", hl_lines=["3-6", "11-14", 19, "25-27"], ins=[2, 3, "6-11"], del=[0, 1, 4, 5], inline_hl=[0:["13-18"], 1:["13-18"], 2:["13-14"], 3:["13-14"], 4:["15-22"], 5:["15-22"], 6:["15-23"], 7:["15-23"]]}
def placePieces(self):
    for i in range(0, 8):
        self.gameboard[(i, 1)] = Pawn(WHITE, uniDict[WHITE][Pawn], 1)
        self.gameboard[(i, 6)] = Pawn(BLACK, uniDict[BLACK][Pawn], -1)
        self.gameboard[(i, 1)] = Pawn(WHITE, 'WP', 1)
        self.gameboard[(i, 6)] = Pawn(BLACK, 'BP', -1)
　
    placers = [Rook, Knight, Bishop, Queen, King, Bishop, Knight, Rook]
　
    for i in range(0, 8):
        self.gameboard[(i, 0)] = placers[i](WHITE,uniDict[WHITE][placers[i]])
        self.gameboard[(i, 7)] = placers[i](BLACK,uniDict[BLACK][placers[i]])
        self.gameboard[(i, 0)] = placers[i](WHITE, 'W' + placers[i].abbr)
        self.gameboard[(i, 7)] = placers[i](BLACK, 'B' + placers[i].abbr)
...
　
def draw(self):
    ...
    draw_pieces(self.gameboard, piece_ID)
    ...
...
　
def glmain(self):
    ...
    # 画像の設定
    for name, num in piece_ID.items():
        set_img(name, name[0], num)
　
    glutMainLoop()
```

これでいったん表示させてみます。

{{< img src=board1 ext=png width=300 alt=画像透過なし >}}

おっと、[透過の設定](http://wisdom.sakura.ne.jp/system/opengl/gl17.html)をしなければいけませんね。

### 透過の設定

一応画像は透過情報も入っているのですが、 OpenGL に透過情報を含めて描画してもらう必要があります。

```py:main.py {hl_lines=[5, 6, 9]}
def draw(self):
    '''描画コールバック'''
    glClearColor(0.6, 0.4, 0.2, 1.0)
    glClear(GL_COLOR_BUFFER_BIT)
    glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA)    # 混合処理の演算方法を指定
    glEnable(GL_BLEND)        # 混合処理を有効化
    ...
    draw_pieces(self.gameboard, piece_ID)
    glDisable(GL_BLEND)        # 混合処理を無効化
    glutSwapBuffers()
```

{{< img src=board2 ext=png width=300 alt=画像透過あり >}}

問題なく表示できました！

---

これで表示はできたわけですが、まだ駒を動かすことができません。

{{< pstlk 次回 chess-app-devel-8 >}}はマウス操作で駒を動かせるようにしたいと思います。

この記事がお役に立てたならうれしいです:blush:

それでは～:wave: