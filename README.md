# sentence-end-guard package

![A screenshot of sentence-end-package from cdn.rawgit.com](https://cdn.rawgit.com/Nitro-xN/sentence-end-guard/3406276c/image.png)

This package observes text contains Japanese language and detect duplication of sentence-end words you have specified.

## commands
| Command | Effect | Default key binding |
|---------|--------|------|
| `Sentence End Guard: Toggle Real Time Analysis` | Activate or Inactivate real-time analysis ||
| `Sentence End Guard: Toggle Real Time Analysis In Current Language ` | Activate or Inactivate real-time analysis in current editor's syntax ||
| `Sentence End Guard: Analyse Entire Text` | Search in current tab | `ctrl-j` |

## config
### Specify attention words

> Preferences(`cmd-,`) -> packages -> sentence-end-guard -> View Code -> lib/endPhrase.json

# 文末監視パッケージ

日本語の文章の文末表現の重複を監視するパッケージです。

警告距離、忠告距離を設定することができます。対象となる文末表現を設定することもできます。

## 使い方
### リアルタイム解析
特別な操作を必要としません。初期設定では、すべてのファイルで文末監視を行っています。

注視対象の文末を入力した際、「警告」「注意」「報告」の通知を発します。
#### 停止 / 再開
コマンドパレット ( mac:`cmd-shift-p`, win:`ctrl-shift-p` ) から`Sentence End Guard: Toggle Real Time Analysis`を実行してください。

右クリックのメニューから`Toggle Sentence End Guard real-time analysis`をクリックする、またはメニューバーから`Packages` -> `Sentence End Guard` -> `Toggle real-time analysis`をクリックすることでも有効化/無効化ができます。

#### 言語ごとの有効化 / 無効化
コマンドパレット ( mac:`cmd-shift-p`, win:`ctrl-shift-p` ) から`Sentence End Guard: Toggle Real Time Analysis In Current Language`を実行することで、編集中のファイルの言語に対するリアルタイム解析を有効化/無効化できます。

右クリックのメニューから`Toggle Sentence End Guard real-time analysis in current language`をクリックする、またはメニューバーから`Packages` -> `Sentence End Guard` -> `Toggle real-time analysis in current language`をクリックすることでも有効化/無効化ができます。
### 全文解析 ( experimental )
編集中のエディタのテキストの文末をすべて解析します。

#### 使用
コマンドパレット ( mac:`cmd-shift-p`, win:`ctrl-shift-p` ) から`Sentence End Guard: Analyse Entire Text`を実行してください。

右クリックのメニューから`Analyse entire text in current editor`をクリックする、またはメニューバーから`Packages` -> `Sentence End Guard` -> `Analyse entire text in current editor`をクリックすることでも実行できます。

## コマンド

| コマンド | 効果 | ショートカットキー |
|---------|--------|---------------|
| `Sentence End Guard: Toggle Real Time Analysis` | リアルタイム監視を有効化/無効化します ||
| `Sentence End Guard: Toggle Real Time Analysis In Current Language ` | 現在のエディタの言語で、リアルタイム監視を有効化/無効化します ||
| `Sentence End Guard: Analyse Entire Text` | 編集中のタブの文章の文末の重複をすべて指摘します | `ctrl-j` |

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

コマンドパレットから`Sentence End Guard: Edit Target Phrase`を実行し、target.jsonを編集してください。`phraseName`の文字数が多い順に上から並んでいない場合、文末表現の感知がうまく動作しない場合があります ( より正確には、文字列"ABC"と文字列"BC"が登録されているとき、文字列"BC"がより上に並んでいると文字列"ABC"は感知されません。 ) 。

## ターゲット表現ごとの警告/注意距離の設定

target.jsonの各オブジェクトに、"warningRange","cautionRange"という項目を追加すると設定できます。

![A screenshot of target.json-sample from cdn.rawgit.com](https://cdn.rawgit.com/Nitro-xN/sentence-end-guard/24a17a84/image2.png)
