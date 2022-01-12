export const SET_STATUS = 'SET_STATUS';
export const STATUS_EMPTY = 'NO DATA';
export const STATUS_LOADING = 'LOADING...';
export const STATUS_LOADED = 'LOADED';
export const STATUS_ERROR = 'ERROR!';

// export const setEmpty = () => {
//     console.log('act setEmpty');
//     return {
//         type: SET_EMPTY_STATUS,
//     }
// };

// export const setLoading = () => {
//     console.log('act setLoading');
//     return {
//         type: SET_LOADING_STATUS,
//     }
// };

// export const setLoaded = () => {
//     console.log('act setLoaded');
//     return {
//         type: SET_LOADED_STATUS,
//     }
// };

// export const setError = (err) => {
//     console.log('act setError');
//     return {
//         type: SET_ERROR_STATUS,
//         payload: err
//     }
// };

export const setStatus = (payload) => {
  return {
    type: SET_STATUS,
    payload,
  };
};
