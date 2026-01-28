import type { NextConfig } from "next"

const isGitHubActions = process.env.GITHUB_ACTIONS === "true"
const repo = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? ""
const isUserOrOrgPage = repo.endsWith(".github.io")

const basePath = isGitHubActions && !isUserOrOrgPage ? `/${repo}` : ""
const assetPrefix = basePath ? `${basePath}/` : undefined

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix,
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
}

export default nextConfig
