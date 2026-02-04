import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { Campaign } from '../../../shared/models/campaign.model';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog.component';

@Component({
  selector: 'app-campaign-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatSnackBarModule, MatDialogModule, RouterLink],
  template: `
  <div class="wrap">
    <div class="actions">
      <a mat-raised-button color="primary" routerLink="/campaigns/new">+ Neue Kampagne</a>
    </div>

    <table mat-table [dataSource]="rows" class="mat-elevation-z1">
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef>Name</th>
        <td mat-cell *matCellDef="let r">
          <a [routerLink]="['/campaigns', r._id]">{{ r.name }}</a>
        </td>
      </ng-container>

      <ng-container matColumnDef="landing">
        <th mat-header-cell *matHeaderCellDef>Landing Page</th>
        <td mat-cell *matCellDef="let r">
          {{ (typeof r.landingPage === 'object' && r.landingPage) ? r.landingPage.title : '—' }}
        </td>
      </ng-container>

      <ng-container matColumnDef="segments">
        <th mat-header-cell *matHeaderCellDef>Segmente</th>
        <td mat-cell *matCellDef="let r">
          {{ (r.segments || []).length }}
        </td>
      </ng-container>

      <ng-container matColumnDef="status">
        <th mat-header-cell *matHeaderCellDef>Status</th>
        <td mat-cell *matCellDef="let r">{{ translateStatus(r.status) }}</td>
      </ng-container>

      <ng-container matColumnDef="created">
        <th mat-header-cell *matHeaderCellDef>Erstellt</th>
        <td mat-cell *matCellDef="let r">{{ r['createdAt'] | date:'short' }}</td>
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
  </div>
  `,
  styles: [`.wrap{padding:16px} .actions{margin:8px 0; display:flex; justify-content:flex-end}`]
})
export class CampaignListComponent implements OnInit {
  private api = inject(ApiService);
  private snack = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  rows: Campaign[] = [];
  cols = ['name', 'landing', 'status', 'segments', 'created', 'actions'];

  ngOnInit() {
    this.load();
  }

  load() {
    // Re-fetch the list so the sort order from the API is respected
    this.api.listCampaigns().subscribe(x => this.rows = x);
  }

  del(r: Campaign) {
    if (!r._id) return;

    this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Kampagne löschen', message: `Kampagne "${r.name}" wirklich löschen?` }
    }).afterClosed().subscribe(confirmed => {
      if (!confirmed) return;

      this.api.deleteCampaign(r._id!).subscribe({
        next: () => {
          this.rows = this.rows.filter(x => x._id !== r._id);
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
