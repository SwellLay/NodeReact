import React, { Component } from "react";
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Radio, RadioGroup } from '@material-ui/core';
import { OverlayTrigger, Tooltip as Tip } from 'react-bootstrap';
import { Spinner } from 'reactstrap';

const styles = theme => ({
	header: {
		fontSize: '19px',
	    lineHeight: '24px',
	    fontWeight: '600',
	    textAlign: 'left',
	    marginBottom: '12px'
	},
	selection: {

	},
	selectedOptions: {
	    borderColor: '#9F55FF !important',
			borderRadius: '4px',
			marginBottom: '8px',
	    // padding: '24px'
	},
	selectOptions: {

	    margin: '0 auto 8px',
	    boxShadow: '0 0 0 1px #b2c2cd',
	    // borderRadius: '4px',
		// padding: '24px',
		padding: '16px',
	},
	selectOptionsMC: {
	    margin: '0 auto 8px',
	    boxShadow: '0 0 0 1px #b2c2cd',
	    borderRadius: '4px',
	    paddingTop: '7px',
	    paddingBottom: '7px',
			paddingLeft: '24px',
			marginBottom: '1rem',
	},
	selectedOptionsMC: {
	    margin: '0 auto 8px',
	    boxShadow: '0 0 0 2px #136acd',
	    borderRadius: '4px',
	    paddingTop: '7px',
	    paddingBottom: '7px',
			paddingLeft: '24px',
	},
	foot: {
		textAlign: 'right',
		marginTop: '24px'
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
	tooltipBody: {
		color: 'white',
		textSize:'14px',
		fontWeight: '600',
		padding: '8px 12px'

	},
	rootRadio: {
		background: '#1f7eea',
	    color: '#1f7eea',
	    '&$checked': {
	      color: '#1f7eea',
	    }
	},
	checkedRadio: {
		background: '#1f7eea'
	}
})

class BusinessType extends Component {

	state = {
		selected: null,
    	arrowRef: null,
    	llcTab : false,
    	formData: {}
	}

	componentDidMount(){
		this.setState({
			selected:this.props.data && this.props.data.businessType ? this.props.data.businessType : null
		})
	}

	handleArrowRef = node => {
	    this.setState({
	      arrowRef: node,
	    });
	  };

	onSelected = (type) => {
		if(type != 'single_member_llc' && type != 'multiple_member_llc')
			this.setState({selected: type, llcTab: false, formData: {...this.state.formData, businessType: ""}, llcTab: false});
		else
			this.setState({selected: type, formData: {...this.state.formData, businessType: ""}, llcTab: false});
	}

	onMouseEnter = () => {
		this.setState({
			llcTab: true
		})
	}

	onMouseExit = () => {
		if(this.state.selected != 'single_member_llc' && this.state.selected != 'multiple_member_llc') {
			this.setState({
				llcTab: false
			})
		}
	}

	onSubmit = () => {
		if(this.state.selected){
			this.props.onSubmit(this.state.selected);
		} else {
			this.props.onShowSnackbar('Business type is mandatory');
		}
	}

	onFormValChange = (key, value) => {
		let formData = this.state.formData ? this.state.formData : {};
		if(key.split('.').length > 1) {
			let keys = key.split('.');
			if(!formData[keys[0]])
				formData[keys[0]] = {};
			formData[keys[0]][keys[1]] = value;
		}
		else {
			formData[key] = value;
		}
		this.setState({formData: formData});
	}

	getTooltip = (section) => {
		const { classes } = this.props;
		switch(section) {
			case 1://'Sole Proprietorship':
			return (
					<div className={classes.tooltipBody}>
						You are the sole owner of the business
						and claim all profit and losses on your
						personal income tax return. Even if you
						didn't register a business with the
						government, this is you.
					</div>
				)
			case 2://'Limited Liability Corporation (LLC)':
			return (
					<div className={classes.tooltipBody}>
						Your company will likely have LLC or
						Limited Company at the end of its name.
						You are a Single Member LLC if you are the
						only member/owner, otherwise you are a
						Multiple Member LLC.
					</div>
				)
			case 3://'Corporation':
			return (
					<div className={classes.tooltipBody}>
						You are a registered C Corporation
 						or S Corporation.
					</div>
				)
			case 4://Partnership':
			return (
					<div className={classes.tooltipBody}>
						You share the profit and losses with one
						or more partners and are not incorporated.
					</div>
				)
			case 5://'Non-Profit':
			return (
					<div className={classes.tooltipBody}>
						You are a registered charity or a
						501(c) tax exempt organization.
					</div>
				)
			default:
			return (
					<div className={classes.tooltipBody}>
						Unknown
					</div>
				)
		}
	}

	TooltipContainer = (props) => {
		let placement = 'left';
		return (
			<OverlayTrigger
			      placement={placement}
			      overlay={
			        <Tip>
			        	{
			        		this.getTooltip(props.tooltipIndex)
			        	}
			        </Tip>
			      }
			    >
			    {props.children}
			</OverlayTrigger>
			)
	}

	render () {
		const { classes, loading } = this.props;
		const { selected, formData } = this.state;
		const { TooltipContainer } = this;
		return (
			<div>
				<header className="py-header py-header--page">
					<div className="py-header--title">
					<div className="h3 mb-3"> Choose Your Business Type</div>
					</div>
				</header>

				{/* <div className={classes.selection} style={{textAlign: 'left'}}> */}
				<div className="payment__onboard__business__type__list" style={{textAlign: 'left'}}>
					<TooltipContainer tooltipIndex={1}>
						<div className={(selected == 'sole_proprietorship') ? classes.selectedOptions : classes.selectOptions} onClick={()=>{this.onSelected('sole_proprietorship')}}>Sole Proprietorship</div>
					</TooltipContainer>
					<TooltipContainer tooltipIndex={2}>
					{
						(!this.state.llcTab && !formData.businessType ) ? (<div onMouseEnter={this.onMouseEnter} className={classes.selectOptions}>Limited Liability Corporation (LLC)</div>) :
						(<div onMouseLeave={this.onMouseExit} className={(selected == 'single_member_llc' || selected == 'multiple_member_llc') ? classes.selectedOptionsMC : classes.selectOptionsMC}>
					            <RadioGroup
						            value={formData.businessType ? formData.businessType : ''}
						            onChange={(e)=>{
						            	this.onFormValChange('businessType', e.target.value)
						            }}>
					            	<FormControlLabel style={{marginTop: '-10px',marginBottom: '-10px'}} value="single_member_llc" control={<Radio color='primary' classes={{ root: classes.root, checked: classes.checked}} />} label="Single Member LLC"  onClick={()=>{this.onSelected('Single Member LLC')}}  className="py-brand--type"/>
					            	<FormControlLabel style={{marginTop: '-10px',marginBottom: '-10px'}} value="multiple_member_llc" control={<Radio color='primary' classes={{ root: classes.root, checked: classes.checked}} />} label="Multiple Member LLC"  onClick={()=>{this.onSelected('Multiple Member LLC')}} className="py-brand--type" />
								</RadioGroup>
						</div>)
					}
					</TooltipContainer>

					<TooltipContainer tooltipIndex={3}>
						<div className={(selected == 'corporation') ? classes.selectedOptions : classes.selectOptions} onClick={()=>{this.onSelected('corporation')}}>Corporation</div>
					</TooltipContainer>

					<TooltipContainer tooltipIndex={4}>
						<div className={(selected == 'partnership') ? classes.selectedOptions : classes.selectOptions} onClick={()=>{this.onSelected('partnership')}}>Partnership</div>
					</TooltipContainer>

					<TooltipContainer tooltipIndex={5}>
						<div className={(selected == 'non_profit') ? classes.selectedOptions : classes.selectOptions} onClick={()=>{this.onSelected('non_profit')}}>Non-Profit</div>
					</TooltipContainer>
				</div>
				<div className="d-flex align-items-center mt-4 justify-content-start">
					<button className="btn btn-primary"  onClick={this.onSubmit} disabled={loading}>
						Save and continue {loading && (<Spinner size="sm" color="light" />)}
					</button>
				</div>
			</div>
		)
	}
}

export default withStyles(styles)(BusinessType);