import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaldenarViewComponent } from './caldenar-view.component';

describe('CaldenarViewComponent', () => {
  let component: CaldenarViewComponent;
  let fixture: ComponentFixture<CaldenarViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaldenarViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaldenarViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
