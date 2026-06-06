"use client";

import { useCallback, useEffect, useRef, useMemo, useState } from "react";
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
  type NodeChange,
  getBezierPath,
  type Node,
  type Edge,
} from "reactflow";
import "reactflow/dist/style.css";
import Image from "next/image";
import { experiences } from "../constants";

// ─── desktop layout ───────────────────────────────────────────────────────────
const CARD_W_DESKTOP = 340;
const DESKTOP_POS = [
  { x: -360, y:   0 },
  { x:   20, y: 220 },
  { x: -360, y: 450 },
  { x:   20, y: 720 },
] as const;

const MOBILE_GAP = 28; // equal px gap between bottom of card N and top of card N+1

// ─── experience card node ─────────────────────────────────────────────────────
function ExperienceNode({ data, selected }: NodeProps) {
  const exp    = data.exp    as typeof experiences[0];
  const cardW  = data.cardW  as number;
  const isMob  = data.isMobile as boolean;

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
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0, width: 3,
          background: "linear-gradient(to bottom, rgb(168,85,247), rgb(109,40,217), transparent)",
        }} />

        <div style={{ paddingLeft: 22, paddingRight: 18, paddingTop: 20, paddingBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
            <div style={{
              width: 44, height: 44, borderRadius: "50%", background: exp.iconBg,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              boxShadow: "0 0 14px rgba(88,28,135,0.5)",
            }}>
              <Image src={exp.icon} alt={exp.company_name} width={26} height={26} style={{ objectFit: "contain" }} />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: "#fff", fontWeight: 700, fontSize: isMob ? 12 : 13, lineHeight: 1.3, margin: 0 }}>
                {exp.title}
              </p>
              <p style={{ color: "rgb(216,180,254)", fontSize: 11, margin: "2px 0 0" }}>
                {exp.company_name}
              </p>
              {isMob && (
                <span style={{
                  display: "inline-block", marginTop: 5, fontSize: 10,
                  color: "rgb(167,139,250)", border: "1px solid rgba(109,40,217,0.5)",
                  borderRadius: 999, padding: "2px 8px",
                }}>
                  {exp.date}
                </span>
              )}
            </div>

            {!isMob && (
              <span style={{
                fontSize: 10, color: "rgb(167,139,250)",
                border: "1px solid rgba(109,40,217,0.5)", borderRadius: 999,
                padding: "2px 8px", whiteSpace: "nowrap", flexShrink: 0,
              }}>
                {exp.date}
              </span>
            )}
          </div>

          <div style={{ height: 1, background: "rgba(109,40,217,0.3)", marginBottom: 12 }} />

          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 7 }}>
            {exp.points.map((pt, i) => (
              <li key={i} style={{ display: "flex", gap: 8, fontSize: isMob ? 10 : 11, color: "rgb(209,213,219)", lineHeight: 1.5 }}>
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

// ─── rail edge ────────────────────────────────────────────────────────────────
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
        strokeWidth={2.5} fill="none"
        strokeDasharray={active ? "10 5" : "none"}
        style={active ? { animation: "rfDash 0.9s linear infinite" } : undefined}
      />
      <path d={d} stroke="rgba(255,255,255,0.06)" strokeWidth={1} fill="none" strokeDasharray="2 20" />
    </g>
  );
}

// ─── graph builder ────────────────────────────────────────────────────────────
function buildGraph(
  isMobile: boolean,
  activeId: string | null,
  mobileCardW: number,
  mobilePositions?: { x: number; y: number }[],
): { nodes: Node[]; edges: Edge[] } {
  const cardW = isMobile ? mobileCardW : CARD_W_DESKTOP;
  const mobileX = -(mobileCardW / 2);

  const defaultMobilePos = experiences.map((_, i) => ({ x: mobileX, y: i * 360 }));
  const pos = isMobile
    ? (mobilePositions ?? defaultMobilePos)
    : DESKTOP_POS.map((p) => ({ ...p }));

  const isActive = (a: string, b: string) =>
    activeId !== null && (a === activeId || b === activeId);

  const nodes: Node[] = experiences.map((exp, i) => ({
    id: String(i),
    type: "experience",
    position: pos[i],
    data: { exp, cardW, isMobile },
    draggable: false,
    selectable: true,
  }));

  const edges: Edge[] = experiences.slice(0, -1).map((_, i) => ({
    id: `rail-${i}`,
    source: String(i), sourceHandle: "bottom",
    target: String(i + 1), targetHandle: "top",
    type: "rail",
    data: { active: isActive(String(i), String(i + 1)) },
  }));

  return { nodes, edges };
}

// ─── inner ────────────────────────────────────────────────────────────────────
const nodeTypes = { experience: ExperienceNode };
const edgeTypes  = { rail: RailEdge };

function CareerFlowInner() {
  const [isMobile, setIsMobile]     = useState(false);
  const [containerW, setContainerW] = useState(360);
  const [activeId, setActiveId]     = useState<string | null>(null);
  const [canvasH, setCanvasH]       = useState(1200);
  const wrapperRef                  = useRef<HTMLDivElement>(null);
  const measuredH                   = useRef<Map<string, number>>(new Map());
  const didReposition               = useRef(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setContainerW(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const mobileCardW = Math.max(260, containerW - 32);

  const init = useMemo(
    () => buildGraph(isMobile, null, mobileCardW),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isMobile, mobileCardW],
  );

  const [nodes, setNodes, onNodesChangeInternal] = useNodesState(init.nodes);
  const [edges, setEdges, onEdgesChange]         = useEdgesState(init.edges);

  // reset on layout change
  useEffect(() => {
    measuredH.current.clear();
    didReposition.current = false;
    const g = buildGraph(isMobile, null, mobileCardW);
    setNodes(g.nodes);
    setEdges(g.edges);
    if (!isMobile) setCanvasH(1200);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, mobileCardW]);

  // update edge animation on selection change
  useEffect(() => {
    setEdges(buildGraph(isMobile, activeId, mobileCardW).edges);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  // intercept React Flow dimension measurements → reposition mobile nodes with equal gaps
  const onNodesChange = useCallback((changes: NodeChange[]) => {
    onNodesChangeInternal(changes);

    if (!isMobile || didReposition.current) return;

    changes.forEach((c) => {
      if (c.type === "dimensions" && c.dimensions?.height) {
        measuredH.current.set(c.id, c.dimensions.height);
      }
    });

    if (measuredH.current.size < experiences.length) return;

    didReposition.current = true;
    const x = -(mobileCardW / 2);
    let cumY = 0;

    // build cumulative positions with a fixed gap between each card's bottom and the next's top
    const positions: { x: number; y: number }[] = experiences.map((_, i) => {
      const pos = { x, y: cumY };
      cumY += (measuredH.current.get(String(i)) ?? 300) + MOBILE_GAP;
      return pos;
    });

    const g = buildGraph(true, activeId, mobileCardW, positions);
    setNodes(g.nodes);
    setCanvasH(cumY + 60);
  }, [isMobile, mobileCardW, activeId, onNodesChangeInternal, setNodes]);

  const { fitView } = useReactFlow();

  const showAll = useCallback(() => {
    fitView({ duration: 700, padding: isMobile ? 0.04 : 0.1, maxZoom: 1 });
  }, [fitView, isMobile]);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    if (activeId === node.id) {
      setActiveId(null);
      showAll();
    } else {
      setActiveId(node.id);
      fitView({ nodes: [{ id: node.id }], duration: 700, padding: isMobile ? 0.08 : 0.25, maxZoom: 1.2 });
    }
  }, [activeId, fitView, isMobile, showAll]);

  const onPaneClick = useCallback(() => {
    if (activeId !== null) { setActiveId(null); showAll(); }
  }, [activeId, showAll]);

  return (
    <div ref={wrapperRef} style={{ width: "100%", height: canvasH }}>
      <style>{`
        @keyframes rfDash { to { stroke-dashoffset: -30; } }
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
        fitViewOptions={{ padding: isMobile ? 0.04 : 0.1, maxZoom: 1 }}
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
          gap={38} size={0.5}
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
