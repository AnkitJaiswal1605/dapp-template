import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import SimpleStore_abi from './SimpleStore_abi';

const SimpleStore = () => {

/************************************* Variables & States *******************************************/

    const contractAddress = '0xB01694f14126ad278c0B20AE0f324396e2F96395';

    const [defaultAccount, setDefaultAccount] = useState(null);
    const [contract, setContract] = useState(null);

    const [connectButtonText, setConnectButtonText] = useState("Connect Wallet");
    const [logoutText, setLogoutText] = useState(null);

    const [currentContractVal, setCurrentContractVal] = useState(null);

    const [eventText, setEventText] = useState(null);
    const [loadingMsg, setLoadingMsg] = useState(null);

/************************************* Login *******************************************/

    const login = () => {
        if (window.ethereum) {
            window.ethereum.request({method: 'eth_requestAccounts'})
            .then(async (result) => {
                let provider = new ethers.providers.Web3Provider(window.ethereum);
                const { chainId } = await provider.getNetwork();
                if (chainId == 4) {
                    setDefaultAccount(result[0]);
                    let signer = provider.getSigner();
                    let tempContract = new ethers.Contract(contractAddress, SimpleStore_abi, signer);
                    setContract(tempContract);
                    localStorage.setItem('loggedIn', true);
                    setConnectButtonText("Connected");
                    setLogoutText('Logout');
                } else {
                    alert('Please connect to Rinkeby network');
                }
            })
        } else {
            alert('Need to install Metamask!');
        }
    }

/************************************* Logout *******************************************/

    const logout = () => {  
        setContract(null);
        setDefaultAccount(null);
        localStorage.setItem('loggedIn', false);
        setConnectButtonText('Connect Wallet');
        setLogoutText(null);
        setCurrentContractVal(null);
        setEventText(null);
    }

/************************************* Contract Functions *******************************************/

    const setValue = async (e) => {
        if (defaultAccount) {
            e.preventDefault();
            const txResponse = await contract.set(e.target.setText.value);
            setLoadingMsg('Updating Value...');
            await txResponse.wait();
            await getValue();
            eventListener();
            e.target.setText.value = null;
            setLoadingMsg(null);
            alert('Value updated!');
        } else {
            alert('Please connect wallet!');
        }
    }

    const getValue = async () => {
        if (defaultAccount) {
            let val = await contract.get();
            setCurrentContractVal(val);
        } else {
            alert('Please connect wallet!');
        } 
    }

    const eventListener = () => {
        contract.on('Update', (sender, from, to) => {
            let shortAddr = sender.substring(0,5) + "..." + sender.substring(sender.length - 5)
            setEventText(`Tx Details -- \nBy: ${shortAddr} \nFrom: ${from} \nTo: ${to}`);
        })
    }

/************************************* On Page Load *******************************************/

   useEffect(() => {
    const onPageLoad = async () => {
        if (localStorage?.getItem('loggedIn')) {
            await login();
        }
     }
     onPageLoad();
   }, []);

/************************************* On Account Change *******************************************/

   window.ethereum.on('accountsChanged', () => {
    login();
   })

/************************************* Styling Controllers *******************************************/

const walletStyle = {color: "#4dfed4", borderColor: "#4dfed4"};

/************************************* App Elements *******************************************/

    return (
        <div className="background">

            <div className="logo">DAPP STUDIO</div>

            <h3 className="loading-msg">{loadingMsg}</h3>
            
            <div className="connection-div">
                <p className="logout" onClick={logout}>{logoutText}</p>
                <div className="wallet-div">
                    <button className="wallet-btn" style={defaultAccount && walletStyle} onClick={login}>{connectButtonText}</button>
                    {defaultAccount ? defaultAccount.substring(0,5) + "..." + defaultAccount.substring(defaultAccount.length - 5) : "Network : Rinkeby"}
                </div>
            </div>
                
                <div className="container">
                <h1>DAPP <span className="green-text">TEMPLATE</span></h1>

                <form onSubmit={setValue} autoComplete="off">
                    <input id='setText' type='text' placeholder="Enter Text..." />
                    <br />
                    <button className="update-btn" type="submit">UPDATE</button>
                </form>
                <br />

                <br />
                <h2>
                    Current Value: <span className="green-text">{currentContractVal}</span>
                    {!currentContractVal ?
                    <button className="get-btn" onClick={getValue}>GET</button> :
                    <button className="get-btn" onClick={() => setCurrentContractVal(null)}>CLEAR</button>}
                </h2>
                <div className="tx-details">{eventText}</div>
            </div>
        </div>
    )
}

export default SimpleStore;