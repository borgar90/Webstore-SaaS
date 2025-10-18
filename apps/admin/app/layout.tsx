import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { SidebarNav } from './components/SidebarNav';

export const metadata: Metadata = {
  title: 'BFS Admin',
  description: 'Tenant administration dashboard scaffold',
};

const NAV_LINKS = [
  { href: '/overview', label: 'Overview' },
  { href: '/modules', label: 'Modules' },
  { href: '/catalog', label: 'Catalog' },
  { href: '/themes', label: 'Themes' },
  { href: '/activity', label: 'Activity' },
];

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="dashboard-shell">
          <aside className="sidebar">
            <div className="sidebar__logo">BFS Control</div>
            <SidebarNav links={NAV_LINKS} />
            <div className="sidebar__footer">Status: All systems operational</div>
          </aside>
          <div className="main-surface">{children}</div>
        </div>
      </body>
    </html>
  );
}
