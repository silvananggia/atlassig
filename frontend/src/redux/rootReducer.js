import { combineReducers } from 'redux';
import fktpReducer from './fktpReducer';
import fkrtlReducer from './fkrtlReducer';
import filterReducer from './filterReducer';

const rootReducer = combineReducers({
  mapfktp: fktpReducer,
  mapfkrtl: fkrtlReducer,
  mapfilter: filterReducer,
  // other reducers...
});

export default rootReducer;