import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { YourGroupsComponent } from './your-groups/your-groups.component';
import { TasksComponent } from './tasks/tasks.component';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from '../AuthGuard';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { RegisterComponent } from './register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GroupFormComponent } from './group-form/group-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GroupViewComponent } from './group-view/group-view.component';
import { MatSelectModule } from '@angular/material/select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TaskFormComponent } from './task-form/task-form.component';
import { CommentsComponent } from './comments/comments.component';
import { OverlayComponent } from './overlay/overlay.component';
import { LoaderInterceptor } from './LoaderInterceptor';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { TaskCreatedComponent } from './task-created/task-created.component';
import { CaldenarViewComponent } from './caldenar-view/caldenar-view.component';
import { CommonModule } from '@angular/common';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter, CalendarDayViewComponent } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { CalendarUtilsModule } from './calendar-utils/module';
import { CalendarComponent } from './calendar/calendar.component';


@NgModule({
  declarations: [
    AppComponent,
    YourGroupsComponent,
    TasksComponent,
    LoginComponent,
    RegisterComponent,
    GroupFormComponent,
    GroupViewComponent,
    TaskFormComponent,
    CommentsComponent,
    OverlayComponent,
    ProgressBarComponent,
    TaskCreatedComponent,
    CaldenarViewComponent, CalendarComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ToastrModule.forRoot(),
    RouterModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    NgbModule,
    CommonModule,
    MatProgressSpinnerModule,
    FlatpickrModule.forRoot(),
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    CalendarUtilsModule
  ],
  providers: [AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],

  exports: [CaldenarViewComponent]
})
export class AppModule { }
