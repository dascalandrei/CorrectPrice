import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';


@Injectable()
export class AuthGuardService implements CanActivate {

    constructor(
        private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

        const successfullyLoggedIn: boolean = sessionStorage.getItem("successfullyLoggedIn") === 'true';

        if (!successfullyLoggedIn) {
            alert('Nu esti autorizat sa vezi aceasta pagina. Va trebui sa introduci datele de logare.');

            this.router.navigate(['']);

            return false;
        }

        return true;
    }
}
