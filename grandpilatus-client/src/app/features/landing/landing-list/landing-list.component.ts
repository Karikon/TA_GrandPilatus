import { Component, OnInit, inject, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { LandingPage } from '../../../shared/models/landing-page.model';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog.component';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-landing-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatSnackBarModule, MatChipsModule, MatDialogModule, RouterLink, MatSortModule],
  template: `
  <div class="wrap">
    <div class="actions">
      <a mat-raised-button color="primary" routerLink="/landing-pages/new">+ Neue Landing Page</a>
    </div>

    <!-- Desktop: table -->
    <table *ngIf="!isMobile" mat-table [dataSource]="dataSource" matSort class="mat-elevation-z1">
      <ng-container matColumnDef="title">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Titel</th>
        <td mat-cell *matCellDef="let r">
          <a [routerLink]="['/landing-pages', r._id]">{{ r.title }}</a>
        </td>
      </ng-container>

      <ng-container matColumnDef="url">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>URL</th>
        <td mat-cell *matCellDef="let r">{{ r.url }}</td>
      </ng-container>

      <ng-container matColumnDef="status">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Status</th>
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

    <!-- Mobile: card list -->
    <div *ngIf="isMobile" class="mobile-card-list">
      <div *ngFor="let r of dataSource.data" class="mobile-card">
        <div class="mc-title"><a [routerLink]="['/landing-pages', r._id]">{{ r.title }}</a></div>
        <div class="mc-row"><span>URL</span><span class="url-cell">{{ r.url }}</span></div>
        <div class="mc-row"><span>Status</span><span>{{ r.status === 'published' ? 'Veröffentlicht' : 'Entwurf' }}</span></div>
        <div class="mc-actions">
          <a mat-button color="primary" [routerLink]="['/landing-pages', r._id]">Bearbeiten</a>
          <button mat-button color="warn" (click)="del(r)">Löschen</button>
        </div>
      </div>
    </div>
  </div>
  `,
  styles: [`.wrap{padding:16px} .actions{margin:8px 0; display:flex; justify-content:flex-end} .url-cell{max-width:160px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; display:block;}`]
})
export class LandingListComponent implements OnInit, AfterViewInit {
  private api = inject(ApiService);
  private snack = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private bp = inject(BreakpointObserver);
  dataSource = new MatTableDataSource<LandingPage>([]);
  cols = ['title', 'url', 'status', 'actions'];
  isMobile = false;

  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.bp.observe(['(max-width: 768px)']).subscribe(state => {
      this.isMobile = state.matches;
    });
    this.load();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  load() {
    this.api.listLandingPages().subscribe(x => {
      this.dataSource.data = x.sort((a, b) => {
        if (a.status === 'draft' && b.status !== 'draft') return -1;
        if (a.status !== 'draft' && b.status === 'draft') return 1;
        return 0;
      });
    });
  }

  del(r: LandingPage) {
    if (!r._id) return;

    this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Landing Page löschen', message: `Landing Page "${r.title}" wirklich löschen?` }
    }).afterClosed().subscribe(confirmed => {
      if (!confirmed) return;

      this.api.deleteLandingPage(r._id!).subscribe({
        next: () => { this.dataSource.data = this.dataSource.data.filter(x => x._id !== r._id); this.snack.open('Gelöscht', 'OK', { duration: 2000 }); },
        error: e => this.snack.open(e?.error?.error || 'Löschen fehlgeschlagen', 'OK', { duration: 3000 })
      });
    });
  }
}
