import React, { Component } from "react";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import Login from "./Components/Login";
import Balance from "./Components/Balance";
import Transaction from "./Components/Transaction";
import axios from "axios";

export default function App() {
  const [address, setAddress] = React.useState("");
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/balance" element={<Balance />} />
          <Route path="/transaction" element={<Transaction />} />
        </Routes>
      </Router>
    </div>
  );
}
// class App extends Component {
//   state = {
//     response: {},
//   };

//   componentDidMount() {
//     axios.get("/api/").then((res) => {
//       const response = res.data;
//       this.setState({ response });
//     });
//   }

//   render() {
//     return (
//       <div className="App">
//         <h1>Hello from the frontend!</h1>
//         <h1>{this.state.response.body}</h1>
//       </div>
//     );
//   }
// }

// export default App;
