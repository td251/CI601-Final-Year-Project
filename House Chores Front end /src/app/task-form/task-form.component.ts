import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TasksService } from '../services/tasks.service';
import { Tasks } from '../model/Tasks';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { UserName } from '../model/UserName';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {
  //input thats being psased through 
  @Input() taskId;
  //output the task number 
  @Output() hasBeenEdited = new EventEmitter<number>();
  priorties = [
    { value: 1, viewValue: 'Low' },
    { value: 2, viewValue: 'Medium ' },
    { value: 3, viewValue: 'High' }
  ];
  userList: UserName[];
  task: Tasks;
  message: string;
  private socket;
  tasks: Tasks;
  taskToEdit: Tasks;
  groupTitle: string;
  userNames: string[];
  peopleInGroup: string[];
  noMemebrsAdded = true;
  rando = true;
  assignedUser: string;
  groupId: string;
  idInt: number;
  userName: string;
  taskForm: FormGroup;
  description: string;
  title: string;
  userAssigned: string;
  date: Date;
  constructor(private taskService: TasksService,
    private toastr: ToastrService, private userService: UserService) { }

  async ngOnInit(): Promise<void> {
    this.userService.getUsers().subscribe(response => {
      this.userList = response;
    });
    (await this.taskService.getTaskById(this.taskId)).subscribe(response => {
      this.taskToEdit = response;
      //filling out values in the form that were previously entered for the task 
      this.description = this.taskToEdit[0].task_description;
      this.title = this.taskToEdit[0].task_title;
      this.userAssigned = this.taskToEdit[0].user_assigned;
      this.date = this.taskToEdit[0].date_due;
      // form control 
      this.taskForm = new FormGroup(
        {
          userAssigned: new FormControl('', Validators.required),
          //putting in previous value 
          dateDue: new FormControl(this.date, Validators.required),
          taskTitle: new FormControl(this.title, Validators.required),
          taskDescription: new FormControl(this.description, Validators.required),
          priority: new FormControl('', Validators.required)

        });
    });
  }

  public async editTask(taskForm) {

    this.task = taskForm.value;
    this.task.taskId = this.taskId;

    (await this.taskService.editTask(this.task)).subscribe(response => {
      //send task id to class
      this.hasBeenEdited.emit(this.taskId);
    }, (error) => {
      //no rows have been affected
      if (error.status == 404) {
        this.toastr.error("task has not been found");
      } else {
        //other than that servre error 
        this.toastr.error("error has occured please try again later ");
      }

    });

  }
  //get todays date 
  getTodaysDate(): string {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear();
    const todaysDate = yyyy + '-' + mm + '-' + dd;
    return todaysDate;
  }
}
