import {Component, ViewChild, AfterViewInit, ViewEncapsulation, ElementRef, Renderer2, ChangeDetectorRef} from "@angular/core";
import {
  DayPilot,
  DayPilotCalendarComponent,
  DayPilotMonthComponent,
  DayPilotNavigatorComponent
} from "@daypilot/daypilot-lite-angular";
import { GanttBarClickEvent, GanttBaselineItem, GanttDragEvent, GanttGroup, GanttItem, GanttLineClickEvent, GanttLinkDragEvent, GanttSelectedEvent, GanttTableDragDroppedEvent, GanttTableDragEndedEvent, GanttTableDragEnterPredicateContext, GanttTableDragStartedEvent, GanttToolbarOptions, GanttView, GanttViewOptions, GanttViewType, NgxGanttComponent, registerView } from "@worktile/gantt";
import { finalize, of } from 'rxjs';
import { DashboardService } from "./dashboard.service";
import { DataService } from "./data.service";
import { random, randomGroupsAndItems, randomItems } from "./helper";
import { delay } from 'rxjs/operators';
import { MatMenu, MatMenuTrigger } from "@angular/material/menu";
import { MatDialog } from "@angular/material/dialog";
import { ActionNeededComponent } from "./action-needed/action-needed.component";
import { GanttViewCustom } from "./custom-day-view";
import { AddTaskComponent } from "./add-task/add-task.component";
import { EditTaskComponent } from "./edit-task/edit-task.component";
import { format, parse } from "date-fns";
import { start } from "repl";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const customViewType = 'custom';

registerView(customViewType, GanttViewCustom);

@Component({
  selector: 'az-dashboard',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [ DashboardService ] 
})

export class DashboardComponent implements AfterViewInit { 

  viewType = GanttViewType.day;
  //viewType = customViewType;

  showWeekend = true;

statusFilters = [
  { value: 'active', label: 'Active'},
  { value: 'onHold', label: 'On Hold'},
  { value: 'actionNeeded', label: 'Action Needed'}
];

listForemanFilters: any[] = [];
foremanFilters: any[] = [];


isBaselineChecked = false;

isShowToolbarChecked = true;

loading = false;
expanded = true;
showComponent = true;

statusFilter: string;
statusFilterList: any[] = [];

foremanFilter: string;

items: GanttItem[] = [];
originalItems: GanttItem[] = [];

groups: GanttGroup[] = [];
originalGroups: GanttGroup[] = [];
selectedManager: any;

  baselineItems: GanttBaselineItem[] = [];

  viewOptions = {
      showWeekend: true,
  };

  dropEnterPredicate = (event: GanttTableDragEnterPredicateContext) => {
    return true;
};


  @ViewChild('gantt') ganttComponent: NgxGanttComponent;
  @ViewChild('menuTrigger') menuTrigger!: MatMenuTrigger;
  menuPosition: { x: string, y: string } = { x: '0px', y: '0px' };

  selectedItem: any;


  constructor(private ds: DataService, private el: ElementRef, private renderer: Renderer2, private cdr: ChangeDetectorRef, public dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.ds.getForemans().subscribe((data) => {
      this.foremanFilters = data;
      this.foremanFilters = this.foremanFilters.map(item => {
        return {
          label: `${item.firstname} ${item.lastname}`,
          value: `${item.firstname} ${item.lastname}`
        };
      });
    });
    
    //this.ds.createRandomProjects(10);
    this.ds.getDict().subscribe((data) => {
      this.nameDictionary = data;
      this.ds.getAllItems().subscribe((data) => {
        const parsedItems = data.items.map(item => ({
          ...item,
          start: this.parseDateWithoutGMT(item.start),
          end: this.parseDateWithoutGMT(item.end)
        }));
        const formattedItems = parsedItems.map(item => ({
          ...item,
          start: format(item.start, "dd MMM yyyy HH:mm:ss"),
          end: format(item.end, "dd MMM yyyy HH:mm:ss")
        }));
        data.items.sort((a, b) => b.start - a.start);
        this.groups = data.groups;
        this.items = formattedItems;
        this.items.forEach(task => {
          task.foreman = this.getManagerName(task.id);
        });
        
        
        this.originalGroups = [...this.groups];
        this.originalItems = [...this.items];
      });
    });
    
  }
  contextMenuPosition = { x: '0px', y: '0px' };

  parseDateWithoutGMT(dateString: string): Date {
    // Remove "GMT" part from the date string
    const dateStringWithoutGMT = dateString.replace(' GMT', '');
  
    // Parse the date string into a Date object
    return new Date(dateStringWithoutGMT);
  }

  generatePDF() {
    const ganttElement = document.getElementById('gantt-container');
    if (ganttElement) {
      html2canvas(ganttElement).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('landscape');
        const imgWidth = 297;
        const pageHeight = 210;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save('gantt.pdf');
      });
    }
  }

  parseDateWithoutAdjustment(dateString: string): Date {
    const parts = dateString.split(' ');
    const [day, month, year] = parts[1].split('-');
    const [hour, minute, second] = parts[4].split(':');
  
    return new Date(Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute), parseInt(second)));
  }

  updateManager(manager:any){

  }
  
  onGanttContextMenu(event: MouseEvent): void {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    // Ensure that the contextMenu is not undefined before accessing the menu

  }
 

  onContextMenuClick(option: string): void {
    console.log(`Clicked on: ${option}`);
    // Implement your logic for each context menu option
  }


  onBeforeEventRender(args: any) {
      const dp = args.control;
      args.data.areas = [
        {
          top: 3,
          right: 3,
          width: 20,
          height: 20,
          symbol: "assets/icons/daypilot.svg#minichevron-down-2",
          fontColor: "#fff",
          toolTip: "Show context menu",
          action: "ContextMenu",
        },
        {
          top: 3,
          right: 25,
          width: 20,
          height: 20,
          symbol: "assets/icons/daypilot.svg#x-circle",
          fontColor: "#fff",
          action: "None",
          toolTip: "Delete event",
          onClick: async (args: any)   => {
            dp.events.remove(args.source);
          }
        }
      ];

      args.data.areas.push({
        bottom: 5,
        left: 5,
        width: 36,
        height: 36,
        action: "None",
        image: `https://picsum.photos/36/36?random=${args.data.id}`,
        style: "border-radius: 50%; border: 2px solid #fff; overflow: hidden;",
      });
  }

  async onTimeRangeSelected(args: any) {
    const modal = await DayPilot.Modal.prompt("Create a new event:", "Event 1");
    const dp = args.control;
    dp.clearSelection();
    if (!modal.result) { return; }
    dp.events.add(new DayPilot.Event({
      start: args.start,
      end: args.end,
      id: DayPilot.guid(),
      text: modal.result
    }));
  }

  async onEventClick(args: any) {

  }

  ngAfterViewInit() {

}

barClick(event: GanttBarClickEvent) {
    this.selectedItem = event.item;
}
filter() {
  this.items = this.originalItems;
  if(this.statusFilter == "onHold"){
    this.items = this.items.filter(item => item.color === '#FF0000');
  }
  if(this.statusFilter == "actionNeeded"){
    this.items = this.items.filter(item => item.color === '#E1CA00');
  }
  if(this.statusFilter == "active"){
    this.items = this.items.filter(item => item.color !== '#E1CA00' && item.color !== '#FF0000');
  }
  if(this.foremanFilter != null && this.foremanFilter != ''){
    console.log(this.items);
    this.items = this.items.filter(item => this.getManagerName(item.id) === this.foremanFilter);
  }
  this.items=[...this.items]; 
}
onFilterChangeStatus(event: any): void {   
     
  this.filter();
}

activeButtonClick(): void {
    const foundItem = this.items.find(item => item.id === this.selectedItem.id);
    if (foundItem) {
        //if its on hold we need to do entire group else just the 1
        if(foundItem.actionText != null){
          foundItem.title = foundItem.title.replace(foundItem.actionText, '');
          foundItem.actionText = null;
        }
        foundItem.color = null;

        this.ds.convertToActive(parseInt(foundItem.id)).subscribe(
          (response) => {
            console.log('Project status updated successfully:', response);
          },
          (error) => {
            console.error('Error updating project status:', error);
          }
        );
        this.items=[...this.items]; 
    }
      // if its action needed remove text
      
}
actionNeededButtonClick(): void {
    const foundItem = this.items.find(item => item.id === this.selectedItem.id);
    if (foundItem) {
        const dialogRef = this.dialog.open(ActionNeededComponent, {
            width: '1000px',
            height: '300px'
            // Add any additional configuration options as needed
          });
      
          dialogRef.afterClosed().subscribe((reason: any) => {
            foundItem.color = '#E1CA00';
            let reasonString = reason.reason + " : ";
            foundItem.title = reasonString + foundItem.title;
            foundItem.actionText = reasonString;
            this.items=[...this.items];

            this.ds.convertToActionNeeded(parseInt(foundItem.id), reasonString).subscribe(
              (response) => {
                console.log('Project status updated successfully:', response);
              },
              (error) => {
                console.error('Error updating project status:', error);
              }
            );
          });
      // Modify the color property of the found item
      
    } else {
      console.log('Item not found');
    }
}
editButtonClick(): void {
  const foundItem = this.items.find(item => item.id === this.selectedItem.id);
  if (foundItem) {
      const dialogRef = this.dialog.open(EditTaskComponent, {
          width: '1000px',
          height: '300px',
          data: { foundItem }
          // Add any additional configuration options as needed
        });
    
        dialogRef.afterClosed().subscribe((reason: any) => {
          this.ds.getDict().subscribe((data) => {
            this.nameDictionary = data;
            this.ds.getAllItems().subscribe((data) => {
              this.groups = data.groups;
              this.items = data.items;
              this.items.forEach(task => {
                task.foreman = this.getManagerName(task.id);
              });
              
              this.originalGroups = [...this.groups];
              this.originalItems = [...this.items];
            });
          });
        });
    // Modify the color property of the found item
    
  } else {
    console.log('Item not found');
  }
}
onHoldButtonClick(): void {
    const foundItem = this.items.find(item => item.id === this.selectedItem.id);
    if(foundItem){
      foundItem.color = '#FF0000';
      if(foundItem.actionText != null){
        foundItem.title = foundItem.title.replace(foundItem.actionText, '');
        foundItem.actionText = null;
      }
      this.items=[...this.items];
    }
    this.ds.convertToOnHold(parseInt(foundItem.id)).subscribe(
      (response) => {
        console.log('Project status updated successfully:', response);
      },
      (error) => {
        console.error('Error updating project status:', error);
      }
    );
}
completedButtonClick(): void { 
  if(confirm("Are you sure to complete the Project?")) {
    const foundItem = this.items.find(item => item.id === this.selectedItem.id);
    const groupId = foundItem.group_id;
    this.items = this.items.filter(item => item.group_id !== groupId);
    this.originalItems = this.originalItems.filter(item => item.group_id !== groupId);
    this.groups = this.groups.filter(group => group.id !== groupId);
    this.originalGroups = this.originalGroups.filter(group => group.id !== groupId);
    this.ds.convertToComplete(parseInt(foundItem.group_id)).subscribe(
      (response) => {
        console.log('Project status updated successfully:', response);
      },
      (error) => {
        console.error('Error updating project status:', error);
      }
    );
    this.items=[...this.items];
    this.groups=[...this.groups];
  }
    
}
deletedButtonClick(): void { 
  if(confirm("Are you sure to delete the Task?")) {
    const foundItem = this.items.find(item => item.id === this.selectedItem.id);
    this.ds.convertToDeleted(parseInt(foundItem.id)).subscribe(
      (response) => {
        this.ds.getAllItems().subscribe((data) => {
          this.groups = data.groups;
          this.items = data.items;
          this.items.forEach(task => {
            task.foreman = this.getManagerName(task.id);
          });
          
          this.originalGroups = [...this.groups];
          this.originalItems = [...this.items];
        });
      },
      (error) => {
        console.error('Error updating project status:', error);
      }
    );
  }
    
}
deletedMenuButtonClick(item): void { 
  if(confirm("Are you sure to delete the Task?")) {
    const foundItem = this.items.find(itm => itm.id === item.id);
    this.ds.convertToDeleted(parseInt(foundItem.id)).subscribe(
      (response) => {
        this.ds.getAllItems().subscribe((data) => {
          this.groups = data.groups;
          this.items = data.items;
          this.items.forEach(task => {
            task.foreman = this.getManagerName(task.id);
          });
          
          this.originalGroups = [...this.groups];
          this.originalItems = [...this.items];
        });
      },
      (error) => {
        console.error('Error updating project status:', error);
      }
    );
  }
    
}
ngOnDestroy(): void {
    console.log('Component destroyed');
  }
onContextMenu(event: MouseEvent): void {
    event.preventDefault();

    // Calculate the cursor position
    this.menuPosition.x = event.clientX + 'px';
    this.menuPosition.y = event.clientY + 'px';

    // Open the context menu using MatMenuTrigger
    this.menuTrigger.openMenu();
  }

private nameDictionary: { [key: string]: string } = {};

getRandomName(): string {
  const randomIndex = Math.floor(Math.random() * this.users.length);
  const randomUser = this.users[randomIndex];
  return `${randomUser.firstname} ${randomUser.lastname}`;
}

getManagerName(item: any): string {
  if (!this.nameDictionary[item]) {
    // If the item is not in the dictionary, generate a random name and store it
    return ""
  }
  else{
    return this.nameDictionary[item];
  }


}

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


lineClick(event: GanttLineClickEvent) {
    //this.thyNotify.info('Event: lineClick', `你点击了 ${event.source.title} 到 ${event.target.title} 的关联线`);
}

dragMoved(event: GanttDragEvent) {
}

dragEnded(event: GanttDragEvent) {
    //this.ds.updateTask(event.item);
    const adjustedItem = {
      ...event.item,
      start: event.item.start - 14400, // Subtract 4 hours (14400 seconds) from start epoch
      end: event.item.end - 14400 // Subtract 4 hours (14400 seconds) from end epoch
    };

    this.ds.updateTask(adjustedItem).subscribe(
      (response) => {
        console.log('Project status updated successfully:', response);
      },
      (error) => {
        console.error('Error updating project status:', error);
      }
    );
}

selectedChange(event: GanttSelectedEvent) {
    // this.thyNotify.info(
    //     'Event: selectedChange',
    //     `当前选中的 item 的 id 为 ${(event.selectedValue as GanttItem[]).map((item) => item.id).join('、')}`
    // );
}

linkDragEnded(event: GanttLinkDragEvent) {
    this.items = [...this.items];
    //this.thyNotify.info('Event: linkDragEnded', `创建了关联关系`);
}

print(name: string) {
    //this.printService.print(name);
}

scrollToToday() {
    this.ganttComponent.scrollToToday();
}

switchChange() {
    if (this.isBaselineChecked) {
        this.baselineItems = [
            { id: '000000', start: 1627728888, end: 1628421197 },
            { id: '000001', start: 1617361997, end: 1625483597 },
            { id: '000002', start: 1610536397, end: 1610622797 },
            { id: '000003', start: 1628507597, end: 1633345997 },
            { id: '000004', start: 1624705997 }
        ];
    } else {
        this.baselineItems = [];
    }
}


  onDragDropped(event: GanttTableDragDroppedEvent) {

      const sourceItems = event.sourceParent?.children || this.items;
      sourceItems.splice(sourceItems.indexOf(event.source), 1);
      if (event.dropPosition === 'inside') {
          event.target.children = [...(event.target.children || []), event.source];
      } else {
          const targetItems = event.targetParent?.children || this.items;
          if (event.dropPosition === 'before') {
              targetItems.splice(targetItems.indexOf(event.target), 0, event.source);
          } else {
              targetItems.splice(targetItems.indexOf(event.target) + 1, 0, event.source);
          }
      }
      this.items = [...this.items];
  }

  onDragStarted(event: GanttTableDragStartedEvent) {
      console.log('drag wstarted', event);  }

  onDragEnded(event: GanttTableDragEndedEvent) {

  }

  addTask() {
    const dialogRef = this.dialog.open(AddTaskComponent, {
      width: '1500px',
      height: '300px'
      // Add any additional configuration options as needed
    });

    dialogRef.afterClosed().subscribe((reason: any) => {
      this.ds.getDict().subscribe((data) => {
        this.nameDictionary = data;
        this.ds.getAllItems().subscribe((data) => {
          this.groups = data.groups;
          this.items = data.items;
          this.items.forEach(task => {
            task.foreman = this.getManagerName(task.id);
          });
          
          this.originalGroups = [...this.groups];
          this.originalItems = [...this.items];
        });
      });
    });
  }

  expandAllGroups() {
    if (this.expanded) {
        this.expanded = false;
        this.ganttComponent.collapseAll();
    } else {
        this.expanded = true;
        this.ganttComponent.expandAll();
    }
}

childrenResolve = (item: GanttItem) => {
    const children = randomItems(random(1, 5), item);
    return of(children).pipe(delay(1000));
};


}






