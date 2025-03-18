import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};

/*
versao professor
@Injectable({providedIn: 'root'})


export class authGuard implements CanActivate {

constructor(private authService: AuthService, private router: Router) {}

canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
 if (this.authService.isAuthenticated()) {
   return true;
}
this.router.navigate(['/login']);   
return false;








*/
