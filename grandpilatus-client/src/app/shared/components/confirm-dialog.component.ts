import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface ConfirmDialogData {
    title: string;
    message: string;
}

@Component({
    selector: 'app-confirm-dialog',
    standalone: true,
    imports: [CommonModule, MatDialogModule, MatButtonModule],
    template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>
      <p>{{ data.message }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <!-- Material Design: Cancel on left, Action on right -->
      <button mat-button [mat-dialog-close]="false">Abbrechen</button>
      <button mat-raised-button color="warn" [mat-dialog-close]="true">Löschen</button>
    </mat-dialog-actions>
  `
})
export class ConfirmDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<ConfirmDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
    ) { }
}
