import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuardadoColeccionComponent } from './guardado-coleccion.component';

describe('GuardadoColeccionComponent', () => {
  let component: GuardadoColeccionComponent;
  let fixture: ComponentFixture<GuardadoColeccionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuardadoColeccionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuardadoColeccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
