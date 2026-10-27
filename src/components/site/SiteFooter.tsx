import { ArrowUp, ArrowUpRight, Globe, Mail, MessageCircle, Phone } from "lucide-react";
import { Link } from "react-router-dom";

import { useContact } from "@/hooks/useContact";
import { useServices } from "@/hooks/useServices";
import { formatPhone, isHttpUrl, telHref, whatsappHref } from "@/lib/format";

import { Marquee, Reveal } from "./motion";
import { BrandMark } from "./SiteHeader";
import { NAV_LINKS } from "@/lib/site";
import { ButtonLink, GridLines } from "./ui";
import { scrollToY } from "@/lib/scroll";

export function CtaBand() {
  const contact = useContact().data?.data;

  return (
    <section className="relative isolate overflow-hidden bg-brand text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.18),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(13,15,18,0.45),transparent_60%)]" />
      <GridLines />
      <div className="container-site grid gap-10 py-20 sm:py-28 lg:grid-cols-[1.4fr_1fr] lg:items-end">
        <Reveal>
          <span className="eyebrow text-white/70">Start a project</span>
          <h2 className="display mt-5 text-4xl sm:text-5xl lg:text-6xl">
            Have an industrial project in planning?
          </h2>
        </Reveal>
        <Reveal delay={0.15} className="flex flex-col gap-6 lg:items-end">
          <p className="max-w-md text-lg leading-8 text-white/80 lg:text-right">
            Share your scope, drawings or site requirements and our engineering team will get back with a practical plan.
          </p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink to="/contact" tone="light">
              Request a quote
            </ButtonLink>
            {contact?.whatsappNumber && (
              <ButtonLink
                to={whatsappHref(contact.whatsappNumber, "Hello Muthammal Engineering, I'd like to discuss a project.")}
                tone="outline-light"
                external
                icon={<MessageCircle className="size-4" />}
              >
                WhatsApp
              </ButtonLink>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function SiteFooter() {
  const contact = useContact().data?.data;
  const services = useServices({ status: "published" }).data?.data ?? [];
  const year = new Date().getFullYear();

  return (
    <footer className="relative isolate overflow-hidden bg-ink text-white">
      <GridLines />
      <div className="container-site grid gap-14 pb-12 pt-20 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
        <div>
          <BrandMark />
          <p className="mt-6 max-w-sm leading-7 text-white/60">
            Design and engineering, steel fabrication, structural erection, piping, mechanical and electrical works for industrial and infrastructure projects across India.
          </p>
          {contact?.socialMedia && contact.socialMedia.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {contact.socialMedia
                .filter((social) => isHttpUrl(social.url))
                .map((social) => (
                  <a
                    key={`${social.platform}-${social.url}`}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.14em] text-white/75 transition hover:border-white hover:bg-white hover:text-ink"
                  >
                    <Globe className="size-3.5" />
                    {social.platform}
                  </a>
                ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/45">Explore</h3>
          <ul className="mt-6 space-y-3">
            {[...NAV_LINKS, { to: "/contact", label: "Contact" }].map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="group inline-flex items-center gap-2 text-white/75 transition hover:text-white">
                  {link.label}
                  <ArrowUpRight className="size-3.5 opacity-0 transition group-hover:opacity-100" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/45">Services</h3>
          <ul className="mt-6 space-y-3">
            {services.map((service) => (
              <li key={service.id}>
                <Link to={`/services/${service.slug}`} className="text-white/75 transition hover:text-white">
                  {service.title}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/services" className="text-white/45 transition hover:text-white">
                All services →
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/45">Contact</h3>
          {contact ? (
            <ul className="mt-6 space-y-4 text-white/75">
              <li>
                <a href={telHref(contact.contactNumber1)} className="flex items-center gap-3 transition hover:text-white">
                  <Phone className="size-4 text-white/45" />
                  {formatPhone(contact.contactNumber1)}
                </a>
              </li>
              {contact.contactNumber2 && (
                <li>
                  <a href={telHref(contact.contactNumber2)} className="flex items-center gap-3 transition hover:text-white">
                    <Phone className="size-4 text-white/45" />
                    {formatPhone(contact.contactNumber2)}
                  </a>
                </li>
              )}
              <li>
                <a href={`mailto:${contact.email}`} className="flex items-center gap-3 break-all transition hover:text-white">
                  <Mail className="size-4 shrink-0 text-white/45" />
                  {contact.email}
                </a>
              </li>
              <li>
                <a
                  href={whatsappHref(contact.whatsappNumber)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 transition hover:text-white"
                >
                  <MessageCircle className="size-4 text-white/45" />
                  WhatsApp us
                </a>
              </li>
            </ul>
          ) : (
            <p className="mt-6 text-white/50">Contact details are loading…</p>
          )}
        </div>
      </div>

      <Marquee duration={50} className="border-y border-white/10 py-6">
        {["Design & Engineering", "Steel Fabrication", "Structural Erection", "Piping Systems", "Mechanical Works", "Electrical Installations", "Manpower Supply"].map((item) => (
          <span key={item} className="flex items-center gap-10 px-5 font-display text-3xl uppercase text-white/15 sm:text-5xl">
            {item}
            <span className="size-2 rounded-full bg-brand-red/70" />
          </span>
        ))}
      </Marquee>

      <div className="container-site flex flex-col items-start justify-between gap-4 py-8 text-sm text-white/45 sm:flex-row sm:items-center">
        <p>© {year} Muthammal Engineering Services. All rights reserved.</p>
        <button
          type="button"
          onClick={() => scrollToY(0)}
          className="inline-flex items-center gap-2 uppercase tracking-[0.16em] transition hover:text-white"
        >
          Back to top
          <ArrowUp className="size-4" />
        </button>
      </div>
    </footer>
  );
}
