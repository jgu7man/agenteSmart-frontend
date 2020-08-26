import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PredefinidaFormComponent } from './predefinida-form.component';

describe('PredefinidaFormComponent', () => {
  let component: PredefinidaFormComponent;
  let fixture: ComponentFixture<PredefinidaFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PredefinidaFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PredefinidaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
