export interface ProjectFile {
  id: string;
  name: string;
  type: 'csv' | 'pdf' | 'doc' | 'md';
  size: string;
  updatedAt: string;
  summary: string;
  contentLines: Array<Record<string, string>>;
}

export interface BrowserTabContext {
  id: string;
  title: string;
  domain: string;
  url: string;
  category: 'github' | 'figma' | 'stripe' | 'linear';
  snippet: string;
}

export interface LearnedRule {
  id: string;
  client: string;
  rule: string;
  source: string;
  dateAdded: string;
  enabled: boolean;
}

export interface WorkspaceSkill {
  id: string;
  name: string;
  category: 'Finance' | 'Communication' | 'Engineering' | 'Legal';
  version: string;
  runs: string;
  description: string;
  tools: string[];
  enabled: boolean;
}

export const MOCK_PROJECT_FILES: ProjectFile[] = [
  {
    id: 'file-1',
    name: 'October Tracked Hours.csv',
    type: 'csv',
    size: '14.2 KB',
    updatedAt: 'Today, 8:15 AM',
    summary: '142.5 billable hours across Acme Corp and Lumen Labs for October 2026',
    contentLines: [
      { Client: 'Acme Corp', Task: 'Frontend Canvas Engine v2', Hours: '54.0', Rate: '$255.00', Total: '$13,770.00' },
      { Client: 'Acme Corp', Task: 'API Gateway & Webhook Sync', Hours: '38.5', Rate: '$255.00', Total: '$9,817.50' },
      { Client: 'Acme Corp', Task: 'QA & Accessibility Audit', Hours: '30.0', Rate: '$255.00', Total: '$7,650.00' },
      { Client: 'Lumen Labs', Task: 'Interactive Prototype Review', Hours: '20.0', Rate: '$260.00', Total: '$5,200.00' },
    ],
  },
  {
    id: 'file-2',
    name: 'Invoice-INV-2026-118.pdf',
    type: 'pdf',
    size: '184 KB',
    updatedAt: 'Today, 9:42 AM',
    summary: 'Acme Corp billing invoice for October 2026 with PO 4471-B',
    contentLines: [
      { Item: 'Senior Design Engineering', Qty: '92.5 hrs', Rate: '$255.00', Amount: '$23,587.50' },
      { Item: 'Architecture & Performance Optimization', Qty: '30.0 hrs', Rate: '$255.00', Amount: '$7,662.50' },
      { Item: 'Purchase Order Reference', Qty: '1', Rate: 'PO 4471-B', Amount: 'Verified' },
      { Item: 'Total Amount Due', Qty: 'Net 30', Rate: 'Due Nov 23', Amount: '$31,250.00' },
    ],
  },
  {
    id: 'file-3',
    name: 'Lumen_SOW_signed.pdf',
    type: 'pdf',
    size: '412 KB',
    updatedAt: 'Oct 1, 2026',
    summary: 'Master Services Agreement & Q4 Statement of Work with Lumen Labs',
    contentLines: [
      { Term: 'Hourly Billing Rate', Value: '$260.00 / hr USD' },
      { Term: 'Milestone Cycle', Value: 'Bi-weekly demo every second Thursday' },
      { Term: 'Primary Reviewer', Value: 'Kai Lindqvist & Ines Duarte' },
      { Term: 'Preferred Delivery Mode', Value: 'Loom walkthrough link (no raw attachments)' },
    ],
  },
  {
    id: 'file-4',
    name: 'Contract_MSA_Acme_v3.docx',
    type: 'doc',
    size: '95 KB',
    updatedAt: 'Sep 28, 2026',
    summary: 'Standard Enterprise Master Services Agreement with Acme Corporation',
    contentLines: [
      { Clause: 'Liability Cap', Details: 'Capped at 12 months of paid consulting fees' },
      { Clause: 'Payment Terms', Details: 'Net 30 days upon receipt of valid PO invoice' },
      { Clause: 'IP Ownership', Details: 'Work product transferred upon full settlement' },
    ],
  },
  {
    id: 'file-5',
    name: 'Engineering_Changelog_w42.md',
    type: 'md',
    size: '8.4 KB',
    updatedAt: 'Oct 17, 2026',
    summary: 'Linear and GitHub milestones shipped during Week 42',
    contentLines: [
      { Ticket: 'PR #182', Title: 'Eliminated canvas pan lag with direct RAF blit' },
      { Ticket: 'PR #184', Title: 'Added non-passive wheel handler for Ctrl zoom' },
      { Ticket: 'PR #185', Title: 'Universal Inter typography across all 11 boards' },
    ],
  },
];

export const MOCK_BROWSER_TABS: BrowserTabContext[] = [
  {
    id: 'tab-1',
    title: 'PR #182 Fix billing webhooks and payment retry logic',
    domain: 'github.com',
    url: 'https://github.com/northwind/dealcraft/pull/182',
    category: 'github',
    snippet: 'Merged 4 commits into main: added idempotency keys for Stripe webhook callbacks.',
  },
  {
    id: 'tab-2',
    title: 'Northwind Design System v2.4 (Components & Boards)',
    domain: 'figma.com',
    url: 'https://figma.com/@northwind/design-system-v24',
    category: 'figma',
    snippet: '3x3 Board exploration canvas with Thread, Workbench, and Desk routines.',
  },
  {
    id: 'tab-3',
    title: 'Stripe Billing · October Invoices & Aging Balances',
    domain: 'dashboard.stripe.com',
    url: 'https://dashboard.stripe.com/invoices/2026-10',
    category: 'stripe',
    snippet: 'Total pending: $36,450.00 across Acme Corp ($31,250.00) and Lumen Labs ($5,200.00).',
  },
  {
    id: 'tab-4',
    title: 'Linear · Q4 Interactive Canvas Milestones',
    domain: 'linear.app',
    url: 'https://linear.app/northwind/project/canvas-q4',
    category: 'linear',
    snippet: '14 issues closed, 3 active in review. On track for client prototype demonstration.',
  },
];

export const MOCK_LEARNED_RULES: LearnedRule[] = [
  {
    id: 'rule-1',
    client: 'Acme Corp',
    rule: 'Acme needs a PO number on every invoice (PO 4471-B)',
    source: 'Invoice clients from tracked hours · 4 runs by Jonas',
    dateAdded: 'Oct 12, 2026',
    enabled: true,
  },
  {
    id: 'rule-2',
    client: 'Acme Corp',
    rule: 'Always cc Jonas Berg on billing emails to Priya Raman',
    source: 'Client email, enterprise · Maya instruction in chat',
    dateAdded: 'Oct 14, 2026',
    enabled: true,
  },
  {
    id: 'rule-3',
    client: 'Lumen Labs',
    rule: 'Lumen prefers Loom links over attachments',
    source: 'Client email, startups · 6 email threads analyzed',
    dateAdded: 'Oct 16, 2026',
    enabled: true,
  },
  {
    id: 'rule-4',
    client: 'Northwind Legal',
    rule: 'Cap liability at 12 months of fees in all client MSA redlines',
    source: "Legal docs in house style · Daniel's last 3 redlines",
    dateAdded: 'Sep 29, 2026',
    enabled: true,
  },
  {
    id: 'rule-5',
    client: 'General Brief',
    rule: 'Skip automated marketing newsletters and product digests in morning brief',
    source: 'Morning brief feedback · Oct 14 brief',
    dateAdded: 'Oct 14, 2026',
    enabled: true,
  },
];

export const MOCK_WORKSPACE_SKILLS: WorkspaceSkill[] = [
  {
    id: 'sk-1',
    name: 'Invoice clients from tracked hours',
    category: 'Finance',
    version: 'v24',
    runs: '1,254 runs',
    description: 'Calculates consultant hours, verifies client contracts & POs, and drafts invoice PDFs.',
    tools: ['Harvest', 'Stripe', 'Accounting DB', 'PDF Generator'],
    enabled: true,
  },
  {
    id: 'sk-2',
    name: 'Client email, enterprise',
    category: 'Communication',
    version: 'v38',
    runs: '2,098 runs',
    description: 'Drafts executive communications matching client tone, compliance guidelines, and contract references.',
    tools: ['Mail', 'CRM', 'Tone Checker'],
    enabled: true,
  },
  {
    id: 'sk-3',
    name: 'Client email, startups',
    category: 'Communication',
    version: 'v41',
    runs: '3,410 runs',
    description: 'Generates concise, direct updates with embedded video demo links for fast-moving founders.',
    tools: ['Mail', 'Loom API', 'Slack'],
    enabled: true,
  },
  {
    id: 'sk-4',
    name: 'Call prep notes & agenda',
    category: 'Communication',
    version: 'v27',
    runs: '1,890 runs',
    description: 'Summarizes attendee backgrounds, prior agreements, and key talking points for client syncs.',
    tools: ['Calendar', 'LinkedIn', 'Past chats', 'Linear'],
    enabled: true,
  },
  {
    id: 'sk-5',
    name: 'Legal docs in house style',
    category: 'Legal',
    version: 'v12',
    runs: '412 runs',
    description: 'Scans contracts and applies approved company redlines, liability caps, and standard clauses.',
    tools: ['DocuSign', 'Legal drive', 'Diff Engine'],
    enabled: true,
  },
  {
    id: 'sk-6',
    name: 'Research ambiguous IT ticket',
    category: 'Engineering',
    version: 'v19',
    runs: '959 runs',
    description: 'Correlates crash logs, SSO tokens, and Git commits to propose automated PR fixes.',
    tools: ['Zendesk', 'Okta', 'GitHub', 'Sentry'],
    enabled: true,
  },
  {
    id: 'sk-7',
    name: 'Weekly status report generator',
    category: 'Engineering',
    version: 'v4',
    runs: '840 runs',
    description: 'Aggregates shipped PRs, Figma releases, and roadmap progress into a clean client digest.',
    tools: ['GitHub', 'Linear', 'Figma API'],
    enabled: true,
  },
  {
    id: 'sk-8',
    name: 'Chase overdue client invoices',
    category: 'Finance',
    version: 'v16',
    runs: '310 runs',
    description: 'Monitors aging accounts receivable and drafts polite reminders with secure payment links.',
    tools: ['Stripe', 'Billing Portal', 'Mail'],
    enabled: true,
  },
];
