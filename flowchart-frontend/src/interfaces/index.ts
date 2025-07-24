import { Node as FlowNode, Edge } from "reactflow";

export interface ICanvasHandle {
  addShape: (type: string) => void;
  deleteSelected: () => void;
  takeScreenshot: () => Promise<string | null>;
  getData: () => { nodes: FlowNode[]; edges: Edge[] };
  setData: (data: { nodes: FlowNode[]; edges: Edge[] }) => void;
}

export interface IResize {
  width: number;
  height: number;
  x?: number;
  y?: number;
}

export interface INodeData {
  label: string;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  selected?: boolean;
  onChange?: (val: string) => void;
  onResize?: (dims: {
    width: number;
    height: number;
    x?: number;
    y?: number;
  }) => void;
}

export interface INodeProps {
  data: INodeData;
}
