import React, { useState, useEffect } from 'react';
// import '../../../media/snowflake.svg';
import './_style.scss';

const Spinner = ({ msg, img }) => {
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
        opacity: msg ? '1' : '0',
        // transition: 'opacity 400ms',
        // animationPlayState: 'paused',
      }}>
      <div>
        <svg
          className='spinner-img'
          style={{ animationPlayState: msg ? 'running' : 'paused' }}
          viewBox='0 0 100 100'
          preserveAspectRatio='meet'>
          <use xlinkHref={img}></use>
        </svg>
        <br></br>
        <span>{msg === '' ? '\u00A0' : msg}</span>
      </div>
    </div>
  );
};

export default Spinner;
