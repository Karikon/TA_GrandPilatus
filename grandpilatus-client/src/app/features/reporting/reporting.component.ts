import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { CampaignPerformance } from '../../shared/models/campaign.model';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-reporting',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule, MatProgressSpinnerModule],
  template: `
  <div class="wrap">
    <div class="page-header">
      <h2 class="page-title">Leistungsbericht</h2>
      <div class="gold-divider"></div>
      <p class="page-subtitle">Kampagnen-Metriken und Konversionsanalyse</p>
    </div>

    <mat-card class="luxury-card">
      <div *ngIf="loading" class="center"><mat-spinner diameter="36"></mat-spinner></div>

      <table *ngIf="!loading" mat-table [dataSource]="rows" class="mat-elevation-z0 luxury-table">
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Kampagne</th>
          <td mat-cell *matCellDef="let r" class="primary-text">{{ r.name }}</td>
        </ng-container>

        <ng-container matColumnDef="deliveryRate">
          <th mat-header-cell *matHeaderCellDef>Zustellung</th>
          <td mat-cell *matCellDef="let r">{{ r.deliveryRate | number:'1.0-1' }}%</td>
        </ng-container>

        <ng-container matColumnDef="clickRate">
          <th mat-header-cell *matHeaderCellDef>Klickrate</th>
          <td mat-cell *matCellDef="let r">{{ r.clickRate | number:'1.0-1' }}%</td>
        </ng-container>

        <ng-container matColumnDef="conversionRate">
          <th mat-header-cell *matHeaderCellDef>Konversion</th>
          <td mat-cell *matCellDef="let r">
            <span class="badgem" [class.high]="r.conversionRate > 2">{{ r.conversionRate | number:'1.0-1' }}%</span>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="cols"></tr>
        <tr mat-row *matRowDef="let row; columns: cols;" class="hover-row"></tr>
      </table>
    </mat-card>
  </div>
  `,
  styles: [`
    .wrap { padding: 0; }
    
    .page-header {
      margin-bottom: 32px;
      text-align: center;
      
      .page-title {
        font-family: var(--font-serif);
        font-size: 36px;
        margin: 0;
        color: var(--color-charcoal);
      }
      .gold-divider {
        height: 3px;
        width: 60px;
        background-color: var(--color-gold);
        margin: 16px auto;
      }
      .page-subtitle {
        font-family: var(--font-sans);
        color: var(--color-text-muted);
        text-transform: uppercase;
        letter-spacing: 0.1em;
        font-size: 11px;
      }
    }

    .luxury-card {
      padding: 0;
      border: 1px solid rgba(0,0,0,0.05);
      border-radius: 4px;
      overflow: hidden;
    }

    table { width: 100%; }

    .primary-text {
      font-weight: 500;
      color: var(--color-charcoal);
    }

    .badgem {
      padding: 4px 8px;
      border-radius: 4px;
      background: #f0f0f0;
      font-size: 12px;
      
      &.high {
        background: rgba(197, 160, 89, 0.2);
        color: var(--color-gold-dark);
        font-weight: 700;
      }
    }

    .hover-row:hover {
      background-color: rgba(197, 160, 89, 0.05);
    }
    
    .center{ display:grid; place-items:center; padding:48px; }
  `]
})
export class ReportingComponent implements OnInit {
  private api = inject(ApiService);
  rows: CampaignPerformance[] = [];
  loading = true;
  cols = ['name', 'deliveryRate', 'clickRate', 'conversionRate'];

  ngOnInit() {
    // Pull the chart data once when the page opens
    this.api.getPerformance().subscribe({
      next: (x) => { this.rows = x; this.loading = false; },
      error: () => { this.rows = []; this.loading = false; }
    });
  }
}
