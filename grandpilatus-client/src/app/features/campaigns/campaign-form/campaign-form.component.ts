import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOptionModule } from '@angular/material/core';
import { MatNativeDateModule } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { ApiService } from '../../../core/services/api.service';
import { Campaign } from '../../../shared/models/campaign.model';
import { CustomerSegment } from '../../../shared/models/customer.model';
import { LandingPage } from '../../../shared/models/landing-page.model';

@Component({
  selector: 'app-campaign-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule,
    MatDatepickerModule, MatNativeDateModule, MatSnackBarModule, MatOptionModule, MatSelectModule
  ],
  template: `
  <div class="luxury-form-wrap">
    <div class="form-header">
      <h2>{{ isEdit() ? 'Kampagne bearbeiten' : 'Neue Kampagne' }}</h2>
      <div class="gold-divider"></div>
    </div>

    <mat-card class="luxury-card">
      <form [formGroup]="form" (ngSubmit)="save()">
        <mat-form-field class="full" appearance="outline">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" required>
        </mat-form-field>

        <h3 class="section-title">Landing Page</h3>
        <mat-form-field class="full" appearance="outline">
          <mat-label>Landing Page</mat-label>
          <mat-select formControlName="landingPage">
            <mat-option [value]="null">— keine —</mat-option>
            <mat-option *ngFor="let lp of landingPages" [value]="lp._id!">
              {{ lp.title }} ({{ lp.status }})
            </mat-option>
          </mat-select>
        </mat-form-field>

        <h3 class="section-title">Kundensegmente</h3>
        <mat-form-field class="full" appearance="outline">
          <mat-label>Segmente</mat-label>
          <mat-select formControlName="segments" multiple>
            <mat-option *ngFor="let s of segmentsList" [value]="s._id!">
              {{ s.title }} ({{ (s.customers || []).length }})
            </mat-option>
          </mat-select>
        </mat-form-field>

        <h3 class="section-title">Zeitplan</h3>
        <div [formGroup]="form.controls['schedule']" class="schedule-grid">
          <mat-form-field appearance="outline">
            <mat-label>Start</mat-label>
            <input matInput [matDatepicker]="dpStart" formControlName="startAt">
            <mat-datepicker-toggle matIconSuffix [for]="dpStart"></mat-datepicker-toggle>
            <mat-datepicker #dpStart></mat-datepicker>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Ende</mat-label>
            <input matInput [matDatepicker]="dpEnd" formControlName="endAt">
            <mat-datepicker-toggle matIconSuffix [for]="dpEnd"></mat-datepicker-toggle>
            <mat-datepicker #dpEnd></mat-datepicker>
          </mat-form-field>
        </div>

        <div class="actions">
          <button mat-button type="button" (click)="cancel()">ABBRECHEN</button>
          <button mat-raised-button color="primary" [disabled]="form.invalid">{{ isEdit() ? 'KAMPAGNE AKTUALISIEREN' : 'KAMPAGNE ERSTELLEN' }}</button>
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

    .section-title {
      font-family: var(--font-serif);
      font-size: 18px;
      margin-top: 24px;
      margin-bottom: 12px;
      color: var(--color-charcoal);
      border-bottom: 1px solid #eee;
      padding-bottom: 8px;
    }

    .full { width: 100%; }
    
    .schedule-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

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
export class CampaignFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private api = inject(ApiService);
  private snack = inject(MatSnackBar);
  segmentsList: CustomerSegment[] = [];
  landingPages: LandingPage[] = [];

  id = signal<string | null>(null);

  form = this.fb.group({
    name: ['', Validators.required],
    landingPage: this.fb.control<string | null>(null),
    segments: this.fb.control<string[]>([]),
    segmentCriteriaKV: this.fb.array<FormGroup>([]),
    schedule: this.fb.group({
      startAt: [null as Date | null],
      endAt: [null as Date | null],
    }),
  });

  ngOnInit() {
    // Load supporting data first so dropdowns populate before the user edits
    this.api.listSegments().subscribe(s => this.segmentsList = s);
    this.api.listLandingPages().subscribe(lp => this.landingPages = lp);
    this.id.set(this.route.snapshot.paramMap.get('id'));
    if (this.isEdit()) {
      this.api.getCampaign(this.id()!).subscribe(c => this.fill(c));
    } else {
      this.addKV();
    }
  }

  isEdit = () => !!this.id();

  kv = () => this.form.get('segmentCriteriaKV') as FormArray;

  // Dynamic key/value inputs let marketers add light filters on the fly
  addKV() { this.kv().push(this.fb.group({ key: [''], value: [''] })); }
  removeKV(i: number) { this.kv().removeAt(i); }

  private buildSegmentObj(): Record<string, any> {
    const o: Record<string, any> = {};
    for (const g of this.kv().controls) {
      const { key, value } = g.value as { key: string; value: string };
      if (key) o[key] = value;
    }
    return o;
  }

  private toPayload(): Partial<Campaign> {
    const v = this.form.value as any;
    // Convert datepicker values into ISO strings the API accepts
    const startIso = v.schedule?.startAt ? new Date(v.schedule.startAt).toISOString() : undefined;
    const endIso = v.schedule?.endAt ? new Date(v.schedule.endAt).toISOString() : undefined;
    return {
      name: v.name,
      landingPage: v.landingPage || undefined,
      segments: v.segments || [],
      segmentCriteria: this.buildSegmentObj(),
      schedule: (startIso && endIso) ? { startAt: startIso, endAt: endIso } : undefined
    };
  }


  private fill(c: Campaign) {
    // Patch the form with existing data so editing feels instant
    this.form.patchValue({
      name: c.name,
      landingPage: c.landingPage ? (typeof c.landingPage === 'string' ? c.landingPage : c.landingPage._id!) : null,
      segments: (c.segments || []).map(s => typeof s === 'string' ? s : (s._id as string)),
      schedule: {
        startAt: c.schedule?.startAt ? new Date(c.schedule.startAt) : null,
        endAt: c.schedule?.endAt ? new Date(c.schedule.endAt) : null
      }
    });
    this.kv().clear();
    const seg = c.segmentCriteria || {};
    const entries = Object.entries(seg);
    // Ensure there is always at least one row for the key/value editor
    if (entries.length === 0) this.addKV();
    for (const [k, v] of entries) this.kv().push(this.fb.group({ key: [k], value: [String(v)] }));
  }

  save() {
    const payload = this.toPayload();
    if (this.isEdit()) {
      this.api.updateCampaign(this.id()!, payload).subscribe({
        next: () => { this.snack.open('Aktualisiert', 'OK', { duration: 2000 }); this.router.navigateByUrl('/campaigns'); },
        error: e => this.snack.open(this.msg(e), 'OK', { duration: 3500 })
      });
    } else {
      this.api.createCampaign(payload as Campaign).subscribe({
        next: () => { this.snack.open('Erstellt', 'OK', { duration: 2000 }); this.router.navigateByUrl('/campaigns'); },
        error: e => this.snack.open(this.msg(e), 'OK', { duration: 3500 })
      });
    }
  }

  cancel() { this.router.navigateByUrl('/campaigns'); }

  private msg(e: any) { return e?.error?.error || 'Fehler'; }
}
