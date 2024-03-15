import { HttpErrorResponse } from "@angular/common/http";
import { ChangeDetectorRef, Component, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
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
  selectedManager: any = {};
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
    taskstart: new FormControl<Date | null>(null),
    taskend: new FormControl<Date | null>(null),
  });
  holidayRange = new FormGroup({
    holidayStart: new FormControl<Date | null>(null),
    holidayEnd: new FormControl<Date | null>(null),
  });
  updateValue(event, cell, rowIndex) {
    console.log('inline editing rowIndex', rowIndex);
    this.editing[rowIndex + '-' + cell] = false;
    this.projectRows[rowIndex][cell] = event.target.value;
    this.projectRows = [...this.projectRows];
    console.log('UPDATED!', this.projectRows[rowIndex][cell]);
    console.log(this.projectRows);
  }
  updateValueName(event, cell, rowIndex) {
    console.log('inline editing rowIndex', rowIndex);
    this.editingName[rowIndex + '-' + cell] = false;
    this.rows[rowIndex][cell] = event.target.value;
    this.rows = [...this.rows];
    console.log('UPDATED!', this.rows[rowIndex][cell]);
    console.log(this.rows);
  }

  constructor(private usersService: UsersService, private dataService: DataService, public dialog: MatDialog, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.rows = this.usersService.getUsers();
    this.projectManagers = this.usersService.getUsers().map(user => {
      return {
        label: `${user.firstname} ${user.lastname}`,
        value: `${user.firstname} ${user.lastname}`,
        // You can include other properties if needed
      };
    });
    this.availableTasks = this.usersService.getProjectTasks().map(user => {
      return {
        label: `${user.task}`,
        value: `${user.task}`,
        // You can include other properties if needed
      };
    });
    try{
      this.subs.add(this.dataService.getActiveProjects()
        .subscribe((res:any) => {
          console.log(res)
          this.activeProjects = res
          this.activeProjects = [...this.activeProjects];
        }));
    }
    catch{
    }
    this.projectRows = this.usersService.getProjectTasks();
    this.rows = [...this.rows];
    this.projectRows = [...this.projectRows];
    this.activeProjects = [...this.activeProjects];
    this.cdr.detectChanges();
  }
  submit(){
    console.log(this.availableTasks);
    this.selectedTasks.push({
      task: this.selectedTask,
      start: new Date(this.taskrange.get('taskstart').value),
      end: new Date(this.taskrange.get('taskend').value)
    });
    this.selectedTasks = [...this.selectedTasks];
    console.log(this.selectedTasks);
    this.cdr.detectChanges();
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
          console.log(this.dataService.getActiveProjects);
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
    
    
    this.selectedManager = [];
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
    this.holidayRows.push(holiday);
    this.holidayRows = [...this.holidayRows];
    this.holidayRange.reset();
    this.selectedHoliday = "";
  }
  deleteRow(row: any) {
    this.selectedTasks = this.selectedTasks.filter(item => item !== row);
  }
  deleteRowProject(row: any) {
    this.activeProjects = this.activeProjects.filter(item => item !== row);
    console.log(row);
    this.dataService.deleteRow(row);
  }
  deleteRowManager(row: any) {
    this.rows = this.rows.filter(item => item !== row);
  }
  deleteRowTask(row: any) {
    this.projectRows = this.usersService.deleteProjectTask(row);
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
      console.log(this.usersService.getProjectTasks());
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
  }

}


