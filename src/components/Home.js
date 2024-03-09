import React, { useState, useEffect } from "react";
import { ethers } from 'ethers';
import constants from './constants';
import { abi } from "./abi";

const CONTRACT_ADDRESS = "0x968fCEAFF26c6907A7112c587BD36C888A02003E";


function Home() {
    const [currentAccount, setCurrentAccount] = useState("");
    const [ contract, setcontract] = useState('');
    const [status, setStatus] = useState(false);
    const [isWinner, setIsWinner] = useState('');
    const [connected, setConnected] = useState(false);


    useEffect(() => {
        const loadBlockchainData = async () => {
            if (typeof window.ethereum !== 'undefined') {
                // const provider = new ethers.providers.Web3Provider(window.ethereum);
    const provider = new ethers.BrowserProvider(window.ethereum);

                try {
                    const signer = await provider.getSigner();
                    const address = await signer.getAddress();
                    console.log(address);
                    setCurrentAccount(address);
                    // window.ethereum.on('accountsChanged', (accounts) => {
                    //     setCurrentAccount(accounts[0]);
                    //     console.log(currentAccount);
                    // })
                } catch (err) {
                    console.error(err);
                }
            } else {
                alert('Please install Metamask to use this application')

            }
        };

        // loadBlockchainData();
    }, []);

    useEffect(() => {
        if (currentAccount !== '') {
            const contract = async () => {
                // const provider = new ethers.providers.Web3Provider(window.ethereum);
                const provider = new ethers.BrowserProvider(window.ethereum);

                const signer = await provider.getSigner();
                const contract= new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
                setcontract(contract);
                const status = await contract.status();
                setStatus(status);
                const winner = await contract.getWinner();
                if (winner === currentAccount) {
                    setIsWinner(true);
                } else {
                    setIsWinner(false);
                }
            };

            contract();
        }
    }, [currentAccount]);

    const connectWallet = async () => {
        try {
            // await window.ethereum.request({ method: 'eth_requestAccounts' });
            // const provider = new ethers.providers.Web3Provider(window.ethereum);
            // const signer = provider.getSigner();
            const provider = new ethers.BrowserProvider(window.ethereum);

                const signer = await provider.getSigner();
            const address = await signer.getAddress();
            const contract= new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
            setcontract(contract);

            console.log(address);
            setCurrentAccount(address);
            setConnected(true);
        } catch (err) {
            console.error(err);
        }
    }


    const enterLottery = async () => {
        if ( contract !== '') {
            const amountToSend = ethers.parseEther('0.001');
            const tx = await  contract.enter({ value: amountToSend });
            await tx.wait();
        }
    }

    const claimPrize = async () => {
        if ( contract !== '') {
            const tx = await  contract.claimPrize();
            await tx.wait();
        }
    }

    return (
        <div className="container">
            <h1>Lottery Page</h1>
            <div className="button-container">
            {connected ? (
                    status ? (isWinner ? (<button className="enter-button" onClick={claimPrize}>Claim Prize</button>) :
                        (<p>You are not the Winner</p>)) :
                        (<button className="enter-button" onClick={enterLottery}>Enter Lottery</button>)
                ) : (
                    <button className="enter-button" onClick={connectWallet}>Connect Wallet</button>
                )}
            </div>
        </div>
    )

}

export default Home;
