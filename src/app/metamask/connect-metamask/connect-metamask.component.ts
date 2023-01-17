import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { BehaviorSubject, Subscription } from "rxjs";
import { MetaMaskService } from "../metamask.service";

@Component({
  selector: "app-connect-metamask",
  templateUrl: "./connect-metamask.component.html",
  styleUrls: ["./connect-metamask.component.css"],
})
export class ConnectMetamaskComponent implements OnInit, OnDestroy {
  protected subscriptions = new Subscription();
  protected error$ = new BehaviorSubject<string | undefined>(undefined);

  get account$() {
    return this.metaMaskService.account$;
  }

  get isConnected$() {
    return this.metaMaskService.isConnected$;
  }

  constructor(
    protected changeDetectorRef: ChangeDetectorRef,
    protected metaMaskService: MetaMaskService
  ) {}

  ngOnInit(): void {
    this.changeDetectorRef.detectChanges();
    this.subscriptions.add(
      this.account$.subscribe((_) => {
        this.changeDetectorRef.detectChanges();
      })
    );
    this.subscriptions.add(
      this.isConnected$.subscribe((_) => {
        this.changeDetectorRef.detectChanges();
      })
    );
  }

  onConnect(): void {
    this.error$.next(undefined);
    this.metaMaskService
      .requestAccount()
      .then((account) => console.log(`Connection to '${account} succeeded`))
      .catch((err) => this.error$.next(`Connection failed ${err.message}`));
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
