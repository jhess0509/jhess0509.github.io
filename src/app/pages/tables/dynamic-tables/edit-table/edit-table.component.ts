import { DatePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IDropdownSettings } from 'ng-multiselect-dropdown3';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { BookingUpdate } from 'src/app/logic/models/bookingUpdate';
import { User } from 'src/app/logic/models/user-model/user-model.component';
import { OrderServiceService } from 'src/app/logic/services/order-service.service';

@Component({
  selector: 'az-edit-table',
  templateUrl: './edit-table.component.html',
  styleUrls: ['./edit-table.component.scss']
})
export class EditTableComponent {

  productFilterList: any[] = [];
  statusFilterList : any[] = [];
  filters: any;
  user: User = {};
  update: BookingUpdate = {};
  subs = new Subscription();

  startDate: FormControl<Date>;
  endDate: FormControl<Date>;
  startTime: Date;
  endTime: Date;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
                      public dialogRef: MatDialogRef<EditTableComponent>,
                      private toastr: ToastrService,
                      private orderService: OrderServiceService,
                      private datePipe: DatePipe) {
    if(data != null && data.row != null){
      this.user = data.row;
      this.user.firstname = data.row.firstName;
      this.user.lastname = data.row.lastName;

      this.productFilterList = data.productFilters;
      this.statusFilterList = data.statusFilters;
      this.startDate = new FormControl(data.row.start);
      this.endDate = new FormControl(data.row.end);
      this.startTime = this.getTimeWithouDate(data.row.start);
      this.endTime = this.getTimeWithouDate(data.row.end);
      console.log(data)
    }
  }
  submit(){
    let updatedStart = new Date(
      this.startDate.value.getFullYear(),
      this.startDate.value.getMonth(),
      this.startDate.value.getDate(),
      this.startTime.getHours(),
      this.startTime.getMinutes(),
      this.startTime.getSeconds()
    );
    let updatedEnd = new Date(
      this.endDate.value.getFullYear(),
      this.endDate.value.getMonth(),
      this.endDate.value.getDate(),
      this.endTime.getHours(),
      this.endTime.getMinutes(),
      this.endTime.getSeconds()
    );
    let start = this.datePipe.transform(updatedStart, 'yyyy-MM-ddTHH:mm:ss');
    let end = this.datePipe.transform(updatedStart, 'yyyy-MM-ddTHH:mm:ss');

    this.update = { firstname: this.user.firstname,
      lastname: this.user.lastname,
      product_id: this.user.product_id,
      order_id: this.user.order_id,
      booking_id: this.user.booking_id,
      email: this.user.email,
      phone: this.user.phone,
      status: this.user.status,
      start: start,
      end: end
    };

    console.log(this.update);
    this.subs.add(this.orderService.updateOrders(this.update)
    .subscribe((res:any) => {
      this.dialogRef.close();
    }));
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

