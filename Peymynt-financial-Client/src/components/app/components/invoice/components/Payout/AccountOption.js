import React from 'react';
import { toMoney } from '../../../../../../utils/GlobalFunctions';

export const AccountOption = ({account, logo}) => {
    return (
        <div className="d-flex align-items-center">
            <div className="mr-2 d-flex align-items-center">
                <img src={`data:image/png;base64,${logo}`} alt={account.name} style={{verticalAlign: 'middle', minWidth: '35px', minHeight: '35px', maxWidth:'35px', marginTop: '0'}}/>
            </div>  
            <div className="d-flex flex-column">
                            <div style={{lineHeight: '1.5'}}>{account.name} {account.type} (•••• {account.mask})</div>

                        <small className="py-text--hint" style={{lineHeight: '1'}}>Available balance {account.balances ? `${account.balances.iso_currency_code}${toMoney(account.balances.available)}` : 'NA'}</small>
            </div>
        </div>
    )
}