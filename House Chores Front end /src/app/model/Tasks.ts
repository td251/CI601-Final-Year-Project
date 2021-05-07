import {Time } from '@angular/common';
export class Tasks {
    public taskId: number;
    public userAssigned: string;
    public createdBy: string;
        public dateCreated: string;
    public dateDue: string;
    public priority: number;
    public taskDescription: string;
    public complete: number;
    public groupId: number;
    public overDue: boolean;
    public daysDue: number;
    public dateCompleted: string;
    public expanded: boolean;
}
