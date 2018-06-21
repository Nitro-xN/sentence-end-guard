'use babel';

import { CompositeDisposable } from 'atom';

export default class EditorHandler {



  constructor(editor) {
    this.editor = editor;
    this.subscriptions = new CompositeDisposable();
    this.sentenceEndMarker = atom.config.get('sentence-end-guard.sentence-end-marker');
    this.warningDistance = atom.config.get('sentence-end-guard.warning-distance');
    this.cautionDistance = atom.config.get('sentence-end-guard.caution-distance');
    // this.wasSentenceEnd = false;
    // this.prevPartB = this.editor.getText().lastIndexOf(sentenceEndMarker);
    // this.prevPartA = this.editor.getText().length - prevPartB;
    var counter = function(str,key){
        return str.split(key).length -1;
    }
    this.commasPrev = counter(this.editor.getText(),this.sentenceEndMarker);
    // this.json = JSON.parse(require('./endPhrase.json'));
    this.json = require('./endPhrase.json');
    // console.log(Object.keys(this.json).length);
  }

  subscribe() {
    this.subscriptions.add(this.editor.onDidChange(()=>this.watchText()));
  }

  unsubscribe() {
    this.editor = null;
    this.subscriptions.dispose();
  }

  readJson() {
    this.json = require('./endPhrase.json');
  }

  processText(){
    // Initialize
    for (var j = 0; j < Object.keys(this.json).length; j++) {
      this.json[j].lastIndex = -1;
    }

    var counter = function(str,key){
        return str.split(key).length -1;
    }
    var rowText = editor.getText();
    var lines = rowText.split(/\n/);
    var comma = 0;
    // line
    for (var i = 0; i < lines.length; i++) {
      var text = lines[i].split(this.sentenceEndMarker);
      // sentence
      for (var j = 0; j < text.length; j++) {
        for (var k = 0; k < Object.keys(this.json).length; k++) {
          if (text[j].endsWith(this.json[k].phraseName)) {
            const lastIndex = this.json[k].lastIndex;
            const index = comma + 1;
            const row = i + 1;
            var column = 0;
            for (var l = 0; l < j+1; l++) {
              column = column + text[l].length + this.sentenceEndMarker.length;
            }
            const detail = editor.getLongTitle() + " " + row + ":" + column;
            if (index-lastIndex<=this.warningDistance&&lastIndex!=-1&&index!=lastIndex) {
              var message = "Sentence-end \"" + this.json[k].phraseName + "\" duplicates in next sentence. ";
              atom.notifications.addError(message,{
                dismissable: true,
                detail: detail,
                icon: 'checklist'
              });
            } else if(index - lastIndex<=this.cautionDistance&&lastIndex!=-1&&index!=lastIndex) {
              var message = "Sentence-end \"" + this.json[k].phraseName + "\" duplicates in near sentence.";
              atom.notifications.addWarning(message,{
                dismissable: true,
                detail: detail,
                icon: 'checklist'
              });
            }
            this.json[k].lastIndex = index;
            break;
          }
        }
        if (j+1 < text.length) {
          comma++;
        }
      }
    }
  }

  watchText() {
    if (!atom.config.get('sentence-end-guard.enable-sentence-end-guard')) return;
    var counter = function(str,key){
        return str.split(key).length -1;
    }
    // カーソルを置いている行までを解析する
    // カーソル行の取得 rowは1から始まることに注意
    row = editor.getCursorBufferPosition().row;
    line = editor.getCursorBufferPosition().column;

    var text = editor.getText();
    text = text.split(/\n/);
    // 空行を掃除
    // console.log("raw text:"+text);
    var deletedRow = 0;
    for (var i = 0; i < text.length; i++) {
      if (text[i]=="") {
        if (i<=row) {
          deletedRow++;
        }
      }
    }
    row = row - deletedRow + 1;
    for (var i = 0; i < text.length; i++) {
      if (text[i]=="") {
        text.splice(i,1);
      }
    }
    // console.log("row:deletedRow:line "+row+":"+deletedRow+":"+line);
    // console.log("text.split(/\n/):"+text);

    var textRows = [];
    var textRowsEnds;
    var textRowsEnd = "";
    var sentenceEnd = false;
    for (var i = 0; i < row; i++) {
      // console.log("i:"+i);
      if (text[i].endsWith("」")||text[i].startsWith("「")){
        // セリフは（できるだけ）除く。2度以上の改行があるセリフは、完全には除いていない。
      } else if (i+1==row) {
        textRowsEnd = text[i].substring(0,line);
        textRowsEnds = text[i].substring(0,line).split(this.sentenceEndMarker);
        sentenceEnd = false;
        if (textRowsEnds[textRowsEnds.length-1]=='') {
          textRowsEnds.splice(textRowsEnds.length-1,1);
          sentenceEnd = true;
        }
        if (textRowsEnds.length>1) {
          var str = [];
          for (var j = 0; j < textRowsEnds.length-1; j++) {
            str.push(textRowsEnds[j]);
          }
          str = str.join(this.sentenceEndMarker)+this.sentenceEndMarker;
          textRows.push(str);
        }
        textRowsEnd = textRowsEnds[textRowsEnds.length-1];
      }else{
        textRows.push(text[i]);
      }
    }
    text = textRows.join('').split(this.sentenceEndMarker);
    for (var i = 0; i < text.length; i++) {
      if (text[i]=="") {
        text.splice(i,1);
      }
    }
    // Initialize
    for (var j = 0; j < Object.keys(this.json).length; j++) {
      this.json[j].lastIndex = -1;
    }
    for (var i = 0; i < text.length; i++) {
      for (var j = 0; j < Object.keys(this.json).length; j++) {
        if (text[i].endsWith(this.json[j].phraseName)) {
          this.json[j].lastIndex = i + 1;
          break;
        }
      }
    }
    if (sentenceEnd) {
      text = textRows.join('')+textRowsEnd+this.sentenceEndMarker;
    } else {
      text = textRows.join('')+textRowsEnd;
    }

    var commas = counter(text,this.sentenceEndMarker);
    if (text.endsWith(this.sentenceEndMarker)&&commas!=this.commasPrev) {
      for (var i = 0; i < Object.keys(this.json).length; i++) {
        if (text.endsWith(this.json[i].phraseName+this.sentenceEndMarker)) {
          var lastIndex = this.json[i].lastIndex;
          var index = counter(text,this.sentenceEndMarker);
          // console.log("lastIndex:index:"+this.json[i].phraseName+":"+lastIndex+":"+index);
          var position = editor.getCursorBufferPosition();
          const detail = editor.getLongTitle() + " " + (position.row+1) + ":" + position.column;
          if (index-lastIndex<=this.warningDistance&&lastIndex!=-1&&index!=lastIndex) {
            if (!atom.config.get('sentence-end-guard.silent-mode')) atom.beep();
            var message = "Sentence-end \"" + this.json[i].phraseName + "\" duplicates in next sentence. ";
            atom.notifications.addError(message,{
              dismissable: !atom.config.get('sentence-end-guard.dismiss-warning'),
              detail: detail
            });
          } else if(index - lastIndex<=this.cautionDistance&&lastIndex!=-1&&index!=lastIndex) {
            var message = "Sentence-end \"" + this.json[i].phraseName + "\" duplicates in near sentence.";
            atom.notifications.addWarning(message,{
              dismissable: !atom.config.get('sentence-end-guard.dismiss-caution'),
              detail: detail
            });
          } else {
            if (lastIndex!=-1&&index!=lastIndex) {
              var message = "Detect specified sentence-end \"" +  this.json[i].phraseName +"\" before " + (index - lastIndex) +" sentence.";
              atom.notifications.addInfo(message);
            }
          }
          this.json[i].lastIndex=index;
          break;
        }
      }
    }
    this.commasPrev = commas;
  }

}
