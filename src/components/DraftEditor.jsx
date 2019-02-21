import React, { PureComponent, forwardRef } from 'react';
import { Editor } from 'draft-js';

class DraftEditor extends PureComponent {
  render() {
    const { className, style, forwardedRef, ...props } = this.props;
    return (
      <div className={className} style={style}>
        <Editor ref={forwardedRef} {...props} />
      </div>
    );
  }
}

export default forwardRef((props, ref) => {
  return <DraftEditor {...props} forwardedRef={ref} />;
});
