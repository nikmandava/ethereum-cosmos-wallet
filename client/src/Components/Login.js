import React from "react";
import SearchBar from "material-ui-search-bar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import "../Login.css";

export default function Login(props) {
  const [address, setAddress] = React.useState("");
  const [cookies, setCookie, removeCookie] = useCookies();
  const navigate = useNavigate();

  async function handleSearch(e) {
    console.log("We are searching for address: " + address);

    if (address.startsWith("evmos1")) {
      setCookie("evmosAddress", address);
      getEthAddress(address);
    } else if (address.startsWith("0x")) {
      setCookie("ethAddress", address);
      getEvmosAddress(address);
    }

    navigate("/balance");
  }

  async function getEthAddress(evmosAddress) {
    axios.get("/api/evmosToEth/" + evmosAddress).then((res) => {
      setCookie("ethAddress", res.data.address);
    });
  }

  async function getEvmosAddress(ethAddress) {
    axios.get("/api/ethToEvmos/" + ethAddress).then((res) => {
      setCookie("evmosAddress", res.data.address);
    });
  }

  return (
    <div className="mainBox">
      <h1> Evmos Wallet </h1>
      <br />
      <SearchBar
        className="searchBar"
        placeholder="Enter your address here"
        value={address}
        onChange={(newValue) => setAddress(newValue)}
        onRequestSearch={handleSearch}
      />
    </div>
  );
}
