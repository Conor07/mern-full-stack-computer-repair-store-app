import React from "react";
import { Outlet } from "react-router-dom";

type OutletProps = {};

const Layout: React.FC<OutletProps> = ({}) => {
  return <Outlet />;
};

export default Layout;
