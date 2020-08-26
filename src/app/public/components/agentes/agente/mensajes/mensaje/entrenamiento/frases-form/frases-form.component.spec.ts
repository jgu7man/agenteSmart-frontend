import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrasesFormComponent } from './frases-form.component';

describe('FrasesFormComponent', () => {
  let component: FrasesFormComponent;
  let fixture: ComponentFixture<FrasesFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrasesFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrasesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
