import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarFormComponent } from './buscar-form.component';

describe('BuscarFormComponent', () => {
  let component: BuscarFormComponent;
  let fixture: ComponentFixture<BuscarFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuscarFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscarFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
