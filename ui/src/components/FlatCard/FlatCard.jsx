import React from 'react';
import { Button, Carousel, Tag } from 'antd';
import Icon, {
  CalendarOutlined,
  LikeOutlined,
  DislikeOutlined,
  SendOutlined,
} from '@ant-design/icons';
import { differenceInHours, formatDistanceToNow } from 'date-fns';

import { CommuteBadge } from '../CommuteBadge/CommuteBadge';

import './FlatCard.less';
import { updatePropertyInterest } from '../../store/properties/actions';
import { useDispatch } from 'react-redux';

function renderTimeSincePosting(time) {
  const date = new Date(time);
  const verschilInUren = differenceInHours(new Date(), date);
  const verschil = formatDistanceToNow(date);
  let colour = 'cyan';
  if (verschilInUren <= 4) {
    colour = 'green';
  } else if (verschilInUren <= 24) {
    colour = 'gold';
  } else if (verschilInUren <= 24) {
    colour = 'cyan';
  } else if (verschilInUren <= 48) {
    colour = 'orange';
  } else {
    colour = 'red';
  }

  return <Tag color={colour}>{verschil} ago</Tag>;
}

const FlatCard = props => {
  const {
    agent,
    availableFrom,
    coords,
    createdAt,
    id,
    images,
    municipality,
    name,
    postcode,
    price,
    surface,
  } = props;

  const timeSincePosting = renderTimeSincePosting(createdAt);

  const dispatch = useDispatch();

  function handleLike() {
    dispatch(updatePropertyInterest({ propertyId: id, interested: true }));
  }

  return (
    <div className="flat-card">
      <div className="body">
        <div className="upper">
          <div className="title">{name}</div>
          <div className="date-meta">{timeSincePosting}</div>
          <div className="base-info">
            <div>{price} €</div>
            <div>{postcode}</div>
            <div>
              {surface} m<sup>2</sup>
            </div>
            <div>
              <CommuteBadge />
            </div>
          </div>
          <div className="description"></div>
        </div>
        <div className="actions">
          <>
            <Button icon={<LikeOutlined />} onClick={handleLike} />
            <DislikeOutlined />
          </>
        </div>
      </div>
      <div className="images">
        <Carousel className="card-image-carousel">
          <div className="card-image">
            <img src={images[0]} />
          </div>
        </Carousel>
      </div>
    </div>
  );
};

export default FlatCard;
