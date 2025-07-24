import React, { useState } from "react";
import { Handle, Position } from "reactflow";
import { NodeWrapper } from "./NodeWrapper";
import { INodeProps } from "../interfaces";

export const InputOutputNode: React.FC<INodeProps> = ({ data }) => {
  const [label, setLabel] = useState(data.label);
  const skewAngle = 20;

  const nodeData = {
    ...data,
    width: data.width ?? 140,
    height: data.height ?? 60,
    skewAngle,
  };

  const { width, height } = nodeData;

  return (
    <NodeWrapper data={nodeData}>
      <div className="io-node-container" style={{ width, height }}>
        <Handle type="target" id="input-top" position={Position.Top} />
        <Handle type="target" id="input-left" position={Position.Left} />
        <Handle type="target" id="input-right" position={Position.Right} />
        <Handle type="source" id="output-bottom" position={Position.Bottom} />

        <input
          value={label}
          onChange={(e) => {
            setLabel(e.target.value);
            data.onChange?.(e.target.value);
          }}
          className="io-node-input"
        />
      </div>
    </NodeWrapper>
  );
};
