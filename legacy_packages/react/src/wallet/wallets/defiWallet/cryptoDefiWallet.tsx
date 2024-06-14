import type {
  WalletOptions,
  WalletConfig,
  ConnectUIProps,
} from "@thirdweb-dev/react-core";
import {
  CryptoDefiWallet,
  getInjectedCryptoDefiWalletProvider,
} from "@thirdweb-dev/wallets";
import { useTWLocale } from "../../../evm/providers/locale-provider";
import { ExtensionOrWCConnectionUI } from "../_common/ExtensionORWCConnectionUI";
import { handelWCSessionRequest } from "../handleWCSessionRequest";
import type { QRModalOptions } from "@thirdweb-dev/wallets/src/evm/connectors/wallet-connect/qrModalOptions";

const cryptoDefiWalletUris = {
  ios: "dfw://",
  android: "dfw://",
  other: "dfw://",
};

/**
 * @wallet
 */
export type CryptoDefiWalletConfigOptions = {
  /**
   * When connecting Defi wallet using the QR Code - Wallet Connect connector is used which requires a project id.
   * This project id is Your project’s unique identifier for wallet connect that can be obtained at cloud.walletconnect.com.
   *
   * https://docs.walletconnect.com/2.0/web3modal/options#projectid-required
   */
  projectId?: string;

  /**
   * If true, the wallet will be tagged as "recommended" in ConnectWallet Modal
   */
  recommended?: boolean;

  /**
   * Specify whether to open the official Wallet Connect  Modal when connecting the wallet if no injected MetaMask provider is found when connecting the wallet.
   *
   * This should not be set if you are using ConnectWallet component and only when manually connecting the wallet using a hook like `useConnect`.
   *
   * You can set it to `true` or a configuration object to enable the Wallet Connect Modal.
   */
  wcModal?:
    | {
        /**
         * Configure the style of Wallet Connect Modal.
         */
        qrModalOptions?: QRModalOptions;
      }
    | boolean;
};

/**
 * A wallet configurator for [Crypto.com Defi Wallet](https://crypto.com/defi-wallet) which allows integrating the wallet with React.
 *
 * It returns a [`WalletConfig`](https://portal.thirdweb.com/references/react/v4/WalletConfig) object which can be used to connect the wallet to via [`ConnectWallet`](https://portal.thirdweb.com/react/v4/components/ConnectWallet) component or [`useConnect`](https://portal.thirdweb.com/references/react/v4/useConnect) hook as mentioned in [Connecting Wallets](https://portal.thirdweb.com/react/v4/connecting-wallets) guide
 *
 * @example
 * ```ts
 * cryptoDefiWallet({
 *  projectId: "my-project-id",
 *  recommended: true,
 * })
 * ```
 *
 * @param options -
 * Optional object containing the following properties to configure the wallet
 *
 * ### projectId (optional)
 * When connecting Defi wallet using the QR Code - Wallet Connect connector is used which requires a project id.
 * This project id is Your project’s unique identifier for wallet connect that can be obtained at cloud.walletconnect.com.
 *
 * ### recommended (optional)
 * If true, the wallet will be tagged as "recommended" in [`ConnectWallet`](https://portal.thirdweb.com/react/v4/components/ConnectWallet) Modal UI
 *
 * @wallet
 */
export const cryptoDefiWallet = (
  options?: CryptoDefiWalletConfigOptions,
): WalletConfig<CryptoDefiWallet> => {
  return {
    id: CryptoDefiWallet.id,
    recommended: options?.recommended,
    meta: {
      name: "Crypto Defi Wallet",
      urls: {
        chrome:
          "https://chrome.google.com/webstore/detail/cryptocom-wallet-extensio/hifafgmccdpekplomjjkcfgodnhcellj",
        android:
          "https://play.google.com/store/apps/details?id=com.defi.wallet",
        ios: "https://apps.apple.com/us/app/crypto-com-l-defi-wallet/id1512048310",
      },
      iconURL:
        "data:image/png;base64,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",
    },
    create: (walletOptions: WalletOptions) => {
      const wallet = new CryptoDefiWallet({
        ...walletOptions,
        projectId: options?.projectId,
        qrcode: options?.wcModal ? true : false,
        qrModalOptions:
          typeof options?.wcModal === "object"
            ? options?.wcModal?.qrModalOptions
            : undefined,
      });

      handelWCSessionRequest(wallet, cryptoDefiWalletUris);

      return wallet;
    },
    connectUI: ConnectUI,
    isInstalled: isWalletInstalled,
  };
};

function isWalletInstalled() {
  return !!getInjectedCryptoDefiWalletProvider();
}

function ConnectUI(props: ConnectUIProps<CryptoDefiWallet>) {
  const locale = useTWLocale();
  return (
    <ExtensionOrWCConnectionUI
      connect={props.connect}
      connected={props.connected}
      createWalletInstance={props.createWalletInstance}
      goBack={props.goBack}
      meta={props.walletConfig["meta"]}
      setConnectedWallet={(w) =>
        props.setConnectedWallet(w as CryptoDefiWallet)
      }
      setConnectionStatus={props.setConnectionStatus}
      supportedWallets={props.supportedWallets}
      walletConnectUris={cryptoDefiWalletUris}
      walletLocale={locale.wallets.cryptoDefiWallet}
      isInstalled={isWalletInstalled}
    />
  );
}
