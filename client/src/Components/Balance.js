import React, { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import { useHistory } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";

export default function Balance(props) {
  const [cookies, setCookie, removeCookie] = useCookies();
  const [ethBalance, setEthBalance] = useState(0);

  useEffect(() => {
    getEthBalance();
  }, []);

  async function getEthBalance() {
    axios.get("/api/ethBalance/" + cookies["address"]).then((res) => {
      setEthBalance(res.data.amount);
    });
  }

  console.log("Address from cookie is " + cookies["address"]);

  return (
    <div>
      <p> Balanceeeee </p>
      <p>{cookies["address"]}</p>
      <p>YO</p>
      <p>Eth: {ethBalance}</p>
    </div>
  );
}
