import React, {
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
  useEffect,
  useMemo,
} from "react";
import ReactFlow, {
  addEdge,
  applyNodeChanges,
  Background,
  Controls,
  MarkerType,
  Node,
  Edge,
  NodeTypes,
  Connection,
  NodeChange,
  ReactFlowInstance,
} from "reactflow";
import "reactflow/dist/style.css";
import { v4 as uuid } from "uuid";

import { DecisionNode } from "./components/DecisionNode";
import { EndNode } from "./components/EndNode";
import { InputOutputNode } from "./components/InputOutputNode";
import { ProcessNode } from "./components/ProcessNode";
import { StartNode } from "./components/StartNode";
import { CustomEdge } from "./components/CustomEdge";
import { ICanvasHandle, IResize } from "./interfaces";
import * as htmlToImage from "html-to-image";

const nodeTypes: NodeTypes = {
  start: StartNode,
  process: ProcessNode,
  decision: DecisionNode,
  inputOutput: InputOutputNode,
  end: EndNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

const LABELS: Record<string, string> = {
  start: "Start",
  process: "Process",
  decision: "Decision?",
  inputOutput: "Input/Output",
  end: "End",
};

const FALLBACK_POSITION = { x: 250, y: 20 };

export const FlowCanvas = React.forwardRef<ICanvasHandle>((_, ref) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNodes, setSelectedNodes] = useState<Node[]>([]);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const rfi = useRef<ReactFlowInstance | null>(null);

  const createOnChange = useCallback(
    (id: string) => (val: string) => {
      setNodes((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, data: { ...n.data, label: val } } : n
        )
      );
    },
    []
  );

  const createOnResize = useCallback(
    (id: string) =>
      ({ width, height, x, y }: IResize) => {
        setNodes((prev) =>
          prev.map((n) =>
            n.id === id
              ? {
                  ...n,
                  position: { x: x ?? n.position.x, y: y ?? n.position.y },
                  data: { ...n.data, width, height },
                }
              : n
          )
        );
      },
    []
  );

  const updateEdgeLabel = useCallback((id: string, label: string) => {
    setEdges((prev) =>
      prev.map((edge) =>
        edge.id === id ? { ...edge, data: { ...edge.data, label } } : edge
      )
    );
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedNodes([]);
    setSelectedEdgeId(null);
  }, []);

  const addNode = useCallback(
    (type: string, position?: { x: number; y: number }) => {
      clearSelection();
      const id = uuid();
      const pos =
        position ||
        rfi.current?.project(FALLBACK_POSITION) ||
        FALLBACK_POSITION;

      const newNode: Node = {
        id,
        type,
        position: pos,
        draggable: true,
        data: {
          label: LABELS[type],
          onChange: createOnChange(id),
          onResize: createOnResize(id),
        },
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [createOnChange, createOnResize, clearSelection]
  );

  const deleteSelected = useCallback(() => {
    const deletedIds = selectedNodes.map((n) => n.id);

    setNodes((nds) => nds.filter((n) => !deletedIds.includes(n.id)));
    setEdges((eds) =>
      eds.filter(
        (e) =>
          e.id !== selectedEdgeId &&
          !deletedIds.includes(e.source) &&
          !deletedIds.includes(e.target)
      )
    );

    setSelectedEdgeId(null);
  }, [selectedNodes, selectedEdgeId]);

  useImperativeHandle(ref, () => ({
    addShape: addNode,
    deleteSelected,
    takeScreenshot: async () => {
      if (!wrapperRef.current || !rfi.current || nodes.length === 0) {
        window.alert("No nodes in canvas — skipping screenshot.");
        return null;
      }

      const instance = rfi.current;
      const currentTransform = instance.getViewport();
      const controlsEl = document.querySelector(".reactflow-controls");
      controlsEl?.classList.add("hide");

      try {
        instance.fitView({ padding: 0.1 });
        await new Promise((res) => setTimeout(res, 200));

        const dataUrl = await htmlToImage.toPng(wrapperRef.current, {
          backgroundColor: "#ffffff",
          style: { margin: "0", padding: "0" },
        });
        return dataUrl;
      } catch (err) {
        console.error("Screenshot failed:", err);
        return null;
      } finally {
        instance.setViewport(currentTransform);
        controlsEl?.classList.remove("hide");
      }
    },
    getData: () => ({
      nodes: nodes.map((n) => ({
        ...n,
        selected: false,
        className: undefined,
        data: { ...n.data, selected: false },
      })),
      edges: edges.map((e) => ({ ...e, selected: false })),
    }),
    setData: (data) => {
      const updated = data.nodes.map((n) => ({
        ...n,
        data: {
          ...n.data,
          onChange: createOnChange(n.id),
          onResize: createOnResize(n.id),
        },
      }));

      setNodes(updated);
      setEdges(data.edges);
      setSelectedNodes([]);
      setSelectedEdgeId(null);
    },
  }));

  const onConnect = useCallback((params: Connection | Edge) => {
    setEdges((eds) =>
      addEdge(
        {
          ...params,
          id: uuid(),
          type: "custom",
          data: { label: "" },
          markerEnd: { type: MarkerType.ArrowClosed },
          interactionWidth: 20,
        },
        eds
      )
    );
  }, []);

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onSelectionChange = useCallback(({ nodes }: { nodes: Node[] }) => {
    setSelectedNodes(nodes);
    if (nodes.length > 0) setSelectedEdgeId(null);
  }, []);

  const onEdgeClick = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      event.stopPropagation();
      clearSelection();
      setSelectedEdgeId(edge.id);
    },
    [clearSelection]
  );

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const nodeType = event.dataTransfer.getData("shapeType");
      const bounds = wrapperRef.current?.getBoundingClientRect();
      if (!nodeType || !rfi.current || !bounds) return;

      const pos = rfi.current.project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      addNode(nodeType, pos);
    },
    [addNode]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Delete") deleteSelected();
    },
    [deleteSelected]
  );

  const styledNodes = useMemo(() => {
    return nodes.map((n) => {
      const isSelected = selectedNodes.some((sel) => sel.id === n.id);
      return {
        ...n,
        data: {
          ...n.data,
          x: n.position.x,
          y: n.position.y,
          selected: isSelected,
        },
        className: isSelected ? "selected-node" : undefined,
      };
    });
  }, [nodes, selectedNodes]);

  const styledEdges = useMemo(() => {
    return edges.map((e) => ({
      ...e,
      selected: e.id === selectedEdgeId,
      data: {
        ...e.data,
        setSelectedEdgeId,
        updateLabel: updateEdgeLabel,
      },
    }));
  }, [edges, selectedEdgeId, updateEdgeLabel]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div ref={wrapperRef} style={{ flex: 1 }}>
      <ReactFlow
        nodes={styledNodes}
        edges={styledEdges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onConnect={onConnect}
        onNodesChange={onNodesChange}
        onDrop={onDrop}
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = "move";
        }}
        onSelectionChange={onSelectionChange}
        onEdgeClick={onEdgeClick}
        onInit={(inst) => {
          rfi.current = inst;
          inst.setViewport({ x: 0, y: 0, zoom: 1 });
        }}
        onConnectStart={clearSelection}
        onPaneClick={clearSelection}
      >
        <Controls className="reactflow-controls" />
        <Background />
      </ReactFlow>
    </div>
  );
});
