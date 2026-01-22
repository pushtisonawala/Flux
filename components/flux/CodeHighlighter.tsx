'use client';

import React from "react"

interface CodeHighlighterProps {
  code: string;
  language: 'json' | 'html' | 'text';
}

export function CodeHighlighter({ code, language }: CodeHighlighterProps) {
  if (language === 'text') {
    return (
      <pre className="w-full h-full p-4 bg-slate-900 text-slate-100 font-mono text-sm overflow-auto">
        {code}
      </pre>
    );
  }

  if (language === 'json') {
    const highlighted = highlightJSON(code);
    return (
      <pre className="w-full h-full p-4 bg-slate-900 text-slate-100 font-mono text-sm overflow-auto">
        {highlighted}
      </pre>
    );
  }

  if (language === 'html') {
    const highlighted = highlightHTML(code);
    return (
      <pre className="w-full h-full p-4 bg-slate-900 text-slate-100 font-mono text-sm overflow-auto">
        {highlighted}
      </pre>
    );
  }

  return <pre className="w-full h-full p-4 bg-slate-900 text-slate-100 font-mono text-sm">{code}</pre>;
}

function highlightJSON(code: string): React.ReactNode {
  const tokens: React.ReactNode[] = [];
  let i = 0;

  while (i < code.length) {
    if (code[i] === '"') {
      // String
      let j = i + 1;
      while (j < code.length && code[j] !== '"') {
        if (code[j] === '\\') j++;
        j++;
      }
      j++;
      const value = code.slice(i, j);
      const isKey = code.slice(j).trimStart().startsWith(':');
      tokens.push(
        <span key={i} className={isKey ? 'text-blue-400' : 'text-green-400'}>
          {value}
        </span>
      );
      i = j;
    } else if (code.slice(i, i + 4) === 'null' || code.slice(i, i + 4) === 'true' || code.slice(i, i + 5) === 'false') {
      const match = code.slice(i).match(/^(null|true|false)/);
      if (match) {
        tokens.push(
          <span key={i} className="text-yellow-400">
            {match[0]}
          </span>
        );
        i += match[0].length;
      }
    } else if (/\d/.test(code[i])) {
      // Number
      let j = i;
      while (j < code.length && /[\d.-]/.test(code[j])) j++;
      tokens.push(
        <span key={i} className="text-cyan-400">
          {code.slice(i, j)}
        </span>
      );
      i = j;
    } else if (code[i] === '{' || code[i] === '}' || code[i] === '[' || code[i] === ']' || code[i] === ':' || code[i] === ',') {
      tokens.push(
        <span key={i} className="text-gray-300">
          {code[i]}
        </span>
      );
      i++;
    } else {
      tokens.push(code[i]);
      i++;
    }
  }

  return tokens;
}

function highlightHTML(code: string): React.ReactNode {
  const tokens: React.ReactNode[] = [];
  let i = 0;

  while (i < code.length) {
    if (code[i] === '<') {
      // Tag
      let j = i + 1;
      while (j < code.length && code[j] !== '>') j++;
      j++;
      const tag = code.slice(i, j);
      tokens.push(
        <span key={i} className="text-red-400">
          {tag}
        </span>
      );
      i = j;
    } else if (code[i] === '"') {
      // Attribute value
      let j = i + 1;
      while (j < code.length && code[j] !== '"') {
        if (code[j] === '\\') j++;
        j++;
      }
      j++;
      tokens.push(
        <span key={i} className="text-green-400">
          {code.slice(i, j)}
        </span>
      );
      i = j;
    } else {
      tokens.push(code[i]);
      i++;
    }
  }

  return tokens;
}
