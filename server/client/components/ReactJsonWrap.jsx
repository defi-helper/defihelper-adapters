import React from "react";

export const ReactJsonWrap = (props) => {
  return (
    <div style={{ overflowX: "auto", maxWidth: "100%" }}>{props.children}</div>
  );
};
