'use client';

import React, { useState } from 'react';

export default function ActivityThumb({ item }: { item: Record<string, string> }) {
  const [imgError, setImgError] = useState(false);

  const isInstagram =
    item.Category === '写真' ||
    item.Category === 'インスタ' ||
    item.Category === 'Instagram' ||
    (item.URL && item.URL.includes('instagram.com')) ||
    item.Source === 'Instagram';

  let icon = '📝';
  if (item.Category === '動画') icon = '▶️';
  if (isInstagram) icon = '📷';

  // Only use direct non-Instagram image thumbnails (e.g. blogs / youtube)
  const isDirectImage =
    item.Thumbnail &&
    item.Thumbnail.trim() !== '' &&
    !item.Thumbnail.includes('instagram.com/p/') &&
    !item.Thumbnail.includes('cdninstagram.com') &&
    !item.Thumbnail.includes('fbcdn.net') &&
    !imgError;

  if (isDirectImage) {
    return (
      <div className="activity-thumb" style={{ overflow: 'hidden', padding: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.Thumbnail}
          alt={item.Title || 'サムネイル'}
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={() => setImgError(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }}
        />
      </div>
    );
  }

  if (isInstagram) {
    return (
      <div
        className="activity-thumb"
        style={{
          background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
          color: '#ffffff',
          boxShadow: '0 4px 15px rgba(220, 39, 67, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '10px',
          gap: '6px'
        }}
      >
        <i className="fa-brands fa-instagram" style={{ fontSize: '2.5rem', color: '#ffffff' }}></i>
        <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#ffffff', letterSpacing: '0.5px' }}>
          Instagram
        </span>
      </div>
    );
  }

  return (
    <div
      className="activity-thumb"
      style={{
        background: 'linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%)',
        color: 'var(--primary-color)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '10px',
        fontSize: '2.2rem'
      }}
    >
      <span>{icon}</span>
      <span style={{ fontSize: '0.8rem', fontWeight: 'bold', marginTop: '5px' }}>
        {item.Category || 'お知らせ'}
      </span>
    </div>
  );
}
