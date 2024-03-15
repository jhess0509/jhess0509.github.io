import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { Subscription } from 'rxjs';
import { UsersService } from 'src/app/logic/services/users.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateUserComponent } from '../createUser/create-user/create-user.component';



@Component({
  selector: 'az-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {
  subs = new Subscription();
  editing: any = {};
  rows: any[] = [];    
  filtered_rows: any[] = [];
  selected: any[] = []; 
  columns: any[] = [];
  columnWidths: any;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  selection: SelectionType;


  tempList: any[] = [];

  constructor(private usersService: UsersService, public dialog: MatDialog) { }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
  }

  addItem(): void {
    // Logic to add an item to the list
    // For example, you can push a new item to the existing list or navigate to a new item creation page
    const dialogRef = this.dialog.open(CreateUserComponent, {
      width: '1000px',
      height: '300px'
      // Add any additional configuration options as needed
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.loadUsers();
    });
  }

  onSelect({ selected }: any) {
    //console.log('Select Event', selected, this.selected);
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  onActivate(event: any) {
      //console.log('Activate Event', event);
  } 

  ngOnDestroy() {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }
}
