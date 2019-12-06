import { orderBy, uniqBy } from "lodash";
import moment from "moment";
import { toDollar, getDateMMddyyyy } from '../../../../../../utils/common';

export const mailMessage = (data, via, businessInfo) => {
	let subject = `${data.name}\ #${data.invoiceNumber} from ${
		businessInfo.organizationName
		}`;
	let message = `
  Below please find a link to ${data.name}\ #${data.invoiceNumber}.

  Amount due: ${(data.currency && data.currency.symbol) || ""} ${
		data.dueAmount
		}

  Expires on: ${moment(data.expiryDate).format("YYYY-MM-DD")}
  
  To view this invoice online, please visit: ${
		process.env.WEB_URL
		}/public/invoice/${data.uuid}
  `;
	if (via === "gmail") {
		return `https://mail.google.com/mail/u/0/?view=cm&&su=${escape(
			subject
		)}&&body=${escape(message)}`;
	} else if (via === "yahoo") {
		return `http://compose.mail.yahoo.com/?&&subj=${escape(
			subject
		)}&&body=${escape(message)}`;
	} else if (via === "outlook") {
		return `https://outlook.live.com/owa/?path=/mail/action/compose&subject=${escape(
			subject
		)}&body=${escape(message)}`;
	}
};

export const statementMailMessage = (data, statmentPublicUrl, via, businessInfo) => {
	let subject = `Statement of Account from ${
		businessInfo.organizationName
	}`;
	let message = `Please find a link to your Statement of Account (${getDateMMddyyyy(data.filter.endDate)} to ${getDateMMddyyyy(data.filter.startDate)}) below. This statement includes invoices in multiple currencies.

	Total USD due: ${toDollar(data.total.totalBalance)}

	To view this statement and related invoices, visit: ${statmentPublicUrl}`;
	  
	if (via === "gmail") {
		return `https://mail.google.com/mail/u/0/?view=cm&&su=${escape(
			subject
		)}&&body=${escape(message)}`;
	} else if (via === "yahoo") {
		return `http://compose.mail.yahoo.com/?&&subj=${escape(
			subject
		)}&&body=${escape(message)}`;
	} else if (via === "outlook") {
		return `https://outlook.live.com/owa/?path=/mail/action/compose&subject=${escape(
			subject
		)}&body=${escape(message)}`;
	}
};