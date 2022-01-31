export const GET_SENS_DATA = 'GET_SENS_DATA';
export const GET_CURR_SENS_DATA = 'GET_CURR_SENS_DATA';
export const SET_DATA_SET = 'SET_DATA_SET';
export const SET_CURR_SENS_DATA = 'SET_CURR_SENS_DATA';
export const setDataSet = (payload) => {
  return {
    type: SET_DATA_SET,
    payload, // { currSensData: cursor, arrSensData: arrData }
  };
};
// export const setCurrSensData = (payload) => {
//   return {
//     type: SET_CURR_SENS_DATA,
//     payload,
//   };
// };

// payload = {
//   date: date,
//   range: range,
//   func: convertArrObjectsToObjectPropertyArrays,
// }
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
  currSensData: {},
  dataSets: [], // массив с массивами
};

export const selCurrSensData = (state) => state.chartData.currSensData;
export const selDataSets = (state) => state.chartData.dataSets;
export function dataSetsRdcr(state = initialState, action) {
  switch (action.type) {
    case SET_DATA_SET:
      return {
        ...state,
        currSensData: action.payload.currSensData,
        dataSets: [action.payload.arrSensData],
      };

    // case SET_CURR_SENS_DATA:
    //   return {
    //     ...state,
    //     currSensData: [action.payload],
    //   };

    default:
      return state;
  }
}
