import { combineReducers } from 'redux';
import fktpReducer from './fktpReducer';
import fkrtlReducer from './fkrtlReducer';

const rootReducer = combineReducers({
  mapfktp: fktpReducer,
  mapfkrtl: fkrtlReducer,
  // other reducers...
});

export default rootReducer;