import React, { Component } from "react";
import { connect } from "react-redux";
import { closeGlobalSnackbar } from "../actions/snackBarAction";

class SnakeBar extends Component {
    state = {
        showSnackbar: false
    }

    componentDidMount() {
        console.log("yes in snakebar")
        const { onClose, duration } = this.props
        setTimeout(() => {
            onClose()
        }, duration);
    }

    componentDidUpdate(prevProps) {
        console.log("yes in snakebar update")
        const { onClose, opensnack, duration } = this.props
        if (opensnack != prevProps.opensnack) {
            setTimeout(() => {
                onClose()
            }, duration);
        }
    }

    render() {
        const { message, opensnack, error, isAuth = true } = this.props
        const snakebar = opensnack ?
            <div className="alert-box alert-fixed"> <div className={`alert ${error ? 'alert-danger' : 'alert-success'}`} >
                {message}
                {/* <span className={`${error ? 'far fa-times-circle' : 'far fa-check-circle'}`} onClick={()=>this.props.onClose()} ></span>  */}
                <span className="close" onClick={()=>this.props.onClose()} >
                </span> 
                {/* style={{border:`1px solid ${ error? `#721c24` : `#721c24`}`}} > */}
            </ div>  </div> : null
        return (snakebar)
    }
}

const mapPropsToState = state => ({
    opensnack: state.snackbar.open,
    duration: state.snackbar.duration,
    error: state.snackbar.error,
    message: state.snackbar.message,
})

const mapDispatchToProps = dispatch => ({
    onClose: () => {
        dispatch(closeGlobalSnackbar())
    }
})

export default connect(mapPropsToState, mapDispatchToProps)(SnakeBar);