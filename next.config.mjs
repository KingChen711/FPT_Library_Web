import createBundleAnalyzerPlugin from "@next/bundle-analyzer"
import createNextIntlPlugin from "next-intl/plugin"

const withBundleAnalyzer = createBundleAnalyzerPlugin({
  enabled: process.env.ANALYZE === "true",
})
const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.node$/,
      use: "node-loader",
    })

    config.module.rules.push({
      test: /pdf\.worker\.(min\.)?js$/,
      use: { loader: "file-loader", options: { name: "[name].[ext]" } },
    })

    config.resolve.alias.canvas = false

    return config
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        port: "",
        pathname: "**",
      },
    ],
  },
  experimental: {
    turbo: {
      resolveAlias: {
        canvas: "./empty-module.ts",
      },
    },
  },
}

export default withBundleAnalyzer(withNextIntl(nextConfig))
