'use babel';

import EditorHandler from './editor-handler';
import { CompositeDisposable } from 'atom';

export default {

  editorHandler: null,
  subscriptions: null,
  config: {
    "sentence-end-marker": {
      title: 'Specify sentence-end-marker',
      description: 'Setting sentence-end-marker',
      type: 'string',
      default: '。'
    },
    "warning-distance": {
      title: 'Specify warning-distance',
      description: 'Setting maximum distance warned duplication of sentence-end ( if 0, caution will be disabled )',
      type: 'integer',
      default: 1,
      minimum: 0
    },
    "caution-distance": {
      title: 'Specify caution-distance',
      description: 'Setting maximum distance cautioned duplication of sentence-end ( if 0 or le warning-distance, caution will be disabled )',
      type: 'integer',
      default: 3,
      minimum: 0
    },
    "enable-sentence-end-guard": {
      title: 'Enable',
      descriotion: 'Enable sentence-end-guard or disable',
      type: 'boolean',
      default: true
    },
    "silent-mode": {
      title: 'Silent mode',
      description: 'Warn duplication without beep',
      type: 'boolean',
      default: true
    },
    "dismiss-warning": {
      description: 'Let warning fades out on its own',
      type: 'boolean',
      default: false
    },
    "dismiss-caution": {
      description: 'Let caution fades out on its own',
      type: 'boolean',
      default: true
    }
  },

  activate(state) {
    this.setEditorHandler();
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      // disableを追加
      'sentence-end-guard:disable': () => this.disable(),
      // enableを追加
      'sentence-end-guard:enable': () => this.enable(),
      // processTextを追加
      'sentence-end-guard:processText': () => this.processText()
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

  disable() {
    atom.config.set('sentence-end-guard.enable-sentence-end-guard',false);
  },

  enable() {
    atom.config.set('sentence-end-guard.enable-sentence-end-guard',true);
  }

};
