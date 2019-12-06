import React from "react";
import DatePicker from "react-datepicker";

const DatepickerWrapper = props => {
  let {dateFormat,className}=props;
  return (
    <DatePicker
      {...props}
      className={className||"form-control"}
      dateFormat={dateFormat||"yyyy-MM-dd"}
    />
  );
}

export default DatepickerWrapper