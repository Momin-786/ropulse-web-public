import type { Token, Tokens } from 'marked';
import { headingId, safeLink } from '@/lib/content.mjs';
import { manualImage } from '@/lib/manual-images.mjs';
import { ManualScreenshot } from './manual-screenshot';

export function Markdown({ tokens, review = false }: { tokens: Token[]; review?: boolean }) {
  return <>{tokens.map((token, index) => <MarkdownToken key={index} token={token} review={review} />)}</>;
}
function MarkdownToken({ token, review }: { token: Token; review: boolean }): React.ReactNode {
  const child = (tokens?: Token[]) => tokens ? <Markdown tokens={tokens} review={review} /> : null;
  switch (token.type) {
    case 'space': case 'html': case 'def': return null;
    case 'heading': {
      const heading = token as Tokens.Heading & { id?: string };
      if (heading.depth === 1) return null; // Article header owns the only H1.
      const Tag = `h${Math.min(heading.depth, 6)}` as 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
      const id = heading.id || headingId(heading.text);
      return <Tag id={id}><a className="heading-link" href={`#${id}`}>{child(heading.tokens)}</a></Tag>;
    }
    case 'paragraph': {
      const tokens = (token as Tokens.Paragraph).tokens;
      if (!tokens.some(item => item.type === 'image')) return <p>{child(tokens)}</p>;
      const blocks: React.ReactNode[] = []; let inline: Token[] = [];
      const flush = () => { if (inline.length) { blocks.push(<p key={blocks.length}>{child(inline)}</p>); inline = []; } };
      for (const item of tokens) {
        if (item.type === 'image') { flush(); blocks.push(<MarkdownToken key={blocks.length} token={item} review={review} />); }
        else inline.push(item);
      }
      flush(); return <>{blocks}</>;
    }
    case 'text': { const t = token as Tokens.Text; return t.tokens ? child(t.tokens) : t.text; }
    case 'escape': return (token as Tokens.Escape).text;
    case 'strong': return <strong>{child((token as Tokens.Strong).tokens)}</strong>;
    case 'em': return <em>{child((token as Tokens.Em).tokens)}</em>;
    case 'del': return <del>{child((token as Tokens.Del).tokens)}</del>;
    case 'codespan': return <code>{(token as Tokens.Codespan).text}</code>;
    case 'code': return <pre><code>{(token as Tokens.Code).text}</code></pre>;
    case 'br': return <br />;
    case 'hr': return <hr />;
    case 'blockquote': return <blockquote>{child((token as Tokens.Blockquote).tokens)}</blockquote>;
    case 'link': {
      const link = token as Tokens.Link;
      const href = safeLink(link.href, review);
      return href ? <a href={href} rel={href.startsWith('https:') ? 'noreferrer' : undefined}>{child(link.tokens)}</a> : child(link.tokens);
    }
    case 'image': {
      const image = token as Tokens.Image; const asset = manualImage(image.href);
      return asset ? <ManualScreenshot src={asset.file} alt={image.text} caption={image.title} width={asset.width} height={asset.height} callouts={asset.callouts} /> : <span>{image.text}</span>;
    }
    case 'list': {
      const list = token as Tokens.List;
      const items = list.items.map((item, i) => <li key={i}>{item.task ? <input type="checkbox" checked={Boolean(item.checked)} disabled aria-label="Checklist item" /> : null}{child(item.tokens)}</li>);
      return list.ordered ? <ol start={typeof list.start === 'number' ? list.start : undefined}>{items}</ol> : <ul>{items}</ul>;
    }
    case 'table': {
      const table = token as Tokens.Table;
      return <div className="table-scroll" role="region" aria-label="Guide reference table" tabIndex={0}><table><thead><tr>{table.header.map((cell, i) => <th key={i} scope="col">{child(cell.tokens)}</th>)}</tr></thead><tbody>{table.rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}>{child(cell.tokens)}</td>)}</tr>)}</tbody></table></div>;
    }
    default: return 'text' in token && typeof token.text === 'string' ? token.text : null;
  }
}
