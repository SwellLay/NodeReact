import { fetchExpenseBreakdown } from 'api/DashboardService';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import React, { Component } from 'react';
import { toMoney } from 'utils/GlobalFunctions';

class ExpenseBreakdown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      data: { values: [] },
    }
  }

  componentWillMount() {
    this.fetchExpenseBreakdown();
  }

  async fetchExpenseBreakdown() {
    this.setState({ loading: true });
    const { statusCode, data } = await fetchExpenseBreakdown(this.props.limit);
    if (statusCode !== 200) {
      this.setState({ loading: false });
      return;
    }
    data.values = data.values.map((row) => ({ name: row.displayName, y: row.amount, percentage: row.percentage }));
    this.setState({ loading: false, data });
  }

  getOptions = () => {
    const { currency, values } = this.state.data;
    return {
      chart: {
        backgroundColor: 'transparent',
        width: 579,
      },
      credits: false,
      colors: ["#849194", "#2CB5E2", "#AEE137", "#A94FC9", "#DCD318", "#D74242"],

      title: {
        text: ''
      },

      plotOptions: {
        pie: {
          borderWidth: 2,
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b><br>{point.percentage:.1f}%'
          },
          slicedOffset: 0,
        },
      },
      tooltip: {
        formatter: function () {
          return '<b><span style="color:' + this.point.series.color + '">' + this.key + '</span></b>' +
            '<br><b>' + currency.symbol + toMoney(this.y) + '</b>';
        }
      },
      series: [{
        type: 'pie',
        name: 'Expenses By Category',
        data: values,
        innerSize: '30%',
      }]
    }
  };

  renderData() {
    const { values } = this.state.data;
    if (!values.length) {
      return (
        <div className="no-data-container">
          <div className="image-container">
            <img
              src={`${process.env.CDN_URL}/static/web-assets/placeholder-expenses-category.png`}
              alt="no data"
            />
          </div>
          <div className="placeholder-container">
            <span className="heading">There isn't any data to display.</span>
            <span className="description">A chart will appear here if you add some data for this time period.</span>
          </div>
        </div>
      )
    }
    return (
      <HighchartsReact
        highcharts={Highcharts}
        options={this.getOptions()}
      />
    )
  }

  render() {
    return (
      <div className="widget-wrapper net-income-widget">
        <div className="title-container">
          <h3 className="widget--title">Expenses Breakdown</h3>
        </div>
        <div className="chart-container">
          {this.renderData()}
        </div>
      </div>
    );
  }
}

export default ExpenseBreakdown;
