import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { MetaMaskService } from "./metamask/metamask.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit, OnDestroy {
  protected subscriptions = new Subscription();

  get network$() {
    return this.metaMaskService.network$;
  }

  get isAuthenticated$() {
    return this.metaMaskService.isAuthenticated$;
  }

  get isMetaMask() {
    return this.metaMaskService.isMetaMask;
  }

  constructor(
    protected changeDetectorRef: ChangeDetectorRef,
    protected metaMaskService: MetaMaskService
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.network$.subscribe((_) => {
        this.changeDetectorRef.detectChanges();
      })
    );
    this.subscriptions.add(
      this.isAuthenticated$.subscribe((_) => {
        this.changeDetectorRef.detectChanges();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
