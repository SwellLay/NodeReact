import React, { Component, Fragment } from 'react';
import { Tooltip } from 'reactstrap';
import { fetchNetIncome } from '../../../../../api/DashboardService';
import { toMoney } from '../../../../../utils/GlobalFunctions';

function HelpIcon({ id = "help" }) {
  return (
    <svg className="py-icon" id={id} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10 19a9 9 0 1 1 0-18 9 9 0 0 1 0 18zm0-2a7 7 0 1 0 0-14 7 7 0 0 0 0 14zm0-4a1 1 0 1 1 0 2 1 1 0 0 1 0-2zM8.543 7.936a1 1 0 1 1-1.886-.664 3.4 3.4 0 0 1 6.607 1.132c0 1.105-.646 1.965-1.645 2.632a6.249 6.249 0 0 1-1.439.716 1 1 0 1 1-.632-1.897 4.594 4.594 0 0 0 .962-.483c.5-.334.754-.673.754-.97a1.4 1.4 0 0 0-2.72-.466z" />
    </svg>
  );
}

class NetIncome extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      data: { headings: [], values: [] },
      tooltip: false,
    }
  }

  componentWillMount() {
    this.fetchNetIncome();
  }

  async fetchNetIncome() {
    this.setState({ loading: true });
    const { statusCode, data } = await fetchNetIncome(this.props.limit);
    if (statusCode !== 200) {
      this.setState({ loading: false });
      return;
    }

    this.setState({ loading: false, data });
  }

  toggle = () => {
    this.setState({
      tooltip: !this.state.tooltip,
    });
  };

  renderData() {
    const { data } = this.state;

    return (
      <table>
        <thead>
        <tr>
          {data.headings.map((head, i) => (
            <th key={head}>{head} {i === 0 ? (
              <Fragment>
                <HelpIcon />
                <Tooltip placement="top" isOpen={this.state.tooltip} target="help" toggle={this.toggle}>
                  {data.tip}
                </Tooltip>
              </Fragment>
            ) : null}</th>
          ))}
        </tr>
        </thead>
        <tbody>
        {data.values.map((row) => (
          <tr key={row.displayName}>
            <td>{row.displayName}</td>
            <td>{toMoney(row.column1)}</td>
            <td>{toMoney(row.column2)}</td>
          </tr>
        ))}
        </tbody>
      </table>
    )
  }

  render() {
    return (
      <div className="widget-wrapper net-income-widget">
        <div className="title-container">
          <h3 className="widget--title">Net Income</h3>
        </div>
        <div className="tables-container">
          {this.renderData()}
        </div>
      </div>
    );
  }
}

export default NetIncome;
