import React, { Fragment } from "react";
import ReactTooltips from "react-tooltip";

export function renderTooltip () {
  return (
    <div>
      <ReactTooltips data-multiline id="autoGenerateRecurringNumber">
        <span>Latitude value should be between -90.0 to 90.0</span>
      </ReactTooltips>
      <ReactTooltips data-multiline id="autoGenerateRecurringDate">
        <span>Longitude value should be between -180.0 to 180.0</span>
      </ReactTooltips>
    </div>
  );
};
