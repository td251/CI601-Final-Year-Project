import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  {
  constructor(
    private router: Router){}
  @Input() title: String;
  isCollapsed = true;
  toggleCollapsed(): void {
    this.isCollapsed = !this.isCollapsed;
  }
  async Logout()
  {
    if(localStorage.currentUser != null)
    {
      localStorage.removeItem('currentUser'); 
      this.router.navigate(['/login']); 
    }
  }

}
