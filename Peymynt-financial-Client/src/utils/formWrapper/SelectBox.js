import React from 'react'

import Select from 'react-select';

const SelectBox = (props) => {
    return <Select {...props} isClearable={props.isClearable} />
};

export default SelectBox
