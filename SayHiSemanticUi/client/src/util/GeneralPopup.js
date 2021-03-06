import { Popup } from 'semantic-ui-react';
import React from 'react';

function GeneralPopup({ content, children }) {
  return <Popup inverted size="small" content={content} trigger={children} />;
}

export default GeneralPopup;