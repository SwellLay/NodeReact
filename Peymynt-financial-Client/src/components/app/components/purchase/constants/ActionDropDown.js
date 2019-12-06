import history from 'customHistory';
import React, { Component } from 'react'
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';

export default class ActionDropDown extends Component {
  state = {
    dropdownOpen: false
  };

  toggle = () => {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  };

  render() {
    const { url, data, deleteVendor } = this.props;
    return (
      <div style={{ display: 'inline-block', marginLeft: '8px' }}>
        <Dropdown className="dropdown-menu-new3" isOpen={this.state.dropdownOpen}
          toggle={this.toggle}
          direction={'left'}
        >
          <DropdownToggle className="btn btn-icon btn-outline-primary">
          <svg viewBox="0 0 20 20" id="dropIcon" xmlns="http://www.w3.org/2000/svg"><path d="M13.84 7.772c.348-.426.175-.772-.376-.772H6.559c-.556 0-.727.342-.377.772l3.2 3.928c.35.426.91.43 1.26 0l3.2-3.928h-.001z"></path></svg>
          </DropdownToggle>
          <DropdownMenu>
            <div className="dropdown-menu--body">
            <DropdownItem key={0} onClick={() => history.push(`${url}/vendors/edit/${data.id}`)}>Edit</DropdownItem>
            <DropdownItem key={1} onClick={() => history.push(`${url}/bills/add/${data.id}`)}>Create bill</DropdownItem>
            <div className="dropdown-item-divider"></div>
            {/* <DropdownItem key={3} divider /> */}
            <DropdownItem key={8} onClick={(e) => deleteVendor(e, data)}>Delete</DropdownItem>
            </div>
            
          </DropdownMenu>
        </Dropdown>
      </div>
    );
  }
}
