'use client';
import { useId, useRef } from 'react';
import { Icon } from './icon';
import { AnnotatedScreen, ScreenInstructions, type ScreenCallout } from './annotated-screen';
export function ManualScreenshot({ src, alt, caption, width, height, callouts = [] }: { src: string; alt: string; caption?: string | null; width: number; height: number; callouts?: ScreenCallout[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const id = useId();
  return <figure className={`manual-screenshot${height > width ? ' is-portrait' : ''}`}>
    <button ref={trigger} type="button" className="screenshot-trigger" aria-label={`Enlarge: ${alt}`} aria-haspopup="dialog" aria-controls={id} onClick={() => dialog.current?.showModal()}>
      <AnnotatedScreen {...{ src, alt, width, height, callouts }} lazy />
      <span className="screenshot-expand"><Icon name="search" size={17} /> Enlarge screenshot</span>
    </button>
    <dialog ref={dialog} id={id} aria-labelledby={`${id}-title`} className={`screenshot-dialog${height > width ? ' is-portrait' : ''}`} onClose={() => trigger.current?.focus({ preventScroll: true })} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
      <div className="dialog-surface">
        <div className="screenshot-toolbar"><p id={`${id}-title`}>{alt}</p><button type="button" onClick={() => dialog.current?.close()} aria-label="Close screenshot">Close <span aria-hidden="true">×</span></button></div>
        <AnnotatedScreen {...{ src, alt, width, height, callouts }} />
        <ScreenInstructions callouts={callouts} />
        <div className="screenshot-dialog-footer"><span>Demonstration data · guidance arrows added · verify your installed release.</span><a href={src} target="_blank" rel="noopener noreferrer">Open original image <span className="sr-only">in a new tab</span> ↗</a></div>
      </div>
    </dialog>
    <figcaption>
      <strong>{caption || alt}</strong>
      <span>Actual app interface · sample data{callouts.length ? ' · numbered guidance added' : ''}. Select the image to enlarge.</span>
      <ScreenInstructions callouts={callouts} />
      <a href={src} target="_blank" rel="noopener noreferrer">View original image <span className="sr-only">in a new tab</span> ↗</a>
    </figcaption>
  </figure>;
}
