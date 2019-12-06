import { fetchProfitAndLoss } from 'api/DashboardService';
import classNames from 'classnames';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import React, { Component } from 'react';
import { toMoney } from '../../../../../utils/GlobalFunctions';

function formatNumberWithSymbols() {
  var axis = this.axis,
    value = this.value,
    numericSymbols = ['k', 'M', 'G', 'T', 'P', 'E'],
    i = numericSymbols && numericSymbols.length,
    multi,
    ret = null,

    // make sure the same symbol is added for all labels on a linear axis
    numericSymbolDetector = axis.isLog ? value : axis.tickInterval;
  if (i && numericSymbolDetector >= 1000) {
    // Decide whether we should add a numeric symbol like k (thousands) or M (millions).
    // If we are to enable this in tooltip or other places as well, we can move this
    // logic to the numberFormatter and enable it by a parameter.
    while (i-- && ret === null) {
      multi = Math.pow(1000, i + 1);
      if (numericSymbolDetector >= multi && numericSymbols[i] !== null) {
        ret = Highcharts.numberFormat(value / multi, -1) + numericSymbols[i];
      }
    }
  }

  if (ret === null) {
    if (value >= 1000) { // add thousands separators
      ret = Highcharts.numberFormat(value, 0);

    } else { // small numbers
      ret = Highcharts.numberFormat(value, -1);
    }
  }

  return ret;
}


class ProfitLoss extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      limit: 12,
      data: { values: [] },
    }
  }

  componentWillMount() {
    this.fetchProfitLoss();
  }

  async fetchProfitLoss() {
    this.setState({ loading: true });
    const { statusCode, data } = await fetchProfitAndLoss(this.props.limit !== undefined ? this.props.limit : this.state.limit);
    if (statusCode !== 200) {
      this.setState({ loading: false });
      return;
    }
    const categories = data.values.map(row => row.displayName);
    const income = data.values.map(row => row.income);
    const expense = data.values.map(row => row.expense);

    this.setState({
      loading: false, data: {
        categories,
        currency: data.currency,
        data: [
          { name: 'Income', data: income, type: 'column', pointWidth: 9 },
          { name: 'Expense', data: expense, type: 'column', pointWidth: 9 },
        ],
      }
    });
  }

  changeLimit = (limit = 12) => {
    this.setState({ limit }, () => this.fetchProfitLoss());
  };

  getOptions = () => {
    const { currency, data, categories } = this.state.data;
    return {
      credits: false,
      chart: {
        backgroundColor: "transparent",
        type: "column",
        zoomType: "x",
        spacingLeft: 0,
        spacingRight: 0,
        width: 580,
        height: 344
      },
      colors: ["#136ACD", "#8AA2B2"],
      marginTop: 20,
      title: {
        text: "",
        margin: 65
      },
      xAxis: {
        categories,
        minRange: 1,
        tickLength: 0,
        labels: {
          formatter: function () {
            return this.value != -1 ? this.value : ""
          },
          autoRotation: false,
        }
      },
      yAxis: {
        title: {
          text: ""
        },
        labels: {
          formatter: function () {
            return currency.symbol + "" + formatNumberWithSymbols.call(this)
          }
        }
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0,
          states: {
            hover: {
              brightness: 0.12,
            },
            inactive: {
              opacity: 1
            }
          }
        },
      },
      legend: {
        align: "center",
        borderWidth: 0,
        margin: 30,
        x: -213,
        y: -10,
        verticalAlign: "top",
        itemStyle: {
          color: "#444"
        }
      },
      tooltip: {
        formatter: function () {
          return '<b>' + this.point.series.name + '</b>' +
            '<br><span>' + currency.symbol + toMoney(this.y) + '</span>';
        },
      },
      series: data
    }
  };

  renderData() {
    return (
      <HighchartsReact
        highcharts={Highcharts}
        options={this.getOptions()}
      />
    )
  }

  renderSwitchOptions() {
    const { limit } = this.state;

    return (
      <div className="options-container">
        <span className={classNames({ option: true, active: limit === 12 })} onClick={() => this.changeLimit(12)}>
          Last 12 months
        </span>
        <span className={classNames({ option: true, active: limit === 24 })} onClick={() => this.changeLimit(24)}>
          Last 24 months
        </span>
      </div>
    )
  }

  render() {
    return (
      <div className="widget-wrapper net-income-widget">
        <div className="title-container">
          <h3 className="widget--title">Profit & Loss</h3>
        </div>
        <div className="info-container">
          <h6 className="info">Income and expenses only (includes unpaid invoices and bills).</h6>
          {/*<NavLink to="#">View Report</NavLink>*/}
        </div>
        <div className="chart-container">
          {this.renderSwitchOptions()}
          {this.renderData()}
        </div>
      </div>
    );
  }
}

export default ProfitLoss;
