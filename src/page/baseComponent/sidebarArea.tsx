import React from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";

/** MainAreaコンポーネント */
export default function SidebarArea() {
  return (
    <Sidebar>
      <Menu>
        <SubMenu label="Twitter Contents1">
          <MenuItem> Twitter Action1 </MenuItem>
          <MenuItem> Twitter Action2 </MenuItem>
        </SubMenu>
        <MenuItem> Twitter Contents2 </MenuItem>
        <MenuItem> Twitter Contents3 </MenuItem>
      </Menu>
    </Sidebar>
  );
}
