"use client";

import Link from "next/link";
import { FastImage } from "@/components/ui/fast-image";
import { FOOTER_OFFICIAL_SEALS } from "@/lib/footer-seals";

/** Official government seals — circular icons with labels (responsive grid). */
export function FooterSealPanel() {
  return (
    <section
      className="footer-gateway-cell footer-panel"
      aria-labelledby="footer-seal-heading"
    >
      <h3 id="footer-seal-heading" className="footer-panel-title">
        Official seals
      </h3>

      <ul
        className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4"
        role="list"
        aria-label="Government and transparency seals"
      >
        {FOOTER_OFFICIAL_SEALS.map((seal) => (
          <li key={seal.id} className="flex justify-center">
            <Link
              href={seal.href}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-seal-logo-link group flex max-w-[8.5rem] flex-col items-center gap-2 text-center"
              title={seal.label}
            >
              <span className="relative flex h-16 w-16 items-center justify-center rounded-full border border-cyan-500/25 bg-slate-950/80 p-1.5 shadow-[0_0_20px_rgba(56,189,248,0.12)] transition group-hover:border-cyan-400/50 group-hover:shadow-[0_0_24px_rgba(56,189,248,0.2)] sm:h-[4.5rem] sm:w-[4.5rem]">
                <FastImage
                  src={seal.src}
                  alt={seal.label}
                  width={72}
                  height={72}
                  sizes="72px"
                  loading="lazy"
                  className="h-full w-full rounded-full object-contain"
                />
              </span>
              <span className="text-[10px] font-semibold leading-tight text-slate-300 transition group-hover:text-cyan-100 sm:text-xs">
                {seal.shortLabel}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
