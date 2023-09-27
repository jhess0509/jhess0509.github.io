import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { DirectivesModule } from '../theme/directives/directives.module';
import { PipesModule } from '../theme/pipes/pipes.module'; 
import { PagesRoutingModule } from './pages.routing';
import { PagesComponent } from './pages.component';
import { BlankComponent } from './blank/blank.component';
import { MenuComponent } from '../theme/components/menu/menu.component';
import { SidebarComponent } from '../theme/components/sidebar/sidebar.component';
import { NavbarComponent } from '../theme/components/navbar/navbar.component';
import { MessagesComponent } from '../theme/components/messages/messages.component';
import { BreadcrumbComponent } from '../theme/components/breadcrumb/breadcrumb.component';
import { BackTopComponent } from '../theme/components/back-top/back-top.component';
import { SearchComponent } from './search/search.component';
import { UsersComponent } from './users/userPage/users.component'; 
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CreateUserComponent } from './users/createUser/create-user/create-user.component';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { NgMultiselectDropdown3Module } from 'ng-multiselect-dropdown3';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    NgScrollbarModule,  
    DirectivesModule,
    PipesModule,
    PagesRoutingModule,
    NgxDatatableModule,
    SelectDropDownModule,
    NgMultiselectDropdown3Module,
    FormsModule
  ],
  declarations: [ 
    PagesComponent,
    BlankComponent,
    MenuComponent,
    SidebarComponent,
    NavbarComponent,
    MessagesComponent,
    BreadcrumbComponent,
    BackTopComponent,
    SearchComponent,
    UsersComponent,
    CreateUserComponent 
  ]
})
export class PagesModule { }
