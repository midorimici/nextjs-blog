---
title: "チェスアプリ開発(6) PyOpenGL で盤面を描画"
date: 2020-03-10T12:00:00+09:00
lastmod: 2020-12-16T12:00:00+09:00
categories: [プログラミング, チェスアプリ開発]
tags: [プログラミング, Python, OpenGL, アプリ開発, チェス]
draft: false
---

Python プログラムで動かすフェアリーチェスアプリ開発、連載第6回です。

{{< pstlk 前回 chess-app-devel-5 >}}で機能面はある程度整いました。

しかし、現在はコマンドラインでテキストで絵を描いて表示し、ユーザのコマンドで動かしている状態なので、

インタフェース的にもう少し楽しくしたいですねー。

ということで、今回からは **OpenGL** というものを使って、画面に絵を描いたりマウス入力を受け付けたりできるようにしましょう！ 

<!--more-->

<br>

## OpenGL とは

OpenGL はコンピュータグラフィックスライブラリのひとつです。

競合は DirectX とか。

Windows と Python で OpenGL をインストールする方法はこちらが参考になります。

→ [WindowsのPythonでOpenGLを使う](http://tadaoyamaoka.hatenablog.com/entry/2017/02/28/064625)

<br>

ちょっとはまったのですが、ダウンロードしてきた freeglut の中の dll ファイルを `C:\Windows\SysWOW64`にコピーしてこないと GLUT が認識されないもようです。

私の場合、いろいろいじりすぎてよくわからないんですが、最終的に`SysWOW64`に`glut32.dll`を入れれば動いてくれました。

ちなみに`glut32.dll`を取り除くとこんなエラーが出ました。

```
OpenGL.error.NullFunctionError: Attempt to call an undefined function glutInit, check for bool(glutInit) before calling
```

これは後述のプログラム中の`glutInit()`関数を認識できていないことを示します。

何をどこに入れればいいのかはビット数によっても変わってくるみたいなので、

とりあえず当たって砕けろ方式でダウンロードしてきた dll を全部`System32`か`SysWOW64`にぶち込めば成功した、なんてこともあります。

ちなみに私の実行環境は Windows 10 64bit と Python 3.7.4 on win32 です。

<br>

後に Python 3.8.3 / PyOpenGL 3.1.5 に変更するとまた動かなくなってしまいました。

PyOpenGL を[公式サイト](http://pyopengl.sourceforge.net/#installation)から直接ダウンロード・解凍して、

`OpenGL/DLLS/`以下の`freeglut64.vc9.dll`, `freeglut64.vc10.dll`, `freeglut64.vc14.dll`を

`System32`に入れると動きました。

どれが効いているのかはわかりません。

ちなみに、`freeglut32.vc9.dll`とかもありました。

<br>

## ウィンドウ表示

描いた絵を表示する領域を作ります。

```py:main.py {hl_lines=[16], del=[0], id=0}
from OpenGL.GL import *
from OpenGL.GLUT import *
　
...
　
WSIZE = 720     # 画面サイズ
　
...
　
class Game():
    def __init__(self):
        ...
        self.glmain()
    ...
    def main(self):
        # while True
        ...
    ...
    def draw(self):
        '''描画コールバック'''
        glClearColor(0.6, 0.4, 0.2, 1.0)
        glClear(GL_COLOR_BUFFER_BIT)
　
    def glmain(self):
        glutInit(sys.argv)
        glutInitDisplayMode(GLUT_DOUBLE | GLUT_RGBA)    # 表示設定
        glutInitWindowSize(WSIZE, WSIZE)                # 画面サイズ
        glutInitWindowPosition(0, 0)                    # 画面の表示位置
        glutCreateWindow(b'Chess')                      # ウィンドウの名前
        glutDisplayFunc(self.draw)                      # 描画
        glutMainLoop()
```

何をやっているのか詳しく知りたい方は、こちらのサイトなどをご覧ください。

→ [はじめての OpenGL](http://wisdom.sakura.ne.jp/system/opengl/gl2.html)

`glutMainLoop()`がループ処理をしてくれるので、`main()`内の`while`文は不要になります。

これで茶色い画面が表示されるはずです。

<br>

## 盤面の描画

チェス盤、いわゆるチェッカーボードを描くために、ちょっと準備がいります。

### 四角形の描画

とりあえず、新しいファイルを作り、四角形を描画する関数を定義します。

```py:utils.py
from OpenGL.GL import *
from OpenGL.GLUT import *
　
def square(x, y):
    '''
    正方形を描画する
    
    Parameters
    ----------
    x, y : float
		中心の座標．
    '''
    glPushMatrix()                  # 変形が及ぶ範囲の開始
    glTranslate(x, y, 0)            # 以下の対象を平行移動
    glBegin(GL_QUADS)               # 四角形の描画を宣言
    glVertex(-1.0 / 2, -1.0 / 2)    # 頂点１の座標
    glVertex(1.0 / 2, -1.0 / 2)     # 頂点２
    glVertex(1.0 / 2, 1.0 / 2)      # 頂点３
    glVertex(-1.0 / 2, 1.0 / 2)     # 頂点４
    glEnd()                         # 描画終了
    glPopMatrix()                   # 変形が及ぶ範囲の終了
```

`glPushMatrix()`と`glPopMatrix()`は[行列スタックを扱う関数](http://wisdom.sakura.ne.jp/system/opengl/gl14.html)なのですが、

コメントにあるぐらいの理解で使っています。

これがないと変形（`glTranslate()`とか）が後ろの図形にまで及んでしまいます。

あと、座標ですが、特に指定しない限り画面は左下(-1.0, -1.0)、右上(1.0, 1.0)となっています。

とりあえず、これを使って四角形を表示してみましょう。

```py:main.py {hl_lines=["11-13"]}
from utils import *
　
...
　
class Game():
    ...
    def draw(self):
        '''描画コールバック'''
        glClearColor(0.6, 0.4, 0.2, 1.0)
        glClear(GL_COLOR_BUFFER_BIT)
        glColor(1, 0, 0)    # 色の指定
        square(0, 0)
        glutSwapBuffers()   # 強制描画
```

中心に赤い正方形が表示されたと思います。

{{< img src=img1 ext=png width=300 alt=赤い正方形 >}}

さて、チェス盤は 8x8 の計 64 の正方形が並んでいるので、大きさを合わせていきたいのですが、

正方形を縮小するという手段の他にも、描画範囲を広げるという手もあります。

フェアリーチェスでは盤面のサイズが広がる可能性が十二分にあるので、そこへの拡張を考えて後者の方法にしたいと思います。

さきほど、特に指定しない限り画面は左下(-1.0, -1.0)、右上(1.0, 1.0)となっていると言いましたが、

[`glOrtho()`](http://wisdom.sakura.ne.jp/system/opengl/gl12.html)を用いてこの範囲を指定することができます。

```py:main.py {hl_lines=[3]}
def glmain(self):
    ...
    glOrtho(-1.0, 8.0, -1.0, 8.0, -4, 4)
    glutMainLoop()
```

これで左下(-1.0, -1.0)、右上(8.0, 8.0)になりました。

{{< img src=img2 ext=png alt=赤い正方形左下 width=300 >}}

この大きさの正方形なら、左下(-0.5, -0.5)、右上(7.5, 7.5)の盤面ができるので、

ちょうどいい感じにマージンもできますね。

### 互い違いに四角形を配置

チェス盤は暗い色のマスと明るい色のマスが互い違いになって並んでいます。

暗い色のマスの位置を示すリストを利用することにします。

```py:utils.py
dark_squares_list = ([(i, j) for i in range(0, 8, 2) for j in range(0, 8, 2)]
    + [(i, j) for i in range(1, 8, 2) for j in range(1, 8, 2)])
　
def draw_squares():
    '''マス目を描画する'''
    for i in range(8):
        for j in range(8):
            if (i, j) in dark_squares_list:
                glColor(0.82, 0.55, 0.28)
                square(i, j)
            else:
                glColor(1.00, 0.81, 0.62)
                square(i, j)
```

リスト内包表記というものを使っています。

`range()`の第三引数はスキップで、`range(0, 8, 2)`の場合「0-7までひとつおき」という意味になります。

さきほど`draw()`の中で四角形を描画していた部分を`draw_squares()`に書き換えれば、盤面が表示されます。

```py:main.py {hl_lines=[7]}
class Game():
    ...
    def draw(self):
        '''描画コールバック'''
        glClearColor(0.6, 0.4, 0.2, 1.0)
        glClear(GL_COLOR_BUFFER_BIT)
        draw_squares()
        glutSwapBuffers()   # 強制描画
```

{{< img src=board1 ext=png alt=盤面 width=300 >}}

### 文字を設置

前後左右がわかりやすいように、
{{% tooltip %}}ファイル((縦の列<br>アルファベットで表す{{% /tooltip %}}
と
{{% tooltip %}}ランク((横の行<br>数字で表す{{% /tooltip %}}
の文字を入れましょう。

OpenGL 単体はあまり文字描画に強くない印象ですが、それでも一応間に合ってはいるので大丈夫だと思います。

またやりたくなったら何か手を打つかもしれません。

まずは文字列を描画する関数を定義します。

```py:utils.py
def draw_str(x, y, string, font=GLUT_BITMAP_HELVETICA_18, gap=0.25):
    '''
    文字列を描画する

    Parameters
    ----------
    x, y : float
        描画する座標．
    string : str
        描画する文字列．
    font : , default GLUT_BITMAP_HELVETICA_18
        フォント．以下から指定．
        GLUT_BITMAP_8_BY_13
        GLUT_BITMAP_9_BY_15
        GLUT_BITMAP_TIMES_ROMAN_10
        GLUT_BITMAP_TIMES_ROMAN_24
        GLUT_BITMAP_HELVETICA_10
        GLUT_BITMAP_HELVETICA_12
        GLUT_BITMAP_HELVETICA_18
    gap : float, default 0.25
        文字間隔．
    '''
    for k in range(len(string)):
        glRasterPos2f(x + gap*k, y)                 # 描画位置指定
        glutBitmapCharacter(font, ord(string[k]))   # 文字列描画
```

文字列描画に関してはこちらが参考になります。

→ [情報メディア実験](http://slis.tsukuba.ac.jp/~fujisawa.makoto.fu/lecture/iml/text/screen_character.html)

次にファイルとランクの文字を描画する関数です。

```py:utils.py
def draw_file():
    '''ファイルの文字を描画する'''
    glColor(1.0, 1.0, 1.0)
    for x in range(8):
        draw_str(x, -0.75, chr(x + 97))
　
def draw_rank():
    '''ランクの文字を描画する'''
    glColor(1.0, 1.0, 1.0)
    for y in range(8):
        draw_str(-0.75, y, str(y + 1))
```

`chr()`は文字の番号をもとに文字に変換するもので、

```py {linenos=false}
>>> chr(97) == 'a'
True
```

となります（`ord()`はその逆です）。

これを`draw()`の中に書き加えていけばOKです。

```py:main.py {hl_lines=[8, 9]}
class Game():
    ...
    def draw(self):
        '''描画コールバック'''
        glClearColor(0.6, 0.4, 0.2, 1.0)
        glClear(GL_COLOR_BUFFER_BIT)
        draw_squares()
        draw_file()
        draw_rank()
        glutSwapBuffers()   # 強制描画
```

{{< img src=board2 ext=png alt="盤面 文字付き" width=300 >}}

---

これで盤面が表示されたので、{{< pstlk 次回 chess-app-devel-7 >}}は駒の画像をこの上に配置していきます！

最後までご覧いただきありがとうございました:wave: