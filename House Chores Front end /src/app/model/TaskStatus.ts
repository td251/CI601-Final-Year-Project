export class TaskStatus {
    public taskId: number;
    public complete: number;
    public dueDays: number;
    public overDue: boolean;
    constructor(taskId: number, complete: number, dueDays: number, overDue: boolean){
        this.taskId = taskId;
        this.complete = complete;
        this.dueDays = dueDays;
        this.overDue = overDue;
    }
}
