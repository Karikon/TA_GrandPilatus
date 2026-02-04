import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { CustomerSegment } from '../../../shared/models/customer.model';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog.component';

@Component({
  selector: 'app-segment-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, RouterLink, MatSnackBarModule, MatDialogModule],
  template: `
  <div class="wrap">
    <div class="actions">
      <a mat-raised-button color="primary" routerLink="/segments/new">+ Neues Segment</a>
    </div>

    <table mat-table [dataSource]="rows" class="mat-elevation-z1">

      <ng-container matColumnDef="title">
        <th mat-header-cell *matHeaderCellDef>Titel</th>
        <td mat-cell *matCellDef="let r">
          <a [routerLink]="['/segments', r._id]">{{ r.title }}</a>
        </td>
      </ng-container>

      <ng-container matColumnDef="count">
        <th mat-header-cell *matHeaderCellDef>Anzahl Kunden</th>
        <td mat-cell *matCellDef="let r">{{ (r.customers || []).length }}</td>
      </ng-container>

      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef></th>
        <td mat-cell *matCellDef="let r">
          <a mat-button color="primary" [routerLink]="['/segments', r._id]">Bearbeiten</a>
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
export class SegmentListComponent implements OnInit {
  private api = inject(ApiService);
  private snack = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  rows: CustomerSegment[] = [];
  cols = ['title', 'count', 'actions'];

  ngOnInit() { this.load(); }

  // Reload after changes so counts stay accurate
  load() { this.api.listSegments().subscribe(x => this.rows = x); }

  del(r: CustomerSegment) {
    if (!r._id) return;

    this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Segment löschen',
        message: `Segment "${r.title}" wirklich löschen?`
      }
    }).afterClosed().subscribe(confirmed => {
      if (!confirmed) return;

      this.api.deleteSegment(r._id!).subscribe({
        next: () => { this.snack.open('Gelöscht', 'OK', { duration: 2000 }); this.load(); },
        error: e => this.snack.open(e?.error?.error || 'Löschen fehlgeschlagen', 'OK', { duration: 3000 })
      });
    });
  }
}
