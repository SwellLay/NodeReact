import React, { Component } from "react";
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom'

const styles = theme => ({
	header: {
		fontSize: '19px',
	    lineHeight: '24px',
	    fontWeight: '600',
	    textAlign: 'center',
	    marginBottom: '12px',
	    marginTop: '40px',
	    maxWidth: '350px',
	    marginLeft: 'auto',
	    marginRight: 'auto'
	},
	subHeader: {
	    marginBottom: '30px',
	    marginTop: '20px',
		color: '#687578',
		fontSize: '14px',
    	lineHeight: '18px',
	    textAlign: 'center'
	},
	next: {
		color: '#fff',
	    background: '#136acd',
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
	    	background: '#0b59b1',
	    }
	},
	foot: {
		textAlign: 'center',
		marginTop: '24px'
	}
})
class Success extends Component {
	render () {
		const {classes} = this.props;
		return (
			<div className="text-center">
				<img src = "/assets/images/final-step.png" />
				<div className={classes.header}> Your customers can now pay you online. </div>
				<div className={classes.subHeader}>And they'll love you for it.</div>
				<div className={classes.foot}>
					<Button variant="contained" component={Link} to="/app/invoices" className={classes.next} onClick={this.props.onSubmit}>
						Create a new invoce
					</Button>
				</div>
			</div>
		)
	}
}

export default withStyles(styles)(Success);