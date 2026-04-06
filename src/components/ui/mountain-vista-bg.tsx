"use client"

import React, { useMemo } from 'react';
import { cn } from "@/lib/utils";

// Data Configuration for the 8 layers. 
// We use the provided AWS S3 codepen links.
const layersData = [
  { className: 'layer-6', speed: '120s', size: '222px', zIndex: 10, image: '6' },
  { className: 'layer-5', speed: '95s',  size: '311px', zIndex: 11, image: '5' },
  { className: 'layer-4', speed: '75s',  size: '468px', zIndex: 12, image: '4' },
  { className: 'bike-1',  speed: '10s',  size: '75px',  zIndex: 13, image: 'bike', animation: 'parallax_bike', bottom: '100px', noRepeat: true },
  { className: 'bike-2',  speed: '15s',  size: '75px',  zIndex: 13, image: 'bike', animation: 'parallax_bike', bottom: '100px', noRepeat: true },
  { className: 'layer-3', speed: '55s',  size: '158px', zIndex: 14, image: '3' },
  { className: 'layer-2', speed: '30s',  size: '145px', zIndex: 15, image: '2' },
  { className: 'layer-1', speed: '20s',  size: '136px', zIndex: 16, image: '1' },
];

export default function MountainVistaParallax({ 
  className,
  title = '', 
  subtitle = '' 
}: { 
  className?: string;
  title?: string;
  subtitle?: string;
}) {
  const dynamicStyles = useMemo(() => {
    return layersData
      .map(layer => {
        const url = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/24650/${layer.image}.png`;
        return `
          .${layer.className} {
            background-image: url(${url});
            animation-duration: ${layer.speed};
            background-size: auto ${layer.size};
            z-index: ${layer.zIndex};
            ${layer.animation ? `animation-name: ${layer.animation};` : ''}
            ${layer.bottom ? `bottom: ${layer.bottom};` : ''}
            ${layer.noRepeat ? 'background-repeat: no-repeat;' : ''}
          }
        `;
      })
      .join('\n');
  }, []);

  return (
    <div className={cn("absolute inset-0 w-full h-full overflow-hidden pointer-events-none opacity-90", className)} aria-hidden="true">
      <style>{dynamicStyles}</style>

      {/* Render each parallax layer */}
      {layersData.map(layer => (
        <div
          key={layer.className}
          className={cn(
            "absolute bottom-0 left-0 w-full h-[500px]", 
            "bg-bottom bg-repeat-x parallax-layer", 
            layer.className
          )}
          style={{ animationTimingFunction: "linear", animationIterationCount: "infinite", animationName: layer.animation || "parallax_fg" }}
        />
      ))}
      
      {/* 
        Optional text rendering if passed. 
        Usually, since it's a background, we wrap content manually.
      */}
      {(title || subtitle) && (
        <div className="relative z-50 flex flex-col items-center justify-center h-full pt-12 pb-32 px-6 text-center shadow-text">
          <h1 className="text-5xl font-black text-white drop-shadow-xl">{title}</h1>
          <p className="text-xl font-medium text-amber-50 drop-shadow-lg mt-4">{subtitle}</p>
        </div>
      )}
    </div>
  );
}
