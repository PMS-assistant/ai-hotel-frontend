import { formatTime } from '../../lib/utils';
import type { Message } from '../../stores/useChatStore';

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} style={{ color: 'var(--vzir-text)', fontWeight: 600 }}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

function renderMarkdown(text: string): React.ReactNode {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let listItems: React.ReactNode[] = [];
  let tableRows: string[][] = [];
  let inTable = false;

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="my-2 space-y-1 ml-1">
          {listItems}
        </ul>
      );
      listItems = [];
    }
  };

  const flushTable = () => {
    if (tableRows.length > 0) {
      const [header, , ...body] = tableRows;
      elements.push(
        <div key={`tbl-${elements.length}`} className="my-3 overflow-x-auto">
          <table className="text-xs w-full border-collapse">
            <thead>
              <tr>
                {header?.map((cell, ci) => (
                  <th
                    key={ci}
                    className="text-left py-2 px-3 border-b text-xs"
                    style={{ color: 'var(--vzir-text-2)', borderColor: 'var(--vzir-border)', fontWeight: 500 }}
                  >
                    {cell.trim()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {body.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      className="py-2 px-3 border-b text-xs"
                      style={{ color: 'var(--vzir-text-2)', borderColor: 'var(--vzir-border)' }}
                    >
                      {cell.trim()}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
      inTable = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('|')) {
      flushList();
      inTable = true;
      const cells = line.split('|').filter((_, ci) => ci > 0 && ci < line.split('|').length - 1);
      tableRows.push(cells);
      continue;
    } else if (inTable) {
      flushTable();
    }

    if (/^[\s|:-]+$/.test(line) && line.includes('-')) continue;

    if (line.startsWith('### ')) {
      flushList();
      elements.push(
        <h3 key={i} className="mt-3 mb-1 text-sm font-medium" style={{ color: 'var(--vzir-text)' }}>
          {renderInline(line.slice(4))}
        </h3>
      );
      continue;
    }
    if (line.startsWith('## ')) {
      flushList();
      elements.push(
        <h2 key={i} className="mt-4 mb-1 text-sm font-semibold" style={{ color: 'var(--vzir-text)' }}>
          {renderInline(line.slice(3))}
        </h2>
      );
      continue;
    }
    if (line.startsWith('**') && line.endsWith('**') && !line.slice(2, -2).includes('**')) {
      flushList();
      elements.push(
        <p key={i} className="mt-3 mb-0.5 text-sm font-semibold" style={{ color: 'var(--vzir-text)' }}>
          {line.slice(2, -2)}
        </p>
      );
      continue;
    }

    if (line.startsWith('- ')) {
      listItems.push(
        <li key={i} className="flex gap-2 text-sm" style={{ color: 'var(--vzir-text-2)' }}>
          <span style={{ color: 'var(--vzir-gold)', marginTop: '2px', flexShrink: 0 }}>·</span>
          <span>{renderInline(line.slice(2))}</span>
        </li>
      );
      continue;
    }

    if (/^\d+\.\s/.test(line)) {
      const num = line.match(/^(\d+)\.\s/)?.[1];
      listItems.push(
        <li key={i} className="flex gap-2 text-sm" style={{ color: 'var(--vzir-text-2)' }}>
          <span style={{ color: 'var(--vzir-gold)', fontWeight: 500, minWidth: '1rem', flexShrink: 0 }}>{num}.</span>
          <span>{renderInline(line.replace(/^\d+\.\s/, ''))}</span>
        </li>
      );
      continue;
    }

    if (line.trim() === '') {
      flushList();
      continue;
    }

    flushList();
    elements.push(
      <p key={i} className="text-sm leading-relaxed" style={{ color: 'var(--vzir-text-2)' }}>
        {renderInline(line)}
      </p>
    );
  }

  flushList();
  flushTable();
  return elements;
}

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end px-6 py-2">
        <div className="max-w-[72%]">
          <div
            className="px-4 py-3 rounded-2xl rounded-tr-sm text-sm leading-relaxed"
            style={{
              backgroundColor: 'var(--vzir-surface-2)',
              color: 'var(--vzir-text)',
              border: '1px solid var(--vzir-border-hover)',
            }}
          >
            {message.content}
          </div>
          <p className="text-right mt-1 text-xs" style={{ color: 'var(--vzir-text-3)' }}>
            {formatTime(message.timestamp)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start px-6 py-2">
      <div className="max-w-[80%]">
        {/* Vzir label */}
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold shrink-0"
            style={{ backgroundColor: 'var(--vzir-gold-glow)', color: 'var(--vzir-gold)', border: '1px solid var(--vzir-border-hover)' }}
          >
            V
          </div>
          <span className="text-xs font-medium" style={{ color: 'var(--vzir-text-3)', letterSpacing: '0.04em' }}>
            Vzir
          </span>
        </div>

        {/* Message content */}
        <div className="space-y-1">
          {renderMarkdown(message.content)}
        </div>

        <p className="mt-2 text-xs" style={{ color: 'var(--vzir-text-3)' }}>
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
}
