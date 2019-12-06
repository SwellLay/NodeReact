import React from "react";
import { Tooltip } from "reactstrap";

class CustomTooltip extends React.Component {
  state = { tooltipOpen: false };
  toggle = () => {
    this.setState(prevState => ({
      tooltipOpen: !prevState.tooltipOpen
    }));
  };
  render() {
    const { position, displayText } = this.props;
    return (
      <Tooltip
        placement={'top'}
        isOpen={this.state.tooltipOpen}
        target="TooltipExample"
        toggle={this.toggle}
      >
        {displayText}
      </Tooltip>
    );
  }
}

export default CustomTooltip 