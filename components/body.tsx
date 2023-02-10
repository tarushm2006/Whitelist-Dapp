import React, { useState, useEffect } from "react";
import { abi } from "@/constants/abi";
import Header from "./header";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import { InjectedConnector } from "wagmi/connectors/injected";
import {
  useConnect,
  useAccount,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useContractRead,
} from "wagmi";

function Body() {
  const [connected, setConnected] = useState(false);
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  const contractAddress = "0x02b6D37AE92909378a166b383DD58E02EE1Ec573";

  const { config } = usePrepareContractWrite({
    address: contractAddress,
    abi: abi,
    functionName: "addAddress",
  });

  const { data, write } = useContractWrite(config);
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  const { address, isConnected } = useAccount();

  useEffect(() => {
    setConnected(isConnected);
  }, [connected]);

  const buttonClass =
    "translate-y-20 md:-translate-x-80 md:translate-y-36 bg-black text-white p-3 rounded-md";
  const renderButton = () => {
    if (connected) {
      return (
        <button
          className={buttonClass}
          onClick={() => {
            write!();
          }}
        >
          Join Whitelist
        </button>
      );
    } else if (!connected) {
      return (
        <button onClick={() => connect()} className={buttonClass}>
          Connect Wallet
        </button>
      );
    }
  };
  const renderSuccess = () => {
    if (isSuccess) {
      return <p>Transaction Succesfull</p>;
    }
    if (isLoading) {
      return <p>Waiting for confirmation</p>;
    }
  };
  const renderPara = () => {
    if (connected) {
      return <p>Connected to {address}</p>;
    }
  };

  const RenderList = () => {
    const { data } = useContractRead({
      address: contractAddress,
      abi: abi,
      functionName: "numAddressesWhitelisted",
    });
    return <p>{data} addresses whitelisted</p>;
  };

  return (
    <div>
      <main className={styles.main}>
        <Header />
        {renderButton()}
        <Image
          width="500"
          height="500"
          priority
          alt="Crypto-devs"
          src="/crypto-devs.svg"
          className="w-full -translate-y-56 md:-translate-y-20 lg:-translate-y-10 lg:w-1/3 md:w-1/2 md:translate-x-32 lg:translate-x-60"
        />
        <RenderList />
        {renderSuccess()}
        {renderPara()}
      </main>
    </div>
  );
}

export default Body;
