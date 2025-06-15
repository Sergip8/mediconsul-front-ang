import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AlertComponent } from "./shared/components/alert/alert.component";
import { AsyncPipe, NgIf } from '@angular/common';
import { CommonService } from './_core/services/common.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AlertComponent, AsyncPipe, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'med-consulting-ang';

  constructor(public commonService: CommonService){}
}
