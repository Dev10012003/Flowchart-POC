import React, { useState } from "react";
import { Handle, Position } from "reactflow";
import { NodeWrapper } from "./NodeWrapper";
import { INodeProps } from "../interfaces";

export const StartNode = React.memo(({ data }: INodeProps) => {
  const nodeData = {
    ...data,
    width: data.width ?? 200,
    height: data.height ?? 40,
  };
  const { width, height } = nodeData;

  const [label, setLabel] = useState(data.label);

  return (
    <NodeWrapper data={nodeData}>
      <div
        className="start-node"
        style={{
          width,
          height,
        }}
      >
        <Handle id="start-bottom" type="source" position={Position.Bottom} />
        <Handle id="start-top" type="target" position={Position.Top} />
        <Handle id="start-left" type="target" position={Position.Left} />
        <Handle id="start-right" type="target" position={Position.Right} />

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
