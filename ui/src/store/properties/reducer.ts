import { pick } from 'lodash';

const initialState = {
  loading: false,
  loaded: false,
  error: undefined,
  total: 0,
  page: 0,
  data: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'PROPERTIES:GET/START':
      return {
        ...initialState,
        loading: true,
        error: undefined,
      };
    case 'PROPERTIES:GET/SUCCESS':
      return {
        ...initialState,
        loading: false,
        loaded: true,
        error: undefined,
        total: action.payload.total,
        page: action.payload.page,
        data: action.payload.data,
      };
    case 'PROPERTIES:GET/ERROR':
      return {
        ...initialState,
        loading: false,
        loaded: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
