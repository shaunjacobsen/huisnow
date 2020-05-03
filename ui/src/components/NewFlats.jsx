import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Carousel, Col, List, Pagination, Row, Tag } from 'antd';
import Icon, {
  CalendarOutlined,
  LikeOutlined,
  DislikeOutlined,
  SendOutlined,
} from '@ant-design/icons';

import FlatCard from './FlatCard/FlatCard';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProperties } from '../store/properties/actions';
import {
  getCurrentPropertiesPage,
  getProperties,
  getTotalProperties,
} from '../store/properties/selectors';

const renderRecentProperty = ({ title, viewingTime }) => {
  function renderViewingTime() {
    if (viewingTime) {
      return (
        <Button shape="round" type="success" icon={<CalendarOutlined />}>
          Thursday 16:00
        </Button>
      );
    }
    return (
      <Button type="dashed" shape="round" icon={<CalendarOutlined />}>
        Add viewing
      </Button>
    );
  }
  return (
    <List.Item actions={[renderViewingTime()]}>
      <List.Item.Meta title={title} description="Inquired 8 hours ago" />
    </List.Item>
  );
};

export const NewFlats = props => {
  const properties = useSelector(getProperties);
  const totalProperties = useSelector(getTotalProperties);
  const pageProperties = useSelector(getCurrentPropertiesPage);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProperties());
  }, []);

  function handlePaginate(page, size) {
    const zeroIndexedPage = page - 1;
    dispatch(fetchProperties({ page: zeroIndexedPage, size }));
  }

  return (
    <>
      <div className="overview-header">
        <div>
          <strong>8</strong> new flats to review
        </div>
        <Button type="primary" shape="round" icon={<SendOutlined />}>
          Email 3 properties
        </Button>
      </div>
      <div className="flats-list">
        {properties.map(flat => (
          <FlatCard {...flat} key={flat.id} />
        ))}
        <Pagination
          current={pageProperties + 1}
          total={totalProperties}
          onChange={handlePaginate}
          onShowSizeChange={handlePaginate}
        />
      </div>
      <div className="overview-header">
        <div>Recently contacted properties</div>
      </div>
      <div className="flats-list">
        {/* <List
          itemLayout="horizontal"
          dataSource={list}
          renderItem={renderRecentProperty}
        /> */}
      </div>
    </>
  );
};
