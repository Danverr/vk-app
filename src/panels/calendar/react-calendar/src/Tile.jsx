import React, { Component, useEffect } from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'merge-class-names';
import { tileProps } from './shared/propTypes';
import { getDate, getMonth, getYear, getHours, getMinutes } from '@wojtekmaj/date-utils';
import api from '../../../../utils/api'

function getValue(nextProps, prop) {
  const { activeStartDate, date, view } = nextProps;

  return typeof prop === 'function'
    ? prop({ activeStartDate, date, view })
    : prop;
}

export default class Tile extends Component {
  constructor(props) {
    super(props);
    // Нельзя вызывать this.setState() здесь!
    this.colors = ["9EF9A7", "D1F99E", "F3F59E", "FAD19E", "FAA49E"];
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { tileClassName, tileContent } = nextProps;

    const nextState = {};

    if (tileClassName !== prevState.tileClassNameProps) {
      nextState.tileClassName = getValue(nextProps, tileClassName);
      nextState.tileClassNameProps = tileClassName;
    }

    if (tileContent !== prevState.tileContentProps) {
      nextState.tileContent = getValue(nextProps, tileContent);
      nextState.tileContentProps = tileContent;
    }

    return nextState;
  }

  state = {};

  render() {
    const {
      activeStartDate,
      children,
      classes,
      date,
      formatAbbr,
      locale,
      maxDate,
      maxDateTransform,
      minDate,
      minDateTransform,
      onClick,
      onMouseOver,
      style,
      tileDisabled,
      view,
    } = this.props;
    const { tileClassName, tileContent } = this.state;

    /*цвет дня*/
    if (classes.indexOf("react-calendar__tile--active") != -1){ //пользователь выбрал этот день
      style.background = 'conic-gradient(#9EF9A7, #D1F99E, #F3F59E, #9EF9A7)';
    }
    let borderClasses = [], borderStyle = [];
    if(classes.indexOf("react-calendar__month-view__days__day") != -1){ //если это день
      borderClasses.push("react-calendar__tile__border__gradient");
      borderStyle.background = 'conic-gradient(#9EF9A7, #D1F99E, #F3F59E, #9EF9A7)';
    }

    return (
      <div className={borderClasses} style = {borderStyle}>
        <button
          className={mergeClassNames(classes, tileClassName)}
          disabled={
            (minDate && minDateTransform(minDate) > date)
            || (maxDate && maxDateTransform(maxDate) < date)
            || (tileDisabled && tileDisabled({ activeStartDate, date, view }))
          }
          onClick={onClick && (event => onClick(date, event))}
          onFocus={onMouseOver && (() => onMouseOver(date))}
          onMouseOver={onMouseOver && (() => onMouseOver(date))}
          style={style}
          type="button"
        >
          {formatAbbr
            ? (
              <abbr aria-label={formatAbbr(locale, date)}>
                {children}
              </abbr>
            )
            : children}
          {tileContent}
        </button>
      </div>
    );
  }
}

Tile.propTypes = {
  ...tileProps,
  children: PropTypes.node.isRequired,
  formatAbbr: PropTypes.func,
  maxDateTransform: PropTypes.func.isRequired,
  minDateTransform: PropTypes.func.isRequired,
};
