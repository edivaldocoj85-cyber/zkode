import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Fixa a raiz do workspace neste projeto (evita inferência por lockfiles vizinhos)
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
