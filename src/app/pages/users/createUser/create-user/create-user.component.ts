import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { IDropdownSettings } from 'ng-multiselect-dropdown3';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { User } from 'src/app/logic/models/user-model/user-model.component';
import { UsersService } from 'src/app/logic/services/users.service';

@Component({
  selector: 'az-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent {
  selectedRole: any[] = [];
  roleList: any[] = [];
  subs = new Subscription();

  email: string;
  password: string;
  firstName: string;
  lastName: string;

  createUser: User = {};

  expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  
  constructor(public dialogRef: MatDialogRef<CreateUserComponent>, private usersService: UsersService, private toastr: ToastrService) {}
  
  ngOnInit() {
  }

  submit(){
    this.usersService.createUser(this.createUser);
    this.dialogRef.close();
  }
  cancel(){
    this.dialogRef.close();
  }

  containsUppercase(str: string) {
    return /[A-Z]/.test(str);
  }



  dropdownSettings= {
    singleSelection: false,
    idField: 'value',
    textField: 'label',
    allowSearchFilter: true,
    displayKey: 'label',
    search: true,
    height: 'auto',
    placeholder: 'Select Status',
    customComparator: this.customComparator.bind(this),
    limitTo: 0,
    moreText: 'More',
    noResultsFound: 'No results found',
    searchPlaceholder: 'Search',
    searchOnKey: 'label',
    clearOnSelection: false,
    inputDirection: 'ltr',
    preventScrolling: true
  };

  customComparator(itemA: any, itemB: any): number {
    // Compare the items based on your custom logic
    // Return a negative number if itemA should come before itemB
    // Return a positive number if itemA should come after itemB
    // Return 0 if the items are equal
  
    // Example: Comparing based on item names in ascending order
    if (itemA.name < itemB.name) {
      return -1;
    } else if (itemA.name > itemB.name) {
      return 1;
    } else {
      return 0;
    }
  }

  ngOnDestroy() {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }
}
