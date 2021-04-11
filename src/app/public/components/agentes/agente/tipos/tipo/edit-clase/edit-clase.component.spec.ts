import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditClaseComponent } from './edit-clase.component';

describe('AddClaseComponent', () => {
  let component: EditClaseComponent;
  let fixture: ComponentFixture<EditClaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditClaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditClaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
