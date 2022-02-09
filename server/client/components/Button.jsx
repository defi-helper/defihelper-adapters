import React from "react";

export const Button = (props) => {
  const {
    loading = false,
    children,
    type = "button",
    disabled,
    ...restProps
  } = props;

  return (
    <button
      type={type}
      className="button"
      disabled={disabled || loading}
      {...restProps}
    >
      {loading ? "Loading" : children}
    </button>
  );
};
