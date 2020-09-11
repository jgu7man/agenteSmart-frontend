import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColeccionTarjetaComponent } from './coleccion-tarjeta.component';

describe('ColeccionTarjetaComponent', () => {
  let component: ColeccionTarjetaComponent;
  let fixture: ComponentFixture<ColeccionTarjetaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColeccionTarjetaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColeccionTarjetaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
