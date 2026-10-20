import Image from "next/image";
import { useId } from "react";

export function Tempo() {
  const id = useId();
  return (
    <svg
      viewBox="0 0 700 350"
      fill="none"
      className="tempo-art"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id={`${id}-cargo`}
          x1="180"
          y1="60"
          x2="180"
          y2="250"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fafafa" />
          <stop offset="1" stopColor="#b8bcc1" />
        </linearGradient>
        <linearGradient
          id={`${id}-cab`}
          x1="480"
          y1="90"
          x2="620"
          y2="250"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#454b52" />
          <stop offset=".55" stopColor="#171b21" />
          <stop offset="1" stopColor="#080a0c" />
        </linearGradient>
        <linearGradient
          id={`${id}-window`}
          x1="530"
          y1="100"
          x2="580"
          y2="170"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#8799a7" />
          <stop offset=".3" stopColor="#26323f" />
          <stop offset="1" stopColor="#060a0f" />
        </linearGradient>
        <radialGradient id={`${id}-tire`}>
          <stop stopColor="#687078" />
          <stop offset=".42" stopColor="#2b3035" />
          <stop offset=".45" stopColor="#090a0b" />
          <stop offset=".8" stopColor="#1c1e21" />
          <stop offset="1" stopColor="#050505" />
        </radialGradient>
      </defs>
      <ellipse cx="350" cy="286" rx="290" ry="16" fill="#000" opacity=".12" />
      <g className="tempo-bed">
      <path d="M68 76 92 52h356l-18 24H68Z" fill="#dddfe1" />
      <path d="M430 76 448 52v183l-18 20V76Z" fill="#9ea4ac" />
      <rect
        x="68"
        y="76"
        width="363"
        height="179"
        rx="2"
        fill={`url(#${id}-cargo)`}
        stroke="#b7bdc5"
      />
      {Array.from({ length: 21 }, (_, i) => (
        <path
          key={i}
          d={"M" + (82 + i * 16) + " 86v155"}
          stroke="#b8bec6"
          strokeWidth="2"
          opacity=".7"
        />
      ))}
      <path d="M68 236h363v19H68Z" fill="#939aa2" />
      <path d="M81 243h338" stroke="#f50" strokeWidth="3" />
      <image href="/images/panvibes-logo-transparent.png" x="112" y="112" width="275" height="101" preserveAspectRatio="xMidYMid meet" />
      </g>
      <path
        d="M430 246h34V119q0-29 31-30h47q17 0 25 20l42 82v55h23v22H430Z"
        fill={`url(#${id}-cab)`}
      />
      <path
        d="m504 103 38 2 34 76h-72v-78Z"
        fill={`url(#${id}-window)`}
        stroke="#747a83"
      />
      <path d="M477 104h17v76h-17Z" fill="#161c23" stroke="#656b75" />
      <path d="M504 195h73v42h-73Z" stroke="#666c72" strokeWidth="1" />
      <path d="M594 203h17v18h-17Z" fill="#e7e9e9" />
      <path d="M604 234h21v7h-21Z" fill="#ce5024" />
      <path d="M581 165h19v-20" stroke="#2d3239" strokeWidth="5" />
      <rect x="594" y="143" width="14" height="19" rx="3" fill="#171b20" />
      <path d="M79 263h545" stroke="#22272d" strokeWidth="11" />
      <g className="tempo-wheel">
        <circle cx="175" cy="265" r="39" fill={`url(#${id}-tire)`} />
        <circle cx="175" cy="265" r="19" fill="#a4abb1" />
        <circle cx="175" cy="265" r="8" fill="#424951" />
        {Array.from({ length: 6 }, (_, i) => (
          <circle
            key={i}
            cx={Number((175 + 13 * Math.cos((i * Math.PI) / 3)).toFixed(3))}
            cy={Number((265 + 13 * Math.sin((i * Math.PI) / 3)).toFixed(3))}
            r="2.5"
            fill="#52575c"
          />
        ))}
      </g>
      <g className="tempo-wheel">
        <circle cx="548" cy="265" r="39" fill={`url(#${id}-tire)`} />
        <circle cx="548" cy="265" r="19" fill="#a4abb1" />
        <circle cx="548" cy="265" r="8" fill="#424951" />
        {Array.from({ length: 6 }, (_, i) => (
          <circle
            key={i}
            cx={Number((548 + 13 * Math.cos((i * Math.PI) / 3)).toFixed(3))}
            cy={Number((265 + 13 * Math.sin((i * Math.PI) / 3)).toFixed(3))}
            r="2.5"
            fill="#52575c"
          />
        ))}
      </g>
    </svg>
  );
}

export function SideTruck() {
  return (
    <div className="j-side-truck" aria-hidden="true">
      <Image
        className="j-truck-chassis"
        src="/images/truck-cab.avif"
        alt=""
        width={2664}
        height={614}
        unoptimized
      />
      <Image
        className="j-truck-cargo"
        src="/images/truck-container.avif"
        alt=""
        width={2664}
        height={614}
        unoptimized
      />
      <div className="j-truck-wheels">
        {[9, 18, 27, 65, 90].map((left, index) => (
          <span
            className="j-truck-wheel"
            key={left}
            style={{ left: left + "%" }}
          >
            <Image
              src={
                index === 4
                  ? "/images/wheel-front.avif"
                  : "/images/wheel-back.avif"
              }
              alt=""
              width={116}
              height={116}
              unoptimized
            />
          </span>
        ))}
      </div>
    </div>
  );
}
export function TopTruck({
  className = "",
  cargo = true,
}: {
  className?: string;
  cargo?: boolean;
}) {
  return (
    <div className={"j-top-truck " + className} aria-hidden="true">
      <Image
        src="/images/truck-top.avif"
        alt=""
        width={5760}
        height={1618}
        unoptimized
      />
      {cargo && (
        <Image
          className="j-top-cargo"
          src="/images/container-top.avif"
          alt=""
          width={5760}
          height={1618}
          unoptimized
        />
      )}
    </div>
  );
}
export function PackingBoxes() {
  return (
    <div className="j-packing-boxes" aria-hidden="true">
      {Array.from({ length: 6 }, (_, i) => (
        <div className={"j-box j-box-" + i} key={i}>
          <span />
          <i />
          <b>
            <em>↑ ↑</em>
          </b>
        </div>
      ))}
    </div>
  );
}
