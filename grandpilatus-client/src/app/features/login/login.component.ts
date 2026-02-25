import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSnackBarModule, MatIconModule
  ],
  template: `
  <div class="luxury-login-container">
    <div class="login-frame">
      <div class="brand-header">
        <span class="subtitle">Willkommen bei</span>
        <h1 class="title">Grand Pilatus</h1>
      </div>

      <mat-card class="luxury-card">
        <div class="card-header">
          <h2>Concierge Login</h2>
          <div class="gold-divider"></div>
        </div>
        
        <form [formGroup]="form" (ngSubmit)="submit()">
          <mat-form-field appearance="outline" class="full custom-field">
            <mat-label>E-Mail-Adresse</mat-label>
            <input matInput formControlName="email" type="email" required>
            <mat-icon matSuffix class="gold-icon">mail_outline</mat-icon>
            <mat-error *ngIf="form.get('email')?.hasError('required')">E-Mail ist erforderlich</mat-error>
            <mat-error *ngIf="form.get('email')?.hasError('email')">Bitte geben Sie eine gültige E-Mail ein</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full custom-field">
            <mat-label>Passwort</mat-label>
            <input matInput formControlName="password" type="password" required>
            <mat-icon matSuffix class="gold-icon">lock_outline</mat-icon>
            <mat-error *ngIf="form.get('password')?.hasError('required')">Passwort ist erforderlich</mat-error>
          </mat-form-field>

          <button mat-raised-button color="primary" class="full luxury-btn" [disabled]="form.invalid || loading">
            <span *ngIf="!loading">ZUM DASHBOARD</span>
            <span *ngIf="loading">ÜBERPRÜFE...</span>
          </button>
        </form>
      </mat-card>
      
      <div class="footer-note">
        <p>&copy; 2026 Grand Pilatus Resorts</p>
      </div>
    </div>
  </div>
  `,
  styles: [`
    .luxury-login-container {
      min-height: 100vh;
      width: 100%;
      background: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url('/luxury-winter.png');
      background-size: cover;
      background-position: center;
      display: grid;
      place-items: center;
      font-family: var(--font-sans);
    }

    .login-frame {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 24px;
      width: 100%;
      max-width: 420px;
      padding: 24px 16px;
      animation: fadeIn 0.8s ease-out;
      box-sizing: border-box;
    }

    .brand-header {
      text-align: center;
      color: #fff;
      text-shadow: 0 2px 10px rgba(0,0,0,0.3);

      .subtitle {
        text-transform: uppercase;
        letter-spacing: 0.3em;
        font-size: 11px;
        color: var(--color-gold);
        display: block;
        margin-bottom: 8px;
      }
      .title {
        font-family: var(--font-serif);
        font-size: 48px;
        margin: 0;
        font-weight: 400;
        color: #fff; /* Explicit white for contrast */
      }
    }

    .luxury-card {
      width: 100%;
      padding: 32px 24px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 20px 40px rgba(0,0,0,0.2);
      border-radius: 2px;
      box-sizing: border-box;
    }

    .card-header {
      text-align: center;
      margin-bottom: 32px;

      h2 {
        font-family: var(--font-serif);
        color: var(--color-charcoal);
        font-size: 28px;
        margin: 0 0 16px 0;
      }

      .gold-divider {
        height: 2px;
        width: 40px;
        background-color: var(--color-gold);
        margin: 0 auto;
      }
    }

    .full { width: 100%; }
    
    .custom-field {
      margin-bottom: 8px;
    }

    .gold-icon {
      color: var(--color-gold-dark);
    }

    .luxury-btn {
      height: 48px;
      font-size: 14px;
      letter-spacing: 0.15em;
      margin-top: 16px;
      border-radius: 0;
    }

    .footer-note {
      color: rgba(255,255,255,0.6);
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 480px) {
      .luxury-login-container {
        align-items: flex-start;
        padding-top: 0;
      }

      .login-frame {
        gap: 0;
        padding: 0;
        max-width: 100%;
      }

      .brand-header {
        padding: 48px 24px 32px;
        width: 100%;
        box-sizing: border-box;

        .title {
          font-size: 36px;
        }

        .subtitle {
          font-size: 10px;
        }
      }

      .luxury-card {
        border-radius: 0;
        padding: 28px 20px;
        border-left: none;
        border-right: none;
      }

      .footer-note {
        padding: 20px;
      }
    }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snack = inject(MatSnackBar);

  loading = false;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    const { email, password } = this.form.value as { email: string; password: string };
    // After login redirect back to the page the guard captured (if any)
    this.auth.login(email, password).subscribe({
      next: () => {
        this.loading = false;
        const r = this.route.snapshot.queryParamMap.get('r') || '/campaigns';
        this.router.navigateByUrl(r);
      },
      error: (e) => {
        this.loading = false;
        this.snack.open(e?.error?.error || 'Anmeldung fehlgeschlagen', 'OK', { duration: 3500 });
      }
    });
  }
}
