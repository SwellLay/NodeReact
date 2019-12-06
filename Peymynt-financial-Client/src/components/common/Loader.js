import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { PulseLoader } from "halogenium";

const DEFAULT_LOADER_STYLE = {
  width: "auto",
  height: "auto",
  zIndex: "100",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

const ABSOLUTELY_POSITIONED_STYLE = {
  position: "absolute",
  top: "48%",
  left: "48%"
};

class Loader extends PureComponent {
  static propTypes = {
    size: PropTypes.number,
    loaderStyle: PropTypes.object,
    mergeStyles: PropTypes.bool,
    absolutelyPositioned: PropTypes.bool,
    PulseLoaderProps: PropTypes.object
  };

  static defaultProps = {
    size: 16,
    mergeStyles: false,
    absolutelyPositioned: true,
    PulseLoaderProps: {}
  };

  getLoaderStyle = ((loaderStyle, mergeStyles, absolutelyPositioned) => {
    if (!mergeStyles && loaderStyle) return loaderStyle;

    return {
      ...DEFAULT_LOADER_STYLE,
      ...(absolutelyPositioned ? ABSOLUTELY_POSITIONED_STYLE : {}),
      ...(loaderStyle || {})
    };
  });

  render() {
    const {
      loaderStyle: a,
      mergeStyles: b,
      absolutelyPositioned: c,
      PulseLoaderProps,
      size
    } = this.props;

    return (
      <div style={this.getLoaderStyle(a, b, c)}>
        <PulseLoader
          color="#ddd"
          size={size}
          margin="4px"
          {...PulseLoaderProps}
        />
      </div>
    );
  }
}

export default Loader;
