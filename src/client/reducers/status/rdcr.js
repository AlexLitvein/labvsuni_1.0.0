import * as actions from './acts';

// export const STATUS = {
//     EMPTY: 0,
//     LOADING: 1,
//     LOADED: 2,
//     ERROR: 3,
// };

const initialState = {
  status: actions.STATUS_EMPTY, // STATUS.EMPTY,
  error: null,
};

export default function statusRdcr(state = initialState, action) {
  return {
    ...state,
    status: action.payload,
  };

  // switch (action.type) {
  //     case SET_STATUS:
  //         return {
  //             ...state,
  //             status:  action.payload,
  //         };

  //     case action.SET_EMPTY_STATUS:
  //         return {
  //             ...state,
  //             status: STATUS.EMPTY,
  //         };

  //     case action.SET_LOADING_STATUS:
  //         return {
  //             ...state,
  //             status: STATUS.LOADING,
  //         };

  //     case action.SET_LOADED_STATUS:
  //         return {
  //             ...state,
  //             status: STATUS.LOADED,
  //         };

  //     case action.SET_ERROR_STATUS:
  //         return {
  //             ...state,
  //             status: STATUS.ERROR,
  //             error: action.payload
  //         };

  //     default:
  //         return state;
  // }
}
