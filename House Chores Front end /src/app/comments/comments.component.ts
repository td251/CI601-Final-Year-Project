import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Comments } from '../model/Comments';
import { fromEventPattern, Observable, timer, throwError, Subject } from 'rxjs';
import { TasksService } from '../services/tasks.service';
import { CommentsService } from '../services/comments.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { switchMap, retry, takeUntil, catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {
  @ViewChild('scroll', { read: ElementRef }) public scroll: ElementRef<any>;
  @Input() taskId: number;
  comments: Observable<Comments[]>;
  comment: '';
  commentToSend: Comments;
  currentUser: string;
  noComments = false;
  baseUrl = 'https://tyler-nodejs-app.herokuapp.com/';
  z
  constructor(taskService: TasksService,
    private commentService: CommentsService,
    http: HttpClient, private toastr: ToastrService) {
    this.comments = timer(1, 3000).pipe(switchMap(() => http.get<Comments[]>(this.baseUrl + 'getCommentsForTask/' + this.taskId)),
      // incase of failure retry
      catchError(this.handleError),
      retry(),
    );
  }
  // need to take an input of task id to retrieve the task number
  ngOnInit(): void {
    this.currentUser = localStorage.getItem('currentUser');
    // this.getCommentsForTask(this.taskId);
  }


  getTodaysDate(): string {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear();
    const todaysDate = yyyy + '-' + mm + '-' + dd;
    return todaysDate;
  }
  public async sendComment(commentToSend) {
    // clearing the input comment
    this.comment = '';
    // better way to do it
    const commentPost: Comments = {
      commentContent: commentToSend,
      commentCreator: this.currentUser,
      creationDate: this.getTodaysDate(),
      taskId: this.taskId
    };

    if (commentPost.commentContent == ' ') {
      this.toastr.error('Comment can\'t be empty');
    } else {
      (await this.commentService.createComment(commentPost)).subscribe(response => {

      });
      await this.scrollToBottom();
    }
  }
  public async scrollToBottom() {
    this.scroll.nativeElement.scrollTop = this.scroll.nativeElement.scrollHeight;
  }
  // if htttp request no comments found
  handleError(error: HttpErrorResponse) {
    if (error.status == 404) {
      this.noComments = true;
    }

    return throwError(error);
  }
}


