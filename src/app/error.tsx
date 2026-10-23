'use client';
export default function ErrorPage({ reset }: { reset: () => void }) { return <section className="container empty-page"><h1>This page couldn’t load.</h1><p>Please try again. If the problem continues, open support from the navigation.</p><button className="button" onClick={reset}>Try again</button></section>; }
