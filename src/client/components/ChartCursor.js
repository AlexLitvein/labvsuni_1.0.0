import React, { useState, useEffect, useRef } from "react";

export function ChartCursor({ svgElm, options, axis, data }) {
    console.log("Call ChartCursor");

    options.noteW = 0;
    options.noteH = 0;

    const [_x, setX] = useState(options.rcClient.right);
    const [_y, setY] = useState(options.rcClient.top);

    const testPosX = (x) => {
        x = x < options.rcClient.left ? options.rcClient.left : x;
        x = x > options.rcClient.right ? options.rcClient.right : x;

        // console.log(`x ${x} options.rcClient.bottom ${options.rcClient.bottom} `);
        return x;
    }
    const testPosY = (y) => {
        y = y < options.rcClient.top ? options.rcClient.top : y;
        y = y > options.rcClient.bottom ? options.rcClient.bottom : y;
        return y;
    }

    const setPos = (x, y) => {
        setX(testPosX(x));
        setY(testPosY(y));
    }

    const aprox = (v1, v2, range, posInRange) => {
        return v1 + ((v2 - v1) * posInRange) / range;
    }

    const getVal = (x, y, idxDataSet) => {
        const out = [];
        let obj = data[idxDataSet];
        let idxDataHit = Math.trunc((x - options.rcClient.left) / options.lnHSeg);
        let posInRange = (x - options.rcClient.left) % options.lnHSeg;

        for (const key in obj) {
            const el = obj[key]; // [21.2, ...]
            let v1 = el[idxDataHit];
            let v2 = idxDataHit + 1 >= el.length ? el[idxDataHit] : el[idxDataHit + 1];
            // console.log(`v1 ${v1} v2 ${v2} idxDataHit + 1 ${idxDataHit + 1}`);

            if (axis[key].type === 'H') {
                v1 = Date.parse(v1);
                v2 = Date.parse(v2);
            }

            let apx = aprox(v1, v2, options.lnHSeg, posInRange);
            let res = apx.toFixed(1);

            if (axis[key].type === 'H') {
                res = new Date(apx);
                res =
                    ('0' + res.getDate()).slice(-2) +
                    '/' + ('0' + (res.getMonth() + 1)).slice(-2) +
                    '/' + res.getFullYear() % 100 + " " +
                    ('0' + res.getHours()).slice(-2) + ':' +
                    ('0' + res.getMinutes()).slice(-2);
            }

            let str = `${axis[key].name}: ${res}`;
            const sz = options.getStrBoundSize(str);
            options.noteW = sz.width > options.noteW ? sz.width + options.axisTxtOffs : options.noteW;
            options.noteH += sz.height;
            out.push({ clr: axis[key].clrPath, txt: str });
        }

        return out;
    }

    useEffect(() => {
        svgElm.current.addEventListener('click', (e) => {
            setPos(e.offsetX, e.offsetY);
            // console.log(`rc.left ${rc.left} rc.right ${rc.right} rc.bottom ${rc.bottom}`);
        });

        svgElm.current.addEventListener('mousemove', (e) => {

            // console.log('mouseover', e);
            if (e.buttons === 1) {
                setPos(e.offsetX, e.offsetY);
            }
        });

    }, []); // componentDidMount()

    return (
        <>
            {console.log('draw ChartCursor')}

            <path d={`M${_x} ${options.rcClient.top}V${options.rcClient.bottom}`} className="cursor"></path>
            <FlyNote x={_x} y={_y} options={options} arrStr={getVal(_x, _y, 0)} />
        </>
    );
}

export function FlyNote({ x, y, options, arrStr }) {
    // console.log('FlyNote gObj', gObj);
    const testPos = () => {
        let out = { x: x, y: y, };
        if (out.x + options.noteW > options.rcClient.right) {
            out.x = out.x - options.noteW;
        }
        if (out.y + options.noteH > options.rcClient.bottom) {
            out.y = options.rcClient.bottom - options.noteH;
        }
        return out;
    }

    function createRoundRect(x, y, w, h, r) {
        return (`
        M${x},${y} a${r},${r} 0 0,1 ${r},${-r} 
        h${w - (r << 1)} a${r},${r} 0 0,1 ${r},${r}
        v${h - r} a${r},${r} 0 0,1 ${-r},${r}
        h${-w + (r << 1)} a${r},${r} 0 0,1 ${-r},${-r}z
        `)
    }

    const [pos, setPos] = useState({ x: 0, y: 0 });
    useEffect(() => {
        setPos(testPos());
    }, [x, y]);

    if (options.noteW) {
        return (
            <>
                <path d={createRoundRect(pos.x, pos.y, options.noteW, options.noteH, 6)} className="note" />
                {arrStr.map((el, i) => {
                    return <text key={i} x={pos.x + 4} y={pos.y + (options.fontBBoxHeight * 0.7) + (i + 0) * options.fontBBoxHeight} className="note-text" fill={el.clr}>{el.txt}  </text>;
                })
                }
            </>
        );
    } else {
        return 0;
    }
}
