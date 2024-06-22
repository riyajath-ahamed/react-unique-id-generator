import React from "react";
import  nextId, { setSuffix }  from "../../../lib/index";

const Checkbox: React.FC = () => {

setSuffix("-checkbox");

  return (
    <div>
      <label>Checkbox with id: {nextId()}</label>
      <input type="checkbox" id={`${nextId()}`}  />
    </div>
  );
};

export default Checkbox;