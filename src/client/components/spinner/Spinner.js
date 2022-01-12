import React, { useState, useEffect } from 'react';
import '../../../media/snowflake.svg';
import './_style.scss';

const Spinner = ({ act, img }) => {
  //   return <div className='spinner'>{act}</div>;
  // const st = {
  //   // display: act ? 'block' : 'none',
  //   opacity: act.show ? '1' : '0',
  //   transition: 'opacity 400ms',
  //   // transition: 'opacity,transform 400ms',
  // };

  //   const stImg = {
  //     width: '32px',
  //     transition: 'transform 400ms',
  //     transform: act.show ? 'rotate(270deg)' : 'none',
  //   };
  //   console.log(act);
  //   return <div style={{ display: 'none' }}>{act}</div>;
  return (
    // <div className='spinner' style={st}>
    <div
      className='spinner'
      style={{
        opacity: act.show ? '1' : '0',
        transition: 'opacity 400ms',
      }}>
      <div>
        <svg
          className='spinner-img'
          viewBox='0 0 100 100'
          preserveAspectRatio='meet'>
          <use xlinkHref={img}></use>
        </svg>
        <br></br>
        {act.text}
      </div>
    </div>
  );
};

export default Spinner;
