import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {DayPilot} from "@daypilot/daypilot-lite-angular";
import {HttpClient} from "@angular/common/http";
import { random, randomGroupsAndItems } from "./helper";
import { addDays, GanttGroup, GanttItem, getUnixTime } from "@worktile/gantt";
import { environment } from "src/environments/environment";
import { Project } from "src/app/logic/models/project";

@Injectable()
export class DataService {
  static colors = {
    green: "#6aa84f",
    yellow: "#f1c232",
    red: "#cc4125",
    gray: "#808080",
    blue: "#2e78d6",
  };
  private group_id: number = 0;
  activeProjects: any[] = [];
  currentProjects: any[] = [];
  onHoldProjects: any[] = [];
  completedProjects: any[] = [];

  items: GanttItem[] = [];
  groups: GanttGroup[] = [];

  types: any[] = [
    { type: 'Clear & Grub / Demolition', task: 'Traffic Control' },
    { type: 'Clear & Grub / Demolition', task: 'Clear & Grub' },
    { type: 'Clear & Grub / Demolition', task: 'Asphalt Demolition' },
    { type: 'Clear & Grub / Demolition', task: 'Curb Demolition' },
    { type: 'Clear & Grub / Demolition', task: 'Sawcutting' },
    { type: 'Clear & Grub / Demolition', task: 'Demo Concrete Sidewalk/Flatwork' },
    { type: 'Clear & Grub / Demolition', task: 'Building Demolition' },
    { type: 'Clear & Grub / Demolition', task: 'Select Brush Removal' },
    { type: 'Clear & Grub / Demolition', task: 'Fence Removal' },
    { type: 'Clear & Grub / Demolition', task: 'Remove Existing Storm Pipe' },
    { type: 'Clear & Grub / Demolition', task: 'Remove Existing Storm Drainage Structure' },
  
    { type: 'Erosion Control', task: 'Construction Entrance' },
    { type: 'Erosion Control', task: 'Concrete Washout Pit, Note: washout/spoinls for other trades is not included' },
    { type: 'Erosion Control', task: 'Truck Wash (Installation / Removal)' },
    { type: 'Erosion Control', task: 'Truck Wash (Sitework labor), truck wash fees, labor for other trades not included' },
    { type: 'Erosion Control', task: 'Silt Fence' },
    { type: 'Erosion Control', task: 'Burlap Baffle Fence' },
    // ... (other erosion control tasks)
  
    { type: 'Rough Grading', task: 'Topsoil (Strip 6" & Place On site)' },
    { type: 'Rough Grading', task: 'Topsoil (Respread On site)' },
    // ... (other rough grading tasks)
  
    { type: 'Fine Grading', task: 'Fine Grade Building Pad (+-0.1\')' },
    { type: 'Fine Grading', task: 'Fine Grade Curb (+-0.1\')' },
    // ... (other fine grading tasks)
  
    { type: 'Storm Drainage', task: 'Outlet Control Structure' },
    { type: 'Storm Drainage', task: 'Area Drain' },
    // ... (other storm drainage tasks)
  
    { type: 'Detention System', task: 'Excavate for Detention System (Stockpile On Site)' },
    { type: 'Detention System', task: 'Excavate for Detention System (Waste Off Site)' },
    // ... (other detention system tasks)
  
    { type: 'Sand Filter', task: 'Excavate for Sand Filter (Waste Off Site)' },
    { type: 'Sand Filter', task: '6" Perforated PVC' },
    // ... (other sand filter tasks)
  
    { type: 'Roof Drains', task: '4" HDPE Roof Drain' },
    { type: 'Roof Drains', task: '6" HDPE Roof Drain' },
    // ... (other roof drain tasks)
  
    { type: 'Water System', task: 'Tap / Meter Assembly' },
    { type: 'Water System', task: 'Tie Into Water Meter (Installed by Others)' },
    // ... (other water system tasks)
  
    { type: 'Sewer System', task: 'Tie Into CO/MH at ROW Line' },
    { type: 'Sewer System', task: 'Sanitary Sewer Manhole' },
    // ... (other sewer system tasks)
  
    { type: 'Concrete', task: '6" Vertical Curb' },
    { type: 'Concrete', task: '18" Curb & Gutter' },
    // ... (other concrete tasks)
  
    { type: 'Asphalt Paving', task: '6" ABC Stone Placement (LDP)' },
    { type: 'Asphalt Paving', task: '8" ABC Stone Placement (HDP)' },
    // ... (other asphalt paving tasks)
  
    { type: 'Misc Items', task: 'Gray Modular Block Retaining Wall w/ Certification' },
    { type: 'Misc Items', task: 'Brick Pavers / Decorative Concrete / Base Course' },
  ];

  


  constructor(private http : HttpClient){
  }


  apiBaseUrl = environment.apiBaseUrl
  route = this.apiBaseUrl + "data/"

  getProjects(): any[] {
    return this.activeProjects;
  }
  getActiveProjects(): Observable<Project[]> {
    const URL = `${this.route}getActiveProjects`;
    return this.http.get<Project[]>(URL);
  }
  getOnHoldProjects(): Observable<Project[]> {
    const URL = `${this.route}getOnHoldProjects`;
    return this.http.get<Project[]>(URL);
  }
  getCompletedProjects(): Observable<Project[]> {
    const URL = `${this.route}getCompletedProjects`;
    return this.http.get<Project[]>(URL);
  }
  getAllItems() {
    const URL = `${this.route}allItems`;
    return this.http.get<any>(URL);
  }
  getHolidays(): Observable<any[]> {
    const URL = `${this.route}holidays`;
    return this.http.get<any>(URL);
  }
  getTaskList(): Observable<any[]> {
    const URL = `${this.route}getTaskList`;
    return this.http.get<any>(URL);
  }
  getDict(): Observable<any> {
    const URL = `${this.route}getDict`;
    return this.http.get<any>(URL);
  }
  getForemans(): Observable<any> {
    const URL = `${this.apiBaseUrl}foremen`;
    return this.http.get<any>(URL);
  }
  addProject(project:any): void{
    this.activeProjects.push(project);
  }

  getColors(): any[] {
      const colors = [
        {name: "Green", id: DataService.colors.green},
        {name: "Yellow", id: DataService.colors.yellow},
        {name: "Red", id: DataService.colors.red},
        {name: "Gray", id: DataService.colors.gray},
        {name: "Blue", id: DataService.colors.blue},
      ];
      return colors;
  }

  // let project = {
  //   name: this.project.companyName,
  //   companyName: this.selectedManager,
  //   start: new Date(this.range.get('start').value),
  //   end: new Date(this.range.get('end').value),
  //   tasks: this.selectedTasks
  // };
  createProject(project: any) {
    const group_id = `00000${this.group_id}`
    this.group_id += 1;
    this.groups.push({
      id: group_id,
      title: project.name
    })
    project.tasks.forEach(task => {
      console.log(task);
      this.items.push({
        id: `${group_id}${Math.floor(Math.random() * 100000000)}`,
        title: `${task.task}`,
        start: getUnixTime(task.start),
        end: getUnixTime(task.end),
        group_id: group_id,
        expandable: true,
    });
    });
    console.log(project.tasks);
  }

  createProjectApi(project: any): Observable<null>{
    const URL = `${this.route}createProject`;
    return this.http.post<null>(URL, project);
  }

  createTask(task: any): Observable<null> {
    const URL = `${this.route}createTask`;
    return this.http.post<null>(URL, task);
  }

  createForeman(foreman: any): Observable<null> {
    const URL = `${this.apiBaseUrl}/foremen`;
    return this.http.post<null>(URL, foreman);
  }

  deleteForeman(foremanId: number): Observable<null> {
    const URL = `${this.apiBaseUrl}/foremen/${foremanId}`;
    return this.http.delete<null>(URL);
  }

  deleteTasklist(taskListId: number): Observable<null> {
    const URL = `${this.apiBaseUrl}data/taskList/${taskListId}`;
    return this.http.delete<null>(URL);
  }

  deleteActiveProject(projectId: number): Observable<null> {
    const URL = `${this.apiBaseUrl}/data/${projectId}`;
    return this.http.delete<null>(URL);
  }

  addHoliday(holiday: any): Observable<null> {
    const URL = `${this.route}createHoliday`;
    return this.http.post<null>(URL, holiday);
  }

  updateTask(item: any): Observable<null> {
    const URL = `${this.route}updateTask`;
    return this.http.post<null>(URL,item);
  }
  editTask(item: any): Observable<null> {
    const URL = `${this.route}editTask`;
    return this.http.put<null>(URL,item);
  }
  createRandomProjects(length:number) {
    const groups: GanttGroup[] = [];
    let items: GanttItem[] = [];
    for (let i = 0; i < length; i++) {
        groups.push({
            id: `00000${i}`,
            title: `Example Customer-${i}`
        });
        items = [...items, ...this.randomItems(6, undefined, groups[i].id)];
        this.group_id += 1;
    }
    this.groups = groups;
    this.items = items;
  }
   getRandomTask(): string {
    const randomIndex = Math.floor(Math.random() * this.types.length);
    const randomtask =  this.types[randomIndex];
    return `${randomtask.task}`;
  }
  
  randomItems(length: number, parent?: GanttItem, group?: string) {
    const items = [];
    for (let i = 0; i < length; i++) {
        const start = addDays(new Date(), random(0, 20));
        const end = addDays(start, random(4, 10));
        items.push({
            id: `${parent?.id || group || ''}${Math.floor(Math.random() * 100000000)}`,
            title: `${this.getRandomTask()}`,
            start: getUnixTime(start),
            end: getUnixTime(end),
            group_id: group,
            expandable: true,
        });
    }
    return items;
  }
  convertToActive(projectId: number){
    const URL = `${this.route}convert_active/`;
    return this.http.put<any>(URL + projectId, {});
  }
  convertToOnHold(projectId: number){
    const URL = `${this.route}convert_on_hold/`;
    return this.http.put<any>(URL + projectId, {});
  }
  convertToComplete(projectId: number){
    const URL = `${this.route}convert_complete/`;
    return this.http.put<any>(URL + projectId, {});
  }
  convertToDeleted(projectId: number){
    const URL = `${this.route}delete/`;
    return this.http.put<any>(URL + projectId, {});
  }
  convertToActionNeeded(projectId: number, text: string){
    const URL = `${this.route}convert_action_needed/`;
    return this.http.put<any>(URL + projectId, {text});
  }

  
  deleteRow(row: any){
    this.activeProjects = this.activeProjects.filter(item => item.name !== row.name);
  }
}


