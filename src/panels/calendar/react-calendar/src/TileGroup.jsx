import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Flex from './Flex';

import { getTileClasses } from './shared/utils';
import { tileGroupProps } from './shared/propTypes';
import { getDate, getMonth, getYear } from '@wojtekmaj/date-utils';
import { Spinner } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import api from '../../../../utils/api'

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
  ...tileProps
}) {
  var [posts, setPosts] = useState(new Map());
  var [startDate, setStartDate] = useState(null);
  const tiles = [];

  useEffect(() => {
    if (className != "react-calendar__month-view__days" || tileProps.user == null)
      return;
    const fetchUsersPosts = async () => {
      let months = new Set();
      let temp = new Map();

      for (let point = start; point <= end; point += step) {
        let curDate = dateTransform(point);

        if (!months.has(getMonth(curDate))) {
          let year = getYear(curDate);
          let month = (parseInt(getMonth(curDate)) + 1).toString();
          let results = await api("GET", "/entries/", { userId: tileProps.user, month: year + "-" + month });
          if (results != null) {
            results.data.map(post => {
              temp.set(post.date.split(' ')[0], { mood: post.mood, stress: post.stress, anxiety: post.anxiety });
            });
          }
        }
        months.add(getMonth(curDate));
      }
      setPosts(temp);
    }
    fetchUsersPosts();
  },
    [startDate, tileProps.user]
  );

  let temp = dateTransform(start);
  if (temp > startDate || temp < startDate)
    setStartDate(temp);

  for (let point = start; point <= end; point += step) {
    const date = dateTransform(point);
    let year = getYear(date);
    let month = ('0' + (parseInt(getMonth(date)) + 1).toString()).slice(-2);
    let day = ('0' + getDate(date)).slice(-2);
    let curDate = year + "-" + month + "-" + day;

    let curTileProps = Object.assign({}, tileProps);

    if (className == "react-calendar__month-view__days" && posts.has(curDate)) {
      curTileProps.mood = posts.get(curDate).mood - 1;
      curTileProps.stress = posts.get(curDate).stress - 1;
      curTileProps.anxiety = posts.get(curDate).anxiety - 1;
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
