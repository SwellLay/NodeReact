import React, { PureComponent } from "react";
import { Container, Row, Col } from 'react-bootstrap';
import * as PaymentIcon from 'global/PaymentIcon';

const style = {
	name: {
		fontSize: '17px'
	},
	number: {
		fontSize: '17px'
	},
	valid: {
		fontSize: '10px'
	},
	card: {
		boxShadow: '0 0 20px rgba(#000, 0.2)',
		color: 'fff',
	},
	default: {
		background: 'url("https://dmrokfxvkn5v8.cloudfront.net/12.2.0/images/cc--background-lines.png") center center no-repeat,linear-gradient(to bottom left, #008ecd, #aa884b)'
	},
	bank: {
		background: 'linear-gradient(to bottom right, #000428, #004e92)'
	},
	unknown: {
		background: 'url("https://dmrokfxvkn5v8.cloudfront.net/12.2.0/images/cc--background-lines.png") center center no-repeat,linear-gradient(to bottom left, #bdc3c7, #2c3e50)'
	},
	amex: {
		background: 'url("https://dmrokfxvkn5v8.cloudfront.net/12.2.0/images/cc--background-lines.png") center center no-repeat,linear-gradient(to bottom left, #d5a124, #c8462e)'
	},
	dankort: {
		background: 'url("https://dmrokfxvkn5v8.cloudfront.net/12.2.0/images/cc--background-lines.png") center center no-repeat,linear-gradient(to bottom left, #008ecd, #aa884b)'
	},
	diners: {
		background: 'url("https://dmrokfxvkn5v8.cloudfront.net/12.2.0/images/cc--background-lines.png") center center no-repeat,linear-gradient(to bottom left, #7b4397, #dc2430)'
	},
	discover: {
		background: 'url("https://dmrokfxvkn5v8.cloudfront.net/12.2.0/images/cc--background-lines.png") center center no-repeat,linear-gradient(to bottom left, #2193b0, #6dd5ed)'
	},
	mastercard: {
		background: 'url("https://dmrokfxvkn5v8.cloudfront.net/12.2.0/images/cc--background-lines.png") center center no-repeat,linear-gradient(to bottom left, #1f4037, #99f2c8)'
	},
	visa: {
		background: 'url("https://dmrokfxvkn5v8.cloudfront.net/12.2.0/images/cc--background-lines.png") center center no-repeat,linear-gradient(to bottom left, #ffd89b, #19547b)'
	},
	elo: {
		background: 'url("https://dmrokfxvkn5v8.cloudfront.net/12.2.0/images/cc--background-lines.png") center center no-repeat,linear-gradient(to bottom left, #008ecd, #aa884b)'
	},
	hipercard: {
		background: 'url("https://dmrokfxvkn5v8.cloudfront.net/12.2.0/images/cc--background-lines.png") center center no-repeat,linear-gradient(to bottom left, #008ecd, #aa884b)'
	},
	jcb: {
		background: 'url("https://dmrokfxvkn5v8.cloudfront.net/12.2.0/images/cc--background-lines.png") center center no-repeat,linear-gradient(to bottom left, #42275a, #734b6d)'
	},
	unionpay: {
		background: 'url("https://dmrokfxvkn5v8.cloudfront.net/12.2.0/images/cc--background-lines.png") center center no-repeat,linear-gradient(to bottom left, #3a1c71, #d76d77, #ffaf7b)'
	}
}

class PaymentCards extends PureComponent {

	render() {
		const { issuer, number, name, method } = this.props;
		const icon =PaymentIcon[issuer] ? PaymentIcon[issuer] : issuer;
		console.log("issues", issuer, "icon", icon, "paymentIcon", PaymentIcon)

		return(
			<div className="py-payment-card" style={{
				background: style[issuer] ? style[issuer].background : style.unknown.background
			}}>
				<div className="py-payment-card--details">
					<div className="py-payment-card--number">
						<span>****</span>
						<span>****</span>
						<span>****</span>
						<span>{number}</span>
					</div>
					<div className="py-payment-card--name-date">
						<div className="cardName">
							{ name }
						</div>
						{
							issuer !== 'bank' && (
								<div className="cardExpiry">
									{!!method && `${method.expiryMonth ? method.expiryMonth : ""}${method.expiryYear ? "/" + method.expiryYear : ""}`}
								</div>
							)
						}
						<div className="py-payment-card--logo">
							<img src={process.env.WEB_URL.includes('localhost') ? `/${icon}` : icon} width= '35px' />
						</div>
					</div>
				</div>

			</div>
		)
	}
}

export default PaymentCards;