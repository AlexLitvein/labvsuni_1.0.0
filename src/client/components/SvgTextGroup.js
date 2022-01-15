import React from "react";

export const TextGroup = ({ x, y, orient, offsX, offsY, texts, clr }) => {
    let ox = offsX, oy = offsY, angle = 0;
    if (orient === 'V') {
        angle = -90;
        ox = offsY;
        oy = offsX;
    }
    // console.log(`offsX: ${offsX} offsY: ${offsY}`);
    // console.log("x ",x);
    return (

       
        < g className="txt-axis" fill={clr} transform={`translate(${x}, ${y}) rotate(${angle})`} >
            {
                texts.map((el, i) => {
                    return (<TextSvg key={i} x={ox * i} y={oy * i} text={el} />);
                })
            }
        </g >
    );
}

const TextSvg = ({ x, y, text }) => {
    return (
        <text x={x} y={y}>{text}</text>
    );
}
