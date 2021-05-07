import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { GroupService } from '../services/group.service';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Group } from '../model/Group';
import { UserName } from '../model/UserName';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-group-form',
  templateUrl: './group-form.component.html',
  styleUrls: ['./group-form.component.css']
})
export class GroupFormComponent implements OnInit {

  constructor(private router: Router, private userService: UserService, private groupService: GroupService, private toastr: ToastrService) { }

  GroupForm: FormGroup;
  userName: UserName[];
  homeDetails: string[] = ['/your-groups'];
  // public config: IConfig;
  public options: any[];
  public selecetedUserName: any;
  public currentUser: string;
  public time = new Date();
  group: Group;
  membersIngGroup: string[] = new Array();
  public currentDate: string;
  ngOnInit() {
    //getting the current date time 
    const dateTime = new Date();
    this.getCurrentDate(dateTime);
    this.getCurrentTime(dateTime);
    //retriving user name from local storage
    this.currentUser = localStorage.getItem('currentUser');
    //form control validating certain parts of the form 
    this.GroupForm = new FormGroup({
      UserCreated: new FormControl(),
      GroupName: new FormControl(null, Validators.required),
      NumberOfMembers: new FormArray([new FormControl(null)]),
      Description: new FormControl()

    });
    this.userService.getUsers().subscribe(response => {
      //setting username for drop down 
      this.userName = response;
    }, error => {
      //if error display toastr 
      if (error.status == 500) {
        this.toastr.error('Please try again later');
      }
    });
    // user name that has been selected 
    this.selecetedUserName = 'seleceted userName';
  }
  public back() {
    //navigate back to the home view 
    this.router.navigate(['your-groups']);
  }
  public getCurrentDate(longDate) {
    //retriving current date 
    const date = new Date(longDate),
      mnth = ('0' + (date.getMonth() + 1)).slice(-2),
      day = ('0' + date.getDate()).slice(-2);
    const currentDate = [date.getFullYear(), mnth, day].join('-');
    return currentDate;
  }
  //retriving current time 
  public getCurrentTime(longDate) {
    const n = longDate.toLocaleTimeString();
    return n;
  }
  //removing group memebers from the list 
  public removeGroupMembers(membersIngGroup, index: number) {
    //removing members from th elist
    membersIngGroup.splice(index);
    this.GroupForm.value.NumberOfMembers.splice(index);
  }

  onOptionsSelected(value: string) {
    //adding members to the group 
    this.membersIngGroup.push(value);
    this.GroupForm.value.NumberOfMembers.push(value);
  }
  async submit(GroupForm, membersIngGroup) {

    const creationTime = new Date();

    //parsing the data 
    this.group = GroupForm.value;
    this.group.UserCreated = this.currentUser;
    this.group.GroupStartDate = this.getCurrentDate(creationTime);
    this.group.GroupTimeStart = this.getCurrentTime(creationTime);
    this.group.NumberOfMembers = membersIngGroup;
    //resetting the form 
    this.GroupForm.reset();
    //on response display sucess message 
    (await this.groupService.createGroup(this.group)).subscribe(response => {
      this.toastr.success(this.group.GroupName + ' has been created');
    }, error => {
      //if error dipslay toastr message 
      if (error.status == 500) {
        this.toastr.error('Error: Please try another time');
      }
    });
    // this.router.navigate(this.homeDetails);
  }
  public addAttendeesToGroup(membersIngGroup) {

  }
}
