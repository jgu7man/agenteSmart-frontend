import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColeccionComponent } from './coleccion.component';

describe('ColeccionComponent', () => {
  let component: ColeccionComponent;
  let fixture: ComponentFixture<ColeccionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColeccionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColeccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
