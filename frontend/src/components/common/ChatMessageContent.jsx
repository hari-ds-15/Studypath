import React, { useState } from 'react';
import { Copy, Check, ExternalLink, Link as LinkIcon } from 'lucide-react';

const ChatMessageContent = ({ text }) => {
  const [copiedCodeId, setCopiedCodeId] = useState(null);
  const [copiedLinkId, setCopiedLinkId] = useState(null);

  const copyCode = (codeText, id) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const copyLink = (e, url, id) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedLinkId(id);
    setTimeout(() => setCopiedLinkId(null), 2000);
  };

  const parseInline = (str, lineIndex) => {
    // Regex for:
    // 1. Markdown links: [text](url)
    // 2. Bold text: **text**
    // 3. Inline code: `text`
    // 4. Raw URLs: https?://[^\s]+
    const regex = /(\[[^\]]+\]\(https?:\/\/[^\)]+\)|\*\*.*?\*\*|`.*?`|https?:\/\/[^\s]+)/g;
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
              className="inline-flex items-center justify-center p-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors cursor-pointer"
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
              className="inline-flex items-center justify-center p-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors cursor-pointer"
              title="Copy link address"
            >
              {isCopied ? <Check className="w-3 h-3 text-emerald-500" /> : <LinkIcon className="w-3 h-3" />}
            </button>
          </span>
        );
      }

      // Bold: **text**
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={key} className="font-bold text-slate-900 dark:text-white select-text">{part.slice(2, -2)}</strong>;
      }

      // Inline code: `text`
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={key} className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 font-mono text-[11px] select-text">
            {part.slice(1, -1)}
          </code>
        );
      }

      // Regular text
      return <span key={key} className="select-text">{part}</span>;
    });
  };

  const lines = text.split('\n');
  const elements = [];
  let inCodeBlock = false;
  let codeBlockContent = [];
  let codeLang = '';

  lines.forEach((line, i) => {
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
          <div key={codeKey} className="my-3 rounded-2xl overflow-hidden border border-slate-700/60 bg-slate-950 font-mono text-xs shadow-xl select-text">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-slate-400 text-[11px] select-none">
              <span className="font-semibold text-slate-300 uppercase text-[10px]">{codeLang}</span>
              <button
                type="button"
                onClick={() => copyCode(codeText, codeKey)}
                className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
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
      return;
    }

    if (inCodeBlock) {
      codeBlockContent.push(line);
      return;
    }

    // Headers
    if (line.startsWith('### ')) {
      elements.push(
        <h4 key={i} className="text-sm font-bold text-slate-900 dark:text-white mt-3 mb-1.5 select-text flex items-center gap-1.5">
          {parseInline(line.replace('### ', ''), i)}
        </h4>
      );
      return;
    }
    if (line.startsWith('## ')) {
      elements.push(
        <h3 key={i} className="text-base font-bold text-slate-900 dark:text-white mt-4 mb-2 select-text">
          {parseInline(line.replace('## ', ''), i)}
        </h3>
      );
      return;
    }

    // Bullets (e.g. * item or - item)
    if (line.startsWith('* ') || line.startsWith('- ')) {
      const itemText = line.substring(2);
      elements.push(
        <div key={i} className="flex items-start gap-2 my-1 pl-1 select-text">
          <span className="text-indigo-500 dark:text-indigo-400 font-bold leading-5 shrink-0 select-none">•</span>
          <span className="leading-relaxed select-text">{parseInline(itemText, i)}</span>
        </div>
      );
      return;
    }

    // Numbered lists (e.g. 1. 2.)
    const numMatch = line.match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      elements.push(
        <div key={i} className="flex items-start gap-2 my-1 pl-1 select-text">
          <span className="text-indigo-600 dark:text-indigo-400 font-bold text-xs leading-5 shrink-0 select-none">{numMatch[1]}.</span>
          <span className="leading-relaxed select-text">{parseInline(numMatch[2], i)}</span>
        </div>
      );
      return;
    }

    // Empty line
    if (!line.trim()) {
      elements.push(<div key={i} className="h-2 select-text" />);
      return;
    }

    // Normal paragraph
    elements.push(
      <p key={i} className="my-1 leading-relaxed select-text">
        {parseInline(line, i)}
      </p>
    );
  });

  return (
    <div className="select-text space-y-0.5 leading-relaxed break-words">
      {elements}
    </div>
  );
};

export default ChatMessageContent;
