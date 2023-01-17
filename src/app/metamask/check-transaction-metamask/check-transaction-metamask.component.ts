import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { BehaviorSubject } from "rxjs";
import { MetaMaskService } from "../metamask.service";

@Component({
  selector: "app-check-transaction-metamask",
  templateUrl: "./check-transaction-metamask.component.html",
  styleUrls: ["./check-transaction-metamask.component.css"],
})
export class CheckTransactionMetamaskComponent implements OnInit {
  protected error$ = new BehaviorSubject<string | undefined>(undefined);
  protected success$ = new BehaviorSubject<string | undefined>(undefined);

  protected form: FormGroup = this.fb.group({
    txHash: [""],
  });

  get formInvalid(): boolean {
    return this.form.invalid;
  }

  get txHashControl(): FormControl {
    return this.form.controls["txHash"] as FormControl;
  }

  get txHash(): string {
    return this.txHashControl.value;
  }

  constructor(
    protected fb: FormBuilder,
    protected metaMaskService: MetaMaskService
  ) {}

  ngOnInit(): void {}

  onCheckTransaction(): void {
    this.error$.next(undefined);
    this.success$.next(undefined);
    this.metaMaskService
      .checkTransactionConfirmation(this.txHash)
      .then((res) => {
        if (res != null) {
          const message = `Transaction details: ${JSON.stringify(res)}`;
          console.log(message);
          this.success$.next(message);
        } else {
          const message = `Transaction  ${this.txHash} does not exits!`;
          console.error(message);
          this.error$.next(message);
        }
      });
  }
}
