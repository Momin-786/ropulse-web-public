/**
 * @param {Array<{slug:string,title:string,group:string,description:string,headings:string,text:string,status?:string}>} documents
 * @param {string} query
 * @returns {Array<{slug:string,title:string,group:string,description:string,headings:string,text:string,status?:string,score:number,snippet:string}>}
 */
export function searchArticles(documents, query) {
  const terms = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean).slice(0, 12);
  if (!terms.length) return documents.map(item => ({ ...item, score: 0, snippet: item.description }));
  return documents.map(item => {
    const title = item.title.toLocaleLowerCase();
    const headings = item.headings.toLocaleLowerCase();
    const text = item.text.toLocaleLowerCase();
    if (!terms.every(term => `${title} ${headings} ${text}`.includes(term))) return null;
    const score = terms.reduce((n, term) => n + (title.includes(term) ? 12 : 0) + (headings.includes(term) ? 5 : 0) + (text.includes(term) ? 1 : 0), 0);
    const offset = Math.max(0, text.indexOf(terms[0]) - 50);
    const snippet = `${offset ? '…' : ''}${item.text.slice(offset, offset + 170)}${item.text.length > offset + 170 ? '…' : ''}`;
    return { ...item, score, snippet };
  }).filter(Boolean).sort((a, b) => b.score - a.score);
}
