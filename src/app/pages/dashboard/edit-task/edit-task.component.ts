import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActionNeededComponent } from '../action-needed/action-needed.component';
import { FormControl, FormGroup } from '@angular/forms';
import { DataService } from '../data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'az-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.scss']
})
export class EditTaskComponent {
  reason: any;

  selectedForeman: any;
  subs = new Subscription();

  foremanFilters: any[] = [

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

  taskrange: FormGroup;
  id: any;
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<ActionNeededComponent>,public ds: DataService) {
    this.selectedForeman = data.foundItem.foreman;
    const startDate = new Date(data.foundItem.start);
    const endDate = new Date(data.foundItem.end);
    this.taskrange = new FormGroup({
      start: new FormControl<Date | null>(startDate), // Set initial value for start control
      end: new FormControl<Date | null>(endDate), // Set initial value for end control
    });
    this.ds.getForemans().subscribe((data) => {
      console.log(data);
      this.foremanFilters = data;
      this.foremanFilters = this.foremanFilters.map(item => {
        return {
          label: `${item.firstname} ${item.lastname}`,
          value: `${item.firstname} ${item.lastname}`
        };
      });
    });
    this.id = data.foundItem.id

  }



  submit(){
    
    let task = {
      id: this.id,
      start: new Date(this.taskrange.get('start').value),
      end: new Date(this.taskrange.get('end').value),
      foreman: this.selectedForeman
    };

    try{
      this.subs.add(this.ds.editTask(task)
        .subscribe((res:any) => {
          this.dialogRef.close({  });
        }));
    }
    catch{
    }
    
  }

  cancel(){
    this.dialogRef.close({ reason: null });
  }
}


