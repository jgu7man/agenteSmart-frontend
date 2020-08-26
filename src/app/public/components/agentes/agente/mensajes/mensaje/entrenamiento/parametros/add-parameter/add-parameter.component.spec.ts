import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddParameterComponent } from './add-parameter.component';

describe('AddParameterComponent', () => {
  let component: AddParameterComponent;
  let fixture: ComponentFixture<AddParameterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddParameterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddParameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
