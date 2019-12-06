import React from 'react';
import { PoweredByReciept } from '../../components/app/components/invoice/helpers';
import { PoweredBy } from '../../components/common/PoweredBy';

export const RecieptFooter = props => (
    <div className="poweredBy">
        {/* <span className="poweredLogo"></span> */}
        <PoweredByReciept />
    </div>
)