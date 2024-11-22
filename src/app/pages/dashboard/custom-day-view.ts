import {
    GanttView,
    GanttViewOptions,
    primaryDatePointTop,
    secondaryDatePointTop,
    GanttViewDate,
    GanttDate,
    eachDayOfInterval,
    GanttDatePoint,
    GanttViewType
} from "@worktile/gantt";

const viewOptions: GanttViewOptions = {
    cellWidth: 50,
    start: new GanttDate().startOfYear().startOfWeek({ weekStartsOn: 1 }),
    end: new GanttDate().endOfYear().endOfWeek({ weekStartsOn: 1 }),
    addAmount: 1,
    addUnit: 'month',
    fillDays: 1,
};

export class GanttViewCustom extends GanttView {
    override showWeekBackdrop: boolean = true;

    override showTimeline: boolean = true;

    override viewType: GanttViewType = GanttViewType.day;

    constructor(start: GanttViewDate, end: GanttViewDate, options?: GanttViewOptions) {
        super(start, end, Object.assign({}, viewOptions, options));
        this.showWeekBackdrop = true;
        this.showTimeline = true;
        this.viewType = GanttViewType.day;
    }

    startOf(date: GanttDate) {
        return date.startOfWeek({ weekStartsOn: 1 });
    }

    endOf(date: GanttDate) {
        return date.endOfWeek({ weekStartsOn: 1 });
    }

    getPrimaryWidth() {
        return this.getCellWidth() * 7; // Each week spans 7 days.
    }

    getDayOccupancyWidth(date: GanttDate): number {
        if (!this.options['showWeekend'] && date.isWeekend()) {
            return 0;
        }
        return this.cellWidth;
    }

    getPrimaryDatePoints(): GanttDatePoint[] {
        const days = eachDayOfInterval({ start: this.start.value, end: this.end.value });
        const points: GanttDatePoint[] = [];
        
        // Iterate through each week
        for (let i = 0; i < days.length; i += 7) { // Move in 7-day steps
            const start = new GanttDate(days[i]);
            const monthName = start.format('MMMM'); // Get the current month's name
    
            // Add a new GanttDatePoint for each week showing the month name
            const point = new GanttDatePoint(
                start,
                monthName,
                i * this.getCellWidth() + (this.getCellWidth() * 7) / 2, // Position the label centered over the week block
                primaryDatePointTop,
                {
                    isWeekend: false, // We don't need to worry about weekends for the month label
                    isToday: start.isToday() // Mark this as today's point if it's today
                }
            );
            let styles: Partial<CSSStyleDeclaration> = {};
            styles = { ...styles, fontWeight: 'bold', fill: '#000000' };
            point.style = styles;
            points.push(point);
        }
    
        return points;
    }

    getSecondaryDatePoints(): GanttDatePoint[] {
        const days = eachDayOfInterval({ start: this.start.value, end: this.end.value });
        const points: GanttDatePoint[] = [];
        
        for (let i = 0; i < days.length; i++) {
            const start = new GanttDate(days[i]);
            const isWeekend = start.isWeekend();
            const isToday = start.isToday();
            
            const point = new GanttDatePoint(
                start,
                `${start.format('d')}`, // Display day of the month
                i * this.getCellWidth() + this.getCellWidth() / 2,
                secondaryDatePointTop,
                {
                    isWeekend,
                    isToday
                }
            );
    
            // Merge styles for weekends and today
            let styles: Partial<CSSStyleDeclaration> = {};
            if (isWeekend) {
                styles = { ...styles, fill: '#878282', fontStyle: 'italic' }; // Shade weekends
            }
            else if (isToday) {
                styles = { ...styles, fill: '#ff9f73' }; // Highlight today
            }
            else{
                styles = { ...styles, fontWeight: 'bold' };
            }
    
            point.style = styles;  // Apply merged styles
    
            points.push(point);
        }
    
        return points;
    }
}