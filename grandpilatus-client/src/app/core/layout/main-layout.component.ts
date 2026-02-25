import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  template: `
    <div class="layout-container">
      <header class="luxury-header">
        <div class="header-content">
          <div class="brand">
            <span class="brand-subtitle">The</span>
            <span class="brand-title">Grand Pilatus</span>
          </div>

          <nav class="main-nav">
            <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
            <a routerLink="/campaigns" routerLinkActive="active">Kampagnen</a>
            <a routerLink="/landing-pages" routerLinkActive="active">Landing Pages</a>
            <a routerLink="/segments" routerLinkActive="active">Segmente</a>
            <a routerLink="/reporting" routerLinkActive="active">Berichte</a>
          </nav>

          <div class="user-actions">
             <button mat-button [matMenuTriggerFor]="userMenu" class="user-btn">
              <span class="user-name">Concierge</span>
              <mat-icon>expand_more</mat-icon>
             </button>
             <mat-menu #userMenu="matMenu">
               <button mat-menu-item (click)="logout()">Abmelden</button>
             </mat-menu>

             <button class="hamburger-btn" (click)="toggleMenu()" aria-label="Navigation öffnen">
               <mat-icon>{{ menuOpen ? 'close' : 'menu' }}</mat-icon>
             </button>
          </div>
        </div>
      </header>

      <div class="mobile-overlay" [class.open]="menuOpen" (click)="closeMenu()"></div>

      <nav class="mobile-nav" [class.open]="menuOpen">
        <div class="mobile-nav-brand">
          <span class="brand-subtitle">The</span>
          <span class="brand-title">Grand Pilatus</span>
        </div>
        <a routerLink="/dashboard" routerLinkActive="active" (click)="closeMenu()">Dashboard</a>
        <a routerLink="/campaigns" routerLinkActive="active" (click)="closeMenu()">Kampagnen</a>
        <a routerLink="/landing-pages" routerLinkActive="active" (click)="closeMenu()">Landing Pages</a>
        <a routerLink="/segments" routerLinkActive="active" (click)="closeMenu()">Segmente</a>
        <a routerLink="/reporting" routerLinkActive="active" (click)="closeMenu()">Berichte</a>
        <div class="mobile-nav-divider"></div>
        <button class="mobile-logout-btn" (click)="logout()">Abmelden</button>
      </nav>

      <main class="main-content">
        <router-outlet></router-outlet>
      </main>

      <footer class="luxury-footer">
        <p>&copy; 2026 Grand Pilatus - Alle Rechte vorbehalten.</p>
      </footer>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background-color: var(--color-cream);
      width: 100%;
      box-sizing: border-box;
      overflow-x: hidden;
    }

    .layout-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      width: 100%;
    }

    .luxury-header {
      background-color: var(--color-charcoal);
      color: var(--color-white);
      height: 70px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      border-bottom: 2px solid var(--color-gold);
      width: 100%;
      box-sizing: border-box;
    }

    .header-content {
      width: 100%;
      max-width: 1400px;
      padding: 0 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
    }

    .brand {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      line-height: 1;
    }

    .brand .brand-subtitle {
      font-family: var(--font-sans);
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      color: var(--color-gold);
      margin-left: 2px;
    }

    .brand .brand-title {
      font-family: var(--font-serif);
      font-size: 24px;
      color: var(--color-white);
    }

    .main-nav {
      display: flex;
      gap: 32px;
    }

    .main-nav a {
      color: rgba(255,255,255,0.7);
      text-transform: uppercase;
      font-size: 13px;
      letter-spacing: 0.1em;
      font-weight: 400;
      text-decoration: none;
      position: relative;
      padding-bottom: 4px;
    }

    .main-nav a:hover,
    .main-nav a.active {
      color: var(--color-gold);
    }

    .main-nav a.active::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 1px;
      background-color: var(--color-gold);
    }

    .user-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .user-btn {
      color: var(--color-white) !important;
      font-family: var(--font-sans);
    }

    .user-btn .user-name {
      margin-right: 8px;
      font-weight: 300;
      color: var(--color-white);
    }

    .user-btn mat-icon {
      color: var(--color-gold);
    }

    /* Hamburger – hidden on desktop */
    .hamburger-btn {
      display: none;
      background: none;
      border: none;
      cursor: pointer;
      color: var(--color-white);
      padding: 8px;
      line-height: 1;
      align-items: center;
      justify-content: center;
    }

    .hamburger-btn mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
      color: var(--color-gold);
    }

    /* Mobile overlay */
    .mobile-overlay {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.5);
      z-index: 1100;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
    }

    .mobile-overlay.open {
      opacity: 1;
      pointer-events: auto;
    }

    /* Mobile slide-in drawer */
    .mobile-nav {
      display: none;
      position: fixed;
      top: 0;
      right: 0;
      width: 280px;
      height: 100%;
      background-color: var(--color-charcoal);
      border-left: 2px solid var(--color-gold);
      z-index: 1200;
      flex-direction: column;
      padding: 32px 24px;
      transform: translateX(100%);
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: -8px 0 30px rgba(0,0,0,0.3);
      box-sizing: border-box;
    }

    .mobile-nav.open {
      transform: translateX(0);
    }

    .mobile-nav-brand {
      display: flex;
      flex-direction: column;
      margin-bottom: 40px;
    }

    .mobile-nav-brand .brand-subtitle {
      font-family: var(--font-sans);
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      color: var(--color-gold);
    }

    .mobile-nav-brand .brand-title {
      font-family: var(--font-serif);
      font-size: 22px;
      color: var(--color-white);
    }

    .mobile-nav a {
      color: rgba(255,255,255,0.7);
      text-transform: uppercase;
      font-size: 14px;
      letter-spacing: 0.12em;
      font-weight: 400;
      text-decoration: none;
      padding: 16px 0;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      transition: color 0.2s ease;
    }

    .mobile-nav a:hover,
    .mobile-nav a.active {
      color: var(--color-gold);
    }

    .mobile-nav-divider {
      flex: 1;
    }

    .mobile-logout-btn {
      background: none;
      border: 1px solid rgba(255,255,255,0.15);
      color: rgba(255,255,255,0.6);
      font-family: var(--font-sans);
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      padding: 12px 16px;
      cursor: pointer;
      border-radius: 2px;
      width: 100%;
      margin-top: 16px;
      transition: all 0.2s ease;
    }

    .mobile-logout-btn:hover {
      border-color: var(--color-gold);
      color: var(--color-gold);
    }

    .main-content {
      flex: 1;
      width: 100%;
      max-width: 1400px;
      margin: 0 auto;
      padding: 40px 24px;
      box-sizing: border-box;
    }

    .luxury-footer {
      background-color: var(--color-charcoal);
      color: rgba(255,255,255,0.4);
      padding: 24px 20px;
      text-align: center;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      border-top: 1px solid rgba(255,255,255,0.05);
      width: 100%;
      box-sizing: border-box;
    }

    /* ========== Mobile breakpoint ========== */
    @media (max-width: 768px) {
      .main-nav {
        display: none;
      }

      .user-btn {
        display: none !important;
      }

      .hamburger-btn {
        display: flex;
      }

      .mobile-overlay {
        display: block;
      }

      .mobile-nav {
        display: flex;
      }

      .main-content {
        padding: 20px 16px;
      }
    }
  `]
})
export class MainLayoutComponent {
  private auth = inject(AuthService);
  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  logout() {
    this.menuOpen = false;
    this.auth.logout();
  }
}
