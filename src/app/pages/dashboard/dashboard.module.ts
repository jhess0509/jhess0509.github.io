import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DirectivesModule } from '../../theme/directives/directives.module';
import { PipesModule } from '../../theme/pipes/pipes.module';
import { DashboardComponent } from './dashboard.component';
import { TodoComponent } from './todo/todo.component';
import { ChatComponent } from './chat/chat.component';
import { FeedComponent } from './feed/feed.component';
import { DatamapComponent } from './datamap/datamap.component';
import { DynamicChartComponent } from './dynamic-chart/dynamic-chart.component';
import { NgChartsModule } from 'ng2-charts';
import { CalendarModule, DateAdapter, MOMENT } from 'angular-calendar';
import { SchedulerModule } from 'angular-calendar-scheduler';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import 'chart.js/dist/Chart.js';
import { DayPilotModule } from '@daypilot/daypilot-lite-angular';
import { DashboardService } from './dashboard.service';
import { GANTT_GLOBAL_CONFIG, NgxGanttModule } from '@worktile/gantt';
import { MatMenuModule } from '@angular/material/menu';
import {CdkMenu, CdkMenuItem, CdkMenuTrigger} from '@angular/cdk/menu';
import { ActionNeededComponent } from './action-needed/action-needed.component';
import { NgSelectModule } from '@ng-select/ng-select';


export const routes: Routes = [
  { path: '', component: DashboardComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgChartsModule,
    DirectivesModule,
    PipesModule,
    RouterModule.forChild(routes),
    DayPilotModule,
    NgxGanttModule,
    MatMenuModule,
    CdkMenuTrigger,
    CdkMenu,
    CdkMenuItem,
    NgSelectModule
  ],
  providers:    [ 
    {
      provide: GANTT_GLOBAL_CONFIG,
      useValue: {
        dateFormat: {
          week: 'W',
          month: 'M',
          quarter: 'QQQ',
          year: 'yyyy',
          yearMonth: 'MMM yyyy',
          yearQuarter: 'yyyy QQQ'
        }
      }
    }, DashboardService , ],
  declarations: [
    DashboardComponent,
    TodoComponent,
    ChatComponent,
    FeedComponent,
    DatamapComponent,
    DynamicChartComponent,
    ActionNeededComponent
  ]
})

export class DashboardModule { }
