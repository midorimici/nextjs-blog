---
title: "【React 初心者】React で文字当てゲーム！"
date: 2020-05-31T12:00:00+09:00
lastmod: 2021-07-12T12:00:00+09:00
categories: [プログラミング, Web アプリ]
tags: [React, アプリ開発]
summary: "最近 React を勉強していて、何か簡単なものを作りたいと思って、このような文字当てゲームを作りました。
<br><br>
今回、この記事で実装について解説していきます。
<br><br>
コンポーネントや props はほとんど使っておらず、"
draft: false
---

<br>

最近 React を勉強していて、何か簡単なものを作りたいと思って、このような文字当てゲームを作りました。

{{< tweet 1266654890907930625 >}}

<br>

{{< sandbox "react-typing-game" "https://codesandbox.io/s/react-typing-game-cn92x?fontsize=14&hidenavigation=1&theme=dark" >}}

今回、この記事で実装について解説していきます。

コンポーネントや props はほとんど使っておらず、

- JSX とは
- state とは
- どんな感じに書けるのか

ぐらいの人向けの記事になるかなと思います。

<br>

## React の導入

React を使うには [Node.js](https://nodejs.org/ja/) が必要になります。

Node.js をインストールした後は、次のコマンドをコマンドラインに入力すると、

カレントディレクトリ（今いるディレクトリ）直下に新たなディレクトリ（`my-react-app`）が作られます。

```txt {linenos=false}
npx create-react-app my-react-app
```

`my-react-app`の部分は好きな名前で大丈夫です。

`cd my-react-app`でディレクトリを移動してから、`npm start`すると、

ローカルホストが立ち上がり、ブラウザで見られるようになります。

<br>

## React の仕組み

React は **JavaScript で HTML を書いてしまおう**という発想のライブラリです。

その仕組みについてですが、

さきほどのコマンドで作成されたディレクトリの中身を見てみると、

`/public/index.html`と`/src/index.js`というのがあります。

```html {name="/public/index.html", hl_lines=[4], id=0}
...
<body>
  <noscript>You need to enable JavaScript to run this app.</noscript>
  <div id="root"></div>
  <!--
    This HTML file is a template.
    If you open it directly in the browser, you will see an empty page.

    You can add webfonts, meta tags, or analytics to this file.
    The build step will place the bundled scripts into the <body> tag.

    To begin the development, run `npm start` or `yarn start`.
    To create a production bundle, use `npm run build` or `yarn build`.
  -->
</body>
...
```

この HTML ファイルの`<body>`タグの中身はからっぽです。

中身を JavaScript で生成して、`<div id="root"></div>`の中に入れ込むことになります。

```jsx {name="/src/index.js", hl_lines=["7-12"], id=1}
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
```

`ReactDOM.render`によって、`id="root"`のタグの中身に`<React.StrictMode><App /></React.StrictMode>`が入るという仕組みです。

<br>

そして、`<App />`の部分には`/src/App.js`の内容が展開されます。

このファイルの基本構造は次のようになります。

```jsx {name="/src/App.js", id=2}
import React, { Component } from 'react';
import './App.css';

export default class App extends Component {
  render() {
    return (

    );
  }
}
```

`Component`を継承した`App`というクラスをエクスポートしていますが、

実際に展開されるのは、`return`の中身に書かれた HTML っぽいもの＝JSX です。

{{< relpos react-toha >}}

<br>

## 実装

まずは答えとなりうる文字列のリストを作成し、

その中からランダムで答えを取り出します。

```jsx {name="/src/App.js", hl_lines=[4, 5], id=3}
import React, { Component } from 'react';
import './App.css';

let answers = [...];  // 答えの一覧
let answer = answers[Math.floor(Math.random()*answers.length)];
```

次に state を宣言します。

**state は「外部とは関わりのない」変数**です。

対して props は、関数の引数のように、外部から定義できる変数ですが、今回は使いません。

```jsx {name="/src/App.js", hl_lines=["9-17"], id=4}
import React, { Component } from 'react';
import './App.css';

let answers = [...];
let answer = answers[Math.floor(Math.random()*answers.length)];

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ans: answer,                          // 答えとなる文字列
      display: '_'.repeat(answer.length),   // 表示させる文字列
      inputted: '',   // 入力されたアルファベット
      correct: false  // 正解が出たら true
    };
  }
  ...
}
```

`constructor`はクラスの初期化メソッドです。

`this`はクラス自体を指しているということでとりあえずいいと思います。

<br>

次に出力する HTML となる部分を書きます。

```jsx {name="/src/App.js", hl_lines=["3-14"], id=5}
...
render() {
  const { ans, display, correct } = this.state;

  return (
    <div className="main">
      <p>{correct ? 'Correct!' : ''}</p>
      <p className="answer">{display}</p>
      <div className="alphabets">
        {('abcdefghijklmnopqrstuvwxyz'.split('')).map(value => <button name={value} onClick={this.onInput}>{value}</button>)}
      </div>
      <button className="ans-btn" onClick={this.check}>回答</button>
      <button className="next-btn" onClick={() => this.reset(ans)}>次の問題</button>
    </div>
  );
}
```

HTML を知っていれば、微妙な差異はあるものの JSX はなんとなく読めると思います。

JSX の中に`{}`で書いた部分に JavaScript のコードが入っています。

state を使うときには３行目のようにデータを受け取る必要があります。

10行目では、a-z までのアルファベットを記した26個のボタンを配置しています。

### ボタンを押したときの動作の定義

`onInput`メソッドで、アルファベットボタンが押されたときにどのアルファベットが選択されたのかのデータを取得します。

```jsx {name="/src/App.js", id=6}
onInput = e => {
  this.setState({
    inputted: e.target.name
  });
}
```

アルファベットのボタンの`name`属性には各アルファベットが指定してあるので、

これを見ることでどのアルファベットが選択されたかがわかります。

<br>

次に、`check`メソッドで答えの中に指定したアルファベットが含まれているか確認します。

これは「回答」ボタンを押したときに動作します。

```jsx {name="/src/App.js", id=7}
check = () => {
  const { ans, display, inputted } = this.state;
  let displayTmp = display;

  // 一度押したボタンは無効化する
  document.getElementsByName(inputted)[0].disabled = true;
  
  if (~ans.indexOf(inputted)) {   // 選択したアルファベットが答えに含まれているとき
    for (let k = 0;k <= ans.length-1;k++) {
      let letterIndex = ans.indexOf(inputted, k)
      if (~letterIndex && display[letterIndex] !== ans.charAt(letterIndex)) {
        // 一致した部分を見せる
        displayTmp = displayTmp.slice(0, letterIndex) + ans.charAt(letterIndex) + displayTmp.slice(letterIndex + 1);
      }
    }
    this.setState({
      display: displayTmp
    });
    if (displayTmp === ans) {
      this.setState({
        correct: true
      });
    }
  }
}
```

13行目の`displayTmp = ...`の部分で`this.setState`をしても、`for`ループがうまくいきませんでした。

そのため、`displayTmp`を仮に作ってから、後で`display`を変更しています。

<br>

ちなみに、`~`はビットを反転するもので、`~-1`が`0`になります。

`0`が`false`とみなされるのを利用しています。

<br>

最後に、「次の問題」ボタンを押したときに動作する`reset`メソッドです。

別の問題を出題しますが、同じ問題は２度と出ないようにします。

```jsx {name="/src/App.js", id=8}
reset = shown => {
  // 答えのリストからすでに出題した答えを除く
  answers = answers.filter(n => n !== shown);
  // 次に出題する問題の答え
  answer = answers[Math.floor(Math.random()*answers.length)]

  // 出す問題がなくなったとき、「次の問題」ボタンを押せないようにする
  if (answers.length === 1) {
    document.getElementsByClassName('next-btn')[0].disabled = true;
  }

  // すべてのアルファベットボタンを押せるようにする
  const buttons = document.getElementsByClassName('alphabets')[0].getElementsByTagName('button');

  for (let i = 0; i <= 25; i++) {
    buttons[i].disabled = false;
  }

  this.setState({
    ans: answer,
    display: '_'.repeat(answer.length),
    correct: false
  });
}
```

引数`shown`が、`render`内で`ans`を受け取っていますので、

`shown`にはその時点で出題されている問題の答えの文字列が渡されます。

<br>

以上で完成になります。

<details>
<summary>App.js のソースコード全文</summary>
<br>

```jsx {name="/src/App.js", id=9}
import React, { Component } from 'react';
import './App.css';

let answers = ['tiger', 'kangaroo', 'giraffe'];
let answer = answers[Math.floor(Math.random()*answers.length)];

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ans: answer,
      display: '_'.repeat(answer.length),
      inputted: '',
      correct: false
    };
  }

  onInput = e => {
    this.setState({
      inputted: e.target.name
    });
  }

  check = () => {
    const { ans, display, inputted } = this.state;
    let displayTmp = display;

    document.getElementsByName(inputted)[0].disabled = true;
    
    if (~ans.indexOf(inputted)) {
      for (let k = 0;k <= ans.length-1;k++) {
        let letterIndex = ans.indexOf(inputted, k)
        if (~letterIndex && display[letterIndex] !== ans.charAt(letterIndex)) {
          displayTmp = displayTmp.slice(0, letterIndex) + ans.charAt(letterIndex) + displayTmp.slice(letterIndex + 1);
        }
      }
      this.setState({
        display: displayTmp
      });
      if (displayTmp === ans) {
        this.setState({
          correct: true
        });
      }
    }
  }

  reset = shown => {
    answers = answers.filter(n => n !== shown);
    answer = answers[Math.floor(Math.random()*answers.length)]

    if (answers.length === 1) {
      document.getElementsByClassName('next-btn')[0].disabled = true;
    }

    const buttons = document.getElementsByClassName('alphabets')[0].getElementsByTagName('button');

    for (let i = 0; i <= 25; i++) {
      buttons[i].disabled = false;
    }

    this.setState({
      ans: answer,
      display: '_'.repeat(answer.length),
      correct: false
    });
  }

  render() {
    const { ans, display, correct } = this.state;

    return (
      <div className="main">
        <p>{correct ? 'Correct!' : ''}</p>
        <p className="answer">{display}</p>
        <div className="alphabets">
          {('abcdefghijklmnopqrstuvwxyz'.split('')).map(value => <button name={value} onClick={this.onInput}>{value}</button>)}
        </div>
        <button className="ans-btn" onClick={this.check}>回答</button>
        <button className="next-btn" onClick={() => this.reset(ans)}>次の問題</button>
      </div>
    );
  }
}
```

</details>

{{< relpos react-typing-app >}}

---

React といっても、ほとんどは JavaScript の話になりました。

コンポーネントや props を使えば、もっと React の本質に近づけるような気がします。

とはいえ、やはり JSX で書けること、その中に JavaScript のコードを埋め込めることが便利ですね。

参考になれば幸いです。

ではでは:wave: