import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UsersService } from 'src/app/logic/services/users.service';
import { DataService } from '../data.service';
import { GanttItem, GanttGroup } from '@worktile/gantt';
import { Subscription } from 'rxjs';

@Component({
  selector: 'az-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent {
  availableTasks: any[] = [];
  subs = new Subscription();

  taskrange = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  items: GanttItem[] = [];
  groups: GanttGroup[] = [];
  selectedProject: any = {};
  selectedTask: any = {};
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<AddTaskComponent>, private usersService: UsersService, private ds: DataService) {
    this.availableTasks = this.usersService.getProjectTasks().map(user => {
      return {
        label: `${user.task}`,
        value: `${user.task}`,
        // You can include other properties if needed
      };
    });
    this.ds.getAllItems().subscribe((data) => {
      console.log(data);
      this.groups = data.groups;
      this.items = data.items;
    });

  }



  submit(){
    
    let task = {
      name: this.selectedTask,
      project_id: this.selectedProject,
      start: new Date(this.taskrange.get('start').value),
      end: new Date(this.taskrange.get('end').value),
    };

    try{
      this.subs.add(this.ds.createTask(task)
        .subscribe((res:any) => {
          this.dialogRef.close({  });
        }));
    }
    catch{
    }
    
  }

  cancel(){
    this.dialogRef.close({  });
  }
}
