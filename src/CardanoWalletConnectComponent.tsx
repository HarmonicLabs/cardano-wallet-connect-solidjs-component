import { createSignal, createResource, Show, For } from 'solid-js';
import { makePersisted } from '@solid-primitives/storage';
import { Button, Menu, MenuItem, ListItemAvatar, Avatar, ListItemText } from '@suid/material';

interface ConnectedWallet {
  walletName: string;
}

const getWallets = async () => {
  const wallets = (window as any).cardano;
  return wallets;
};

export function CardanoWalletConnectComponent(props: { showName?: boolean }) {
  const [connectedWallet, setConnectedWallet] = makePersisted(
    createSignal<ConnectedWallet | null>(null),
    {
      name: 'cardanoWallet',
      serialize: JSON.stringify,
      deserialize: JSON.parse,
    }
  );

  const [wallets] = createResource(getWallets);
  const [isMenuOpen, setIsMenuOpen] = createSignal(false);
  let buttonRef: HTMLButtonElement | undefined;

  async function connectToWallet(wallet: any) {
    if (wallet) {
      try {
        await wallet.enable();
        setConnectedWallet({ walletName: wallet.name });
        setIsMenuOpen(false); // Close menu after connecting
      } catch (error) {
        return `Failed to connect to ${wallet.name}`;
      }
    } else {
      return `Wallet not found`;
    }
  }

  function disconnectWallet() {
    setConnectedWallet(null);
    setIsMenuOpen(false); // Close menu after disconnecting
  }

  return (
    <>
      <Button
        ref={buttonRef}
        onClick={() => setIsMenuOpen(true)}
        variant="contained"
        color="primary"
      >
        {connectedWallet() === null && 'Connect Wallet'}
        {connectedWallet() !== null && props.showName && `Connected to ${connectedWallet()?.walletName}`}
        {connectedWallet() !== null && !props.showName && 'Disconnect Wallet'}
      </Button>

      <Menu
        anchorEl={buttonRef}
        open={isMenuOpen()}
        onClose={() => setIsMenuOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        PaperProps={{
          style: {
            'background-color': '#333', // Dark background as in images
            color: 'white', // White text for contrast
            'border-radius': '8px', // Rounded corners
            'min-width': '200px', // Slightly wider than button
          },
        }}
      >
        <Show when={wallets()} fallback={<MenuItem disabled><ListItemText primary="Loading..." /></MenuItem>}>
          {connectedWallet() ? (
            <>
              <MenuItem disabled>
                <ListItemText primary="Connected Wallet" />
              </MenuItem>
              <MenuItem onClick={disconnectWallet}>
                <ListItemAvatar>
                  <Avatar src={(window as any).cardano[connectedWallet()!.walletName].icon} />
                </ListItemAvatar>
                <ListItemText primary={connectedWallet()?.walletName} secondary="Disconnect" />
              </MenuItem>
            </>
          ) : (
            <>
              <MenuItem disabled>
                <ListItemText primary="Select your wallet" />
              </MenuItem>
              {Object.keys(wallets()).length > 0 ? (
                <For each={Object.keys(wallets())}>
                  {(walletName) => (
                    <MenuItem onClick={() => connectToWallet(wallets()![walletName])}>
                      <ListItemAvatar>
                        <Avatar src={wallets()![walletName].icon} />
                      </ListItemAvatar>
                      <ListItemText primary={walletName} secondary="Connect" />
                    </MenuItem>
                  )}
                </For>
              ) : (
                <MenuItem disabled>
                  <ListItemText primary="No wallets found." />
                </MenuItem>
              )}
            </>
          )}
        </Show>
      </Menu>
    </>
  );
}