import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckTransactionMetamaskComponent } from './check-transaction-metamask.component';

describe('CheckTransactionMetamaskComponent', () => {
  let component: CheckTransactionMetamaskComponent;
  let fixture: ComponentFixture<CheckTransactionMetamaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [CheckTransactionMetamaskComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckTransactionMetamaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
