import React from "react";
import  nextId, { resetId, setPrefix }  from "../../../lib/index";

const Input: React.FC = () => {
    resetId();
    setPrefix("input-");
    return (
      <div>
        <label >Input with id:{nextId()} </label>

        <br />
        <input placeholder={`hello-${nextId()}`} />
      </div>
    );
}

export default Input;