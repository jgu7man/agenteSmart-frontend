import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FijaResFormComponent } from './fija-res-form.component';

describe('FijaResFormComponent', () => {
  let component: FijaResFormComponent;
  let fixture: ComponentFixture<FijaResFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FijaResFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FijaResFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
