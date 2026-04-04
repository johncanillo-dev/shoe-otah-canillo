import dynamic from "next/dynamic";

interface MapComponentProps {
  position: [number, number];
  title?: string;
  height?: string;
  zoom?: number;
}

// Dynamically import the map with SSR disabled
// Leaflet doesn't support server-side rendering
const MapComponent = dynamic(
  () => import("./map-client"),
  {
    ssr: false,
    loading: () => <div style={{ height: "500px", backgroundColor: "#f0f0f0" }}>Loading map...</div>,
  }
);

export default MapComponent;
