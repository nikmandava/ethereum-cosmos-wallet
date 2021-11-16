import React, { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import { useHistory } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";

export default function Balance(props) {
  const [cookies, setCookie, removeCookie] = useCookies();
  const [ethBalance, setEthBalance] = useState(0);
  const [cosmosTokens, setCosmosTokens] = useState([]);
  const [ERC20Tokens, setERC20Tokens] = useState([]);
  const [newERC20TokenAddress, setNewERC20TokenAddress] = useState("");

  useEffect(() => {
    getCosmosTokens();
  }, []);

  async function getCosmosTokens() {
    axios
      .get(
        "http://localhost:5000/api/getCosmosCoins/" + cookies["evmosAddress"]
      )
      .then((res) => {
        console.log(res.data);
        console.log(typeof res.data);
        setCosmosTokens(res.data);
      });
  }

  function onSubmit(event) {
    event.preventDefault();
    addERC20Token(newERC20TokenAddress);
  }

  function addERC20Token(newERC20TokenAddress) {
    console.log("BROOOO");
    // axios
    //   .get(
    //     "http://localhost:5000/api/getERC20Token/0xec34c1bf2eb2d2a0f7294928a2bc69f377a8540b/0xdac17f958d2ee523a2206206994597c13d831ec7"
    //   )
    //   .then((res) => {
    //     console.log("BROOO");
    //     console.log("NOOOO");
    //     // console.log(res.data);
    //     // var newERC20Tokens = [...ERC20Tokens];
    //     // newERC20Tokens.push(res.data);
    //     // setERC20Tokens(newERC20Tokens);
    //   });

    console.log("BROOOO");
    axios
      .get(
        "/api/getERC20Token/" +
          cookies["ethAddress"] +
          "/" +
          newERC20TokenAddress
      )
      .then((res) => {
        console.log("BROOO");
        console.log(res.data);
        var newERC20Tokens = [...ERC20Tokens];
        newERC20Tokens.push(res.data);
        setERC20Tokens(newERC20Tokens);
      });
  }

  // useEffect(() => {
  //   getEthBalance();
  // }, []);

  // async function getEthBalance() {
  //   axios.get("/api/ethBalance/" + cookies["ethAddress"]).then((res) => {
  //     setEthBalance(res.data.amount);
  //   });
  // }

  // console.log("Address from cookie is " + cookies["evmosAddress"]);

  return (
    <div>
      <p> Balanceeeee </p>
      <p>Eth: {cookies["ethAddress"]}</p>
      <p>Evmos: {cookies["evmosAddress"]}</p>
      <p>YO</p>
      <p>Cosmos Tokens</p>
      {/* <p>Cosmos: {cosmosTokens}</p> */}
      {cosmosTokens.map((token, index) => (
        <li key={index}>
          {token.denom}
          <br />
          {token.amount}
        </li>
      ))}
      <p>ERC20 Tokens</p>
      {ERC20Tokens.map((token, index) => (
        <li key={index}>
          {token.name}
          <br />
          {token.amount}
        </li>
      ))}
      <p>Eth: {ethBalance}</p>
      <form onSubmit={onSubmit}>
        <input
          value={newERC20TokenAddress}
          onChange={(e) => setNewERC20TokenAddress(e.target.value)}
          placeholder="ERC20 Token Address"
        ></input>
        <button>Add Address</button>
      </form>
    </div>
  );
}
