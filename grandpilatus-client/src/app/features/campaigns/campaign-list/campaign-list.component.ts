import { Component, inject, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { Campaign } from '../../../shared/models/campaign.model';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog.component';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-campaign-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatSnackBarModule, MatDialogModule, RouterLink, MatSortModule],
  template: `
  <div class="wrap">
    <div class="actions">
      <a mat-raised-button color="primary" routerLink="/campaigns/new">+ Neue Kampagne</a>
    </div>

    <!-- Desktop: table -->
    <table *ngIf="!isMobile" mat-table [dataSource]="dataSource" matSort class="mat-elevation-z1">
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Name</th>
        <td mat-cell *matCellDef="let r">
          <a [routerLink]="['/campaigns', r._id]">{{ r.name }}</a>
        </td>
      </ng-container>

      <ng-container matColumnDef="landing">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Landing Page</th>
        <td mat-cell *matCellDef="let r">
          {{ (typeof r.landingPage === 'object' && r.landingPage) ? r.landingPage.title : '—' }}
        </td>
      </ng-container>

      <ng-container matColumnDef="segments">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Segmente</th>
        <td mat-cell *matCellDef="let r">
          {{ (r.segments || []).length }}
        </td>
      </ng-container>

      <ng-container matColumnDef="status">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Status</th>
        <td mat-cell *matCellDef="let r">{{ translateStatus(r.status) }}</td>
      </ng-container>

      <ng-container matColumnDef="created">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Erstellt</th>
        <td mat-cell *matCellDef="let r">{{ r['createdAt'] | date:'dd.MM.yyyy HH:mm' }}</td>
      </ng-container>

      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef></th>
        <td mat-cell *matCellDef="let r">
          <button mat-button color="warn" (click)="del(r)">Löschen</button>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="cols"></tr>
      <tr mat-row *matRowDef="let row; columns: cols;"></tr>
    </table>

    <!-- Mobile: card list -->
    <div *ngIf="isMobile" class="mobile-card-list">
      <div *ngFor="let r of dataSource.data" class="mobile-card">
        <div class="mc-title"><a [routerLink]="['/campaigns', r._id]">{{ r.name }}</a></div>
        <div class="mc-row"><span>Status</span><span>{{ translateStatus(r.status) }}</span></div>
        <div class="mc-row"><span>Segmente</span><span>{{ (r.segments || []).length }}</span></div>
        <div class="mc-row"><span>Landing Page</span><span>{{ (typeof r.landingPage === 'object' && r.landingPage) ? r.landingPage.title : '—' }}</span></div>
        <div class="mc-actions">
          <button mat-button color="warn" (click)="del(r)">Löschen</button>
        </div>
      </div>
    </div>
  </div>
  `,
  styles: [`.wrap{padding:16px} .actions{margin:8px 0; display:flex; justify-content:flex-end}`]
})
export class CampaignListComponent implements OnInit, AfterViewInit {
  private api = inject(ApiService);
  private snack = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private bp = inject(BreakpointObserver);

  dataSource = new MatTableDataSource<Campaign>([]);
  cols = ['name', 'landing', 'status', 'segments', 'created', 'actions'];
  isMobile = false;

  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.bp.observe(['(max-width: 768px)']).subscribe(state => {
      this.isMobile = state.matches;
    });
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'landing': return (typeof item.landingPage === 'object' && item.landingPage) ? item.landingPage.title : '';
        case 'segments': return (item.segments || []).length;
        case 'created': return item['createdAt'] || '';
        default: return (item as any)[property];
      }
    };
    this.load();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  load() {
    this.api.listCampaigns().subscribe(x => {
      const priority: Record<string, number> = { 'active': 1, 'scheduled': 2, 'finished': 3, 'draft': 4 };
      this.dataSource.data = x.sort((a, b) => {
        const pa = priority[a.status || 'draft'] || 99;
        const pb = priority[b.status || 'draft'] || 99;
        return pa - pb;
      });
    });
  }

  del(r: Campaign) {
    if (!r._id) return;

    this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Kampagne löschen', message: `Kampagne "${r.name}" wirklich löschen?` }
    }).afterClosed().subscribe(confirmed => {
      if (!confirmed) return;

      this.api.deleteCampaign(r._id!).subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.filter(x => x._id !== r._id);
          this.snack.open('Kampagne gelöscht', 'OK', { duration: 2000 });
        },
        error: (e) => {
          this.snack.open(e?.error?.error || 'Löschen fehlgeschlagen', 'OK', { duration: 3000 });
        }
      });
    });
  }

  translateStatus(status?: string): string {
    switch (status) {
      case 'active': return 'Aktiv';
      case 'scheduled': return 'Geplant';
      case 'finished': return 'Beendet';
      case 'draft': return 'Entwurf';
      default: return 'Entwurf';
    }
  }
}
