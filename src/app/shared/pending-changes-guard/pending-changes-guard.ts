import { Injectable } from '@angular/core';
import {CanDeactivate} from '@angular/router';
import {Observable} from 'rxjs';

export interface ComponentCanDeactivate {
  canDeactivate: () => boolean | Observable < boolean > ;
}

@Injectable()
export class PendingChangesGuard implements CanDeactivate <ComponentCanDeactivate> {
  canDeactivate(component: ComponentCanDeactivate): boolean | Observable < boolean > {
    return component.canDeactivate() ?
      true : confirm('Le modifiche apportate potrebbero non essere salvate.');
  }
}
