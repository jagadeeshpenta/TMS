import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TimeSheetComponent } from './time-sheet.component'
 
@NgModule({
  declarations: [
    TimeSheetComponent
  ],
  exports: [TimeSheetComponent],
  imports: [CommonModule, FormsModule]
})
export class TimeSheetModule { }