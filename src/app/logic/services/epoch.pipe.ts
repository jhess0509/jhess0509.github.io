import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'epochToDate'
})
export class EpochToDatePipe implements PipeTransform {
  transform(epoch: number | null): string {
    if (epoch === null) {
      return ''; // Return an empty string if the epoch is null
    }
    if (!epoch){
        return '';
    }

    const epochMilliseconds = epoch * 1000; // Convert seconds to milliseconds
    const dateObject = new Date(epochMilliseconds);

    // Adjust to local time zone
    const localDateObject = new Date(dateObject.toLocaleString('en-US', { timeZone: 'UTC' }));

    // Format the result as "January 6, 2024, 10:00 am"
    const formattedDate = localDateObject.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });

    return formattedDate;
  }
}