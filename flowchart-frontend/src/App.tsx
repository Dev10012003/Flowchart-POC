import { useCallback, useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "./App.css";
import { FlowCanvas } from "./FlowCanvas";
import { ShapeButtons } from "./components/ShapeButtons";
import { Sidebar } from "./components/Sidebar";
import { ICanvasHandle } from "./interfaces";
import { API_BASE_URL } from "./utils/constant";

function App() {
  const canvasRef = useRef<ICanvasHandle>(null);
  const [loading, setLoading] = useState(false);

  const flowchartId = "6881be7335c9cf1140605e26";

  const handleLoad = () => {
    const saved = localStorage.getItem("flowchart");
    if (saved) {
      const parsed = JSON.parse(saved);
      canvasRef.current?.setData(parsed);
    }
  };

  const loadFlowchart = useCallback(
    async (showAlert = true) => {
      setLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/flowchart/${flowchartId}`
        );
        const result = await response.json();

        if (result.success && result.data?.flowchartData) {
          const parsedData = JSON.parse(result.data.flowchartData);
          canvasRef.current?.setData(parsedData);
        } else if (showAlert) {
          toast.error("Failed to fetch flowchart data.");
        }
      } catch (error) {
        console.error("Error loading flowchart:", error);
        if (showAlert) {
          toast.error("Error occurred while loading.");
        }
      } finally {
        setLoading(false);
      }
    },
    [flowchartId]
  );

  const saveFlowchart = useCallback(async () => {
    const flowData = canvasRef.current?.getData();
    const imageUrl = await canvasRef.current?.takeScreenshot();

    if (!flowData || !imageUrl) {
      toast.error("Failed to generate data.");
      return;
    }

    localStorage.setItem("flowchart", JSON.stringify(flowData));

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/flowchart/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl,
          flowchartData: JSON.stringify(flowData),
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Flowchart saved successfully!");
      } else {
        toast.error("Failed to save to server.");
      }
    } catch (error) {
      console.error("Error saving to server:", error);
      toast.error("Error occurred while saving.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFlowchart(false);
  }, [loadFlowchart]);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar
        onDelete={() => canvasRef.current?.deleteSelected()}
        onLoad={handleLoad}
        onSave={saveFlowchart}
      />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <ShapeButtons onAdd={(type) => canvasRef.current?.addShape(type)} />
        </div>

        <FlowCanvas ref={canvasRef} />
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
}

export default App;
