import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  fileObj: File;
  fileUrl: string;
  errorMsg: boolean
  currentUser = localStorage.getItem('currentUser');
  fileForm = new FormData();
  constructor(private _formBuilder: FormBuilder, private userService: UserService) {
    this.errorMsg = false
  }
  ngOnInit(): void {
    throw new Error("Method not implemented.");
  }

  onFilePicked(event: Event): void {

    this.errorMsg = false
    const FILE = (event.target as HTMLInputElement).files[0];
    this.fileObj = FILE;
    console.log(this.fileObj);
    this.onFileUpload(this.fileObj);
  }
  onFileUpload(xc) {
    if (!this.fileObj) {
      this.errorMsg = true
      return
    }
    this.fileForm.append('file', xc);
    this.userService.photoUpload(this.fileForm).subscribe(res => {
      this.fileUrl = res['image'];
    });
  }
}