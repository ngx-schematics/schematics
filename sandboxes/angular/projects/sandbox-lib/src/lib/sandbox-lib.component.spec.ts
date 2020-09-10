import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SandboxLibComponent } from './sandbox-lib.component';

describe('SandboxLibComponent', () => {
  let component: SandboxLibComponent;
  let fixture: ComponentFixture<SandboxLibComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SandboxLibComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SandboxLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
