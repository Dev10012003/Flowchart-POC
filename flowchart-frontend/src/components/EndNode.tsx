import React, { useState } from "react";
import { Handle, Position } from "reactflow";
import { NodeWrapper } from "./NodeWrapper";
import { INodeProps } from "../interfaces";

export const EndNode = React.memo(({ data }: INodeProps) => {
  const nodeData = {
    ...data,
    width: data.width ?? 200,
    height: data.height ?? 40,
  };

  const [label, setLabel] = useState(data.label);

  const { width, height } = nodeData;

  return (
    <NodeWrapper data={nodeData}>
      <div
        className="end-node"
        style={{
          width,
          height,
        }}
      >
        <Handle id="end-top" type="target" position={Position.Top} />
        <Handle id="end-left" type="target" position={Position.Left} />
        <Handle id="end-right" type="target" position={Position.Right} />

        <input
          value={label}
          onChange={(e) => {
            setLabel(e.target.value);
            data.onChange?.(e.target.value);
          }}
          className="node-input"
        />
      </div>
    </NodeWrapper>
  );
});
