import history from 'customHistory';
import React, { Fragment } from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Button, Card, CardBody, Col, Container, Row, Spinner } from 'reactstrap';
import { bindActionCreators } from 'redux'
import DataTableWrapper from 'utils/dataTableWrapper/DataTableWrapper';
import * as CheckoutActions from '../../../../../../actions/CheckoutActions';
import { openGlobalSnackbar } from '../../../../../../actions/snackBarAction';
import { columns, defaultSorted } from '../../../../../../constants/CheckoutConst';
import CheckoutDropdownWrapper from "../../../../../../global/CheckoutDropdownWrapper";
import { _documentTitle } from '../../../../../../utils/GlobalFunctions';
import NoCheckouts from './NoCheckouts';

const getTaxes = (taxes) => {
    let _taxes = [];
    if(taxes){
        taxes.forEach((tax) => {
            _taxes.push(tax.id);
        });
    }
    return _taxes;
};


class Checkouts extends React.Component {
    constructor(props) {
        super(props);
      this.state = {
            dropdownOpen: -1,
            checkoutData: [],
            isLoadingData: true,
        isPaymentEnabled: true,
        getData:false
        };
    }

    actionRender = (cell, row, rowIndex, formatExtraData) => {
        return (
          <Fragment>
            <CheckoutDropdownWrapper onUpdate={this.onupdate} row={row} index={rowIndex} />
          </Fragment>
        );
    };

    onupdate = (err, message) => {
        this.props.showSnackbar(message, false);
        this.setState({
            getData:true
        })
        
    };

    componentDidMount() {
        if(columns.length == 4){
            columns.push({
                dataField: "",
                text: "Actions",
                formatter: this.actionRender,
                sort: false,
                classes: 'py-table__cell checkouts-list__row-actions'
            });
        }

        const { selectedBusiness } = this.props;
        _documentTitle(selectedBusiness, 'Checkouts')
        this.fetchCheckouts();
    }

    componentDidUpdate() {
        if(this.state.getData){
            this.fetchCheckouts();
            this.setState({
                getData:false
            })
        }
    }

    fetchCheckouts() {
        this.props.actions.fetchCheckouts()
            .then(result => {
                console.log('*****************Fetching all checkouts => ', result);

                if(!result){
                    this.setState({ checkoutData: [], isLoadingData: false, isPaymentEnabled: false });
                } else {
                    this.setState({ checkoutData: result.payload, isLoadingData: false });
                }
                setTimeout(() => {
                    this.props.actions.resetAddCheckout();
                }, 2000);

            }).catch(error => {
            });
    }

    render() {
        const checkouts = this.state.checkoutData;
      const isLoadingData = this.state.isLoadingData;
      const isPaymentEnabled = this.state.isPaymentEnabled;
        return (
            <div className={`content-wrapper__main checkoutWrapper ${((!checkouts || checkouts.length <= 0) && isLoadingData === false) && 'pdT0'}`}>
                {
                    isLoadingData ?
                    <Container className="mrT50 text-center">
                        <Spinner color="primary" size="md" className="loader" />
                    </Container> :
                      ((!checkouts || checkouts.length <= 0) && isLoadingData === false) ?
                            <NoCheckouts
                                isPaymentEnabled={isPaymentEnabled}
                                checkouts={checkouts}
                                isLoadingData={isLoadingData}
                            />
                        :

                        <div>
                        <header className="py-header">
                            <div className="py-header--title">
                                <h4 className="py-heading--title">Checkouts </h4>
                            </div>

                            <div className="py-header--actions">
                                <Button onClick={() => history.push('/app/sales/checkouts/add')} className="btn btn-primary">Create a checkout</Button>
                            </div>
                        </header>

                        <div className="checkout-list-table">
                            <DataTableWrapper
                            data={checkouts || []}
                            columns={columns}
                            classes="py-table--condensed"
                            defaultSorted={defaultSorted}
                            from="checkout"
                            />
                        </div>

                    </div>
                }
            </div>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        checkouts: state.customerReducer.checkouts,
        isCheckoutAdd: state.customerReducer.isCheckoutAdd,
        isCheckoutUpdate: state.customerReducer.isCheckoutUpdate,
        selectedBusiness: state.businessReducer.selectedBusiness
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(CheckoutActions, dispatch),
        showSnackbar: (message, error) => {
            dispatch(openGlobalSnackbar(message, error))
        }
    };
};


export default withRouter((connect(mapStateToProps, mapDispatchToProps)(Checkouts)))
