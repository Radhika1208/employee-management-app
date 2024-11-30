import { Injectable } from '@angular/core';
import { openDB, IDBPDatabase } from 'idb';
import { Employee } from '../models/employee.model';

@Injectable({
  providedIn: 'root',
})
export class IndexedDBService {
  private dbPromise!: Promise<IDBPDatabase>;

  constructor() {
    this.initDB();
  }

  private async initDB() {
    this.dbPromise = openDB('EmployeeDB', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('employees')) {
          db.createObjectStore('employees', { keyPath: 'id', autoIncrement: true });
        }
      },
    });
  }

  async addEmployee(employee: Employee) {
    const db = await this.dbPromise;
    await db.add('employees', employee);
  }

  async getEmployees(): Promise<Employee[]> {
    const db = await this.dbPromise;
    return db.getAll('employees');
  }

  async updateEmployee(employee: Employee) {
    const db = await this.dbPromise;
    await db.put('employees', employee);
  }

  async deleteEmployee(id: number) {
    const db = await this.dbPromise;
    await db.delete('employees', id);
  }
}
