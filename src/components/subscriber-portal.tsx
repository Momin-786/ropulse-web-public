'use client';

import { salesEmail, packageHref } from '@/lib/sales';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ManageRegisters, OwnerSetup } from './owner-workspace';
import { BackOfficePasswordField, GeneratedRegisterPin, PinLengthPicker } from './owner-app-credentials';
import type { OwnerWorkspace, RegisterLicensing } from './owner-workspace';

type Plan = { id: string; name: string; code: string; monthlyPrice: string; currency: string };
type AddOn = { code: string; versionId: string; name: string; unitPrice: string; currency: string; scopeType: string; effectiveFrom?: string; effectiveUntil?: string | null };
type Catalog = { planVersions: Plan[]; addOns: AddOn[] };
type Invoice = { id: string; status: string; total: string; currency: string; expiresAt?: string };
type Fulfilment = { invoiceStatus: string; fulfilmentStatus: string | null; recoveryMessage: string | null; provisioningJobId?: string | null };
type Workspace = OwnerWorkspace;
type Licensing = RegisterLicensing & { subscription: { id: string; status: string; provider?: string; planCode: string; currentPeriodEnd: string | null; cancellationEffectiveAt: string | null } };

type KitchenBranch = { branchId: string; name: string; included: boolean; extraScreens: number };
type KitchenCheckout = {
  workspaceName: string; planVersionId: string; currency: string; branchQuantity: number;
  additionalTerminalQuantity: number; addOnVersionIds: string[]; branches: KitchenBranch[];
};

const idempotencyKey = () => crypto.randomUUID();
const kitchenBaseCode = 'KITCHEN_DISPLAY_BRANCH';
const kitchenExtraCode = 'ADDITIONAL_KITCHEN_DISPLAY';

function activeKitchenOffer(addOns: AddOn[], code: string, currency = 'PKR') {
  const now = Date.now();
  return addOns.find(offer => offer.code === code && offer.versionId && offer.currency === currency
    && (!offer.effectiveFrom || Date.parse(offer.effectiveFrom) <= now)
    && (!offer.effectiveUntil || Date.parse(offer.effectiveUntil) > now));
}

function KitchenCheckoutOptions({ base, extra, enabled, extraScreens, onEnabled, onExtraScreens }: {
  base: AddOn; extra?: AddOn; enabled: boolean; extraScreens: string;
  onEnabled: (enabled: boolean) => void; onExtraScreens: (quantity: string) => void;
}) {
  return <fieldset>
    <legend>Kitchen Display</legend>
    <label className="check-field">
      <input type="checkbox" checked={enabled} onChange={event => onEnabled(event.target.checked)} />
      Add RoPulse Kitchen to your first branch · {base.currency} {base.unitPrice}/month
    </label>
    <p>Includes one screen for receiving orders and marking items ready.</p>
    {enabled && extra ? <label>
      Additional screens · {extra.currency} {extra.unitPrice} each per month
      <input type="number" min="0" max="100" step="1" required value={extraScreens}
        onChange={event => onExtraScreens(event.target.value)} />
    </label> : null}
  </fieldset>;
}

async function request<T>(path: string, options: RequestInit = {}, _session?: string): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('accept', 'application/json');
  if (options.body) headers.set('content-type', 'application/json');
  const response = await fetch(`/api/subscriber/${path}`, { ...options, headers, cache: 'no-store' });
  if (!response.ok) {
    const body = await response.json().catch(() => null) as { message?: string } | null;
    if(response.status === 401) window.dispatchEvent(new Event('ropulse:subscriber-session-expired'));
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
      .catch(() => setMessage('Could not check your session. Please try signing in again.'))
      .finally(() => setSessionReady(true));
  }, []);

  useEffect(() => {
    const expired = () => { setToken(null); setPassword(''); setMessage('Your session expired. Sign in again to continue.'); };
    window.addEventListener('ropulse:subscriber-session-expired',expired);
    return () => window.removeEventListener('ropulse:subscriber-session-expired',expired);
  },[]);
  useEffect(() => {
    if(token && (page === 'login' || page === 'signup')) router.replace('/account');
  },[token,page,router]);

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
        setToken('session'); setPassword('');
        router.replace(page === 'login' || page === 'signup' ? '/account' : `/${page}${search.toString() ? `?${search.toString()}` : ''}`);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'The request could not be completed.');
    } finally {
      setBusy(false);
    }
  }

  if (!sessionReady) return <section className="container account-shell"><h1>Loading your account…</h1></section>;
  if (token && (page === 'login' || page === 'signup')) return <section className="container account-shell"><h1>Opening your account…</h1></section>;
  if (token && page === 'owner-invitation') return <OwnerInvitation token={token} invitationToken={search.get('token') || ''} />;
  if (token && page === 'account') return <AccountDashboard token={token} onSignOut={() => setToken(null)} />;
  const kitchenWorkspace = search.get('kitchenTenant');
  if (token && kitchenWorkspace && !search.get('invoiceId')) {
    return <KitchenSubscriptionCheckout key={kitchenWorkspace} token={token} tenantId={kitchenWorkspace} />;
  }
  if (token) return <SubscriptionCheckout token={token} initialInvoiceId={search.get('invoiceId')} tracker={search.get('tracker') || search.get('tracker_token')} />;
  return <section className="container account-shell"><div className="account-intro"><p className="eyebrow">RoPulse account</p><h1>{mode === 'signup' ? 'Start with a verified account.' : 'Sign in to your business.'}</h1><p className="lead">One account holds your subscription, business workspace and owner access. You create your own credentials. RoPulse never displays a default password or PIN.</p></div><form className="account-card" onSubmit={submit}><h2>{mode === 'signup' ? 'Create your account' : 'Welcome back'}</h2><label>Email address<input required autoComplete="email" type="email" value={email} onChange={event => setEmail(event.target.value)} /></label><label>Password<input required minLength={12} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} type="password" value={password} onChange={event => setPassword(event.target.value)} /></label>{message && <p className="form-message" role="status">{message}</p>}<button className="button" disabled={busy} type="submit">{busy ? 'Please wait…' : mode === 'signup' ? 'Create account' : 'Sign in'}</button><button className="text-button" type="button" onClick={() => { setMode(mode === 'signup' ? 'login' : 'signup'); setMessage(null); }}>{mode === 'signup' ? 'Already verified? Sign in' : 'Create a subscriber account'}</button></form></section>;
}

function OwnerInvitation({ token, invitationToken }: { token: string; invitationToken: string }) {
  const [generatedPin, setGeneratedPin] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function accept(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || generatedPin) return;
    const form = new FormData(event.currentTarget);
    setBusy(true);
    setMessage(null);
    try {
      const pinLength = form.get('pinLength');
      const result = await request<{ pin: string }>('subscriber/owner-invitations/activate', {
        method: 'POST',
        body: JSON.stringify({
          token: invitationToken,
          ...(pinLength ? { pinLength: Number(pinLength) } : {}),
          adminPassword: form.get('adminPassword'),
        }),
      }, token);
      if (!result?.pin) throw new Error('The PIN could not be displayed. Open Workspace Setup to generate a new one.');
      setGeneratedPin(result.pin);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Owner setup could not be completed.');
    } finally {
      setBusy(false);
    }
  }

  return <section className="container account-shell">
    <div className="account-intro">
      <p className="eyebrow">Owner setup</p>
      <h1>Set up your RoPulse sign-in</h1>
      <p className="lead">Use your PIN at the Register and your Back Office password for Admin sign in in the Windows app.</p>
    </div>
    {generatedPin ? <div className="account-card">
      <h2>Your Back Office password is set</h2>
      <GeneratedRegisterPin pin={generatedPin} />
      <a className="button" href="/account">I saved my PIN. Open account</a>
    </div> : <form className="account-card" onSubmit={accept}>
      <h2>Activate your workspace</h2>
      {invitationToken ? <>
        <fieldset className="owner-invitation-fields" disabled={busy}>
          <legend className="sr-only">Set your credentials</legend>
          <PinLengthPicker />
          <BackOfficePasswordField required />
        </fieldset>
        <p>RoPulse generates your PIN. Choose a Back Office password with at least 12 characters.</p>
        <button className="button" disabled={busy} type="submit">{busy ? 'Activating…' : 'Activate workspace'}</button>
      </> : <p>Open the owner setup link from your invitation email to continue.</p>}
      {message && <p className="form-message" role="alert">{message}</p>}
    </form>}
  </section>;
}
function AccountDashboard({ token, onSignOut }: { token: string; onSignOut: () => void }) {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>();
  const [licenses, setLicenses] = useState<Record<string, Licensing>>({});
  const [licenseErrors, setLicenseErrors] = useState<Record<string, string>>({});
  const [workspaceError, setWorkspaceError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const refreshLicensing = useCallback(async (tenantId: string, signal?: AbortSignal) => {
    try {
      const result = await request<Licensing>('subscriber/tenants/' + encodeURIComponent(tenantId) + '/licensing', { signal }, token);
      if (signal?.aborted) return;
      setLicenses(current => ({ ...current, [tenantId]: result }));
      setLicenseErrors(current => ({ ...current, [tenantId]: '' }));
    } catch (error) {
      if (signal?.aborted) return;
      setLicenseErrors(current => ({
        ...current, [tenantId]: error instanceof Error ? error.message : 'Could not load licensing details.',
      }));
    }
  }, [token]);

  useEffect(() => {
    const controller = new AbortController();
    const options = { signal: controller.signal };
    request<Invoice[]>('subscriber/billing/invoices', options, token).then(setInvoices).catch(error => {
      if (!controller.signal.aborted) setMessage(error.message);
    });
    request<Workspace[]>('subscriber/tenants', options, token).then(owned => {
      if (controller.signal.aborted) return;
      setWorkspaces(owned);
      for (const workspace of owned) void refreshLicensing(workspace.tenantId, controller.signal);
    }).catch(error => {
      if (!controller.signal.aborted) setWorkspaceError(error.message);
    });
    return () => controller.abort();
  }, [token, refreshLicensing]);

  async function cancel(tenantId: string, subscriptionId: string) {
    if (!window.confirm('Cancel future renewal? Access continues through the current paid period.')) return;
    setBusy(true);
    setMessage('');
    try {
      await request<void>('subscriber/billing/subscriptions/' + encodeURIComponent(subscriptionId) + '/cancellation', { method: 'POST' }, token);
      setMessage('Cancellation was submitted. Safepay confirmation may take a moment to appear.');
      await refreshLicensing(tenantId);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Cancellation could not be submitted.');
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    await fetch('/api/subscriber/subscriber/auth/session', { method: 'DELETE' });
    onSignOut();
    router.replace('/login');
  }

  return <section className="container account-shell owner-account">
    <div className="account-intro">
      <p className="eyebrow">RoPulse account</p>
      <h1>Your workspaces and billing</h1>
    </div>
    <div className="account-card owner-workspaces">
      <h2>Workspaces</h2>
      {workspaceError && <p className="form-message" role="alert">{workspaceError}</p>}
      {!workspaces && !workspaceError && <p role="status">Loading workspaces…</p>}
      {workspaces?.length === 0 && <p>No active workspaces yet.</p>}
      {workspaces?.map(workspace => <WorkspaceCard
        key={workspace.tenantId}
        workspace={workspace}
        licensing={licenses[workspace.tenantId]}
        error={licenseErrors[workspace.tenantId]}
        reload={() => refreshLicensing(workspace.tenantId)}
      />)}
    </div>
    <div className="account-card owner-billing">
      <h2>Billing</h2>
      <p>For package options and pricing, <a className="text-link" href={packageHref}>contact {salesEmail}</a>.</p>
      <h3>Invoices</h3>
      {invoices.length ? <ul>{invoices.map(invoice => <li key={invoice.id}><strong>{invoice.currency} {invoice.total}</strong> · {invoice.status}{invoice.expiresAt ? ' · expires ' + new Date(invoice.expiresAt).toLocaleString() : ''}</li>)}</ul> : <p>No commercial invoices yet.</p>}
      <button className="text-button" type="button" onClick={() => router.push('/checkout')}>Buy or change a subscription</button>
      {workspaces?.map(workspace => {
        const subscription = licenses[workspace.tenantId]?.subscription;
        if (!subscription) return null;
        return <div key={workspace.tenantId} className="owner-billing-entry">
          <h3>{workspace.displayName}</h3>
          <p>{subscription.planCode} · {subscription.status}</p>
          {subscription.currentPeriodEnd && <p>Service period ends {new Date(subscription.currentPeriodEnd).toLocaleDateString()}.</p>}
          {subscription.provider === 'SAFEPAY' && <div className="owner-actions">
            <button className="text-button" type="button" onClick={() => router.push('/checkout?kitchenTenant=' + encodeURIComponent(workspace.tenantId))}>Manage Kitchen Display</button>
            {subscription.cancellationEffectiveAt ? <p>Cancellation takes effect {new Date(subscription.cancellationEffectiveAt).toLocaleDateString()}.</p> :
              <button className="text-button" type="button" disabled={busy} onClick={() => void cancel(workspace.tenantId, subscription.id)}>Cancel future renewal</button>}
          </div>}
        </div>;
      })}
      {message && <p className="form-message" role="status">{message}</p>}
    </div>
    <button className="text-button" type="button" onClick={() => void signOut()}>Sign out</button>
  </section>;
}

function WorkspaceCard({ workspace, licensing, error, reload }: {
  workspace: Workspace; licensing?: Licensing; error?: string; reload: () => Promise<void>;
}) {
  const [section, setSection] = useState<'setup' | 'registers'>();
  const panelId = 'owner-workspace-' + workspace.tenantId;
  return <article className="owner-workspace">
    <div className="owner-workspace-heading">
      <h3>{workspace.displayName}</h3>
      <p>{workspace.workspaceCode}</p>
    </div>
    <div className="owner-actions">
      <button className="button button-secondary button-small" type="button" aria-expanded={section === 'setup'} aria-controls={panelId} onClick={() => setSection(section === 'setup' ? undefined : 'setup')}>Set up workspace</button>
      <button className="button button-small" type="button" aria-expanded={section === 'registers'} aria-controls={panelId} onClick={() => setSection(section === 'registers' ? undefined : 'registers')}>Manage Registers</button>
    </div>
    <div id={panelId} hidden={!section}>
      {section === 'setup' && <OwnerSetup workspace={workspace} request={request} onManage={() => setSection('registers')} />}
      {section === 'registers' && <>
        {error && <p className="form-message" role="alert">{error}</p>}
        <ManageRegisters workspace={workspace} licensing={licensing} request={request} reload={reload} />
      </>}
    </div>
  </article>;
}
function KitchenSubscriptionCheckout({ token, tenantId }: { token: string; tenantId: string }) {
  const [configuration, setConfiguration] = useState<KitchenCheckout | null>(null);
  const [offers, setOffers] = useState<AddOn[]>([]);
  const [selections, setSelections] = useState<KitchenBranch[]>([]);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const invoiceIntent = useRef<{ body: string; key: string } | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const options = { signal: controller.signal };
    Promise.all([
      request<KitchenCheckout>(`subscriber/tenants/${tenantId}/licensing/kitchen-checkout`, options, token),
      request<Catalog>('subscriber/billing/catalog', options, token),
    ]).then(([current, catalog]) => {
      if (controller.signal.aborted) return;
      setConfiguration(current);
      setSelections(current.branches);
      setOffers(catalog.addOns);
    }).catch(error => {
      if (!controller.signal.aborted) setMessage(error.message);
    });
    return () => controller.abort();
  }, [tenantId, token]);

  const base = configuration ? activeKitchenOffer(offers, kitchenBaseCode, configuration.currency) : undefined;
  const extra = configuration ? activeKitchenOffer(offers, kitchenExtraCode, configuration.currency) : undefined;
  const needsUnavailableOffer = selections.some(branch => branch.included && (!base || (branch.extraScreens > 0 && !extra)));
  const changed = configuration?.branches.some((branch, index) => {
    const selected = selections[index];
    return selected && (branch.included !== selected.included || (selected.included && branch.extraScreens !== selected.extraScreens));
  });

  function updateBranch(branchId: string, update: Partial<Pick<KitchenBranch, 'included' | 'extraScreens'>>) {
    setSelections(current => current.map(branch => branch.branchId === branchId ? { ...branch, ...update } : branch));
    setInvoice(null);
  }

  async function createInvoice(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || !configuration || !changed || needsUnavailableOffer) return;
    setBusy(true);
    setMessage(null);
    const kitchenDisplays = base ? selections.filter(branch => branch.included).map(branch => ({
      branchId: branch.branchId,
      baseVersionId: base.versionId,
      extraVersionId: branch.extraScreens > 0 ? extra?.versionId : null,
      extraScreens: branch.extraScreens,
    })) : [];
    const body = JSON.stringify({
      planVersionId: configuration.planVersionId, branchQuantity: configuration.branchQuantity,
      additionalTerminalQuantity: configuration.additionalTerminalQuantity, addOnVersionIds: configuration.addOnVersionIds,
      currency: configuration.currency, billingCycle: 'MONTHLY', businessProfileCode: 'RESTAURANT',
      acceptedTermsVersion: '2026-09', kitchenDisplays,
    });
    if (invoiceIntent.current?.body !== body) invoiceIntent.current = { body, key: idempotencyKey() };
    try {
      setInvoice(await request<Invoice>(`subscriber/billing/tenants/${tenantId}/replacement-invoices`, {
        method: 'POST', headers: { 'Idempotency-Key': invoiceIntent.current.key }, body,
      }, token));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not price the subscription change.');
    } finally { setBusy(false); }
  }

  async function startCheckout() {
    if (!invoice || busy) return;
    setBusy(true);
    setMessage(null);
    try {
      const result = await request<{ hostedCheckoutUrl: string }>(`subscriber/billing/invoices/${invoice.id}/checkout`, {
        method: 'POST', body: JSON.stringify({ provider: 'SAFEPAY' }),
      }, token);
      window.location.assign(result.hostedCheckoutUrl);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Safepay checkout could not be started.');
      setBusy(false);
    }
  }

  return <section className="container checkout-shell">
    <div className="account-intro"><h1>Manage Kitchen Display</h1>{configuration ? <p>{configuration.workspaceName}</p> : null}</div>
    {configuration ? <form className="checkout-card" onSubmit={createInvoice}>
      <h2>Choose branches and screens</h2>
      {selections.length === 0 ? <p>This workspace has no active restaurant branches.</p> : null}
      {selections.map(branch => <fieldset key={branch.branchId}>
        <legend>{branch.name}</legend>
        <label className="check-field"><input type="checkbox" checked={branch.included}
          disabled={busy || (!base && !branch.included)}
          onChange={event => updateBranch(branch.branchId, { included: event.target.checked })} />
          Include Kitchen Display{base ? ` · ${base.currency} ${base.unitPrice}/month` : ''}
        </label>
        {branch.included ? <label>Additional screens{extra ? ` · ${extra.currency} ${extra.unitPrice} each/month` : ''}
          <input type="number" min="0" max="100" step="1" required disabled={busy || !extra}
            value={branch.extraScreens} onChange={event => updateBranch(branch.branchId, { extraScreens: Number(event.target.value) })} />
          <span>{1 + branch.extraScreens} screens including the first screen</span>
        </label> : null}
      </fieldset>)}
      {needsUnavailableOffer ? <p>The current catalog has no price for one of the selected screen options.</p> : null}
      <button className="button" disabled={busy || !changed || needsUnavailableOffer} type="submit">Review recurring total</button>
    </form> : message ? null : <p>Loading your subscription and eligible branches…</p>}
    {invoice ? <div className="checkout-card purchase-summary"><h2>Review subscription change</h2>
      <p>{invoice.currency} {invoice.total} per month. Kitchen Display changes after Safepay confirms the replacement subscription.</p>
      <button className="button" disabled={busy} onClick={() => void startCheckout()} type="button">Continue to Safepay</button>
    </div> : null}
    {message ? <p className="form-message" role="status">{message}</p> : null}
  </section>;
}

function SubscriptionCheckout({ token, initialInvoiceId, tracker }: { token: string; initialInvoiceId: string | null; tracker: string | null }) {
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [planVersionId, setPlanVersionId] = useState('');
  const [profile, setProfile] = useState('RESTAURANT');
  const [branches, setBranches] = useState('1');
  const [terminals, setTerminals] = useState('0');
  const [addOns, setAddOns] = useState<string[]>([]);
  const [kitchenEnabled, setKitchenEnabled] = useState(false);
  const [extraKitchenScreens, setExtraKitchenScreens] = useState('0');
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [business, setBusiness] = useState({ legalName: '', displayName: '', workspaceCode: '', initialBranchName: '', timezone: 'Asia/Karachi', region: 'PK' });
  const [provisioningSaved, setProvisioningSaved] = useState(false);
  const [fulfilment, setFulfilment] = useState<Fulfilment | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const listedAddOns = catalog?.addOns ?? [];
  const otherAddOns = listedAddOns.filter(offer => offer.code !== kitchenBaseCode && offer.code !== kitchenExtraCode);
  const kitchenBase = profile === 'RETAIL' ? undefined : activeKitchenOffer(listedAddOns, kitchenBaseCode);
  const kitchenExtra = kitchenBase ? activeKitchenOffer(listedAddOns, kitchenExtraCode) : undefined;

  useEffect(() => {
    request<Catalog>('subscriber/billing/catalog', {}, token).then(setCatalog).catch(error => setMessage(error.message));
  }, [token]);
  useEffect(() => {
    if (!initialInvoiceId) return;
    if (tracker) request('subscriber/billing/invoices/' + initialInvoiceId + '/checkout-status', { method: 'POST', body: JSON.stringify({ tracker }) }, token).catch(() => undefined);
    let stopped = false;
    let pending = false;
    const controller = new AbortController();
    const load = async () => {
      if (stopped || pending) return;
      pending = true;
      try {
        const status = await request<Fulfilment>('subscriber/billing/invoices/' + initialInvoiceId + '/fulfilment', { signal: controller.signal }, token);
        if (stopped) return;
        setFulfilment(status);
        setMessage(null);
        if (status.invoiceStatus === 'EXPIRED' ||
            (status.invoiceStatus === 'PAID' &&
              (status.fulfilmentStatus === 'COMPLETED' || status.fulfilmentStatus === 'FAILED'))) {
          stopped = true;
          window.clearInterval(interval);
        }
      } catch (error) {
        if (!stopped) setMessage(error instanceof Error ? error.message : 'Could not check payment status.');
      } finally {
        pending = false;
      }
    };
    const interval = window.setInterval(() => { void load(); }, 10000);
    setFulfilment(null);
    void load();
    return () => {
      stopped = true;
      window.clearInterval(interval);
      controller.abort();
    };
  }, [initialInvoiceId, token, tracker]);

  async function createInvoice(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setMessage(null);
    try {
      const extraScreens = kitchenExtra ? Number(extraKitchenScreens) : 0;
      const kitchenDisplays = kitchenEnabled && kitchenBase ? [{
        branchId: null,
        baseVersionId: kitchenBase.versionId,
        extraVersionId: extraScreens > 0 ? kitchenExtra?.versionId : null,
        extraScreens,
      }] : [];
      const created = await request<Invoice>('subscriber/billing/invoices', {
        method: 'POST', headers: { 'Idempotency-Key': idempotencyKey() }, body: JSON.stringify({
          planVersionId, branchQuantity: Number(branches), additionalTerminalQuantity: Number(terminals),
          addOnVersionIds: addOns, billingCycle: 'MONTHLY', currency: 'PKR', businessProfileCode: profile,
          acceptedTermsVersion: '2026-09', kitchenDisplays,
        }),
      }, token);
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

  if (initialInvoiceId) return <section className="container account-shell"><div className="account-intro"><p className="eyebrow">Subscription status</p><h1>We are confirming your payment.</h1><p className="lead">Safepay completion is not activation. RoPulse activates the workspace only after Safepay sends verified payment evidence.</p></div><div className="account-card">{!fulfilment ? <p>Checking Safepay and workspace setup…</p> : <><h2>{fulfilment.invoiceStatus === 'PAID' && fulfilment.fulfilmentStatus === 'COMPLETED' ? (fulfilment.provisioningJobId === null ? 'Your subscription is updated.' : 'Your workspace is ready.') : 'Payment and setup status'}</h2><p>{fulfilment.invoiceStatus === 'PAID' && fulfilment.fulfilmentStatus === 'COMPLETED' ? (fulfilment.provisioningJobId === null ? 'Open Kitchen displays in Back Office to pair your screens.' : 'Check your email for the single-use owner invitation. Use it to create your owner PIN, then continue in RoPulse Backoffice.') : fulfilment.recoveryMessage || 'Your payment is awaiting Safepay confirmation or your workspace is being provisioned. This page refreshes automatically.'}</p></>}{message && <p className="form-message">{message}</p>}</div></section>;
  return <section className="container checkout-shell"><div className="account-intro"><p className="eyebrow">Safepay subscription</p><h1>Build your RoPulse subscription.</h1><p className="lead">Prices and commercial limits are calculated by RoPulse. Safepay collects the approved recurring subscription only after you confirm your business information.</p></div>{(catalog?.planVersions.length === 0 || (!catalog && message)) && <aside className="checkout-card package-contact"><h2>Ask about available packages</h2><p>Our team can confirm pricing for your branches and devices.</p><a className="button" href={packageHref}>Contact {salesEmail}</a></aside>}{catalog ? <form className="checkout-card" onSubmit={createInvoice}><h2>Choose your subscription</h2><label>Plan<select required value={planVersionId} onChange={event => setPlanVersionId(event.target.value)}><option value="">Choose a plan</option>{catalog.planVersions.map(plan => <option key={plan.id} value={plan.id}>{plan.name} · {plan.currency} {plan.monthlyPrice}/month</option>)}</select></label><label>Business profile<select value={profile} onChange={event => setProfile(event.target.value)}><option value="RESTAURANT">Restaurant</option><option value="RETAIL">Retail</option><option value="HYBRID">Hybrid</option></select></label><label>Active branches<input required min="1" type="number" value={branches} onChange={event => setBranches(event.target.value)} /></label><label>Additional Register terminals<input required min="0" type="number" value={terminals} onChange={event => setTerminals(event.target.value)} /></label>{otherAddOns.length > 0 ? <fieldset><legend>Optional add-ons</legend>{otherAddOns.map(addOn => <label className="check-field" key={addOn.versionId}><input type="checkbox" checked={addOns.includes(addOn.versionId)} onChange={event => setAddOns(selected => event.target.checked ? [...selected, addOn.versionId] : selected.filter(id => id !== addOn.versionId))} />{addOn.name} · {addOn.currency} {addOn.unitPrice}</label>)}</fieldset> : null}
    {kitchenBase ? <KitchenCheckoutOptions base={kitchenBase} extra={kitchenExtra}
      enabled={kitchenEnabled} extraScreens={extraKitchenScreens} onEnabled={setKitchenEnabled}
      onExtraScreens={setExtraKitchenScreens} /> : null}<button className="button" disabled={busy || !planVersionId} type="submit">Create purchase summary</button></form> : <p>Loading available subscriptions…</p>}{invoice && <form className="checkout-card" onSubmit={saveBusiness}><h2>Business information</h2><p>Your workspace is created only after Safepay verifies the payment.</p>{Object.entries(business).map(([key, value]) => <label key={key}>{key === 'legalName' ? 'Legal business name' : key === 'displayName' ? 'Display name' : key === 'workspaceCode' ? 'Workspace code' : key === 'initialBranchName' ? 'First branch name' : key === 'timezone' ? 'Timezone' : 'Region'}<input required value={value} pattern={key === 'workspaceCode' ? '[a-z0-9]+(-[a-z0-9]+)*' : undefined} onChange={event => setBusiness({ ...business, [key]: event.target.value })} /></label>)}<button className="button button-secondary" disabled={busy} type="submit">{provisioningSaved ? 'Update business information' : 'Save business information'}</button></form>}{invoice && <div className="checkout-card purchase-summary"><h2>Subscription summary</h2><p>{invoice.currency} {invoice.total} due now. Renewal is handled by Safepay until you cancel through your RoPulse account.</p><button className="button" disabled={busy || !provisioningSaved} onClick={startCheckout} type="button">Continue to Safepay</button></div>}{message && <p className="form-message">{message}</p>}</section>;
}
