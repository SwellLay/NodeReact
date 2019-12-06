import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import * as CONTENT from '../Content';
import RecordPaymentModal from './RecordPaymentModal';

export default class ContentPage extends Component {
  state = {
    modal: '',
  };

  getContent() {
    const { params: { id } = {} } = this.props.match;
    return CONTENT[id];
  }

  openModal = (name) => {
    this.setState({ modal: name });
  };

  closeModal = () => {
    this.setState({ modal: '' });
  };

  renderLink = (item) => (
    <NavLink to={item.link} className="item" key={item.label}>
      {item.icon}
      <span className="label">{item.label}</span>
    </NavLink>
  );

  renderModal = (item) => (
    <a href="javascript:void(0);" className="item" key={item.label} onClick={() => this.openModal(item.modal)}>
      {item.icon}
      <span className="label">{item.label}</span>
    </a>
  );

  renderContent() {
    const { params: { id } = {} } = this.props.match;
    const data = CONTENT[id];

    return (
      <div className={`content ${id}`}>
        {data.items.map(item => item.link ? this.renderLink(item) : this.renderModal(item))}
      </div>
    );
  }

  render() {
    const data = this.getContent();
    return (
      <div className="launchpad-wrapper launchpad-content-wrapper">
        <div className="content-wrapper__main__fixed">
          <div className="page-header">
            <h1 className="heading">{data.heading}</h1>
            <h2 className="info">{data.info}</h2>
            <h3 className="sub-heading">{data.subHeading}</h3>
          </div>

          {this.renderContent()}

          <div className="extra-container">
            <NavLink to="/app/launchpad/">Choose a different starting point</NavLink>
          </div>
        </div>
        <RecordPaymentModal isOpen={this.state.modal === 'RecordPayment'} close={this.closeModal} />
      </div>
    );
  }
}
