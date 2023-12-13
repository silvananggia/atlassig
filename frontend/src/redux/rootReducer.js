import { combineReducers } from 'redux';
import accessReducer from './accessReducer';
import fktpReducer from './fktpReducer';
import fkrtlReducer from './fkrtlReducer';
import filterReducer from './filterReducer';

const rootReducer = combineReducers({
  mapaccess: accessReducer,
  mapfktp: fktpReducer,
  mapfkrtl: fkrtlReducer,
  mapfilter: filterReducer,
  // other reducers...
});

export default rootReducer;