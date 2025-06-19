import { createSignal, createResource, Show, For } from 'solid-js';
import { makePersisted } from '@solid-primitives/storage';
import "./css/index.css";
import "./css/button.css";
import "./css/card.css";
import "./css/dialog.css";
import "./css/list.css";

interface ConnectedWallet {
    walletName: string;
}

const getWallets = async () => {
    const wallets = (window as any).cardano;
    return wallets;
};

export function CardanoWalletConnectComponent(props: any) {
    const [connectedWallet, setConnectedWallet] = makePersisted(createSignal<ConnectedWallet | null>(null), {
        name: 'cardanoWallet',
        serialize: JSON.stringify,
        deserialize: JSON.parse,
    });

    const [wallets] = createResource(getWallets);
    const [dialogRef, setDialogRef] = createSignal<HTMLDialogElement | null>(null);
    
    const openDialog = () => {
        if (dialogRef()) {
        dialogRef()!.showModal();
        }
    };
    
    const closeDialog = () => {
        if (dialogRef()) {
        dialogRef()!.close();
        }
    };
    
    async function connectToWallet(wallet: any) {
        if (wallet) {
            wallet.enable().then(() => {
                setConnectedWallet({"walletName": wallet.name});
                // console.log("wallet: ", wallet);
                closeDialog();
            }).catch((error: any) => {
                return(`Failed to connect to ${wallet.name}: ${error.toString()}`)
                // console.error(`Failed to connect to ${wallet.name}:`, error);
            });
        } else {
            return(`Wallet ${wallet.name} not found`)
            // console.error(`Wallet ${wallet.name} not found`);
        }
    };

    async function disconnectWallet() {
        if (connectedWallet()) {
            setConnectedWallet(null);
            closeDialog();
        }
    };

    return (
        <>
            <button onClick={openDialog}>
                { connectedWallet() === null && "Connect Wallet"}
                { connectedWallet() !== null && props.showName && `Connected to ${connectedWallet()?.walletName}`}
                { connectedWallet() !== null && !props.showName && "Disconnect Wallet" }
            </button>
            <dialog ref={setDialogRef} class="card elevated" role="alertdialog" aria-labelledby="dialog-heading" aria-describedby="dialog-content" aria-modal="true">
                <hgroup>
                    <h1 id="dialog-heading">{ connectedWallet() && connectedWallet()?.walletName ? "Connected Wallet " + connectedWallet()?.walletName : "Wallets" }</h1>
                    <p>{ connectedWallet() && connectedWallet()?.walletName ? "Click on wallet to disconnect" : "Select which wallet you want to connect." }</p>
                </hgroup>
                <div class="content" id="dialog-content">
                    <Show when={wallets} fallback={<p>Loading...</p>}>
                        <ul class="list bordered">
                            {
                                
                                connectedWallet() && connectedWallet()?.walletName ? (
                                    <div class="card">
                                        <button class="button" onClick={() => disconnectWallet()}>
                                            <li>
                                                <div class="start">
                                                    <img src={(window as any).cardano[(connectedWallet() as any)?.walletName].icon} width="25" height="25" />
                                                </div>
                                                <div class="text">
                                                    <p>Disconnect</p>
                                                    <h2>{connectedWallet()?.walletName}</h2>
                                                </div>
                                            </li>
                                        </button>
                                    </div>
                                ) :
                                wallets() && Object.keys(wallets()).length > 0 ? (
                                    <For each={Object.keys(wallets())}>
                                        {

                                            (walletName) => (
                                                <div class="card">
                                                    <button class="button" onClick={() => connectToWallet(wallets()[walletName])}>
                                                    <li>
                                                        <div class="start">
                                                            <img src={wallets()[walletName].icon} width="25" height="25" />
                                                        </div>
                                                        <div class="text">
                                                            <p>Connect</p>
                                                            <h2>{walletName}</h2>
                                                            
                                                        </div>
                                                    </li>
                                                    </button>
                                                </div>
                                                
                                            )
                                        }
                                    </For>
                                ) : (
                                    <p>No wallets found.</p>
                                )
                            }
                        </ul>
                    </Show>
                </div>
                <div class="actions">
                    <button onClick={closeDialog}>Close</button>
                </div>
            </dialog>
            {
                // console.log("wallets: ", wallets(), wallets.loading)
            }        
        </>
    );
}