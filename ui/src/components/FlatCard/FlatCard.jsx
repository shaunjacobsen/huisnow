import React from 'react';
import { Button, Carousel, Tag } from 'antd';
import Icon, {
  CalendarOutlined,
  LikeOutlined,
  DislikeOutlined,
  SendOutlined,
} from '@ant-design/icons';

import './FlatCard.less';

import Card from '../Card/Card';

const Bike = props => {
  return (
    <svg version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 388.4 388.4">
      <path
        d="M307.6,153.199c-11.2,0-22,2.4-32,6.4l-13.6-26.4v-42c0-2.4-1.6-4.8-4-5.6l-32-12c-3.2-1.2-6.4,0.4-7.6,3.6
			c-1.2,3.2,0.4,6.4,3.6,7.6l28.4,10.4v34H133.2v-11.6h14.4c3.2,0,6-2.8,6-6s-2.8-6-6-6h-37.2c-3.2,0-6,2.8-6,6s2.8,6,6,6h10.8v16.4
			l-11.6,25.2c-8.8-3.6-18.8-5.6-28.8-5.6c-44.4,0-80.8,36-80.8,80.8s36,80.8,80.8,80.8c42.4,0,77.2-33.2,80.4-74.8h26
			c2,0,3.6-0.8,4.8-2.4l62.8-90.8l10,18.8c-22.8,13.6-38,39.2-38,68c0,44.4,36,80.8,80.8,80.8s80.8-36,80.8-80.8
			S352.4,153.199,307.6,153.199z M80.8,302.799c-38,0-68.8-30.8-68.8-68.8s30.8-68.8,68.8-68.8c8.4,0,16.4,1.6,23.6,4.4l-29.2,62
			c0,0,0,0,0,0.4c-0.4,0.8-0.4,1.2-0.4,2c0,0,0,0,0,0.4c0,0.8,0,1.2,0.4,2v0.4c0,0.4,0,0.4,0.4,0.8c0,0.4,0.4,0.4,0.8,0.8
			c0,0,0,0,0,0.4c0.4,0.4,1.2,0.8,1.6,1.2h0.4c0.8,0.4,1.2,0.4,2,0.4h68.4C146,275.199,116.8,302.799,80.8,302.799z M90,227.999
			l25.2-53.2c18.8,10.8,32,30.4,34,53.2H90z M184,227.999h-23.2c-2-27.6-18-51.2-40.8-64.4l10.8-22.8H244L184,227.999z
			 M307.2,302.799c-38,0-68.8-30.8-68.8-68.8c0-24.4,12.8-45.6,32-58l31.6,60.8c1.2,2,3.2,3.2,5.2,3.2c0.8,0,2-0.4,2.8-0.8
			c2.8-1.6,4-5.2,2.4-8l-31.6-60.8c8.4-3.2,17.2-5.2,26.4-5.2c38,0,68.8,30.8,68.8,68.8S345.2,302.799,307.2,302.799z"
      />
    </svg>
  );
};

const BikeIcon = () => <Icon component={Bike} />;

function renderTimeSincePosting(time) {
  let colour = 'cyan';
  if (time <= 4) {
    colour = 'green';
  } else if (time <= 24) {
    colour = 'gold';
  } else if (time <= 24) {
    colour = 'cyan';
  } else if (time <= 48) {
    colour = 'orange';
  } else {
    colour = 'red';
  }

  return <Tag color={colour}>{time} hours ago</Tag>;
}

const FlatCard = props => {
  const {
    agent,
    availableFrom,
    coords,
    createdAt,
    images,
    municipality,
    name,
    postcode,
    price,
    surface,
    time,
  } = props;

  const timeSincePosting = renderTimeSincePosting(time);

  return (
    <Card
      title={name}
      cover={
        <Carousel className="card-image-carousel">
          <div className="card-image">
            <img src={images[0]} />
          </div>
        </Carousel>
      }
      actions={[<LikeOutlined />, <DislikeOutlined />]}
    >
      <div className="date-meta">{time}</div>
      <div className="base-info">
        <div>{price} €</div>
        <div>{postcode}</div>
      </div>
      <div className="commute-info">
        <Button shape="round" icon={<Bike />}></Button>
      </div>
      <div className="description"></div>
    </Card>
  );
};

export default FlatCard;
