import React from "react";
import  nextId, { setGlobalSuffix }  from "../../../lib/index";

const Checkbox: React.FC = () => {

  setGlobalSuffix("-checkbox");

  return (
    <div>
      <label>Checkbox with id: {nextId()}</label>
      <input type="checkbox" id={`${nextId()}`}  />
    </div>
  );
};

export default Checkbox;