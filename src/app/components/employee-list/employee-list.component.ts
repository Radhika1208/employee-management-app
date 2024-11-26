import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from 'src/app/services/employee.service';
@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {
  employees: any[] = [];

  constructor(private employeeService: EmployeeService, private router: Router) { }

  ngOnInit(): void {
    this.loadEmployees();
    // Subscribe to employee updates for auto-refresh
    this.employeeService.employeeAdded.subscribe(() => {
      this.loadEmployees();
    });
  }

  loadEmployees(): void {
    this.employees = this.employeeService.getEmployees(); // Fetch the employee list
  }

  onEdit(id: number): void {
    this.router.navigate(['/edit-employee', id]);
  }

  onDelete(id: number): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(id); // Delete the employee
      this.loadEmployees(); // Reload the list
    }
  }
}
