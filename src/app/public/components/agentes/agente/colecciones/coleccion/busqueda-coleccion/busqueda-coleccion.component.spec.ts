import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaColeccionComponent } from './busqueda-coleccion.component';

describe('BusquedaColeccionComponent', () => {
  let component: BusquedaColeccionComponent;
  let fixture: ComponentFixture<BusquedaColeccionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusquedaColeccionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusquedaColeccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
