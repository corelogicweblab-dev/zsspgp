import Image from "next/image";
import Link from "next/link";
import { FOOTER_COAT_WATERMARK, FOOTER_OFFICIAL_SEALS } from "@/lib/footer-seals";

/** Transparency-style seal band — watermark + official logo row (ZSSPGP theme). */
export function FooterSealPanel() {
  return (
    <section className="footer-gateway-cell footer-panel footer-seal-panel" aria-labelledby="footer-seal-heading">
      <h3 id="footer-seal-heading" className="footer-panel-title">
        Seal
      </h3>
      <div className="footer-seal-divider" aria-hidden />

      <div className="footer-seal-body relative mt-3 min-h-[10.5rem] overflow-hidden rounded-lg sm:min-h-[11.5rem]">
        <div className="footer-seal-watermark pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden>
          <Image
            src={FOOTER_COAT_WATERMARK}
            alt=""
            width={280}
            height={308}
            className="h-[min(85%,16rem)] w-auto max-w-[min(90%,20rem)] object-contain opacity-[0.12]"
          />
        </div>

        <ul className="footer-seal-logos relative z-10 flex flex-wrap items-end justify-center gap-4 px-2 py-5 sm:gap-6 sm:px-4 sm:py-6">
          {FOOTER_OFFICIAL_SEALS.map((seal) => (
            <li key={seal.id}>
              <Link
                href={seal.href}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-seal-logo-link group flex flex-col items-center gap-1.5"
                title={seal.label}
              >
                <span className="relative flex h-[4.25rem] w-[4.25rem] items-center justify-center rounded-full border border-cyan-500/25 bg-slate-950/80 p-1.5 shadow-[0_0_20px_rgba(56,189,248,0.12)] transition group-hover:border-cyan-400/50 group-hover:shadow-[0_0_24px_rgba(56,189,248,0.2)] sm:h-[4.75rem] sm:w-[4.75rem]">
                  <Image
                    src={seal.src}
                    alt={seal.label}
                    width={72}
                    height={72}
                    className="h-full w-full object-contain"
                  />
                </span>
                <span className="sr-only">{seal.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
