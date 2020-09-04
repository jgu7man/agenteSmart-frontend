import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddColeccionComponent } from './add-coleccion.component';

describe('AddColeccionComponent', () => {
  let component: AddColeccionComponent;
  let fixture: ComponentFixture<AddColeccionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddColeccionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddColeccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
