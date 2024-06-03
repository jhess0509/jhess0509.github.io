import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user-model/user-model.component';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  users: any[] = [

    { firstname: 'Donnell', lastname: 'Soler' },
    { firstname: 'Norberto', lastname: 'Reyes Hernandez' },
    { firstname: 'Flavio', lastname: 'Serrano Gonzalez' },
    { firstname: 'Jose', lastname: 'Resendiz Soto' },
    { firstname: 'Rendi', lastname: 'Venegas-Cruz' },
    { firstname: 'Gerardo', lastname: 'Chavez Rojo' },
    { firstname: 'Thomas', lastname: 'Arthur' },
    { firstname: 'Francisco', lastname: 'Hernandez' },
    { firstname: 'Richard', lastname: 'Lovely' },
    { firstname: 'Chad', lastname: 'White' },
    { firstname: 'Matt', lastname: 'Gesner' },
    { firstname: 'Gary', lastname: 'Christie' },
    { firstname: 'Shaun', lastname: 'Ware' },
    { firstname: 'Stephen', lastname: 'Fowler' },
    { firstname: 'Thomas', lastname: 'Burgess' },
    { firstname: 'David', lastname: 'McDaniel' },
    { firstname: 'Eric', lastname: 'Rodrigues' },
    { firstname: 'Brett', lastname: 'Parsley' },
    { firstname: 'Jonathan', lastname: 'Smith' },
    { firstname: 'Adam', lastname: 'Hart' },
    { firstname: 'Darren', lastname: 'McManus' },
    { firstname: 'Mark', lastname: 'Collins' },
    { firstname: 'Hager', lastname: 'McCune' },
    { firstname: 'David', lastname: 'Harwell' },
    { firstname: 'Keith', lastname: 'Breedlove' },
    { firstname: 'William', lastname: 'Whitlow' },
    { firstname: 'Jeffrey', lastname: 'Whittington' },
    { firstname: 'Margarito', lastname: 'Mejia Romero' },
    { firstname: 'Nectali', lastname: 'Bueso Canales' },
    { firstname: 'Henry', lastname: 'Brown' },
    { firstname: 'Brian', lastname: 'Lemon' },
    { firstname: 'Jason', lastname: 'Prince' },
    { firstname: 'Sergio', lastname: 'Almanza Navarro' },
    { firstname: 'Tyler', lastname: 'Birdsong' },
    { firstname: 'Carlos', lastname: 'Sanchez Farfan' },
    { firstname: 'Christopher', lastname: 'Chalk' },
    { firstname: 'Oscar', lastname: 'Martinez Tobar' },
    { firstname: 'Christopher', lastname: 'Perry' },
    { firstname: 'Marco', lastname: 'Avila Pena' },
    { firstname: 'Brandon', lastname: 'Ledford' },
    { firstname: 'Kary', lastname: 'Combs' },
    { firstname: 'Joshua', lastname: 'Coley' },
    { firstname: 'Daniel', lastname: 'Outwater' },
    { firstname: 'Mark', lastname: 'Collins' },
    { firstname: 'Gregory', lastname: 'Leatherman' },
    { firstname: 'Jeffrey', lastname: 'Turman' },
    { firstname: 'Benjamin', lastname: 'Hubbard' },
    { firstname: 'Michael', lastname: 'Romeo' },
    { firstname: 'Cory', lastname: 'Blackwell' },
    { firstname: 'Scott', lastname: 'Barbee' },
    { firstname: 'Richard', lastname: 'Birdsong' },
    { firstname: 'Lindsay', lastname: 'Austin' },
    { firstname: 'Rhett', lastname: 'Cox' },
    { firstname: 'Brandon', lastname: 'Ervin' },
    { firstname: 'Austin', lastname: 'Locklear' },
    { firstname: 'David', lastname: 'Mangiamele' },
    { firstname: 'Donnie', lastname: 'Doster' },
    { firstname: 'Drew', lastname: 'Barnett' },
    { firstname: 'Jeff', lastname: 'Crump' }
    
  ]; 

  projectTypes: string[] = [
    'Construction Layout',
    'Clear & Grub/Demoltion',
    'Erosion Control'

    // You can provide initial values for other properties as well
  ]; 
  projectTasks: { type: string, task: string }[] = [
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

  constructor(private http: HttpClient) { }

  apiBaseUrl = environment.apiBaseUrl
  route = this.apiBaseUrl + "users/"

  getUsers(): User[] {
    console.log(this.users);
    return this.users;
   }
   getProjectTypes(): string[] {
    return this.projectTypes;
   }

  getRoles(): Observable<string[]> {
    const URL = `${this.route}getRoles`;
    return this.http.get<string[]>(URL);
  }

  addTaskList(taskList: any): Observable<null> {
    const URL = `${this.apiBaseUrl}data/createTaskList`;
    return this.http.post<null>(URL, taskList);
  }

  createUser(user: User): null{
    this.users.push(user);
    return null;
  }

}
