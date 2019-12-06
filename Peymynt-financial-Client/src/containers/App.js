
import React, { PureComponent } from 'react'

// custom
// import 'style/layout.scss';
// import 'style/theme.scss';
// import 'style/app.scss';
// import 'style/datatable.scss';

class App extends PureComponent {
  render() {
    return (
      <div>
            {this.props.children}
      </div>
    );
  }
}

export default App;
