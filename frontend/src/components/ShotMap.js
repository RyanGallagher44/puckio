import * as d3 from "d3";
import {useState} from "react";
import rink from '../img/rink.png';
import {Tooltip} from "./Tooltip";

const MARGIN = {top: 0, right: 5, bottom: 40, left: 0};

export const ShotMap = ({width, height, data, centerIceLogo}) => {
    const boundsWidth = width - MARGIN.right - MARGIN.left;
    const boundsHeight = height - MARGIN.top - MARGIN.bottom;

    const [hovered, setHovered] = useState(null);

    const yScale = d3.scaleLinear().domain([-42.5, 42.5]).range([boundsHeight, 0]);
    const xScale = d3.scaleLinear().domain([-100, 100]).range([0, boundsWidth]);

    const allShapes = data.map((d, i) => {
        return (<circle
            key={i}
            r={3}
            cx={xScale(d.x)}
            cy={yScale(d.y)}
            opacity={1}
            stroke={d.color}
            fill={d.color}
            fillOpacity={0.75}
            onMouseEnter={() => setHovered({
                xPos: xScale(d.x), yPos: yScale(d.y), name: d.description
            })}
            onMouseLeave={() => setHovered(null)}
        />);
    });

    return (<div style={{position: "relative"}}>
        <svg width={width} height={height}>
            <image href={rink} width={width}/>
            <image opacity={0.5} href={centerIceLogo} width="65" transform="translate(141, 45.5)"/>
            <g
                width={boundsWidth}
                height={boundsHeight}
                transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
            >
                {allShapes}
            </g>
        </svg>

        <div
            style={{
                width: boundsWidth,
                height: boundsHeight,
                position: "absolute",
                top: 0,
                left: 0,
                pointerEvents: "none",
                marginLeft: MARGIN.left,
                marginTop: MARGIN.top,
            }}
        >
            <Tooltip interactionData={hovered}/>
        </div>
    </div>);
};
