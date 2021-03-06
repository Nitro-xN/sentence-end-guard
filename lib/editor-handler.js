'use babel';

import { CompositeDisposable } from 'atom';
// import { MarkerLayer } from 'atom';
// import { Range } from 'atom';
// import { Emitter } from 'atom';

export default class EditorHandler {

  constructor(editor) {
    // this.emitter = new Emitter();
    this.editor = editor;
    // View
    // this.editorView = atom.views.getView(this.editor);
    // console.log(this.editorView);
    // element
    // this.editorElement = atom.views.getView(this.editor);
    // console.log(this.editorElement);
    this.subscriptions = new CompositeDisposable();
    this.sentenceEndMarker = atom.config.get('sentence-end-guard.general.sentence-end-marker');
    this.defaultWarningRange = atom.config.get('sentence-end-guard.notifications.warning.warning-range');
    this.defaultCautionRange = atom.config.get('sentence-end-guard.notifications.caution.caution-range');
    var counter = function(str,key){
        return str.split(key).length -1;
    }
    this.periodNumPrev = counter(this.editor.getText(),this.sentenceEndMarker);
    this.json = require('./target.json');
    for (var j = 0; j < Object.keys(this.json).length; j++) {
      this.json[j].lastIndex = -1;
    }
    // this.markerLayer = this.editor.addMarkerLayer();
    this.prevNotification = null;
    this.prevTextLength = 0;
  }

  subscribe() {
    this.subscriptions.add(this.editor.onDidChange(()=>this.watchText()));
  }

  unsubscribe() {
    this.editor = null;
    this.subscriptions.dispose();
  }

  processText(){
    var addedNotification = false;
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
            // set warning / caution range
            var warningRange,cautionRange;
            if (this.json[k].warningRange===undefined) {
              warningRange = this.defaultWarningRange;
            } else {
              warningRange = this.json[k].warningRange;
            }
            if (this.json[k].cautionRange===undefined) {
              cautionRange = this.defaultCautionRange;
            } else {
              cautionRange = this.json[k].cautionRange;
            }

            addedNotification = true;
            const lastIndex = this.json[k].lastIndex;
            const index = comma + 1;
            const row = i + 1;
            var column = 0;
            for (var l = 0; l < j+1; l++) {
              column = column + text[l].length + this.sentenceEndMarker.length;
            }
            const detail = editor.getLongTitle() + " " + row + ":" + column;
            if (index-lastIndex<=warningRange&&lastIndex!=-1&&index!=lastIndex) {
              // deploy marker
              // var range = new Range([row,column-this.json[k].phraseName.length],[row,column]);
              // this.addWarningMarker(range);

              // emit notification
              var message = "Sentence-end \"" + this.json[k].phraseName + "\" duplicates in next sentence. ";
              atom.notifications.addError(message,{
                dismissable: true,
                detail: detail,
                icon: 'checklist'
              });
            } else if(index - lastIndex<=cautionRange&&lastIndex!=-1&&index!=lastIndex) {
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
    if (!addedNotification) {
      var message = "WoW! There are nothing to be reported.";
      atom.notifications.addSuccess(message);
    }
    // console.log(this.warningMarkerLayer);
  }

  watchText() {
    if (!atom.config.get('sentence-end-guard.general.enable-real-time-alanysis', {
      scope: this.editor.getRootScopeDescriptor()
    })) return;
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

    var textRows = [];
    var textRowsEnds;
    var textRowsEnd = "";
    var sentenceEnd = false;
    for (var i = 0; i < row; i++) {
      // console.log("i:"+i);
      if (i+1==row) {
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

    // console.log(text);
    var periodNum = counter(text,this.sentenceEndMarker);
    if (text.endsWith(this.sentenceEndMarker)&&periodNum!=this.periodNumPrev) {
      if (text.length==this.prevTextLength) return;
      this.prevTextLength = text.length;
      if(this.prevNotification != null) this.prevNotification.dismiss();
      for (var i = 0; i < Object.keys(this.json).length; i++) {
        if (text.endsWith(this.json[i].phraseName+this.sentenceEndMarker)) {
          var warningRange,cautionRange;
          if (this.json[i].warningRange===undefined) {
            warningRange = this.defaultWarningRange;
          } else {
            warningRange = this.json[i].warningRange;
          }
          if (this.json[i].cautionRange===undefined) {
            cautionRange = this.defaultCautionRange;
          } else {
            cautionRange = this.json[i].cautionRange;
          }
          var lastIndex = this.json[i].lastIndex;
          var index = counter(text,this.sentenceEndMarker);
          // console.log("lastIndex:index:"+this.json[i].phraseName+":"+lastIndex+":"+index);
          var position = editor.getCursorBufferPosition();
          const detail = editor.getLongTitle() + " " + (position.row+1) + ":" + position.column;
          const description = '##### '+detail+"\n *** \n Sentence End Guard : Real-Time Analysis "
          if (index-lastIndex<=warningRange&&lastIndex!=-1&&index!=lastIndex) {
            if (!atom.config.get('sentence-end-guard.general.silent-mode')) atom.beep();
            var message = "Sentence-end \"" + this.json[i].phraseName + "\" duplicates in next sentence. ";
            this.prevNotification = atom.notifications.addError(message,{
              dismissable: !atom.config.get('sentence-end-guard.notifications.warning.dismiss-warning'),
              description: description
            });
          } else if(index - lastIndex<=cautionRange&&lastIndex!=-1&&index!=lastIndex) {
            var message = "Sentence-end \"" + this.json[i].phraseName + "\" duplicates in " + ( index - lastIndex ) + " sentence.";
            this.prevNotification = atom.notifications.addWarning(message,{
              dismissable: !atom.config.get('sentence-end-guard.notifications.caution.dismiss-caution'),
              description: description
            });
          } else {
            if (lastIndex!=-1&&index!=lastIndex) {
              var message = "Detect specified sentence-end \"" +  this.json[i].phraseName +"\" before " + (index - lastIndex) +" sentence.";
              atom.notifications.addInfo(message,{
                description:'Sentence End Guard : Real-Time Analysis'
              });
            }
          }
          this.json[i].lastIndex=index;
          break;
        }
      }
    }
    this.periodNumPrev = periodNum;
  }

  toggleRTA() {
    var oldState = atom.config.get('sentence-end-guard.general.enable-real-time-alanysis');
    atom.config.set('sentence-end-guard.general.enable-real-time-alanysis',!oldState);
    var message = "";
    var icon;
    if (oldState) {
      message += "Disabled";
      icon = 'primitive-square';
    } else {
      message += "Enabled";
      icon = 'triangle-right';
    }
    message += ' Real-time analysis';
    var description = 'Sentence End Guard';
    atom.notifications.addInfo(message, {
      description: description,
      icon: icon
    });
  }

  toggleRTAInCurrentLanguage() {
    var oldState = atom.config.get('sentence-end-guard.general.enable-real-time-alanysis',{
      scope: this.editor.getRootScopeDescriptor()
    });
    atom.config.set('sentence-end-guard.general.enable-real-time-alanysis', !oldState, {
      scope: this.editor.getRootScopeDescriptor()
    });
    var message = "";
    var icon;
    if (oldState) {
      message += "Disabled";
      icon = 'primitive-square';
    } else {
      message += "Enabled";
      icon = 'triangle-right';
    }
    message += " Real-time analysis";
    var detail = "In [" + this.editor.getRootScopeDescriptor() + "], " + message;
    var description = '##### '+detail + '\n *** \n Sentence End Guard';
    atom.notifications.addInfo(message, {
      description: description,
      icon: icon
    });
  }

  editTargetPhrase(){
    atom.open({
      pathsToOpen: '~/.atom/packages/sentence-end-guard/lib/target.json',
      newWindow: true,
      devMode: false,
      safeMode: false
    });
  }

  // initializeMarkerLayer() {
  //   var cssClassWarning = 'sentence-end-guard warning';
  //   this.warningMarkerLayerDecoration = this.editor.decorateMarkerLayer(this.warningMarkerLayer,{
  //     type: 'highlight',
  //     class: cssClassWarning
  //   });
  //   var cssClassCaution = 'sentence-end-guard caution';
  //   this.cautionMarkerLayerDecoration = this.editor.decorateMarkerLayer(this.cautionMarkerLayer,{
  //     type: 'highlight',
  //     class: cssClassCaution
  //   })
  // }
  // addWarningMarker(range) {
  //   console.log(range);
  //   var marker = this.editor.markBufferRange(range,{invalidate: 'inside'});
  //   this.editor.decorateMarker(marker,{
  //     type: 'text',
  //     class: 'sentence-end-guard warning'
  //   });
  // }
  // addCautionMarker(range) {
    // this.cautionMarkerLayer.markRange(range,{invalidate: 'inside'});
  // }

}
