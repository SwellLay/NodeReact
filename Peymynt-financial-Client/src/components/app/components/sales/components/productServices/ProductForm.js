import history from "customHistory";
import { cloneDeep } from "lodash";
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Button, Form, Input, Label, ModalFooter } from "reactstrap";
import { bindActionCreators } from "redux";
import * as ProductActions from "../../../../../../actions/productAction";
import { openGlobalSnackbar } from "../../../../../../actions/snackBarAction";
import taxServices from "../../../../../../api/TaxServices";
import { ValidationMessages } from "../../../../../../global/ErrorBoxes/Message";
import { changePriceFormat } from "../../../../../../utils/GlobalFunctions";
import { CreateAccountModal } from "../supportComponent/CreateAccountModal";
import Taxes from "../Taxes";

import { IncomeTab } from "./IncomeConstant";

const initialProduct = (state, isEditMode) => {
  let data = {
    id: (state && state._id) || "",
    userId: (state && state.userId) || localStorage.getItem("user.id"),
    businessId: (state && state.businessId) || localStorage.getItem("businessId"),
    name: (state && state.name) || "",
    description: (state && state.description) || "",
    price: parseFloat((state && state.price) || 0).toFixed(2),
    buy: state
      ? state.buy
      : {
        allowed: false
      },
    sell: state
      ? state.sell
      : {
        allowed: false
      },
    taxes: (state && state.taxes) || []
  };
  if (!isEditMode) {
    delete data.id;
  }
  return data;
};

class ProductForm extends Component {
  state = {
    taxList: [],
    modal: false,
    errorMessage: "",
    activeTab: "3",
    collapse: false,
    addNewIncome: IncomeTab,
    productModel: initialProduct(),
    typeError: false
  };

  componentDidMount() {
    const { isEditMode, selectedProduct, errorMessage } = this.props;
    const onSelect = isEditMode
      ? selectedProduct
      : null;
    const formatedData = initialProduct(onSelect, isEditMode);
    // if(isEditMode){   this.setState({     productModel: {
    // ...this.state.productModel, price: parseFloat(formatedData.price).toFixed(2)
    // }   }) }
    this.fetchtaxList();
    this.setState({ productModel: formatedData });
  }

  componentDidUpdate(prevProps) {
    const { isEditMode, selectedProduct } = this.props;
    if (prevProps.selectedProduct != selectedProduct) {
      const onSelect = isEditMode
        ? selectedProduct
        : null;
      const formatedData = initialProduct(onSelect, isEditMode);
      this.setState({ productModel: formatedData });
    }
  }

  fetchtaxList = async () => {
    const response = (await taxServices.fetchTaxes()).data.taxes;
    this.setState({ taxList: response });
  };

  handleModalToggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  };

  handleTabToggle = tab => {
    if (this.state.activeTab !== tab) {
      this.setState({ activeTab: tab });
    }
  };

  handleText = event => {
    const target = event.target;
    const { name, value } = event.target;
    let modal = this.state.productModel;
    if (target.type === "checkbox") {
      if (name === "sell") {
        modal.sell.allowed = !modal.sell.allowed;
        modal.sell.account = "";
      } else {
        modal.buy.allowed = !modal.buy.allowed;
        modal.buy.account = "";
      }
      this.setState({ productModel: modal, typeError: false });
    } else if (name === "taxes") {
      modal
        .taxes
        .push(value);
    } else {
      this.setState({
        productModel: {
          ...this.state.productModel,
          [name]: value
        }
      });
    }
  };

  handleCollapseToggle = (item, type, subTitle) => {
    let updateData = this
      .state
      .addNewIncome
      .map(list => {
        if (list.title === item.title && type === "mainList") {
          list.incomeShowMore = !list.incomeShowMore;
        } else if (list.title === item.title && type === "subList") {
          list
            .content
            .map(contentList => {
              if (contentList.title === subTitle) {
                contentList.showMore = !contentList.showMore;
              }
              return contentList;
            });
        }
        return list;
      });
    this.setState({
      addNewIncome: updateData
      // collapse: !this.state.collapse
    });
  };

  handleValidation = e => {
    // e.preventDefault();
    if (!this.state.productModel.sell.allowed && !this.state.productModel.buy.allowed) {
      this.setState({ typeError: true })
    }
  };

  productFormSumbit = event => {
    event.preventDefault();
    let productObj = cloneDeep(this.state.productModel);
    let pId = productObj.id;
    delete productObj.id;
    productObj.price = changePriceFormat(productObj.price, 2);
    let payload = {
      productInput: {
        ...productObj
      }
    };
    if (!this.props.flag) {
      if (this.state.productModel.sell.allowed || this.state.productModel.buy.allowed) {
        this.saveProduct(payload, pId);
      } else {
        this.setState({ typeError: true })
      }
    } else {
      if (this.props.buyOnly) {
        payload.productInput.buy = {
          allowed: true
        };
      } else {
        payload.productInput.sell = {
          allowed: true
        };
      }
      this.saveProduct(payload, pId);
    }
  };

  saveProduct = async (payload, productId) => {
    const { isEditMode, flag, updateList } = this.props;
    const isPurchase = this.props.location.pathname.includes('purchase');
    if (this.state.typeError) {
      return;
    }
    let response;
    try {
      if (isEditMode) {
        response = await this
          .props
          .actions
          .updateProduct(productId, payload);
        console.log('res', response);
        if (response.error) {
          this
            .props
            .showSnackbar(response.message, true);
        } else {
          this
            .props
            .showSnackbar('Product edit successfully.', false);
          if (!flag) {
            if (!isPurchase) {
              history.push("/app/sales/products");
            } else {
              history.push("/app/purchase/products");
            }
          }
        }
      } else {
        response = await this
          .props
          .actions
          .addProduct(payload);
        if (response.error) {
          this
            .props
            .showSnackbar(response.message, true);
        } else {
          this
            .props
            .showSnackbar('Product added successfully.', false);
          if (!flag) {
            if (!isPurchase) {
              history.push("/app/sales/products");
            } else {
              history.push("/app/purchase/products");
            }
          }
        }
      }
      if (flag) {
        const prodData = {
          item: response._id,
          name: response.name,
          description: response.description,
          quantity: 1,
          price: response.price,
          taxes: response.taxes
        };
        updateList(prodData);
      }
    } catch (error) {
      console.error("------------error in save product call", error);
      this
        .props
        .showSnackbar("Something went wrong, please try again later.", true);
    }
  };

  handleSelectChange = selectedOption => {
    let productModel = this.state.productModel;
    let selectedTax = selectedOption.map(item => {
      return item.value;
    });
    productModel.taxes = selectedTax;
    this.setState({ productModel });
  };

  _handleParseDecimal(e) {
    const { name, value } = e.target;
    console.log("in decimal", typeof e.target.value);
    if (!!value) {
      this.setState({
        productModel: {
          ...this.state.productModel,
          [name]: parseFloat(value).toFixed(2)
        }
      })
    } else {
      this.setState({
        productModel: {
          ...this.state.productModel,
          [name]: parseFloat(0.00).toFixed(2)
        }
      })
    }
  }

  render() {
    const { isEditMode, flag } = this.props;
    const {
      activeTab,
      taxList,
      modal,
      addNewIncome,
      productModel,
      typeError
    } = this.state;
    return (
      <Fragment>
        {typeError
          ? <ValidationMessages
            title={"Oops! Something isn't right."}
            messages={[{
              heading: '',
              message: 'Please indicate whether you will be buying or selling this product or both.'
            }
            ]}
            id={'productValMsg'}
            className={"inner-alert err color-red"} />
          : null
        }
        <Form onSubmit={this.productFormSumbit} className="productServices-form">
          <div className="py-form-field py-form-field--inline">
            <Label for="exampleEmail" className="py-form-field__label is-required">
              Name
            </Label>
            <div className="py-form-field__element">
              <Input
                required
                type="text"
                name="name"
                className="py-form__element__medium"
                value={productModel.name}
                onChange={this.handleText}
                maxLength={300}
                onInvalid={e => e
                  .target
                  .setCustomValidity('This field is required')}
                onInput={e => e
                  .target
                  .setCustomValidity('')} />
            </div>
          </div>
          <div className="py-form-field py-form-field--inline">
            <Label for="exampleText" className="py-form-field__label">
              Description
            </Label>
            <div className="py-form-field__element">
                            <textarea
                              type="textarea"
                              rows={4}
                              className="py-form__element__medium form-control"
                              name="description"
                              spellCheck={false}
                              value={productModel.description}
                              onChange={this.handleText}
                              maxLength={'300'} />
            </div>
          </div>
          <div className="py-form-field py-form-field--inline">
            <Label for="exampleEmail" className="py-form-field__label">
              Price
            </Label>
            <div className="py-form-field__element">
              <Input
                type="text"
                name="price"
                className="py-form__element__medium"
                value={productModel.price}
                onChange={this.handleText}
                maxLength={12}
                id={'price'}
                autoComplete={'off'}
                onBlur={this
                  ._handleParseDecimal
                  .bind(this)}
                required />
            </div>
          </div>
          {!flag && (
            <Fragment>
              <div className="py-form-field py-form-field--inline">
                <Label for="exampleEmail" className="py-form-field__label">Sell this</Label>
                <div className="py-form-field__element">
                  <Label className="py-checkbox">
                    <Input
                      name="sell"
                      type="checkbox"
                      checked={productModel.sell && productModel.sell.allowed}
                      value={productModel.sell && productModel.sell.allowed}
                      onChange={this.handleText} />{' '}
                    <span className="py-form__element__faux"></span>
                    <span className="py-form__element__label">Add to Invoices.</span>
                  </Label>
                </div>
              </div>
              <div className="py-form-field py-form-field--inline">
                <Label for="exampleEmail" className="py-form-field__label">Buy this</Label>
                <div className="py-form-field__element">

                  <Label className="py-checkbox">
                    <Input
                      name="buy"
                      type="checkbox"
                      checked={productModel.buy && productModel.buy.allowed}
                      value={productModel.buy && productModel.buy.allowed}
                      onChange={this.handleText} />{' '}
                    <span className="py-form__element__faux"></span>
                    <div className="py-form__element__label">Add to Bills.</div>
                  </Label>
                </div>
              </div>

              <div className="py-form-field py-form-field--inline">
                <Label for="exampleEmail" className="py-form-field__label">
                  Sales Tax
                </Label>
                <div className="py-form-field__element">
                  <Taxes
                    taxList={taxList}
                    taxValue={productModel}
                    isEditMode={isEditMode}
                    fetchtaxList={this.fetchtaxList}
                    onChange={this.handleSelectChange} />
                </div>
              </div>
              <div className="py-form-field py-form-field--inline">
                <div className="py-form-field__blank"></div>
                <div className="py-form-field__element">
                  <Button
                    type="submit"
                    color="grey"
                    className="btn btn-primary btn-rounded"
                    onClick={this
                      .handleValidation
                      .bind(this)}>
                    Save
                  </Button>{" "} {flag && (
                  <div>
                    <span className="pdL5 pdR5">or</span>
                    <Button onClick={this.props.onClose} className="btn btn-secondary btn-rounded">
                      Cancel
                    </Button>
                  </div>
                )}
                </div>
              </div>
            </Fragment>
          )}
          {_.includes(this.props.location.pathname, 'products')
            ? ""
            : (
              <ModalFooter
                className="pd-r-0"
                style={{
                  paddingRight: '0px'
                }}>
                <Button onClick={this.props.onClose} className="btn-outline-primary">
                  Cancel
                </Button>

                {flag && (
                  <Fragment>
                    <Button type="submit" className="btn-primary">
                      Add product
                    </Button>

                  </Fragment>
                )}
              </ModalFooter>
            )
          }
        </Form>

        <CreateAccountModal
          modal={modal}
          activeTab={activeTab}
          addNewIncome={addNewIncome}
          tabToggle={this.handleTabToggle}
          toggleModal={this.handleModalToggle}
          collapseToggle={this.handleCollapseToggle} />
      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  return { selectedProduct: state.productReducer.selectedProduct, errorMessage: state.productReducer.errorMessage };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(ProductActions, dispatch),
    showSnackbar: (message, error) => {
      dispatch(openGlobalSnackbar(message, error));
    }
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProductForm));
