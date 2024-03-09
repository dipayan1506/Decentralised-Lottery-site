import React, {useState, useEffect} from 'react';
import {ethers} from 'ethers';
import constants from './constants';
import { abi } from "./abi";

const CONTRACT_ADDRESS = "0x968fCEAFF26c6907A7112c587BD36C888A02003E";


function Winner() {
    
    const [owner, setOwner] = useState('');
    const [ contract, setcontract] = useState('');

    const [currentAccount, setCurrentAccount] = useState('');
    const [isOwnerConnected, setisOwnerConnected] = useState(false);
    const [winner, setWinner] = useState('');
    const [status, setStatus] = useState(false);

    useEffect(() => {
        const loadBlockchainData = async () => {
            if (typeof window.ethereum !== 'undefined') {
                // const provider = new ethers.providers.Web3Provider(window.ethereum);
                const provider = new ethers.BrowserProvider(window.ethereum);

                try {
                    // const signer = provider.getSigner();
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

        const contract = async () => {
            // const provider = new ethers.providers.Web3Provider(window.ethereum);
            const provider = new ethers.BrowserProvider(window.ethereum);

            const signer = provider.getSigner();
            // const contract = new ethers.Contract(constants.contractAddress, constants.contractAbi, signer);
            const contract= new ethers.Contract(CONTRACT_ADDRESS, abi, provider);

            setcontract(contract);
            const status = await contract.isComplete();
            console.log("hello");
            setStatus(status);
            const winner = await contract.getWinner();
            setWinner(winner);
            // const owner = await contract.getManager();
            const owner = "0x9e4e76167309D38C979e77E27DA9d03866D7a6Ec";
            setOwner(owner);
            console.log("hi");
            console.log(owner);
            if (owner === currentAccount) {
                setisOwnerConnected(true);
            }
            else {
                setisOwnerConnected(false);
            }
        }

        loadBlockchainData();
        contract();
    }, [currentAccount]);


    const pickWinner = async () => {
        const provider = new ethers.BrowserProvider(window.ethereum);

        const signer = await provider.getSigner();
        // const signer = await ethers.provider.getSigner()

        const contract1= new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

        const tx = await contract1.pickWinner();
        await tx.wait();
    }

    return (
        <div className='container'>
            <h1>Result Page</h1>
            <div className='button-container'>
                 {status ? (<p>Lottery Winner is : {winner}</p>) : 
                 ( isOwnerConnected ? (<button className="enter-button" onClick={pickWinner}> Pick Winner </button>) : 
                 (<p>You are not the Owner</p>))

                 }
            </div>
        </div>
    )

}

export default Winner;
