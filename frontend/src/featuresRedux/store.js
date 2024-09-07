import { createStore } from 'redux';

import { reducer as authReducer } from '../featuresRedux/auth/reducer';

export const store = createStore(authReducer);

// console.log(store.getState());
