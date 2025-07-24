import React, { useState } from "react";
import { Handle, Position } from "reactflow";
import { INodeProps } from "../interfaces";
import { NodeWrapper } from "./NodeWrapper";

export const DecisionNode: React.FC<INodeProps> = ({ data }) => {
  const [label, setLabel] = useState(data.label);

  const nodeData = {
    ...data,
    width: data.width ?? 120,
    height: data.height ?? 120,
  };

  const { width, height } = nodeData;

  const halfW = width / 2;
  const halfH = height / 2;

  const diamondPoints = `${halfW},0 ${width},${halfH} ${halfW},${height} 0,${halfH}`;

  const sides = [
    { side: Position.Top, left: halfW, top: 0 },
    { side: Position.Right, left: width, top: halfH },
    { side: Position.Bottom, left: halfW, top: height },
    { side: Position.Left, left: 0, top: halfH },
  ];

  return (
    <NodeWrapper data={nodeData}>
      <div style={{ width, height, position: "relative" }}>
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="xMidYMid meet"
          className="decision-node-svg"
        >
          <polygon
            points={diamondPoints}
            fill="#FFF4D6"
            stroke="#F1C40F"
            strokeWidth={2}
          />
        </svg>

        {sides.map(({ side }) => (
          <Handle
            key={side}
            id={`${side}-${side === Position.Top ? "target" : "source"}`}
            type={side === Position.Top ? "target" : "source"}
            position={side}
            className="decision-node-polygon"
          />
        ))}

        <input
          value={label}
          onChange={(e) => {
            setLabel(e.target.value);
            data.onChange?.(e.target.value);
          }}
          className="decision-node-input"
        />
      </div>
    </NodeWrapper>
  );
};
