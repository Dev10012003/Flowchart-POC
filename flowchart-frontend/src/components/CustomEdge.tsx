import React, { useEffect, useState } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
} from "reactflow";

let clickTimeout: ReturnType<typeof setTimeout> | null = null;

export const CustomEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  markerEnd,
  data,
  selected,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(data?.label || "");

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleBlur = () => {
    const trimmed = inputValue.trim();
    setIsEditing(false);
    data?.updateLabel?.(id, trimmed);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (clickTimeout) return;

    clickTimeout = setTimeout(() => {
      if (!isEditing) {
        data?.setSelectedEdgeId?.(id);
      }
      clickTimeout = null;
    }, 200);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (clickTimeout) {
      clearTimeout(clickTimeout);
      clickTimeout = null;
    }
    setIsEditing(true);
    data?.setSelectedEdgeId?.(null);
  };

  useEffect(() => {
    setInputValue(data?.label || "");
  }, [data?.label]);

  const isEdgeSelected = selected && !isEditing;

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: isEdgeSelected ? "blue" : "#333",
          strokeWidth: 2,
        }}
      />

      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={15}
        className="custom-edge-click-path"
        data-id={id}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
      />

      {(isEditing || inputValue.trim() !== "") && (
        <EdgeLabelRenderer>
          <div
            className="custom-edge-label-container"
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleClick(e);
            }}
            onDoubleClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleDoubleClick(e);
            }}
          >
            {isEditing ? (
              <input
                autoFocus
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleBlur}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    (e.target as HTMLInputElement).blur();
                  }
                }}
                className="custom-edge-input"
              />
            ) : (
              <div
                className={`custom-edge-label-box ${
                  isEdgeSelected ? "custom-edge-label-selected" : ""
                }`}
              >
                {inputValue}
              </div>
            )}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};
