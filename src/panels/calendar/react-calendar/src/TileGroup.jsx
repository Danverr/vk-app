import React from 'react';
import PropTypes from 'prop-types';

import Flex from './Flex';

import { getTileClasses } from './shared/utils';
import { tileGroupProps } from './shared/propTypes';
import { getDate, getMonth, getYear } from '@wojtekmaj/date-utils';

export default function TileGroup({
  className,
  count = 3,
  dateTransform,
  dateType,
  end,
  hover,
  offset,
  start,
  step = 1,
  tile: Tile,
  value,
  valueType,
  allPosts,
  ...tileProps
}) {
  const tiles = [];

  for (let point = start; point <= end; point += step) {
    const date = dateTransform(point);
    let year = getYear(date);
    let month = ('0' + (parseInt(getMonth(date)) + 1).toString()).slice(-2);
    let day = ('0' + getDate(date)).slice(-2);
    let curDate = year + "-" + month + "-" + day;

    let curTileProps = {...tileProps};

    if (allPosts != null && allPosts[curDate] != null) {
      curTileProps.mood = allPosts[curDate].mood - 1;
      curTileProps.stress = allPosts[curDate].stress - 1;
      curTileProps.anxiety = allPosts[curDate].anxiety - 1;
    }
    tiles.push(
      <Tile
        key={date.getTime()}
        classes={getTileClasses({
          value, valueType, date, dateType, hover,
        })}
        date={date}
        point={point}
        {...curTileProps}
      />,
    );
  }

  return (
    <Flex
      className={className}
      count={count}
      offset={offset}
      wrap
    >
      {tiles}
    </Flex>
  );
}

TileGroup.propTypes = {
  ...tileGroupProps,
  activeStartDate: PropTypes.instanceOf(Date),
  count: PropTypes.number,
  dateTransform: PropTypes.func.isRequired,
  offset: PropTypes.number,
  step: PropTypes.number,
  tile: PropTypes.func.isRequired,
};
