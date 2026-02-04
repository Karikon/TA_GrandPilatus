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
            <!-- Luxury minimalist user menu -->
             <button mat-button [matMenuTriggerFor]="userMenu" class="user-btn">
              <span class="user-name">Concierge</span>
              <mat-icon>expand_more</mat-icon>
             </button>
             <mat-menu #userMenu="matMenu">
               <button mat-menu-item (click)="logout()">Abmelden</button>
             </mat-menu>
          </div>
        </div>
      </header>

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
    }

    .layout-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .luxury-header {
      background-color: var(--color-charcoal);
      color: var(--color-white);
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      border-bottom: 2px solid var(--color-gold);
    }

    .header-content {
      width: 100%;
      max-width: 1400px;
      padding: 0 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .brand {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      line-height: 1;

      .brand-subtitle {
        font-family: var(--font-sans);
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.2em;
        color: var(--color-gold);
        margin-left: 2px;
      }
      .brand-title {
        font-family: var(--font-serif);
        font-size: 24px;
        color: var(--color-white);
      }
    }

    .main-nav {
      display: flex;
      gap: 32px;

      a {
        color: rgba(255,255,255,0.7);
        text-transform: uppercase;
        font-size: 13px;
        letter-spacing: 0.1em;
        font-weight: 400;
        text-decoration: none;
        position: relative;
        padding-bottom: 4px;

        &:hover, &.active {
          color: var(--color-gold);
        }

        &.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 1px;
          background-color: var(--color-gold);
        }
      }
    }

    .user-btn {
      color: var(--color-white) !important;
      font-family: var(--font-sans);
      
      .user-name {
        margin-right: 8px;
        font-weight: 300;
        color: var(--color-white);
      }
      
      mat-icon {
        color: var(--color-gold);
      }
    }

    .main-content {
      flex: 1;
      width: 100%;
      max-width: 1400px;
      margin: 0 auto;
      padding: 40px 24px;
    }

    .luxury-footer {
      background-color: var(--color-charcoal);
      color: rgba(255,255,255,0.4);
      padding: 24px;
      text-align: center;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      border-top: 1px solid rgba(255,255,255,0.05);
    }
  `]
})
export class MainLayoutComponent {
  private auth = inject(AuthService);

  logout() {
    this.auth.logout();
  }
}
