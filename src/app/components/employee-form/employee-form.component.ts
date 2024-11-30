import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IndexedDBService } from 'src/app/services/indexed-db.service';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss'],
})
export class EmployeeFormComponent {
  employee: any = { name: '', role: '', dateOfJoining: '', toDate: '' };
  roles: string[] = [
    'Software Engineer',
    'Product Manager',
    'HR Manager',
    'Designer',
    'QA Engineer',
  ];

  showDatePicker: boolean = false;
  selectedField: 'from' | 'to' = 'from'; // Field currently being edited
  currentDate: Date = new Date();
  selectedDate: Date | null = null;
  selectedFromDate: Date | null = null;
  selectedToDate: Date | null = null;
  calendarDates: (Date | null)[][] = [];
  calendarMonth: number = this.currentDate.getMonth();
  calendarYear: number = this.currentDate.getFullYear();

  months: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  constructor(private router: Router, private dbService: IndexedDBService) {}

  ngOnInit(): void {
    this.generateCalendar(new Date(this.calendarYear, this.calendarMonth, 1));
  }

  toggleDatePicker(field: 'from' | 'to'): void {
    this.selectedField = field;
    this.showDatePicker = !this.showDatePicker;
  }

  generateCalendar(date: Date): void {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const calendar: (Date | null)[][] = [];
    let week: (Date | null)[] = [];
    let currentDate = new Date(firstDayOfMonth);

    // Move to the start of the calendar grid (Sunday of the first week)
    while (currentDate.getDay() !== 0) {
      currentDate.setDate(currentDate.getDate() - 1);
    }

    do {
      week.push(
        currentDate.getMonth() === date.getMonth() ? new Date(currentDate) : null
      );
      currentDate.setDate(currentDate.getDate() + 1);

      if (week.length === 7) {
        calendar.push(week);
        week = [];
      }
    } while (currentDate <= lastDayOfMonth || week.length > 0);

    this.calendarDates = calendar;
    this.calendarMonth = date.getMonth();
    this.calendarYear = date.getFullYear();
  }

  navigateMonth(offset: number): void {
    const newDate = new Date(this.calendarYear, this.calendarMonth + offset, 1);
    this.generateCalendar(newDate);
  }

  isSelectedDate(date: Date | null): boolean {
    if (!date) return false;
    return!! (
      this.selectedDate &&
      date.getDate() === this.selectedDate.getDate() &&
      date.getMonth() === this.selectedDate.getMonth() &&
      date.getFullYear() === this.selectedDate.getFullYear()
    );
  }

  isToday(date: Date | null): boolean {
    if (!date) return false;
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }
  

  selectDate(date: Date | null, field: 'from' | 'to'): void {
    if (!date) return; // Ignore null dates
    this.selectedDate = date;
    if (field === 'from') {
      this.selectedFromDate = date;
      this.employee.dateOfJoining = this.formatDate(date);
    } else if (field === 'to') {
      this.selectedToDate = date;
      this.employee.toDate = this.formatDate(date);
    }
    this.showDatePicker = false; // Close the calendar
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-GB'); // Format: DD/MM/YYYY
  }

  selectPredefined(predefined: string): void {
    let date: Date = new Date();

    switch (predefined) {
      case 'today':
        date = new Date();
        break;
      case 'nextMonday':
        date.setDate(date.getDate() + ((1 + 7 - date.getDay()) % 7 || 7));
        break;
      case 'nextTuesday':
        date.setDate(date.getDate() + ((2 + 7 - date.getDay()) % 7 || 7));
        break;
      case 'afterOneWeek':
        date.setDate(date.getDate() + 7);
        break;
    }

    if (this.selectedField === 'from') {
      this.selectedFromDate = date;
      this.employee.dateOfJoining = this.formatDate(date);
    } else {
      this.selectedToDate = date;
      this.employee.toDate = this.formatDate(date);
    }

    this.showDatePicker = false;
  }

  onCancel(): void {
    this.router.navigate(['/employees']);
  }
  

  async onSubmit(): Promise<void> {
    try {
      console.log("Employee data before submit:", this.employee);
      await this.dbService.addEmployee(this.employee);
      alert('Employee added successfully!');
      this.router.navigate(['/employees']); // Navigate to the employee list page
    } catch (error) {
      console.error('Error adding employee:', error);
      alert('Failed to add employee.');
    }
  }
}
