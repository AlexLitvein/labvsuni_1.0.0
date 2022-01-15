import React, { useState, useEffect, useMemo } from "react";

export const AniPath = ({ id, options, axle, data }) => {
    console.log("AniPath");

    const [td, setTD] = useState({ t: "", d: "", data: [] });

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
                    options.rcClient.top + (options.lnVSeg * options.numVSeg),
                    options.rcClient.right - options.rcClient.left,
                    options.numHSeg,
                    'H'
                );
            } else {
                newTD.d = prev.t;
            }
            newTD.t = to;
            newTD.data = data;
            // console.log('AniPath res', newTD);
            return newTD;
        });
    }, [data, options.rcClient]);
    // }, [data]);

    return (
        <path
            className={'path-data'}
            style={{ stroke: axle.clrPath, marker: `url("#mrk_${id}")` }}
            d={td.d}>
            <animate id={`ani_${id}`} begin="ani_trigg.begin" attributeName="d" dur="300ms" to={td.t} fill="freeze"  />
            {/* <animate id={`ani_${id}`} begin="0s" attributeName="d" dur="1s" fill="freeze" to={td.t} /> */}
        </path>
    );
}

export function Axle({ type, cls, options }) {
    console.log('call Axle');

    const buildAxlePath = (x, y, numSeg, type) => {
        let d = `M${options.cut(x)} ${options.cut(y)}`;
        let pos = type === 'H' ? x : y;
        let lnSeg = type === 'H' ? options.lnHSeg : options.lnVSeg;
        for (let i = 1; i <= numSeg; i++) {
            d += type + (pos + lnSeg * i);
        }
        return d;
    }

    const [d, setD] = useState("");

    useEffect(() => {
        const rc = options.rcClient;
        setD(buildAxlePath(
            rc.left,
            type === 'H' ? rc.top + (options.lnVSeg * options.numVSeg) : rc.top,
            type === 'H' ? options.numHSeg : options.numVSeg,
            type
        ));
    }, [options.rcClient]);

    return (
        <path d={d} className={cls} ></path>
    );
}

export function ChartAxis({ axis, options }) {
    const out = [];
    for (const key in axis) {
        const el = axis[key];
        out.push(<Axle key={key} type={el.type} cls={el.cls} options={options} />);
    }
    return out;
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
