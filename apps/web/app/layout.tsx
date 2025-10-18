import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'BFS Storefront',
  description: 'Composable tenant-aware storefront',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="container site-header__inner">
            <span className="site-header__logo">BFS Market</span>
            <nav className="site-header__links">
              <a href="#products">Products</a>
              <a href="#categories">Categories</a>
              <a href="#why">Why BFS</a>
            </nav>
            <a className="site-header__cta" href="#newsletter">
              Join newsletter →
            </a>
          </div>
        </header>
        {children}
        <footer className="footer">
          <div className="container footer__content">
            <span>© {new Date().getFullYear()} BFS Storefront. Crafted for multi-tenant commerce.</span>
            <span>Need a custom build? hello@bfs.store</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
