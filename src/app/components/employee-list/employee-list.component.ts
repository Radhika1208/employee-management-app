import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from 'src/app/services/employee.service';
import { IndexedDBService } from 'src/app/services/indexed-db.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
})
export class EmployeeListComponent implements OnInit, OnDestroy {
  employees: any[] = [];
  previousEmployees: any[] = [];
  currentEmployees: any[] = [];
  isMobileView: boolean = false;  // To toggle between desktop and mobile view

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private dbService: IndexedDBService
  ) {}

  ngOnInit(): void {
    this.loadEmployees();  // Load the employee list on component initialization
    console.log(this.loadEmployees);

    // Subscribe to employee updates to reload the list
    this.employeeService.employeeAdded.subscribe(() => {
      this.loadEmployees();
    });

    // Check for mobile view based on window size
    this.isMobileView = window.innerWidth <= 768;

    // Re-check if the window size changes
    window.addEventListener('resize', () => {
      this.isMobileView = window.innerWidth <= 768;
    });
  }

  ngOnDestroy(): void {
    // Clean up the subscription when the component is destroyed
    if (this.employeeService.employeeAdded) {
      this.employeeService.employeeAdded.unsubscribe();
    }
  }

  // Method to load employees from IndexedDB and filter them
  async loadEmployees(): Promise<void> {
    const allEmployees = await this.dbService.getEmployees(); // Fetch employees from IndexedDB
    this.employees = allEmployees;

    // Sort employees into current and previous based on joining date
    const currentDate = new Date();
    this.currentEmployees = this.employees.filter(employee => new Date(employee.dateOfJoining) <= currentDate);
    this.previousEmployees = this.employees.filter(employee => new Date(employee.dateOfJoining) > currentDate);
  }

  // Method to handle employee deletion
  async onDelete(id: number): Promise<void> {
    if (confirm('Are you sure you want to delete this employee?')) {
      await this.employeeService.deleteEmployee(id);  // Delete employee
    }
  }

  // Navigate to the edit employee page
  onEdit(id: number): void {
    this.router.navigate(['/edit-employee', id]);
  }

  // Handle swipe left to show delete icon
  onSwipeLeft(employee: any, event: any): void {
    event.preventDefault();
    event.stopPropagation();
    // Add class to show delete icon on swipe
    const card = event.target.closest('.employee-mobile-card');
    card.classList.add('swiped-left');
  }

  // Trigger delete on swipe
  onDeleteSwipe(employee: any, event: any): void {
    event.stopPropagation();
    this.onDelete(employee.id);
  }
}
