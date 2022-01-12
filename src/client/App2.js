import React, { useState, useEffect } from 'react';
import Spinner from '../components/spinner/Spinner.js';
// import '../media/snowflake.svg';
import '../media/home.jpg';

const App = () => {
  // useEffect(() => {}, []); // componentDidMount()
  const [spinAct, setSpinAct] = useState('');

  function* actions() {
    // нужно возвращать новый обЪект иначе вызов setState не заметит изменение ссылки
    yield { text: 'Loading...', show: true };
    yield { text: 'Ok', show: false };
  }

  // const nextAct = (genFu) => {
  //   let val = genFu.next().value;
  //   setSpinAct(val);
  //   return val;
  // };

  const btnHandler = (e) => {
    const actIter = actions();
    const res = setInterval(() => {
      let act = actIter.next().value;

      // console.log(act);
      // if (val) {
      //   setSpinAct(val);
      // }
      setSpinAct(act);
      if (!act.show) {
        // else
        clearInterval(res);
      }
    }, 1000);
  };

  // const btnHandler = (e) => {
  //   const actIter = actions();
  //   nextAct(actIter);
  //   const res = setInterval(() => {
  //     let val = nextAct(actIter);
  //     if (!val) {
  //       clearInterval(res);
  //     }
  //   }, 1000);
  // };

  return (
    <div className='app'>
      Hellow!
      <button type='button' onClick={btnHandler}>
        Click
      </button>
      <div className='cont'>
        <p>aafafadfadfdfdf</p>
        <img src='./media/home.jpg'></img>
        <Spinner act={spinAct} img='./media/snowflake.svg#snowflake'></Spinner>
      </div>
    </div>
  );
};

export default App;
