import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { LandingPage } from '../../../shared/models/landing-page.model';

@Component({
  selector: 'app-landing-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatSnackBarModule
  ],
  template: `
  <div class="luxury-form-wrap">
    <div class="form-header">
      <h2>{{ isEdit ? 'Landing Page bearbeiten' : 'Neue Landing Page' }}</h2>
      <div class="gold-divider"></div>
    </div>

    <mat-card class="luxury-card">
      <form [formGroup]="form" (ngSubmit)="save()">
        <mat-form-field class="full" appearance="outline">
          <mat-label>Titel</mat-label>
          <input matInput formControlName="title" required>
        </mat-form-field>

        <mat-form-field class="full" appearance="outline">
          <mat-label>URL Slug</mat-label>
          <input matInput formControlName="url" required placeholder="z.B. winter-spezial">
        </mat-form-field>

        <mat-form-field class="full" appearance="outline">
          <mat-label>HTML Inhalt</mat-label>
          <textarea matInput rows="10" formControlName="bodyHtml" required style="font-family: monospace; font-size: 13px;"></textarea>
          <mat-hint>Geben Sie den rohen HTML-Inhalt für die Landing Page ein</mat-hint>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full">
          <mat-label>Veröffentlichungsstatus</mat-label>
          <mat-select formControlName="status">
            <mat-option value="draft">Entwurf</mat-option>
            <mat-option value="published">Veröffentlicht</mat-option>
          </mat-select>
        </mat-form-field>

        <div class="actions">
          <button mat-button type="button" (click)="cancel()">ABBRECHEN</button>
          <button mat-raised-button color="primary" [disabled]="form.invalid">{{ isEdit ? 'SEITE AKTUALISIEREN' : 'SEITE ERSTELLEN' }}</button>
        </div>
      </form>
    </mat-card>
  </div>
  `,
  styles: [`
    .luxury-form-wrap {
      max-width: 700px;
      margin: 0 auto;
      padding: 40px 16px;
    }
    
    .form-header {
      text-align: center;
      margin-bottom: 32px;
      h2 {
        font-family: var(--font-serif);
        font-size: 32px;
        color: var(--color-charcoal);
        margin: 0;
      }
      .gold-divider {
        height: 3px;
        width: 60px;
        background-color: var(--color-gold);
        margin: 12px auto;
      }
    }

    .luxury-card {
      padding: 32px;
      border-radius: 4px;
      border: 1px solid rgba(0,0,0,0.05);
    }

    .full { width: 100%; margin-bottom: 8px; }
    
    .actions {
      margin-top: 32px;
      display: flex;
      justify-content: center;
      gap: 16px;
      
      button {
        min-width: 140px;
        letter-spacing: 0.1em;
      }
    }
  `]
})
export class LandingFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snack = inject(MatSnackBar);

  id: string | null = null;
  isEdit = false;

  form = this.fb.group({
    title: ['', Validators.required],
    bodyHtml: ['', Validators.required],
    url: ['', Validators.required],
    status: this.fb.control<'draft' | 'published'>('draft')
  });

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.id;
    if (this.isEdit) {
      this.api.getLandingPage(this.id!).subscribe(lp => this.form.patchValue(lp));
    }
  }

  save() {
    const v = this.form.value as LandingPage;
    if (this.isEdit) {
      this.api.updateLandingPage(this.id!, v).subscribe({
        next: () => { this.snack.open('Aktualisiert', 'OK', { duration: 2000 }); this.router.navigateByUrl('/landing-pages'); },
        error: e => this.snack.open(e?.error?.error || 'Aktualisierung fehlgeschlagen', 'OK', { duration: 3500 })
      });
    } else {
      this.api.createLandingPage(v).subscribe({
        next: () => { this.snack.open('Erstellt', 'OK', { duration: 2000 }); this.router.navigateByUrl('/landing-pages'); },
        error: e => this.snack.open(e?.error?.error || 'Erstellung fehlgeschlagen', 'OK', { duration: 3500 })
      });
    }
  }

  cancel() { this.router.navigateByUrl('/landing-pages'); }
}
