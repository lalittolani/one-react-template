import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import {
  Navbar,
  Nav,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  InputGroupAddon,
  InputGroup,
  Input,
  Form,
  NavItem,
  NavLink,
} from "reactstrap";
import cx from "classnames";
import { NavbarTypes } from "../../reducers/layout";
import Notifications from "../Notifications";
import { logoutUser } from "../../actions/user";
import chroma from "chroma-js";
import {
  toggleSidebar,
  openSidebar,
  closeSidebar,
  changeActiveSidebarItem,
} from "../../actions/navigation";

import userAvatar from "../../images/userAvatar.svg";
import search from "../../images/search.svg";
import notify from "../../images/notify.svg";
import lightNotify from "../../images/light-notify.svg";
import email from "../../images/email.svg";

import s from "./Header.module.scss"; // eslint-disable-line css-modules/no-unused-class

class Header extends React.Component {
  static propTypes = {
    sidebarOpened: PropTypes.bool.isRequired,
    sidebarStatic: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string,
    }).isRequired,
  };

  constructor(props) {
    super(props);

    this.toggleMenu = this.toggleMenu.bind(this);
    this.switchSidebar = this.switchSidebar.bind(this);
    this.toggleNotifications = this.toggleNotifications.bind(this);
    this.toggleSidebar = this.toggleSidebar.bind(this);
    this.doLogout = this.doLogout.bind(this);

    this.state = {
      menuOpen: false,
      notificationsOpen: false,
      notificationsTabSelected: 1,
      focus: false,
      showNewMessage: false,
      hideMessage: true,
      run: true,
    };
  }

  toggleFocus = () => {
    this.setState({ focus: !this.state.focus });
  };

  toggleNotifications() {
    this.setState({
      notificationsOpen: !this.state.notificationsOpen,
    });
  }

  doLogout() {
    this.props.dispatch(logoutUser());
  }

  // collapse/uncolappse
  switchSidebar() {
    if (this.props.sidebarOpened) {
      this.props.dispatch(closeSidebar());
      this.props.dispatch(changeActiveSidebarItem(null));
    } else {
      const paths = this.props.location.pathname.split("/");
      paths.pop();
      this.props.dispatch(openSidebar());
      this.props.dispatch(changeActiveSidebarItem(paths.join("/")));
    }
  }

  // tables/non-tables
  toggleSidebar() {
    this.props.dispatch(toggleSidebar());
    if (this.props.sidebarStatic) {
      localStorage.setItem("staticSidebar", "false");
      this.props.dispatch(changeActiveSidebarItem(null));
    } else {
      localStorage.setItem("staticSidebar", "true");
      const paths = this.props.location.pathname.split("/");
      paths.pop();
      this.props.dispatch(changeActiveSidebarItem(paths.join("/")));
    }
  }

  toggleMenu() {
    this.setState({
      menuOpen: !this.state.menuOpen,
    });
  }
  render() {
    const { focus } = this.state;
    const { navbarType, navbarColor, openUsersList } = this.props;

    const user = JSON.parse(localStorage.getItem("user") || {});

    const firstUserLetter = (user.name || user.email || "P")[0].toUpperCase();

    return (
      <Navbar
        className={`${s.root} d-print-none ${
          navbarType === NavbarTypes.FLOATING ? s.navbarFloatingType : ""
        }`}
        style={{ zIndex: !openUsersList ? 100 : 0 }}
      >
        <NavItem className={`${s.toggleSidebarNav} d-md-none d-flex mr-2`}>
          <NavLink
              className="ml-2 pr-4 pl-3"
              id="toggleSidebar"
              onClick={this.toggleSidebar}
          >
            <i
                className={`la la-bars ${
                    chroma(navbarColor).luminance() < 0.4 ? "text-white" : ""
                }`}
                style={{color: "#000"}}
            />
          </NavLink>
        </NavItem>
        <NavItem className={'d-md-down-block d-md-none ml-auto'}>
          <img
              src={search}
              alt="search"
              width="24px"
              height="23px"
              style={{ marginRight: 12 }}
          />
        </NavItem>
        <Form className={`ml-auto d-md-down-none`} inline>
            <InputGroup
              onFocus={this.toggleFocus}
              onBlur={this.toggleFocus}
              className={`${cx("input-group-no-border", { focus: !!focus })}`}
            >
              <Input
                id="search-input"
                placeholder="Search"
                className={`${cx({ focus: !!focus }, s.headerSearchInput)}`}
                style={{ borderBottomLeftRadius: 4, borderTopLeftRadius: 4 }}
              />
              <InputGroupAddon addonType={"prepend"}>
                <img
                  src={search}
                  alt="search"
                  width="24px"
                  height="23px"
                  style={{ marginRight: 12 }}
                />
              </InputGroupAddon>
            </InputGroup>
        </Form>
        <Nav>
          <Dropdown
            nav
            isOpen={this.state.notificationsOpen}
            toggle={this.toggleNotifications}
            id="basic-nav-dropdown"
            className={`${s.notificationsMenu}`}
          >
            <DropdownToggle
              nav
              className={`${
                chroma(navbarColor).luminance() < 0.4 ? "text-white" : ""
              }`}
              style={{ marginLeft: 20 }}
            >
              {this.state.notificationsOpen ? (
                <img
                  src={lightNotify}
                  alt="notify"
                  width="24px"
                  height={"24px"}
                />
              ) : (
                <>
                  <img src={notify} alt="notify" width="24px" height={"24px"} />
                  <i
                    className={`fa fa-circle text-danger mb-2 ${s.circleStyle}`}
                  />
                </>
              )}
            </DropdownToggle>
            <DropdownMenu
              right
              className={`${s.notificationsWrapper} py-0 animated animated-fast fadeInUp`}
            >
              <Notifications />
            </DropdownMenu>
          </Dropdown>
          <Dropdown
            nav
            className={`${s.notificationsMenu}`}
            toggle={() => {}}
          >
            <DropdownToggle
              nav
              className={`${
                chroma(navbarColor).luminance() < 0.4 ? "text-white" : ""
              }`}
              style={{ marginLeft: 20 }}
            >
              <img src={email} alt="email" width="24px" height={"24px"} />
              <i className={`fa fa-circle text-success mb-2 ${s.emailStyle}`} />
            </DropdownToggle>
            <DropdownMenu
              right
              className={`${s.notificationsWrapper} py-0 animated animated-fast fadeInUp`}
            >
              <Notifications />
            </DropdownMenu>
          </Dropdown>
          <Dropdown
            nav
            className={`${s.notificationsMenu}`}
            toggle={() => {}}
          >
            <DropdownToggle
              nav
              className={`${
                chroma(navbarColor).luminance() < 0.4 ? "text-white" : ""
              }`}
              style={{ marginLeft: 20 }}
            >
              <span
                className={`${s.avatar} rounded-circle thumb-sm float-left mr-2`}
              >
                {user.avatar || user.email === "admin@flatlogic.com" ? (
                  <img src={user.avatar || userAvatar} alt="..." />
                ) : (
                  <span>{firstUserLetter}</span>
                )}
              </span>
            </DropdownToggle>
          </Dropdown>
        </Nav>
      </Navbar>
    );
  }
}

function mapStateToProps(store) {
  return {
    sidebarOpened: store.navigation.sidebarOpened,
    sidebarStatic: store.navigation.sidebarStatic,
    navbarType: store.layout.navbarType,
    navbarColor: store.layout.navbarColor,
  };
}

export default withRouter(connect(mapStateToProps)(Header));
