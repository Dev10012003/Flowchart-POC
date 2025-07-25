export const allResizeHandles = [
  { dir: "top-left", className: "resize-handle top-left" },
  { dir: "top-right", className: "resize-handle top-right" },
  { dir: "bottom-left", className: "resize-handle bottom-left" },
  { dir: "bottom-right", className: "resize-handle bottom-right" },
  { dir: "top", className: "resize-handle top" },
  { dir: "bottom", className: "resize-handle bottom" },
  { dir: "left", className: "resize-handle left" },
  { dir: "right", className: "resize-handle right" },
];

export type ResizeDirection =
  | "top"
  | "right"
  | "bottom"
  | "left"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
