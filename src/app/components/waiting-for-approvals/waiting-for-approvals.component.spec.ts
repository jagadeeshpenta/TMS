import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitingForApprovalsComponent } from './waiting-for-approvals.component';

describe('WaitingForApprovalsComponent', () => {
  let component: WaitingForApprovalsComponent;
  let fixture: ComponentFixture<WaitingForApprovalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaitingForApprovalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaitingForApprovalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
