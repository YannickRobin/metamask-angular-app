import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, OnDestroy } from "@angular/core";
import { ethers } from "ethers";
import { BehaviorSubject, from, Observable } from "rxjs";
import { map } from "rxjs/operators";

declare var window: any;

interface Nonce {
  nonce?: string;
}

export interface VerificationResponse {
  valid?: boolean;
  payload?: any;
}

export abstract class BackendUrlProvider {
  abstract getBackendUrl(path: string): string;
}

export abstract class AuthStorage {
  abstract set(payload: any): void;
  abstract get$(): Observable<any>;
}

const storageKey = "ethereumAccount";

@Injectable({
  providedIn: "root",
})
export class MetaMaskService implements OnDestroy {
  protected provider?: ethers.providers.Web3Provider;

  protected _network: ethers.providers.Network | undefined = undefined;
  protected _network$ = new BehaviorSubject<
    ethers.providers.Network | undefined
  >(this.network);

  protected _account$ = new BehaviorSubject<string | null>(this.account);

  protected _isAuthenticated$ = from(this.authStorage.get$()).pipe(
    map((payload) => payload !== undefined)
  );

  get ethereum(): any {
    return window.ethereum;
  }

  get isEthereumInstalled(): boolean {
    return typeof window.ethereum !== "undefined";
  }

  get isMetaMask(): boolean {
    return this.isEthereumInstalled && (this.ethereum.isMetaMask ?? false);
  }

  protected get network(): ethers.providers.Network | undefined {
    return this._network;
  }

  protected set network(network: ethers.providers.Network | undefined) {
    this._network = network;
    this._network$.next(network);
  }

  get network$(): Observable<ethers.providers.Network | undefined> {
    return this._network$.asObservable();
  }

  protected get account(): string | null {
    return localStorage.getItem(storageKey);
  }

  protected set account(account: string | null) {
    if (this.account !== account) {
      if (account != null) localStorage.setItem(storageKey, account);
      else localStorage.removeItem(storageKey);
      this._account$.next(account);
      this.authStorage.set(undefined);
    }
  }

  get account$(): Observable<string | null> {
    return this._account$.asObservable();
  }

  get isConnected(): boolean {
    return this.account !== undefined && this.account !== null;
  }

  get isConnected$(): Observable<boolean> {
    return this.account$.pipe(
      map((account) => account !== undefined && account !== null)
    );
  }

  get isAuthenticated$(): Observable<boolean> {
    return this._isAuthenticated$;
  }

  constructor(
    protected httpClient: HttpClient,
    protected backendUrlProvider: BackendUrlProvider,
    protected authStorage: AuthStorage
  ) {
    if (this.isEthereumInstalled) {
      this.provider = new ethers.providers.Web3Provider(this.ethereum, "any");
      this.ethereum.on("accountsChanged", (accounts: string[]) =>
        this.onAccountsChanged(accounts)
      );
      this.provider
        .listAccounts()
        .then((accounts) => this.onAccountsChanged(accounts));
      this.ethereum.on("chainChanged", (chainId: string) =>
        this.onChainChanged(chainId)
      );
      this.provider.getNetwork().then((network) => (this.network = network));
    }
  }

  protected getBackendUrl(path: string): string {
    return this.backendUrlProvider.getBackendUrl(path);
  }

  protected onAccountsChanged(accounts: string[]) {
    console.log("onAccountsChanged", accounts);
    var account: string | null;
    if (accounts === undefined || accounts.length === 0) {
      account = null;
    } else {
      account = accounts[0];
      if (accounts.length > 1) {
        console.warn(
          `More than one account connected: ${accounts}. '${account}' will be used`
        );
      }
    }
    this.account = account;
  }

  protected onChainChanged(chainId: string) {
    console.log("onChainChanged", chainId);
    this.provider?.getNetwork().then((network) => (this.network = network));
  }

  protected async getSigner() {
    await this.requestAccount();
    const signer = this.provider?.getSigner();
    return signer;
  }

  protected generateNonce = async () => {
    let nonce = await this.httpClient
      .get<Nonce>(this.getBackendUrl("/metamask/generatenonce"))
      .pipe()
      .toPromise();
    return nonce;
  };

  protected verifyMessage = async (
    message: string,
    address: string,
    signature: string
  ) => {
    let params = new HttpParams();
    params = params.append("message", message);
    params = params.append("address", address);
    params = params.append("signature", signature);

    const options = { params: params };
    let verifyMessageResponse = await this.httpClient
      .get<VerificationResponse>(
        this.getBackendUrl("/metamask/verify/message"),
        options
      )
      .toPromise();
    return verifyMessageResponse;
  };

  requestAccount = async () => {
    return this.provider?.send("eth_requestAccounts", []).then((_) => {
      if (this.account !== undefined) {
        return this.account;
      } else {
        throw Error("No account to connect");
      }
    });
  };

  requestLogin = async () => {
    this.authStorage.set(undefined);

    const signer = await this.getSigner();
    const res = await this.generateNonce();
    const nonce = res.nonce;

    console.log("Message to be be signed is: ", nonce);

    if (nonce === undefined) {
      throw Error("Could not generate nonce!");
    } else {
      const signature = await signer?.signMessage(nonce);
      if (signature === undefined) {
        throw Error("Could not sign message!");
      } else {
        const address = await signer?.getAddress();

        if (address === undefined) {
          throw Error("Could not get address!");
        } else {
          const res = await this.verifyMessage(nonce, address, signature);
          if (res.valid === true) {
            console.log(`Authenticated ${this.account}`);
            if (this.account !== undefined) {
              this.authStorage.set(res.payload ?? null);
              return this.account;
            } else {
              throw Error("No account to login to");
            }
          } else {
            throw new Error("Signature invalid");
          }
        }
      }
    }
  };

  logout = async () => {
    this.authStorage.set(undefined);
  };

  requestSendTransaction = async (
    isProd: boolean,
    toAdress: string,
    amountETH: string
  ) => {
    const networkVersion = this.network?.chainId;
    if (isProd && networkVersion !== 1) {
      throw Error("Network should be Ethereum mainnet");
    }

    if (!isProd && networkVersion === 1) {
      throw Error("Network should be a testnet");
    }

    const signer = await this.getSigner();
    const tx = await signer?.sendTransaction({
      to: toAdress,
      value: ethers.utils.parseEther(amountETH).toHexString(),
    });

    if (tx === undefined) {
      throw Error("Could not send transaction");
    } else {
      return tx?.hash;
    }
  };

  checkTransactionConfirmation = async (txHash: string) => {
    const receipt = await this.provider?.getTransactionReceipt(txHash);
    return receipt;
  };

  checkTransactionConfirmationFromBackend = async (_txhash: string) => {
    const receipt = null;
    return receipt;
  };

  ngOnDestroy(): void {
    console.log("ngOnDestroy");
    this.provider?.removeAllListeners();
  }
}
