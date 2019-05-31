import React, { PureComponent } from 'react';
import Editor from 'draft-js-plugins-editor';
import createEmojiPlugin from 'draft-js-emoji-plugin';
import createInlineToolbarPlugin from 'draft-js-inline-toolbar-plugin';

class DraftEditor extends PureComponent {
  constructor(props) {
    super(props);
    const inlineToolbarPlugin = createInlineToolbarPlugin();
    const emojiPlugin = createEmojiPlugin();
    this.state = {
      InlineToolbar: inlineToolbarPlugin.InlineToolbar,
      EmojiSuggestions: emojiPlugin.EmojiSuggestions,
      plugins: [emojiPlugin, inlineToolbarPlugin]
    };
  }

  render() {
    const { className, style, onClick, forwardedRef, ...props } = this.props;
    const { EmojiSuggestions, InlineToolbar, plugins } = this.state;
    return (
      <div className={className} style={style} onClick={onClick}>
        <Editor
          ref={forwardedRef}
          plugins={plugins}
          {...props}
        />
        <EmojiSuggestions />
        <InlineToolbar />
      </div>
    );
  }
}

export default DraftEditor;