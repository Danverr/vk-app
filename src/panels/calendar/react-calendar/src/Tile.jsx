import React, { Component } from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'merge-class-names';
import { tileProps } from './shared/propTypes';
import { Text} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

function getValue(nextProps, prop) {
  const { activeStartDate, date, view } = nextProps;

  return typeof prop === 'function'
    ? prop({ activeStartDate, date, view })
    : prop;
}

export default class Tile extends Component {
  constructor(props) {
    super(props);
    this.colors = ["var(--very_good)", "var(--good)", "var(--norm)", "var(--bad)", "var(--very_bad)"];
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
      mood,
      stress,
      anxiety
    } = this.props;
    const { tileClassName, tileContent } = this.state;

    /*цвет дня*/
    let gradient = [];

    gradient.push(this.colors[4 - mood]);
    gradient.push(this.colors[stress]);
    gradient.push(this.colors[stress]);
    gradient.push(this.colors[anxiety]);
    gradient.push(this.colors[anxiety]);
    gradient.push(this.colors[4 - mood]);

    if (classes.indexOf("react-calendar__month-view__days__day") != -1) {
      let borderClasses = [], borderStyle = {};
      borderClasses.push("react-calendar__tile__border__gradient");
      borderStyle.background = 'conic-gradient(' + gradient.join(', ') + ')';
      style.background = 'conic-gradient(' + gradient.join(', ') + ')';

      if (classes.indexOf("react-calendar__tile--active") != -1) {
        borderStyle.border = '2px solid rgba(0, 0, 0, 0.5)';
      }

      return (
        <div className={borderClasses} style={borderStyle}>
          <div className = 'container'>
          <div
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
            {children}
            {tileContent}
          </div>
          </div>
        </div>
      );
    }
    else {
      return (
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
          <Text mode='medium'> 
                {children[0].toUpperCase() + children.slice(1)}
          </Text>
          {tileContent}
        </button>
      );
    }
  }
}

Tile.propTypes = {
  ...tileProps,
  children: PropTypes.node.isRequired,
  formatAbbr: PropTypes.func,
  maxDateTransform: PropTypes.func.isRequired,
  minDateTransform: PropTypes.func.isRequired,
};
