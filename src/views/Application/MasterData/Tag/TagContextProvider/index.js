import React from 'react';
import TagContext from './TagContext';

const FETCH_TAGS = 'FETCH_TAGS';

const initialState = {
  drawerOpen: false,
  data: [],
  dataLength: 0,
  recordForEdit: null,
  page: 1,
  rowPerPage: 10,
  confirmDialog: { title: '', content: '', isOpen: false }
};

// eslint-disable-next-line no-unused-vars
const reducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case FETCH_TAGS:
      return { ...state, data: payload };
    default:
      return state;
  }
};

const TagContextProvider = ({ children }) => {
  return <TagContext.Provider>{children}</TagContext.Provider>;
};

export default TagContextProvider;
