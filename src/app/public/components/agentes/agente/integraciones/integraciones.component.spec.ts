import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegracionesComponent } from './integraciones.component';

describe('IntegracionesComponent', () => {
  let component: IntegracionesComponent;
  let fixture: ComponentFixture<IntegracionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntegracionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntegracionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
