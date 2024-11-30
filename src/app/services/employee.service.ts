import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IndexedDBService } from './indexed-db.service';
import { Employee } from '../models/employee.model';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  employeeAdded = new Subject<void>();  // Subject to notify changes

  constructor(private dbService: IndexedDBService) {}

  // Method to add an employee
  async addEmployee(employee: Employee) {
    await this.dbService.addEmployee(employee);  // Add employee to DB
    this.employeeAdded.next();  // Notify components that the list is updated
  }

  // Method to delete an employee
  async deleteEmployee(id: number) {
    await this.dbService.deleteEmployee(id);  // Delete employee from DB
    this.employeeAdded.next();  // Notify components that the list is updated
  }

  // Get all employees
  async getEmployees() {
    return await this.dbService.getEmployees();  // Fetch employees from DB
  }
}
