import React, { Component, PureComponent, forwardRef, Fragment } from 'react';
import Editor from 'draft-js-plugins-editor';
import createEmojiPlugin from 'draft-js-emoji-plugin';
import createInlineToolbarPlugin from 'draft-js-inline-toolbar-plugin';
// import 'draft-js-emoji-plugin/lib/plugin.css'

const emojiPlugin = createEmojiPlugin();
const inlineToolbarPlugin = createInlineToolbarPlugin();

const { EmojiSuggestions } = emojiPlugin;
const { InlineToolbar } = inlineToolbarPlugin;


class DraftEditor extends Component {
  render() {
    // const { className, style, forwardedRef, ...props } = this.props;
    return (
      <div>
        <Editor
          editorState={this.props.editorState}
          onChange={this.props.onChange}
          plugins={[emojiPlugin, inlineToolbarPlugin]}
        />
        {/* <Editor
          ref={forwardedRef}
          plugins={[emojiPlugin, inlineToolbarPlugin]}
          {...props}
        /> */}
        <EmojiSuggestions />
        <InlineToolbar />
      </div>
    );
  }
}

export default forwardRef((props, ref) => {
  return <DraftEditor {...props} forwardedRef={ref} />;
});
