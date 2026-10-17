import type { ReactNode } from "react";
import Image from "next/image";

export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={diagonal ? "M5 19 19 5M5 5h14v14" : "M4 12h15m-6-6 6 6-6 6"}
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
export function Pill({
  children,
  className = "",
  href,
}: {
  href?: string;
  children: ReactNode;
  className?: string;
}) {
  const content=<>
      <span className="pill-label">
        <span>{children}</span>
      </span>
      <span className="pill-arrow"><Arrow diagonal/></span>
    </>;
  return href?<a href={href} className={`pill ${className}`}>{content}</a>:<button type="button" disabled className={`pill ${className}`}>{content}</button>;
}
export function Brand({ large = false }: { large?: boolean }) {
  return (
    <span className={`brand ${large ? "brand-large" : ""}`}>
      <Image src="/images/panvibes-logo-transparent.png" width={2071} height={759} sizes={large?'380px':'230px'} alt="PanVibes Exim — Quality, Trust, Global" priority={!large}/>
    </span>
  );
}
export function FeatureIcon({ name }: { name: string }) {
  const paths: Record<string, ReactNode> = {
    contact: (
      <>
        <circle cx="24" cy="16" r="7" />
        <path d="M12 40v-4c0-7 5-12 12-12s12 5 12 12v4M8 8h5M35 8h5M8 40h5M35 40h5" />
      </>
    ),
    globe: (
      <>
        <circle cx="24" cy="24" r="17" />
        <ellipse cx="24" cy="24" rx="8" ry="17" />
        <path d="M8 18h32M8 30h32" />
      </>
    ),
    shield: (
      <>
        <path d="m24 5 16 6v13c0 10-16 19-16 19S8 34 8 24V11l16-6Z" />
        <path d="m17 24 5 5 10-11" />
      </>
    ),
    price: (
      <>
        <path d="M27 7H10v17l17 17 15-15L27 7Z" />
        <circle cx="18" cy="15" r="2" />
        <path d="m24 30 8-8" />
      </>
    ),
    time: (
      <>
        <circle cx="24" cy="24" r="17" />
        <path d="M24 13v12l8 5M24 3v4M24 41v4M3 24h4M41 24h4" />
      </>
    ),
  };
  return (
    <svg
      className="feature-icon"
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      aria-hidden="true"
    >
      {paths[name] || paths.globe}
      <circle
        className="icon-orbit"
        cx="24"
        cy="24"
        r="23"
        strokeDasharray="1 5"
      />
    </svg>
  );
}
