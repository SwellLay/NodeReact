import MobileHeader from 'global/MobileHeader'
import Sidebar from 'global/Sidebar'
import React from 'react';
import SnakeBar from '../../global/SnakeBar';
import SettingsSidebar from './components/setting/components/Sidebar';


class Layout extends React.Component {
  state = {
    open: false,
    addClass: false,
    layoutClass: '',
  };

  handleDrawerOpen = () => {
    this.setState(prevState => ({
      addClass: !prevState.addClass
    }));
  };

  handleDrawerClose = () => {
    this.setState({ open: false, addClass: false });
  };

  render() {
    const { children, location } = this.props;

    const { open, addClass } = this.state;
    let boxClass = ["main-app-container "];

    if (this.state.addClass) {
      boxClass.push('side-nav-collapsed');
    }

    let mainClass = ["bg-6", "pdB10", "main-content"];

    if (addClass) {
      mainClass.push('mrL250');
      mainClass.push('pdT10');
    }

    const currentPath = window.location.pathname;
    const showMenu = currentPath.includes('public') ? false : true;
    const showSettingsSidebar = currentPath.includes('setting');
    console.log("currentPath", showSettingsSidebar)
    if (showSettingsSidebar) {
      // mainClass.push('has-settings-sidebar')
    }

    return (
      <div className={boxClass.join(' ')}>

        {/* <Header  handleDrawerOpen={this.handleDrawerOpen} /> */}
        <div className="app-content-wrapper main-body">
            {showMenu ? <Sidebar /> : null}
            <main className={mainClass.join(' ')}>
              <MobileHeader handleDrawerClose={this.handleDrawerClose} handleDrawerOpen={this.handleDrawerOpen}
                isOpen={addClass} />
              <SnakeBar />
              <div className={showSettingsSidebar ? `py-frame__page py-frame__settings has-sidebar` : "py-frame__page"}>              
                {showSettingsSidebar ? <SettingsSidebar /> : null}
                {children}
              </div>
            </main>
          {/* <Footer /> */}
        </div>
        {/* <Customizer /> */}
      </div>
    );
  }
}

export default Layout
