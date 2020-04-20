import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Carousel, Col, List, Row, Tag } from 'antd';
import Icon, {
  CalendarOutlined,
  LikeOutlined,
  DislikeOutlined,
  SendOutlined,
} from '@ant-design/icons';

import requester from './../utils/axios';

import Card from './Card/Card';

import placeholderImage from './../static/placeholder.png';
import FlatCard from './FlatCard/FlatCard';

export const Flat = props => {
  function renderTimeSincePosting() {
    let colour = 'cyan';
    if (props.time <= 4) {
      colour = 'green';
    } else if (props.time <= 24) {
      colour = 'gold';
    } else if (props.time <= 24) {
      colour = 'cyan';
    } else if (props.time <= 48) {
      colour = 'orange';
    } else {
      colour = 'red';
    }

    return <Tag color={colour}>{props.time} hours ago</Tag>;
  }
  return (
    <div className="flat"></div>
    // <div className="flat">
    //   <div className="info">
    //     <div>
    //       <div className="price">1.500 €</div>
    //       <div className="name">Appartement James Wattstraat</div>
    //     </div>
    //     <div className="date-meta">{renderTimeSincePosting()}</div>
    //     <div className="base-info">
    //       <span>50 m2</span>
    //       <span>2 rooms</span>
    //       <span>1097 DL</span>
    //     </div>
    //     <div className="commute-info">
    //       <BikeIcon />
    //       <Bike />
    //       <Button shape="round" icon={<BikeIcon />}></Button>
    //     </div>
    //     <div className="description">
    //       Lorem ipsum dolor, sit amet consectetur adipisicing elit. Veniam culpa
    //       mollitia cumque neque, magni, dolorum aut quis error porro earum
    //       rerum, deleniti fugit? Animi, optio maiores sunt beatae dolor itaque?
    //     </div>
    //     <div className="actions">
    //       <LikeOutlined />
    //       <DislikeOutlined />
    //     </div>
    //   </div>
    //   <div className="image">
    //     <img src="https://placehold.it/150x150" />
    //   </div>
    // </div>
  );
};

const list = [
  { title: 'Some apartment' },
  { title: 'Some apartment', viewingTime: 1 },
];

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

function fetchResults() {
  return requester.get('/properties');
}

export const NewFlats = props => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetchResults().then(response => {
      const _properties = response?.data?.data;
      setProperties(_properties);
    });
  }, []);

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
        <Row gutter={16}>
          {properties.map(flat => (
            <Col span={8} key={flat.id}>
              <FlatCard {...flat} key={flat.id} />
            </Col>
          ))}
        </Row>
      </div>
      <div className="overview-header">
        <div>Recently contacted properties</div>
      </div>
      <div className="flats-list">
        <List
          itemLayout="horizontal"
          dataSource={list}
          renderItem={renderRecentProperty}
        />
      </div>
    </>
  );
};
