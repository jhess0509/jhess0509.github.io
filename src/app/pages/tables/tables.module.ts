import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DirectivesModule } from '../../theme/directives/directives.module';
import { BasicTablesComponent } from './basic-tables/basic-tables.component';
import { DynamicTablesComponent } from './dynamic-tables/dynamic-tables.component';
import { NgMultiselectDropdown3Module } from 'ng-multiselect-dropdown3';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { EditTableComponent } from './dynamic-tables/edit-table/edit-table.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTimepickerModule } from 'mat-timepicker';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { BrowserModule } from '@angular/platform-browser';

export const routes: Routes = [
  { path: '', redirectTo: 'dynamic-tables', pathMatch: 'full'},
  { path: 'basic-tables', component: BasicTablesComponent, data: { breadcrumb: 'Basic' } },
  { path: 'dynamic-tables', component: DynamicTablesComponent, data: { breadcrumb: 'Dynamic' } }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TimepickerModule.forRoot(),
    ReactiveFormsModule,
    NgxDatatableModule,
    NgMultiselectDropdown3Module,
    DirectivesModule,
    SelectDropDownModule,
    NgSelectModule,
    MatInputModule,
    MatDatepickerModule,
    NgxMaterialTimepickerModule,
    MatNativeDateModule,
    MatTimepickerModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    BasicTablesComponent,
    DynamicTablesComponent,
    EditTableComponent
  ]
})
export class TablesModule { }
