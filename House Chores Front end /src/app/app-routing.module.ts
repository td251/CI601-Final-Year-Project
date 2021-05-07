import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { YourGroupsComponent } from './your-groups/your-groups.component';
import { TasksComponent } from './tasks/tasks.component';
import { LoginComponent } from './login/login.component';
import { GroupViewComponent } from './group-view/group-view.component';
import { GroupFormComponent } from './group-form/group-form.component';
import { RegisterComponent } from './register/register.component';
import { CaldenarViewComponent } from './caldenar-view/caldenar-view.component';
import { AuthGuard } from '../AuthGuard';
import { ProfileComponent } from './profile/profile.component';
import { CalendarComponent } from './calendar/calendar.component';
// const routes: Routes = [
// {path: '', component: LoginComponent},
// {path: 'Register', component: RegisterComponent},

// //   {path: 'Home', component: ,canActivate: [AuthGuard], children: [
// //     {path: 'your-groups', component: YourGroupsComponent },
// //     {path: 'add-users', component: AddUserComponent },
// //     {path: 'Tasks', component: TasksComponent },
// //     {path:'group-view', component: GroupViewComponent},
// //     {path: 'group-form', component: GroupFormComponent},


// //   ] }
// // ];
const routes: Routes = [{ path: 'app-login', component: LoginComponent },
{ path: '', redirectTo: 'app-login', pathMatch: 'full' },
{ path: 'register', component: RegisterComponent, pathMatch: 'full' },
{ path: 'your-groups', component: YourGroupsComponent, canActivate: [AuthGuard] },
{ path: 'Tasks', component: TasksComponent, canActivate: [AuthGuard] },
{ path: 'group-view', component: GroupViewComponent, canActivate: [AuthGuard] },
{ path: 'group-form', component: GroupFormComponent, canActivate: [AuthGuard] },
{ path: 'calendar', component: CalendarComponent, canActivate: [AuthGuard] },
{ path: 'your-profile', component: ProfileComponent, canActivate: [AuthGuard] }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
