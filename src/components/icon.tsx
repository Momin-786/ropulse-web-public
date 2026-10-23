export function Icon({ name, size = 24 }: { name: string; size?: number }) {
  const paths: Record<string, React.ReactNode> = {
    coffee: <><path d="M4 8h12v7a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8Zm12 1h2a3 3 0 0 1 0 6h-2M2 22h17M7 2v3m4-3v3" /></>,
    'quick-service': <><path d="M3 12h18M4 10a8 8 0 0 1 16 0M3 16h18M5 19h14M9 3h6" /><path d="m17 2 2 2-2 2" /></>,
    dining: <><circle cx="12" cy="12" r="6" /><path d="M3 3v6m-2-6v4a2 2 0 0 0 4 0V3M3 9v12M22 3c-3 3-3 8 0 8V3Zm0 8v10" /></>,
    branches: <><rect x="8" y="2" width="8" height="6" rx="1" /><rect x="2" y="16" width="8" height="6" rx="1" /><rect x="14" y="16" width="8" height="6" rx="1" /><path d="M12 8v4M6 16v-4h12v4" /></>,
    store: <><path d="M3 9h18l-2-6H5L3 9Zm0 0v2a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0V9M4 14v7h16v-7M9 21v-6h6v6" /></>,
    arrow: <><path d="M5 12h14m-6-6 6 6-6 6" /></>,
    terminal: <><rect x="3" y="3" width="18" height="13" rx="2" /><path d="M8 21h8m-4-5v5M7 7h5m-5 4h9" /></>,
    book: <><path d="M12 5c-3-2-7-2-10-1v15c3-1 7-1 10 1 3-2 7-2 10-1V4c-3-1-7-1-10 1Zm0 0v15" /></>,
    chart: <><path d="M4 3v17h17M8 15v-4m5 4V7m5 8V4" /></>,
    box: <><path d="m3 7 9-5 9 5v10l-9 5-9-5V7Zm0 0 9 5 9-5M12 12v10M7.5 4.5l9 5" /></>,
    ticket: <><path d="M4 3h16v18l-4-2-4 2-4-2-4 2V3Zm4 5h8m-8 4h8" /></>,
    team: <><circle cx="9" cy="7" r="3" /><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 4a3 3 0 0 1 0 6m2 5a5 5 0 0 1 3 5" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></>,
    download: <><path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5" /></>,
    shield: <><path d="m12 2 9 4v6c0 5-9 10-9 10S3 17 3 12V6l9-4Z" /><path d="m8 12 3 3 5-6" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] || paths.arrow}</svg>;
}
