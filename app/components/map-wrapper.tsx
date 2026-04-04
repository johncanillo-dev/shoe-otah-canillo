import dynamic from "next/dynamic";
import { Suspense } from "react";

// Dynamically import map with SSR disabled
const Map = dynamic(() => import("./map"), { ssr: false });

interface MapWrapperProps {
  position: [number, number];
  title?: string;
  height?: string;
  zoom?: number;
}

export function MapWrapper({ position, title, height = "500px", zoom = 13 }: MapWrapperProps) {
  return (
    <Suspense fallback={<div style={{ height, background: "#f0f0f0", borderRadius: "8px" }} />}>
      <Map position={position} title={title} height={height} zoom={zoom} />
    </Suspense>
  );
}
