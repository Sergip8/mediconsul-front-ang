import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { slideDown } from "../../utils/animations";
import { AlertType } from "./alert.type";
import { CommonService } from '../../../_core/services/common.service';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule, AsyncPipe],
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
  animations: [slideDown]
})
export class AlertComponent {
  @Input() message: string = "holaaaaaaaaaaaaaaaaaaaaa";
  @Input() type: AlertType = AlertType.Success;
  @Input() dismissible: boolean = false;
  @Input() show: boolean = false;

  @Output() hideAlert = new EventEmitter<boolean>();

  @ViewChild("alertElement", { static: false }) alertElement!: ElementRef;

  constructor(public commonService: CommonService, private elementRef: ElementRef) {
  }

  protected alertTypeClass(): string {
    let elemClass: string;

    switch (this.type) {
      case AlertType.Success:
        elemClass = "border border-l-4 border-l-green-500 border-green-100 bg-green-100 text-green-600";
        break;
      case AlertType.Danger:
        elemClass = "border border-l-4 border-l-red-500 border-red-100 bg-red-100 text-red-600";
        break;
      case AlertType.Info:
        elemClass = "border border-l-4 border-l-blue-500 border-blue-100 bg-blue-100 text-blue-600";
        break;
      default:
        elemClass = "border border-l-4 border-l-orange-500 border-orange-100 bg-orange-100 text-orange-600";
    }

    return elemClass;
  }

  protected dismissHandler(): void {
    this.show = false;
    this.hideAlert.emit(this.show);
  }
}
