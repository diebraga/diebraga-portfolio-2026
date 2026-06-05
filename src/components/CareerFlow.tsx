"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Handle,
  Position,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
  type NodeProps,
  type EdgeProps,
  getBezierPath,
  type Node,
  type Edge,
} from "reactflow";
import "reactflow/dist/style.css";
import Image from "next/image";
import { experiences } from "../constants";

// ─── layout ───────────────────────────────────────────────────────────────────
const CARD_W_DESKTOP = 340;
const CARD_W_MOBILE  = 250;

// Desktop: tightly packed so fitView keeps zoom ~0.9 in a 1200px canvas
const DESKTOP_POS = [
  { x: -360, y:   0 },   // Kosmos       — left
  { x:   20, y: 220 },   // Templ8       — right
  { x: -360, y: 450 },   // Hertz        — left
  { x:   20, y: 720 },   // Glass Lewis  — right
] as const;

// Mobile: centered vertical stack
const MOBILE_POS = [
  { x: -125, y:   0 },
  { x: -125, y: 320 },
  { x: -125, y: 660 },
  { x: -125, y: 1020 },
] as const;

// ─── experience card node ─────────────────────────────────────────────────────
function ExperienceNode({ data, selected }: NodeProps) {
  const exp = data.exp as typeof experiences[0];
  const cardW = (data.cardW as number) ?? CARD_W_DESKTOP;
  return (
    <>
      <Handle type="target" position={Position.Top}    id="top"    style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} id="bottom" style={{ opacity: 0 }} />

      <div style={{
        width: cardW,
        background: "rgba(5,4,22,0.9)",
        border: `1px solid ${selected ? "rgba(192,132,252,0.95)" : "rgba(109,40,217,0.45)"}`,
        borderRadius: "1rem",
        overflow: "hidden",
        backdropFilter: "blur(14px)",
        boxShadow: selected
          ? "0 0 0 1px rgba(192,132,252,0.35), 0 0 48px rgba(168,85,247,0.65)"
          : "0 0 24px rgba(88,28,135,0.28)",
        transition: "box-shadow 0.35s, border-color 0.35s",
        cursor: "pointer",
        position: "relative",
      }}>
        {/* left accent */}
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0, width: 3,
          background: "linear-gradient(to bottom, rgb(168,85,247), rgb(109,40,217), transparent)",
        }} />

        <div style={{ paddingLeft: 22, paddingRight: 18, paddingTop: 20, paddingBottom: 20 }}>
          {/* header */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
            <div style={{
              width: 44, height: 44, borderRadius: "50%", background: exp.iconBg,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              boxShadow: "0 0 14px rgba(88,28,135,0.5)",
            }}>
              <Image src={exp.icon} alt={exp.company_name} width={26} height={26} style={{ objectFit: "contain" }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: "#fff", fontWeight: 700, fontSize: 13, lineHeight: 1.3, margin: 0 }}>{exp.title}</p>
              <p style={{ color: "rgb(216,180,254)", fontSize: 11, marginTop: 2, margin: 0 }}>{exp.company_name}</p>
            </div>
            <span style={{
              fontSize: 10, color: "rgb(167,139,250)",
              border: "1px solid rgba(109,40,217,0.5)", borderRadius: 999,
              padding: "2px 8px", whiteSpace: "nowrap", alignSelf: "flex-start",
            }}>
              {exp.date}
            </span>
          </div>

          <div style={{ height: 1, background: "rgba(109,40,217,0.3)", marginBottom: 12 }} />

          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 7 }}>
            {exp.points.map((pt, i) => (
              <li key={i} style={{ display: "flex", gap: 8, fontSize: 11, color: "rgb(209,213,219)", lineHeight: 1.5 }}>
                <span style={{ color: "rgb(168,85,247)", flexShrink: 0, marginTop: 1 }}>▸</span>
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

// ─── animated rail edge ───────────────────────────────────────────────────────
function RailEdge({ sourceX, sourceY, targetX, targetY, data }: EdgeProps) {
  const active = !!(data as { active?: boolean })?.active;
  const [d] = getBezierPath({
    sourceX, sourceY, sourcePosition: Position.Bottom,
    targetX, targetY, targetPosition: Position.Top,
  });
  return (
    <g>
      <path d={d} stroke="rgba(168,85,247,0.18)" strokeWidth={12} fill="none" />
      <path
        d={d}
        stroke={active ? "rgb(192,132,252)" : "rgb(124,58,237)"}
        strokeWidth={2.5}
        fill="none"
        strokeDasharray={active ? "10 5" : "none"}
        style={active ? { animation: "rfDash 0.9s linear infinite" } : undefined}
      />
      <path d={d} stroke="rgba(255,255,255,0.06)" strokeWidth={1} fill="none" strokeDasharray="2 20" />
    </g>
  );
}

// ─── graph builder ────────────────────────────────────────────────────────────
function buildGraph(isMobile: boolean, activeId: string | null): { nodes: Node[]; edges: Edge[] } {
  const pos = isMobile ? MOBILE_POS : DESKTOP_POS;

  const cardW = isMobile ? CARD_W_MOBILE : CARD_W_DESKTOP;

  const nodes: Node[] = experiences.map((exp, i) => ({
    id: String(i),
    type: "experience",
    position: { x: pos[i].x, y: pos[i].y },
    data: { exp, cardW },
    draggable: false,
    selectable: true,
  }));

  const isActive = (a: string, b: string) =>
    activeId !== null && (a === activeId || b === activeId);

  const edges: Edge[] = experiences.slice(0, -1).map((_, i) => ({
    id: `rail-${i}`,
    source: String(i),
    sourceHandle: "bottom",
    target: String(i + 1),
    targetHandle: "top",
    type: "rail",
    data: { active: isActive(String(i), String(i + 1)) },
  }));

  return { nodes, edges };
}

// ─── inner component ──────────────────────────────────────────────────────────
const nodeTypes = { experience: ExperienceNode };
const edgeTypes = { rail: RailEdge };

function CareerFlowInner() {
  const [isMobile, setIsMobile] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const init = useMemo(() => buildGraph(isMobile, null), [isMobile]);
  const [nodes, setNodes, onNodesChange] = useNodesState(init.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(init.edges);

  useEffect(() => {
    const g = buildGraph(isMobile, activeId);
    setNodes(g.nodes);
    setEdges(g.edges);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  useEffect(() => {
    setEdges(buildGraph(isMobile, activeId).edges);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId, isMobile]);

  const { fitView } = useReactFlow();

  const showAll = useCallback(() => {
    fitView({ duration: 700, padding: isMobile ? 0.06 : 0.1, maxZoom: 1 });
  }, [fitView, isMobile]);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      if (activeId === node.id) {
        // second click — zoom back out to all four
        setActiveId(null);
        showAll();
      } else {
        // first click — zoom in to just this node
        setActiveId(node.id);
        fitView({ nodes: [{ id: node.id }], duration: 700, padding: 0.25, maxZoom: 1.2 });
      }
    },
    [activeId, fitView, showAll]
  );

  const onPaneClick = useCallback(() => {
    if (activeId !== null) {
      setActiveId(null);
      showAll();
    }
  }, [activeId, showAll]);

  return (
    <div style={{ width: "100%", height: isMobile ? 1600 : 1200 }}>
      <style>{`
        @keyframes rfDash { to { stroke-dashoffset: -30; } }
        .react-flow__controls {
          background: rgba(5,4,22,0.9) !important;
          border: 1px solid rgba(109,40,217,0.5) !important;
          border-radius: 10px !important;
          box-shadow: 0 0 18px rgba(88,28,135,0.35) !important;
          overflow: hidden;
        }
        .react-flow__controls-button {
          background: transparent !important;
          border-bottom: 1px solid rgba(109,40,217,0.3) !important;
          fill: rgb(216,180,254) !important;
          width: 26px !important; height: 26px !important;
        }
        .react-flow__controls-button:hover { background: rgba(88,28,135,0.4) !important; }
        .react-flow__controls-button svg { fill: rgb(216,180,254) !important; }
        .react-flow__attribution { display: none !important; }
        .react-flow__pane { cursor: default !important; }
        .react-flow__node { cursor: pointer !important; }
      `}</style>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: isMobile ? 0.06 : 0.1, maxZoom: 1 }}
        // lock the viewport — all interaction is programmatic only
        panOnDrag={false}
        panOnScroll={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        preventScrolling={false}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable
        style={{ background: "transparent" }}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Lines}
          gap={38}
          size={0.5}
          color="rgba(109,40,217,0.08)"
          style={{ background: "#050816" }}
        />
      </ReactFlow>
    </div>
  );
}

export default function CareerFlow() {
  return (
    <ReactFlowProvider>
      <CareerFlowInner />
    </ReactFlowProvider>
  );
}
