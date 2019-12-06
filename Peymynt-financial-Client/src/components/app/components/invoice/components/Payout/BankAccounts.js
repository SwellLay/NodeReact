import React, { Component, Fragment } from 'react'
import { Col, Form, FormGroup, InputGroup, Label, InputGroupAddon, Input, FormText, Spinner, Row } from 'reactstrap'
import { _institutionLists } from '../../helpers';
import SelectBox from '../../../../../../utils/formWrapper/SelectBox';
import moment from 'moment';
import { toMoney, terms } from '../../../../../../utils/GlobalFunctions';
import PlaidLink from 'react-plaid-link/lib/PlaidLink';
import { AccountOption } from './AccountOption';
export default class BankAccounts extends Component {

    state = {
        accounts: [],
        amountPay: 0,
        selectedBank: null,
        signErr: false
    }
    componentDidMount(){
        const { accounts, invoiceData, logo, selectedBank } = this.props
        console.log('props', this.props)
        // let img = "iVBORw0KGgoAAAANSUhEUgAAAJgAAACYCAMAAAAvHNATAAAANlBMVEVHcEwOW6f///8IVqUPW6gQXKgRXKkPW6gTYKwPW6gbYqsxcbJ3ocza5vDs8/b0+Pmlwt1Vir96WNmQAAAACnRSTlMA////5HhLoCDGuAtrFAAABQNJREFUeNrt3H9vpCAQBuACIuC6wn7/L3vuXttb8UX5MdjJpVya3D9tngDiqDPz8dE67KiNcc4NgxDDsP7HGD3aj58cVhu3avAYnNE/wbOjSZredObauctCveGuWsAC1aet/6Ja7UTVcF1t1oiGYSxLVjdaO6sLjYZFT9OTIBuTpju2nCAdbmS2irTrOQ6iwxiaJ02LTqNtp9n07lJT7kjtNNtjGdUt3JfMMSvq5Uwvo3osMn+kZLXLaTDp9jyL7rJkBJGgGTKXeCw3teqKXH6VCTKZw/Pl/RM2y8KRnDNHcjk+t1YdTIZJUVycdsCX4rrlK2Fp2WBb11Hcnlu+FibvU/tq4nV8uaphXt5vrTJz4KqfMemTMtNyTny6GmBStsnwef99pLbA5JKSZdwDRnzH/j7qm2ByeSRkY9VBoaYgKWA+LTs9NNAFqUSQkmbG1t9PyFzNBguSDiZ9ItjQxRts42qHJWVj6QYLkhaWCtAOtpk5d5HAEjJTtJCxgQSWCNDG/CtyT6CB4QDNZV+RQEAEwzJ4ZdoJBazdYDBAm2zWzkcuOhgM0MD+t3kuQphHMns+YYlnRzoYDNDM6YS9Avy+MBig2bMJS7hoYUBmjifsK5DuDQNhkD2asLSLGuZ3MnMwYQcuahiYM5s+9NdA2l8G24WOOnWXVIfvcuhhcYDmEiv5HuBfA4vDIAtX8uXyJ7DHnXg88FoOyUAaw8REPjahLAwQg8yArSFL0b+/v5L8UYmA0aQD6RSs7zC7lVx3te8CU2dDgLW04A0FMWwKx2OO/qiNt1gnmLqdrUP0MWCMt1g32FJ2/Jv4sPg5mAwq3mRWsIDdp3iTaY4wHYVibGAmiizYwFx0o2QDe+5+wREmoliMD8xuQws+sHEb7vOB6e2DGx+Y4QtzPGHuF1YMG3jCBr4wwRMm+MJ+91gp7Pcc+29gv9FFKYxtoMg2tGb7MML28Y3vAy/bVwRsX6qwfQ3F9sUdk1edG9jA5+XwFmbi1+mKCWyMP0BkfO+7BGb3H98CB9gAvtRP890fjqUTbJn2H7m2eWPT7XjUfOLK+DLyPmMj/JAqSr6TkcHeM0OG/jU+2bDNBtHwY70iHxmwbe6FRekN6jETj+fH/RPY1uVwQsitrIAmK3XhBBZlhGicQnOSdtEBFmeq2FTSEbHsDBYnEpuDNK1wHczvknXtUWJbuG7GZnWcC7hN71HhKtiszrInzVY2XwML6jTf1J7kWHeBhdPcSZANOPvusH1as8lIacb5uZSwkJfSvLuVE8mSMJBsrfPS5svqTkthwOVyCw1IZBDmYQr4mFuaoRTBLR3PWGZqerKYhUAGYagK7qhmahT0MgSD1XljWcFUswzAoEuXlpg9AzRPCoNPgK6iKK8tQNvBYF3eeSXvKIhlMQzXC45VhZ+qJUCLYLhaUNeWyjYEaFsYdjUU8dbLtrC5wYVrzapDx3cYrmBsLRSf606Nd1irK1FoObfCoGsoa0YAa3mrArR/sADnq7SDCZYtDbDQuo5H12aF7AsG6xapWoSoCtknDNagVrnw+7zyYOMF87DdRXXvHtgep1D2Kn65IVdLtyN0cRbO2WvLT8Dl2vpD6TbZkuw/09zsCyynmkrec8IxEHT6svDqzH8zDK9GmrZt1Y3RUj1U6Do+Mm0lx7j5Ht92hYwbPDJuicm4iSjjtqucG9Vybu37vagMmyG/z12X9tF/APITr9CCbDsMAAAAAElFTkSuQmCC"

        // let test = [
        //     {id: '1', name: 'Chase', balances: {available: '100'}, mask: '4444', type: 'Checking'},
        //     {name: 'Chase', balances: {available: '100'}, mask: '4444', type: 'Checking'},
        //     {name: 'Chase', balances: {available: '100'}, mask: '4444', type: 'Checking'},
        //     {name: 'Chase', balances: {available: '100'}, mask: '4444', type: 'Checking'}
        // ]
        let arr = []
        !!accounts && accounts.map((item, i) => {
            arr = arr.concat({
                accountName: item.name,
                mask: item.mask,
                type: item.subtype,
                label: <AccountOption account={item} logo={logo}/>,
                id: item.account_id
            })
        })
        let selected = arr.find(item => {return selectedBank === item.id})
        this.setState({accounts: arr, selectedBank: selected, amountPay: invoiceData && parseFloat(invoiceData.dueAmount).toFixed(2)})
    }

    componentDidUpdate(prevProps){
        if(prevProps.selectedBank !== this.props.selectedBank){
            console.log('this.state.accounts', this.state.accounts, this.props.selectedBank)
        let selected = this.state.accounts.find(item => {return this.props.selectedBank === item.id})
        this.setState({selectedBank: selected})
        }
    }


    handleSubmit(e){
        e.preventDefault();
    }

    handlePayment(e){
        e.preventDefault();
        let { metadata, token, signature } = this.props;
        if(!!signature){
            this.props.proceedToPay(token, metadata)
        }else{
            this.setState({signErr: true})
        }
    }
    render() {
        const { accounts, amountPay, selectedBank, signErr } = this.state;
        const { invoiceData, paidAmount, handleOnSuccess, orgName, loading} = this.props
        console.log('selectedBank', selectedBank)
        return (
            <div className="bankAccounts-wrapper bankPayment-container">
                <Form onSubmit={this.handleSubmit.bind(this)}>
                    <Row>
                    <Col xs={9}>
                        <FormGroup className="text-left">
                            <Label for="selectAccount" className="mb-1 d-block">Select a bank acocunt</Label>
                            <SelectBox
                                autofocus={true}
                                // openOnFocus={true}
                                valueKey={"id"}
                                labelKey={"label"}
                                value={!!selectedBank ? selectedBank : undefined}
                                onChange={item => this.props.handleAccount(item)}
                                searchable={false}
                                options={accounts}
                                required
                            />
                            <FormText>
                                <PlaidLink
										clientName="Peymynt"
										env={process.env.PLAID_ENV}
                                        product={["auth"]}
                                        countryCodes={["GB", "CA", "FR", "ES", "US"]}
										publicKey={ process.env.PLAID_PUBLIC_KEY }
										onSuccess={(token, metadata) => handleOnSuccess(token, metadata)}
										style={{
											outline: 0,
											background: '#fff',
											border: 'none'
										}}
                                        className="plaid"
                                        type="button"
									>
                                    <span className="py-text--hint">Use a different bank</span>
                                </PlaidLink>
                            </FormText>
                        </FormGroup>
                    </Col>
                    <Col xs={3}>
                    <FormGroup className="text-left font-small">
                        <Label for="payAmount">Amount to pay</Label>
                        <InputGroup size="normal">
                            <InputGroupAddon addonType="prepend" className="prependAddon-input-card">
                                {invoiceData && invoiceData.currency && invoiceData.currency.symbol}
                            </InputGroupAddon>
                            <input
                                type="number"
                                step="any"
                                value={!!paidAmount ? paidAmount : invoiceData && parseFloat(invoiceData.dueAmount).toFixed(2)}
                                onChange={e => this.props.handleChange(e)}
                                name="paidAmount"
                                onBlur={(e) => this.props.setAmount(e)}
                                required
                                className="stripe-control form-control text-strong border-left-no accountAmount"
                            />
                        </InputGroup>
                    </FormGroup>
                    </Col>
                    </Row>

                    
                    <div xs={12} className="text-center">
                        <p>I authorize this payment to {orgName} on {moment().format('ll')} or thereafter. I agree with the <a href="javascript:void(0)" onClick={() => terms()} target="_blank" className="py-text--link-external">terms of use</a>.</p>
                    </div>
                        <FormGroup className="text-center" style={{maxWidth: '420px', margin: '0 auto 32px auto'}}>
                            <Input type="text" name="signature" id="signature"
                                autoComplete={'off'}
                                className="border-left-no border-right-no border-top-no text-center bankSign"
                                onChange={e => this.props.handleChange(e)}
                                placeholder="Enter your full name here"
                            ></Input>
                            {
                                signErr ?
                                <FormText><span className="err color-red">Please sign above</span></FormText>
                                : ""
                            }
                            <div className="mt-1">Account holder signature</div>
                        </FormGroup>


                        <button type="submit" className="btn btn-primary btn-block" onClick={this.handlePayment.bind(this)}>
                            <i className="fa fa-lock"/>&nbsp;{loading ? <Spinner size="sm" color="light" /> : `Pay ${`${invoiceData && invoiceData.currency && invoiceData.currency.symbol}${toMoney(!!paidAmount ? paidAmount : invoiceData && invoiceData.dueAmount)}`}`}
                        </button>
                </Form>
            </div>
        )
    }
}
