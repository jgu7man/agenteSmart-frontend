import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessengerIntComponent } from './messenger-int.component';

describe('MessengerIntComponent', () => {
  let component: MessengerIntComponent;
  let fixture: ComponentFixture<MessengerIntComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessengerIntComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessengerIntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
