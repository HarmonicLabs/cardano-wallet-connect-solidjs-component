import { createSignal, createResource, Show, For } from 'solid-js';
import { makePersisted } from '@solid-primitives/storage';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
} from '@suid/material';

interface ConnectedWallet {
  walletName: string;
}

const getWallets = async () => {
  const wallets = (window as any).cardano;
  return wallets;
};

export function CardanoWalletConnectComponent(props: { showName?: boolean }) {
  const [connectedWallet, setConnectedWallet] = makePersisted(createSignal<ConnectedWallet | null>(null), {
    name: 'cardanoWallet',
    serialize: JSON.stringify,
    deserialize: JSON.parse,
  });

  const [wallets] = createResource(getWallets);
  const [isDialogOpen, setIsDialogOpen] = createSignal(false);

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  async function connectToWallet(wallet: any) {
    if (wallet) {
      try {
        await wallet.enable();
        setConnectedWallet({ walletName: wallet.name });
        closeDialog();
      } catch (error) {
        return `Failed to connect to ${wallet.name}`;
      }
    } else {
      return `Wallet not found`;
    }
  }

  async function disconnectWallet() {
    setConnectedWallet(null);
    closeDialog();
  }

  return (
    <>
      <Button onClick={openDialog} variant="contained" color="primary">
        {connectedWallet() === null && 'Connect Wallet'}
        {connectedWallet() !== null && props.showName && `Connected to ${connectedWallet()?.walletName}`}
        {connectedWallet() !== null && !props.showName && 'Disconnect Wallet'}
      </Button>

      <Dialog open={isDialogOpen()} onClose={closeDialog}>
        <DialogTitle>
          {connectedWallet() && connectedWallet()?.walletName
            ? `Connected Wallet ${connectedWallet()?.walletName}`
            : 'Wallets'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {connectedWallet() && connectedWallet()?.walletName
              ? 'Click on wallet to disconnect'
              : 'Select which wallet you want to connect.'}
          </Typography>
          <Show when={wallets()} fallback={<Typography>Loading...</Typography>}>
            <List>
              {connectedWallet() && connectedWallet()?.walletName ? (
                <ListItem>
                  <ListItemButton onClick={disconnectWallet}>
                    <ListItemAvatar>
                      <Avatar src={connectedWallet()?.walletName ? (window as any).cardano[connectedWallet()!.walletName].icon : undefined} />
                    </ListItemAvatar>
                    <ListItemText primary={connectedWallet()?.walletName} secondary="Disconnect" />
                  </ListItemButton>
                </ListItem>
              ) : Object.keys(wallets()!).length > 0 ? (
                <For each={Object.keys(wallets()!)}>
                  {(walletName) => (
                    <ListItem>
                      <ListItemButton onClick={() => connectToWallet(wallets()![walletName])}>
                        <ListItemAvatar>
                          <Avatar src={wallets()![walletName].icon} />
                        </ListItemAvatar>
                        <ListItemText primary={walletName} secondary="Connect" />
                      </ListItemButton>
                    </ListItem>
                  )}
                </For>
              ) : (
                <ListItem>
                  <ListItemText primary="No wallets found." />
                </ListItem>
              )}
            </List>
          </Show>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}