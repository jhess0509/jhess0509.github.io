import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'az-action-needed',
  templateUrl: './action-needed.component.html',
  styleUrls: ['./action-needed.component.scss']
})
export class ActionNeededComponent {
  reason: any = "";
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<ActionNeededComponent>,) {

  }



  submit(){
    this.dialogRef.close({ reason: this.reason });
  }

  cancel(){
    this.dialogRef.close({ reason: null });
  }

}
