"use client";

import dynamic from "next/dynamic";
import { ReactNode } from "react";

const MapComponentDynamic = dynamic(
  () => import("./map-component"),
  { ssr: false, loading: () => <div style={{ height: "500px", background: "#f0f0f0" }} /> }
);

interface MapProps {
  position: [number, number];
  title?: string;
  height?: string;
  zoom?: number;
}

export default function Map({ 
  position, 
  title = "Location", 
  height = "500px",
  zoom = 13 
}: MapProps): ReactNode {
  return (
    <MapComponentDynamic 
      position={position} 
      title={title} 
      height={height} 
      zoom={zoom} 
    />
  );
}
