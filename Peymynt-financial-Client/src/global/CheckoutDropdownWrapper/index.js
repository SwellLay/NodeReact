import history from "customHistory";
import React, { Component } from 'react';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row } from 'reactstrap';
import { updateCheckoutById } from "../../api/CheckoutService";

const getTaxes = (taxes) => {
    let _taxes = [];
    if(taxes){
        taxes.forEach((tax) => {
            _taxes.push(tax.id);
        });
    }
    return _taxes;
};


class CheckoutDropdownWrapper extends Component {
    state = {
        dropdownOpen: false,
        isDelete: false,
        openMail: false,
        confirmConvert: false,
        modalContent: null
    };

    toggle = () => {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
    };
    onViewClick = () => {
      const id = this.props.row._id;
        history.push("/app/estimates/view/" + id);
    };
    onEditClick = () => {
      const id = this.props.row._id;
        history.push("/app/sales/checkouts/edit/" + id);
    };

    onViewPayments = () => {
      const id = this.props.row._id;
        if(this.isTherePayment(this.props.row)){
            history.push("/app/payments?checkoutId="+id);
        }
    };

    menuAction=() => {
        this.onTurnOnOff('', 1);
    };

    onDiscard=() => {
        this.onTurnOnOff('Deleted', 2);
    };

    subMenuAction=() => {
        this.onTurnOnOff('', 2);
    };

    onTurnOnOff = async(updatedStatus, flag) => {
        let _data = this.props.row;
        console.log("_data", _data)
        if(_data){
            let payload = {};
            let id = _data._id;

            payload['checkoutInput'] = {
                businessId: localStorage.getItem('businessId'),
                fields: _data.fields,
                itemName: _data.itemName,
                message: _data.message,
                price: _data.price,
                status: (updatedStatus)? updatedStatus : ((_data.status == 'Online')? 'Offline' : (flag === 1)? 'Online' : 'Archived'),
                taxes: getTaxes(_data.taxes),
                userId: localStorage.getItem('user.id'),
                currency: _data.currency
            };
          await updateCheckoutById(id, payload);
            // openGlobalSnackbar("Checkout Update Successfully", false);
            this.props.onUpdate(null, 'Checkout Update Successfully');
        }
    };

    isTherePayment = (row) => {
        return (row && row.report && row.report.paymentCount > 0);
    };

  renderViewPayments = (row, isArchived) => {
    let _classes = (isArchived === false) ? 'py-text--link' : 'py-text--link';
    return <React.Fragment>
      {
        <span className="py-text--link" className={_classes} id="textaction"
          onClick={this.onViewPayments}>{'View payments (' + row.report.paymentCount + ')'}</span>
      }
    </React.Fragment>
  };

    render() {
      const { dropdownOpen } = this.state;
        const row = this.props.row;
        return (
            <div className="text-right" >
                {
                  (row.status === 'Online') ? (this.isTherePayment(row)) ? this.renderViewPayments(row, false) :
                    <span className="py-text--link" id="textaction"
                      onClick={() => history.push('/app/sales/checkouts/share/' + row._id)}>Share</span> : ''
                }
              {(row.status === 'Draft') ? (this.isTherePayment(row)) ? this.renderViewPayments(row, false) :
                    <span className="py-text--link" id="textaction" onClick={() => history.push('/app/sales/checkouts/edit/'+row._id)}>Edit</span> : ''
                }
              {
                (row.status === 'Offline') ? (this.isTherePayment(row)) ? this.renderViewPayments(row, false) :
                  <span className="py-text--link" id="textaction" onClick={this.menuAction}>Turn On</span> : ''
                }
              {
                (row.status === 'Archived') ? (this.isTherePayment(row, true)) ? this.renderViewPayments(row, true) :
                  <span className="share-txt top0 pointer" id="textaction" onClick={this.onDiscard}>{'Discard'}</span> : ''
                }
                {
                  (row.status !== 'Archived') ?

                    <Dropdown isOpen={dropdownOpen}
                      toggle={this.toggle}
                      direction={'down'}
                      className="ml-2"
                      direction={'left'}
                    >
                      <DropdownToggle className="btn btn-icon btn-outline-secondary" id="action">
                      <i className="fa fa-caret-down" aria-hidden="true" id="dropIcon"></i>
                        {/* <svg viewBox="0 0 20 20" id="open-menu" xmlns="http://www.w3.org/2000/svg"><path d="M13.84 7.772c.348-.426.175-.772-.376-.772H6.559c-.556 0-.727.342-.377.772l3.2 3.928c.35.426.91.43 1.26 0l3.2-3.928h-.001z"></path></svg> */}
                      </DropdownToggle>
                      <DropdownMenu className="dropdown-menu-right">
                        <div className="dropdown-menu--body">
                        {
                          (row.status === 'Draft') ?
                            <DropdownItem key={0} id="dropItem0" onClick={this.onDiscard}>Discard</DropdownItem> : ''
                        }
                        {
                          (row.status !== 'Draft') ?
                            <div>
                              <DropdownItem key={1} id="dropItem1" onClick={this.onEditClick}>Edit</DropdownItem>
                              {
                                (!this.isTherePayment(row)) ?
                                  <DropdownItem key={4} id="dropItem2" onClick={this.onViewPayments} disabled>View
                                    payments</DropdownItem> : <DropdownItem key={5} id="dropItem3"
                                    onClick={() => history.push('/app/sales/checkouts/share/' + row._id)}>Share</DropdownItem>
                              }
                              <DropdownItem key={3} id="dropItem4" divider />
                              <DropdownItem key={2} id="dropItem5"
                                onClick={this.subMenuAction}>{(row.status === 'Online') ? 'Turn off' : 'Archive'}</DropdownItem>
                            </div> : ''
                        }
                        </div>
                      </DropdownMenu>
                    </Dropdown>
                    : ''
                }
            </div>
        );
    }
}

export default CheckoutDropdownWrapper
