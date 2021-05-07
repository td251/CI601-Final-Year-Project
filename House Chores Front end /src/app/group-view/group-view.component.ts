import { Component, OnInit, Input } from '@angular/core';
import { Group } from '../model/Group';
import { Router, ActivatedRoute } from '@angular/router';
import { GroupService } from '../services/group.service';
import { TasksService } from '../services/tasks.service';
import { Tasks } from '../model/Tasks';
import { io } from 'socket.io-client';
import { FormGroup, FormControl, Validators, FormsModule } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { Message } from '../model/Message';
import { MessageService } from '../services/MessageService';
const SOCKET_ENDPOINT = 'https://lit-basin-43349.herokuapp.com/';
@Component({
  selector: 'app-group-view',
  templateUrl: './group-view.component.html',
  styleUrls: ['./group-view.component.css']
})
export class GroupViewComponent implements OnInit {
  // setting task is reoccuring 
  //reoccuring values and view values 
  reoccuring = [
    { value: 0, viewValue: 'No' },
    { value: 1, viewValue: 'Daily' },
    { value: 2, viewValue: 'Weekly' },
    { value: 3, viewValue: 'Monthly' }
  ]
  // setting tasks priority 
  // priorities values and view values 
  priorties = [
    { value: 1, viewValue: 'Low' },
    { value: 2, viewValue: 'Medium ' },
    { value: 3, viewValue: 'High' }
  ];

  task: Tasks;
  message: string;
  private socket;
  @Input() clickedGroup: Group;
  groupTitle: string;
  userNames: string[];
  peopleInGroup: string[];
  noMemebrsAdded = true;
  taskForm: FormGroup;
  chatBlockView = true;
  assignedUser: string;
  groupId: string;
  idInt: number;
  userName: string;
  messageHistory: Message[];
  isCurrentlyTyping: Boolean;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private groupService: GroupService,
    private taskService: TasksService,
    private toastr: ToastrService,
    private messageService: MessageService) { }

  ngOnInit(): void {
    //retrivng user from the local storage 
    this.userName = localStorage.getItem('currentUser');
    //task form control 
    this.taskForm = new FormGroup(
      {
        dateDue: new FormControl(null, Validators.required),
        taskTitle: new FormControl('Enter Task details', Validators.required),
        taskDescription: new FormControl(null, [Validators.required, Validators.minLength(6)]),
        priority: new FormControl(null, Validators.required),
        reoccuring: new FormControl(null, Validators.required),
      }
    );
    //get group id from url 
    this.groupId = this.route.snapshot.paramMap.get('groupId');
    if (this.groupId == null) {
      // certain routes have captilized groupId 
      this.groupId = this.route.snapshot.paramMap.get('GroupId');
    }
    //get group title 
    this.groupTitle = this.route.snapshot.paramMap.get('GroupName');
    //retrive members for this group 
    //parsing string to int 
    this.idInt = + this.groupId; // just converting string to an int
    //get members for each group 
    this.groupService.getMembersForGroup(this.idInt).subscribe(response => {
      this.peopleInGroup = response;
      if (this.peopleInGroup.length != null) {
        //if null 
        this.noMemebrsAdded = false;
      }
    });
    this.messageService.getMessagesForGroup(this.idInt).subscribe(response => {
      this.messageHistory = response;
      for (var i = 0; i < this.messageHistory.length; i++) {
        // if sender of a message is the current user 
        if (this.messageHistory[i].sender == this.userName) {
          this.messageHistory[i].currentUsersMessage = true;
        } else {
          this.messageHistory[i].currentUsersMessage = false;
        }
      }
    }, error => {
      //if 404 not an error just no previous messages
      if (error.status != 404) {
        this.toastr.error('Error please try again later');
        console
      }
    });
    //setting up connection with web socket
    this.setUpSocketConnection(this.idInt);

  }
  //getting todays date -> change for date fns 
  getTodaysDate(): string {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear();
    const todaysDate = yyyy + '-' + mm + '-' + dd;
    return todaysDate;
  }

  setUpSocketConnection(groupId) {
    //joinign the web socket 
    this.socket = io(SOCKET_ENDPOINT);
    //joining the group 
    this.socket.emit('join-chat', groupId);
    //on recieving a message 
    this.socket.on('message-broadcast', (message: Message) => {
      if (message) {
        // ccreating an element to send the message
        const sender = document.createElement('h1');
        //attatching the sender of the message name 
        sender.innerHTML = message.sender;
        sender.style.fontSize = '14px';
        sender.style.borderRadius = '3px';
        // padding on top of message
        sender.style.paddingTop = '15px';
        sender.style.color = '#ff0080';
        const element = document.createElement('li');
        element.innerHTML = message.message;
        element.style.borderRadius = '3px';
        element.style.fontSize = '14px';
        element.style.background = 'grey';
        element.style.padding = '5px 10px 5px 12px';
        element.style.margin = '10px';
        element.style.width = '100%';
        element.style.color = 'white'
        //putting senders name on top of the messaage 
        document.getElementById('message-list').appendChild(sender);
        //putting in the actual maessage 
        document.getElementById('message-list').appendChild(element);
      }
    });
  }
  async typing() {
    console.log('user is typing');
  }

  sendMessage(groupId) {
    //sending the message 
    const sender = this.userName;
    //sending message to websocket 
    this.socket.emit('message', this.message, groupId, sender);

    //create html for the element 
    const element = document.createElement('li');
    element.innerHTML = this.message;
    element.style.background = '#05728f';
    element.style.padding = '5px 10px 5px 12px';
    element.style.fontSize = '14px';
    element.style.margin = '0px';
    element.style.width = '100%';
    element.style.height = '30px';
    element.style.color = ' white';
    //add to list 
    //messages you are sending 
    document.getElementById('message-list').appendChild(element);
    this.message = '';

  }
  public back() {
    //navigating back to the home pageA
    this.router.navigate(['your-groups']);
  }
  public assignNewTask(userName: string) {
    //change the ng template in the front end to the task form 
    this.chatBlockView = false;
    //name of the user who has assigned the task is the current user who is signed in 
    this.assignedUser = userName;
  }
  //creating the task 
  public createTask(taskForm) {
    // parsing task values to task form control values
    this.task = taskForm.value;
    //it is creatred by the current user 
    this.task.createdBy = this.userName;
    // current user is the assigned user 
    this.task.userAssigned = this.assignedUser;
    //assigning group id as the idInt 
    this.task.groupId = this.idInt;
    //created date = todays date
    this.task.dateCreated = this.getTodaysDate();
    // creating a task 
    this.taskService.createTask(this.task).subscribe(response => {

      this.message = 'I have created a task for ' + this.task.userAssigned + ' the task is ' + this.task.taskDescription;
      this.sendMessage(this.groupId);
      this.toastr.success('Task for ' + this.assignedUser + ' has been created');
    }, error => {
      this.toastr.error("Error: Creating this task plerase try again later");
    });
    this.chatBlockView = true;

  }
  public cancel() {
    this.chatBlockView = true;
  }
}
