import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Alert } from '../../shared/components/alert/alert.type';

@Injectable({
  providedIn: 'root'
})
  
export class CommonService {
  constructor() { }

  private alertState = new BehaviorSubject<Alert>(new Alert)
    alertState$ = this.alertState.asObservable()

    updateAlert(value: Alert){
      
        
        this.alertState.next(value)
        setTimeout(() => {
          value.show = false
          this.alertState.next(value)
        }, 4000);
        
    }

  public prepareRoute(...paths: string[]): string{
    let rootRoute = '/';
    return rootRoute.concat(paths.filter(Boolean).join('/'));
  }
}
