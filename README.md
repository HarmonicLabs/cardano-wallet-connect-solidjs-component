<p>
  <img width="100%" src="https://assets.solidjs.com/banner?type=cardano-wallet-connect-solidjs-component&background=tiles&project=%20" alt="cardano-wallet-connect-solidjs-component">
</p>

# cardano-wallet-connect-solidjs-component

[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg?style=for-the-badge&logo=pnpm)](https://pnpm.io/)

cardano-wallet-connect-solidjs-component

## Quick start

Install it:

```bash
npm i cardano-wallet-connect-solidjs-component
# or
yarn add cardano-wallet-connect-solidjs-component
# or
pnpm add cardano-wallet-connect-solidjs-component
```

Use it:

```tsx
import CardanoWalletConnectComponent from 'cardano-wallet-connect-solidjs-component'
```

Example:

```tsx
import { createSignal, createEffect } from 'solid-js'
import { makePersisted } from '@solid-primitives/storage';
import { CardanoWalletConnectComponent } from 'cardano-wallet-connect-solidjs-component';

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
    console.log("getUsedAddresses: ", getUsedAddresses[0]);
  }

  return (
      <div>
          <CardanoWalletConnectComponent showName={true}/>
      </div>
  );
}

export default App;
```
