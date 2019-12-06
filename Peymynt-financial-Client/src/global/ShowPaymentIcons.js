import React, { Fragment } from 'react';
import * as PaymentIcon from 'global/PaymentIcon';

export const ShowPaymentIcons = props => {
    console.log(props.icons);
    return (
        <Fragment>
            <div className={props.className}>
                {
                    props.icons && props.icons.length &&
                    props.icons.map((icon, i) => {
                        let iconUrl = process.env.WEB_URL.includes('localhost') ? !!PaymentIcon[icon] ? `/${PaymentIcon[icon]}` : `/assets/${icon}.svg` : (PaymentIcon[icon] || `/assets/${icon}.svg`);
                        return (
                            <img src={iconUrl} />
                        )
                    })
                }
            </div>
        </Fragment>
    )
}