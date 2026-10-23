'use client';
import { useId } from 'react';
export type ScreenCallout = { number: number; title: string; detail: string; from: number[]; to: number[] };
export function AnnotatedScreen({ src, alt, width, height, callouts = [], lazy = false }: { src: string; alt: string; width: number; height: number; callouts?: ScreenCallout[]; lazy?: boolean }) {
  const marker = `arrow-${useId().replaceAll(':', '')}`;
  const radius = width < 600 ? 13 : 22;
  return <span className="annotated-screen">
    <img src={src} alt={alt} width={width} height={height} loading={lazy ? 'lazy' : 'eager'} />
    {callouts.length > 0 && <svg className="screen-arrows" viewBox={`0 0 ${width} ${height}`} aria-hidden="true" focusable="false">
      <defs><marker id={marker} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#D60068" stroke="white" strokeWidth=".7" /></marker></defs>
      {callouts.map(item => <g key={item.number}>
        <line x1={item.from[0]} y1={item.from[1]} x2={item.to[0]} y2={item.to[1]} stroke="white" strokeWidth={width < 600 ? 5 : 8} />
        <line x1={item.from[0]} y1={item.from[1]} x2={item.to[0]} y2={item.to[1]} stroke="#D60068" strokeWidth={width < 600 ? 2 : 3.5} markerEnd={`url(#${marker})`} />
        <circle cx={item.from[0]} cy={item.from[1]} r={radius} fill="#D60068" stroke="white" strokeWidth="3" />
        <text x={item.from[0]} y={item.from[1]} textAnchor="middle" dominantBaseline="central" fill="white" fontFamily="sans-serif" fontWeight="700" fontSize={radius}>{item.number}</text>
      </g>)}
    </svg>}
  </span>;
}
export function ScreenInstructions({ callouts }: { callouts: ScreenCallout[] }) {
  if (!callouts.length) return null;
  return <ol className="screen-instructions" aria-label="Screenshot instructions">{callouts.map(item => <li key={item.number}><span className="instruction-number" aria-hidden="true">{item.number}</span><span><strong>{item.title}</strong><span>{item.detail}</span></span></li>)}</ol>;
}
