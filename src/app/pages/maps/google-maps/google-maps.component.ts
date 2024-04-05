import { Component, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from '../../dashboard/data.service';

@Component({
  selector: 'az-google-maps',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './google-maps.component.html',
  styleUrls: ['./google-maps.component.scss']
})

export class GoogleMapsComponent {
  subs = new Subscription();
  activeProjects: any[];
  onHoldProjects: any[];
  completedProjects: any[];

  constructor( private dataService: DataService,) { }

  deleteRowProject(row: any) {
    this.activeProjects = this.activeProjects.filter(item => item !== row);
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    try{
      this.subs.add(this.dataService.getActiveProjects()
        .subscribe((res:any) => {
          console.log(res);
          this.activeProjects = res
          this.activeProjects = [...this.activeProjects];
        }));
    }
    catch{
    }
    try{
      this.subs.add(this.dataService.getOnHoldProjects()
        .subscribe((res:any) => {
          this.onHoldProjects = res
          this.onHoldProjects = [...this.onHoldProjects];
        }));
    }
    catch{
    }
    try{
      this.subs.add(this.dataService.getCompletedProjects()
        .subscribe((res:any) => {
          this.completedProjects = res
          this.completedProjects = [...this.completedProjects];
        }));
    }
    catch{
    }
  }
}
