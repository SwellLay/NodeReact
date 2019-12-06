import React from 'react';
import { NavLink } from 'react-router-dom';
import { _documentTitle } from '../../utils/GlobalFunctions';

const Error400 = () => {
  _documentTitle({}, "404")
  return (
  <main>
    <div className="container-fluid error404Wrapper">
      <div className="height-100 errorRow align-items-center">
        <div className="col-md-4 mx-md-auto text-center">
          {/* <div className="center-xy color-6 alpha-5 bold" style={{ fontSize: "25rem", zIndex: -1 }}>404</div> */}
          <img src="/assets/404.svg" className="img-fluid mx-auto" alt="" style={{ width: '70%', verticalAlign: "middle" }} />
          <h2 className="bold text-danger mt-5">Page not found</h2>
          <p className="color-2">Sorry, we can't find the page you are looking for.</p>
          <NavLink to="/" className="btn btn-raised btn-lg btn-default">
            <i className="py-icon fas fa-long-arrow-alt-left"></i> Go Back to Home Page
          </NavLink>
        </div>
      </div>
    </div>
  </main>
  //  <div className="err-container text-center">
  //   <div className="err">
  //     <h2>404 Not Found</h2>
  //   </div>

  //   <div className="err-body">
  //     <NavLink to="/" className="btn btn-raised btn-lg btn-default">
  //       Go Back to Home Page
  //     </NavLink>
  //   </div>
  // </div>
)};

const Page = () => (
  // <div className="page-err">
  <div key="1">
    <Error400 />
  </div>
  // </div>
);

export default Page;
