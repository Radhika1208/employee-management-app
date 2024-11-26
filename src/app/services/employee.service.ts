import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private employees: any[] = []; // In-memory storage for simplicity
  employeeAdded = new Subject<void>(); // Event to notify when a new employee is added

  constructor() {
    // Sample employee data
    this.employees = [
      { id: 1, name: 'John Doe', role: 'Software Engineer', dateOfJoining: '2020-01-15' },
      { id: 2, name: 'Jane Smith', role: 'Product Manager', dateOfJoining: '2019-03-22' }
    ];
  }

  getEmployees(): any[] {
    return this.employees;
  }

  addEmployee(employee: any): void {
    employee.id = this.employees.length + 1; // Assign a unique ID
    this.employees.push(employee);
    this.employeeAdded.next(); // Emit the event
  }

  deleteEmployee(id: number): void {
    this.employees = this.employees.filter(employee => employee.id !== id);
    this.employeeAdded.next(); // Emit the event after deleting
  }

  getEmployeeById(id: number): any {
    return this.employees.find(employee => employee.id === id);
  }

  updateEmployee(id: number, updatedEmployee: any): void {
    const index = this.employees.findIndex(employee => employee.id === id);
    if (index !== -1) {
      this.employees[index] = updatedEmployee;
      this.employeeAdded.next(); // Emit the event after update
    }
  }
}
