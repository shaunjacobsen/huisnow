import React, { useState } from 'react';
import { Button, Carousel, Tag } from 'antd';
import Icon, {
  CalendarOutlined,
  LikeOutlined,
  LoadingOutlined,
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

const IconButton = props => {
  const { icon, loading, onClick } = props;

  const loadingIcon = <LoadingOutlined />;

  return (
    <div className="icon-button" onClick={onClick}>
      {loading ? loadingIcon : icon}
    </div>
  );
};

const FlatCard = props => {
  const [currentAction, setCurrentAction] = useState(undefined);

  const {
    agent,
    availableFrom,
    coords,
    createdAt,
    id,
    images,
    interest,
    municipality,
    name,
    postcode,
    price,
    surface,
  } = props;

  const timeSincePosting = renderTimeSincePosting(createdAt);

  const dispatch = useDispatch();

  function handleLike() {
    setCurrentAction('LIKE');
    dispatch(updatePropertyInterest({ propertyId: id, interested: true }));
  }

  function handleDislike() {
    setCurrentAction('DISLIKE');
    dispatch(updatePropertyInterest({ propertyId: id, interested: false }));
  }

  function renderInterestButtons() {
    if (!interest) {
      return (
        <>
          <IconButton icon={<LikeOutlined />} onClick={handleLike} />
          <IconButton icon={<DislikeOutlined />} onClick={handleDislike} />
        </>
      );
    } else if (interest && interest.isInterested) {
      return (
        <>
          <IconButton
            icon={<LikeOutlined style={{ color: '#ff7c7c' }} />}
            onClick={handleLike}
          />
          <IconButton
            icon={<DislikeOutlined style={{ color: '#D3D3D3' }} />}
            onClick={handleDislike}
          />
        </>
      );
    } else if (interest && !interest.isInterested) {
      return (
        <>
          <IconButton
            icon={<LikeOutlined style={{ color: '#D3D3D3' }} />}
            onClick={handleLike}
          />
          <IconButton
            icon={<DislikeOutlined style={{ color: '#ff7c7c' }} />}
            onClick={handleDislike}
          />
        </>
      );
    }
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
        <div className="actions">{renderInterestButtons()}</div>
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
