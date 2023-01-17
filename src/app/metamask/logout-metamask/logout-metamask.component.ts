import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { BehaviorSubject, Subscription } from "rxjs";
import { MetaMaskService } from "../metamask.service";

@Component({
  selector: "app-logout-metamask",
  templateUrl: "./logout-metamask.component.html",
  styleUrls: ["./logout-metamask.component.css"],
})
export class LogoutMetamaskComponent implements OnInit {
  protected subscriptions = new Subscription();
  protected error$ = new BehaviorSubject<string | undefined>(undefined);
  protected success$ = new BehaviorSubject<string | undefined>(undefined);

  get isConnected$() {
    return this.metaMaskService.isConnected$;
  }

  get isAuthenticated$() {
    return this.metaMaskService.isAuthenticated$;
  }

  constructor(
    protected changeDetectorRef: ChangeDetectorRef,
    protected metaMaskService: MetaMaskService
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.isAuthenticated$.subscribe((_) => {
        this.changeDetectorRef.detectChanges();
      })
    );
    this.subscriptions.add(
      this.isConnected$.subscribe((_) => {
        this.changeDetectorRef.detectChanges();
      })
    );
  }

  onLogout(): void {
    this.error$.next(undefined);
    this.success$.next(undefined);
    this.metaMaskService
      .logout()
      .then((account) => console.log(`Logout succeeded`))
      .catch((err) => this.error$.next(err));
  }
}
