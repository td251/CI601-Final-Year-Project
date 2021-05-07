import { Component, OnInit } from '@angular/core';
import { TasksService } from '../services/tasks.service';
import { Tasks } from '../model/Tasks';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-task-created',
  templateUrl: './task-created.component.html',
  styleUrls: ['./task-created.component.css']
})
export class TaskCreatedComponent implements OnInit {
  taskClicked: Tasks;
  selectedTask: number[] = new Array();
  createdTask: Tasks[];
  dataTest: Tasks[];
  noCreatedTask = false;
  collectionSize: number;
  currentUser = localStorage.getItem('currentUser');
  pageOfTasks: Array<any>;
  page = 1;
  pageSize = 10;
  items = [];
  closeResult = '';
  editTaskId: number;
  constructor(private taskService: TasksService, private modalService: NgbModal, private toastr: ToastrService) {

  }

  ngOnInit(): void {
    this.getCreatedTask();

  }
  getCreatedTask() {
    //retriving all of the results that the user has created 
    this.taskService.getTaskCreatedByUser(this.currentUser).subscribe(response => {
      this.dataTest = response;
      //iterating through the results 
      for (let i = 0; i < this.dataTest.length; i++) {
        // setting the tasks to ber over due  
        if (this.dataTest[i].dateDue < this.getTodaysDate()) {
          //setting over due to true 
          this.dataTest[i].overDue = true;
        }
      }
      this.createdTask = this.dataTest;
      this.collectionSize = this.createdTask.length;
    }, error => {
      // if error 5505 no tasks have been found 
      if (error.status == 404) {
        //display no tasks have been created 
        this.noCreatedTask = true;
      }
    });
  }
  async test() {
    var amount = this.selectedTask.length;
    for (var i = 0; i < this.selectedTask.length; i++) {
      (await this.taskService.deleteTask(this.selectedTask[i])).subscribe(response => {
        //reload tasks in the page get the new tasks that have not been deleted 
        this.getCreatedTask();
        if (amount > 1) {
          //if one task 'task'
          this.toastr.success('Deleted tasks');
        }
        else {
          // if multiple tasks are completed 
          this.toastr.success('Deleted task');
        }
      }, error => {
        //conflict 
        if (error.status == 409) {
          //task hsa been deleted
          this.toastr.error('Task has already been deleted')
        } else {
          //server 500 error 
          this.toastr.error('Please try again later');
        }
      });
    }
  }
  //selecting tasks to delete 
  onOptionsSelected(value) {
    let i = 0;
    while (i < this.selectedTask.length) {
      if (value == this.selectedTask[i]) {
        //if unselecting a task 
        this.selectedTask.splice(i, 1);
        return;
      }
      i++;
    }
    // if not unselecting a task push to array 
    this.selectedTask.push(value);
  }
  async getTaskForComment(content, taskId) {
    (await this.taskService.getTaskById(taskId)).subscribe(response => {
      //retriving comment for tasks
      this.taskClicked = response;
    });
    //open up modal comment window 
    this.modalService.open(content, { size: 'lg' });
  }

  public editThisTask(content2, taskId) {
    this.modalService.open(content2, { size: 'xl', centered: true });
    this.editTaskId = taskId;
  }
  getTodaysDate(): string {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear();

    const todaysDate = yyyy + '-' + mm + '-' + dd;
    return todaysDate;
  }

  taskEdited(taskId) {
    if (taskId != null) {
      this.toastr.success(taskId + ' has been updated');
      this.modalService.dismissAll();
    }
  }
}
