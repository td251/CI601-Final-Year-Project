import { Component, OnInit } from '@angular/core';
import { TasksService } from '../services/tasks.service';
import { Tasks } from '../model/Tasks';
import { takeLast, switchMap, catchError, retry, map } from 'rxjs/operators';
import { TaskStatus } from '../model/TaskStatus';
import { trigger, transition, style, animate } from '@angular/animations';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, Validators } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDrag } from '@angular/cdk/drag-drop';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { timer, Observable, from, throwError } from 'rxjs';
import { io } from 'socket.io-client';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})

export class TasksComponent implements OnInit {
  constructor(private taskService: TasksService, private modalService: NgbModal, http: HttpClient, private toastrService: ToastrService) {
    this.noToDo = false;
    this.noInProgress = false;
    this.noAssigned = false;

  }


  private socket;
  ctrl = new FormControl(null, Validators.required);
  taskEdit = false;
  public radioStatus = 0;

  page = 1;
  pageSize = 4;
  assignTasks: Observable<Tasks[]>;
  taskToDo: Observable<Tasks[]>;
  taskInProgress: Observable<Tasks[]>;
  tasksDate: Tasks[];
  completedTasks: Tasks[];
  tasks: Tasks[];
  taskStatus: TaskStatus[];
  status: TaskStatus;
  singularTask: Tasks;
  complete: number;
  diffDays: any[];
  onlyViewAssigned = true;
  show = true;
  todaysDate: string;
  taskToEdit: Tasks;
  animationState = 'out';
  viewComments = false;
  taskId: number;
  taskClicked: Tasks;
  currentRate = 3.14;
  closeResult = '';
  test = 50;
  dateDue: Tasks[];
  newTest = 100;
  //tasks we are calling through polling
  noToDo: boolean;
  noAssigned: boolean;
  noInProgress: boolean;
  currentUser = localStorage.getItem('currentUser');
  membersIngGroup: string[] = new Array();
  baseUrl: string = "http://localhost:3000/";
  //for drop down toggle to view certain tasks 
  viewTaksAssigned = false;
  viewTasksToDo = false;
  viewTasksInProgress = false;
  viewTasksCompleted = false;
  viewAllTasks = true;


  ngOnInit(): void {
    this.tasksDate = this.getTasksAssigned();
    this.taskService.getCompleteTasks(this.currentUser).subscribe(response => {
      this.completedTasks = response;
    });
    this.getAssignedTasks();
    this.getTasksInProgress();
    this.getTasksToDo();
  }

  //drop down function 
  //view these tasks 
  async viewTasks(taskStatus) {
    //switch case for when filtering through tasks 
    switch (taskStatus) {
      case 1:
        this.viewTaksAssigned = true;
        this.viewTasksToDo = false;
        this.viewTasksInProgress = false;
        this.viewTasksCompleted = false;
        this.viewAllTasks = false;
        break;
      case 2:
        this.viewTaksAssigned = false;
        this.viewTasksToDo = true;
        this.viewTasksInProgress = false;
        this.viewTasksCompleted = false;
        this.viewAllTasks = false;
        break;
      case 3:
        this.viewTaksAssigned = false;
        this.viewTasksToDo = false;
        this.viewTasksInProgress = true;
        this.viewTasksCompleted = false;
        this.viewAllTasks = false;

        break;
      case 4:
        this.viewTaksAssigned = false;
        this.viewTasksToDo = false;
        this.viewTasksInProgress = false;
        this.viewTasksCompleted = true;
        this.viewAllTasks = false;
        break;
      case 5:
        this.viewTaksAssigned = false;
        this.viewTasksToDo = false;
        this.viewTasksInProgress = false;
        this.viewTasksCompleted = false;
        this.viewAllTasks = true;
        break;
    }
  }


  async getAssignedTasks() {
    this.taskService.getTaskForUser(this.currentUser).subscribe(response => {
      this.assignTasks = response;
    })
  }
  async getTasksToDo() {
    this.taskService.getToDoTasks(this.currentUser).subscribe(response => {
      this.taskToDo = response;
    })

  }
  async getTasksInProgress() {
    this.taskService.getInProgress(this.currentUser).subscribe(response => {
      this.taskInProgress = response;
    })
  }
  async getTasksInComplete() {

  }
  public getTasksAssigned(): Tasks[] {
    let assigned;
    this.taskService.getTaskForUser(this.currentUser).subscribe(response => {

      this.tasksDate = response;
      for (let i = 0; i < this.tasksDate.length; i++) {
        this.tasksDate[i].dateDue = response[i].date_due.substring(0, 10);
        const date1 = new Date(this.tasksDate[i].dateDue);
        const date2 = new Date(this.getTodaysDate());
        //getting the differnce between the two dates 
        this.tasksDate[i].daysDue = this.getDifferenceInDays(date2, date1);
        if (this.tasksDate[i].daysDue < 0) {
          this.tasksDate[i].overDue == true;
        }
      }
    }, error => {
      if (error.status == 500) {
        this.toastrService.error("No tasks to display ")
      }
    });
    return this.tasksDate;
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  open(content2, taskId, value) {
    //update status modal 
    this.modalService.open(content2, { centered: true }).result.then((result) => {
      this.updateStatus(taskId, this.radioStatus);
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  taskCreated() {
    this.onlyViewAssigned = false;
  }
  assignTask() {
    this.onlyViewAssigned = true;
    window.location.reload();

  }
  getDifferenceInDays(date1, date2) {
    // working the difference in todays date and the date is due
    const diffInMs = (date2 - date1);
    // 1000 converts to miliseconds
    // number of seconds in a day
    // 1 sec = 100- miliseceonds
    return diffInMs / (1000 * 60 * 60 * 24);
  }

  taskIsDue(task): TaskStatus {

    let taskId;
    let comp;
    let dueDays;
    let overDue;


    taskId = task.task_id;
    const val = 0; // for time being shit
    if (val > 0) {

      dueDays = val;
      overDue = false;


    } else {

      task.overDue == true;

    }
    const taskLevel = new TaskStatus(
      taskId,
      comp,
      dueDays,
      overDue);
    return taskLevel;

  }
  async getTaskForComment(content, taskId) {
    (await this.taskService.getTaskById(taskId)).subscribe(response => {
      this.taskClicked = response;

    });
    this.modalService.open(content, { size: 'lg' });
  }
  async updateStatus(taskId, status) {

    const taskToSend = {
      taskId,
      status
    };
    (await this.taskService.updateStatus(taskToSend)).subscribe(async response => {
      await this.getAssignedTasks();
      await this.getTasksInProgress();
      await this.getTasksToDo();

    }, error => {
      if (error.status == 404) {
        this.toastrService.error("Sorry task has not been found please try again later");
      }
    });
  }
  onEdit(task) {
    //changing the view 
    this.taskEdit = true;
    this.taskToEdit = task;
  }
  //retrivings todays date 
  getTodaysDate(): string {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    const todaysDate = yyyy + '-' + mm + '-' + dd;
    return todaysDate;
  }
  //get done tsaks 
  public async done(taskId: any) {
    this.todaysDate = this.getTodaysDate();

    this.show = false;
    (await this.taskService.completeTask(taskId, this.todaysDate)).subscribe(response => {

    }, error => {


    });
  }
  //handle error for to do 
  handleError(error: HttpErrorResponse) {
    if (error.status == 404) {
      this.noAssigned = true;
    }
    return throwError(error);
  }
  //handle error for in progress 
  handleError2(error: HttpErrorResponse) {
    if (error.status == 404) {
      this.noToDo = true;
    }
    return throwError(error);

  }
  //handle error for in progress
  handleError3(error: HttpErrorResponse) {
    if (error.status == 404) {

      this.noInProgress = true;
    }
    return throwError(error);

  }

}