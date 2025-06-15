import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorAvailableListComponent } from './doctor-available-list.component';

describe('DoctorAvailableListComponent', () => {
  let component: DoctorAvailableListComponent;
  let fixture: ComponentFixture<DoctorAvailableListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoctorAvailableListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorAvailableListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
