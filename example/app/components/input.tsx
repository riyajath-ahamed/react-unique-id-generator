import React from "react";
import  nextId, { resetId, setGlobalPrefix }  from "../../../lib/index";

const Input: React.FC = () => {
    resetId();
    setGlobalPrefix("input-");
    return (
      <div>
        <label >Input with id:{nextId()} </label>

        <br />
        <input placeholder={`hello-${nextId()}`} />
      </div>
    );
}

export default Input;