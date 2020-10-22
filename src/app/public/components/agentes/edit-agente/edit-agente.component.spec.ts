import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAgenteComponent } from './edit-agente.component';

describe('EditAgenteComponent', () => {
  let component: EditAgenteComponent;
  let fixture: ComponentFixture<EditAgenteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAgenteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAgenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
