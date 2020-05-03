import { combineReducers } from 'redux';

import auth from './auth/reducer';
import properties from './properties/reducer';

export default combineReducers({
  auth,
  properties,
});
