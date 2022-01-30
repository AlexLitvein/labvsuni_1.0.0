import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import statusRdcr from '../reducers/status/rdcr';
// import { setError, setLoaded, setLoading } from '../rdcrs/status/acts';
// import { remote_data } from './remoteData';
import { GET_SENS_DATA, dataSetsRdcr, setDataSet } from '../reducers/dbdata';
import { setStatus } from '../reducers/status/acts';
const { call, put, takeLatest, delay } = require('redux-saga/effects');

async function fetchJson(url, date, range) {
  let data = {};
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({ startData: date, range: range }),
  });

  if (res.ok) {
    // если HTTP-статус в диапазоне 200-299
    data = await res.json(); // получаем тело ответа (см. про этот метод ниже)
  } else {
    console.log('Ошибка HTTP: ' + res.status);
  }

  return data;
}

const rootReducer = combineReducers({
  chartData: dataSetsRdcr,
  statusData: statusRdcr,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const sagaMiddleware = createSagaMiddleware();
const MyStore = createStore(rootReducer, composeEnhancers(applyMiddleware(sagaMiddleware)));

function* fetchSensData(act) {
  // act = { date, count, func }
  // console.log('fetchSensData', act);
  try {
    // yield put(setLoading());
    yield put(setStatus('Loading...'));
    // const receivedData = yield remote_data[act.payload.date].slice(0, act.payload.range);
    const receivedData = yield fetchJson(
      'http://localhost:3000/weather/getSensData',
      act.payload.date,
      act.payload.range
    );
    // console.log('receivedData', receivedData);
    const data = yield call(act.payload.func, receivedData);

    yield delay(300);

    yield put(setStatus('Ok'));
    yield delay(300);
    yield put(setStatus(''));

    yield put(setDataSet(data)); //{ data }

    // yield delay(300);
    // yield put(setStatus(''));
    // yield put(setLoaded());
  } catch (e) {
    yield put(setStatus('Error'));
    yield delay(500);
    yield put(setStatus(''));
  }
}

function* sagaWatcher() {
  // console.log('sagaWatcher');
  yield takeLatest(GET_SENS_DATA, fetchSensData);
  // yield takeLatest(GET_SENS_DATA, fetchSensData);
}

sagaMiddleware.run(sagaWatcher);
export default MyStore;
