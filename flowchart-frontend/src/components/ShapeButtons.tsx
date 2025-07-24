export const ShapeButtons = ({ onAdd }: { onAdd: (type: string) => void }) => {
  const types = ["start", "process", "decision", "inputOutput", "end"];
  return (
    <div className="shape-buttons">
      {types.map((t) => (
        <button
          key={t}
          onClick={() => onAdd(t)}
          className="shape-button"
          type="button"
        >
          ➕ {t.charAt(0).toUpperCase() + t.slice(1)}
        </button>
      ))}
    </div>
  );
};
