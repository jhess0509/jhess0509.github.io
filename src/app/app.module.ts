import 'pace';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app.routing';
import { AppConfig } from './app.config';
import { AppComponent } from './app.component';
import { ErrorComponent } from './pages/error/error.component';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
import { LoginService } from './logic/services/login.service';
import { OrderServiceService } from './logic/services/order-service.service';
import { DatePipe } from '@angular/common';
import { ProductService } from './logic/services/product.service';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { UsersService } from './logic/services/users.service';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MatDialogModule } from '@angular/material/dialog';
import { NgMultiselectDropdown3Module } from 'ng-multiselect-dropdown3';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { AuthguardService } from './logic/services/authguard.service';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { DataService } from './pages/dashboard/data.service';
import { NgxGanttModule } from '@worktile/gantt';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  declarations: [
    AppComponent,
    ErrorComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(), 
    AppRoutingModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    NgSelectModule,
    NgxDatatableModule,
    MatDialogModule,
    NgMultiselectDropdown3Module,
    SelectDropDownModule,
    NgxGanttModule,
    MatMenuModule
  ],
  providers: [AppConfig, {provide: LocationStrategy, useClass: HashLocationStrategy}, OrderServiceService, DatePipe, ProductService, LoginService, UsersService, DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }