'use client';

import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';

export type OwnerWorkspace = { tenantId: string; workspaceCode: string; displayName: string };
export type RegisterLicensing = {
  branches: { branchId: string; name: string }[];
  devices: { deviceId: string; branchId: string; name: string; platform: string; status: string }[];
  entitlement: { terminalSlotCount: number; occupiedTerminalCount: number };
  riskStatus: { pairingRestricted: boolean };
};

type Readiness = { ready: boolean; prerequisites: Record<string, boolean> };
type Pairing = { code: string; expiresAt: string; branchId: string };
type Request = <T>(path: string, options?: RequestInit) => Promise<T>;

const checks = {
  subscriptionActive: 'Active subscription or pilot',
  businessIdentityConfirmed: 'Business identity confirmed',
  receiptIdentityConfigured: 'Receipt identity configured',
  taxReviewed: 'Tax configuration reviewed',
  branchConfigured: 'Branch configured',
  productExists: 'At least one product created',
  terminalSlotLicensed: 'Register slot licensed',
  registerPaired: 'Register paired',
};

export function OwnerSetup({ workspace, request, onManage }: {
  workspace: OwnerWorkspace; request: Request; onManage: () => void;
}) {
  const [readiness, setReadiness] = useState<Readiness>();
  const [revision, setRevision] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(true);
  const path = 'subscriber/tenants/' + encodeURIComponent(workspace.tenantId);

  useEffect(() => {
    const controller = new AbortController();
    request<Readiness>(path + '/readiness', { signal: controller.signal }).then(result => {
      if (!controller.signal.aborted) setReadiness(result);
    }).catch(error => {
      if (!controller.signal.aborted) setError(error.message);
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false);
    });
    return () => controller.abort();
  }, [path, request, revision]);

  function refresh() {
    setError('');
    setLoading(true);
    setRevision(value => value + 1);
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || loading) return;
    const form = new FormData(event.currentTarget);
    setBusy(true);
    setError('');
    setNotice('');
    try {
      await request<void>(path + '/owner-setup', {
        method: 'POST',
        body: JSON.stringify({
          legalNameConfirmed: form.has('legalNameConfirmed'),
          displayNameConfirmed: form.has('displayNameConfirmed'),
          receiptIdentityConfigured: form.has('receiptIdentityConfigured'),
          taxReviewed: form.has('taxReviewed'),
          policiesVersion: '2026-09',
        }),
      });
      setNotice('Setup confirmations saved.');
      refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Setup could not be saved.');
    } finally {
      setBusy(false);
    }
  }

  const prerequisites = readiness?.prerequisites;
  const confirmed = prerequisites?.businessIdentityConfirmed && prerequisites.receiptIdentityConfigured && prerequisites.taxReviewed;
  return <section className="owner-panel" aria-label="Workspace setup">
    <h4>{readiness?.ready ? 'Workspace is ready' : 'Workspace setup'}</h4>
    {loading && <p role="status">Checking workspace setup…</p>}
    {error && <p className="form-message" role="alert">{error}</p>}
    {notice && <p className="form-message" role="status">{notice}</p>}
    {!loading && prerequisites && <>
      <ul className="owner-checklist">
        {Object.entries(checks).map(([key, label]) => (
          <li key={key}><span>{label}</span><strong>{prerequisites[key] ? 'Done' : 'Pending'}</strong></li>
        ))}
      </ul>
      {!confirmed && <form className="owner-form" onSubmit={save}>
        <fieldset disabled={busy}>
          <legend>Confirm your setup</legend>
          <p>Review business details, receipt settings and taxes in Back Office before confirming them here.</p>
          <label className="check-field"><input type="checkbox" name="legalNameConfirmed" required defaultChecked={prerequisites.businessIdentityConfirmed} />Legal business name is correct</label>
          <label className="check-field"><input type="checkbox" name="displayNameConfirmed" required defaultChecked={prerequisites.businessIdentityConfirmed} />Business display name is correct</label>
          <label className="check-field"><input type="checkbox" name="receiptIdentityConfigured" required defaultChecked={prerequisites.receiptIdentityConfigured} />Receipt identity is configured</label>
          <label className="check-field"><input type="checkbox" name="taxReviewed" required defaultChecked={prerequisites.taxReviewed} />Tax settings have been reviewed</label>
        </fieldset>
        <button type="submit" className="button button-small" disabled={busy}>{busy ? 'Saving…' : 'Save setup confirmations'}</button>
      </form>}
    </>}
    <div className="owner-actions">
      <button type="button" className="text-button" disabled={loading || busy} onClick={refresh}>Refresh setup status</button>
      <button type="button" className="text-button" onClick={onManage}>Manage Registers</button>
    </div>
  </section>;
}

export function ManageRegisters({ workspace, licensing, request, reload }: {
  workspace: OwnerWorkspace;
  licensing?: RegisterLicensing;
  request: Request;
  reload: () => Promise<void>;
}) {
  const [selection, setSelection] = useState('');
  const [pairing, setPairing] = useState<Pairing>();
  const [expired, setExpired] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const branches = licensing?.branches;
  const branchId = branches?.some(branch => branch.branchId === selection) ? selection : branches?.[0]?.branchId;
  const restricted = licensing?.riskStatus?.pairingRestricted;
  const entitlement = licensing?.entitlement;

  useEffect(() => {
    if (!pairing) return;
    const timer = window.setTimeout(() => {
      setPairing(undefined);
      setExpired(true);
    }, Math.max(0, Date.parse(pairing.expiresAt) - Date.now()));
    return () => window.clearTimeout(timer);
  }, [pairing]);

  async function pair(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!branchId || restricted || busy || pairing) return;
    setBusy(true);
    setError('');
    setExpired(false);
    try {
      const base = 'subscriber/tenants/' + encodeURIComponent(workspace.tenantId) + '/licensing';
      const result = await request<Pairing>(base + '/branches/' + encodeURIComponent(branchId) + '/pairing-sessions', { method: 'POST' });
      if (!result.code || result.branchId !== branchId || !Number.isFinite(Date.parse(result.expiresAt))) {
        throw new Error('The Register code could not be displayed. Refresh the Register list before trying again.');
      }
      setPairing(result);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'A pairing code could not be created.');
    } finally {
      setBusy(false);
    }
  }

  return <section className="owner-panel" aria-label="Register management">
    <h4>Manage Registers</h4>
    {entitlement && <p>{entitlement.occupiedTerminalCount} of {entitlement.terminalSlotCount} Register slots in use across this workspace</p>}
    <p>Workspace code <code>{workspace.workspaceCode}</code></p>
    {restricted && <p className="form-message" role="status">Register pairing is restricted for this workspace.</p>}
    {branches?.length ? <form className="owner-form" onSubmit={pair}>
      <label>Branch
        <select value={branchId ?? ''} disabled={busy || !!pairing} onChange={event => setSelection(event.target.value)}>
          {branches.map(branch => <option key={branch.branchId} value={branch.branchId}>{branch.name}</option>)}
        </select>
      </label>
      <button className="button button-small" type="submit" disabled={busy || !!pairing || restricted}>{busy ? 'Creating code…' : 'Generate pairing code'}</button>
    </form> : <p>{licensing ? 'No licensed branches are available for pairing.' : 'Register information is unavailable. Refresh to try again.'}</p>}
    {pairing && <div className="owner-pairing-code" role="status">
      <strong>One-time pairing code</strong>
      <code>{pairing.code}</code>
      <p>Enter the workspace code and this code on the Register setup screen. This code expires at {new Date(pairing.expiresAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}.</p>
      <button className="text-button" type="button" onClick={() => { setPairing(undefined); void reload(); }}>Done with this code</button>
    </div>}
    {expired && <p role="status">The code expired. Generate a new one if the Register still needs pairing.</p>}
    {error && <p className="form-message" role="alert">{error}</p>}
    <h4>Paired Registers</h4>
    {licensing?.devices.length ? <ul className="owner-checklist">{licensing.devices.map(device => (
      <li key={device.deviceId}><span>{device.name} · {branches?.find(branch => branch.branchId === device.branchId)?.name ?? device.platform}</span><strong>{device.status.toLowerCase().replaceAll('_', ' ')}</strong></li>
    ))}</ul> : <p>{licensing ? 'No Registers paired yet.' : 'Paired Registers are unavailable.'}</p>}
    <button type="button" className="text-button" onClick={() => void reload()}>Refresh Registers</button>
  </section>;
}
