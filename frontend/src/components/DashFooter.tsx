import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type DashFooterProps = {};

const DashFooter: React.FC<DashFooterProps> = ({}) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const onGoHomeClicked = () => navigate("/dash");

  let goHomeButton = null;
  if (pathname !== "/dash") {
    goHomeButton = (
      <button
        className="dash-footer__button icon-button"
        title="Home"
        onClick={onGoHomeClicked}
      >
        <FontAwesomeIcon icon={faHouse} />
      </button>
    );
  }

  return (
    <footer className="dash-footer">
      {goHomeButton}
      <p>Current User:</p>
      <p>Status:</p>
    </footer>
  );
};

export default DashFooter;
