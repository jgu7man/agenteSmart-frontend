import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CondicionalFormComponent } from './condicional-form.component';

describe('CondicionalFormComponent', () => {
  let component: CondicionalFormComponent;
  let fixture: ComponentFixture<CondicionalFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CondicionalFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CondicionalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
