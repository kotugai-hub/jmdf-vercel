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

  const hasImage = item.Thumbnail && item.Thumbnail.trim() !== '' && !imgError;

  if (hasImage) {
    // Instagram画像CDN直リンクブロック(403)防止のため referrerPolicy="no-referrer" を追加
    // また画像プロキシ(wsrv.nl)を併用して確実に表示
    const imgSrc =
      item.Thumbnail.includes('cdninstagram.com') || item.Thumbnail.includes('fbcdn.net')
        ? `https://wsrv.nl/?url=${encodeURIComponent(item.Thumbnail)}`
        : item.Thumbnail;

    return (
      <div className="activity-thumb" style={{ overflow: 'hidden', padding: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgSrc}
          alt={item.Title || 'サムネイル'}
          referrerPolicy="no-referrer"
          onError={(e) => {
            // プロキシ画像も失敗した場合、生URLを最後の手段として試すかエラー表示
            if (imgSrc !== item.Thumbnail) {
              (e.target as HTMLImageElement).src = item.Thumbnail;
            } else {
              setImgError(true);
            }
          }}
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
        <i className="fa-brands fa-instagram" style={{ fontSize: '3rem', color: '#ffffff' }}></i>
        <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#ffffff', letterSpacing: '0.5px' }}>
          Instagram
        </span>
      </div>
    );
  }

  return (
    <div className="activity-thumb">
      <span>
        {icon} {item.Category}
      </span>
    </div>
  );
}
