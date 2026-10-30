'use client';

import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

type Plan = { id: string; name: string; code: string; monthlyPrice: string; currency: string };
type AddOn = { versionId: string; name: string; unitPrice: string; currency: string; scopeType: string };
type Catalog = { planVersions: Plan[]; addOns: AddOn[] };
type Invoice = { id: string; status: string; total: string; currency: string; expiresAt?: string };
type Fulfilment = { invoiceStatus: string; fulfilmentStatus: string | null; recoveryMessage: string | null };
type Workspace = { tenantId: string; workspaceCode: string; displayName: string };
type Licensing = { subscription: { id: string; status: string; planCode: string; currentPeriodEnd: string | null; cancellationEffectiveAt: string | null } };

const idempotencyKey = () => crypto.randomUUID();

async function request<T>(path: string, options: RequestInit = {}, _session?: string): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('accept', 'application/json');
  if (options.body) headers.set('content-type', 'application/json');
  const response = await fetch(`/api/subscriber/${path}`, { ...options, headers, cache: 'no-store' });
  if (!response.ok) {
    const body = await response.json().catch(() => null) as { message?: string } | null;
    throw new Error(body?.message || 'The request could not be completed.');
  }
  return response.headers.get('content-type')?.includes('application/json')
    ? response.json() as Promise<T>
    : undefined as T;
}

export function SubscriberPortal({ page }: { page: 'login' | 'signup' | 'account' | 'checkout' | 'owner-invitation' }) {
  const router = useRouter();
  const search = useSearchParams();
  const [mode, setMode] = useState(page === 'signup' ? 'signup' : 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [sessionReady, setSessionReady] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const verification = search.get('token');
    if (page !== 'signup' || !verification) return;
    setBusy(true);
    request<void>('subscriber-accounts/email-verifications', { method: 'POST', body: JSON.stringify({ token: verification }) })
      .then(() => { setMessage('Email verified. Sign in to continue.'); setMode('login'); router.replace('/login'); })
      .catch(error => setMessage(error.message))
      .finally(() => setBusy(false));
  }, [page, router, search]);
  useEffect(() => {
    fetch('/api/subscriber/subscriber/auth/session', { cache: 'no-store' })
      .then(response => response.ok ? response.json() as Promise<{ authenticated: boolean }> : { authenticated: false })
      .then(session => setToken(session.authenticated ? 'session' : null))
      .finally(() => setSessionReady(true));
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage(null);
    try {
      if (mode === 'signup') {
        await request<void>('subscriber-accounts', { method: 'POST', body: JSON.stringify({ email, password, termsVersion: '2026-09' }) });
        setMessage('Check your email for the verification link, then sign in to purchase your subscription.');
        return;
      }
      const result = await request<{ authenticated: boolean }>('subscriber/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
      if (result.authenticated) {
        setToken('session');
        router.replace(page === 'login' ? '/account' : `/${page}`);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'The request could not be completed.');
    } finally {
      setBusy(false);
    }
  }

  if (!sessionReady) return <section className="container account-shell"><p>Loading your account…</p></section>;
  if (token && page === 'owner-invitation') return <OwnerInvitation token={token} invitationToken={search.get('token') || ''} />;
  if (token && page === 'account') return <AccountDashboard token={token} />;
  if (token) return <SubscriptionCheckout token={token} initialInvoiceId={search.get('invoiceId')} tracker={search.get('tracker') || search.get('tracker_token')} />;
  return <section className="container account-shell"><div className="account-intro"><p className="eyebrow">RoPulse account</p><h1>{mode === 'signup' ? 'Start with a verified account.' : 'Sign in to your business.'}</h1><p className="lead">One account holds your subscription, business workspace and owner access. You create your own credentials. RoPulse never displays a default password or PIN.</p></div><form className="account-card" onSubmit={submit}><h2>{mode === 'signup' ? 'Create your account' : 'Welcome back'}</h2><label>Email address<input required autoComplete="email" type="email" value={email} onChange={event => setEmail(event.target.value)} /></label><label>Password<input required minLength={12} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} type="password" value={password} onChange={event => setPassword(event.target.value)} /></label>{message && <p className="form-message" role="status">{message}</p>}<button className="button" disabled={busy} type="submit">{busy ? 'Please wait…' : mode === 'signup' ? 'Create account' : 'Sign in'}</button><button className="text-button" type="button" onClick={() => { setMode(mode === 'signup' ? 'login' : 'signup'); setMessage(null); }}>{mode === 'signup' ? 'Already verified? Sign in' : 'Create a subscriber account'}</button></form></section>;
}

function OwnerInvitation({ token, invitationToken }: { token: string; invitationToken: string }) {
  const [pin, setPin] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  async function accept(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setMessage(null);
    try {
      await request<void>('subscriber/owner-invitations/accept', { method: 'POST', body: JSON.stringify({ token: invitationToken, pin }) }, token);
      setMessage('Owner setup is complete. Sign in to your RoPulse workspace using your email, workspace code and new PIN.');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Owner setup could not be completed.'); } finally { setBusy(false); }
  }
  return <section className="container account-shell"><div className="account-intro"><p className="eyebrow">Owner setup</p><h1>Create your owner PIN.</h1><p className="lead">This invitation is single-use and linked to the verified account that purchased the subscription. Your PIN is created by you and is never sent by RoPulse.</p></div><form className="account-card" onSubmit={accept}><h2>Complete workspace activation</h2><label>Owner invitation token<input required value={invitationToken} readOnly /></label><label>Create owner PIN<input required pattern="\d{4,12}" minLength={4} maxLength={12} inputMode="numeric" autoComplete="new-password" type="password" value={pin} onChange={event => setPin(event.target.value)} /></label>{message && <p className="form-message" role="status">{message}</p>}<button className="button" disabled={busy || !invitationToken} type="submit">{busy ? 'Activating…' : 'Activate workspace'}</button></form></section>;
}

function AccountDashboard({ token }: { token: string }) {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [licenses, setLicenses] = useState<Record<string, Licensing>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    request<Invoice[]>('subscriber/billing/invoices', {}, token).then(setInvoices).catch(error => setMessage(error.message));
    request<Workspace[]>('subscriber/tenants', {}, token).then(async owned => {
      setWorkspaces(owned);
      const snapshots = await Promise.all(owned.map(async workspace => [workspace.tenantId, await request<Licensing>(`subscriber/tenants/${workspace.tenantId}/licensing`, {}, token)] as const));
      setLicenses(Object.fromEntries(snapshots));
    }).catch(error => setMessage(error.message));
  }, [token]);

  async function cancel(subscriptionId: string) {
    if (!window.confirm('Cancel future renewal? Access continues through the current paid period.')) return;
    setBusy(true); setMessage(null);
    try {
      await request<void>(`subscriber/billing/subscriptions/${subscriptionId}/cancellation`, { method: 'POST' }, token);
      setMessage('Cancellation was submitted. Safepay confirmation may take a moment to appear.');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Cancellation could not be submitted.'); } finally { setBusy(false); }
  }

  async function signOut() {
    await fetch('/api/subscriber/subscriber/auth/session', { method: 'DELETE' });
    router.replace('/login');
  }

  return <section className="container account-shell"><div className="account-intro"><p className="eyebrow">RoPulse account</p><h1>Your subscriptions and workspaces.</h1><p className="lead">Review commercial invoices, the current service period, and renewal status. Cancellation stops future Safepay renewal; it does not remove access already paid for.</p></div><div className="account-card"><h2>Invoices</h2>{invoices.length ? <ul>{invoices.map(invoice => <li key={invoice.id}><strong>{invoice.currency} {invoice.total}</strong> · {invoice.status}{invoice.expiresAt ? ` · expires ${new Date(invoice.expiresAt).toLocaleString()}` : ''}</li>)}</ul> : <p>No commercial invoices yet.</p>}<button className="text-button" type="button" onClick={() => router.push('/checkout')}>Buy or change a subscription</button></div><div className="account-card"><h2>Workspaces and renewal</h2>{workspaces.length ? workspaces.map(workspace => { const subscription = licenses[workspace.tenantId]?.subscription; return <div key={workspace.tenantId}><h3>{workspace.displayName}</h3><p>{workspace.workspaceCode}{subscription ? ` · ${subscription.planCode} · ${subscription.status}` : ''}</p>{subscription?.cancellationEffectiveAt ? <p>Cancellation takes effect {new Date(subscription.cancellationEffectiveAt).toLocaleDateString()}.</p> : subscription ? <><p>Paid through {subscription.currentPeriodEnd ? new Date(subscription.currentPeriodEnd).toLocaleDateString() : 'the current service period'}.</p><button className="text-button" type="button" disabled={busy} onClick={() => void cancel(subscription.id)}>Cancel future renewal</button></> : <p>Loading subscription details…</p>}</div>; }) : <p>No active workspaces yet.</p>}</div>{message && <p className="form-message" role="status">{message}</p>}<button className="text-button" type="button" onClick={() => void signOut()}>Sign out</button></section>;
}

function SubscriptionCheckout({ token, initialInvoiceId, tracker }: { token: string; initialInvoiceId: string | null; tracker: string | null }) {
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [planVersionId, setPlanVersionId] = useState('');
  const [profile, setProfile] = useState('RESTAURANT');
  const [branches, setBranches] = useState('1');
  const [terminals, setTerminals] = useState('0');
  const [addOns, setAddOns] = useState<string[]>([]);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [business, setBusiness] = useState({ legalName: '', displayName: '', workspaceCode: '', initialBranchName: '', timezone: 'Asia/Karachi', region: 'PK' });
  const [provisioningSaved, setProvisioningSaved] = useState(false);
  const [fulfilment, setFulfilment] = useState<Fulfilment | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    request<Catalog>('subscriber/billing/catalog', {}, token).then(setCatalog).catch(error => setMessage(error.message));
  }, [token]);
  useEffect(() => {
    if (!initialInvoiceId) return;
    if (tracker) request('subscriber/billing/invoices/' + initialInvoiceId + '/checkout-status', { method: 'POST', body: JSON.stringify({ tracker }) }, token).catch(() => undefined);
    const load = () => request<Fulfilment>('subscriber/billing/invoices/' + initialInvoiceId + '/fulfilment', {}, token).then(setFulfilment).catch(error => setMessage(error.message));
    load();
    const interval = window.setInterval(load, 10000);
    return () => window.clearInterval(interval);
  }, [initialInvoiceId, token, tracker]);

  async function createInvoice(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setMessage(null);
    try {
      const created = await request<Invoice>('subscriber/billing/invoices', { method: 'POST', headers: { 'Idempotency-Key': idempotencyKey() }, body: JSON.stringify({ planVersionId, branchQuantity: Number(branches), additionalTerminalQuantity: Number(terminals), addOnVersionIds: addOns, billingCycle: 'MONTHLY', currency: 'PKR', businessProfileCode: profile, acceptedTermsVersion: '2026-09' }) }, token);
      setInvoice(created); setProvisioningSaved(false);
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Could not create your purchase.'); } finally { setBusy(false); }
  }
  async function saveBusinessDetails() {
    if (!invoice) return;
    setBusy(true); setMessage(null);
    try { await request<void>('subscriber/billing/invoices/' + invoice.id + '/provisioning', { method: 'POST', body: JSON.stringify(business) }, token); setProvisioningSaved(true); } catch (error) { setMessage(error instanceof Error ? error.message : 'Could not save business information.'); } finally { setBusy(false); }
  }
  function saveBusiness(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void saveBusinessDetails();
  }
  async function startCheckout() {
    if (!invoice || !provisioningSaved) return;
    setBusy(true); setMessage(null);
    try { const result = await request<{ hostedCheckoutUrl: string }>('subscriber/billing/invoices/' + invoice.id + '/checkout', { method: 'POST', body: JSON.stringify({ provider: 'SAFEPAY' }) }, token); window.location.assign(result.hostedCheckoutUrl); } catch (error) { setMessage(error instanceof Error ? error.message : 'Safepay checkout could not be started.'); setBusy(false); }
  }

  if (initialInvoiceId) return <section className="container account-shell"><div className="account-intro"><p className="eyebrow">Subscription status</p><h1>We are confirming your payment.</h1><p className="lead">Safepay completion is not activation. RoPulse activates the workspace only after Safepay sends verified payment evidence.</p></div><div className="account-card">{!fulfilment ? <p>Checking Safepay and workspace setup…</p> : <><h2>{fulfilment.invoiceStatus === 'PAID' && fulfilment.fulfilmentStatus === 'COMPLETED' ? 'Your workspace is ready.' : 'Payment and setup status'}</h2><p>{fulfilment.invoiceStatus === 'PAID' && fulfilment.fulfilmentStatus === 'COMPLETED' ? 'Check your email for the single-use owner invitation. Use it to create your owner PIN, then continue in RoPulse Backoffice.' : fulfilment.recoveryMessage || 'Your payment is awaiting Safepay confirmation or your workspace is being provisioned. This page refreshes automatically.'}</p></>}{message && <p className="form-message">{message}</p>}</div></section>;
  return <section className="container checkout-shell"><div className="account-intro"><p className="eyebrow">Safepay subscription</p><h1>Build your RoPulse subscription.</h1><p className="lead">Prices and commercial limits are calculated by RoPulse. Safepay collects the approved recurring subscription only after you confirm your business information.</p></div>{catalog ? <form className="checkout-card" onSubmit={createInvoice}><h2>Choose your subscription</h2><label>Plan<select required value={planVersionId} onChange={event => setPlanVersionId(event.target.value)}><option value="">Choose a plan</option>{catalog.planVersions.map(plan => <option key={plan.id} value={plan.id}>{plan.name} · {plan.currency} {plan.monthlyPrice}/month</option>)}</select></label><label>Business profile<select value={profile} onChange={event => setProfile(event.target.value)}><option value="RESTAURANT">Restaurant</option><option value="RETAIL">Retail</option><option value="HYBRID">Hybrid</option></select></label><label>Active branches<input required min="1" type="number" value={branches} onChange={event => setBranches(event.target.value)} /></label><label>Additional Register terminals<input required min="0" type="number" value={terminals} onChange={event => setTerminals(event.target.value)} /></label>{catalog.addOns.length > 0 && <fieldset><legend>Optional add-ons</legend>{catalog.addOns.map(addOn => <label className="check-field" key={addOn.versionId}><input type="checkbox" checked={addOns.includes(addOn.versionId)} onChange={event => setAddOns(event.target.checked ? [...addOns, addOn.versionId] : addOns.filter(id => id !== addOn.versionId))} />{addOn.name} · {addOn.currency} {addOn.unitPrice}</label>)}</fieldset>}<button className="button" disabled={busy || !planVersionId} type="submit">Create purchase summary</button></form> : <p>Loading available subscriptions…</p>}{invoice && <form className="checkout-card" onSubmit={saveBusiness}><h2>Business information</h2><p>Your workspace is created only after Safepay verifies the payment.</p>{Object.entries(business).map(([key, value]) => <label key={key}>{key === 'legalName' ? 'Legal business name' : key === 'displayName' ? 'Display name' : key === 'workspaceCode' ? 'Workspace code' : key === 'initialBranchName' ? 'First branch name' : key === 'timezone' ? 'Timezone' : 'Region'}<input required value={value} pattern={key === 'workspaceCode' ? '[a-z0-9]+(-[a-z0-9]+)*' : undefined} onChange={event => setBusiness({ ...business, [key]: event.target.value })} /></label>)}<button className="button button-secondary" disabled={busy} type="submit">{provisioningSaved ? 'Update business information' : 'Save business information'}</button></form>}{invoice && <div className="checkout-card purchase-summary"><h2>Subscription summary</h2><p>{invoice.currency} {invoice.total} due now. Renewal is handled by Safepay until you cancel through your RoPulse account.</p><button className="button" disabled={busy || !provisioningSaved} onClick={startCheckout} type="button">Continue to Safepay</button></div>}{message && <p className="form-message">{message}</p>}</section>;
}
