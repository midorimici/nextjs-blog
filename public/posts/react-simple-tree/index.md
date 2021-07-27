---
title: "【React】動的な木構造レイヤーをレンダリングしてみる"
date: 2021-05-01T12:00:00+09:00
lastmod: 2021-06-19T12:00:00+09:00
categories: [プログラミング, Web アプリ]
tags: [React, JavaScript/TypeScript]
draft: false
---

お絵かきアプリとかでよくある、階層構造をもったレイヤーを実装してみました。

<!--more-->

{{< img src=figma-tree alt="Figma レイヤー" >}}

Figma だとこんな感じに表示されますが、こういうのを React で実装してみます。

表示だけではなく、レイヤーの選択や削除もできるようにします。

{{< sandbox "react-simple-tree" "https://codesandbox.io/s/react-simple-tree-js94g?file=/src/App.tsx" >}}

<br>

## レイヤーのデータ構造

木構造を表現するため、自分のデータ、配列内での親のインデックス、自分の階層の深さを要素に持つ配列とします。

例えば、

```
a - b - c
  - d - e
      - f
  - g
h - i
```

という構造は

```js {linenos=false}
[['a', -1, 0], ['b', 0, 1], ['c', 1, 2],
    ['d', 0, 1], ['e', 3, 2],
        ['f', 3, 2],
    ['g', 0, 1],
['h', -1, 0], ['i', 7, 1]]
```

となります。

階層の深さは親へとたどっていけば計算できますが、レンダリングの際によく使うので要素として入れています。

<br>

## レイヤーの追加

まず要素を追加するフォームを設置します。

```jsx
import React, { useState } from 'react';

export default () => {
  const [addText, setAddText] = useState<string>('');

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAddText('');
  };

  return (
    <form onSubmit={handleAdd}>
      <input
        type='text'
        value={addText}
        onChange={(e) => setAddText(e.target.value)}
      />
      <button title='add' type='submit'>
        +
      </button>
    </form>
  );
};
```

次にレイヤーにデータを追加します。

レイヤーが選択されていればその子として、選択されていなければ最上階層として追加します。

```jsx {hl_lines=["2-3", "8-15"]}
  ...
  const [layers, setLayers] = useState<[string, number, number][]>([]);
  const [selectedLayer, setSelectedLayer] = useState(-1);

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAddText('');
    if (addText !== '')
    setLayers((prev: [string, number, number][]) => {
      const newList = prev;
      const newDepth = prev[selectedLayer] ? prev[selectedLayer][2] + 1 : 0;
      newList.splice(selectedLayer + 1, 0,
        [addText, selectedLayer, newDepth]);
      return newList;
    });
  };
  ...
```

`layers` は{{< pstlk 上 "react-simple-tree#レイヤーのデータ構造" >}}で説明した通りの構造になっています。

`selectedLayer` は現在選択されているレイヤーの、`layers` 内でのインデックスです。

何も選択されていないときは `-1` を格納しています。

<br>

`setLayers` の中では、元の配列を参照し、新しく追加する要素の階層の深さを計算し、適切な位置に挿入しています。

挿入する位置は選択中のレイヤーの直後となっています。

例えば `[['a', -1, 0], ['b', 0, 1], ['c', -1, 0]]` となっているところに `'d'` というデータを追加するとき、

何も選択されていなければ先頭に `['d', -1, 0]` として追加され、

`1`番目の要素=`['b', 0, 1]` が選択されていればその直後に `['d', 1, 2]` として追加され、`[['a', -1, 0], ['b', 0, 1], ['d', 1, 2], ['c', -1, 0]]` となります。

<br>

## レイヤーの描画・選択

`layers` のそれぞれの要素をリストとして並べて描画します。

```jsx {hl_lines=["2-42", "48-52"]}
  ...
  const nextSameDepthLayerIndex = (current: number) =>
    layers.flatMap((e, i) =>
      i > current && e[2] <= layers[current]?.[2] ? i : []
    )[0] ?? layers.length;

  const Layer = ({ index, item }: { index: number, item: [string, number, number] }) => {
    const nextSameDepthLayer = nextSameDepthLayerIndex(selectedLayer);
    const layerStyles = {
      layer: {
        paddingLeft: 16*item[2]
      },
      selectedLayer: {
        paddingLeft: 16*item[2],
        backgroundColor: '#b8c1ec'
      },
      underSelectedLayer: {
        paddingLeft: 16*item[2],
        backgroundColor: '#d4d8f0'
      }
    };

    return (
      <div
        onClick={() => setSelectedLayer(selectedLayer === index ? -1 : index)}
        style={
          selectedLayer === index
            ? layerStyles.selectedLayer
            : selectedLayer !== -1 &&
              index > selectedLayer &&
              index < nextSameDepthLayer
            ? layerStyles.underSelectedLayer
            : layerStyles.layer
        }
      >
        <span className='text'>{item[0]}</span>
      </div>
    );
  };

  ...

  return (
    <>
      <div id='layersContainer'>
        {layers.map((e, i) => (
          <Layer key={i} index={i} item={e} />
        ))}
      </div>
      <form onSubmit={handleAdd}>
        <input
          type='text'
          value={addText}
          onChange={(e) => setAddText(e.target.value)}
        />
        <button title='add' type='submit'>
          +
        </button>
      </form>
    </>
  );
  ...
```

`nextSameDepthLayerIndex` は、選択中のレイヤー以降で選択中のレイヤーと同じかそれより階層が浅いものであるもののうち最初のもののインデックスを計算しています。

そのようなものが存在しなければ `undefined` となります。

これらの情報は選択中のレイヤーやその子レイヤーを示すためのスタイリングや、レイヤーの選択に使われています。

{{< video src=demo1 opt=1 >}}

<br>

## レイヤーの削除

レイヤー削除ボタンを設置し、選択中のレイヤーとその子レイヤーを削除します。

```jsx
  ...
  const handleRemove = () => {
    const removeAmount = nextSameDepthLayerIndex(selectedLayer) - selectedLayer;
    setLayers((prev: [string, number, number][]) => {
      const newList = [...prev];
      newList.splice(selectedLayer, removeAmount);
      return newList;
    });
  };

  ...

  return (
    <>
      ...
      <button title="remove" onClick={handleRemove}>
        -
      </button>
    </>
  );
  ...
```

React では配列 state の要素の変更は state の変更だと認識されないので、

5 行目で新たな配列を用意することで再描画しています。

<br>

## レイヤーの畳み込み

どのレイヤーが畳まれているかの情報を保持しておきますが、データ本体とは関係せず描画にしか使わないし、

畳んだり開いたりするたびに `layers` を更新するのは大変なので `layers` とは別 state で管理します。

```jsx {hl_lines=[2, "6-16", "25-27", "29-40", 61]}
  ...
  const [folded, setFolded] = useState<boolean[]>([]);

  ...

  const invisibleLayers = () => {
    let res: number[] = [];
    for (const [i, b] of folded.entries()) {
      if (b) {
        res = res.concat(
          [...Array(nextSameDepthLayerIndex(i)).keys()].slice(i + 1)
        );
      }
    }
    return res;
  };

  ...

  const Layer ...
    ...
    return (
      <div
        ...
        className={
          'layer' + (~invisibleLayers().indexOf(index) ? ' invisible' : '')
        }
      >
        <span
          onClick={() =>
            setFolded((prev: boolean[]) => {
              const newList = prev;
              newList[index] = !prev[index];
              return newList;
            })
          }
          className="fold-button"
        >
          {folded[index] ? '>' : 'v'}
        </span>
        <span className="text">{item[0]}</span>
      </div>
    );
  };
  ...

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAddText('');
    if (addText !== '') {
      setLayers((prev: [string, number, number][]) => {
        const newList = prev;
        const newDepth = prev[selectedLayer] ? prev[selectedLayer][2] + 1 : 0;
        newList.splice(selectedLayer + 1, 0, [
          addText,
          selectedLayer,
          newDepth
        ]);
        return newList;
      });
      setFolded((prev: boolean[]) => [...prev, false]);
    }
  };
  ...
```

`InvisibleLayers` で畳まれて表示されないレイヤーのインデックスのリストを返すようにします。

選択中のレイヤー本体は非表示にならないので注意です。

描画しようとしているレイヤーのインデックスがこの中に含まれていれば、

クラス名を変更し、`display: none;` などによって非表示にします。

<br>

最終的にはこんな感じの挙動になります。

{{< video src=demo2 opt=1 >}}

---

参考になれば幸いです。

ではでは～:wave: