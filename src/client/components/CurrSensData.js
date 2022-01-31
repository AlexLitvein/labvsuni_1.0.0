import React from 'react';
import SvgIcon from '@mui/material/SvgIcon';

const CurrSensData = (props) => {
  const rotate = () => {
    let a = 0;
    return (e) => {
      e.currentTarget.style.transform = `rotate(${(a -= 360)}deg)`;
      props.fetchDataFu(new Date(Date.now()), 1);
    };
  };

  return (
    <div className='right-wrp'>
      <div className='temp-wrp bb'>
        <span className='temper'>{props.currSensData.t}</span>
        <div className='bttn32 bttn-refr' onClick={rotate()}>
          <SvgIcon className='bttn32' viewBox='0 0 100 100'>
            <use xlinkHref={'./media/snowflake.svg#refresh'}></use>
          </SvgIcon>
        </div>
      </div>
      <div className='curr bl'>
        Сейчас
        <br />
        В: {Math.trunc(props.currSensData.h)} %
        <br />
        Д: {Math.trunc(props.currSensData.p)} мм
      </div>
    </div>
  );
};

export default CurrSensData;
