import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IDropdownSettings } from 'ng-multiselect-dropdown3';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { BookingUpdate } from 'src/app/logic/models/bookingUpdate';
import { User } from 'src/app/logic/models/user-model/user-model.component';
import { OrderServiceService } from 'src/app/logic/services/order-service.service';
import { UsersService } from 'src/app/logic/services/users.service';

@Component({
  selector: 'az-edit-table',
  templateUrl: './edit-table.component.html',
  styleUrls: ['./edit-table.component.scss']
})
export class EditTableComponent implements OnInit{

  projectTypes: any[] = [];
  filters: any;
  task: any;
  update: BookingUpdate = {};
  subs = new Subscription();
  selectedType: any;
  selectedTask: any;
  form: FormGroup;
  startDate: Date;
  endDate: Date;
  startTime: Date;
  endTime: Date;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
                      public dialogRef: MatDialogRef<EditTableComponent>,
                      private toastr: ToastrService,
                      private orderService: OrderServiceService,
                      private datePipe: DatePipe,
                      private cdr: ChangeDetectorRef,
                      private userService: UsersService ) {
    
  }

  ngOnInit() {
    this.projectTypes = this.userService.getProjectTypes()
  }
   

  submit(){
    this.userService.createProjectTask(this.selectedType, this.selectedTask)
    this.dialogRef.close({ result: true });
  }

  cancel(){
    this.dialogRef.close({ result: false });
  }

  onTimeSelected(event: any): void {
    console.log(event);
  }

  getDateWithoutTime(originalDate: string): Date {
    const parts = originalDate.split('-');
    const year = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1; // Subtract 1 to account for 0-based indexing
    const day = parseInt(parts[2]);

    const dateObject = new Date(year, month, day, 0, 0, 0); // Set hours, minutes, and seconds to 0

    return new Date(
      dateObject.getFullYear(),
      dateObject.getMonth(),
      dateObject.getDate(),
      0,
      0,
      0
    );
  }
  getTimeWithouDate(originalDate: any): Date {
    let tempDate = new Date(originalDate);
    
    return new Date(
      0,
      0,
      0,
      tempDate.getHours(),
      tempDate.getMinutes(),
      tempDate.getSeconds(),
    );
  }
  ngOnDestroy() {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }

}

