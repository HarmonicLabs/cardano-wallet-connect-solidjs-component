import { createSignal } from 'solid-js'
import { makePersisted } from '@solid-primitives/storage';
import { CardanoWalletConnectComponent } from 'src'

function App() {
  const [connectedWallet, setConnectedWallet] = makePersisted(createSignal(null), {
    name: 'cardanoWallet',
    serialize: JSON.stringify,
    deserialize: JSON.parse,
  });

  async function testWallet() {
    const wallet = await (window as any).cardano[connectedWallet()].enable();
    console.log("testWallert: ", await wallet.getBalance());
  }

  return (
      <div>
          <CardanoWalletConnectComponent />
          {connectedWallet() && <p>Connected to {connectedWallet()}</p>}
          {connectedWallet() && testWallet()} 
      </div>
  );
}

export default App;
