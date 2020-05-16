import { pick } from 'lodash';

const initialState = {
  loading: true,
  error: undefined,
  user: undefined,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'AUTH:SIGN_IN/START':
      return {
        ...initialState,
        loading: true,
        error: undefined,
      };
    case 'AUTH:SIGN_IN/SUCCESS':
      return {
        ...initialState,
        loading: false,
        error: undefined,
        user: action.payload,
      };
    case 'AUTH:GET_USER/START':
      return {
        ...initialState,
        loading: true,
        error: undefined,
      };
    case 'AUTH:GET_USER/SUCCESS':
      return {
        ...initialState,
        loading: false,
        error: undefined,
        user: action.payload.user,
      };
    case 'AUTH:SET_USER':
      return {
        ...initialState,
        loading: false,
        error: undefined,
        user: {
          ...pick(action.payload.user, ['uid', 'username', 'avatar', 'email']),
        },
      };
    // case 'AUTH:SET_TOKEN':
    //   return {
    //     ...state,
    //     user: Object.assign(state.user, { token: action.payload.token }),
    //   };
    default:
      return state;
  }
};
