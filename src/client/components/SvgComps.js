import React, { useState, useEffect, useMemo } from "react";

export const AniPath = ({ id, options, axle, data }) => {
    console.log("AniPath");

    const [td, setTD] = useState({ t: "", d: "", data: []});

    // data = [num1 , num2 , num3 , ...]
    const buildSvgAniPath = (rc, min, max, data) => {       
        let res = 'M';
        for (let i = 0; i < data.length; i++) {
            let val = data[i];
            val = Math.round(((val - min) / (max - min)) * (rc.bottom - rc.top));            
            res += `${rc.left + options.lnHSeg * i} ${rc.bottom - val}`;
            if (i < data.length - 1) { res += 'L'; }
        }
        return res;
    }

    useEffect(() => {
        console.log(`AniPath useEffect `);

        setTD((prev) => {
            // console.log('prev', prev);

            const to = buildSvgAniPath(options.rcClient, axle.min, axle.max, data);
            
            const newTD = {};
            if (prev.data.length === 0 || prev.data.length !== data.length) {
                newTD.d = options.getOrthoPath(
                    options.rcClient.left,
                    options.rcClient.top + (options.lnVSeg * (options.countVLabels - 1)),
                    options.rcClient.right - options.rcClient.left,
                    options.numHSeg ,
                    'H'
                );
            } else {
                newTD.d = prev.t;
            }
            newTD.t = to;
            newTD.data=data;
            // console.log('AniPath res', newTD);
            return newTD;
        });

    }, [data]);

    return (
        <path
            className={'path-data'}
            style={{ stroke: axle.clrPath, marker: `url("#mrk_${id}")` }}           
            d={td.d}>
            <animate id={`ani_${id}`} begin="ani_set_data.begin" attributeName="d" dur="0.5" fill="freeze" to={td.t} />
        </path>
    );
}

// export const AniPath = ({ pref, cls, d, to, clrPath }) => {
//     console.log("AniPath", pref);

//     const [td, setTD] = useState({ t: "", d: "", });

//     useEffect(() => {
//         console.log(`AniPath useEffect `);

//         setTD((prev) => {
//             console.log('prev', prev);
//             const res = {};
//             if (prev.d.length === 0 || prev.d.length !== to.length) {
//                 res.d = d;
//             } else {
//                 res.d = prev.t;
//             }
//             res.t = to;
//             console.log('AniPath res', res);
//             return res;
//         });

//     }, [to, d]);

//     return (
//         <path
//             className={cls}
//             style={{ stroke: clrPath, marker: `url("#mrk_${pref}")` }}
//             // d={pD}>
//             d={td.d}>
//             <animate id={`ani_${pref}`} begin="ani_set_data.begin" attributeName="d" dur="0.5" fill="freeze" to={td.t} />
//         </path>
//     );
// }

export function Axle({ d, cls }) {
    return (
        <path d={d} className={cls} ></path>
    );
}

export const SvgMarker = ({ id, cls, w, h, refX, refY, mrkEl }) => {
    return (
        <defs>
            <marker id={id}
                className={cls}
                markerWidth={w}
                markerHeight={h}
                refX={refX} refY={refY}
                orient="auto"
                markerUnits="userSpaceOnUse"
            >
                {mrkEl}
            </marker>
        </defs>
    );
}
