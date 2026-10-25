import { createElement, type CSSProperties, type ReactNode } from "react";

interface HtmlContentProps {
  html?: string | null;
  className?: string;
}

const allowedTags = new Set([
  "a",
  "b",
  "blockquote",
  "br",
  "caption",
  "code",
  "dd",
  "del",
  "div",
  "dl",
  "dt",
  "em",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hr",
  "i",
  "li",
  "mark",
  "ol",
  "p",
  "pre",
  "s",
  "small",
  "span",
  "strong",
  "sub",
  "sup",
  "table",
  "tbody",
  "td",
  "tfoot",
  "th",
  "thead",
  "tr",
  "u",
  "ul",
]);

const discardedTags = new Set([
  "audio",
  "embed",
  "form",
  "iframe",
  "input",
  "object",
  "script",
  "select",
  "style",
  "svg",
  "template",
  "textarea",
  "video",
]);

const blockClasses: Record<string, string> = {
  blockquote: "my-4 border-l-2 pl-4 italic",
  h1: "my-4 text-3xl font-semibold",
  h2: "my-4 text-2xl font-semibold",
  h3: "my-3 text-xl font-semibold",
  h4: "my-3 text-lg font-semibold",
  h5: "my-2 text-base font-semibold",
  h6: "my-2 text-sm font-semibold",
  hr: "my-4 border-border",
  li: "my-1",
  ol: "my-3 list-decimal space-y-1 pl-6",
  p: "my-3 whitespace-pre-wrap leading-7",
  pre: "my-3 overflow-x-auto rounded-md bg-muted p-3",
  table: "my-4 w-full border-collapse",
  td: "border border-border p-2",
  th: "border border-border p-2 text-left font-semibold",
  ul: "my-3 list-disc space-y-1 pl-6",
};

function isAllowedTextAlign(
  value: string,
): value is NonNullable<CSSProperties["textAlign"]> {
  return ["left", "right", "center", "justify", "start", "end"].includes(
    value,
  );
}

function isSafeColor(value: string): boolean {
  return (
    /^(#[\da-f]{3,8}|(?:rgb|hsl)a?\([\d.%\s,/-]+\)|[a-z]{1,20})$/i.test(
      value,
    ) && !/url|var|expression/i.test(value)
  );
}

function getSafeStyle(element: HTMLElement): CSSProperties | undefined {
  const style = element.style;
  const safeStyle: CSSProperties = {};

  if (isAllowedTextAlign(style.textAlign)) {
    safeStyle.textAlign = style.textAlign;
  }

  if (style.color && isSafeColor(style.color)) {
    safeStyle.color = style.color;
  }

  if (/^(normal|bold|bolder|lighter|[1-9]00)$/.test(style.fontWeight)) {
    safeStyle.fontWeight = style.fontWeight;
  }

  if (["normal", "italic", "oblique"].includes(style.fontStyle)) {
    safeStyle.fontStyle = style.fontStyle;
  }

  if (/^(none|underline|overline|line-through)$/.test(style.textDecorationLine)) {
    safeStyle.textDecorationLine = style.textDecorationLine;
  }

  if (/^(?:\d+(?:\.\d+)?|\d+(?:\.\d+)?(?:px|rem|em|%|pt))$/.test(style.fontSize)) {
    safeStyle.fontSize = style.fontSize;
  }

  if (/^(?:\d+(?:\.\d+)?|\d+(?:\.\d+)?(?:px|rem|em|%))$/.test(style.lineHeight)) {
    safeStyle.lineHeight = style.lineHeight;
  }

  return Object.keys(safeStyle).length > 0 ? safeStyle : undefined;
}

function getSafeHref(value: string): string | undefined {
  const href = value.trim();

  if (
    !href ||
    href.includes("\\") ||
    Array.from(href).some((character) => character.charCodeAt(0) < 32)
  ) {
    return undefined;
  }

  try {
    const protocol = new URL(href, "https://website.invalid").protocol;

    return ["http:", "https:", "mailto:", "tel:"].includes(protocol)
      ? href
      : undefined;
  } catch {
    return undefined;
  }
}

function getProps(element: HTMLElement, tag: string) {
  const props: Record<string, string | number | CSSProperties> = {};
  const className = blockClasses[tag];

  if (className) {
    props.className = className;
  }

  const style = getSafeStyle(element);
  if (style) {
    props.style = style;
  }

  const title = element.getAttribute("title");
  if (title) {
    props.title = title;
  }

  if (tag === "a") {
    const href = element.getAttribute("href");
    const safeHref = href ? getSafeHref(href) : undefined;

    if (safeHref) {
      props.href = safeHref;
    }

    const target = element.getAttribute("target");
    if (target === "_blank" || target === "_self") {
      props.target = target;

      if (target === "_blank") {
        props.rel = "noopener noreferrer";
      }
    }
  }

  if (tag === "ol") {
    const start = Number(element.getAttribute("start"));
    if (Number.isSafeInteger(start) && start > 0) {
      props.start = start;
    }
  }

  if (tag === "td" || tag === "th") {
    for (const attribute of ["colspan", "rowspan"] as const) {
      const value = Number(element.getAttribute(attribute));
      if (Number.isSafeInteger(value) && value > 0) {
        props[attribute === "colspan" ? "colSpan" : "rowSpan"] = value;
      }
    }
  }

  return props;
}

function renderChildren(parent: Node): ReactNode[] {
  return Array.from(parent.childNodes).map((child, index) => (
    <HtmlNode key={index} node={child} />
  ));
}

function getSafeText(value: string | null): string | null {
  return value?.replace(/<\/?[a-z][a-z0-9-]*(?:\s[^<>]*)?>?/gi, "") ?? null;
}

function HtmlNode({ node }: { node: Node }): ReactNode {
  if (node.nodeType === Node.TEXT_NODE) {
    return getSafeText(node.textContent);
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return null;
  }

  const element = node as HTMLElement;
  const tag = element.tagName.toLowerCase();

  if (discardedTags.has(tag)) {
    return null;
  }

  const children = renderChildren(element);

  if (!allowedTags.has(tag)) {
    return children;
  }

  return createElement(tag, getProps(element, tag), ...children);
}

export function HtmlContent({ html, className }: HtmlContentProps) {
  if (!html?.trim()) {
    return null;
  }

  if (typeof DOMParser === "undefined") {
    return <span className={className}>{html.replace(/<[^>]*>/g, " ")}</span>;
  }

  const document = new DOMParser().parseFromString(html, "text/html");
  const content = renderChildren(document.body);

  if (content.length === 0) {
    return null;
  }

  return className ? (
    <div className={className}>{content}</div>
  ) : (
    <>{content}</>
  );
}
