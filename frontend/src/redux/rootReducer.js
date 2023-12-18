import { combineReducers } from 'redux';
import accessReducer from './accessReducer';
import fktpReducer from './fktpReducer';
import fkrtlReducer from './fkrtlReducer';
import filterReducer from './filterReducer';
import authReducer from './authReducer';

const rootReducer = combineReducers({
  mapauth: authReducer,
  mapaccess: accessReducer,
  mapfktp: fktpReducer,
  mapfkrtl: fkrtlReducer,
  mapfilter: filterReducer,
  // other reducers...
});

export default rootReducer;