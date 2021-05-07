import {Injectable} from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';
@Injectable()

export class AuthGuard implements CanActivate {
    private loggedIn = false;

    constructor(private router: Router){}
    private onAuthChange(auth) {
        this.loggedIn = auth ? true : false;
      }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

        // if you can retrieve the current user  activate
        // i user signed in
        if (localStorage.getItem('currentUser')){
            // logged in so return true
            return true;
        } // if cant tell who is logged in dont log in


        // wont be logged in so redirect to login page with url:
        this.router.navigate([''], { queryParams: { returnUrl: state.url }});
        // false
        return false;
    }

}
