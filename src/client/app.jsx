import React, { useState, useEffect } from 'react';
// import { Provider, useDispatch, useSelector } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import SvgChart from './components/SvgChart';
import { getSensData, selCurrSensData, selDataSets } from './reducers/dbdata';

import { ThemeProvider, createTheme } from '@mui/material/styles';
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
import Spinner from './components/Spinner/Spinner';
// import {DatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';
// import AdapterDateFns from '@date-io/date-fns';
import '../media/snowflake.svg';
// import '../media/refresh.svg';
import { selStatus } from './reducers/status/sels';
import { Box, FormControl, IconButton, InputLabel } from '@mui/material';
import { cyan, lightBlue } from '@mui/material/colors';
// import DeleteIcon from '@mui/icons-material/Delete';

import SvgIcon from '@mui/material/SvgIcon';
import CurrSensData from './components/CurrSensData';
// import ArrowRight from './media/snowflake.svg#arrowright';
// import { ReactComponent as ArrowRight } from './media/snowflake.svg#arrowright';

const { io } = require('socket.io-client');

const theme = createTheme({
  palette: {
    primary: {
      main: lightBlue[300],
      contrastText: '#1d5395',
    },
    secondary: {
      main: cyan[400],
      // contrastText: '#4d4d4d',
    },
    background: {
      paper: lightBlue[200],
    },
    // text: {
    //   primary: '#ff0000',
    // },
  },
});

// const axisCls = 'chart1i0i0-axis';
const axis = {
  _id: {
    name: 'Дата',
    min: 0,
    max: 0,
    type: 'H',
    cls: 'chart1i0i0-axis chart1i0i0-axis-horz',
    clrPath: '#000ff00',
  },
  t: {
    name: 'Температура',
    min: -50,
    max: 50,
    type: 'V',
    cls: 'chart1i0i0-axis chart1i0i0-axis-vert',
    clrPath: '#b73838',
  },
  p: {
    name: 'Давление',
    min: 700,
    max: 800,
    type: 'V',
    cls: 'chart1i0i0-axis chart1i0i0-axis-vert',
    clrPath: '#fffb00',
  },
  h: {
    name: 'Влажность',
    min: 0,
    max: 100,
    type: 'V',
    cls: 'chart1i0i0-axis chart1i0i0-axis-vert',
    clrPath: '#03fbfb',
  },
};

// options.[\w]* ?=
const options = {
  padding: { left: 20, top: 20, right: 20, bottom: 60 },
  // fontH: 10, //?
  countVLabels: 5,
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
  const currSensData = useSelector(selCurrSensData);
  const dataStatus = useSelector(selStatus);

  const [date, setDate] = useState(new Date(Date.now()));
  // const [date, setDate] = useState(new Date('2021-11-01'));
  const [range, setRange] = useState(1);
  const [stat, setStat] = useState({ visitCount: 0, online: 0 });
  // const [spinAct, setSpinAct] = useState('');

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

  // const rotate = () => {
  //   let a = 0;
  //   return (e) => {
  //     // console.log('rot');
  //     e.currentTarget.style.transform = `rotate(${(a -= 360)}deg)`;
  //   };
  // };

  const onAddDate = (add) => {
    setDate((prev) => {
      const res = addDateDay(prev, add);
      fetchData(res, range);
      return res;
    });
  };

  useEffect(() => {
    // TODO:
    // const socket = io('localhost:3000');
    const socket = io('http://134.90.161.173:80');

    socket.on('statistic', (payload) => {
      setStat(payload);
    });

    // console.log('App useEffect componentDidMount() fetchData');
    fetchData(date, range);
  }, []); // componentDidMount()

  return (
    <ThemeProvider theme={theme}>
      <div className='App'>
        <div className='hdr'>
          <div className='hdr_vtxt'>
            Погода&nbsp;в
            <br />
            городе
          </div>
          <div className='hdr_left bb'>Ю</div>
          <div className='middle-wrp bb'>
            <span className='hdr_right'>рга</span>
          </div>
          <CurrSensData currSensData={currSensData} fetchDataFu={fetchData}></CurrSensData>
        </div>
        <Box
          sx={{
            borderLeft: 8,
            py: 1,
            display: 'flex',
            justifyContent: 'space-between',
            backgroundColor: 'primary.light',
          }}>
          <div className='ctrls-left-wrp'>
            <Button variant='contained' sx={{ height: '100%' }}>
              <SvgIcon viewBox='0 0 100 100'>
                <use xlinkHref={'./media/snowflake.svg#calendar'}></use>
              </SvgIcon>
            </Button>
            <div className='lpan bt bb'>
              <LocalizationProvider dateAdapter={AdapterDateFns} locale={ruLocale}>
                <DatePicker
                  mask={'__.__.____'}
                  label='Выберите дату'
                  value={date}
                  onChange={(newVal) => onSetDate(newVal)}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </div>
          </div>
          <ButtonGroup variant='contained' aria-label='outlined primary button group'>
            <Button onClick={(e) => onAddDate(-range)}>
              <SvgIcon viewBox='0 0 100 100'>
                <use xlinkHref={'./media/snowflake.svg#arrowright'} transform='scale(-1 1) translate(-100 0)'></use>
              </SvgIcon>
            </Button>
            <FormControl size='small' sx={{ width: 120 }}>
              <InputLabel id='lab-range'>Период</InputLabel>
              <Select
                labelId='lab-range'
                label='Период'
                id='sel-range'
                value={range}
                onChange={(e) => onSetRange(e.target.value)}>
                <MenuItem value={1}>1 день</MenuItem>
                <MenuItem value={7}>7 дней</MenuItem>
                <MenuItem value={30}>30 дней</MenuItem>
              </Select>
            </FormControl>
            <Button onClick={(e) => onAddDate(range)}>
              <SvgIcon viewBox='0 0 100 100'>
                <use xlinkHref={'./media/snowflake.svg#arrowright'}></use>
              </SvgIcon>
            </Button>
          </ButtonGroup>
          <div className='ctrls-right-wrp'>
            <Button variant='contained' sx={{ height: '100%' }}>
              <SvgIcon viewBox='0 0 100 100'>
                <use xlinkHref={'./media/snowflake.svg#info'}></use>
              </SvgIcon>
            </Button>
            <div className='lpan rpan bt bb br'>
              <div className='f1'>
                <div className='f1right'>
                  Сейчас
                  <br />
                  просматривают:
                  <br />
                  {stat.online} человек
                  <hr></hr>
                  Посещений
                  <br />
                  за сегодня:
                  <br />
                  {stat.visitCount}
                </div>
              </div>
              <div className='f2'>©LABvsUNI, 2022</div>
            </div>
          </div>
        </Box>
        <div className='chart bl bb'>
          {/* <div className='chart-wrp'> */}
          <SvgChart options={options} axis={axis} dataSets={dataSets} />
          <Spinner msg={dataStatus} img='media/snowflake.svg#snowflake'></Spinner>
        </div>
        {/* </div> */}
      </div>
    </ThemeProvider>
  );
}

export default App;
