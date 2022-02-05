import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import statusRdcr from '../reducers/status/rdcr';
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
    data = await res.json();
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
  try {
    yield put(setStatus('Loading...'));
    const receivedData = yield fetchJson(
      // TODO:
      // 'http://localhost:3000/weather/getSensData',
      'http://134.90.161.173:80/weather/getSensData',
      act.payload.date,
      act.payload.range
    );

    const data = yield call(act.payload.func, receivedData.arrSensData);
    yield put(setStatus('Ok'));
    yield delay(300);
    yield put(setStatus(''));
    yield put(setDataSet({ currSensData: receivedData.currSensData, arrSensData: data }));
  } catch (e) {
    yield put(setStatus('Error'));
    yield delay(500);
    yield put(setStatus(''));
  }
}

function* sagaWatcher() {
  // console.log('sagaWatcher');
  yield takeLatest(GET_SENS_DATA, fetchSensData);
}

sagaMiddleware.run(sagaWatcher);
export default MyStore;
