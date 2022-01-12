import React, { useState, useEffect } from 'react';
// import { Provider, useDispatch, useSelector } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import SvgChart from './components/SvgChart';
import { getSensData, selDataSets } from './reducers/dbdata';

import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import ruLocale from 'date-fns/locale/ru';

import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';

// import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
// import {DatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';
// import AdapterDateFns from '@date-io/date-fns';

const axis = {
  _id: {
    name: 'Дата',
    min: 0,
    max: 0,
    type: 'H',
    cls: 'axis',
    clrPath: '#000ff00',
  },
  t: {
    name: 'Температура',
    min: -50,
    max: 50,
    type: 'V',
    cls: 'axis',
    clrPath: '#FF0000',
  },
  p: {
    name: 'Давление',
    min: 0,
    max: 1000,
    type: 'V',
    cls: 'axis',
    clrPath: '#4F4FD9',
  },
  h: {
    name: 'Влажность',
    min: 0,
    max: 100,
    type: 'V',
    cls: 'axis',
    clrPath: '#FFFA40',
  },
};

const options = {
  padding: { top: 20, right: 10, bottom: 60, left: 30 },
  // fontH: 10, //?
  countVLabels: 3,
  axisTxtOffs: 8,
  // fontBBoxHeight: 0,
  // biggestDataStrBBoxWidth: 0,
  // svgElm: null,
  // rcClient: null,
  // numHSeg: 0,
  // lnHSeg: 0,
  // lnVSeg: 0,
};

function App() {
  const dispatch = useDispatch();
  const dataSets = useSelector(selDataSets);

  const [date, setDate] = useState(new Date(Date.now()));
  const [range, setRange] = useState(2);

  // NOTE! входные данные массив объектов, например:
  // [
  //      { d: '2021-11-05', t: 21.2, p: 36.9, h: 12.5 },
  //      { d: '2021-11-05', t: 21.2, p: 36.9, h: 12.5 },
  //      { d: '2021-11-05', t: 21.2, p: 36.9, h: 12.5 },
  // ]
  // функция возвращает объект со свойствами массивами
  // {
  //      _id: ['2021-11-05', ...],
  //      t: [21.2, ...],
  //      p: [36.9 ...],
  //      h: [12.5 ...]
  // }
  const convertArrObjectsToObjectPropertyArrays = (arrObjects) => {
    const out = {};
    if (arrObjects.length !== 0) {
      let o = arrObjects[0];
      for (const key in o) {
        out[key] = [];
      }

      arrObjects.forEach((el) => {
        for (const key in el) {
          out[key].push(el[key]);
        }
      });
    }
    return out;
  };

  const fetchData = (date, range) => {
    // console.log(date);
    dispatch(
      getSensData({
        date: date,
        range: range,
        func: convertArrObjectsToObjectPropertyArrays,
      })
    );
  };

  const addDateDay = (date, add) => {
    const dt = new Date(date);
    dt.setDate(dt.getDate() + add);
    return dt;
  };

  const onSetDate = (date) => {
    setDate(date);
    fetchData(date, range);
  };

  const onSetRange = (range) => {
    setRange(range);
    fetchData(date, range);
  };

  const onAddDate = (add) => {
    setDate((prev) => {
      const res = addDateDay(prev, add);
      fetchData(res, range);
      return res;
    });
  };

  useEffect(() => {
    console.log('App useEffect');
    fetchData(date, range);
  }, []); // componentDidMount()

  return (
    <div className='App'>
      <div id='controls'>
        <LocalizationProvider dateAdapter={AdapterDateFns} locale={ruLocale}>
          <DatePicker
            mask={'__.__.____'}
            label='Basic example'
            value={date}
            onChange={(newVal) => onSetDate(newVal)}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>

        <ButtonGroup
          variant='contained'
          aria-label='outlined primary button group'>
          <Button onClick={(e) => onAddDate(-1)}>One</Button>
          <Button onClick={(e) => onAddDate(1)}>Two</Button>
        </ButtonGroup>

        <Select
          labelId='demo-simple-select-label'
          id='demo-simple-select'
          value={range}
          label='Age'
          onChange={(e) => onSetRange(e.target.value)}>
          <MenuItem value={2}>2</MenuItem>
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={10}>10</MenuItem>
        </Select>
      </div>
      <div className='wrpSvg'>
        <SvgChart options={options} axis={axis} dataSets={dataSets} />
      </div>
    </div>
  );
}

export default App;
