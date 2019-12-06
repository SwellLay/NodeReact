import React, { PureComponent } from 'react'
import EstimateForm from './EstimateForm';
import { fetchEstimateById } from '../../../../../api/EstimateServices';
import _ from 'lodash';
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

class EditEstimate extends PureComponent {
    state = {
        selectedEstimate: undefined,
        isDuplicate: false
    }
    componentDidMount(){
        const { businessInfo } = this.props;
        if(_.includes(this.props.location.search, 'duplicate=true')){
            this.setState({isDuplicate: true})
        }
        document.title = businessInfo && businessInfo.organizationName ? `Peymynt - ${businessInfo.organizationName} - Estimate` : `Peymynt - Estimate`;
        this.fetchEstimateData(_.includes(this.props.location.search, 'duplicate=true'))
    }

    fetchEstimateData= async(isDuplicate)=>{
        const estimateID = this.props.match.params.id
        let response = await fetchEstimateById(estimateID)
        if(response.statusCode=== 200){
            let selectedEstimate = response.data.estimate;
            if(isDuplicate){
                selectedEstimate.estimateDate = new Date();
                selectedEstimate.expiryDate = new Date();
            }
            console.log("isDuplicate", isDuplicate, selectedEstimate)
            this.setState({
                selectedEstimate
            })
        }
    }

    render(){
    const {selectedEstimate, isDuplicate} = this.state
    console.log('selected', selectedEstimate)
        return(
            <EstimateForm
            isEditMode={true}
            selectedEstimate={selectedEstimate}
            isDuplicate={isDuplicate}
            />
        )
    }
}

const mapPropsToState = state => ({
    userSettings: state.settings.userSettings,
    businessInfo: state.businessReducer.selectedBusiness
})

export default withRouter(connect(mapPropsToState, null)(EditEstimate));