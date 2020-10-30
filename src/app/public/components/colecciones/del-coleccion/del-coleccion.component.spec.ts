import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DelColeccionComponent } from './del-coleccion.component';

describe('DelColeccionComponent', () => {
  let component: DelColeccionComponent;
  let fixture: ComponentFixture<DelColeccionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DelColeccionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DelColeccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
