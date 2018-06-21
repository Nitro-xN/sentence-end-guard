# sentence-end-guard package

![A screenshot of sentence-end-package from cdn.rawgit.com](https://cdn.rawgit.com/Nitro-xN/sentence-end-guard/3406276c/image.png)

This package observes text contains Japanese language and detect duplication of sentence-end words you have specified.

## commands

| Command | Effect | Default key binding |
|---------|--------|------|
| `Sentence End Guard: Enable` | Activate real-time analysis ||
| `Sentence End Guard: Disable` | Inactivate real-time analysis ||
| `Sentence End Guard: Analyse Text` | Search in current tab | `ctrl-j` |

## config
### Specify attention words

> Preferences(`cmd+,`) -> packages -> sentence-end-guard -> View Code -> lib/endPhrase.json

# 文末監視パッケージ

日本語の文章の文末表現の重複を監視するパッケージです。

警告距離、忠告距離を設定することができます。対象となる文末表現を設定することもできます。

## コマンド

| コマンド | 効果 | ショートカットキー |
|---------|--------|---------------|
| `Sentence End Guard: Enable` | リアルタイム監視を有効化します ||
| `Sentence End Guard: Disable` | リアルタイム監視を無効化します ||
| `Sentence End Guard; Analyse Text` | 編集中のタブの文章の文末の重複をすべて指摘します | `ctrl-j` |

## 設定
### General
#### Enable real-time analysis
リアルタイム監視を有効化するかどうかを設定します。
#### Silent mode
リアルタイム監視中に文末重複の警告を出す場合、ビープ音を発するかどうかを設定します。
#### Sentence-end marker
文末記号を指定します。デフォルトの値は`。`（句点）です。
### Notifications
#### Notifications Warning
- Warning distance

文末が重複した際、警告を発する距離を指定します。デフォルトの値は`1`で、隣接する文の文末が重複した際に警告の通知を発します。
- Dismiss warning

リアルタイム監視中に、警告の通知が自動で消えるかどうかを設定します。
#### Notifications Caution
- Caution distance

文末が重複した際、注意を発する距離を指定します。デフォルトの値は`3`で、3ないしは2文前の文の文末と重複した際に注意の通知を発します。
- Dismiss caution

リアルタイム監視中に、注意の通知が自動で消えるかどうかを設定します。

## 監視の対象となる文末表現の設定

パッケージの設定画面から`View Code`を選び、lib/endPhrase.jsonに表現を追加してください。

* この方式は近いうちに改善します
