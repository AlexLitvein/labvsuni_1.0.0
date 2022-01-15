import React, { useState, useEffect, useRef, useMemo } from 'react';
// import { useSelector } from "react-redux";
// import { selStatus } from "../rdcrs/status/sels";
// import { selStatus } from "../rdcr/status/sels"; // , STATUS
import { ChartCursor } from './ChartCursor';
// import Spinner from "./Spinner";
import { AniPath, Axle, ChartAxis, SvgMarker } from './SvgComps';
import { TextGroup } from './SvgTextGroup';

const SvgChart = ({ options, axis, dataSets = [] }) => {
  console.log('call SvgChart'); // , dataSets

  let opt = options;

  const svgElm = useRef(null);
  const txtRef = useRef(null);
  const aniTrigEl = useRef(null);

  // const status = useSelector(selStatus);

  // let { width, height } = svgElm.current?.parentElement.getBoundingClientRect();
  // const [sz, setSize] = useState({ width, height });
  const [sz, setSize] = useState({ w: 480, h: 320 });

  // WARNING: для ортогональных линий, ширину использовать кратную 2 пикселям, координаты целочисоенные
  //   opt.cut = (n) => Math.trunc(n); // лучше отсекать, чем округлять, иначе сумма сегментов иногда будет больше отрезка в который они должны уложиться
  opt.cut = (n) => Math.trunc(n * 10) * 0.1;

  // const cut = (n) => Math.ceil(n);
  // const cut = (n) => (Math.trunc(n * 10)) / 10;
  // const cut = (n) => {
  //     let t=Math.trunc(n * 10);
  //     let res=t /10;
  //     return res;
  //     // return Math.trunc(n * 10) * 0.1;
  // }

  const _clientRect = () => {
    // oreder!
    return {
      left: options.padding.left,
      top: options.padding.top,
      right: sz.w - options.padding.right,
      bottom: sz.h - options.padding.bottom,
    };
  };

  opt.numHSeg = dataSets.length !== 0 ? dataSets[0]._id.length - 1 : 1;
  opt.numVSeg = options.countVLabels - 1;
  opt.lnHSeg = opt.cut(
    (sz.w - options.padding.left - options.padding.right) / opt.numHSeg
  );
  opt.lnVSeg = opt.cut(
    (sz.h - options.padding.top - options.padding.bottom) / opt.numVSeg
  );
  opt.rcClient = _clientRect();

  // options.getOrthoLine = (x, y, size, numSeg, type) => {
  //     let d = `M${cut(x)} ${cut(y)}`;
  //     let pos = type === 'H' ? x : y;
  //     // let lnSeg = size / numSeg;
  //     let lnSeg = type === 'H' ? opt.lnHSeg : opt.lnVSeg;
  //     for (let i = 1; i <= numSeg; i++) {
  //         // d += type + cut(pos + lnSeg * i);
  //         d += type + (pos + lnSeg * i);
  //     }
  //     return d;
  // }

  options.getOrthoPath = (x, y, size, numSeg, type) => {
    let d = 'M';
    let posX = type === 'H' ? x : y;
    let posY = type === 'H' ? y : x;
    let lnSeg = size / numSeg;
    for (let i = 0; i <= numSeg; i++) {
      // d += type + cut(pos + lnSeg * i);
      d += `${opt.cut(posX + lnSeg * i)} ${posY}`;
      if (i < numSeg) {
        d += 'L';
      }
    }
    return d;
  };

  // options.calcStride = (minLen, totalLen, count) => {
  //     let i = 24, stride = 0;
  //     for (; i > 0; i--) {
  //         if (24 % i === 0) {
  //             let dxVLine = totalLen / (i * count);
  //             if (dxVLine > minLen) {
  //                 stride = 24 / i;
  //                 break;
  //             }
  //         }
  //     }
  //     return stride || 1;
  // }
  options.calcStride = (minLen, totalLen, count) => {
    let i = count,
      stride = 0;
    for (; i > 0; i--) {
      if (count % i === 0) {
        let dxVLine = totalLen / i;
        if (dxVLine > minLen) {
          stride = count / i;
          break;
        }
      }
    }
    return stride || 1;
  };
  // const buildAxlePath = (rc, type) => {
  //     return options.getOrthoLine(
  //         rc.left,
  //         type === 'H' ? rc.top + (opt.lnVSeg * opt.numVSeg) : rc.top,
  //         type === 'H' ? (rc.right - rc.left) : (rc.bottom - rc.top),
  //         type === 'H' ? opt.numHSeg : opt.numVSeg,
  //         type
  //     );
  // }

  const calcPadding = () => {
    let szHText = { width: 0, height: 0 };
    let szVText = { width: 0, height: 0 };
    for (const key in axis) {
      const el = axis[key]; //_id: { name: 'Дата', min: 0, max: 0, type: 'H', cls: 'axis', clrPath: '#000ff00' },

      if (el.type === 'H') {
        if (dataSets.length !== 0) {
          let dataObj = dataSets[0];
          szHText = opt.getStrBoundSize(_formatDateStr(dataObj[key][0]));
        }
      } else {
        const tmp = opt.getStrBoundSize(el.max);
        szVText = tmp.width > szVText.width ? tmp : szVText;
      }
    }
    // console.log(`szHText ${szHText} szVText ${szVText}`);
  };

  opt.getStrBoundSize = (str, cls) => {
    let bbox = { width: 0, height: 0 };
    if (txtRef.current) {
      txtRef.current.innerHTML = str;
      // if(cls) txtRef.current.className = cls;
      if (cls) txtRef.current.setAttribute('class', cls);
      bbox = txtRef.current.getBBox();
    }
    return { width: opt.cut(bbox.width), height: opt.cut(bbox.height) };
  };

  // const renderPathAxis = (rc, axis) => {
  //     console.log("renderPathAxis");
  //     const out = [];
  //     for (const key in axis) {
  //         const el = axis[key];
  //         out.push(
  //             <Axle key={key} d={buildAxlePath(rc, el.type)} cls={el.cls} />
  //         );
  //     }
  //     return out;
  // }

  const _formatDateStr = (str) => {
    let data = new Date(str);
    // let dataStr = ('0' + data.getHours()).slice(-2) + '/' + ('0' + data.getDate()).slice(-2) + '/' + ('0' + (data.getMonth() + 1)).slice(-2) + '/' + data.getFullYear() % 100;
    let dataStr =
      ('0' + data.getDate()).slice(-2) +
      '/' +
      ('0' + (data.getMonth() + 1)).slice(-2) +
      '/' +
      ('0' + data.getHours()).slice(-2) +
      ':00';
    return dataStr;
  };

  const renderVTextAxis = (rc, dataFieldText, arrDataSets) => {
    let arrStrs = arrDataSets.length !== 0 ? arrDataSets[0][dataFieldText] : [];
    const tmpStr = _formatDateStr(arrStrs[0]);
    const sz = opt.getStrBoundSize(tmpStr, 'txt-axis');
    let dx = opt.cut(sz.height >> 2);

    opt.padding.bottom = Math.max(
      opt.padding.bottom,
      sz.width + options.axisTxtOffs * 0
    );

    // let stride = options.calcStride(
    //   sz.height,
    //   rc.right - rc.left,
    //   arrStrs.length // / 24
    // );
    let stride = Math.ceil(arrStrs.length / ((rc.right - rc.left) / sz.height));

    let prevDay = 0;
    let currDay = 0;
    arrStrs = arrStrs.map((el, i) => {
      // el = 2021-01-04T15:00:00.034Z
      //   if (i % stride === 0) {
      if ((i * sz.height) % stride === 0) {
        let res = '';
        let data = new Date(el);
        currDay = data.getDate();
        if (currDay !== prevDay) {
          res = _formatDateStr(el);
        } else {
          res = ('0' + data.getHours()).slice(-2) + ':00';
        }
        // if (i % stride === 0) {
        //     return _formatDateStr(el);
        // }
        prevDay = currDay;
        // return _formatDateStr(el);
        return res;
      }
    });

    return (
      <TextGroup
        x={rc.left + dx}
        y={rc.bottom + options.axisTxtOffs}
        orient={'V'}
        offsX={opt.cut(opt.lnHSeg)}
        offsY={0}
        texts={arrStrs}
      />
    );
  };

  const renderHTextAxle = (x, y, axle) => {
    const arrStrs = [];
    let delta = (Math.abs(axle.min) + axle.max) / opt.numVSeg;
    arrStrs.push(axle.max);
    // arrStrs.push(axle.max+axle.unit);

    const sz = opt.getStrBoundSize(axle.max);
    opt.padding.left = Math.max(
      opt.padding.left,
      sz.width + options.axisTxtOffs * 1
    );

    for (let i = 1; i <= opt.numVSeg - 1; i++) {
      arrStrs.push(axle.max - i * delta);
    }
    arrStrs.push(axle.min);
    return (
      <TextGroup
        key={axle.name}
        x={x}
        y={y}
        orient={'H'}
        offsX={0}
        offsY={opt.lnVSeg}
        texts={arrStrs}
        clr={axle.clrPath}
      />
    );
  };

  const renderHTextAxis = (rc) => {
    const res = [];
    const sz = opt.getStrBoundSize('test');
    let cntAxis = Object.keys(axis).length - 1; // -1 тк первая ось горизонтальная
    let startPos = opt.cut(rc.top - ((cntAxis * sz.height) / 2) * 1.15);
    for (const key in axis) {
      if (axis[key].type === 'H') {
        continue;
      }
      res.push(
        renderHTextAxle(
          rc.left - options.axisTxtOffs,
          (startPos += sz.height),
          axis[key]
        )
      );
    }
    return res;
  };

  function resize() {
    let { width, height } =
      svgElm.current.parentElement.getBoundingClientRect();
    // возвращаются float коорд
    // setW(cut(width));
    // setH(cut(height));
    setSize({ w: opt.cut(width), h: opt.cut(height) });

    // console.log('resize height', height);
  }

  // ===========================
  // input
  // {
  //      _id: ['2021-11-05', ...],
  //      t:   [21.2, ...],
  //      p:   [36.9 ...],
  //      h:   [12.5 ...]
  // }
  const renderDataSet = (obj, idx) => {
    console.log('renderDataSet');
    const out = [];
    for (const key in obj) {
      const el = obj[key]; // [21.2, ...]
      if (axis[key].type === 'H') {
        continue;
      }
      out.push(
        <AniPath
          key={key + idx}
          id={key}
          options={options}
          axle={axis[key]}
          data={el}
        />
      );
    }
    return out;
  };

  // ===========================
  // input
  // {
  //      _id: ['2021-11-05', ...],
  //      t:   [21.2, ...],
  //      p:   [36.9 ...],
  //      h:   [12.5 ...]
  // }
  // const renderDataSet = (obj, preId) => {
  //     console.log("renderDataSet");
  //     const out = [];
  //     let min = 0, max = 0, clrPath = '';
  //     for (const key in obj) {
  //         const el = obj[key]; // [21.2, ...]
  //         if (axis[key].type === 'H') {
  //             continue;
  //         }
  //         ({ min, max, clrPath } = axis[key]);
  //         const res = { ...buildSvgAniPath(opt.rcClient, min, max, el) };
  //         out.push(
  //             <AniPath key={key + preId} pref={key} cls={'path-data'} d={res.do} to={res.to} clrPath={clrPath} />
  //         );
  //     }
  //     return out;
  // }

  // const renderDataSets = () => {
  //     const out = dataSets.map((itm, idx) => {
  //         return renderDataSet(itm, idx);
  //     });

  //     // aniTrigEl.current?.beginElement();
  //     return out;

  //         // return dataSets.map((itm, idx) => renderDataSet(itm, idx));
  // }

  const renderMarkers = () => {
    const out = [];
    for (const key in axis) {
      const el = axis[key];
      out.push(
        <SvgMarker
          key={key}
          id={`mrk_${key}`}
          cls={`mrk_${key}`}
          w={8}
          h={8}
          refX={4}
          refY={4}
          mrkEl={<circle cx='4' cy='4' r='4' style={{ fill: el.clrPath }} />}
        />
      );
    }
    return out;
  };

  // const renderedDataSet = useMemo(() => {
  //     // const out = [];
  //     console.log("useMemo");

  //     // aniTrigEl.current?.beginElement();

  //     return dataSets.map((itm, idx) => {
  //         return renderDataSet(itm, idx);
  //     });

  //     // return renderDataSets();
  // }, [dataSets, sz]);//

  useEffect(() => {
    if (dataSets.length !== 0) {
      aniTrigEl.current?.beginElement();
    }
  }, [dataSets]);

  // useEffect(() => {
  //     if (status === STATUS.LOADING) {
  //         console.log('STATUS.LOADING');

  //         aniTrigEl.current?.beginElement();
  //     }
  //     if (status === STATUS.LOADED) {
  //         aniTrigEl.current?.endElement();
  //     }
  // }, [status]);

  useEffect(() => {
    console.log('SvgChart useEffect');

    resize();
    // const sz = opt.getStrBoundSize('test');
    // opt.fontBBoxHeight = sz.height;
    // calcPadding();
    window.addEventListener('resize', (e) => {
      resize();
    });
  }, []); // componentDidMount()

  return (
    <svg id='graph' ref={svgElm} width={sz.w} height={sz.h}>
      {console.log('draw SvgChart')}

      {/* {console.log('opt.rcClient before', opt.rcClient)} */}

      <path className='path-data' style={{ stroke: 'blue' }} d='M0 -10h10'>
        <animate
          id='ani_trigg'
          ref={aniTrigEl}
          begin='indefinite'
          attributeName='d'
          dur='0s'
          to='M0 -10h20'
          fill='freeze'
        />
      </path>

      {/* <path className="path-data" style={{ stroke: 'blue' }} d="M0 10h10">
                <animate id="ani-trigg" ref={aniTrigEl} begin="0s" attributeName="d" dur="1s" to="M0 10h200" fill="freeze" />
            </path> */}

      {/* Для вычисления высоты и ширины текста */}
      <text x={-100} y={-100} ref={txtRef}>
        test
      </text>

      {/* <rect x="10" y="10" width="20" height="20" stroke="black" fill="none">
                <animate id="animation" attributeName="width" attributeType="XML" values="20;10;20" begin="0s" dur="3s" repeatDur="indefinite" end="ani_p.begin" />
            </rect> */}

      <SvgMarker
        id={'mrkVHAxis'}
        cls={'mrk-axis'}
        w={2}
        h={6}
        refX={2}
        refY={6}
        mrkEl={<line x2='0' y2='6' />}
      />

      {renderHTextAxis(opt.rcClient)}
      {renderVTextAxis(opt.rcClient, '_id', dataSets)}
      {/* {renderMarkers()} */}
      {/* {renderPathAxis(opt.rcClient, axis)} */}

      <ChartAxis axis={axis} options={options} />

      {dataSets.map((itm, idx) => {
        return renderDataSet(itm, idx);
      })}

      {/* {console.log('renderedDataSet', renderedDataSet)} */}
      {/* {renderDataSets} */}
      {/* {renderedDataSet} */}

      <ChartCursor
        svgElm={svgElm}
        options={options}
        axis={axis}
        data={dataSets}
      />

      {/* <Spinner status={status} bgnAniId={'ani-trigg'} endAniId={'ani_p'} options={opt} /> */}
      {/* {console.log('opt.rcClient after', opt.rcClient)} */}
    </svg>
  );
};

export default SvgChart;
