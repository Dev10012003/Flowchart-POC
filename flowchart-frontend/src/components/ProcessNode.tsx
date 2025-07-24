import React from "react";
import { INodeProps } from "../interfaces";
import { Handle, Position } from "reactflow";
import { NodeWrapper } from "./NodeWrapper";

export const ProcessNode = React.memo(({ data }: INodeProps) => {
  const nodeData = {
    ...data,
    width: data.width ?? 200,
    height: data.height ?? 50,
  };

  const { width, height } = nodeData;

  return (
    <NodeWrapper data={nodeData}>
      <div
        className="process-node"
        style={{
          width,
          height,
        }}
      >
        <Handle type="target" id="process-top" position={Position.Top} />
        <Handle type="target" id="process-left" position={Position.Left} />
        <Handle type="target" id="process-right" position={Position.Right} />
        <Handle type="source" id="process-bottom" position={Position.Bottom} />

        <input
          value={data.label}
          onChange={(e) => data.onChange?.(e.target.value)}
          className="node-input"
        />
      </div>
    </NodeWrapper>
  );
});
