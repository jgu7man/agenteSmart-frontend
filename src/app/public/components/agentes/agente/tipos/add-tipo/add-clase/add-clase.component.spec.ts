import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddClaseComponent } from './add-clase.component';

describe('AddClaseComponent', () => {
  let component: AddClaseComponent;
  let fixture: ComponentFixture<AddClaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddClaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddClaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
