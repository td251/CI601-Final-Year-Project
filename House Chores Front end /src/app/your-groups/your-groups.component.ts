import { Component, OnInit } from '@angular/core';
import { SlideInOutAnimation } from 'src/animation';
import { GroupService } from '../services/group.service';
import { Group } from '../model/Group';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { UserName } from '../model/UserName';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-your-groups',
  templateUrl: './your-groups.component.html',
  styleUrls: ['./your-groups.component.css'],
  animations: [SlideInOutAnimation]

})
export class YourGroupsComponent implements OnInit {
  userList: UserName[];
  membersGroup: Group[];
  createdGroups: Group[];
  makeNewGroup = false;
  animationState = 'out';
  addedToGroups: boolean;
  hasGroups: boolean;
  //get current user from local storge
  userName = localStorage.getItem('currentUser');
  closeResult = '';
  // for created groups
  showMoreGroups = false;
  // for added groups
  showMoreAddedGroups = false;
  membersIngGroup: string[] = new Array();

  constructor(private modalService: NgbModal, private userService: UserService, private groupServices: GroupService, private router: Router, private toastr: ToastrService) { }
  navigationDetails: string[] = ['/group-form'];
  ngOnInit(): void {
    this.getGroupsByUserName(this.userName);
    // getting the users to add into the group
    this.userService.getUsers().subscribe(response => {

      this.userList = response;
    });
  }
  onOptionsSelected(value: string) {
    this.membersIngGroup.push(value);
  }
  // Add Members modal
  open2(content2, groupId, groupName) {
    this.modalService.open(content2, { centered: true }).result.then(async (result) => {
      (await this.groupServices.addMembers(groupId, groupName, this.membersIngGroup)).subscribe(response => {
        if (!('Notification' in window)) {
          // sending notification
          alert('This browser does not support desktop notification');
          this.toastr.success('Users added');
        }
        else if (Notification.permission === 'granted') {
          // emptying array
          this.membersIngGroup = [];
          // If it's okay let's create a notification
          const notification = new Notification('users added');
        }
      });
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  // showMore button for created groups
  async showMoreCreated() {
    this.showMoreGroups = true;
  }
  // show Less button created groups
  async showLessCreated() {
    this.showMoreGroups = false;
    //scrolling to the top of page 
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }
  // show more added 
  async showMoreAdded() {
    this.showMoreAddedGroups = true;
  }
  //shoq less 
  async showLessAdded() {
    this.showMoreAddedGroups = false;
    //scrolling to the top of page 
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }
  // delete group modal
  open(content, groupId) {
    this.modalService.open(content, { centered: true }).result.then((result) => {
      this.deleteGroup(groupId);
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  leaveModal(leaveContent, groupId) {
    this.modalService.open(leaveContent, { centered: true }).result.then((result) => {
      this.leaveGroup(groupId);
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

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
  async getGroupsByUserName(userName: string) {
    //returning values for logged users group 
    this.groupServices.getGroupForUser(userName).subscribe(response => {
      this.hasGroups = true;
      this.createdGroups = response;
    }, error => {

      if (error.status == 404) {

        this.hasGroups = false;
      }
    });
    this.groupServices.getGroupUserAddedIn(userName).subscribe(response => {
      this.addedToGroups = true;
      this.membersGroup = response;

    }, error => {

      if (error.status == 404 || error.status == 400) {
        this.addedToGroups = false;
      }
    });

  }
  public groupClicked(randon) {

    const clickedGroup = randon;
    this.router.navigate(['group-view', randon]);
  }
  public createPage() {
    this.router.navigate(this.navigationDetails);
  }
  public newGroup() {
    this.makeNewGroup = true;
  }
  toggleShowDiv(divName: string) {
    // retriving div
    if (divName === 'divA') {

      // changing the animation state to create a fade
      this.animationState = this.animationState === 'out' ? 'in' : 'out';
    }
  }
  public deleteGroup(groupId) {
    // delete the group 
    this.groupServices.deleteGroup(groupId).subscribe(response => {
      //group has been deleted toastr 
      this.toastr.success('Group has been deleted');
      this.getGroupsByUserName(this.userName);
    });


  }
  public async leaveGroup(groupId) {
    //leave group 
    const userName = localStorage.getItem('currentUser');
    (await this.groupServices.leaveGroup(groupId, userName)).subscribe(response => {
    });
  }

}