import React from 'react';
import './_style.scss';

const Spinner = ({ msg, img }) => {
  return (
    <div
      className='spinner'
      style={{
        opacity: msg ? '1' : '0',
        visibility: msg ? 'visible' : 'hidden',
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
