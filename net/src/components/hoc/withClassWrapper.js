import React from 'react';

const WithClassWrapper = props => (
  <div className={props.classes}>{props.children}</div>
);

export default WithClassWrapper;
