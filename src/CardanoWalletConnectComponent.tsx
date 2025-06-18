import { createSignal, createResource, Show, For } from 'solid-js';
import { makePersisted } from '@solid-primitives/storage';
import "./css/index.css";
import "./css/button.css";
import "./css/card.css";
import "./css/dialog.css";
import "./css/list.css";

const getWallets = async () => {
    const wallets = (window as any).cardano;

    // console.log("wallets: ", wallets);

    return wallets;
};

export function CardanoWalletConnectComponent() {
    const [connectedWallet, setConnectedWallet] = makePersisted(createSignal(null), {
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
                setConnectedWallet(wallet.name);
                console.log(`${wallet.name} connected`);
                closeDialog();
            }).catch((error: any) => {
                console.error(`Failed to connect to ${wallet.name}:`, error);
            });
        } else {
            console.error(`Wallet ${wallet.name} not found`);
        }
    }

    return (
        <>
            <button onClick={openDialog}>Connect Wallet</button>
            <dialog ref={setDialogRef} class="card elevated" role="alertdialog" aria-labelledby="dialog-heading" aria-describedby="dialog-content" aria-modal="true">
                <hgroup>
                    <h1 id="dialog-heading">Wallets</h1>
                    <p>Select which wallet you want to connect.</p>
                </hgroup>
                <div class="content" id="dialog-content">
                    <Show when={wallets} fallback={<p>Loading...</p>}>
                        <ul class="list bordered">
                            {
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