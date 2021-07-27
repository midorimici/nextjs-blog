---
title: "【React + Recoil】ちょっとリッチな ToDo アプリ"
date: 2020-06-18T12:00:00+09:00
lastmod: 2020-06-18T12:00:00+09:00
categories: [プログラミング, Web アプリ]
tags: [React, アプリ開発]
draft: false
---

おいしそうなタイトルになってしまいました。

これまで React で{{< pstlk 文字当てゲーム react-mojiate-game >}}や{{< pstlk タイピング練習アプリ react-typing-app >}}を作ってきましたが、

今回は ToDo アプリを作成しました。

<!--more-->

{{< tweet 1272492269333962752 >}}

{{< sandbox "react-mui-todo-app" "https://codesandbox.io/s/react-mui-todo-app-gx6us?fontsize=14&hidenavigation=1&theme=dark" >}}

<br>

タイピング練習アプリ制作のときにはスパイス的に入れていた [Material-UI](https://material-ui.com/ja/) を、

今回は全面的に利用しています。

また、2020年5月に発表された状態管理ライブラリ [Recoil](https://recoiljs.org/) を試験的に利用しています。

<br>

<strong>この記事では、Recoil の Atom という機能の簡単な説明をした後に、

実際の実装について書いていきます。</strong>

今回は React Hooks や Material-UI や TypeScript を利用していますが、

それらの簡単な説明についてはこちらをご覧ください。

{{< relpos react-typing-app >}}

<br>

## Recoil とは

Recoil は2020年5月に発表されたばかりの新しい React のための状態管理ライブラリです。

React はいくつかの state を持つことが多いのですが、

アプリが大規模になってくると、**state の管理が React だけでは辛く**なってきます。

また、コンポーネントが増えると、props で変数を上位のコンポーネントに渡していく<strong>「バケツリレー」が発生し、

効率が悪く</strong>なります。

<br>

そこで、Redux などの状態管理ライブラリが使われます。

管理下に置いている state はどのコンポーネントからも呼び出しが可能です。

Recoil は、React Hooks とほぼ同じ書き方で状態管理を実現でき、

Redux よりも直観的で導入しやすいと感じたので、

Recoil を選択しました。

<br>

Recoil のインストールは、コマンドで`npm install recoil`または`yarn add recoil`とすることでできます。

### Atom

Atom は管理下におく state のことです。

次のように定義します。

```js {name="/src/atoms/text.js"}
import { atom } from 'recoil';

export const textState = atom({
    key: 'textState',
    default: ''
});
```

`key`には全体の中で一意的な（グローバルにユニークな）ID を指定します。

`default`はデフォルト値です。

<br>

これをコンポーネントファイルの中で使うには、次のようにします。

```js {name="/src/components/App.js", hl_lines=[5]}
import { useRecoilState } from 'recoil';
import { textState } from '../atoms/text';

export default function App() {
    const [text, setText] = useRecoilState(textState);
    ...
}
```

なんと React Hooks の useState とほぼ同じような形で state を呼び出すことができます。

また、読み込み専用、書き込み専用の関数も用意されています。

```js {name="/src/components/App.js", hl_lines=[5, 6]}
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { textState } from '../atoms/text';

export default function App() {
    const text = useRecoilValue(textState);         // 読み込み専用
    const setText = useSetRecoilState(textState);   // 書き込み専用
    ...
}
```

これらの関数を使うことで、より効率的な処理が行われます。

<br>

なお、Recoil を使うときは、

使用範囲に含める最上階層のコンポーネントを`RecoilRoot`タグで囲む必要があります。

{{< relpos react-toha >}}

<br>

## 実装

ここからは、実際の実装について解説していきます。

### ヘッダの設置

Material-UI App Bar より、[Simple App Bar](https://material-ui.com/components/app-bar/#simple-app-bar) を使って、

ヘッダコンポーネントを作成します。

コードサンプルが提示されているので、基本的にはそれをもとにしてコーディングしていきます。

```jsx {name="/src/components/TodoAppBar.tsx"}
import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

export default function TodoAppBar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6">TO DO</Typography>
      </Toolbar>
    </AppBar>
  );
}
```

`Typography`の部分は、直接`h6`と書いても大丈夫です。

```jsx {name="/src/App.tsx"}
import React from 'react';

import TodoAppBar from './components/TodoAppBar';

import './styles.css';

export default function App() {
  return (
    <DialogContent className="App">
      <TodoAppBar />
    </div>
  );
}
```

{{< img src=appbar alt="App Bar" >}}

出ました！

### タスク未登録のときの画面

タスクが登録されていないことを伝える文と、

タスク登録のためのボタンを配置します。

Material-UI Button から [Contained Buttons](https://material-ui.com/components/buttons/#contained-buttons) を使用します。

```jsx {name="/src/components/TodoList.tsx"}
import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      '&:hover': {
        backgroundColor: '#6666ff'
      }
    }
  })
);

export default function TodoList() {
  const classes = useStyles();

  return (
    <Box padding="2rem" textAlign="center">
      <Typography variant="subtitle1" gutterBottom>
        まだ登録されたタスクはありません。
      </Typography>
      <Button
        className={classes.button}
        variant="contained"
        color="primary"
        >
        タスクを登録する
      </Button>
    </Box>
  );
}
```

8-16行目は、Material-UI からスタイル指定ができるというものです。

`makeStyles - createStyles`はおまじないのように書いてもらって大丈夫です。

`createStyles`の中に、クラス名、スタイルプロパティ、スタイルを書き込んでいきます。

コンポーネント内部でこれを呼び出し、JSX のタグに`className={classes.button}`のように指定します。

<br>

22行目の`Box`は Material-UI のものですが、

スタイルを直接書き込むことができます。

出力はデフォルトでは`div`になります。

```jsx {name="/src/App.tsx", hl_lines=[4, 12]}
import React from 'react';

import TodoAppBar from './components/TodoAppBar';
import TodoList from './components/TodoList';

import './styles.css';

export default function App() {
  return (
    <div className="App">
      <TodoAppBar />
      <TodoList />
    </div>
  );
}
```

{{< img src=not-registered alt="タスク未登録画面" >}}

### タスク登録ダイアログの表示

次はボタンを押したら情報を入力するダイアログを表示させます。

Dialog の [Form dialogs](https://material-ui.com/components/dialogs/#form-dialogs) を参考にします。

```jsx {name="/src/components/RegisterDialog.tsx"}
import React from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function RegisterDialog({ open, onClose }: Props) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="form-dialog-title"
      fullWidth
    >
      <DialogTitle>タスク登録</DialogTitle>
      <DialogContent>
        <DialogContentText>
          登録するタスクの情報を入力してください。
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          もどる
        </Button>
        <Button color="primary">
          登録
        </Button>
      </DialogActions>
    </Dialog>
  );
}
```

`open`と`onClose`を props として親コンポーネントに渡しています。

このダイアログを、さきほどのボタンを押したときに出現するようにします。

```jsx {name="/src/components/TodoList.tsx", hl_lines=[1, 8, "15-19", 22, 29, 36, 37], inline_hl=[1:["2-5"]]}
import React, { useState } from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import RegisterDialog from './RegisterDialog';

...

export default function TodoList() {
  const classes = useStyles();

  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  return (
    <>
      <Box padding="2rem" textAlign="center">
        <Typography variant="subtitle1" gutterBottom>
          まだ登録されたタスクはありません。
        </Typography>
        <Button
          className={classes.button}
          onClick={handleOpen}
          variant="contained"
          color="primary"
          >
          タスクを登録する
        </Button>
      </Box>
      <RegisterDialog open={open} onClose={handleClose} />
    </>
  );
}
```

22行目と37行目の`<></>`ですが、

React では return で返す JSX はひとつのタグで全体が囲まれていなければなりません。

そこで不定のタグで全体を囲っています。

これは別に`div`とかでもいいのですが、

HTML に現れない`<></>`を使っています。

{{< video src=dialog-appear opt=1 >}}

ダイアログが表示されました！

### タスク登録ダイアログの入力部分

入力させる情報は、

- 内容
- 期限
- 優先度

の３つです。

内容はテキスト、期限は日付（カレンダー）、優先度は数値とスライダーを使います。

テキスト部分は [Text Field](https://material-ui.com/components/text-fields/)、期限は [Pickers](https://material-ui-pickers.dev/)、

スライダーは Slider の [Label always visible](https://material-ui.com/components/slider/#label-always-visible) と [Slider with input field](https://material-ui.com/components/slider/#slider-with-input-field) を使って、

これらを [Grid](https://material-ui.com/components/grid/) で並べています。

<br>

長くなったので、コンポーネントとして分けました。

<br>

入力した情報は state として管理下におきたいので、atom の設定をします。

```jsx {name="/src/atoms/RegisterDialogContent.tsx"}
import { atom } from 'recoil';

export const taskContentState = atom<string>({
  key: 'taskContentState',
  default: ''
});

export const taskDeadlineState = atom<Date>({
  key: 'taskDeadlineState',
  default: new Date()
});

export const taskPriorityState = atom<number>({
  key: 'taskPriorityState',
  default: 1
});
```

これらをコンポーネントファイルで呼び出して使用します。

```jsx {name="/src/components/RegisterDialogContent.tsx"}
import React from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Slider from '@material-ui/core/Slider';
import Input from '@material-ui/core/Input';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';

import {
  taskContentState,
  taskDeadlineState,
  taskPriorityState
} from '../atoms/RegisterDialogContent';

export default function RegisterDialogContent() {
  // atom から state を取得する
  const setContent = useSetRecoilState(taskContentState);
  const [deadline, setDeadline] = useRecoilState(taskDeadlineState);
  const [priority, setPriority] = useRecoilState(taskPriorityState);

  // タスクの内容が変更されたとき
  const handleContentChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setContent(e.target.value);
  };

  // タスクの期限が変更されたとき
  const handleDeadlineChange = (date: any) => {
    setDeadline(date);
  };

  // スライダーが動かされたとき
  const handleSliderChange = (e: React.ChangeEvent<{}>, newValue: any) => {
    setPriority(newValue);
  };

  // スライダー横の数値入力欄が変更されたとき
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPriority(Number(e.target.value));
  };

  // 数値入力欄で１～５以外の数値が指定されたとき
  const handleBlur = () => {
    if (priority < 1) {
      setPriority(1);
    } else if (priority > 5) {
      setPriority(5);
    }
  };

  return (
    {// このタグ内にある部分が pickers のカバーする範囲になる }
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <DialogContent>
        <DialogContentText>
          登録するタスクの情報を入力してください。
        </DialogContentText>
        <Grid container spacing={6} direction="column">
          <Grid item>
            <TextField
              onChange={handleContentChange}
              margin="dense"
              id="name"
              label="内容"
              fullWidth   {// 横幅いっぱいにする }
            />
            <KeyboardDatePicker
              disableToolbar
              variant="inline"          {// カレンダーが出現する位置 }
              format="yyyy/MM/dd"       {// 表示する日付のフォーマット }
              minDate={new Date()}      {// 現在の日より前の日は選択不可 }
              margin="normal"
              id="date-picker-inline"
              label="期限"
              value={deadline}
              onChange={date => handleDeadlineChange(date)}
              invalidDateMessage="無効な形式です"
              minDateMessage="昨日以前の日付を指定することはできません"
            />
          </Grid>
          <Grid container item spacing={2}>
            <Grid item xs={2}>
              <DialogContentText>優先度</DialogContentText>
            </Grid>
            <Grid item xs={8}>
              <Slider
                value={priority}
                onChange={handleSliderChange}
                defaultValue={1}        {// デフォルト値 }
                aria-valuetext=""
                aria-labelledby="discrete-slider"
                valueLabelDisplay="on"  {// 数字の吹き出しを常に表示する }
                step={1}  {// 変動幅 }
                marks     {// 境界に印をつける }
                min={1}   {// 最小値 }
                max={5}   {// 最大値 }
              />
            </Grid>
            <Grid item xs={2}>
              <Input
                value={priority}
                margin="dense"
                onChange={handleInputChange}
                onBlur={handleBlur}
                inputProps={{
                  step: 1,
                  min: 1,
                  max: 5,
                  type: 'number',
                  'aria-labelledby': 'input-slider'
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
    </MuiPickersUtilsProvider>
  );
}
```

これを親コンポーネント`RegisterDialog.tsx`で呼び出します。

```jsx {name="/src/components/RegisterDialog.tsx", hl_lines=[16]}
...

import RegisterDialogContent from './RegisterDialogContent';

...

export default function RegisterDialog({ open, onClose }: Props) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="form-dialog-title"
      fullWidth
    >
      <DialogTitle>タスク登録</DialogTitle>
      <RegisterDialogContent />
      <DialogActions>
        <Button onClick={onClose} color="primary">
          もどる
        </Button>
        <Button color="primary">登録</Button>
      </DialogActions>
    </Dialog>
  );
}
```

また、Recoil を使ったので、

使用範囲に含める最上階層のコンポーネントの JSX を`RecoilRoot`タグで囲む必要があります。

```jsx {name="/src/App.tsx", hl_lines=[2, 11, 16]}
import React from 'react';
import { RecoilRoot } from 'recoil';

import TodoAppBar from './components/TodoAppBar';
import TodoList from './components/TodoList';

import './styles.css';

export default function App() {
  return (
    <RecoilRoot>
      <div className="App">
        <TodoAppBar />
        <TodoList />
      </div>
    </RecoilRoot>
  );
}
```

{{< video src=dialog-content opt=1 >}}

できました！

### タスクが登録されているときの画面

まず、タスク一覧を atom で設定します。

```jsx {name="/src/atoms/Tasks.tsx"}
import { atom } from 'recoil';

export const tasksState = atom<
  { content: string; deadline: any; priority: number }[]
>({
  key: 'tasksState',
  default: []
});
```

ダイアログの登録ボタンを押したときに、atom に値を追加します。

```jsx {name="/src/components/RegisterDialog.tsx", hl_lines=["17-31", 46], inline_hl=[15:["2-6"]]}
...
import { useRecoilValue, useRecoilState } from 'recoil';

...

import {
  taskContentState,
  taskDeadlineState,
  taskPriorityState
} from '../atoms/RegisterDialogContent';

import { tasksState } from '../atoms/Tasks';

...

export default function RegisterDialog({ open, onClose }: Props) {
  const taskContent = useRecoilValue(taskContentState);
  const taskDeadline = useRecoilValue(taskDeadlineState);
  const taskPriority = useRecoilValue(taskPriorityState);
  const [tasks, setTasks] = useRecoilState(tasksState);

  const handleRegister = () => {
    setTasks([
      ...tasks,
      {
        content: taskContent,
        deadline: taskDeadline,
        priority: taskPriority
      }
    ]);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="form-dialog-title"
      fullWidth
    >
      <DialogTitle>タスク登録</DialogTitle>
      <RegisterDialogContent />
      <DialogActions>
        <Button onClick={onClose} color="primary">
          もどる
        </Button>
        <Button onClick={handleRegister} color="primary">
          登録
        </Button>
      </DialogActions>
    </Dialog>
  );
}
```

`tasks`にはオブジェクトを入れています。

ボタンを押すとダイアログを閉じるので、`handleRegister`関数の中にも`onClose()`を書いています。

<br>

続いてタスクの一覧を表示する表のコンポーネントを作成します。

```jsx {name="/src/components/TodoTable.tsx"}
import React from 'react';
import { useRecoilState } from 'recoil';

import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import { format } from 'date-fns';

import { tasksState } from '../atoms/Tasks';

export default function TodoTable() {
  const [tasks, setTasks] = useRecoilState(tasksState);

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>タスク</TableCell>
            <TableCell align="center">期日</TableCell>
            <TableCell align="center">優先度</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((task: any) => (
            <TableRow>
              <TableCell>{task.content}</TableCell>
              <TableCell align="center">
                {// 年/月/日の形式に変換して表示する }
                {format(task.deadline, 'yyyy/MM/dd')}
              </TableCell>
              <TableCell align="center">{task.priority}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
```

登録されたタスクがひとつでもあれば、この表を出現させます。

タスクの一覧を [Table](https://material-ui.com/components/tables) を使って表示し、

タスク追加のアイコンボタンを [Floating Action Button](https://material-ui.com/components/floating-action-button/#floating-action-button-2) を使って置いています。

```jsx {name="/src/components/TodoList.tsx", hl_lines=["21-28", 35, "45-57", 71]}
import { useRecoilValue } from 'recoil';

...

import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

...

import TodoTable from './TodoTable';

import { tasksState } from '../atoms/Tasks';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      '&:hover': {
        backgroundColor: '#6666ff'
      }
    },
    fab: {
      position: 'absolute',
      bottom: '2rem',
      right: '2rem',
      '&:hover': {
        backgroundColor: '#6666ff'
      }
    }
  })
);

export default function TodoList() {
  const classes = useStyles();

  const tasks = useRecoilValue(tasksState);
  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  return (
    <>
      <Box padding="2rem" textAlign="center">
        {tasks.length !== 0 ? (
          <>
            <TodoTable />
            <Fab
              className={classes.fab}
              onClick={handleOpen}
              color="primary"
              aria-label="add"
            >
              <AddIcon />
            </Fab>
          </>
        ) : (
          <>
            <Typography variant="subtitle1" gutterBottom>
              まだ登録されたタスクはありません。
            </Typography>
            <Button
              className={classes.button}
              onClick={handleOpen}
              variant="contained"
              color="primary"
            >
              タスクを登録する
            </Button>
          </>
        )}
      </Box>
      <RegisterDialog open={open} onClose={handleClose} />
    </>
  );
}
```

三項演算子を使用して、`tasks`の要素が存在するかどうかで条件分岐をしています。

{{< video src=task-table opt=1 >}}

### タスクの削除

選択したタスクが削除できるようにします。

選択には [Checkbox](https://material-ui.com/components/checkboxes/) を使います。

Table の [Sorting & Selecting](https://material-ui.com/components/tables/#sorting-amp-selecting) を参考にします。

```jsx {name="/src/components/TodoTable.tsx", hl_lines=["10-49", "52-59", "64-69", "78-83", 94]}
import React, { useState } from 'react';
...
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Checkbox from '@material-ui/core/Checkbox';
...

export default function TodoTable() {
  const [tasks, setTasks] = useRecoilState(tasksState);
  const [selected, setSelected] = useState<number[]>([]);

  // すべてのタスクを選択する
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelected([...Array(tasks.length).keys()]);
      return;
    }
    setSelected([]);
  };

  // 特定のタスクを選択する
  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>, i: number) => {
    const selectedIndex = selected.indexOf(i);
    let newSelected: number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, i);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  // 選択したタスクを消去する
  const handleDelete = () => {
    let newTasks = tasks.filter(
      (e: object, i: number) => selected.indexOf(i) === -1
    );
    setTasks(newTasks);
    setSelected([]);
  };

  return (
    <>
      <IconButton
        onClick={handleDelete}
        disabled={selected.length === 0}
        aria-label="delete"
      >
        <DeleteIcon />
      </IconButton>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={tasks.length > 0 && tasks.length === selected.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>タスク</TableCell>
              <TableCell align="center">期日</TableCell>
              <TableCell align="center">優先度</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task: any, index: number) => (
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selected.indexOf(index) !== -1}
                    onChange={(e: any) => handleCheck(e, index)}
                  />
                </TableCell>
                <TableCell>{task.content}</TableCell>
                <TableCell align="center">
                  {format(task.deadline, 'yyyy/MM/dd')}
                </TableCell>
                <TableCell align="center">{task.priority}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
```

{{< video src=table-delete opt=1 >}}

### タスクの並び替え

期限や優先度順に並び替えられるようにします。

`tasks`の要素となるオブジェクトを、その`deadline`や`priority`によって並び替えることになります。

```jsx {name="/src/components/TodoTable.tsx", hl_lines=["20-31", "46-63"]}
...
import TableSortLabel from '@material-ui/core/TableSortLabel';
...

const sortTasks = (
  arr: { content: string; deadline: any; priority: number }[],
  sortBy: 'deadline' | 'priority',
  order: 'asc' | 'desc'
) =>
  arr.sort(
    (
      a: { content: string; deadline: any; priority: number },
      b: { content: string; deadline: any; priority: number }
    ) => (order === 'asc' ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy])
  );

export default function TodoTable() {
  const [tasks, setTasks] = useRecoilState(tasksState);
  const [selected, setSelected] = useState<number[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<'deadline' | 'priority' | ''>('');

  const handleSort = (sortBy: 'deadline' | 'priority') => (
    e: React.MouseEvent
  ) => {
    let newOrder: 'asc' | 'desc' =
      orderBy === sortBy ? (order === 'asc' ? 'desc' : 'asc') : 'asc';
    setOrderBy(sortBy);
    setOrder(newOrder);
    setTasks(sortTasks(tasks.concat(), sortBy, newOrder));
  };

  ...

  return (
    ...
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={tasks.length > 0 && tasks.length === selected.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>タスク</TableCell>
              <TableCell align="center">
                <TableSortLabel
                  active={orderBy === 'deadline'}
                  direction={order === 'asc' ? 'desc' : 'asc'}
                  onClick={handleSort('deadline')}
                >
                  期日
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">
                <TableSortLabel
                  active={orderBy === 'priority'}
                  direction={order === 'asc' ? 'desc' : 'asc'}
                  onClick={handleSort('priority')}
                >
                  優先度
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
    ...
  );
```

`sort`メソッドは、配列を引数の関数に従って並び変える{{% tltp 破壊的メソッド %}}操作対象を変更する{{% /tltp %}}です。

要素となるオブジェクトの`deadline`または`priority`にもとづいて、

正順または逆順に並べ替えるようにしています。

<br>

30行目の`tasks.concat()`は、`tasks`のコピーを作っています。

`sort`メソッドは破壊的処理なので、このようにしないと`tasks`自体を変更しようとしてエラーが発生します。

<br>

49, 58行目は、矢印の向きを指定しています。

{{< video src=table-sort opt=1 >}}

---

長くなりましたが、React + Recoil + Material-UI + TypeScript での ToDo アプリの実装について書きました。

Material-UI で本当にいろいろなことが比較的簡単にできて楽しい！というのと、

Recoil が React Hooks からシームレスに移行できて学習コストも意外と低い！という印象でした。

この記事が参考になれば幸いです。

ではまた:wave: