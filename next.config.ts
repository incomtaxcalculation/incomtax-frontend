// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   trailingSlash: true,

//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "api.zenithgroup.pk",
//         pathname: "/uploads/**",
//       },
//       {
//         protocol: "http",
//         hostname: "localhost",
//         port: "5001",
//         pathname: "/uploads/**",
//       },
//     ],
//   },
// };

// export default nextConfig;

const nextConfig: NextConfig = {
  trailingSlash: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.incometaxcalculation.pk",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5001",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;