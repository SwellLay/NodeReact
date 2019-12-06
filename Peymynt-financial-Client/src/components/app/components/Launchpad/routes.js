import MainRoute from 'components/app/MainRoute'
import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Switch } from 'react-router-dom'
import { _documentTitle } from '../../../../utils/GlobalFunctions';
import ContentPage from './components/ContentPage';
import LandingPage from './components/LandingPage';

class LaunchpadRoutes extends Component {
  componentDidMount() {
    _documentTitle(this.props.businessInfo);
  }

  render() {
    const { url } = this.props;
    return (
      <Switch>
        <MainRoute exact path={`${url}`} component={LandingPage} url={url} />
        <MainRoute exact path={`${url}/:id`} component={ContentPage} url={url} />
      </Switch>
    );
  }
}

const mapStateToProps = state => ({
  businessInfo: state.businessReducer.selectedBusiness,
});

export default connect(mapStateToProps)(LaunchpadRoutes)
