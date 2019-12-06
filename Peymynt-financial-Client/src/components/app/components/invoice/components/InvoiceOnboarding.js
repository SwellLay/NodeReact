import React, { PureComponent, Fragment, Component } from "react";
import { withStyles } from '@material-ui/core/styles';
import { Button, Modal, ModalHeader, ModalBody, Card, ModalFooter, Container, Row, Col } from 'reactstrap';
import history from "../../../../../customHistory";


const styles = theme => ({
	introHeader: {
		textAlign: 'center',
	    width: '100%',
	    fontSize: '15px',
	    color: '#7f309c',
	    fontWeight: 'bold',
	    marginBottom: '16px'
	},
	header: {
		fontSize: '33px',
	    lineHeight: '24px',
	    fontWeight: '600',
	    textAlign: 'center',
	    marginBottom: '12px',
	    marginTop: '35px',
	    maxWidth: '100%',
	    marginLeft: 'auto',
	    marginRight: 'auto'
	},
	subHeader: {
	    marginBottom: '50px',
	    marginTop: '20px',
		color: '#718fa2',
		fontSize: '23px',
    	lineHeight: '18px',
	    textAlign: 'center',
	    width: '100%',
	    fontWeight: 'normal'
	},
	footerHead: {
	    textAlign: 'center',
	    fontWeight: '900',
    	fontSize: '13px'
	},
	footer: {
	    textAlign: 'center',
	    fontSize: '13px',
	    marginTop: '10px',
	    marginBottom: '50px'
	},
	next: {
		color: 'grey',
	    background: '#fff',
	    border: '1px solid transparent',
	    padding: '6px 20px',
		textAlign: 'center',
		minWidth: '100px',
		borderRadius: '500px',
		display: 'inline-block',
		boxSizing: 'border-box',
		verticalAlign: 'middle',
		outline: 0,
		'&:hover': {
			color: '#0b59b1',
	    	border: '1px solid #0b59b1',
	    	background: '#fff',
	    }
	},
	secFoot: {
		width: '100%',
	    color: '#718fa2',
	    fontSize: '23px',
	    lineHeight: '32px',
	    fontWeight: 'normal'
	},
	firFoot: {
		maxWidth: '500px',
    	marginLeft: 'auto',
    	marginRight: 'auto',
    	marginTop: '22px',
    	fontSize: '16px'
	},
	navBoxes: {
		borderRadius: '10px',
		padding: '1px 6px',
		fontSize: '16px',
	    marginRight: 'auto',
	    marginLeft: 'auto',
	    marginBottom: '30px',
	    background: 'none',
	    border: 0,
	    outline: 'none',
	    transition: 'all .3s',
	    boxShadow: '0px 0px 1px #000',
			maxWidth: '200px',
			width: '100%',
    	height: '270px',
		'&:hover': {
			transition: 'all .3s',
		    transform: 'translate3d(0,-2px,0)',
		    cursor: 'pointer',
	    	boxShadow: '0px 5px 10px #ece5e5'
	    }
	},
	navHeader: {
		fontSize: '17px',
	    lineHeight: '24px',
	    fontWeight: '600',
	    marginTop: '30px'
	},
	navBody: {
    	padding: '20px',
    	fontSize: '14px'
	}
});
class InvoiceOnboarding extends Component {

    render() {
		const { classes } = this.props;
        const { openModal } = this.props
        return (
            <Modal isOpen={openModal}  className="py-modal--large" centered>
                <ModalBody className="p-5">
									<header className="py-header text-center w-75 mx-auto py-header--page">
										<div className="py-header--title">
											<h2 className="h4">Heads up! Before you send this invoice, here are three tips to help you get paid on time.</h2>
										</div>
									</header>
                            <Row className="">
                                <Col md={4} className="d-flex">
                                    <a className="card card-body text-center" onClick={()=>{this.props.history.push('/app/invoices')}}>
                                        <div>
                                            <img src='/assets/images/invoices.png' className="py-icon--xlg mb-3"/>
                                        </div>
                                        <div>
                                            Your customers love having different ways to pay, so we've added online payments to your invoices*.
                                        </div>
                                    </a>
                                </Col>
                                <Col md={4} className="d-flex">
                                    <a className="card card-body text-center" onClick={()=>{this.props.history.push('/app/recurring')}}>
                                        <div>
                                            <img src='/assets/images/recuring.png'  className="py-icon--xlg mb-3" />
                                        </div>
                                        <div>
                                            Try automatic payment reminders and avoid those awkward conversations.
                                        </div>
                                    </a>
                                </Col>
                                <Col md={4} className="d-flex">
                                    <a className="card card-body text-center" onClick={()=>{this.props.history.push('/app/sales/checkout')}}>
                                        <div>
                                            <img src='/assets/images/checkout.png'  className="py-icon--xlg mb-3" />
                                        </div>
                                        <div>
                                            Track your overdue invoices and take action on your dashboard.
                                        </div>
                                    </a>
                                </Col>
                            </Row>

							<div className="my-4 d-flex justify-content-center">
									<button className="btn btn-primary" onClick={()=>history.push('/app/payments')}>
											Great, I'm ready
									</button>
							</div>

							<div className="py-notify py-notify--info py-notify--small">
								<div className="py-notify__icon-holder">
										<svg viewBox="0 0 20 20" className="py-icon" id="info" xmlns="http://www.w3.org/2000/svg"><path d="M10 19a9 9 0 1 1 0-18 9 9 0 0 1 0 18zm0-2a7 7 0 1 0 0-14 7 7 0 0 0 0 14zm0-11a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0 3a1 1 0 0 1 1 1v4a1 1 0 0 1-2 0v-4a1 1 0 0 1 1-1z"></path></svg>
									</div>
								<div className="py-notify__content-wrapper">
									<div className="py-notify__content">
									You're always in control. Change the payment methods you offer on each invoice at any time.
									</div>
								</div>
							</div>
                </ModalBody>
            </Modal>
        )
    }
}

export default withStyles(styles)(InvoiceOnboarding);
