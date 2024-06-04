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
                      private datePipe: DatePipe,
                      private cdr: ChangeDetectorRef,
                      private userService: UsersService ) {
    
  }

  ngOnInit() {
  }
   

  submit(){
    let TaskList = {
      task: this.selectedTask,
      type: this.selectedType
    };
    this.userService.addTaskList(TaskList).subscribe(
      (response) => {
        console.log('Project status updated successfully:', response);
        this.dialogRef.close({ result: true });
      },
      (error) => {
        console.error('Error updating project status:', error);
      }
    );

  }

  cancel(){
    this.dialogRef.close({ result: false });
  }

  ngOnDestroy() {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }

}

