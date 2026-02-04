import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { LandingPage } from '../../../shared/models/landing-page.model';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog.component';

@Component({
  selector: 'app-landing-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatSnackBarModule, MatChipsModule, MatDialogModule, RouterLink],
  template: `
  <div class="wrap">
    <div class="actions">
      <a mat-raised-button color="primary" routerLink="/landing-pages/new">+ Neue Landing Page</a>
    </div>

    <table mat-table [dataSource]="rows" class="mat-elevation-z1">
      <ng-container matColumnDef="title">
        <th mat-header-cell *matHeaderCellDef>Titel</th>
        <td mat-cell *matCellDef="let r">
          <a [routerLink]="['/landing-pages', r._id]">{{ r.title }}</a>
        </td>
      </ng-container>

      <ng-container matColumnDef="url">
        <th mat-header-cell *matHeaderCellDef>URL</th>
        <td mat-cell *matCellDef="let r">{{ r.url }}</td>
      </ng-container>

      <ng-container matColumnDef="status">
        <th mat-header-cell *matHeaderCellDef>Status</th>
        <td mat-cell *matCellDef="let r">
        <mat-chip [color]="r.status==='published' ? 'primary' : undefined">
          {{ r.status === 'published' ? 'Veröffentlicht' : 'Entwurf' }}
        </mat-chip>
        </td>
      </ng-container>

      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef></th>
        <td mat-cell *matCellDef="let r">
          <a mat-button color="primary" [routerLink]="['/landing-pages', r._id]">Bearbeiten</a>
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
export class LandingListComponent implements OnInit {
  private api = inject(ApiService);
  private snack = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  rows: LandingPage[] = [];
  cols = ['title', 'url', 'status', 'actions'];

  ngOnInit() { this.load(); }
  load() { this.api.listLandingPages().subscribe(x => this.rows = x); }

  del(r: LandingPage) {
    if (!r._id) return;

    this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Landing Page löschen', message: `Landing Page "${r.title}" wirklich löschen?` }
    }).afterClosed().subscribe(confirmed => {
      if (!confirmed) return;

      this.api.deleteLandingPage(r._id!).subscribe({
        next: () => { this.rows = this.rows.filter(x => x._id !== r._id); this.snack.open('Gelöscht', 'OK', { duration: 2000 }); },
        error: e => this.snack.open(e?.error?.error || 'Löschen fehlgeschlagen', 'OK', { duration: 3000 })
      });
    });
  }
}
