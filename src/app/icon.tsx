import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** Favicon gerado por código: tile escuro + "A3" dourado (mesma marca do Logo). */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(160deg,#18202f,#0b1019)",
          color: "#e8bd5a",
          fontSize: 30,
          fontWeight: 700,
          letterSpacing: -1,
          fontFamily: "monospace",
          borderRadius: 14,
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        A3
      </div>
    ),
    { ...size },
  );
}
