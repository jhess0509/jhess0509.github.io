import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'epochBetweenDates'
})
export class EpochBetweenDatesPipe implements PipeTransform {
  transform(epoch: number, startDate: Date, endDate: Date): boolean {
    if (!epoch || !startDate || !endDate) {
      return false; // Return false if any of the parameters is not provided
    }

    const epochMilliseconds = epoch * 1000; // Convert seconds to milliseconds
    const dateObject = new Date(epochMilliseconds);

    return dateObject >= startDate && dateObject <= endDate;
  }
}