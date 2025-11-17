import React from "react";

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderMarkdown(md) {
  const escaped = escapeHtml(md);

  // Bold **text**
  let html = escaped.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  // Convert lines into paragraphs and lists
  const lines = html.split(/\r?\n/);
  const out = [];
  let listBuffer = [];

  const flushList = () => {
    if (listBuffer.length) {
      out.push(`<ul class="list-disc pl-5 space-y-1">${listBuffer
        .map((li) => `<li>${li}</li>`)
        .join("")}</ul>`);
      listBuffer = [];
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      flushList();
      out.push("<div class=\"h-2\"></div>");
      continue;
    }
    const liMatch = trimmed.match(/^-\s+(.*)$/);
    if (liMatch) {
      listBuffer.push(liMatch[1]);
      continue;
    }
    flushList();
    out.push(`<p>${trimmed}</p>`);
  }
  flushList();

  return out.join("");
}

export default function Markdown({ text }) {
  const html = renderMarkdown(text || "");
  return <div className="prose prose-invert max-w-none text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: html }} />;
}
