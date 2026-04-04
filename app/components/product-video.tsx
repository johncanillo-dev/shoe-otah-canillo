"use client";

import { useState } from "react";

interface ProductVideoProps {
  videoUrl?: string;
  productName: string;
}

export function ProductVideo({ videoUrl, productName }: ProductVideoProps) {
  const [playVideo, setPlayVideo] = useState(false);

  if (!videoUrl) {
    return null;
  }

  return (
    <div
      style={{
        marginTop: "1rem",
        borderRadius: "8px",
        overflow: "hidden",
        background: "#000",
      }}
    >
      {playVideo ? (
        <iframe
          width="100%"
          height="315"
          src={videoUrl}
          title={productName}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ display: "block" }}
        />
      ) : (
        <div
          onClick={() => setPlayVideo(true)}
          style={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "315px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            fontSize: "3rem",
          }}
        >
          🎥
        </div>
      )}
    </div>
  );
}
