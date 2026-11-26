'use client';

import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';

type CredentialStatus = { pinSet: boolean; adminPasswordSet: boolean };
type Request = <T>(path: string, options?: RequestInit) => Promise<T>;

export function PinLengthPicker() {
  return <label>Register PIN length
    <select name="pinLength" defaultValue="">
      <option value="">Random</option>
      <option value="4">4 digits</option>
      <option value="5">5 digits</option>
      <option value="6">6 digits</option>
    </select>
  </label>;
}

export function BackOfficePasswordField({ required = false }: { required?: boolean }) {
  const [visible, setVisible] = useState(false);
  return <div className="owner-credential-fields">
    <label>Back Office password
      <input name="adminPassword" type={visible ? 'text' : 'password'}
        autoComplete="new-password" minLength={12} maxLength={72} required={required} />
    </label>
    <button className="text-button" type="button" onClick={() => setVisible(!visible)}>
      {visible ? 'Hide Back Office password' : 'Show Back Office password'}
    </button>
  </div>;
}

export function GeneratedRegisterPin({ pin }: { pin: string }) {
  return <div className="owner-pairing-code" role="status">
    <strong>Your new Register PIN</strong>
    <code>{pin}</code>
    <p>Save this PIN now. RoPulse shows it once. Use it on the Register sign-in screen.</p>
  </div>;
}
export function OwnerAppCredentials({ tenantPath, request }: { tenantPath: string; request: Request }) {
  const [status, setStatus] = useState<CredentialStatus>();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(0);
  const [rotatePin, setRotatePin] = useState(false);
  const [generatedPin, setGeneratedPin] = useState('');
  const path = tenantPath + '/owner-credentials';

  useEffect(() => {
    const controller = new AbortController();
    request<CredentialStatus>(path, { signal: controller.signal }).then(result => {
      if (!controller.signal.aborted) setStatus(result);
    }).catch(error => {
      if (!controller.signal.aborted) setError(error.message);
    });
    return () => controller.abort();
  }, [path, request, saved]);

  async function change(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = new FormData(event.currentTarget);
    const pinLength = form.get('pinLength');
    const adminPassword = form.get('adminPassword');
    setError('');
    setMessage('');
    if (!rotatePin && !adminPassword) {
      setError('Choose to generate a new PIN, enter a new Back Office password, or do both.');
      return;
    }
    setBusy(true);
    try {
      const result = await request<{ pin: string } | undefined>(path, { method: 'POST', body: JSON.stringify({
        websitePassword: form.get('websitePassword'),
        regeneratePin: rotatePin,
        ...(rotatePin && pinLength ? { pinLength: Number(pinLength) } : {}),
        ...(adminPassword ? { adminPassword } : {}),
      }) });
      setGeneratedPin(result?.pin ?? '');
      setRotatePin(false);
      setSaved(value => value + 1);
      setMessage('Credentials updated. Sign in again on your RoPulse devices with the new credentials.');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Credentials could not be updated.');
    } finally {
      setBusy(false);
    }
  }

  return <details className="owner-sign-in-credentials">
    <summary>Register and Back Office sign-in</summary>
    {status && <ul className="owner-checklist">
      <li><span>Register PIN</span><strong>{status.pinSet ? 'Set' : 'Pending'}</strong></li>
      <li><span>Back Office password</span><strong>{status.adminPasswordSet ? 'Set' : 'Pending'}</strong></li>
    </ul>}
    <p>Choose the credentials you want to update, then confirm with your website password.</p>
    {generatedPin ? <>
      <GeneratedRegisterPin pin={generatedPin} />
      <button className="text-button" type="button" onClick={() => setGeneratedPin('')}>I saved my PIN</button>
    </> : <form onSubmit={change} className="owner-form" key={saved}>
      <fieldset disabled={busy}>
        <label className="check-field"><input type="checkbox" checked={rotatePin}
          onChange={event => setRotatePin(event.target.checked)} />Generate a new Register PIN</label>
        {rotatePin && <PinLengthPicker />}
        <BackOfficePasswordField />
        <label>Confirm website password
          <input name="websitePassword" type="password" autoComplete="current-password" required maxLength={256} />
        </label>
      </fieldset>
      <button className="button button-small" disabled={busy} type="submit">{busy ? 'Updating…' : 'Update sign-in credentials'}</button>
    </form>}
    {message && <p className="form-message" role="status">{message}</p>}
    {error && <p className="form-message" role="alert">{error}</p>}
  </details>;
}
