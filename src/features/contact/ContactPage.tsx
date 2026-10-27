import { Globe, Mail, MessageCircle, Phone, Send } from "lucide-react";
import { useState, type FormEvent } from "react";

import { Reveal, Stagger, StaggerItem } from "@/components/site/motion";
import {
  EmptyState,
  PageHero,
  PageSkeleton,
  QueryError,
  SectionHeading,
} from "@/components/site/ui";
import { useContact } from "@/hooks/useContact";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useServices } from "@/hooks/useServices";
import {
  formatPhone,
  isHttpUrl,
  isSafeMapEmbed,
  telHref,
  whatsappHref,
} from "@/lib/format";

const fieldClass =
  "w-full rounded-[4px] border border-ink/15 bg-white px-4 py-3.5 text-ink outline-none transition placeholder:text-ink/35 focus:border-brand focus:ring-3 focus:ring-brand/15";

export function ContactPage() {
  const query = useContact();
  const services = useServices({ status: "published" }).data?.data ?? [];
  usePageMeta("Contact", "Get in touch with Muthammal Engineering Services for engineering, fabrication and erection projects.");

  if (query.error && query.data === undefined) {
    return <QueryError error={query.error} onRetry={() => void query.refetch()} />;
  }

  if (!query.data) {
    return <PageSkeleton />;
  }

  const contact = query.data.data;

  return (
    <>
      <PageHero
        compact
        eyebrow="Contact"
        title="Let's discuss your next project"
        description="Call, WhatsApp or send us your requirement. We usually respond within one working day."
        crumbs={[{ label: "Home", to: "/" }, { label: "Contact" }]}
      />

      {!contact ? (
        <section className="container-site py-24">
          <EmptyState message="Contact details will be available soon." />
        </section>
      ) : (
        <>
          <section className="container-site -mt-10 relative z-10">
            <Stagger className="grid gap-px overflow-hidden rounded-md border border-ink/10 bg-ink/10 shadow-[0_40px_80px_-40px_rgba(13,15,18,0.35)] sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: Phone,
                  label: "Call us",
                  value: formatPhone(contact.contactNumber1),
                  href: telHref(contact.contactNumber1),
                  extra: contact.contactNumber2 ? formatPhone(contact.contactNumber2) : undefined,
                  extraHref: contact.contactNumber2 ? telHref(contact.contactNumber2) : undefined,
                },
                {
                  icon: MessageCircle,
                  label: "WhatsApp",
                  value: formatPhone(contact.whatsappNumber),
                  href: whatsappHref(contact.whatsappNumber),
                  external: true,
                },
                {
                  icon: Mail,
                  label: "Email",
                  value: contact.email,
                  href: `mailto:${contact.email}`,
                },
                ...contact.socialMedia
                  .filter((social) => isHttpUrl(social.url))
                  .slice(0, 1)
                  .map((social) => ({
                    icon: Globe,
                    label: social.platform,
                    value: new URL(social.url).hostname.replace(/^www\./, ""),
                    href: social.url,
                    external: true,
                  })),
              ].map((item) => (
                <StaggerItem key={item.label} className="group bg-white p-8 transition-colors duration-500 hover:bg-ink hover:text-white">
                  <item.icon className="size-6 text-brand transition-colors group-hover:text-white" />
                  <p className="mt-8 text-xs uppercase tracking-[0.18em] text-muted-foreground group-hover:text-white/55">
                    {item.label}
                  </p>
                  <a
                    href={item.href}
                    {...("external" in item && item.external && { target: "_blank", rel: "noopener noreferrer" })}
                    className="mt-2 block break-words text-lg font-medium"
                  >
                    {item.value}
                  </a>
                  {"extra" in item && item.extra && (
                    <a href={item.extraHref} className="mt-1 block text-lg font-medium opacity-70">
                      {item.extra}
                    </a>
                  )}
                </StaggerItem>
              ))}
            </Stagger>
          </section>

          <section className="container-site grid gap-14 py-24 sm:py-32 lg:grid-cols-2 lg:gap-20">
            <div>
              <SectionHeading
                eyebrow="Send an enquiry"
                title="Tell us about your requirement"
                description="Your message opens in WhatsApp or your email app, ready to send, so nothing is stored on this website."
              />
              <Reveal delay={0.1}>
                <EnquiryForm
                  email={contact.email}
                  whatsapp={contact.whatsappNumber}
                  services={services.map((service) => service.title)}
                />
              </Reveal>
            </div>
            <Reveal delay={0.15} className="min-h-[28rem]">
              {isSafeMapEmbed(contact.location.mapUrl) ? (
                <iframe
                  src={contact.location.mapUrl}
                  title="Muthammal Engineering Services location"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-full min-h-[28rem] w-full rounded-md border border-ink/10 grayscale-[0.4] transition duration-700 hover:grayscale-0"
                />
              ) : (
                <div className="grid h-full place-items-center rounded-md bg-muted text-muted-foreground">
                  Map unavailable
                </div>
              )}
            </Reveal>
          </section>
        </>
      )}
    </>
  );
}

function EnquiryForm({
  email,
  whatsapp,
  services,
}: {
  email: string;
  whatsapp: string;
  services: string[];
}) {
  const [channel, setChannel] = useState<"whatsapp" | "email">("whatsapp");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const company = String(data.get("company") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const service = String(data.get("service") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const details = [
      `Name: ${name}`,
      company && `Company: ${company}`,
      phone && `Phone: ${phone}`,
      service && `Service: ${service}`,
    ].filter(Boolean);
    const body = `${details.join("\n")}\n\n${message}`;

    const url =
      channel === "whatsapp"
        ? whatsappHref(whatsapp, `Hello Muthammal Engineering,\n\n${body}`)
        : `mailto:${email}?subject=${encodeURIComponent(`Project enquiry${service ? ` – ${service}` : ""}`)}&body=${encodeURIComponent(body)}`;

    if (channel === "whatsapp") {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      window.location.href = url;
    }
  };

  return (
    <form onSubmit={onSubmit} className="mt-12 grid gap-4 sm:grid-cols-2">
      <label className="grid gap-2 text-sm text-muted-foreground">
        Name *
        <input name="name" required autoComplete="name" className={fieldClass} placeholder="Your full name" />
      </label>
      <label className="grid gap-2 text-sm text-muted-foreground">
        Company
        <input name="company" autoComplete="organization" className={fieldClass} placeholder="Company name" />
      </label>
      <label className="grid gap-2 text-sm text-muted-foreground">
        Phone
        <input name="phone" type="tel" autoComplete="tel" className={fieldClass} placeholder="+91" />
      </label>
      <label className="grid gap-2 text-sm text-muted-foreground">
        Service
        <select name="service" className={fieldClass} defaultValue="">
          <option value="">General enquiry</option>
          {services.map((service) => (
            <option key={service} value={service}>
              {service}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-2 text-sm text-muted-foreground sm:col-span-2">
        Requirement *
        <textarea
          name="message"
          required
          rows={5}
          className={fieldClass}
          placeholder="Scope of work, location, timelines…"
        />
      </label>
      <fieldset className="flex flex-wrap items-center gap-3 sm:col-span-2">
        <legend className="sr-only">Send via</legend>
        {(["whatsapp", "email"] as const).map((option) => (
          <label
            key={option}
            className="flex cursor-pointer items-center gap-2 rounded-full border border-ink/15 px-4 py-2 text-sm has-checked:border-ink has-checked:bg-ink has-checked:text-white"
          >
            <input
              type="radio"
              name="channel"
              value={option}
              checked={channel === option}
              onChange={() => setChannel(option)}
              className="sr-only"
            />
            {option === "whatsapp" ? "Send via WhatsApp" : "Send via email"}
          </label>
        ))}
      </fieldset>
      <button
        type="submit"
        className="group mt-2 inline-flex h-12 items-center justify-center gap-3 rounded-[4px] bg-ink px-6 text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-brand sm:col-span-2 sm:justify-self-start"
      >
        Send enquiry
        <Send className="size-4 transition-transform group-hover:translate-x-1" />
      </button>
    </form>
  );
}
