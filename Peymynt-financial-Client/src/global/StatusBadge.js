import React from 'react';

export const StatusBadge = props => {
    return (
      <span className={`badge ${props.className}`}
        style={{ backgroundColor: props.bgColor, color: props.textColor }}>{props.text}</span>
    )
};
