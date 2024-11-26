import { Component } from '@angular/core';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss'],
})
export class EmployeeFormComponent {
  employee: any = { name: '', role: '', dateOfJoining: '' };
  roles: string[] = ['Software Engineer', 'Product Manager', 'HR Manager', 'Designer', 'QA Engineer'];

  showDatePicker: boolean = false;
  currentDate: Date = new Date();
  selectedDate: Date | null = null;
  calendarDates: Date[][] = [];
  calendarMonth: number = this.currentDate.getMonth();
  calendarYear: number = this.currentDate.getFullYear();
isEditMode: any;

  ngOnInit(): void {
    this.generateCalendar(new Date(this.calendarYear, this.calendarMonth, 1));
  }

  toggleDatePicker(): void {
    this.showDatePicker = !this.showDatePicker;
  }

  generateCalendar(date: Date): void {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const calendar = [];
    let week: Date[] = [];
    let day = new Date(firstDayOfMonth);

    // Adjust to the first day of the week
    while (day.getDay() !== 0) {
      day.setDate(day.getDate() - 1);
    }

    // Populate days in the calendar
    do {
      week.push(new Date(day));
      day.setDate(day.getDate() + 1);
      if (week.length === 7) {
        calendar.push(week);
        week = [];
      }
    } while (day <= lastDayOfMonth || week.length > 0);

    this.calendarDates = calendar;
    this.calendarMonth = date.getMonth();
    this.calendarYear = date.getFullYear();
  }

  selectDate(date: Date): void {
    this.selectedDate = date;
    this.employee.dateOfJoining = this.formatDate(date);
    this.showDatePicker = false;
  }

  navigateMonth(offset: number): void {
    const newDate = new Date(this.calendarYear, this.calendarMonth + offset, 1);
    this.generateCalendar(newDate);
  }

  selectPredefined(option: string): void {
    let newDate: Date = new Date();
    if (option === 'today') {
      newDate = new Date();
    } else if (option === 'nextMonday') {
      newDate = this.getNextWeekday(1); // 1 = Monday
    } else if (option === 'nextTuesday') {
      newDate = this.getNextWeekday(2); // 2 = Tuesday
    } else if (option === 'afterOneWeek') {
      newDate.setDate(newDate.getDate() + 7);
    }

    this.selectDate(newDate);
  }

  getNextWeekday(dayOfWeek: number): Date {
    const date = new Date();
    const diff = (dayOfWeek + 7 - date.getDay()) % 7 || 7; // Ensure at least 1 day
    date.setDate(date.getDate() + diff);
    return date;
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-GB');
  }

  onSubmit(): void {
    console.log('Form Data:', this.employee);
    alert('Form submitted successfully!');
  }
}
