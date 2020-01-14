import React from "react";
import "./page.css";
import Logo from "./logo.png";
import { MDBContainer } from "mdbreact";

export default function Page() {
  return (
    <div>
      <img src={Logo} alt="" className="hammer" />
      <div class="logo" style={{ marginBottom: "0" }}>
        <b>
          C<span>o</span>m<span>in</span>g<br />S<span>o</span>o<span>n</span>
          {/* <span> 4</span>
          <span>0</span>
          <span>4</span>
          <br />
          <div style={{ fontSize: "50px", fontFamily: "Comic Sans MS" }}>
            <span>N</span>
            <span>o</span>
            <span>t</span>
            <span> F</span>
            <span>o</span>
            <span>u</span>
            <span>n</span>
            <span>d</span> */}
          {/* </div> */}
        </b>
      </div>
    </div>
  );
}