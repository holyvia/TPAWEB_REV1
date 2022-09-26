import React from "react";
import "./InputOption.css";

function InputOption({ Icon, title, color }:{ Icon:any, title:any, color:any }) {
  return (
    <div className="inputOption">
      <Icon style={{ color: color }} />
      <h4>{title}</h4>
    </div>
  );
}

export default InputOption;
