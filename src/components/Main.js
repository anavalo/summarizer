import React, { useEffect, useState } from "react";
import { postAddress } from "./services/address";

const Main = () => {
  const [summary, setSummary] = useState("no Summary");
  const [address, setAddress] = useState("")

  useEffect(() => {});

  async function sendAddress(e) {
    e.preventDefault();
    const resp = await postAddress(address)
    setSummary(resp.data)
    setAddress("")
  }


  function handleChange(e) {
    setAddress(e.target.value)
  }

  return (
    <>
      <h1>hello bitches</h1>
      
      <form onSubmit={sendAddress}>
        <label>
          address
          <input type="text" name="address" onChange={handleChange} value={address}/>
        </label>
        <button type="submit" value="Submit">submit</button>
      </form>
      {summary}
    </>
  );
};

export default Main;
