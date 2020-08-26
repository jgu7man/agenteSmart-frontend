import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FraseParametersComponent } from './frase-parameters.component';

describe('ParametersComponent', () => {
  let component: FraseParametersComponent;
  let fixture: ComponentFixture<FraseParametersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FraseParametersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FraseParametersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
