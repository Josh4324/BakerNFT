/* eslint-disable @next/next/no-page-custom-font */
import { Contract, BigNumber, providers, utils, ethers } from "ethers";
import Head from "next/head";
import React, { useEffect, useRef, useState } from "react";
import Web3Modal from "web3modal";
import Link from "next/link";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from "web3";
import { abi, NFT_CONTRACT_ADDRESS } from "../constants";
import styles from "../styles/Home.module.css";

export default function Home() {
  // walletConnected keep track of whether the user's wallet is connected or not
  const [walletConnected, setWalletConnected] = useState(false);
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  // checks if the currently connected MetaMask wallet is the owner of the contract
  const [isOwner, setIsOwner] = useState(false);

  const web3ModalRef = useRef();

  let provider;
  let web3Modal;

  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: "", // required
      },
    },
    binancechainwallet: {
      package: true,
    },
  };

  /**
   * getOwner: calls the contract to retrieve the owner
   */
  const getOwner = async () => {
    try {
      // Get the provider from web3Modal, which in our case is MetaMask
      // No need for the Signer here, as we are only reading state from the blockchain
      const provider = await getProviderOrSigner();
      // We connect to the Contract using a Provider, so we will only
      // have read-only access to the Contract
      const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, provider);
      // call the owner function from the contract
      const _owner = await nftContract.owner();
      // We will get the signer now to extract the address of the currently connected MetaMask account
      const signer = await getProviderOrSigner(true);
      // Get the address associated to the signer which is connected to  MetaMask
      const address = await signer.getAddress();
      if (address.toLowerCase() === _owner.toLowerCase()) {
        setIsOwner(true);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  /**
   * Returns a Provider or Signer object representing the Ethereum RPC with or without the
   * signing capabilities of metamask attached
   *
   * A `Provider` is needed to interact with the blockchain - reading transactions, reading balances, reading state, etc.
   *
   * A `Signer` is a special type of Provider used in case a `write` transaction needs to be made to the blockchain, which involves the connected account
   * needing to make a digital signature to authorize the transaction being sent. Metamask exposes a Signer API to allow your website to
   * request signatures from the user using Signer functions.
   *
   * @param {*} needSigner - True if you need the signer, default false otherwise
   */

  const getProviderOrSigner = async (needSigner = false) => {
    // Connect to Metamask
    // Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object

    web3Modal = new Web3Modal({
      network: "bsc", // optional
      cacheProvider: true, // optional
      providerOptions, // required
    });

    provider = await web3Modal.connect();

    const web3Provider = new providers.Web3Provider(provider);

    // If user is not connected to the Mainnet network, let them know and throw an error
    const { chainId } = await web3Provider.getNetwork();
    // rinkbey - 4
    // bsc - 97
    // polygon - 80001
    if (chainId !== 97) {
      window.alert("Change the network to BSC Testnet");
      throw new Error("Change network to BSC Testnet");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

  const connectWallet = async () => {
    try {
      // When used for the first time, it prompts the user to connect their wallet
      const prov = await getProviderOrSigner();

      const web3 = new Web3(provider);
      const accounts = await web3.eth.getAccounts();

      setAddress(accounts[0]);

      const bal = await prov.getBalance(accounts[0]);

      setBalance(Number(BigNumber.from(bal)) / 10 ** 18);

      // track when wallet is connected
      localStorage.setItem("wall", "true");

      // Subscribe to accounts change
      provider.on("accountsChanged", async (accounts) => {
        if (accounts[0]) {
          console.log("chhhhh");
          const provider = new ethers.providers.JsonRpcProvider(
            "https://data-seed-prebsc-1-s1.binance.org:8545"
          );
          const bal = await provider.getBalance(accounts[0]);
          setBalance(Number(BigNumber.from(bal)) / 10 ** 18);
          setAddress(accounts[0]);
          console.log("enddd");
        }
      });

      // Subscribe to chainId change
      provider.on("chainChanged", async (chainId) => {
        await getProviderOrSigner();
      });

      // Subscribe to provider connection
      provider.on("connect", async (info) => {});

      // Subscribe to provider disconnection
      provider.on("disconnect", (error) => {
        setAddress("");
      });
    } catch (err) {
      console.error(err);
    }
  };

  const disconnectWallet = async () => {
    localStorage.removeItem("wall");
    web3Modal = new Web3Modal({
      network: "rinkeby", // optional
      cacheProvider: true, // optional
      providerOptions, // required
    });
    await web3Modal.clearCachedProvider();
    setAddress("");
  };

  useEffect(() => {
    if (localStorage.getItem("wall")) {
      // Assign the Web3Modal class to the reference object by setting it's `current` value
      // The `current` value is persisted throughout as long as this page is open
      web3ModalRef.current = new Web3Modal({
        network: "rinkeby",
        providerOptions: {},
        disableInjectedProvider: false,
      });

      connectWallet();
    }

    setBalance(0);

    // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
  }, [address]);

  return (
    <div>
      <Head>
        <title>Crypto Devs</title>
        <meta name="description" content="Whitelist-Dapp" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Michroma&family=Raleway&display=swap"
          rel="stylesheet"
        />
      </Head>
      <header className="header">
        <div className="header__logo">
          <Link href="/">
            <img src="./images/log.svg" alt="logo" className="logo__white" />
          </Link>
        </div>

        <div className="nav">
          <div className="nav__text">
            <Link className="nav__item nav__none" href="/">
              Mint
            </Link>
          </div>
          <div className="nav__text">
            <Link className="nav__item" href="/roadmap">
              About
            </Link>
          </div>
          {/*  <div className="nav__text">
            <Link className="nav__item" to="/blog">
              Blog
            </Link>
          </div> */}
          <div className="nav__text">
            <Link className="nav__item" href="/about">
              Membership
            </Link>
          </div>
          <div className="nav__text">
            <Link className="nav__item" href="/about">
              FAQs
            </Link>
          </div>
          <div style={{ marginLeft: "100px" }}>
            {address.length > 0 ? (
              <div>
                <button className="but" onClick={disconnectWallet}>
                  {address.slice(0, 5) + "....." + address.slice(-5)}
                </button>
              </div>
            ) : (
              <button className="but" onClick={connectWallet}>
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </header>

      <div
        style={{
          width: "50%",
          marginTop: "100px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <div>
          <div>
            <img
              src="https://ipfs.io/ipfs/bafybeiajth5t724atg7smq3ygkg6z4xkehpkyttwvhwa4givq6wpsmbbm4/estate1.gif"
              alt="1"
            />
          </div>
          <div className="t1">The Bugatti</div>
          <div className="t2">#1</div>
          <div className="t3">
            The greatest advantage is you become a property owner in one-click.
            Owning the well-furnished Bugatti located in a serene environment
            with Urban vibes.
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "50%",
              marginTop: "20px",
            }}
          >
            <div className="t4">Price</div>
            <div className="t4">1 eth</div>
          </div>
          <div>
            <button className="mint">Mint</button>
          </div>
        </div>
      </div>
    </div>
  );
}
