"use client"

import { useEffect, useRef, useState, type SVGProps } from "react"

import dynamic from "next/dynamic"

import { LiquidButton } from "@/components/ui/liquid-glass-button"
import { RadialScrollGallery } from "@/components/ui/portfolio-and-image-gallery"
import { ShaderAnimation } from "@/components/ui/shader-animation"
import type { OrbitingSkillsProps } from "@/components/ui/orbiting-skills"
import { WebGLShader } from "@/components/ui/web-gl-shader"
import { Check, Instagram } from "lucide-react"
import { LocationMap } from "@/components/ui/expand-map"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { WarpDialog, WarpDialogContent } from "@/components/ui/warp-dialog"
import { HoverPeek } from "@/components/ui/link-preview"
import {
  HoverSlider,
  HoverSliderImageWrap,
  HoverSliderText,
  TextStaggerHover,
} from "@/components/ui/animated-slideshow"

const LOADING_DURATION_MS = 3200
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? ""

const OrbitingSkills = dynamic(() => import("@/components/ui/orbiting-skills"), {
  ssr: false,
}) as unknown as import("react").ComponentType<OrbitingSkillsProps>

function FigmaLogoIcon({ children, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" role="img" aria-label="Figma" {...props}>
      <g fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="5.5" r="3.5" />
        <circle cx="15" cy="5.5" r="3.5" />
        <circle cx="9" cy="12" r="3.5" />
        <circle cx="15" cy="12" r="3.5" />
        <circle cx="9" cy="18.5" r="3.5" />
      </g>
      {children}
    </svg>
  )
}

function CanvaLogoIcon({ children, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" role="img" aria-label="Canva" {...props}>
      <g fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="32" cy="32" r="32" />
        <path d="M45.6,43.1c-1.7,2.3-3.9,4.7-6.8,6.5c-2.8,1.8-6,3.2-9.8,3.2c-3.5,0-6.4-1.8-8-3.3c-2.4-2.3-3.7-5.6-4.1-8.7c-1.2-9.6,4.7-22.3,13.8-27.8c2.1-1.3,4.4-1.9,6.6-1.9c4.4,0,7.7,3.1,8.1,6.9c0.4,3.4-0.9,6.3-4.7,8.2c-1.9,1-2.9,0.9-3.2,0.5c-0.2-0.3-0.1-0.8,0.3-1.1c3.5-2.9,3.6-5.3,3.2-8.7c-0.3-2.2-1.7-3.6-3.3-3.6c-6.9,0-16.9,15.5-15.5,26.7c0.5,4.4,3.2,9.5,8.8,9.5c1.8,0,3.8-0.5,5.5-1.4c3.9-2,5.6-3.4,7.9-6.6c0.3-0.4,0.6-0.9,0.9-1.3c0.2-0.4,0.6-0.5,0.9-0.5c0.3,0,0.7,0.3,0.7,0.8c0,0.3-0.1,0.9-0.5,1.4C46.3,42.1,46,42.7,45.6,43.1L45.6,43.1z" />
      </g>
      {children}
    </svg>
  )
}

function VsCodeLogoIcon({ children, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 100" role="img" aria-label="Visual Studio Code" {...props}>
      <path
        d="M70.9119 99.3171C72.4869 99.9307 74.2828 99.8914 75.8725 99.1264L96.4608 89.2197C98.6242 88.1787 100 85.9892 100 83.5872V16.4133C100 14.0113 98.6243 11.8218 96.4609 10.7808L75.8725 0.873756C73.7862 -0.130129 71.3446 0.11576 69.5135 1.44695C69.252 1.63711 69.0028 1.84943 68.769 2.08341L29.3551 38.0415L12.1872 25.0096C10.589 23.7965 8.35363 23.8959 6.86933 25.2461L1.36303 30.2549C-0.452552 31.9064 -0.454633 34.7627 1.35853 36.417L16.2471 50.0001L1.35853 63.5832C-0.454633 65.2374 -0.452552 68.0938 1.36303 69.7453L6.86933 74.7541C8.35363 76.1043 10.589 76.2037 12.1872 74.9905L29.3551 61.9587L68.769 97.9167C69.3925 98.5406 70.1246 99.0104 70.9119 99.3171ZM75.0152 27.2989L45.1091 50.0001L75.0152 72.7012V27.2989Z"
      />
      {children}
    </svg>
  )
}

function PhotoshopLogoIcon({ children, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 240 234" role="img" aria-label="Adobe Photoshop" {...props}>
      <path
        d="M54,164.1V61.2c0-0.7,0.3-1.1,1-1.1c1.7,0,3.3,0,5.6-0.1c2.4-0.1,4.9-0.1,7.6-0.2c2.7-0.1,5.6-0.1,8.7-0.2c3.1-0.1,6.1-0.1,9.1-0.1c8.2,0,15,1,20.6,3.1c5,1.7,9.6,4.5,13.4,8.2c3.2,3.2,5.7,7.1,7.3,11.4c1.5,4.2,2.3,8.5,2.3,13c0,8.6-2,15.7-6,21.3c-4,5.6-9.6,9.8-16.1,12.2c-6.8,2.5-14.3,3.4-22.5,3.4c-2.4,0-4,0-5-0.1c-1-0.1-2.4-0.1-4.3-0.1v32.1c0.1,0.7-0.4,1.3-1.1,1.4c-0.1,0-0.2,0-0.4,0H55.2C54.4,165.4,54,165,54,164.1z M75.8,79.4V113c1.4,0.1,2.7,0.2,3.9,0.2H85c3.9,0,7.8-0.6,11.5-1.8c3.2-0.9,6-2.8,8.2-5.3c2.1-2.5,3.1-5.9,3.1-10.3c0.1-3.1-0.7-6.2-2.3-8.9c-1.7-2.6-4.1-4.6-7-5.7c-3.7-1.5-7.7-2.1-11.8-2c-2.6,0-4.9,0-6.8,0.1C77.9,79.2,76.5,79.3,75.8,79.4L75.8,79.4z"
      />
      <path
        d="M192,106.9c-3-1.6-6.2-2.7-9.6-3.4c-3.7-0.8-7.4-1.3-11.2-1.3c-2-0.1-4.1,0.2-6,0.7c-1.3,0.3-2.4,1-3.1,2c-0.5,0.8-0.8,1.8-0.8,2.7c0,0.9,0.4,1.8,1,2.6c0.9,1.1,2.1,2,3.4,2.7c2.3,1.2,4.7,2.3,7.1,3.3c5.4,1.8,10.6,4.3,15.4,7.3c3.3,2.1,6,4.9,7.9,8.3c1.6,3.2,2.4,6.7,2.3,10.3c0.1,4.7-1.3,9.4-3.9,13.3c-2.8,4-6.7,7.1-11.2,8.9c-4.9,2.1-10.9,3.2-18.1,3.2c-4.6,0-9.1-0.4-13.6-1.3c-3.5-0.6-7-1.7-10.2-3.2c-0.7-0.4-1.2-1.1-1.1-1.9v-17.4c0-0.3,0.1-0.7,0.4-0.9c0.3-0.2,0.6-0.1,0.9,0.1c3.9,2.3,8,3.9,12.4,4.9c3.8,1,7.8,1.5,11.8,1.5c3.8,0,6.5-0.5,8.3-1.4c1.6-0.7,2.7-2.4,2.7-4.2c0-1.4-0.8-2.7-2.4-4c-1.6-1.3-4.9-2.8-9.8-4.7c-5.1-1.8-9.8-4.2-14.2-7.2c-3.1-2.2-5.7-5.1-7.6-8.5c-1.6-3.2-2.4-6.7-2.3-10.2c0-4.3,1.2-8.4,3.4-12.1c2.5-4,6.2-7.2,10.5-9.2c4.7-2.4,10.6-3.5,17.7-3.5c4.1,0,8.3,0.3,12.4,0.9c3,0.4,5.9,1.2,8.6,2.3c0.4,0.1,0.8,0.5,1,0.9c0.1,0.4,0.2,0.8,0.2,1.2v16.3c0,0.4-0.2,0.8-0.5,1C192.9,107.1,192.4,107.1,192,106.9z"
      />
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

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const [galleryImage, setGalleryImage] = useState<{ src: string; title: string } | null>(null)
  const aboutRef = useRef<HTMLDivElement>(null)
  const aboutCardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsLoading(false)
    }, LOADING_DURATION_MS)

    return () => {
      window.clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    const previousPaddingRight = document.body.style.paddingRight
    if (isLoading || isGalleryOpen) {
      document.body.style.overflow = "hidden"

      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`
      }
    } else {
      document.body.style.overflow = previousOverflow || ""
      document.body.style.paddingRight = previousPaddingRight || ""
    }

    return () => {
      document.body.style.overflow = previousOverflow
      document.body.style.paddingRight = previousPaddingRight
    }
  }, [isLoading, isGalleryOpen])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      if (aboutCardRef.current) {
        gsap.from(aboutCardRef.current, {
          y: 60,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          toggleActions: "play reverse play reverse",
          scrollTrigger: {
            trigger: aboutCardRef.current,
            start: "top 80%",
            end: "bottom 30%",
            scrub: true,
          },
        })
      }

      gsap.from(".about-animate", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "power2.out",
        toggleActions: "play reverse play reverse",
        scrollTrigger: {
          trigger: aboutRef.current,
          start: "top 82%",
          end: "bottom 30%",
          scrub: true,
        },
      })
    }, aboutRef)

    return () => ctx.revert()
  }, [])




  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {isLoading ? (
        <div className="loading-overlay fixed inset-0 z-20">
          <ShaderAnimation durationMs={LOADING_DURATION_MS} />
          <div className="loading-text">
            <h1 className="text-scan text-center text-6xl font-semibold tracking-tight md:text-8xl">
              ADITI
            </h1>
          </div>
        </div>
      ) : null}

      <div className="relative z-10 w-full">
        <WebGLShader />

        <section
          data-hero
          className="relative flex min-h-screen w-full flex-col items-center justify-center px-4 py-16"
        >
          <div className="relative w-full max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-2 shadow-[0_18px_60px_-30px_rgba(0,0,0,0.8)] backdrop-blur-xl">
            <main className="relative overflow-hidden rounded-[22px] border border-white/8 bg-white/3 py-10">
              <h1 className="mb-3 text-center text-5xl font-extrabold tracking-tighter text-white md:text-[clamp(2rem,8vw,7rem)]">
                HEY, I&apos;M{" "}
                <span className="hologram-text">ADITI</span>
              </h1>
              <p className="px-6 text-center text-xs text-white/60 md:text-sm lg:text-lg">
                Unleashing creativity through bold visuals, seamless interfaces,
                and limitless possibilities.
              </p>
              <div className="my-8 flex items-center justify-center gap-1">
                <span className="relative flex h-3 w-3 items-center justify-center">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                </span>
                <p className="text-xs text-green-500">Available for New Projects</p>
              </div>
            </main>
          </div>
        </section>

        <section
          ref={aboutRef}
          className="relative mx-auto w-full max-w-4xl px-4 pb-16 pt-2"
        >
          <div
            ref={aboutCardRef}
            className="about-card rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl md:p-12"
          >
            <h2 className="about-animate text-4xl text-white md:text-5xl">
              ABOUT ME
            </h2>
            <p className="about-animate mt-4 text-base leading-relaxed text-white/70 md:text-lg">
              Hi, I&apos;m Aditi Singh Chauhan — a creative designer with a strong
              interest in marketing and content-driven visuals. I enjoy turning
              ideas into eye-catching posters and banners that actually
              communicate, not just look good. I&apos;m currently exploring
              real-world marketing through internships and hands-on projects
              while building a strong creative portfolio.
            </p>
            <div className="about-animate mt-6 flex flex-wrap gap-3 text-xs uppercase tracking-[0.2em] text-white/50">
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                Marketing
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                Design
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                Innovative Solutions
              </span>
            </div>
          </div>
        </section>

        <section className="relative mx-auto w-full max-w-4xl px-4 pb-16">
          <div className="about-card rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl md:p-12">
            <HoverSlider className="text-white">
              <div className="flex flex-wrap items-center justify-between gap-8">
                <div className="flex flex-col space-y-3 md:space-y-5">
                  {[
                    "What I Do",
                    "Services",
                    "Expertise",
                    "My Digital Toolbox",
                  ].map((title, index) => (
                    <TextStaggerHover
                      key={title}
                      index={index}
                      className="cursor-pointer text-2xl font-semibold uppercase tracking-tight md:text-3xl"
                      text={title}
                    />
                  ))}
                </div>
                <HoverSliderImageWrap className="min-h-[220px] w-full max-w-sm overflow-visible">
                  {[
                    "I design posters and banners for events, brands, social media, and campaigns, keeping both aesthetic appeal and marketing purpose in mind.",
                    "Poster Design\nBanner Design (online & offline)\nSocial Media Creatives\nEvent & Campaign Visuals\nBasic Content & Layout Planning",
                    "Visual storytelling\nClean & trendy layouts\nBrand-aligned designs\nMarketing-focused creatives\nAttention to detail & consistency",
                    null,
                  ].map((copy, index) => (
                    <HoverSliderText
                      key={copy ?? "digital-toolbox"}
                      index={index}
                      className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
                    >
                      {index === 3 ? (
                        <OrbitingSkills
                          className="min-h-[220px] overflow-visible"
                          skills={[
                            {
                              id: "figma",
                              label: "Figma",
                              proficiency: "Intermediate",
                              icon: FigmaLogoIcon,
                              ring: "inner",
                              size: 42,
                            },
                            {
                              id: "vscode",
                              label: "VS Code",
                              proficiency: "Intermediate",
                              icon: VsCodeLogoIcon,
                              ring: "inner",
                              size: 42,
                              iconStrokeWidth: 6,
                            },
                            {
                              id: "photoshop",
                              label: "Basic Photoshop",
                              proficiency: "Basic",
                              icon: PhotoshopLogoIcon,
                              iconMode: "fill",
                              ring: "outer",
                              size: 42,
                            },
                            {
                              id: "google-docs",
                              label: "Google Docs & Drive",
                              proficiency: "Advanced",
                              icon: GoogleDriveLogoIcon,
                              ring: "outer",
                              size: 42,
                              iconStrokeWidth: 6,
                            },
                            {
                              id: "canva",
                              label: "Canva",
                              proficiency: "Advanced",
                              icon: CanvaLogoIcon,
                              ring: "outer",
                              size: 42,
                            },
                            {
                              id: "instagram",
                              label: "Instagram & digital trend research",
                              proficiency: "Intermediate",
                              icon: Instagram,
                              ring: "outer",
                              size: 42,
                            },
                            {
                              id: "word",
                              label: "MS Word",
                              proficiency: "Intermediate",
                              icon: MsWordLogoIcon,
                              ring: "outer",
                              size: 42,
                            },
                          ]}
                        />
                      ) : index === 1 ? (
                        <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-white/70 md:text-base">
                          <li>Poster Design</li>
                          <li>Banner Design (online &amp; offline)</li>
                          <li>Social Media Creatives</li>
                          <li>Event &amp; Campaign Visuals</li>
                          <li>Basic Content &amp; Layout Planning</li>
                        </ul>
                      ) : index === 2 ? (
                        <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-white/70 md:text-base">
                          <li>Visual storytelling</li>
                          <li>Clean &amp; trendy layouts</li>
                          <li>Brand-aligned designs</li>
                          <li>Marketing-focused creatives</li>
                          <li>Attention to detail &amp; consistency</li>
                        </ul>
                      ) : (
                        <p className="whitespace-pre-line text-sm leading-relaxed text-white/70 md:text-base">
                          {copy}
                        </p>
                      )}
                    </HoverSliderText>
                  ))}
                </HoverSliderImageWrap>
              </div>
            </HoverSlider>
          </div>
        </section>




        <section className="relative w-full px-4 pt-8 pb-28 -mt-12">
          <RadialScrollGallery
            className="!min-h-[720px]"
            baseRadius={420}
            mobileRadius={260}
            scrollDuration={2000}
            visiblePercentage={40}
          >
              {(hoveredIndex) => {
                const steps = [
                    { step: "01", title: "NIKE", img: `${BASE_PATH}/gallery/01.jpg` },
                    { step: "02", title: "CAFE", img: `${BASE_PATH}/gallery/02.jpg` },
                    { step: "03", title: "CLOTHING", img: `${BASE_PATH}/gallery/03.jpg` },
                    { step: "04", title: "SELF-CARE", img: `${BASE_PATH}/gallery/04.jpg` },
                    { step: "05", title: "JWELLERY", img: `${BASE_PATH}/gallery/05.jpg` },
                    { step: "06", title: "BOLD", img: `${BASE_PATH}/gallery/06.jpg` },
                    { step: "07", title: "ANTICIPATION", img: `${BASE_PATH}/gallery/07.jpg` },
                    { step: "08", title: "ELEGANCE", img: `${BASE_PATH}/gallery/08.jpg` },
                  ]

                return steps.map((item, index) => {
                  const isActive = hoveredIndex === index
                  return (
                    <div
                      key={index}
                      onClick={() => {
                        setGalleryImage({ src: item.img, title: item.title })
                        setIsGalleryOpen(true)
                      }}
                      className={`
                      flex h-[240px] w-[160px] flex-col items-start justify-between overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-sm transition-all duration-500 sm:h-[280px] sm:w-[200px]
                      ${
                        isActive
                          ? "scale-[1.28] -translate-y-3 border-white/20 bg-white text-black shadow-xl"
                          : "scale-100 translate-y-2 text-white/70 opacity-60"
                      }
                    `}
                    >
                      <div className="relative h-full w-full">
                        <img
                          src={item.img}
                          alt={item.title}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <div className="flex items-center justify-between text-xs text-white/80">
                            <span className="font-mono">{item.step}</span>
                            {isActive ? (
                              <Check className="h-4 w-4 text-white/90" />
                            ) : null}
                          </div>
                          <h3 className="mt-1 text-sm font-semibold text-white">
                            {item.title}
                          </h3>
                        </div>
                      </div>
                    </div>
                  )
                })
              }}
            </RadialScrollGallery>

        </section>

        <section className="relative mx-auto w-full max-w-6xl px-4 pb-24">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-stretch">
              <div>
                <h2 className="text-3xl font-semibold text-white md:text-4xl">
                  Contact Me
                </h2>
                <p className="mt-3 text-sm text-white/70 md:text-base">
                  Let&apos;s build something bold together. Share a project brief,
                  timeline, or just say hi.
                </p>
                <div className="mt-6 space-y-3 text-sm text-white/70">
                  <div>
                    <span className="text-white/90">Email</span>{" "}
                    <span className="text-white/60">aditichauhansing@gmail.com</span>
                  </div>
                  <div>
                    <span className="text-white/90">Location</span>{" "}
                    <span className="text-white/60">Bhopal, MP</span>
                  </div>
                </div>
                <div className="mt-6">
                  <HoverPeek
                    url="https://www.linkedin.com/in/aditi-singh-chauhan-918298373/"
                    isStatic
                    imageSrc={`${BASE_PATH}/linkedin.png`}
                  >
                    <a
                      href="https://www.linkedin.com/in/aditi-singh-chauhan-918298373/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-white/80 transition hover:text-white"
                      aria-label="LinkedIn profile"
                    >
                      <svg
                        viewBox="0 0 28 28"
                        className="h-6 w-6"
                        aria-hidden="true"
                      >
                        <mask id="linkedin-cutout" maskUnits="userSpaceOnUse">
                          <rect x="0" y="0" width="28" height="28" fill="white" rx="7" />
                          <g transform="translate(2 2)">
                            <path
                              d="M4.98 3.5a2.5 2.5 0 1 1-.02 5 2.5 2.5 0 0 1 .02-5ZM3 8.98h3.94V21H3V8.98Zm7.33 0h3.78v1.64h.05c.53-1 1.84-2.05 3.79-2.05 4.05 0 4.8 2.66 4.8 6.12V21H18.8v-5.46c0-1.3-.03-2.97-1.81-2.97-1.82 0-2.1 1.42-2.1 2.88V21h-3.86V8.98Z"
                              fill="black"
                            />
                          </g>
                        </mask>
                        <rect
                          x="0"
                          y="0"
                          width="28"
                          height="28"
                          rx="7"
                          fill="white"
                          mask="url(#linkedin-cutout)"
                        />
                      </svg>
                    </a>
                  </HoverPeek>
                </div>
              </div>
              <div className="flex h-full items-end justify-center md:justify-end md:pr-8">
                <LocationMap
                  location="Bhopal, MP"
                  coordinates="23.1447° N, 77.307° E"
                  className="scale-[0.9] sm:scale-95 md:scale-100 lg:scale-110"
                />
              </div>
            </div>
          </div>
        </section>

        <WarpDialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
          <WarpDialogContent>
            <div className="max-w-[90vw] rounded-2xl border border-white/10 bg-black/70 p-4 backdrop-blur-xl">
              {galleryImage ? (
                <img
                  src={galleryImage.src}
                  alt={galleryImage.title}
                  className="max-h-[80vh] w-auto rounded-xl object-contain"
                />
              ) : null}
              {galleryImage ? (
                <div className="mt-3 text-sm text-white/70">
                  {galleryImage.title}
                </div>
              ) : null}
            </div>
          </WarpDialogContent>
        </WarpDialog>
      </div>
    </div>
  )
}
