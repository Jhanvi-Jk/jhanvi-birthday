"use client"

interface PolaroidProps {
  imageUrl?: string | null
  caption?: string | null
  rotation?: number
  style?: React.CSSProperties
  className?: string
  animationDelay?: string
}

const TAPE_COLORS = [
  "rgba(249,198,208,0.85)",
  "rgba(181,234,215,0.85)",
  "rgba(253,235,200,0.85)",
  "rgba(216,201,240,0.85)",
  "rgba(255,203,164,0.85)",
]

export default function Polaroid({
  imageUrl,
  caption,
  rotation = 0,
  style,
  className = "",
  animationDelay,
}: PolaroidProps) {
  const tapeColor = TAPE_COLORS[Math.floor(Math.abs(rotation * 13 + 7) % TAPE_COLORS.length)]

  return (
    <div
      className={`polaroid polaroid-drop ${className}`}
      style={{
        "--rot": `${rotation}deg`,
        transform: `rotate(${rotation}deg)`,
        animationDelay: animationDelay ?? "0s",
        ...style,
      } as React.CSSProperties}
    >
      {/* tape across top center */}
      <div
        className="tape-corner"
        style={{
          top: -9,
          left: "50%",
          transform: "translateX(-50%) rotate(-1deg)",
          background: tapeColor,
          backgroundImage: "repeating-linear-gradient(45deg,transparent,transparent 3px,rgba(255,255,255,0.3) 3px,rgba(255,255,255,0.3) 6px)",
          width: 48,
          height: 18,
        }}
      />

      <div className="polaroid-inner">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={caption ?? "memory"} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          /* Empty placeholder */
          <div style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            background: "linear-gradient(135deg, #EDE5D0 0%, #E0D8C4 100%)",
          }}>
            <div style={{ fontSize: 22, opacity: 0.4 }}>🌸</div>
            <div style={{
              fontFamily: "'Caveat', cursive",
              fontSize: 11,
              color: "rgba(100,70,50,0.4)",
              textAlign: "center",
              lineHeight: 1.4,
            }}>
              photo<br/>coming soon
            </div>
          </div>
        )}
      </div>

      <div className="polaroid-caption">
        {caption ?? ""}
      </div>
    </div>
  )
}
