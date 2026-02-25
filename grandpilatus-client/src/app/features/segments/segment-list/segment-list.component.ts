import { Component, OnInit, inject, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { CustomerSegment } from '../../../shared/models/customer.model';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog.component';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-segment-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, RouterLink, MatSnackBarModule, MatDialogModule, MatSortModule],
  template: `
  <div class="wrap">
    <div class="actions">
      <a mat-raised-button color="primary" routerLink="/segments/new">+ Neues Segment</a>
    </div>

    <!-- Desktop: table -->
    <table *ngIf="!isMobile" mat-table [dataSource]="dataSource" matSort class="mat-elevation-z1">

      <ng-container matColumnDef="title">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Titel</th>
        <td mat-cell *matCellDef="let r">
          <a [routerLink]="['/segments', r._id]">{{ r.title }}</a>
        </td>
      </ng-container>

      <ng-container matColumnDef="count">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Anzahl Kunden</th>
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

    <!-- Mobile: card list -->
    <div *ngIf="isMobile" class="mobile-card-list">
      <div *ngFor="let r of dataSource.data" class="mobile-card">
        <div class="mc-title"><a [routerLink]="['/segments', r._id]">{{ r.title }}</a></div>
        <div class="mc-row"><span>Anzahl Kunden</span><span>{{ (r.customers || []).length }}</span></div>
        <div class="mc-actions">
          <a mat-button color="primary" [routerLink]="['/segments', r._id]">Bearbeiten</a>
          <button mat-button color="warn" (click)="del(r)">Löschen</button>
        </div>
      </div>
    </div>
  </div>
  `,
  styles: [`.wrap{padding:16px} .actions{margin:8px 0; display:flex; justify-content:flex-end}`]
})
export class SegmentListComponent implements OnInit, AfterViewInit {
  private api = inject(ApiService);
  private snack = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private bp = inject(BreakpointObserver);
  dataSource = new MatTableDataSource<CustomerSegment>([]);
  cols = ['title', 'count', 'actions'];
  isMobile = false;

  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.bp.observe(['(max-width: 768px)']).subscribe(state => {
      this.isMobile = state.matches;
    });
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'count': return (item.customers || []).length;
        default: return (item as any)[property];
      }
    };
    this.load();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  load() {
    this.api.listSegments().subscribe(x => {
      this.dataSource.data = x.sort((a, b) => (b.customers?.length || 0) - (a.customers?.length || 0));
    });
  }

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
