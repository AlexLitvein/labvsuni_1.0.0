export const GET_SENS_DATA = 'GET_SENS_DATA';
export const SET_DATA_SET = 'SET_DATA_SET';
export const setDataSet = (payload) => {
  return {
    type: SET_DATA_SET,
    payload,
  };
};

export const getSensData = (payload) => {
  // console.log('act getSensData');
  return {
    type: GET_SENS_DATA,
    payload,
  };
};

// набор данных:
// [
//      {
//           _id: ['2021-11-05', ...],
//           t:   [21.2, ...],
//           p:   [36.9 ...],
//           h:   [12.5 ...]
//      },
//      ...
// ]
const initialState = {
  dataSets: [],
};

export const selDataSets = (state) => state.chartData.dataSets;
export function dataSetsRdcr(state = initialState, action) {
  switch (action.type) {
    case SET_DATA_SET:
      return {
        ...state,
        dataSets: [action.payload],
      };

    default:
      return state;
  }
}
