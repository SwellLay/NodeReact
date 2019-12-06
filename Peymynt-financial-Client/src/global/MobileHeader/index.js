import history from 'customHistory'
import React, { PureComponent } from 'react'
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";

import * as BusinessAction from "../../actions/businessAction";

class MobileHeader extends PureComponent {
    state = {
        activeSelected: '',
        modal: false
    };

    componentDidMount() {
        this.fetchBusiness()
    }

    fetchBusiness = async () => {
        await this.props.actions.fetchBusiness()

    };
    toggle = () => {
        this.setState(prevState => {
            return { activeSelected: !prevState.activeSelected }
        });
    };

    sideToggle = () => {
        this.setState(prevState => {
            return { modal: !prevState.modal }
        });
    };

    onSignOut = () => {
        localStorage.clear();
        history.push('/login')
    };

    changeBusiness = (e, business) => {
        this.props.actions.setSelectedBussiness(business);
        this.sideToggle()
    };

    businessItems() {
        const { business, selectedBusiness } = this.props;
        console.log("selected", selectedBusiness)
        return business.length && business.map((item, i) => {
            return (
              <li key={'4.' + i} className="is-current" onClick={e => this.changeBusiness(e, item)}>
                  <a href="javascript:void(0)">
                      <span className="">{item.organizationName}</span>
                      {(selectedBusiness && selectedBusiness._id === item._id) ?
                        <span className="check-icon"><i className="fa fa-check" aria-hidden="true"></i></span> : ''}
                  </a>
              </li>
            );
        });

    }

    render() {
        const { handleDrawerOpen, isOpen, selectedBusiness } = this.props;
        console.log("selected", selectedBusiness)
        return (
          <div className="content-header">
              <div className="mobile-header">
                  <div className="menu-toggle pointer" onClick={handleDrawerOpen}>
                      <span className="toggle-icon"><i className={(isOpen) ? 'fa fa-close' : 'fa fa-bars'}
                        aria-hidden="true"></i></span>
                      <span className="menu-toggle-label">Menu</span>
                  </div>
                  <span className="business-name"> {selectedBusiness && selectedBusiness.organizationName} </span>
              </div>
          </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        business: state.businessReducer.business,
        selectedBusiness: state.businessReducer.selectedBusiness,
    };
};
const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(BusinessAction, dispatch)
        // getProducts: () => {
        //     dispatch(ProductActions.fetchProducts())
        // }
    };
};


export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(MobileHeader)
);
