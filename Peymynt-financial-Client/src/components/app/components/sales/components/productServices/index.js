import history from "customHistory";
import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { NavLink, withRouter } from "react-router-dom";
import { Button, Table, Tooltip, Card, CardBody } from "reactstrap";
import { bindActionCreators } from "redux";
import { DeleteModal } from "utils/PopupModal/DeleteModal";
import * as ProductActions from "../../../../../../actions/productAction";
import CenterSpinner from "../../../../../../global/CenterSpinner";
import { toMoney } from "../../../../../../utils/GlobalFunctions";
import { NoDataMessage } from "../../../../../../global/NoDataMessage";

class ProductServices extends PureComponent {
  state = {
    openConfimationModal: false,
    selectedDeleteProduct: {},
    loading: false,
  };

  componentDidMount() {
    const { selectedBusiness } = this.props;
    let type = _.includes(this.props.location.pathname, 'sales') ? 'sell' : 'buy';
    document.title = selectedBusiness && selectedBusiness.organizationName ? `Peymynt - ${selectedBusiness.organizationName} - Products & Services` : `Peymynt - Products & Services`;
    this.fetchProducts(type)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.url !== nextProps.url) {
      let type = _.includes(nextProps.location.pathname, 'sales') ? 'sell' : 'buy';
      this.fetchProducts(type)
    }
  }

  fetchProducts = (type) => {
    setTimeout(this.setState({ loading: true }), 300);
    this.props.actions.fetchProducts(type)
      .then(result => {
        if (result) {
          setTimeout(() => {
            this.props.actions.resetAddProduct();
          }, 2000)
        }
        this.setState({ loading: false })
      });
  };

  onDeleteConfirmation = (event, item) => {
    this.setState({
      openConfimationModal: true,
      selectedDeleteProduct: item
    });
  };

  onCloseModal = () => {
    this.setState({
      openConfimationModal: false,
      selectedDeleteProduct: {}
    });
  };

  onEditProduct = (event, id) => {
    event.preventDefault();
    history.push(`${this.props.url}/products/edit/${id}`)
  };

  onDeleteCall = () => {
    const { selectedDeleteProduct } = this.state;
    this.deleteProduct(selectedDeleteProduct._id)
  };

  deleteProduct = async (id) => {
    // event.preventDefault();
    let type = _.includes(this.props.location.pathname, 'sales') ? 'sell' : 'buy';
    try {
      await this.props.actions.deleteProduct(id);
      this.fetchProducts(type);
      this.setState({ openConfimationModal: false })
    } catch (error) {
      console.error("----------delete product error", error)
    }
  };

  showSellAndBuyTag = (item) => {
    const isPurchase = this.props.location.pathname.includes('purchase');
    const text = isPurchase ? 'Buy & Sell' : 'Sell & Buy';
    if (item.sell.allowed && item.buy.allowed) {
      return <span className="badge badge-default">{text}</span>;
    }
    return null;
  };

  toggle = (id) => {
    const isOpen = this.state.tooltipOpen === id;
    this.setState({
      tooltipOpen: isOpen ? null : id,
    });
  };

  produtItems() {
    const { currency, products } = this.props;
    console.log("currency", currency);
    if (products) {
      return products.map((item, i) => {
        console.log("taxes", item.taxes);
        return (
          <tr className="py-table__row" key={i}>
            <td colSpan="10"
              className="py-table__cell text-break">{item.name} {this.showSellAndBuyTag(item)} {item.description && (
              <span className="py-text--hint">{item.description}</span>)}
            </td>
            <td colSpan="1" className="py-table__cell-amount">{currency}{toMoney(item.price)}
              {item.taxes && item.taxes.length ?
                <span className="py-text--hint">
                  {item.taxes.map((tax, i) => {
                    if (i === 0) {
                      return "+" + tax.abbreviation
                    } else {
                      return ', ' + tax.abbreviation
                    }
                  })}
                </span>
                : null}
            </td>
            <td colSpan="1" className="py-table__cell__action">
              <div className="py-table__cell__action__icons">
                <Tooltip placement="top" isOpen={this.state.tooltipOpen === `edit-${item._id}`}
                  target={`edit-${item._id}`}
                  toggle={() => this.toggle(`edit-${item._id}`)}>
                  Edit
                </Tooltip>
                <a
                  onClick={e => this.onEditProduct(e, item._id)}
                  href="javascript:void(0)"
                  id={`edit-${item._id}`}
                  className="py-table__action py-icon"
                >
                  <svg viewBox="0 0 20 20" id="edit" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M8.75 13.836L16.586 6 14 3.414 6.164 11.25l2.586 2.586zm-1.528 1.3l-2.358-2.358-.59 2.947 2.948-.59zm11.485-8.429l-10 10a1 1 0 0 1-.51.274l-5 1a1 1 0 0 1-1.178-1.177l1-5a1 1 0 0 1 .274-.511l10-10a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1 0 1.414z"></path>
                  </svg>
                </a>
                <Tooltip placement="top" isOpen={this.state.tooltipOpen === `delete-${item._id}`}
                  target={`delete-${item._id}`}
                  toggle={() => this.toggle(`delete-${item._id}`)}>
                  Delete
                </Tooltip>
                <a onClick={(e) => this.onDeleteConfirmation(e, item)} href="javascript:void(0)"
                  data-placement="top"
                  id={`delete-${item._id}`}
                  className="py-table__action py-table__action__danger py-icon"
                >
                  <svg viewBox="0 0 20 20" id="delete" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M5 4c0-1.496 1.397-3 3-3h4c1.603 0 3 1.504 3 3h2a1 1 0 0 1 0 2v10.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 3 16.5V6a1 1 0 1 1 0-2h2zm2 0h6c0-.423-.536-1-1-1H8c-.464 0-1 .577-1 1zM5 6v10.5a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5V6H5zm2 3a1 1 0 1 1 2 0v5a1 1 0 0 1-2 0V9zm4 0a1 1 0 1 1 2 0v4.8a1 1 0 0 1-2 0V9z"></path>
                  </svg>
                </a>
              </div>
            </td>
          </tr>
        );
      });
    }
  }

  render() {
    const { openConfimationModal, loading } = this.state;
    console.log("this.props", this.props);
    const type = _.includes(this.props.location.pathname, 'sales');
    return (
      <div className="content-wrapper__main">
        <header className="py-header--page">
          <div className="py-header--title">
            <h2
              className="py-heading--title">{`Products & Services (${_.includes(this.props.location.pathname, 'sales') ? 'Sales' : "Purchases"})`}</h2>
          </div>
          <div className="py-header--actions">
            <Button
              onClick={() => history.push(`${this.props.url}/products/add`)}
              className="btn btn-primary btn-rounded">
              Add a product or service
            </Button>
          </div>
        </header>
        <div className="content">
          <Card className="shadow-box  card-wizard">
            <CardBody>
              {
                loading ?
                  <CenterSpinner color="primary" size="md" className="loader" /> :
                this.props.products.length > 0 ? (
                  <Table className="py-table py-table__hover products-list py-table__v__center">
                    <thead className="py-table__header">
                    <tr className="py-table__row">
                      <th colSpan="10" className="py-table__cell">Name</th>
                      {/* <th width="400">Description</th> */}
                      <th colSpan="1" className="py-table__cell-amount">Price</th>
                      <th colSpan="1" className="py-table__cell__action">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                      this.produtItems()
                    }
                    </tbody>
                  </Table>
                ) : (
                  <NoDataMessage
                    title="products or service"
                    add={() => history.push(`${this.props.url}/products/add`)}
                    filter={false}
                    secondryMessage={`Add a new product or service ${type ? 'and use in invoices  and estimates' : 'for bills'}.`}
                  />
                  // <div className="text-center" style={{ marginTop: '10px' }}>
                  //   <div className="py-heading--section-title">
                  //     You do not have any products or services.
                  //   </div>
                  //   <NavLink to={`${this.props.url}/products/add`} className="btn btn-primary mr-2">
                  //     Add a product or service
                  //   </NavLink>
                  // </div>
                )}
              </CardBody>
            </Card>
          </div>

        <DeleteModal
          message={"Are you sure you want to delete this product?"}
          openModal={openConfimationModal}
          onDelete={this.onDeleteCall}
          onClose={this.onCloseModal}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    products: state.productReducer.products,
    currency: state.businessReducer.selectedBusiness.currency && state.businessReducer.selectedBusiness.currency.symbol || '',
    isProductAdd: state.productReducer.isProductAdd,
    isProductUpdate: state.productReducer.isProductUpdate,
    selectedBusiness: state.businessReducer.selectedBusiness
  };
};
const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(ProductActions, dispatch)
    // getProducts: () => {
    //     dispatch(ProductActions.fetchProducts())
    // }
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ProductServices)
);
