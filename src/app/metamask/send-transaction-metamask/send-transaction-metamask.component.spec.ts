import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendTransactionMetamaskComponent } from './send-transaction-metamask.component';

describe('SendTransactionMetamaskComponent', () => {
  let component: SendTransactionMetamaskComponent;
  let fixture: ComponentFixture<SendTransactionMetamaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [SendTransactionMetamaskComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendTransactionMetamaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
