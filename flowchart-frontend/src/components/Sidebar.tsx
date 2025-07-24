import React from "react";

interface SidebarProps {
  onDelete: () => void;
  onLoad: () => void;
  onSave: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onDelete,
  onLoad,
  onSave,
}) => {
  const onDragStart = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData("shapeType", type);
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside className="sidebar">
      <h4>Drag Shapes</h4>
      {["start", "process", "decision", "inputOutput", "end"].map((t) => (
        <div
          key={t}
          draggable
          onDragStart={(e) => onDragStart(e, t)}
          className="sidebar-shape"
        >
          {t.charAt(0).toUpperCase() + t.slice(1)}
        </div>
      ))}

      <hr />
      <button onClick={onLoad} className="sidebar-load-button">
        Load
      </button>
      <button onClick={onSave} className="sidebar-save-button">
        Save
      </button>
      <button onClick={onDelete} className="sidebar-delete-button">
        Delete
      </button>
    </aside>
  );
};
