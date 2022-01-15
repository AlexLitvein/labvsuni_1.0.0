// import * as actions from './acts';

import { SET_STATUS, STATUS_EMPTY } from './acts';

// export const STATUS = {
//     EMPTY: 0,
//     LOADING: 1,
//     LOADED: 2,
//     ERROR: 3,
// };

const initialState = {
  status: STATUS_EMPTY,
  // error: null,
};

export default function statusRdcr(state = initialState, action) {
  // return {
  //   ...state,
  //   status: action.payload,
  // };

  switch (action.type) {
    case SET_STATUS:
      return {
        ...state,
        status: action.payload,
      };

    default:
      return state;
  }
}
