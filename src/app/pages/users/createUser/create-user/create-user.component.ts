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
    this.loadUserRoles();
    //this.loadUsers();
  }

  submit(){
    let submit = true;
    if(this.createUser.email == null || this.createUser.email == '' || !this.expression.test(this.createUser.email)){
      this.toastr.error('Email must be Non Blank and Valid', 'Invalid Email');
      submit = false;
    }
    if(this.createUser.password == null || this.createUser.password.length < 8 || !this.containsUppercase(this.createUser.password)){
      this.toastr.error('Password Must be 8 characters Long with a Capital', 'Invalid Password',);
      submit = false;
    }
    if(this.createUser.role == null){
      this.toastr.error('Must Select a Role from the Dropdown', 'Invalid Role')
      submit = false;
    }
    if(this.createUser.firstname == null || this.createUser.firstname == ''){
      this.toastr.error('Please Enter a First Name', 'Invalid First Name')
      submit = false;
    }
    if(this.createUser.lastname == null || this.createUser.lastname == ''){
      this.toastr.error('Please Enter a Last Name', 'Invalid Last Name')
      submit = false;
    }

    if(submit){
      try{
        this.subs.add(this.usersService.createUser(this.createUser)
          .subscribe((res:any) => {
            this.toastr.success("User Succesfully Created")
            this.dialogRef.close();
          }));
      }
      catch{
        this.toastr.error("Error Creating User");
      }
      
    }
  }

  containsUppercase(str: string) {
    return /[A-Z]/.test(str);
  }

  loadUserRoles() {
    this.subs.add(this.usersService.getRoles()
    .subscribe((res: any) => {
      this.roleList = res;
    },
    (err: HttpErrorResponse) => {
      console.log(err);
    }));
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
