import React, { Component } from 'react'
import { NavLink } from 'react-router-dom';

export default class index extends Component {
  render() {
    const { heading, listArray, className } = this.props;
    return (
      <div className="py-page__sidebar">
        <div className="py-nav__sidebar">
          <div className="py-nav__heading">{heading}</div>
          <ul className="py-nav__section">
            {
                !!listArray && listArray.length > 0 ?
                    listArray.map((item, i) => {
                        return (
                            <li key={i} className={item.className}>
                                <NavLink className="nav-link" to={item.link}>
                                    <span>{item.name}</span>
                                </NavLink>
                            </li>
                        )
                    })
                : ""
            }
        </ul>
        </div>
      </div>
    )
  }
}
