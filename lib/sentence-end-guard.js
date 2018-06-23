'use babel';

import EditorHandler from './editor-handler';
import { CompositeDisposable } from 'atom';

export default {

  editorHandler: null,
  subscriptions: null,
  config: {
    "general": {
      order: 1,
      type: 'object',
      properties: {
        "enable-real-time-alanysis": {
          order: 1,
          title: 'Enable real-time analysis',
          description: 'Enable Real Time Analysis or disable',
          type: 'boolean',
          default: true
        },
        "silent-mode": {
          order: 2,
          title: 'Silent mode',
          description: 'Warn duplication without beep',
          type: 'boolean',
          default: true
        },
        "sentence-end-marker": {
          order: 3,
          title: 'Sentence-end marker',
          description: 'Setting sentence-end marker',
          type: 'string',
          default: '。'
        }
      }
    },
    "notifications": {
      order: 2,
      type: 'object',
      properties: {
        "warning": {
          title: "Warning",
          order: 1,
          type: 'object',
          properties: {
            "warning-distance": {
              order: 1,
              title: 'Warning distance',
              description: 'Setting maximum distance warned duplication of sentence-end ( if 0, caution will be disabled )',
              type: 'integer',
              default: 1,
              minimum: 0
            },
            "dismiss-warning": {
              order: 2,
              title: 'Dismiss warning',
              description: 'Let warning fades out on its own at real-time alalysis',
              type: 'boolean',
              default: false
            }
          }
        },
        "caution": {
          title: "Caution",
          order: 2,
          type: 'object',
          properties: {
            "caution-distance": {
              order: 1,
              title: 'Caution distance',
              description: 'Setting maximum distance cautioned duplication of sentence-end ( if 0 or le warning-distance, caution will be disabled )',
              type: 'integer',
              default: 3,
              minimum: 0
            },
            "dismiss-caution": {
              order: 2,
              title: 'Dismiss caution',
              description: 'Let caution fades out on its own at real-time analysis',
              type: 'boolean',
              default: true
            }
          }
        }
      }
    }
  },

  activate(state) {
    this.setEditorHandler();
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      // toggleRTAを追加
      'sentence-end-guard:toggle-real-time-analysis': () => this.toggleRTA(),
      // toggleRTAInCurrentSyntaxを追加
      'sentence-end-guard:toggle-real-time-analysis-in-current-language': () => this.toggleRTAInCurrentLanguage(),
      // processTextを追加
      'sentence-end-guard:analyse-entire-text': () => this.processText(),
      // editTargetPhraseを追加
      'sentence-end-guard:edit-target-phrase': () =>this.editTargetPhrase()
    }));

    this.subscriptions.add(atom.workspace.onDidChangeActivePaneItem(() => this.resetEditorHandler()));
  },

  deactivate() {
    this.editorHandler.unsubscribe();
    this.subscriptions.dispose();
  },

  setEditorHandler() {
    editor = atom.workspace.getActiveTextEditor();
    if (editor != null){
      this.editorHandler = new EditorHandler(editor);
      this.editorHandler.subscribe();
    }
  },

  resetEditorHandler() {
    if (this.editorHandler != null) {
      this.editorHandler.unsubscribe();
    }
    this.setEditorHandler();
  },

  toggleRTA() {
    if (this.editorHandler != null) {
      this.editorHandler.toggleRTA();
    }
  },

  toggleRTAInCurrentLanguage() {
    if(this.editorHandler != null) {
      this.editorHandler.toggleRTAInCurrentLanguage();
    }
  },

  editTargetPhrase(){
    if (this.editorHandler != null) {
      this.editorHandler.editTargetPhrase();
    }
  },

  processText() {
    if(this.editorHandler != null) {
      this.editorHandler.processText();
    }
  }

};
