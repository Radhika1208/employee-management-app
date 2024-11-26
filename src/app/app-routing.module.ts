import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { EmployeeFormComponent } from './components/employee-form/employee-form.component';

const routes: Routes = [
  { path: '', redirectTo: '/employees', pathMatch: 'full' }, // Redirect to the employee list as the default route
  { path: 'employees', component: EmployeeListComponent },   // Route for the employee list
  { path: 'add-employee', component: EmployeeFormComponent }, // Route for adding a new employee
  { path: 'edit-employee/:id', component: EmployeeFormComponent }, // Route for editing an existing employee
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
