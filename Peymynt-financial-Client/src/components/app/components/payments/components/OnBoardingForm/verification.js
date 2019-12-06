import React, { Component } from "react";
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
	header: {
		fontSize: '20px',
	    lineHeight: '24px',
	    fontWeight: '700',
	    textAlign: 'center',
	    marginBottom: '14px',
	    marginTop: '40px',
	    maxWidth: '400px',
	    marginLeft: 'auto',
	    marginRight: 'auto'
	},
	subHeader: {
	    marginBottom: '50px',
	    marginTop: '20px',
		color: '#687578',
		fontSize: '14px',
    	lineHeight: '18px',
	    textAlign: 'center'
	},
	footerHead: {
	    textAlign: 'center',
	    fontWeight: '900',
    	fontSize: '14px'
	},
	footer: {
	    textAlign: 'center',
	    fontSize: '13px',
	    marginTop: '10px',
	    marginBottom: '50px'
	}
})
class Verification extends Component {

	componentDidMount(){
		this.props.onSubmit({});
	}

	render () {
		const {classes} = this.props;
		return (
			<div className="text-center">
				<img src = "/assets/images/final-step.png" />
				<div className="py-heading--section-title"> Hang tight. Your identity is being verified. </div>
				<div className="py-heading--subtitle mb-2">This may take a few minutes</div>
				{/* <h5>What's happening right now?</h5> */}
				<div>We verify the identity of all Payments customers to ensure a safe and secure environemt for everyone. No bad guys allowed.</div>
			</div>
		)
	}


}

export default withStyles(styles)(Verification);