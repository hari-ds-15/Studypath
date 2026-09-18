import React, { useState } from 'react';
import { Copy, Check, ExternalLink, Link as LinkIcon } from 'lucide-react';

const ChatMessageContent = ({ text = '' }) => {
  const [copiedCodeId, setCopiedCodeId] = useState(null);
  const [copiedLinkId, setCopiedLinkId] = useState(null);

  const copyCode = (codeText, id) => {
    if (!codeText) return;
    navigator.clipboard.writeText(codeText);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const copyLink = (e, url, id) => {
    e.stopPropagation();
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopiedLinkId(id);
    setTimeout(() => setCopiedLinkId(null), 2000);
  };

  const parseInline = (str, lineIndex) => {
    if (!str || typeof str !== 'string') return str || '';

    // Regex for:
    // 1. Markdown links: [text](url)
    // 2. Bold text: **text**
    // 3. Inline code: `text`
    // 4. Raw URLs: https?://[^\s]+
    // 5. LaTeX inline math: $...$
    const regex = /(\[[^\]]+\]\(https?:\/\/[^\)]+\)|\*\*[^*]+\*\*|`[^`]+`|\$[^$]+\$|https?:\/\/[^\s]+)/g;
    const parts = str.split(regex);

    return parts.map((part, index) => {
      if (!part) return null;

      const key = `${lineIndex}-${index}`;

      // Markdown Link: [Title](https://...)
      const mdLinkMatch = part.match(/^\[([^\]]+)\]\((https?:\/\/[^\)]+)\)$/);
      if (mdLinkMatch) {
        const linkText = mdLinkMatch[1];
        const linkUrl = mdLinkMatch[2];
        const isCopied = copiedLinkId === key;

        return (
          <span key={key} className="inline-flex items-center gap-1 mx-0.5 align-baseline">
            <a
              href={linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-semibold underline underline-offset-2 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
              title={`Open ${linkUrl}`}
            >
              <span>{linkText}</span>
              <ExternalLink className="w-3 h-3 inline-block shrink-0" />
            </a>
            <button
              type="button"
              onClick={(e) => copyLink(e, linkUrl, key)}
              className="inline-flex items-center justify-center p-0.5 rounded hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors cursor-pointer"
              title="Copy link address"
            >
              {isCopied ? <Check className="w-3 h-3 text-emerald-500" /> : <LinkIcon className="w-3 h-3" />}
            </button>
          </span>
        );
      }

      // Raw URL: https://...
      if (part.startsWith('http://') || part.startsWith('https://')) {
        const isCopied = copiedLinkId === key;
        return (
          <span key={key} className="inline-flex items-center gap-1 mx-0.5 align-baseline">
            <a
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-semibold underline underline-offset-2 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors break-all"
            >
              <span>{part}</span>
              <ExternalLink className="w-3 h-3 inline-block shrink-0" />
            </a>
            <button
              type="button"
              onClick={(e) => copyLink(e, part, key)}
              className="inline-flex items-center justify-center p-0.5 rounded hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors cursor-pointer"
              title="Copy link address"
            >
              {isCopied ? <Check className="w-3 h-3 text-emerald-500" /> : <LinkIcon className="w-3 h-3" />}
            </button>
          </span>
        );
      }

      // Bold: **text**
      if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
        return <strong key={key} className="font-bold text-stone-900 dark:text-white select-text">{part.slice(2, -2)}</strong>;
      }

      // Inline code: `text`
      if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
        return (
          <code key={key} className="px-1.5 py-0.5 rounded bg-stone-200 dark:bg-stone-800 text-indigo-700 dark:text-indigo-300 font-mono text-[11px] select-text">
            {part.slice(1, -1)}
          </code>
        );
      }

      // Inline LaTeX math: $...$
      if (part.startsWith('$') && part.endsWith('$') && part.length >= 2) {
        return (
          <span key={key} className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-900 dark:text-amber-200 font-mono text-xs font-semibold select-text inline-block">
            {part.slice(1, -1)}
          </span>
        );
      }

      // Regular text
      return <span key={key} className="select-text">{part}</span>;
    });
  };

  const safeText = typeof text === 'string' ? text : (typeof text === 'object' && text !== null ? JSON.stringify(text) : String(text || ''));
  const rawLines = safeText.split('\n');
  const elements = [];
  let inCodeBlock = false;
  let codeBlockContent = [];
  let codeLang = '';

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i];

    // Code block start / end
    if (line.startsWith('```')) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeLang = line.replace('```', '').trim() || 'code';
        codeBlockContent = [];
      } else {
        inCodeBlock = false;
        const codeText = codeBlockContent.join('\n');
        const codeKey = `code-${i}`;
        const isCopied = copiedCodeId === codeKey;

        elements.push(
          <div key={codeKey} className="my-3 rounded-2xl overflow-hidden border border-stone-700/60 bg-stone-950 font-mono text-xs shadow-xl select-text">
            <div className="flex items-center justify-between px-4 py-2 bg-stone-900 border-b border-stone-800 text-stone-400 text-[11px] select-none">
              <span className="font-semibold text-stone-300 uppercase text-[10px]">{codeLang}</span>
              <button
                type="button"
                onClick={() => copyCode(codeText, codeKey)}
                className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer"
                title="Copy entire code block"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="text-[10px] font-medium">{isCopied ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>
            <pre className="p-4 overflow-x-auto text-emerald-400 leading-relaxed select-text font-mono">
              <code>{codeText}</code>
            </pre>
          </div>
        );
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockContent.push(line);
      continue;
    }

    // Markdown Table parsing
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      const tableLines = [line];
      while (i + 1 < rawLines.length && rawLines[i + 1].trim().startsWith('|') && rawLines[i + 1].trim().endsWith('|')) {
        i++;
        tableLines.push(rawLines[i]);
      }

      const rows = tableLines
        .filter((tl) => !tl.includes('---'))
        .map((tl) => tl.split('|').slice(1, -1).map((c) => c.trim()));

      if (rows.length > 0) {
        const headerRow = rows[0];
        const bodyRows = rows.slice(1);

        elements.push(
          <div key={`tbl-${i}`} className="my-3 overflow-x-auto rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm">
            <table className="w-full text-xs text-left text-stone-700 dark:text-stone-300">
              <thead className="bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-bold border-b border-stone-200 dark:border-stone-700">
                <tr>
                  {headerRow.map((h, hIdx) => (
                    <th key={hIdx} className="px-3 py-2">{parseInline(h, `th-${i}-${hIdx}`)}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
                {bodyRows.map((r, rIdx) => (
                  <tr key={rIdx} className="hover:bg-stone-50 dark:hover:bg-stone-850 transition-colors">
                    {r.map((cell, cIdx) => (
                      <td key={cIdx} className="px-3 py-2">{parseInline(cell, `td-${i}-${rIdx}-${cIdx}`)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        continue;
      }
    }

    // Block Math LaTeX formulas (\[ ... \] or $$ ... $$)
    if (line.trim().startsWith('\\[') || line.trim().startsWith('$$')) {
      elements.push(
        <div key={i} className="my-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center font-mono text-xs font-semibold text-amber-900 dark:text-amber-200 select-text overflow-x-auto">
          {line.replace(/\\[\[\]]/g, '').replace(/\$\$/g, '').trim()}
        </div>
      );
      continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      elements.push(
        <blockquote key={i} className="my-2 pl-3 py-1 border-l-3 border-amber-500 bg-amber-50 dark:bg-amber-500/10 rounded-r-xl text-stone-800 dark:text-stone-200 text-xs italic">
          {parseInline(line.replace('> ', ''), i)}
        </blockquote>
      );
      continue;
    }

    // Headers
    if (line.startsWith('#### ')) {
      elements.push(
        <h5 key={i} className="text-xs font-bold text-stone-900 dark:text-white mt-2.5 mb-1 select-text">
          {parseInline(line.replace('#### ', ''), i)}
        </h5>
      );
      continue;
    }
    if (line.startsWith('### ')) {
      elements.push(
        <h4 key={i} className="text-sm font-bold text-stone-900 dark:text-white mt-3 mb-1.5 select-text flex items-center gap-1.5">
          {parseInline(line.replace('### ', ''), i)}
        </h4>
      );
      continue;
    }
    if (line.startsWith('## ')) {
      elements.push(
        <h3 key={i} className="text-base font-bold text-stone-900 dark:text-white mt-4 mb-2 select-text">
          {parseInline(line.replace('## ', ''), i)}
        </h3>
      );
      continue;
    }

    // Bullets (e.g. * item or - item)
    if (line.startsWith('* ') || line.startsWith('- ')) {
      const itemText = line.substring(2);
      elements.push(
        <div key={i} className="flex items-start gap-2 my-1 pl-1 select-text">
          <span className="text-amber-500 dark:text-amber-400 font-bold leading-5 shrink-0 select-none">•</span>
          <span className="leading-relaxed select-text">{parseInline(itemText, i)}</span>
        </div>
      );
      continue;
    }

    // Numbered lists (e.g. 1. 2.)
    const numMatch = line.match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      elements.push(
        <div key={i} className="flex items-start gap-2 my-1 pl-1 select-text">
          <span className="text-amber-600 dark:text-amber-400 font-bold text-xs leading-5 shrink-0 select-none">{numMatch[1]}.</span>
          <span className="leading-relaxed select-text">{parseInline(numMatch[2], i)}</span>
        </div>
      );
      continue;
    }

    // Empty line
    if (!line.trim()) {
      elements.push(<div key={i} className="h-1.5 select-text" />);
      continue;
    }

    // Normal paragraph
    elements.push(
      <p key={i} className="my-1 leading-relaxed select-text">
        {parseInline(line, i)}
      </p>
    );
  }

  return (
    <div className="select-text space-y-0.5 leading-relaxed break-words">
      {elements}
    </div>
  );
};

export default ChatMessageContent;
