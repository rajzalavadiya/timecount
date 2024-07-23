import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeActivityComponent } from './time-activity.component';

describe('TimeActivityComponent', () => {
  let component: TimeActivityComponent;
  let fixture: ComponentFixture<TimeActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeActivityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TimeActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
