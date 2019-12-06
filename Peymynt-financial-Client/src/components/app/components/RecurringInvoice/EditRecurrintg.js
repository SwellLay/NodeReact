import React from 'react';
import RecurringInvoiceForm from './RecurringInvoiceForm';
import { getRecurringInvoice } from '../../../../api/RecurringService';
import CreateRecurring from './CreateRecurring';

class EditRecurring extends React.Component{
    state = {
        invoiceData: undefined
    }

    componentDidMount() {
        const id = this.props.match.params.id
        this.fetchRecurrungInvoiceInfo(id)
    }

    fetchRecurrungInvoiceInfo = async (id) => {
        try {
            let response = await getRecurringInvoice(id);
            if (response.statusCode === 200) {
                this.setState({ invoiceData: response.data.invoice })
            } else {
                this.props.showSnackbar("Seems this recurring invoice doesn't exist", false)
                this.props.history('/app/recurring')
            }
        } catch (error) {
            console.error('-----------error-----------', error)
            this.props.showSnackbar('Something went wrong', true)
        }

    }
    
    render(){
        const { invoiceData } = this.state
        return (
            <CreateRecurring invoiceData={invoiceData} isEditMode={true}/>
        )
    }
}

export default EditRecurring