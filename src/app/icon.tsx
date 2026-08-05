import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** Favicon Zkode: hexágono roxo + losango rosa em tile escuro. */
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
          background: "#0B0F19",
          borderRadius: 14,
        }}
      >
        <svg width="42" height="42" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2 L21 7 V17 L12 22 L3 17 V7 Z"
            fill="none"
            stroke="#8B5CF6"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path d="M12 8.4 L16.2 11 L12 13.6 L7.8 11 Z" fill="#EC4899" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
