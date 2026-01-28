"use client"

import dynamic from "next/dynamic"

import type { OrbitingSkillsProps } from "@/components/ui/orbiting-skills"
import type { SVGProps } from "react"
import { Code2, Image, Instagram, PenTool } from "lucide-react"

const OrbitingSkills = dynamic(() => import("@/components/ui/orbiting-skills"), {
  ssr: false,
}) as unknown as import("react").ComponentType<OrbitingSkillsProps>

function MsWordLogoIcon({ children, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 962.5 1336.25" role="img" aria-label="Microsoft Word" {...props}>
      <g fill="none" strokeWidth="70" strokeLinecap="round" strokeLinejoin="round">
        <path d="M80.194,393.75h802.112c44.29,0,80.194,35.904,80.194,80.194v802.113c0,44.29-35.904,80.194-80.194,80.194H80.194c-44.29,0-80.194-35.904-80.194-80.194V473.944C0,429.654,35.904,393.75,80.194,393.75z" />
        <path d="M329.088,1008.788c1.575,12.381,2.625,23.144,3.106,32.375h1.837c0.7-8.75,2.158-19.294,4.375-31.631c2.217-12.338,4.215-22.765,5.994-31.281l84.35-363.913h109.069l87.5,358.444c5.084,22.288,8.723,44.881,10.894,67.637h1.444c1.631-22.047,4.671-43.966,9.1-65.625l69.781-360.631h99.269l-122.588,521.5H577.238L494.113,790.3c-2.406-9.931-5.162-22.925-8.181-38.894c-3.019-15.969-4.9-27.65-5.644-35h-1.444c-0.962,8.487-2.844,21.088-5.644,37.8c-2.8,16.713-5.046,29.079-6.738,37.1l-78.138,344.269h-117.95L147.131,614.337h101.062l75.994,364.656C325.894,986.475,327.513,996.45,329.088,1008.788z" />
      </g>
      {children}
    </svg>
  )
}

function GoogleDriveLogoIcon({ children, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 87.3 78" role="img" aria-label="Google Drive" {...props}>
      <path
        d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z"
      />
      <path
        d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z"
      />
      <path
        d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z"
      />
      <path
        d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z"
      />
      <path
        d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z"
      />
      <path
        d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z"
      />
      {children}
    </svg>
  )
}

export default function OrbitingSkillsDemo() {
  const skills = [
    { id: "figma", label: "Figma", proficiency: "Intermediate", icon: PenTool, ring: "inner" as const },
    { id: "vscode", label: "VS Code", proficiency: "Intermediate", icon: Code2, ring: "inner" as const },
    { id: "photoshop", label: "Basic Photoshop", proficiency: "Basic", icon: Image, ring: "outer" as const },
    { id: "google-docs", label: "Google Docs & Drive", proficiency: "Intermediate", icon: GoogleDriveLogoIcon, ring: "outer" as const },
    { id: "instagram", label: "Instagram & digital trend research", proficiency: "Intermediate", icon: Instagram, ring: "outer" as const },
    { id: "word", label: "MS Word", proficiency: "Intermediate", icon: MsWordLogoIcon, ring: "outer" as const },
  ]

  return (
    <div className="relative flex min-h-[650px] w-full items-center justify-center overflow-hidden rounded-xl border bg-black">
      <OrbitingSkills skills={skills} />
    </div>
  )
}
