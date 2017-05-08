import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TimeSheetComponent } from './time-sheet.component';
import { Routes, RouterModule } from '@angular/router';
 
@NgModule({
  declarations: [
    TimeSheetComponent
  ],
  exports: [TimeSheetComponent],
  imports: [CommonModule, FormsModule, RouterModule]
})
export class TimeSheetModule { }