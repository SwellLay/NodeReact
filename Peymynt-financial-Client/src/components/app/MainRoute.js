
import React from 'react'
import { Route } from 'react-router-dom'

import Layout from './Layout'
import {requireAuth } from 'client'
import { connect } from 'react-redux';

const MainRoute = ({ component: Component, ...rest, params }) => {
  return (
    <Route {...rest} render={
      requireAuth(rest.state) ? 
      matchProps => (
      <Layout>
        <Component {...matchProps} params={params} url={rest.url}/>
      </Layout>
    ) 
     : ''
  } />
  )
};

const mapStateToProps = state => {
  return {
      state : state
  };
};

export default  connect(mapStateToProps,null)(MainRoute)