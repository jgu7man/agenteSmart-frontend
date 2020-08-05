import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddContextoComponent } from './add-contexto.component';

describe('AddContextoComponent', () => {
  let component: AddContextoComponent;
  let fixture: ComponentFixture<AddContextoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddContextoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddContextoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
