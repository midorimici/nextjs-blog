---
title: '【TypeScript】配列・オブジェクト・関数の型は？'
date: 2020-07-04T12:00:00+09:00
lastmod: 2020-08-10T12:00:00+09:00
categories: [プログラミング, プログラミング一般]
tags: [JavaScript/TypeScript]
draft: false
---

TypeScript では定数・変数・関数を定義するときに、型を同時に定義することができます。

例えば数値であれば`number`、文字列であれば`string`、ブール値であれば`boolean`などです。

しかし、配列やオブジェクトや関数の型定義は少し特殊な部分があります。

<!--more-->

<br>

## 配列の型定義

配列の型定義は、`(型)[]`または`Array<(型)>`とします。

```ts
const numArray: number[] = [1, 2, 3]; // または Array<number>
const str2dimArray: string[][] = [
	['a', 'b', 'c'],
	['い', 'ろ', 'は'],
];
const mixedArray: (number | string | boolean)[] = ['str', 4, false];
const complexArray: ((number | string | boolean)[] | number)[] = [
	[1, 'a'],
	[true, 'b'],
	3,
];
```

<br>

要素数が決まっている場合は`[(型), (型)]`のように書くこともできます。

```ts
const numArray: [number, number, number] = [1, 2, 3];
const mixedArray: [string, number, boolean] = ['str', 4, false];
const complexArray: [[number, string], [boolean, string], number] = [
	[1, 'a'],
	[true, 'b'],
	3,
];
```

<br>

## オブジェクトの型定義

オブジェクトの型定義は、`{}`や`object`や`Object`でも構いませんが、

もっと厳密に定義することもできます。

<br>

プロパティが決まっているなら、`{(プロパティ): (型), (プロパティ): (型)}`のように書くことができます。

```ts
const obj: { key1: number; key2: string } = { key1: 3, key2: 'a' };
```

<br>

プロパティが具体的には決まっていないが、型だけはわかる場合、

`{[key: (プロパティの型)]: (値の型)}`のように書くことができます。

```ts
const obj: { [key: string]: string } = { key1: 'a', key2: 'i', key3: 'e' };
const objArray: { [key: string]: number }[] = [
	{ A: 3, B: 2, C: 1 },
	{ 伊: 6, 呂: 7, 波: 8 },
];
const arrayObj: { [key: number]: string[] } = {
	1: ['a', 'b', 'c'],
	2: ['い', 'ろ', 'は'],
};
```

<br>

## 関数の型定義

関数は引数や返り値を取ることがあります。

単に型だけを定義するときは、アロー関数を使って`((引数名): (引数の型)) => (返り値の型)`とします。

返り値がない場合、`void`を指定します。

```ts
let func: (param: number) => void;
```

<br>

型と一緒に関数の内容も同時に定義するときは、`((引数名): (引数の型)): (返り値の型)`とします。

```ts
const func = (param: number): void => console.log(param);
// function func(param: number): void {console.log(param)};
// const func = function (param: number): void {console.log(param)};
```

<br>

省略可能な引数については、`(引数名)?: (引数の型)`とします。

```ts
// デフォルト値を指定しない場合
const func = (param: number, suffix?: string): void =>
	console.log(param + suffix);
// デフォルト値を指定する場合
const func = (param: number, suffix: string = 'st'): void =>
	console.log(param + suffix);
```

<br>

可変長引数は、`...(引数名): (引数の取りうる型)[]`とします。

引数は配列として取得されるので、配列型です。

```ts
const func = (...param: (number | string)[]): void => console.log(param);
const mixedFunc = (
	required: string,
	optional?: number,
	...rest: number[]
): void =>
	console.log(`必須:${required}\n任意:${optional}\n可変長:${rest.join(' ')}`);

mixedFunc('a');
// 必須:a
// 任意:undefined
// 可変長:

mixedFunc('a', 2);
// 必須:a
// 任意:2
// 可変長:

mixedFunc('a', 2, 3);
// 必須:a
// 任意:2
// 可変長:3

mixedFunc('a', 2, 3, 4);
// 必須:a
// 任意:2
// 可変長:3 4
```

---

お役に立てれば幸いです。

では:wave: