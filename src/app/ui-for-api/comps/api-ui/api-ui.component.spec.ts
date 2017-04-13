import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiUiComponent } from './api-ui.component';

describe('ApiUiComponent', () => {
  let component: ApiUiComponent;
  let fixture: ComponentFixture<ApiUiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApiUiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
