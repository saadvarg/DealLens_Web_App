import {
  Activity,
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  CircleDollarSign,
  ClipboardCheck,
  Cloud,
  Download,
  FileClock,
  FileText,
  Gauge,
  LayoutDashboard,
  Link2,
  ListFilter,
  Loader2,
  Lock,
  LogOut,
  Mail,
  Network,
  PanelLeft,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Upload,
  UserPlus,
  Users,
  XCircle
} from 'lucide-react';
import { FormEvent, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';

const API_BASE = import.meta.env.VITE_DEALLENS_API_BASE_URL || 'http://localhost:3000';
const TOKEN_KEY = 'deallens.web.token';
const USER_KEY = 'deallens.web.user';

type Tab = 'overview' | 'screen' | 'deals' | 'analytics' | 'lifecycle' | 'team' | 'platform' | 'policy';

type ApiUser = {
  id: string;
  email: string;
  full_name?: string | null;
  company?: string | null;
  role?: string | null;
};

type AuthResponse = {
  success: boolean;
  token: string;
  user: ApiUser;
};

type Deal = {
  id: string;
  borrower_name?: string | null;
  equipment_description?: string | null;
  equipment_cost?: number | null;
  loan_amount_requested?: number | null;
  loan_term_months?: number | null;
  status?: string | null;
  assigned_to?: string | null;
  notes?: string | null;
  financial_document_filename?: string | null;
  extracted_data?: ExtractedFinancials | null;
  structured_screening?: StructuredScreening | null;
  confidence_score?: number | null;
  equipment_type?: string | null;
  estimated_value?: number | null;
  borrower_strength?: string | null;
  key_risks?: string[] | null;
  positive_factors?: string[] | null;
  recommended_terms?: RecommendedTerms | null;
  underwriter_notes?: string | null;
  missing_documents?: string[] | null;
  report_url?: string | null;
  risk_score: string;
  risk_score_breakdown?: Record<string, RiskBreakdown> | null;
  recommendation: string;
  rationale: string;
  created_at?: string | null;
};

type ExtractedFinancials = {
  borrower_name?: string | null;
  revenue?: number | null;
  net_income?: number | null;
  ebitda?: number | null;
  total_debt?: number | null;
  cash_balance?: number | null;
  equipment_cost?: number | null;
  requested_loan_amount?: number | null;
  dscr?: number | null;
  years_in_business?: number | null;
  document_analysis?: DocumentAnalysis | null;
};

type DocumentAnalysis = {
  accepted: boolean;
  confidence_score: number;
  document_type: string;
  document_label: string;
  page_count?: number | null;
  text_length: number;
  matched_signals: string[];
  warnings: string[];
  rejected_reason?: string | null;
};

type StructuredScreening = {
  recommendation?: string | null;
  confidence_score?: number | null;
  decision_factors?: DecisionFactor[] | null;
  risk_flags?: RiskFlag[] | null;
  credit_policy_checks?: CreditPolicyCheck[] | null;
  policy_name?: string | null;
  policy_decision?: string | null;
  comparable_deals?: string | null;
  underwriter_guidance?: string | null;
  lifecycle?: LifecycleSummary | null;
  borrower_portal?: BorrowerPortal | null;
  asset_tracking?: AssetTracking | null;
  ecoa_compliance?: EcoaCompliance | null;
};

type RecommendedTerms = {
  max_amount?: number | null;
  suggested_rate_range?: string | null;
  suggested_term_months?: number | null;
};

type RiskBreakdown = {
  score?: number;
  label?: string;
  rationale?: string;
};

type DecisionFactor = {
  factor: string;
  value: string;
  threshold?: string | null;
  status: string;
  source_location?: string | null;
  weight: string;
  explanation: string;
};

type RiskFlag = {
  flag: string;
  severity: string;
  detail: string;
  source?: string | null;
  mitigation?: string | null;
};

type CreditPolicyCheck = {
  rule: string;
  actual: string;
  result: string;
};

type LifecycleStage = {
  key: string;
  label: string;
  owner?: string | null;
  state?: string | null;
  count?: number | null;
};

type LifecycleSummary = {
  current_stage?: string | null;
  stages: LifecycleStage[];
};

type BorrowerPortal = {
  public_status: string;
  status_detail: string;
  required_documents: Array<{ name: string; status?: string | null }>;
  next_update?: string | null;
};

type AssetTracking = {
  collateral_description: string;
  original_value?: number | null;
  estimated_residual_value?: number | null;
  lien_status: string;
  insurance_status: string;
  tracking_status: string;
};

type EcoaCompliance = {
  adverse_action_reasons: string[];
  prohibited_basis_guardrails: string[];
  audit_trail_required: boolean;
  explanation_available: boolean;
};

type ScreeningResponse = {
  success: boolean;
  deal_id: string;
  result: {
    risk_score: string;
    recommendation: string;
    confidence_score?: number | null;
    borrower_strength?: string | null;
    equipment_type?: string | null;
    estimated_value?: number | null;
    key_risks?: string[] | null;
    positive_factors?: string[] | null;
    recommended_terms?: RecommendedTerms | null;
    underwriter_notes?: string | null;
    missing_documents?: string[] | null;
    decision_factors?: DecisionFactor[] | null;
    risk_flags?: RiskFlag[] | null;
    credit_policy_checks?: CreditPolicyCheck[] | null;
    policy_name?: string | null;
    policy_decision?: string | null;
    lifecycle?: LifecycleSummary | null;
    borrower_portal?: BorrowerPortal | null;
    asset_tracking?: AssetTracking | null;
    ecoa_compliance?: EcoaCompliance | null;
    document_analysis?: DocumentAnalysis | null;
    rationale: string;
    breakdown?: Record<string, RiskBreakdown> | null;
    total_score?: number | null;
    extraction_model?: string | null;
    extracted_data: ExtractedFinancials;
  };
};

type AnalyticsSummary = {
  deals_screened: number;
  pursue_count: number;
  review_count: number;
  pass_count: number;
  ai_override_rate: number;
  avg_confidence_score: number;
  total_pipeline_value: number;
  approved_value: number;
  avg_deal_size: number;
  screening_time_avg_seconds: number;
  top_equipment_types: Array<{ equipment_type: string; count: number }>;
};

type TeamMember = {
  id: string;
  email: string;
  full_name?: string | null;
  company?: string | null;
  role: string;
};

type IntegrationCatalog = {
  public_api: {
    status: string;
    version?: string;
    base_url?: string;
    auth?: string;
  };
  connectors: Array<{
    name: string;
    category: string;
    status: string;
    description?: string;
  }>;
};

type CreditPolicy = {
  id?: string;
  policy_name?: string;
  min_dscr?: number;
  max_ltv?: number;
  min_years_in_business?: number;
  max_debt_to_ebitda?: number;
  require_invoice?: boolean;
  require_ucc_search?: boolean;
  auto_pass_credit_flags?: string[];
};

type ApiErrorBody = {
  error?: string;
  details?: unknown;
  debug?: string;
};

const navItems: Array<{ id: Tab; label: string; icon: ReactNode }> = [
  { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={18} /> },
  { id: 'screen', label: 'New Screen', icon: <Upload size={18} /> },
  { id: 'deals', label: 'Deals', icon: <BriefcaseBusiness size={18} /> },
  { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={18} /> },
  { id: 'lifecycle', label: 'Lifecycle', icon: <Network size={18} /> },
  { id: 'team', label: 'Team', icon: <Users size={18} /> },
  { id: 'platform', label: 'Platform', icon: <Cloud size={18} /> },
  { id: 'policy', label: 'Policy', icon: <Settings size={18} /> }
];

function currency(value?: number | null, compact = false) {
  if (value === undefined || value === null || Number.isNaN(value)) return '-';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: compact ? 'compact' : 'standard',
    maximumFractionDigits: compact ? 1 : 0
  }).format(value);
}

function labelize(value?: string | null) {
  if (!value) return '-';
  return value.replaceAll('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

function statusTone(status?: string | null) {
  const normalized = String(status || '').toLowerCase();
  if (['pursue', 'approved', 'funded', 'active'].includes(normalized)) return 'good';
  if (['review', 'documentation', 'underwriting', 'pending'].includes(normalized)) return 'warn';
  if (['pass', 'rejected', 'declined'].includes(normalized)) return 'bad';
  return 'neutral';
}

async function apiRequest<T>(path: string, token?: string | null, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  headers.set('Accept', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const text = await response.text();
  const body = text ? JSON.parse(text) : {};

  if (!response.ok) {
    const error = body as ApiErrorBody;
    const details = typeof error.details === 'string' ? ` ${error.details}` : '';
    throw new Error(`${error.error || response.statusText}${details}`);
  }

  return body as T;
}

function App() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<ApiUser | null>(() => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) as ApiUser : null;
  });
  const [tab, setTab] = useState<Tab>('overview');
  const [deals, setDeals] = useState<Deal[]>([]);
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [lifecycle, setLifecycle] = useState<LifecycleSummary | null>(null);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [integrations, setIntegrations] = useState<IntegrationCatalog | null>(null);
  const [policy, setPolicy] = useState<CreditPolicy | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedDeal = useMemo(
    () => deals.find((deal) => deal.id === selectedDealId) || deals[0] || null,
    [deals, selectedDealId]
  );

  const loadWorkspace = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const [dealsRes, analyticsRes, lifecycleRes, teamRes, integrationsRes, policyRes] = await Promise.allSettled([
        apiRequest<{ success: boolean; deals: Deal[] }>('/api/deals', token),
        apiRequest<{ success: boolean; summary: AnalyticsSummary }>('/api/analytics/summary', token),
        apiRequest<{ success: boolean; summary: LifecycleSummary }>('/api/lifecycle/summary', token),
        apiRequest<{ success: boolean; members: TeamMember[] }>('/api/teams/members', token),
        apiRequest<{ success: boolean; integrations: IntegrationCatalog }>('/api/integrations', token),
        apiRequest<{ success: boolean; policy: CreditPolicy }>('/api/credit-policy', token)
      ]);

      if (dealsRes.status === 'fulfilled') {
        setDeals(dealsRes.value.deals);
        setSelectedDealId((current) => current || dealsRes.value.deals[0]?.id || null);
      }
      if (analyticsRes.status === 'fulfilled') setAnalytics(analyticsRes.value.summary);
      if (lifecycleRes.status === 'fulfilled') setLifecycle(lifecycleRes.value.summary);
      if (teamRes.status === 'fulfilled') setTeam(teamRes.value.members);
      if (integrationsRes.status === 'fulfilled') setIntegrations(integrationsRes.value.integrations);
      if (policyRes.status === 'fulfilled') setPolicy(policyRes.value.policy);

      const firstRejected = [dealsRes, analyticsRes, lifecycleRes, teamRes, integrationsRes, policyRes]
        .find((result): result is PromiseRejectedResult => result.status === 'rejected');
      if (firstRejected) setError(firstRejected.reason instanceof Error ? firstRejected.reason.message : 'Some workspace data could not load.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void loadWorkspace();
  }, [loadWorkspace]);

  const handleAuth = (response: AuthResponse) => {
    localStorage.setItem(TOKEN_KEY, response.token);
    localStorage.setItem(USER_KEY, JSON.stringify(response.user));
    setToken(response.token);
    setUser(response.user);
  };

  const signOut = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
    setDeals([]);
    setSelectedDealId(null);
  };

  if (!token || !user) {
    return <AuthScreen onAuth={handleAuth} />;
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><Sparkles size={22} /></div>
          <div>
            <strong>DealLens</strong>
            <span>Equipment finance OS</span>
          </div>
        </div>
        <nav className="nav-list" aria-label="Workspace">
          {navItems.map((item) => (
            <button key={item.id} className={tab === item.id ? 'active' : ''} onClick={() => setTab(item.id)}>
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
        <div className="account-panel">
          <span>{user.email}</span>
          <strong>{user.company || user.full_name || 'DealLens Workspace'}</strong>
          <button className="ghost-button" onClick={signOut}><LogOut size={16} /> Sign out</button>
        </div>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Borrower-aware lending lifecycle</p>
            <h1>{navItems.find((item) => item.id === tab)?.label}</h1>
          </div>
          <div className="topbar-actions">
            <button className="ghost-button" onClick={loadWorkspace} disabled={loading}>
              {loading ? <Loader2 className="spin" size={16} /> : <Activity size={16} />}
              Refresh
            </button>
            <button className="primary-button" onClick={() => setTab('screen')}>
              <Plus size={16} />
              Screen deal
            </button>
          </div>
        </header>

        {error && <Notice tone="warn" title="Workspace notice">{error}</Notice>}

        {tab === 'overview' && <Overview deals={deals} analytics={analytics} onOpenDeal={(id) => { setSelectedDealId(id); setTab('deals'); }} />}
        {tab === 'screen' && <ScreenDeal token={token} onCreated={(dealId) => { setSelectedDealId(dealId); void loadWorkspace(); setTab('deals'); }} />}
        {tab === 'deals' && (
          <Deals
            deals={deals}
            selectedDeal={selectedDeal}
            onSelect={setSelectedDealId}
            token={token}
            onChanged={loadWorkspace}
          />
        )}
        {tab === 'analytics' && <Analytics analytics={analytics} deals={deals} />}
        {tab === 'lifecycle' && <Lifecycle lifecycle={lifecycle} deals={deals} />}
        {tab === 'team' && <Team token={token} team={team} reload={loadWorkspace} />}
        {tab === 'platform' && <Platform integrations={integrations} />}
        {tab === 'policy' && <Policy token={token} policy={policy} setPolicy={setPolicy} />}
      </main>
    </div>
  );
}

function AuthScreen({ onAuth }: { onAuth: (response: AuthResponse) => void }) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('broker@company.com');
  const [password, setPassword] = useState('correct-horse-battery');
  const [fullName, setFullName] = useState('Demo Broker');
  const [company, setCompany] = useState('DealLens Demo');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = mode === 'signup'
        ? { email, password, full_name: fullName, company }
        : { email, password };
      const response = await apiRequest<AuthResponse>(`/api/auth/${mode}`, null, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      onAuth(response);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-screen">
      <section className="auth-copy">
        <div className="brand large">
          <div className="brand-mark"><Sparkles size={28} /></div>
          <div>
            <strong>DealLens</strong>
            <span>Enterprise equipment finance</span>
          </div>
        </div>
        <h1>Move lending work from intake to asset tracking in one browser workspace.</h1>
        <div className="auth-proof-grid">
          <MiniProof icon={<FileText />} label="PDF intake" value="AI extraction" />
          <MiniProof icon={<Gauge />} label="Policy checks" value="Explainable" />
          <MiniProof icon={<ShieldCheck />} label="Audit trail" value="ECOA aware" />
        </div>
      </section>
      <form className="auth-form" onSubmit={submit}>
        <div className="segmented">
          <button type="button" className={mode === 'login' ? 'selected' : ''} onClick={() => setMode('login')}>Login</button>
          <button type="button" className={mode === 'signup' ? 'selected' : ''} onClick={() => setMode('signup')}>Sign up</button>
        </div>
        <label>Email<input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required /></label>
        <label>Password<input value={password} onChange={(event) => setPassword(event.target.value)} type="password" minLength={8} required /></label>
        {mode === 'signup' && (
          <>
            <label>Full name<input value={fullName} onChange={(event) => setFullName(event.target.value)} /></label>
            <label>Company<input value={company} onChange={(event) => setCompany(event.target.value)} /></label>
          </>
        )}
        {error && <Notice tone="bad" title="Sign in failed">{error}</Notice>}
        <button className="primary-button wide" disabled={loading}>
          {loading ? <Loader2 className="spin" size={16} /> : <Lock size={16} />}
          Continue
        </button>
      </form>
    </main>
  );
}

function Overview({ deals, analytics, onOpenDeal }: { deals: Deal[]; analytics: AnalyticsSummary | null; onOpenDeal: (id: string) => void }) {
  const counts = useMemo(() => summarizeDeals(deals), [deals]);
  const attention = deals.filter((deal) => ['review', 'pass'].includes((deal.status || deal.recommendation).toLowerCase())).slice(0, 5);

  return (
    <section className="panel-stack">
      <div className="metric-grid">
        <Metric label="Pursue" value={String(analytics?.pursue_count ?? counts.pursue)} icon={<CheckCircle2 />} tone="good" />
        <Metric label="Review" value={String(analytics?.review_count ?? counts.review)} icon={<FileClock />} tone="warn" />
        <Metric label="Pass" value={String(analytics?.pass_count ?? counts.pass)} icon={<XCircle />} tone="bad" />
        <Metric label="Pipeline" value={currency(analytics?.total_pipeline_value ?? counts.pipeline, true)} icon={<CircleDollarSign />} />
      </div>
      <div className="two-column">
        <Panel title="Needs Attention" icon={<ListFilter size={18} />}>
          <DealList deals={attention.length ? attention : deals.slice(0, 5)} onOpen={onOpenDeal} />
        </Panel>
        <Panel title="Operating Signals" icon={<Gauge size={18} />}>
          <KeyValue label="Average confidence" value={`${analytics?.avg_confidence_score ?? counts.avgConfidence}%`} />
          <KeyValue label="Average deal size" value={currency(analytics?.avg_deal_size ?? counts.avgDealSize)} />
          <KeyValue label="Override rate" value={`${analytics?.ai_override_rate ?? 0}%`} />
          <KeyValue label="Screening time" value={`${analytics?.screening_time_avg_seconds ?? 0}s`} />
        </Panel>
      </div>
    </section>
  );
}

function ScreenDeal({ token, onCreated }: { token: string; onCreated: (dealId: string) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    borrower_name: '',
    equipment_description: '',
    equipment_cost: '',
    loan_amount_requested: '',
    loan_term_months: ''
  });
  const [result, setResult] = useState<ScreeningResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!file) {
      setError('Select a PDF before screening.');
      return;
    }
    const body = new FormData();
    body.append('file', file);
    Object.entries(form).forEach(([key, value]) => {
      if (value) body.append(key, value);
    });
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest<ScreeningResponse>('/api/screen', token, { method: 'POST', body });
      setResult(response);
      onCreated(response.deal_id);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Screening failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="two-column align-start">
      <Panel title="New Screening" icon={<Upload size={18} />}>
        <form className="screen-form" onSubmit={submit}>
          <label>Borrower name<input value={form.borrower_name} onChange={(event) => setForm({ ...form, borrower_name: event.target.value })} /></label>
          <label>Equipment description<input value={form.equipment_description} onChange={(event) => setForm({ ...form, equipment_description: event.target.value })} /></label>
          <div className="form-row">
            <label>Equipment cost<input inputMode="decimal" value={form.equipment_cost} onChange={(event) => setForm({ ...form, equipment_cost: event.target.value })} /></label>
            <label>Loan amount<input inputMode="decimal" value={form.loan_amount_requested} onChange={(event) => setForm({ ...form, loan_amount_requested: event.target.value })} /></label>
          </div>
          <label>Term months<input inputMode="numeric" value={form.loan_term_months} onChange={(event) => setForm({ ...form, loan_term_months: event.target.value })} /></label>
          <label className="file-drop">
            <FileText size={24} />
            <span>{file ? file.name : 'Choose financial PDF'}</span>
            <input type="file" accept="application/pdf" onChange={(event) => setFile(event.target.files?.[0] || null)} />
          </label>
          {error && <Notice tone="bad" title="Screening failed">{error}</Notice>}
          <button className="primary-button wide" disabled={loading}>
            {loading ? <Loader2 className="spin" size={16} /> : <ClipboardCheck size={16} />}
            Run AI screen
          </button>
        </form>
      </Panel>
      <Panel title="Screening Output" icon={<Sparkles size={18} />}>
        {result ? <ScreeningResult result={result} /> : <EmptyState icon={<PanelLeft />} title="No result yet" text="Upload a deal package to see confidence, risk, policy checks, lifecycle state, and missing documents." />}
      </Panel>
    </section>
  );
}

function Deals({ deals, selectedDeal, onSelect, token, onChanged }: { deals: Deal[]; selectedDeal: Deal | null; onSelect: (id: string) => void; token: string; onChanged: () => void }) {
  const [query, setQuery] = useState('');
  const filtered = deals.filter((deal) => {
    const haystack = [deal.borrower_name, deal.equipment_description, deal.status, deal.recommendation, deal.risk_score].join(' ').toLowerCase();
    return haystack.includes(query.toLowerCase());
  });

  return (
    <section className="deal-workbench">
      <Panel title="Deal Queue" icon={<BriefcaseBusiness size={18} />}>
        <div className="searchbox">
          <Search size={16} />
          <input placeholder="Search borrower, equipment, status" value={query} onChange={(event) => setQuery(event.target.value)} />
        </div>
        <div className="deal-table" role="table">
          {filtered.map((deal) => (
            <button key={deal.id} className={selectedDeal?.id === deal.id ? 'deal-row selected' : 'deal-row'} onClick={() => onSelect(deal.id)}>
              <span><strong>{deal.borrower_name || 'Unnamed borrower'}</strong><small>{deal.equipment_description || 'Equipment not specified'}</small></span>
              <Badge tone={statusTone(deal.status || deal.recommendation)}>{labelize(deal.status || deal.recommendation)}</Badge>
              <span className="money">{currency(deal.loan_amount_requested || deal.equipment_cost, true)}</span>
            </button>
          ))}
          {!filtered.length && <EmptyState icon={<Search />} title="No matching deals" text="Try a different borrower, equipment, or status search." />}
        </div>
      </Panel>
      <DealDetail deal={selectedDeal} token={token} onChanged={onChanged} />
    </section>
  );
}

function DealDetail({ deal, token, onChanged }: { deal: Deal | null; token: string; onChanged: () => void }) {
  const [status, setStatus] = useState('review');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setStatus(deal?.status || deal?.recommendation || 'review');
    setNotes('');
    setMessage(null);
  }, [deal?.id, deal?.recommendation, deal?.status]);

  if (!deal) {
    return <Panel title="Deal Detail" icon={<FileText size={18} />}><EmptyState icon={<BriefcaseBusiness />} title="No deals yet" text="Screen a PDF package to start the lending lifecycle." /></Panel>;
  }

  const updateStatus = async () => {
    await apiRequest(`/api/deals/${deal.id}/status`, token, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes: notes || undefined })
    });
    setMessage('Status saved.');
    onChanged();
  };

  const exportReport = async () => {
    const response = await apiRequest<{ report_url: string; report_filename: string; report_pdf_base64?: string }>(`/api/deals/${deal.id}/report`, token, { method: 'POST' });
    if (response.report_pdf_base64) {
      const link = document.createElement('a');
      link.href = `data:application/pdf;base64,${response.report_pdf_base64}`;
      link.download = response.report_filename.split('/').pop() || 'deallens-report.pdf';
      link.click();
    } else {
      window.open(response.report_url, '_blank', 'noopener,noreferrer');
    }
  };

  const screening = deal.structured_screening;
  const analysis = deal.extracted_data?.document_analysis;

  return (
    <Panel title={deal.borrower_name || 'Deal Detail'} icon={<FileText size={18} />} actions={<button className="ghost-button" onClick={exportReport}><Download size={16} /> Report</button>}>
      <div className="detail-header">
        <div>
          <h2>{deal.equipment_description || 'Equipment not specified'}</h2>
          <p>{deal.rationale}</p>
        </div>
        <Badge tone={statusTone(deal.status || deal.recommendation)}>{labelize(deal.status || deal.recommendation)}</Badge>
      </div>
      <div className="metric-grid compact">
        <Metric label="Risk" value={labelize(deal.risk_score)} icon={<Gauge />} tone={statusTone(deal.recommendation)} />
        <Metric label="Confidence" value={`${deal.confidence_score ?? screening?.confidence_score ?? 0}%`} icon={<Activity />} />
        <Metric label="Amount" value={currency(deal.loan_amount_requested || deal.equipment_cost, true)} icon={<CircleDollarSign />} />
      </div>
      <div className="detail-grid">
        <InfoGroup title="AI Screening">
          <KeyValue label="Equipment type" value={deal.equipment_type || '-'} />
          <KeyValue label="Borrower strength" value={labelize(deal.borrower_strength)} />
          <KeyValue label="Max amount" value={currency(deal.recommended_terms?.max_amount)} />
          <KeyValue label="Rate range" value={deal.recommended_terms?.suggested_rate_range || '-'} />
          <FlagList title="Key risks" items={deal.key_risks || []} tone="bad" />
          <FlagList title="Positive factors" items={deal.positive_factors || []} tone="good" />
          <FlagList title="Missing documents" items={deal.missing_documents || []} tone="warn" />
        </InfoGroup>
        <InfoGroup title="Workflow">
          <label>Status<select value={status} onChange={(event) => setStatus(event.target.value)}><option value="pursue">Pursue</option><option value="review">Review</option><option value="pass">Pass</option><option value="approved">Approved</option><option value="funded">Funded</option></select></label>
          <label>Notes<textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Add underwriter notes" /></label>
          <button className="primary-button" onClick={updateStatus}><CheckCircle2 size={16} /> Save status</button>
          {message && <Notice tone="good" title="Saved">{message}</Notice>}
        </InfoGroup>
      </div>
      {analysis && <DocumentAnalysisView analysis={analysis} />}
      {screening?.decision_factors?.length ? <Table title="Decision Factors" rows={screening.decision_factors.map((item) => [item.factor, item.value, item.threshold || '-', item.status, item.explanation])} /> : null}
      {screening?.credit_policy_checks?.length ? <Table title="Policy Checks" rows={screening.credit_policy_checks.map((item) => [item.rule, item.actual, item.result])} /> : null}
      {screening?.risk_flags?.length ? <Table title="Risk Flags" rows={screening.risk_flags.map((item) => [item.flag, item.severity, item.detail, item.mitigation || '-'])} /> : null}
      {screening?.lifecycle && <LifecycleRail stages={screening.lifecycle.stages} />}
      {screening?.borrower_portal && <PortalView portal={screening.borrower_portal} />}
      {screening?.asset_tracking && <AssetView asset={screening.asset_tracking} />}
      {screening?.ecoa_compliance && <EcoaView compliance={screening.ecoa_compliance} />}
    </Panel>
  );
}

function Analytics({ analytics, deals }: { analytics: AnalyticsSummary | null; deals: Deal[] }) {
  const counts = summarizeDeals(deals);
  const topTypes = analytics?.top_equipment_types?.length
    ? analytics.top_equipment_types
    : Object.entries(deals.reduce<Record<string, number>>((acc, deal) => {
      const key = deal.equipment_type || 'Unknown';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {})).map(([equipment_type, count]) => ({ equipment_type, count }));

  return (
    <section className="panel-stack">
      <div className="metric-grid">
        <Metric label="Screened" value={String(analytics?.deals_screened ?? deals.length)} icon={<ClipboardCheck />} />
        <Metric label="Pipeline" value={currency(analytics?.total_pipeline_value ?? counts.pipeline, true)} icon={<CircleDollarSign />} />
        <Metric label="Approved" value={currency(analytics?.approved_value ?? 0, true)} icon={<CheckCircle2 />} tone="good" />
        <Metric label="Avg deal" value={currency(analytics?.avg_deal_size ?? counts.avgDealSize, true)} icon={<BarChart3 />} />
      </div>
      <Panel title="Equipment Mix" icon={<BarChart3 size={18} />}>
        <div className="bars">
          {topTypes.map((type) => <Bar key={type.equipment_type} label={type.equipment_type} value={type.count} max={Math.max(...topTypes.map((item) => item.count), 1)} />)}
        </div>
      </Panel>
    </section>
  );
}

function Lifecycle({ lifecycle, deals }: { lifecycle: LifecycleSummary | null; deals: Deal[] }) {
  const stages = lifecycle?.stages?.length ? lifecycle.stages : [
    { key: 'application', label: 'Application', count: deals.length, state: 'active' },
    { key: 'underwriting', label: 'Underwriting', count: deals.filter((deal) => deal.status === 'review').length, state: 'pending' },
    { key: 'documentation', label: 'Documentation', count: 0, state: 'pending' },
    { key: 'funding', label: 'Funding', count: deals.filter((deal) => deal.status === 'funded').length, state: 'pending' },
    { key: 'asset_tracking', label: 'Asset Tracking', count: 0, state: 'pending' }
  ];
  return <Panel title="Lifecycle Dashboard" icon={<Network size={18} />}><LifecycleRail stages={stages} /></Panel>;
}

function Team({ token, team, reload }: { token: string; team: TeamMember[]; reload: () => void }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('underwriter');

  const invite = async (event: FormEvent) => {
    event.preventDefault();
    await apiRequest('/api/teams/invite', token, { method: 'POST', body: JSON.stringify({ email, role }) });
    setEmail('');
    reload();
  };

  return (
    <section className="two-column align-start">
      <Panel title="Team Members" icon={<Users size={18} />}>
        <div className="member-list">
          {team.map((member) => <div className="member" key={member.id}><Mail size={16} /><span><strong>{member.email}</strong><small>{labelize(member.role)}</small></span></div>)}
          {!team.length && <EmptyState icon={<Users />} title="No team members loaded" text="Team APIs are available when Supabase workspace data is configured." />}
        </div>
      </Panel>
      <Panel title="Invite User" icon={<UserPlus size={18} />}>
        <form className="screen-form" onSubmit={invite}>
          <label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
          <label>Role<select value={role} onChange={(event) => setRole(event.target.value)}><option value="admin">Admin</option><option value="senior_underwriter">Senior underwriter</option><option value="underwriter">Underwriter</option><option value="readonly">Read only</option></select></label>
          <button className="primary-button"><UserPlus size={16} /> Send invite</button>
        </form>
      </Panel>
    </section>
  );
}

function Platform({ integrations }: { integrations: IntegrationCatalog | null }) {
  return (
    <section className="panel-stack">
      <Panel title="Public API" icon={<Link2 size={18} />}>
        <div className="metric-grid compact">
          <Metric label="Status" value={labelize(integrations?.public_api.status || 'available')} icon={<Cloud />} />
          <Metric label="Version" value={integrations?.public_api.version || 'v1'} icon={<Settings />} />
          <Metric label="Auth" value={integrations?.public_api.auth || 'Bearer token'} icon={<ShieldCheck />} />
        </div>
      </Panel>
      <Panel title="Integration Catalog" icon={<Network size={18} />}>
        <div className="connector-grid">
          {(integrations?.connectors || []).map((connector) => (
            <div className="connector" key={connector.name}>
              <Badge tone={statusTone(connector.status)}>{labelize(connector.status)}</Badge>
              <h3>{connector.name}</h3>
              <p>{connector.description || connector.category}</p>
            </div>
          ))}
          {!integrations?.connectors?.length && <EmptyState icon={<Cloud />} title="No connectors loaded" text="The backend exposes ERP, CRM, core-system, and document integration metadata here." />}
        </div>
      </Panel>
    </section>
  );
}

function Policy({ token, policy, setPolicy }: { token: string; policy: CreditPolicy | null; setPolicy: (policy: CreditPolicy) => void }) {
  const [draft, setDraft] = useState<CreditPolicy>(policy || {});
  const [saved, setSaved] = useState(false);

  useEffect(() => setDraft(policy || {}), [policy]);

  const save = async () => {
    const payload = {
      policy_name: draft.policy_name || 'Default Equipment Finance Policy',
      min_dscr: Number(draft.min_dscr ?? 1.2),
      max_ltv: Number(draft.max_ltv ?? 0.85),
      min_years_in_business: Number(draft.min_years_in_business ?? 2),
      max_debt_to_ebitda: Number(draft.max_debt_to_ebitda ?? 4),
      require_invoice: Boolean(draft.require_invoice),
      require_ucc_search: Boolean(draft.require_ucc_search),
      auto_pass_credit_flags: draft.auto_pass_credit_flags || []
    };
    const response = await apiRequest<{ policy: CreditPolicy }>('/api/credit-policy', token, { method: 'PATCH', body: JSON.stringify(payload) });
    setPolicy(response.policy);
    setSaved(true);
  };

  return (
    <Panel title="Credit Policy Controls" icon={<Settings size={18} />}>
      <div className="policy-grid">
        <label>Policy name<input value={draft.policy_name || ''} onChange={(event) => setDraft({ ...draft, policy_name: event.target.value })} /></label>
        <label>Minimum DSCR<input type="number" step="0.05" value={draft.min_dscr ?? 1.2} onChange={(event) => setDraft({ ...draft, min_dscr: Number(event.target.value) })} /></label>
        <label>Maximum LTV<input type="number" step="0.01" value={draft.max_ltv ?? 0.85} onChange={(event) => setDraft({ ...draft, max_ltv: Number(event.target.value) })} /></label>
        <label>Years in business<input type="number" value={draft.min_years_in_business ?? 2} onChange={(event) => setDraft({ ...draft, min_years_in_business: Number(event.target.value) })} /></label>
        <label>Debt / EBITDA cap<input type="number" step="0.1" value={draft.max_debt_to_ebitda ?? 4} onChange={(event) => setDraft({ ...draft, max_debt_to_ebitda: Number(event.target.value) })} /></label>
        <label className="checkbox"><input type="checkbox" checked={Boolean(draft.require_invoice)} onChange={(event) => setDraft({ ...draft, require_invoice: event.target.checked })} /> Require invoice</label>
        <label className="checkbox"><input type="checkbox" checked={Boolean(draft.require_ucc_search)} onChange={(event) => setDraft({ ...draft, require_ucc_search: event.target.checked })} /> Require UCC search</label>
      </div>
      <button className="primary-button" onClick={save}><Settings size={16} /> Save policy</button>
      {saved && <Notice tone="good" title="Policy saved">Future screenings will use the updated policy thresholds.</Notice>}
    </Panel>
  );
}

function ScreeningResult({ result }: { result: ScreeningResponse }) {
  const output = result.result;
  return (
    <div className="result-panel">
      <div className="detail-header">
        <div>
          <h2>{labelize(output.recommendation)}</h2>
          <p>{output.rationale}</p>
        </div>
        <Badge tone={statusTone(output.recommendation)}>{output.confidence_score ?? 0}%</Badge>
      </div>
      <KeyValue label="Risk score" value={labelize(output.risk_score)} />
      <KeyValue label="Equipment type" value={output.equipment_type || '-'} />
      <KeyValue label="Borrower strength" value={labelize(output.borrower_strength)} />
      <FlagList title="Risks" items={output.key_risks || []} tone="bad" />
      <FlagList title="Positives" items={output.positive_factors || []} tone="good" />
      {output.credit_policy_checks?.length ? <Table title="Policy Checks" rows={output.credit_policy_checks.map((item) => [item.rule, item.actual, item.result])} /> : null}
    </div>
  );
}

function DocumentAnalysisView({ analysis }: { analysis: DocumentAnalysis }) {
  return (
    <InfoGroup title="Document Analysis">
      <KeyValue label="Document" value={analysis.document_label} />
      <KeyValue label="Confidence" value={`${analysis.confidence_score}%`} />
      <KeyValue label="Pages" value={String(analysis.page_count ?? '-')} />
      <FlagList title="Matched signals" items={analysis.matched_signals} tone="good" />
      <FlagList title="Warnings" items={analysis.warnings} tone="warn" />
    </InfoGroup>
  );
}

function LifecycleRail({ stages }: { stages: LifecycleStage[] }) {
  return (
    <div className="lifecycle-rail">
      {stages.map((stage, index) => <div className={`stage ${stage.state || ''}`} key={stage.key}><span>{index + 1}</span><strong>{stage.label}</strong><small>{stage.owner || `${stage.count ?? 0} deals`}</small></div>)}
    </div>
  );
}

function PortalView({ portal }: { portal: BorrowerPortal }) {
  return <InfoGroup title="Borrower Portal"><KeyValue label="Public status" value={portal.public_status} /><p>{portal.status_detail}</p><FlagList title="Required documents" items={portal.required_documents.map((doc) => `${doc.name} ${doc.status ? `(${labelize(doc.status)})` : ''}`)} tone="warn" /></InfoGroup>;
}

function AssetView({ asset }: { asset: AssetTracking }) {
  return <InfoGroup title="Asset Tracking"><KeyValue label="Collateral" value={asset.collateral_description} /><KeyValue label="Original value" value={currency(asset.original_value)} /><KeyValue label="Residual value" value={currency(asset.estimated_residual_value)} /><KeyValue label="Lien" value={labelize(asset.lien_status)} /><KeyValue label="Insurance" value={labelize(asset.insurance_status)} /></InfoGroup>;
}

function EcoaView({ compliance }: { compliance: EcoaCompliance }) {
  return <InfoGroup title="ECOA Compliance"><KeyValue label="Explanation" value={compliance.explanation_available ? 'Available' : 'Pending'} /><KeyValue label="Audit trail" value={compliance.audit_trail_required ? 'Required' : 'Optional'} /><FlagList title="Adverse action reasons" items={compliance.adverse_action_reasons} tone="warn" /></InfoGroup>;
}

function Panel({ title, icon, actions, children }: { title: string; icon: ReactNode; actions?: ReactNode; children: ReactNode }) {
  return <section className="panel"><header><div>{icon}<h2>{title}</h2></div>{actions}</header>{children}</section>;
}

function Metric({ label, value, icon, tone = 'neutral' }: { label: string; value: string; icon: ReactNode; tone?: 'good' | 'warn' | 'bad' | 'neutral' }) {
  return <div className={`metric ${tone}`}><span>{icon}</span><small>{label}</small><strong>{value}</strong></div>;
}

function KeyValue({ label, value }: { label: string; value: string }) {
  return <div className="key-value"><span>{label}</span><strong>{value}</strong></div>;
}

function Badge({ tone, children }: { tone: string; children: ReactNode }) {
  return <span className={`badge ${tone}`}>{children}</span>;
}

function Notice({ tone, title, children }: { tone: 'good' | 'warn' | 'bad'; title: string; children: ReactNode }) {
  return <div className={`notice ${tone}`}><strong>{title}</strong><span>{children}</span></div>;
}

function EmptyState({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return <div className="empty-state">{icon}<strong>{title}</strong><p>{text}</p></div>;
}

function FlagList({ title, items, tone }: { title: string; items: string[]; tone: 'good' | 'warn' | 'bad' }) {
  if (!items.length) return null;
  return <div className="flag-list"><strong>{title}</strong>{items.map((item) => <span className={`flag ${tone}`} key={item}>{item}</span>)}</div>;
}

function InfoGroup({ title, children }: { title: string; children: ReactNode }) {
  return <div className="info-group"><h3>{title}</h3>{children}</div>;
}

function Table({ title, rows }: { title: string; rows: string[][] }) {
  return <div className="data-table"><h3>{title}</h3>{rows.map((row, index) => <div className="data-row" key={`${title}-${index}`}>{row.map((cell, cellIndex) => <span key={`${cell}-${cellIndex}`}>{cell}</span>)}</div>)}</div>;
}

function DealList({ deals, onOpen }: { deals: Deal[]; onOpen: (id: string) => void }) {
  if (!deals.length) return <EmptyState icon={<BriefcaseBusiness />} title="No screened deals" text="New PDF screenings will appear here." />;
  return <div className="compact-list">{deals.map((deal) => <button key={deal.id} onClick={() => onOpen(deal.id)}><span><strong>{deal.borrower_name || 'Unnamed borrower'}</strong><small>{deal.equipment_description || 'Equipment not specified'}</small></span><Badge tone={statusTone(deal.status || deal.recommendation)}>{labelize(deal.status || deal.recommendation)}</Badge></button>)}</div>;
}

function MiniProof({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return <div className="mini-proof">{icon}<span>{label}</span><strong>{value}</strong></div>;
}

function Bar({ label, value, max }: { label: string; value: number; max: number }) {
  return <div className="bar-row"><span>{label}</span><div><i style={{ width: `${Math.max(8, (value / max) * 100)}%` }} /></div><strong>{value}</strong></div>;
}

function summarizeDeals(deals: Deal[]) {
  const pursue = deals.filter((deal) => (deal.status || deal.recommendation).toLowerCase() === 'pursue').length;
  const review = deals.filter((deal) => (deal.status || deal.recommendation).toLowerCase() === 'review').length;
  const pass = deals.filter((deal) => (deal.status || deal.recommendation).toLowerCase() === 'pass').length;
  const pipeline = deals.reduce((sum, deal) => sum + Number(deal.loan_amount_requested || deal.equipment_cost || 0), 0);
  const avgDealSize = deals.length ? pipeline / deals.length : 0;
  const confidenceValues = deals.map((deal) => deal.confidence_score || 0).filter(Boolean);
  const avgConfidence = confidenceValues.length ? Math.round(confidenceValues.reduce((sum, value) => sum + value, 0) / confidenceValues.length) : 0;
  return { pursue, review, pass, pipeline, avgDealSize, avgConfidence };
}

export { App };
