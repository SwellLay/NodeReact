import React, { PureComponent } from 'react';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, Button } from 'reactstrap';

import history from 'customHistory'

class Home extends PureComponent {
    state = {
        dropdownOpen: false
    }

    toggle = () => {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
    }

    handleLogout = () => {
        localStorage.clear();
        history.push('/login')
    }

    render() {
        const { handleDrawerOpen } = this.props;
        return (
            <header className="main-header">
                <nav className="navbar navbar-expand-md bg-3">
                    <div className="navbar-logo p-3 py-md-0">
                        <a className="navbar-brand" href="javascript:void(0)">
                            <img src="/assets/logo-light.png" alt="" className="logo" /> </a>
                        <Button type="button" className="navbar-toggler" onClick={handleDrawerOpen}>
                            <span className="py-icon-bar"></span>
                            <span className="py-icon-bar"></span>
                            <span className="py-icon-bar"></span>
                        </Button>
                    </div>
                    <div className="navbar-options px-3 px-md-4">
                        <UncontrolledDropdown className="nav">
                            <DropdownToggle className="dropdown-toggle nav-link">
                                <img src="/assets/images/user.png" className="avatar user-avatar rounded-circle mr-2" alt="..." />
                                <i className="fas fa-angle-down"></i>
                            </DropdownToggle>
                            <DropdownMenu className="dropdown-menu-right">
                            <div className="dropdown-menu--body">
                                <div className="dropdown-heading rounded-top bg-3 arrow top color-1">
                                    <div className="content py-1">
                                    </div>
                                </div>
                                <ul className="dropdown-body list list-group list-group-flush">
                                    <li className="list-group-item list-group-item-action">
                                        <a href="javascript:void(0)">
                                            <i className="mr-3 fas fa-user"></i>Profile</a>
                                    </li>
                                    <li className="list-group-item list-group-item-action">
                                        <a href="javascript:void(0)">
                                            <i className="mr-3 fas fa-cogs"></i>Settings</a>
                                    </li>
                                    <li className="list-group-item list-group-item-action">
                                        <a href="javascript:void(0)">
                                            <i className="mr-3 fas fa-life-ring"></i>Help</a>
                                    </li>
                                </ul>
                                <div className="dropdown-footer bg-1 d-flex justify-content-between align-items-center">
                                    <a href="javascript:void(0)" className="btn btn-rounded btn-3" onClick={this.handleLogout}>
                                        <i className="mr-3 fas fa-sign-out-alt"></i>Log out </a>
                                    <a href="javascript:void(0)" className="text-danger">
                                        <i className="mr-3 fas fa-lock"></i>
                                    </a>
                                </div>
                                </div>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </div>
                </nav>
            </header>
        )
    }
}

export default Home