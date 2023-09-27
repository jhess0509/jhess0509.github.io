import { DatePipe, Time } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { Subscription } from 'rxjs';
import { OrderServiceService } from 'src/app/logic/services/order-service.service';
import { ProductService } from 'src/app/logic/services/product.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
import { IDropdownSettings } from 'ng-multiselect-dropdown3';
import { MatDialog } from '@angular/material/dialog';
import { EditTableComponent } from './edit-table/edit-table.component';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'az-dynamic-tables',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./pages.component.scss'],
  templateUrl: './dynamic-tables.component.html'
})
export class DynamicTablesComponent {
    subs = new Subscription();
    editing: any = {};
    rows: any[] = [];    
    filtered_rows: any[] = [];
    selected: any[] = []; 
    columns: any[] = [];
    mytime: Date = new Date();
    selectedTime: Date = new Date(); // Default time
    columnWidths: any;
    @ViewChild(DatatableComponent) table: DatatableComponent;
    selection: SelectionType;
    dropdownControl: FormControl = new FormControl();

    startDateFilter: string;
    endDateFilter: string;
    productFilter: string;
    
    statusFilter: string;
    searchName: string;
    searchID: string;
    tempList: any[] = [];
    

    productFilters: any[] = [];
    productFilterList: any[] = [];
    statusFilterList: any[] = [];
    dateTimeFilters: any[] = [];
    statusFilters = [
      { value: 'confirmed', label: 'Confirmed'},
      { value: 'paid', label: 'Paid'},
      { value: 'cancelled', label: 'Cancelled'},
      { value: 'complete', label: 'Complete'},
    ];

    constructor(httpClient: HttpClient,
        private orderService: OrderServiceService,
        private productSerivce: ProductService,
        private datePipe: DatePipe,
        public dialog: MatDialog) {

      this.selection = SelectionType.checkbox;
      
      const statusColumnWidth = .9; 
      const productColumnWidth = 1.25; 
      const bookedColumnWidth = .5; 
      const emailColumnWidth = 3.25; 
      const phoneColumnWidth = 1.25; 
      const startColumnWidth = 1.65; 
      const endColumnWidth = 1.65; 
      const totalColumns = statusColumnWidth + productColumnWidth + bookedColumnWidth 
                            + emailColumnWidth + phoneColumnWidth + startColumnWidth
                            + endColumnWidth;
      //.66 and 1.33

      //['Name', 'Email', 'Phone', 'Product', 'Status', 'Start Time', 'End Time'],
      this.columnWidths = {
        booked: (bookedColumnWidth / totalColumns) * 100 + '%',
        email: (emailColumnWidth / totalColumns) * 100 + '%',
        phone: (phoneColumnWidth / totalColumns) * 100 + '%',
        product: (productColumnWidth / totalColumns) * 100 + '%',
        status: (statusColumnWidth / totalColumns) * 100 + '%',
        start: (startColumnWidth / totalColumns) * 100 + '%',
        end: (endColumnWidth / totalColumns) * 100 + '%',        
      };
    }

    ngOnInit() {      
      this.loadFilters();
    }

    setColumnFlex(index: number): string {
      return this.columnWidths[index] + '%';
    }

    exportToPDF(datatable: DatatableComponent) {
      this.tempList = JSON.parse(JSON.stringify(datatable.rows));
      this.tempList = this.tempList.filter((row: any) => row.status != 'cancelled');
      this.tempList.forEach(row => {
        row.start = this.datePipe.transform(row.start, 'MMM d, h:mm a');
        row.end = this.datePipe.transform(row.end, 'MMM d, h:mm a');
      });
      console.log(this.tempList);

      const docDefinition = {
        content: [
          {
            table: {
              headerRows: 1,
              keepWithHeaderRows: 1,
              widths: Object.values(this.columnWidths),
              body: [
                ['Name', 'Email', 'Phone', 'Product', 'Status', 'Start Time', 'End Time'],
                ...this.tempList.map((row: { booked: any; email: any; phone: any; product: any; status: any; start: any; end: any; }) => [row.booked, row.email, row.phone, row.product, row.status, row.start, row.end])
              ],
              footerRows: 1,
              keepWithFooterRows: 1,
            }
          }
        ],
        pageOrientation: 'landscape'
      };
      pdfMake.createPdf(docDefinition).download('datatable.pdf');
      this.tempList = [];
    }
    getColumnValueWithFallback(value: any): any {
      return value !== null ? value : 'N/A'; // Provide a fallback value for null column
    }

    loadClasses() {
      this.subs.add(this.orderService.getOrders()
      .subscribe((res: any) => {
        this.rows = res;
        console.log(this.rows);
        this.rows = this.rows.map(row => ({
          id: row['order_id'],
          status: row['status'],
          product: row['line_items'][0]['name'],
          quantity: row['person_counts'],
          booked: row['billing']['first_name'] + " " + row['billing']['last_name'],
          firstName: row['billing']['first_name'],
          lastName: row['billing']['last_name'],
          start: row['start'],
          end: row['end'],
          product_id: row['product_id'],
          order_id: row['order_id'],
          booking_id: row['id'],
          email: row['billing']['email'],
          phone: row['billing']['phone']
        }));
        console.log(this.rows);
        let printed = false;
        this.rows.forEach(row => { 
          
          if(row.start != null && row.end != null){
            if(!printed){
              console.log('row starts');
              console.log(row.start);
              console.log(row.end);
            }
            row.originalStart = row.start;
            row.originalEnd = row.end;
            const startDate = new Date(row.start * 1000); // Convert to milliseconds
            const endDate = new Date(row.end * 1000);

            if(!printed){
              console.log("data objects");
              console.log(startDate);
              console.log(endDate);
            }

            const offsetInMillis = -4 * 60 * 60 * 1000;

            const adjustedStart = new Date(startDate.getTime() - offsetInMillis);
            const adjustedEnd = new Date(endDate.getTime() - offsetInMillis);


            row.start = adjustedStart;
            if(!printed){
              console.log("adjusted dates")
              console.log(startDate);
              console.log(endDate);
            }
            printed = true;
            row.end = adjustedEnd;
            let sum = 0;
            for (const key in row.quantity) {
              if (row.quantity.hasOwnProperty(key)) {
                const value = row.quantity[key];
                sum += value;
              }
            }
            row.quantity_total = sum;
          }
        });

        this.rows.forEach((row) => {
          if (row.phone.startsWith("+1")) {
            row.phone = row.phone.substr(2);
          }
        });
        this.filtered_rows = this.rows;
      },
      (err: HttpErrorResponse) => {
        console.log(err);
      }));
    }

    loadFilters(){
      this.subs.add(this.productSerivce.getProducts()
      .subscribe((res:any) => {
        this.productFilters = res.map(((item: { id: number; name: string; }) => ({
          label: item.name,
          value: item.id
        })));
        this.loadClasses();
      }));
    }
    filter(datatable: DatatableComponent): void {
      //set filtered list to full list to get ready to refilter
      datatable.columnMode = 'force';
      datatable.offset = 0;
      this.filtered_rows = this.rows
      //filter product
      if(this.productFilterList != null && this.productFilterList.length != 0){
        this.filtered_rows = this.filtered_rows.filter((item) => this.productFilterList.some((option) => option == item.product_id));
      }

      //filter status
      if(this.statusFilterList != null && this.statusFilterList.length != 0){
        this.filtered_rows = this.filtered_rows.filter((item) => this.statusFilterList.some((option) => option == item.status));
      }

      //filter dates
      if(this.startDateFilter != null && this.startDateFilter != ""){
        if(this.endDateFilter != null && this.endDateFilter != ""){
          let start = this.getDateWithoutTimeString(this.startDateFilter);
          let end = this.getDateWithoutTimeString(this.endDateFilter);

          this.filtered_rows = this.filtered_rows.filter((row: any) => this.getDateWithoutTimeDate(row.start) >= start && this.getDateWithoutTimeDate(row.end) <= end);
        }
      }

      //search name and id
      if(this.searchName != null && this.searchName != ""){
        this.filtered_rows = this.filtered_rows.filter((row: any) => row.booked.toLowerCase().includes(this.searchName.toLowerCase()));
      }
      if(this.searchID != null && this.searchID != ""){
        this.filtered_rows = this.filtered_rows.filter((row: any) => row.order_id.toString().includes(this.searchID));
      }

      //set the viewed list to the filtered list
      datatable.rows = this.filtered_rows;
    }
    
    getDateWithoutTimeString(originalDate: string): Date {
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
    getDateWithoutTimeDate(originalDate: any): Date {
      let tempDate = new Date(originalDate);
      
      return new Date(
        tempDate.getFullYear(),
        tempDate.getMonth(),
        tempDate.getDate(),
        0,
        0,
        0,
      );
    }
    resetFilters(datatable: DatatableComponent){
      this.productFilterList = [];
      this.statusFilterList = [];
      this.startDateFilter = "";
      this.endDateFilter = "";
      this.filter(datatable);
    }
    applyFilters(datatable: DatatableComponent){
      this.filter(this.table);
    }
    
    //refactor so everything just calls generic version
    onFilterChangeProduct(event: any): void {      
      this.filter(this.table);
    }
    onFilterChangeStatus(event: any): void {
      this.filter(this.table);
    }
    onFilterChangeDateTime(event: any, datatable: DatatableComponent): void {
      this.filter(datatable);
    }
    onSearchName(event: any, datatable: DatatableComponent): void {
      this.filter(datatable);
    }
    onSearchID(event: any, datatable: DatatableComponent): void {
      this.filter(datatable);
    }


    onActivate(row:any) {
      const dialogRef = this.dialog.open(EditTableComponent, {
        width: '1150px',
        height: '500px',
        data: { productFilters: this.productFilters,
                statusFilters: this.statusFilters,
                row: row,
        },
      });
    }

    
    save(row: any) {
      // Implement your save logic here
      row.editable = false;
    }
    
    cancel(row: any) {
      // Implement cancel logic to revert changes
      Object.assign(row, row.originalData);
      row.editable = false;
    }

    ngOnDestroy() {
      if (this.subs) {
        this.subs.unsubscribe();
      }
    }

}
