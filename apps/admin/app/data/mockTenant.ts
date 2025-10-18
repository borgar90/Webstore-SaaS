export const tenantSummary = {
  storeName: 'Nordic Soap Co.',
  domain: 'nordicsoap.no',
  plan: 'Scale (tenant-isolated DB)',
  lastDeployment: 'Deployed 2 hours ago by sofia@bfs.dev',
  activeModules: 9,
};

export const metrics = [
  { id: 'revenue', label: 'Monthly revenue', value: 'NOK 482k', change: '+12% vs last month' },
  { id: 'orders', label: 'Orders', value: '1,842', change: '+8% vs last month' },
  { id: 'aov', label: 'Average order value', value: 'NOK 262', change: '+3% vs last month' },
  { id: 'conversion', label: 'Conversion rate', value: '3.2%', change: '+0.4pp vs last month' },
];

export const modules = [
  {
    id: 'discount-codes',
    name: 'Discount codes',
    description: 'Campaign codes, stack rules, and automatic promotions.',
    enabled: true,
  },
  {
    id: 'newsletter',
    name: 'Newsletter',
    description: 'Collect subscribers and sync to your ESP of choice.',
    enabled: true,
  },
  {
    id: 'reviews',
    name: 'Reviews',
    description: 'Gather product reviews with moderation workflows.',
    enabled: false,
  },
  {
    id: 'loyalty',
    name: 'Loyalty program',
    description: 'Reward repeat customers with points and perks.',
    enabled: false,
  },
];

export const themes = [
  {
    id: 'neon-minimal',
    name: 'Neon Minimal',
    status: 'active' as const,
    description: 'High-contrast theme optimised for bold product photography.',
  },
  {
    id: 'fjord-fresh',
    name: 'Fjord Fresh',
    status: 'draft' as const,
    description: 'Seasonal theme inspired by nordic colour palettes.',
  },
  {
    id: 'evergreen',
    name: 'Evergreen',
    status: 'draft' as const,
    description: 'Calming theme with focus on sustainability storytelling.',
  },
];

export const activity = [
  {
    id: 'deploy-1',
    title: 'Deployment complete',
    timestamp: 'Today • 11:08',
    actor: 'sofia@bfs.dev',
  },
  {
    id: 'module-1',
    title: 'Enabled newsletter module',
    timestamp: 'Yesterday • 16:42',
    actor: 'mohamed@nordicsoap.no',
  },
  {
    id: 'theme-1',
    title: 'Updated Neon Minimal color palette',
    timestamp: 'Yesterday • 09:14',
    actor: 'eva@nordicsoap.no',
  },
];
