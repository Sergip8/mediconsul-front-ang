import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  output,
  Output,
  SimpleChanges,
} from "@angular/core";
import { SelectData, SelectValues } from "./selectModel";
import { FormsModule } from "@angular/forms";
import { CommonModule, NgClass } from "@angular/common";

@Component({
    selector: "app-search",
    imports: [CommonModule, FormsModule],
    template: `
   <div [class]="'relative ' + selectData.placeholder.replaceAll(' ', '-')">
  <!-- Input Field -->
  <input
    type="text"
    [(ngModel)]="searchQuery"
    (input)="filterOptions()"
    [placeholder]="selectData.placeholder"
    (focus)="onFocus =true"
   
    class="w-full px-4 py-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 bg-white text-blue-900 placeholder-gray-400"
  />

  <!-- Dropdown Options -->
  <div
    *ngIf="filteredOptions.length > 0 ||onFocus"
    class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto"
  >
    <div
      *ngFor="let option of selectData.list"
      (click)="selectOption(option)"
      class="select-list px-4 py-2 cursor-pointer hover:bg-blue-100 text-blue-900"
    >
    <div class="flex justify-between">
      <span>
        {{ option.name }}

      </span>
      <span>{{option.type}}</span>

    </div>
    </div>
  </div>
</div>
  `,
    styles: [``]
})
export class SelectComponent implements OnInit {
  @Input() selectData: SelectData = new SelectData; // Input for the list of options
  @Output() selected = new EventEmitter<SelectValues>()
  @Output() search = new EventEmitter<string>()
  @Input() setSelectedOption = false
  onFocus = false
  filteredOptions: string[] = [];
  searchQuery: string = '';

  ngOnInit(): void {
    
  }

  // Filter options based on search query
  filterOptions(): void {
   
    this.search.emit(this.searchQuery)
  }

  // Handle option selection
  selectOption(option: SelectValues): void {
    if(this.setSelectedOption)
      this.searchQuery = Object.values(option).filter(o => o != "").join(" - ")
    this.selected.emit(option)
    this.onFocus = false;
  }
  @HostListener("document:click", ["$event"])
  onClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const clickInside = target.closest(`.${this.selectData.placeholder.replaceAll(' ', '-')}`);
    
    if (!clickInside) {
      this.onFocus = false;
    }
  }
}
