import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMensajeComponent } from './add-mensaje.component';

describe('AddMensajeComponent', () => {
  let component: AddMensajeComponent;
  let fixture: ComponentFixture<AddMensajeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMensajeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMensajeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
