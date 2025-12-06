import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Permite origens de desenvolvimento com IPs privados (localhost)
  allowedDevOrigins: [
    "http://localhost:5573",
    "http://127.0.0.1:5573",
    "http://[::1]:5573",
  ],
  images: {
    // Permite carregar imagens de IPs privados em desenvolvimento
    dangerouslyAllowSVG: true,
    // Desabilita a verificação de IP privado para imagens remotas
    unoptimized: process.env.NODE_ENV === "development",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "mundialmegastore.com.br",
        port: "",
        pathname: "/**",
      },
      // Production assets domain
      {
        protocol: "https",
        hostname: "assents01.comsuporte.com.br",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5573",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
