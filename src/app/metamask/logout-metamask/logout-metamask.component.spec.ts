import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoutMetamaskComponent } from './logout-metamask.component';

describe('LogoutMetamaskComponent', () => {
  let component: LogoutMetamaskComponent;
  let fixture: ComponentFixture<LogoutMetamaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [LogoutMetamaskComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoutMetamaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
