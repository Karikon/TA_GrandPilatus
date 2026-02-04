import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { Customer, CustomerSegment, SegmentPayload } from '../../../shared/models/customer.model';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-segment-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatSnackBarModule
  ],
  template: `
  <div class="luxury-form-wrap">
    <div class="form-header">
      <h2>{{ isEdit() ? 'Segment bearbeiten' : 'Neues Segment' }}</h2>
      <div class="gold-divider"></div>
    </div>

    <mat-card class="luxury-card">
      <form [formGroup]="form" (ngSubmit)="save()">
        <mat-form-field class="full" appearance="outline">
          <mat-label>Segment-Titel</mat-label>
          <input matInput formControlName="title" required placeholder="z.B. Spa-Liebhaber">
        </mat-form-field>

        <mat-form-field class="full" appearance="outline">
          <mat-label>Kunden einschließen</mat-label>
          <mat-select formControlName="customers" multiple>
            <mat-option *ngFor="let c of filteredCustomers()" [value]="c._id">
              {{ c.lastName }}, {{ c.firstName }} — {{ c.address?.city || '-' }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <div class="actions">
          <button mat-button type="button" (click)="cancel()">ABBRECHEN</button>
          <button mat-raised-button color="primary" [disabled]="form.invalid">{{ isEdit() ? 'SEGMENT AKTUALISIEREN' : 'SEGMENT ERSTELLEN' }}</button>
        </div>
      </form>
    </mat-card>
  </div>
  `,
  styles: [`
    .luxury-form-wrap {
      max-width: 600px;
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

    .full { width: 100%; margin-bottom: 16px; }

    .actions {
      margin-top: 24px;
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
export class SegmentFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private api = inject(ApiService);
  private snack = inject(MatSnackBar);

  id = signal<string | null>(null);
  customers = signal<Customer[]>([]);
  filter = signal<string>('');
  setFilter = (v: string) => this.filter.set(v);

  // Assuming 'allCriteria' and 'selectedIds' are intended to be defined elsewhere
  // For now, we'll define them as empty arrays to make the code syntactically valid.
  // You will need to properly define `allCriteria` and `selectedIds` based on your application logic.


  filteredCustomers = computed(() => {
    const q = this.filter().toLowerCase().trim(); // Re-added 'q' definition

    if (!q) return this.customers();
    // Simple text search across a few fields to keep UX friendly
    return this.customers().filter(c => {
      const txt = [
        c.firstName, c.lastName, c.address?.city,
        ...(c.interests || [])
      ].filter(Boolean).join(' ').toLowerCase();
      return txt.includes(q);
    });
  });

  form = this.fb.group({
    title: ['', Validators.required],
    customers: this.fb.control<string[]>([])
  });

  ngOnInit() {
    this.id.set(this.route.snapshot.paramMap.get('id'));
    // Wait for the customer list before patching the form so options exist
    this.api.listCustomers().subscribe(list => {
      this.customers.set(list);
      if (this.isEdit()) {
        this.api.getSegment(this.id()!).subscribe(seg => this.fill(seg));
      }
    });
  }

  isEdit = () => !!this.id();

  private fill(seg: CustomerSegment) {
    const ids = (seg.customers || []).map((c) => typeof c === 'string' ? c : c._id);
    this.form.patchValue({ title: seg.title, customers: ids });
  }

  save() {
    const v = this.form.value as { title: string; customers: string[] };
    const payload: SegmentPayload = { title: v.title, customers: v.customers || [] };

    if (this.isEdit()) {
      // Update keeps ids intact so we only send the minimal payload
      this.api.updateSegment(this.id()!, payload).subscribe({
        next: () => { this.snack.open('Aktualisiert', 'OK', { duration: 2000 }); this.router.navigateByUrl('/segments'); },
        error: e => this.snack.open(e?.error?.error || 'Aktualisierung fehlgeschlagen', 'OK', { duration: 3500 })
      });
    } else {
      this.api.createSegment(payload).subscribe({
        next: () => { this.snack.open('Erstellt', 'OK', { duration: 2000 }); this.router.navigateByUrl('/segments'); },
        error: e => this.snack.open(e?.error?.error || 'Erstellung fehlgeschlagen', 'OK', { duration: 3500 })
      });
    }
  }

  cancel() { this.router.navigateByUrl('/segments'); }
}
