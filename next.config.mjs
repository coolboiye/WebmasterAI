/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Keep the development overlay out of visual QA screenshots and demos.
  devIndicators: false,

  // Guard: the dev watcher must ignore everything that is generated, logged, or
  // tool-owned. Without this, a log file written inside the checkout (a preview
  // server redirecting its own stdout, a dev tool dropping state) re-triggers a
  // rebuild, which writes more output, which triggers another rebuild. That loop
  // aborts in-flight chunk requests, which surfaces as a page that renders but
  // never hydrates and as random "Invalid or unexpected token" / ChunkLoadError
  // noise in the browser.
  webpack(config, { dev }) {
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: [
          "**/node_modules/**",
          "**/.git/**",
          "**/.next/**",
          "**/.freebuff/**",
          "**/.turbo/**",
          "**/*.log",
          "**/*.log.*",
          "**/*.tsbuildinfo",
        ],
      };
    }

    return config;
  },
};

export default nextConfig;
