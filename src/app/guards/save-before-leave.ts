import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

export interface OnComponentDeactivate {
    canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean | UrlTree;
}

export class SaveBeforeLeave implements CanDeactivate<OnComponentDeactivate> {
    constructor() {}

    canDeactivate(
        component: OnComponentDeactivate
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return component.canDeactivate();
    }
}
