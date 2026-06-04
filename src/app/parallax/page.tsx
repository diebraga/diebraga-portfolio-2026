import ParallaxScene from "@/components/ParallaxScene";

export default function ParallaxPage() {
  return (
    <div
      style={{
        height: "500vh",
        width: "100%",
        margin: 0,
        padding: 0,
        overflow: "hidden",
        background: "#0009",
      }}
    >
      <ParallaxScene />
    </div>
  );
}
