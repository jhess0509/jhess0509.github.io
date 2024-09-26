import { HttpErrorResponse } from "@angular/common/http";
import { ChangeDetectorRef, Component, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormGroup, FormControl, FormBuilder, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { DatatableComponent, SelectionType } from "@swimlane/ngx-datatable";
import { Subscription } from "rxjs";
import { UsersService } from "src/app/logic/services/users.service";
import { DataService } from "../../dashboard/data.service";
import { CreateUserComponent } from "../../users/createUser/create-user/create-user.component";
import { EditTableComponent } from "./edit-table/edit-table.component";
import { Project } from "src/app/logic/models/project";

@Component({
  selector: 'az-dynamic-tables',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./pages.component.scss'],
  templateUrl: './dynamic-tables.component.html',
})
export class DynamicTablesComponent {
  subs = new Subscription();
  editing: any = {};
  editingName: any = {};
  rows: any[] = [];    
  projectRows: any[] = []; 
  holidayRows: any[] = [];
  filtered_rows: any[] = [];
  selected: any[] = []; 
  columns: any[] = [];
  columnWidths: any;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  selection: SelectionType;
  project: any = {};
  projectManagers: any[] = [];
  availableTasks: any[] = [];
  selectedManager: string;
  selectedTask: any = {};
  selectedTasks: any[] = [];
  selectedHoliday: string = "";
  selectedHolidayDate: any;
  startDate:any = {};
  activeProjects: Project[];
  
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  taskrange = new FormGroup({
    taskstart: new FormControl<Date | null>(null, Validators.required),
    taskend: new FormControl<Date | null>(null, Validators.required),
  });
  holidayRange = new FormGroup({
    holidayStart: new FormControl<Date | null>(null),
    holidayEnd: new FormControl<Date | null>(null),
  });
  updateValue(event, cell, rowIndex) {
    this.editing[rowIndex + '-' + cell] = false;
    this.projectRows[rowIndex][cell] = event.target.value;
    this.projectRows = [...this.projectRows];
  }
  updateValueName(event, cell, rowIndex) {
    this.editingName[rowIndex + '-' + cell] = false;
    this.rows[rowIndex][cell] = event.target.value;
    this.rows = [...this.rows];
  }

  constructor(private usersService: UsersService, private dataService: DataService, public dialog: MatDialog) { 
  }

  ngOnInit() {
    this.loadUsers();
  }
  ngAfterViewInit() {
    console.log("entered");
    const selectedManager = localStorage.getItem('selectedManager');
    if (selectedManager) {
      this.selectedManager = selectedManager;
    }
    const range = localStorage.getItem('range');
    if (range) {
      this.range.setValue(JSON.parse(range));
    }
    const taskRange = localStorage.getItem('taskrange');
    if (taskRange) {
      this.taskrange.setValue(JSON.parse(taskRange));
    }
    const selectedTask = localStorage.getItem('selectedTask');

    if (selectedTask && selectedTask !== "null" && selectedTask !== "undefined") {
      console.log("Selected task:");
      console.log(selectedTask);
      this.selectedTask = selectedTask;
    } else {
      console.log("No valid selected task in localStorage");
      this.selectedTask = null;  // or handle it however you want when there's no valid task
    }
    const selectedTasks = localStorage.getItem('selectedTasks');
    if (selectedTasks) {
      this.selectedTasks = JSON.parse(selectedTasks);
    }
    const project = localStorage.getItem('project');
    if (selectedTasks) {
      this.project = JSON.parse(project);
    }
  }

  loadUsers() {
    this.dataService.getForemans().subscribe((data) => {
      console.log(data);
      this.projectManagers = data;
      this.rows = data;
      this.projectManagers = this.projectManagers.map(item => {
        return {
          label: `${item.firstname} ${item.lastname}`,
          value: `${item.firstname} ${item.lastname}`
        };
      });
    });
    try{
      this.subs.add(this.dataService.getActiveProjects()
        .subscribe((res:any) => {
          this.activeProjects = res
          this.activeProjects = [...this.activeProjects];
        }));
    }
    catch{
    }
    try{
      this.subs.add(this.dataService.getHolidays()
        .subscribe((res:any) => {
          this.holidayRows = res
          this.holidayRows = [...this.holidayRows];
        }));
    }
    catch{
    }
    try{
      this.subs.add(this.dataService.getTaskList()
        .subscribe((res:any) => {
          this.projectRows = res;
          this.availableTasks = res.map(user => {
            return {
              label: `${user.task}`,
              value: `${user.task}`,
              // You can include other properties if needed
            };
          });
          this.availableTasks = [...this.availableTasks];
          this.projectRows = [...this.projectRows];
        }));
    }
    catch{
    }
    this.rows = [...this.rows];
    this.projectRows = [...this.projectRows];
    this.activeProjects = [...this.activeProjects];
  }
  submit(){
    if (this.taskrange.valid) {
      console.log('Task added:', this.taskrange.value);
      this.selectedTasks.push({
        task: this.selectedTask,
        start: new Date(this.taskrange.get('taskstart').value),
        end: new Date(this.taskrange.get('taskend').value)
      });
      this.selectedTasks = [...this.selectedTasks];
      // Process your task submission
    } else {
      console.log('Please select both a start and end date');
    }
    
  }
  toggleEdit(row): void {
    row.isEditing = !row.isEditing;

    // If you want to save the changes immediately when toggling out of edit mode,
    // you can call a method to save the changes here.
    // Example: this.saveChanges(row);
  }
  

  cancelEdit(row): void {
    row.isEditing = false;
  }
  submitProject(){
    if (!this.selectedManager) {
      alert('Please select a Foreman before submitting the project.');
      return;
    }
    if(!this.project.companyName || this.project.companyName == ""){
      alert('Please select a Project Name before submitting the project.');
      return;
    }
    console.log(this.selectedManager);

    let project = {
      name: this.project.companyName,
      companyName: this.selectedManager,
      start: new Date(this.range.get('start').value),
      end: new Date(this.range.get('end').value),
      tasks: this.selectedTasks,
      status: 'active'
    };
    try{
      this.subs.add(this.dataService.createProjectApi(project)
        .subscribe((res:any) => {
          this.dataService.getActiveProjects().subscribe((data) => {
            this.activeProjects = data;
            this.activeProjects = [...this.activeProjects];
          });
        }));
    }
    catch{
    }
    //console.log(this.selectedTasks);
    //this.dataService.addProject(project);
    //this.dataService.createProject(project);
    
    
    this.selectedManager = null;
    this.range.reset();
    this.taskrange.reset();
    this.selectedTask = [];
    this.selectedTasks = [];
    this.project = {};
    
  }
  submitHoliday(){
    let holiday = {
      name: this.selectedHoliday,
      start: new Date(this.holidayRange.get('holidayStart').value),
      end: new Date(this.holidayRange.get('holidayEnd').value)
    };
    this.dataService.addHoliday(holiday).subscribe(
      (response) => {
        console.log('Project status updated successfully:', response);
      },
      (error) => {
        console.error('Error updating project status:', error);
      }
    );
    this.holidayRows.push(holiday);
    this.holidayRows = [...this.holidayRows];
    this.holidayRange.reset();
    this.selectedHoliday = "";
  }
  deleteRow(row: any) {
    this.selectedTasks = this.selectedTasks.filter(item => item !== row);
  }
  deleteRowProject(row: any) {
    if(confirm("Are you sure to Delete the Project?")) {
      this.dataService.deleteActiveProject(row.id).subscribe(
        (response) => {
          this.projectRows = this.projectRows.filter(item => item !== row);
          console.log('Project status updated successfully:', response);
        },
        (error) => {
          console.error('Error updating project status:', error);
        }
      );
    }
  }
  deleteRowManager(row: any) {
    this.rows = this.rows.filter(item => item !== row);
    this.dataService.deleteForeman(row.id).subscribe(
      (response) => {
        console.log('Project status updated successfully:', response);
      },
      (error) => {
        console.error('Error updating project status:', error);
      }
    );
  }
  deleteRowTask(row: any) {
    this.dataService.deleteTasklist(row.id).subscribe(
      (response) => {
        this.projectRows = this.projectRows.filter(item => item.id !== row.id);
        this.projectRows = [...this.projectRows];
        this.dataService.deleteRow(row);
        console.log('Project status updated successfully:', response);
      },
      (error) => {
        console.error('Error updating project status:', error);
      }
    );
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

  addProjectItem(): void {
    // Logic to add an item to the list
    // For example, you can push a new item to the existing list or navigate to a new item creation page
    const dialogRef = this.dialog.open(EditTableComponent, {
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
    
    if(this.selectedManager){
      localStorage.setItem('selectedManager', this.selectedManager);
    }
    else{
      localStorage.removeItem('selectedManager');
    }

    if(this.selectedTask && typeof this.selectedTask === 'object'){
      console.log("removiing item");
      localStorage.removeItem('selectedTask');
    }
    else if (this.selectedTask !== null && this.selectedTask !== undefined) {
      console.log("adding item");
      console.log(this.selectedTask);
      localStorage.setItem('selectedTask', this.selectedTask);
    } 
    else {
      console.log("selectedTask is null or undefined, not adding to localStorage");
    }

    
    localStorage.setItem('range', JSON.stringify(this.range.value));
    localStorage.setItem('taskrange', JSON.stringify(this.taskrange.value));
    localStorage.setItem('selectedTask', this.selectedTask);
    localStorage.setItem('selectedTasks', JSON.stringify(this.selectedTasks));
    localStorage.setItem('project', JSON.stringify(this.project));
  }

}


