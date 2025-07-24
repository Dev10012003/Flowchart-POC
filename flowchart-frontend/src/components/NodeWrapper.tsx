import React, { useRef } from "react";
import { ResizeDirection, allResizeHandles } from "../utils/constant";
import { useDebouncedCallback } from "use-debounce";

interface INodeWrapperProps {
  children: React.ReactNode;
  data: {
    width: number;
    height: number;
    x?: number;
    y?: number;
    selected?: boolean;
    onResize?: (dims: {
      width: number;
      height: number;
      x?: number;
      y?: number;
    }) => void;
    skewAngle?: number;
  };
}

const PADDING = 10;

export const NodeWrapper: React.FC<INodeWrapperProps> = ({
  children,
  data,
}) => {
  const isResizing = useRef(false);
  const direction = useRef<ResizeDirection | null>(null);
  const skewAngle = data.skewAngle ?? 0;

  const skewPadding = skewAngle
    ? Math.abs(Math.tan((skewAngle * Math.PI) / 180) * data.height) / 2
    : 0;

  const effectivePadding = Math.max(PADDING, skewPadding);

  const debouncedResize = useDebouncedCallback((dims) => {
    requestAnimationFrame(() => {
      setTimeout(() => {
        data.onResize?.(dims);
      }, 0);
    });
  }, 10);

  const onResizeStart = (e: React.MouseEvent, dir: ResizeDirection) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();

    isResizing.current = true;
    direction.current = dir;

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = data.width;
    const startHeight = data.height;
    const startXPos = data.x ?? 0;
    const startYPos = data.y ?? 0;

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (!isResizing.current || !direction.current) return;

      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;
      let newX = startXPos;
      let newY = startYPos;
      const dir = direction.current;

      if (dir.includes("right")) {
        newWidth = Math.max(50, startWidth + deltaX);
      }
      if (dir.includes("left")) {
        newWidth = Math.max(50, startWidth - deltaX);
        newX += startWidth - newWidth;
      }
      if (dir.includes("bottom")) {
        newHeight = Math.max(30, startHeight + deltaY);
      }
      if (dir.includes("top")) {
        newHeight = Math.max(30, startHeight - deltaY);
        newY += startHeight - newHeight;
      }

      debouncedResize({ width: newWidth, height: newHeight, x: newX, y: newY });
    };

    const onMouseUp = () => {
      isResizing.current = false;
      direction.current = null;
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const width = data.width + effectivePadding * 2;
  const height = data.height + PADDING * 2;

  return (
    <div
      className={`node-wrapper ${data.selected ? "selected-node" : ""}`}
      style={{ width, height }}
    >
      <div
        className="node-wrapper-inner"
        style={{
          top: PADDING,
          left: effectivePadding,
          right: effectivePadding,
          bottom: PADDING,
        }}
      >
        <div className="node-wrapper-content">{children}</div>
      </div>
      {data.selected && (
        <div className="resize-overlay">
          {allResizeHandles.map(({ dir, className }) => (
            <div
              key={dir}
              className={`resize-zone ${className} nodrag`}
              onMouseDown={(e) => onResizeStart(e, dir as ResizeDirection)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
