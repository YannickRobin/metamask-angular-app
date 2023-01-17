import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";
import { MetaMaskService } from "../metamask.service";

const DEFAULT_MERCHANT_ADDRESS = "0x65be1967fe184FC045819fe3E41c08B98Ca5Ad72";

@Component({
  selector: "app-send-transaction-metamask",
  templateUrl: "./send-transaction-metamask.component.html",
  styleUrls: ["./send-transaction-metamask.component.css"],
})
export class SendTransactionMetamaskComponent implements OnInit {
  protected error$ = new BehaviorSubject<string | undefined>(undefined);
  protected success$ = new BehaviorSubject<string | undefined>(undefined);
  protected txHash$ = new BehaviorSubject<string | undefined>(undefined);

  protected form: FormGroup = this.fb.group({
    amount: ["", Validators.required],
    toAddress: ["", Validators.required],
  });

  get formInvalid(): boolean {
    return this.form.invalid;
  }

  get amountControl(): FormControl {
    return this.form.controls["amount"] as FormControl;
  }

  get amount(): number {
    return this.amountControl.value;
  }

  set amount(amount: number) {
    this.amountControl.setValue(amount);
  }

  get toAddressControl(): FormControl {
    return this.form.controls["toAddress"] as FormControl;
  }

  get toAddress(): string {
    return this.toAddressControl.value;
  }

  set toAddress(toAddress: string) {
    this.toAddressControl.setValue(toAddress);
  }

  get networkId$() {
    return this.metaMaskService.network$.pipe(
      map((network) => network?.chainId)
    );
  }

  constructor(
    protected fb: FormBuilder,
    protected metaMaskService: MetaMaskService
  ) {}

  ngOnInit(): void {
    this.amount = 0.0042;
    this.toAddress = DEFAULT_MERCHANT_ADDRESS;
  }

  onSendTransaction(): void {
    this.success$.next(undefined);
    this.error$.next(undefined);
    this.metaMaskService
      .requestSendTransaction(false, this.toAddress, this.amount.toString())
      .then((txHash) => {
        console.log(`txHash: ${txHash}`);
        if (txHash !== null) {
          this.success$.next(`Transaction succesfully sent: ${txHash}`);
        } else {
          console.error("Transaction failed");
        }
      })
      .catch((err) => {
        console.error(err);
        this.error$.next(err);
      });
  }
}
