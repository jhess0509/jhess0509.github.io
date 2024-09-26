import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UsersService } from 'src/app/logic/services/users.service';
import { DataService } from '../data.service';
import { GanttItem, GanttGroup } from '@worktile/gantt';
import { Subscription } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'az-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent {
  availableTasks: any[] = [];
  subs = new Subscription();

  taskrange: FormGroup;
  isFormValid: boolean = false;
  isFormSubmitted: boolean = false;
  isTaskValid: boolean = false;  // Define the property

  items: GanttItem[] = [];
  groups: GanttGroup[] = [];
  selectedProject: any = {};
  selectedTask: any = {};
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<AddTaskComponent>, private usersService: UsersService, private ds: DataService, private formBuilder: FormBuilder) {
    this.subs.add(this.ds.getTaskList()
        .subscribe((res:any) => {
          this.availableTasks = res.map(user => {
            return {
              label: `${user.task}`,
              value: `${user.task}`,
              // You can include other properties if needed
            };
          });
          this.availableTasks = [...this.availableTasks];
        }));
    this.ds.getAllItems().subscribe((data) => {
      console.log(data);
      this.groups = data.groups;
      this.items = data.items;
    });
    this.watchSelectedTask();

  }
  watchSelectedTask() {
    // Ensure that selectedTask is updated whenever it changes
    this.selectedTask = null;
    this.isTaskValid = this.selectedTask && Object.keys(this.selectedTask).length > 0;
    console.log("validation");
    console.log(this.isTaskValid);
  }

  ngOnInit(): void {
    this.taskrange = this.formBuilder.group({
      start: ['', Validators.required],
      end: ['', Validators.required]
    });

    // Subscribe to valueChanges of the form to update isFormValid
    this.taskrange.valueChanges.subscribe(() => {
      this.isFormValid = this.taskrange.valid;
    });
  }

  onTaskChange(task: any) {
    this.selectedTask = task;
    this.isTaskValid = task && Object.keys(task).length > 0;
    console.log("validation");
    console.log(this.isTaskValid);
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
