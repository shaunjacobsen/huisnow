import React from 'react';

import './card.less';

const Card = props => {
  const { actions, children, cover, title } = props;

  return (
    <div className="card-container">
      {title && <div className="title">{title}</div>}
      {cover && <div className="cover">{cover}</div>}
      <div className="children">{children}</div>
      {actions && <div className="actions">{actions}</div>}
    </div>
  );
};

export default Card;
