import { combineReducers } from 'redux';
import mapReducer from './mapReducer';

const rootReducer = combineReducers({
  mapfktp: mapReducer,
  // other reducers...
});

export default rootReducer;