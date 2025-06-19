import { createSignal, createEffect } from 'solid-js'
import { makePersisted } from '@solid-primitives/storage';
import { CardanoWalletConnectComponent } from 'src'

export type WalletInfo = {
  walletName: string;
}

function App() {
  const [connectedWallet, setConnectedWallet] = makePersisted(createSignal<WalletInfo | null>(null), {
    name: 'cardanoWallet',
    serialize: JSON.stringify,
    deserialize: JSON.parse,
  });

  async function getWalletAddress() {
    const connectedWalletName = connectedWallet()?.walletName;
    if (!connectedWalletName) return;
    
    const wallet = await (window as any).cardano[connectedWalletName].enable();
    const getUsedAddresses = await wallet.getUsedAddresses();
    // console.log("testWallert: ", getUsedAddresses[0]);
  }

  createEffect(() => {
    if (connectedWallet()) {
      setConnectedWallet(connectedWallet());
      // console.log("Connected wallet: ", connectedWallet());
    }
  });

  return (
      <div>
          <CardanoWalletConnectComponent showName={true}/>
      </div>
  );
}

export default App;
