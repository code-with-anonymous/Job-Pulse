import React, { useState } from 'react';
import { HeartOutlined, HeartFilled, LoadingOutlined } from '@ant-design/icons';
import { Tooltip, Button } from 'antd';
import PropTypes from 'prop-types';
import { useFavorites } from '../hooks/useFavorites';
import './FavoriteButton.css';

export const FavoriteButton = ({ jobId }) => {
  const { isFav, toggleFav } = useFavorites();
  const [busy, setBusy] = useState(false);

  const handleClick = async () => {
    if (busy) return;
    setBusy(true);
    await toggleFav(jobId);
    setBusy(false);
  };

  const fav = isFav(jobId);
  const icon = busy ? (
    <LoadingOutlined />
  ) : fav ? (
    <HeartFilled style={{ color: '#eb2f96' }} />
  ) : (
    <HeartOutlined />
  );

  return (
    <Tooltip title={fav ? 'Remove from favourites' : 'Add to favourites'}>
      <Button
        type="text"
        shape="circle"
        icon={icon}
        onClick={handleClick}
        className="favorite-btn"
        aria-label={fav ? 'Unfavourite job' : 'Favourite job'}
      />
    </Tooltip>
  );
};

FavoriteButton.propTypes = {
  jobId: PropTypes.string.isRequired,
};
