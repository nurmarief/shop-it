import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const SideMenu = ({ menuItems }) => {
  const location = useLocation();

  const [activeMenuItem, setActiveMenuItem] = useState(location.pathname);

  const handleMenuItemClick = (menuItemUrl) => {
    setActiveMenuItem(menuItemUrl);
  };

  return (
    <div className="list-group mt-5 pl-4">
      {menuItems.map((menuItem, index) => (
        <Link
          key={index}
          to={menuItem.url}
          className={`fw-bold list-group-item list-group-item-action ${
            activeMenuItem === menuItem.url && "active"
          }`}
          aria-current={
            activeMenuItem.includes(menuItem.url) ? "true" : "false"
          }
          onClick={(e) => handleMenuItemClick(menuItem.url)}
        >
          <i className={`${menuItem.icon} fa-fw pe-2`}></i>
          {menuItem.name}
        </Link>
      ))}
    </div>
  );
};

export default SideMenu;
