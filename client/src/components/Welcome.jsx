import React, { useContext, useState } from "react";
import { AiFillAlipayCircle } from "react-icons/ai";
import { SiEthereum } from "react-icons/si";
import { BsInfoCircle } from "react-icons/bs";
import { TransactionContext } from "../context/TransactionContext";
import { Loader } from './';
import { shortenAddress } from "../utils/shortenAddress";
import Web3 from 'web3';
import { MoonPaySellWidget } from '@moonpay/moonpay-react';

const companyCommonStyles = "min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light text-white";

const Input = ({ placeholder, name, type, value, handleChange }) => (
    <input
        placeholder={placeholder}
        type={type}
        step="0.0001"
        value={value}
        onChange={(e) => handleChange(e, name)}
        className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
    />
);

const Welcome = () => {
    const { currentAccount, setCurrentAccount, formData, handleChange, isLoading } = useContext(TransactionContext);
    const web3 = new Web3(window.ethereum);
    const [visible, setVisible] = useState(false);

   
    const sendTransaction = async () => {
        const { addressTo, amount } = formData;
    
        // Convert amount to wei (1 ether = 10^18 wei)
        const amountInWei = web3.utils.toWei(amount.toString(), 'ether');
    
        // Calculate the fee (10% of the total amount)
        const feeAmount = web3.utils.toBN(amountInWei).mul(web3.utils.toBN(10)).div(web3.utils.toBN(100));
    
        // Deduct the fee from the total amount
        const amountToSend = web3.utils.toBN(amountInWei).sub(feeAmount);
    
        try {
            // Send the fee to the company's wallet
            await web3.eth.sendTransaction({
                from: currentAccount,
                to: "0x3fE720d2B5115F76b53457be32602A1483637b07", // Replace with your company's wallet address
                value: feeAmount,
            });
    
            console.log('Fee sent to company wallet:', feeAmount.toString());
    
            // Send transaction to the recipient
            const transaction = await web3.eth.sendTransaction({
                from: currentAccount,
                to: addressTo,
                value: amountToSend.toString(),
            });
    
            console.log('Transaction successful:', transaction);
        } catch (error) {
            console.error('Error sending transaction:', error);
        }
    };

    const handleSubmit = (e) => {
        const { addressTo, amount, keyword, message } = formData;

        e.preventDefault();

        if (!addressTo || !amount || !keyword || !message) return;

        sendTransaction();
    };


    const connectWallet = async () => {
        try {
            // Request account access if needed
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            // Update current account
            const accounts = await web3.eth.getAccounts();
            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.error('Error connecting wallet:', error);
        }
    };

    return (
        <div className="flex w-full justify-center items-center">
            <div className="flex mf:flex-row flex-col items-start justify-between md:p-20 py-12 px-4">
                <div className="flex flex-1 justify-start items-start flex-col mf:mr-10">
                    <h1 className="text-3xl sm:text-5xl text-white text-gradient py-1">
                        Send Crypto <br /> across the world
                    </h1>
                    <p className="text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-base">
                        Explore the crypto world. Buy and sell cryptocurrencies easily on Daada.
                    </p>
                    {!currentAccount && (
                        <button
                            type="button"
                            onClick={connectWallet}
                            className="flex flex-row justify-center items-center my-5 bg-[#5b5d1e] p-3 rounded-full cursor-pointer hover:bg-[#bda425]"
                        >
                            <p className="text-white text-base font-semibold">Connect Wallet</p>
                        </button>
                    )}

                    <div className="grid sm:grid-cols-3 grid-cols-2 w-full mt-10">
                        <div className={`rounded-tl-2xl ${companyCommonStyles}`}>
                            Reliable 😮‍💨
                        </div>
                        <div className={companyCommonStyles}>Secure 🔐</div>
                        <div className={`sm:rounded-tr-2xl ${companyCommonStyles}`}>
                            Ethereum 💠
                        </div>
                        <div className={`sm:rounded-bl-2xl ${companyCommonStyles}`}>
                            Web 3.0 👨🏻‍💻
                        </div>
                        <div className={companyCommonStyles}>Low Fee 💰</div>
                        <div className={`rounded-br-2xl ${companyCommonStyles}`}>
                            Blockchain ⛓️
                        </div>
                    </div>
                </div>

                <div className="flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10">
                    <div className="p-3 flex justify-end items-start flex-col rounded-xl h-40 sm:w-72 w-full my-5 eth-card .white-glassmorphism ">
                        <div className="flex justify-between flex-col w-full h-full">
                            <div className="flex justify-between items-start">
                                <div className="w-9 h-9 rounded-full border-2 border-black flex justify-center items-center">
                                    <SiEthereum fontSize={25} color="black" />
                                </div>
                                <BsInfoCircle fontSize={16} color="black" />
                            </div>
                            <div>
                                <p className="text-#666 font-light text-sm">{shortenAddress(currentAccount)}</p>
                                <p className="text-#666 font-semibold text-lg mt-1">Sepolia-ETH</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center yellowgreen-glassmorphism">
                        <Input placeholder="Address To" name="addressTo" type="text" handleChange={handleChange} />
                        <Input placeholder="Amount (ETH)" name="amount" type="number" handleChange={handleChange} />
                        <Input placeholder="Keyword (Gif)" name="keyword" type="text" handleChange={handleChange} />
                        <Input placeholder="Enter Message" name="message" type="text" handleChange={handleChange} />

                        <div className="h-[1px] w-full bg-gray-400 my-2" />

                        {isLoading ?
                            <Loader />
                            : (
                                <div>
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        className="text-white w-full mt-2 border-[1px] p-2 border-[#747c3d] bg-[#4f5529] hover:bg-[#37381f] rounded-full cursor-pointer"
                                    >
                                        Send now
                                    </button>
                                </div>

                            )}
                    </div>


                    <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center yellowgreen-glassmorphism">
                        

                        <div className="h-[1px] w-full bg-gray-400 my-2" />

                        {isLoading ?
                            <Loader />
                            : (
                                <div>
                                    <button
                                        type="button"
                                        onClick={() => setVisible(!visible)}
                                        className="text-white w-full mt-2 border-[1px] p-2 border-[#747c3d] bg-[#4f5529] hover:bg-[#37381f] rounded-full cursor-pointer"
                                    >
                                        Withdraw to fiat
                                    </button>
                                </div>

                            )}
                    </div>
                    <MoonPaySellWidget
            variant="overlay"
            baseCurrencyCode="eth"
            baseCurrencyAmount="0.1"
            quoteCurrencyCode="usd"
            visible
        />

                </div>

            </div>
        </div>

    );
}

export default Welcome;
