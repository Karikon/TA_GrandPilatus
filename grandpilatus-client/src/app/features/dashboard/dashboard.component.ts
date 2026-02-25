import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { ApiService } from '../../core/services/api.service';
import { Campaign, CampaignPerformance } from '../../shared/models/campaign.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatDividerModule, MatProgressSpinnerModule, BaseChartDirective],
  template: `
  <div class="wrap">
    <h2>Dashboard</h2>

    <div class="kpis">
      <mat-card class="kpi">
        <div class="kpi-label">Aktive Kampagnen</div>
        <div class="kpi-value">{{ activeCampaigns }}</div>
      </mat-card>

      <mat-card class="kpi small">
        <div class="kpi-label">Durchschn. Zustellrate</div>
        <div class="kpi-value">{{ avg.delivery | number:'1.0-1' }}%</div>
      </mat-card>

      <mat-card class="kpi small">
        <div class="kpi-label">Durchschn. Klickrate</div>
        <div class="kpi-value">{{ avg.click | number:'1.0-1' }}%</div>
      </mat-card>

      <mat-card class="kpi small">
        <div class="kpi-label">Durchschn. Konversionsrate</div>
        <div class="kpi-value">{{ avg.conversion | number:'1.0-1' }}%</div>
      </mat-card>
    </div>

    <div class="charts-row">
      <mat-card class="chart-card">
        <h3>Kampagnen-Status</h3>
        <div class="chart-wrap" *ngIf="!loading">
          <canvas baseChart
            [type]="pieChartType"
            [data]="pieChartData"
            [options]="pieChartOptions">
          </canvas>
        </div>
      </mat-card>

      <mat-card class="chart-card">
        <h3>Durchschnittliche Kampagnen-KPIs</h3>
        <div class="chart-wrap" *ngIf="!loading; else loadingTpl">
          <canvas baseChart
            [type]="barChartType"
            [data]="barChartData"
            [options]="barChartOptions">
          </canvas>
        </div>
        <ng-template #loadingTpl>
          <div class="center"><mat-spinner diameter="36"></mat-spinner></div>
        </ng-template>
      </mat-card>
    </div>
  </div>
  `,
  styles: [`
    .wrap { padding: 16px; display: grid; gap: 16px; }
    .kpis { display: grid; grid-template-columns: repeat(4, minmax(180px, 1fr)); gap: 12px; }
    .charts-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .kpi { padding: 16px; display: grid; align-content: center; }
    .kpi.small { background: #fafafa; }
    .kpi-label { font-size: 0.9rem; opacity: 0.7; }
    .kpi-value { font-size: 2rem; font-weight: 600; }
    .chart-card { padding: 12px; min-height: 440px; }
    .chart-wrap { position: relative; height: 380px; }
    .center{ display:grid; place-items:center; padding:24px; }
    @media (max-width: 900px) {
      .kpis { grid-template-columns: repeat(2, 1fr); }
      .charts-row { grid-template-columns: 1fr; }
    }
    @media (max-width: 480px) {
      .wrap { padding: 8px; }
      .kpis { grid-template-columns: 1fr; }
      .kpi-value { font-size: 1.6rem; }
      .chart-card { min-height: 320px; }
      .chart-wrap { height: 280px; }
    }
  `]
})
export class DashboardComponent implements OnInit {
  private api = inject(ApiService);

  loading = true;
  activeCampaigns = 0;
  avg = { delivery: 0, click: 0, conversion: 0 };

  // Chart.js setup
  barChartType: ChartType = 'bar';
  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { min: 0, max: 100, ticks: { callback: (v) => `${v}%` } }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `${(ctx.parsed.y as number).toFixed(1)}%`
        }
      }
    }
  };
  barChartData: ChartData<'bar'> = {
    labels: ['Zustellung %', 'Klickrate %', 'Konversion %'],
    datasets: [{ data: [0, 0, 0], label: 'Durchschnittliche Raten', backgroundColor: '#C5A059', hoverBackgroundColor: '#997433' }]
  };

  pieChartType: ChartType = 'pie';
  pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right' }
    }
  };
  pieChartData: ChartData<'pie'> = {
    labels: [], datasets: [{ data: [] }]
  };

  ngOnInit() {
    // Load campaigns (to count active ones) and performance numbers together
    Promise.all([
      this.api.listCampaigns().toPromise(),
      this.api.getPerformance().toPromise()
    ]).then(([campaigns, perf]) => {
      const camps = campaigns || [];
      this.activeCampaigns = camps.filter((c: Campaign) => c.status === 'active').length;

      // Status Pie Chart Logic
      const stats = { active: 0, scheduled: 0, finished: 0 };
      camps.forEach((c: Campaign) => {
        const s = c.status;
        if (s === 'active') stats.active++;
        else if (s === 'scheduled') stats.scheduled++;
        else if (s === 'finished') stats.finished++;
      });

      this.pieChartData = {
        labels: ['Aktiv', 'Geplant', 'Beendet'],
        datasets: [{
          data: [stats.active, stats.scheduled, stats.finished],
          backgroundColor: ['#C5A059', '#DBBD74', '#997433'],
          hoverBackgroundColor: ['#af8a45', '#c5a059', '#7a581f']
        }]
      };

      const p = (perf || []) as CampaignPerformance[];
      const n = p.length || 1;
      // Reuse a simple reducer so we do not repeat the map logic for each metric
      const sum = (k: keyof CampaignPerformance) => p.reduce((acc, it) => acc + (it[k] as unknown as number), 0);

      const delivery = sum('deliveryRate') / n;
      const click = sum('clickRate') / n;
      const conversion = sum('conversionRate') / n;

      this.avg = { delivery, click, conversion };

      // Explicitly set the gold color here so it doesn't revert to blue
      this.barChartData = {
        labels: ['Zustellung %', 'Klickrate %', 'Konversion %'],
        datasets: [{
          data: [delivery, click, conversion],
          label: 'Durchschnittliche Raten',
          backgroundColor: '#C5A059',
          hoverBackgroundColor: '#997433'
        }]
      };

      this.loading = false;
    }).catch(() => {
      this.loading = false;
      this.activeCampaigns = 0;
      this.avg = { delivery: 0, click: 0, conversion: 0 };
    });
  }
}
