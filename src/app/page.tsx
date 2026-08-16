'use client';

import React, { useState, useEffect } from 'react';
import galleryImages from './gallery.json';
import initialData from './initialData.json';
import ActivityThumb from './ActivityThumb';
import Header from './Header';

export default function Page() {
  const initial = (initialData || {}) as {
    globalNews?: Record<string, string>[];
    memberNews?: Record<string, string>[];
    businessPlan?: Record<string, string>[];
    members?: Record<string, Record<string, string>[]>;
    memberLogos?: Record<string, string>[];
  };

  const [globalNews, setGlobalNews] = useState<Record<string, string>[]>(initial.globalNews || []);
  const [memberNews, setMemberNews] = useState<Record<string, string>[]>(initial.memberNews || []);
  const [businessPlan, setBusinessPlan] = useState<Record<string, string>[]>(initial.businessPlan || []);
  const [members, setMembers] = useState<Record<string, Record<string, string>[]>>(initial.members || {});
  const [memberLogos, setMemberLogos] = useState<Record<string, string>[]>(initial.memberLogos || []);
  const [isBpOpen, setIsBpOpen] = useState(false);

  useEffect(() => {
    const gasUrl =
      process.env.NEXT_PUBLIC_GAS_API_URL ||
      'https://script.google.com/macros/s/AKfycbzVB8bykbviAWu-N0CVzGUBrjIZSFUkbseQGY6xqzQjaJmApUDkm1AKBbaUJ4FQahfmIA/exec?api=data';

    fetch(gasUrl)
      .then(res => res.json())
      .then(data => {
        if (data) {
          if (Array.isArray(data.globalNews) && data.globalNews.length > 0) {
            setGlobalNews(data.globalNews);
          }
          if (Array.isArray(data.memberNews) && data.memberNews.length > 0) {
            setMemberNews(data.memberNews);
          }
          if (Array.isArray(data.businessPlan) && data.businessPlan.length > 0) {
            setBusinessPlan(data.businessPlan);
          }
          if (data.members && typeof data.members === 'object') {
            setMembers(data.members);
          }
          if (Array.isArray(data.memberLogos)) {
            setMemberLogos(data.memberLogos);
          }
        }
      })
      .catch(err => {
        console.log('Background sync error (non-fatal):', err);
      });
  }, []);

  const getLogoUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('drive.google.com/file/d/')) {
      const match = url.match(/d\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w500`;
      }
    }
    return url;
  };

  const resolveLogo = (shopName: string, customUrl?: string): string => {
    if (customUrl && customUrl.trim()) return getLogoUrl(customUrl);
    const s = (shopName || '').replace(/[\s（）\(\)・\-_]/g, '').toLowerCase();
    if (s.includes('岡崎') || s.includes('葵')) return '/logos/logo_okazaki.png';
    if (s.includes('京めだか') || s.includes('kyomedaka')) return '/logos/logo_kyomedaka.png';
    if (s.includes('美夜古') || s.includes('都めだか') || s.includes('miyako')) return '/logos/logo_miyako.png';
    if (s.includes('チョモランマ') || s.includes('chomo')) return '/logos/logo_chomo.png';
    if (s.includes('エムリンク') || s.includes('mlink')) return '/logos/logo_mlink.png';
    if (s.includes('桃ちゃん') || s.includes('momo')) return '/logos/logo_momo.png';
    if (s.includes('ぼっけ') || s.includes('bokkei')) return '/logos/logo_bokkei.png';
    if (s.includes('リビング') || s.includes('living')) return '/logos/logo_living.jpg';
    if (s.includes('静めだか') || s.includes('shizuka')) return '/logos/logo_shizuka.jpg';
    if (s.includes('植木屋') || s.includes('丸ちゃん')) return '/logos/logo_uekiya.jpg';
    if (s.includes('パズル') || s.includes('puzzle')) return '/logos/logo_puzzlepiece.jpg';
    if (s.includes('修') || s.includes('nobu')) return '/logos/logo_nobu.jpg';
    if (s.includes('曼珠沙華') || s.includes('manjushage')) return '/logos/logo_manjushage.jpg';
    if (s.includes('奥羽') || s.includes('oumedaka')) return '/logos/logo_ou.jpg';
    if (s.includes('クライム') || s.includes('climb')) return '/logos/logo_climb.jpg';
    if (s.includes('たかちゃん') || s.includes('takachan')) return '/logos/logo_takachan.jpg';
    return '';
  };

  const getInstagramUsername = (instaUrl: string) => {
    if (!instaUrl) return '';
    const match = instaUrl.match(/instagram\.com\/([a-zA-Z0-9_\.]+)\/?/);
    if (match && match[1]) {
      const username = match[1];
      if (username !== 'p' && username !== 'reel' && username !== 'tv' && username !== 'stories') {
        return username;
      }
    }
    return '';
  };

  const defaultSeiMembers: Record<string, string>[] = [
    { ShopName: '岡崎葵メダカ', Category: '正会員', Representative: '天野 雅弘', Role: '代表理事', Instagram: '' },
    { ShopName: '京めだか', Category: '正会員', Representative: '', Role: '副代表理事', Instagram: 'https://www.instagram.com/kyomedaka075/' },
    { ShopName: '美夜古めだか', Category: '正会員', Representative: '', Role: '理事', Instagram: '' },
    { ShopName: 'メダカチョモランマ', Category: '正会員', Representative: '姫野 代表', Role: '理事', Instagram: '' },
    { ShopName: 'エムリンク', Category: '正会員', Representative: '', Role: '理事', Instagram: '' },
    { ShopName: '桃ちゃんめだか', Category: '正会員', Representative: '', Role: '理事', Instagram: '' },
    { ShopName: 'ぼっけーめだか', Category: '正会員', Representative: '', Role: '監事', Instagram: '' },
    { ShopName: 'リビングめだか', Category: '正会員', Representative: '', Role: '広報・スポンサー・協賛関連', Instagram: 'https://www.instagram.com/livingmedaka/' }
  ];

  const defaultJunMembers: Record<string, string>[] = [
    { ShopName: '植木屋丸ちゃんめだか', Category: '準会員', Role: '', Instagram: '', Website: '' },
    { ShopName: 'パズルピースめだか', Category: '準会員', Role: '', Instagram: '', Website: '' },
    { ShopName: '静めだか', Category: '準会員', Role: '', Instagram: 'https://www.instagram.com/livingmedaka/', Website: '' },
    { ShopName: '修(nobu)めだか', Category: '準会員', Role: '', Instagram: '', Website: '' },
    { ShopName: '曼珠沙華めだか', Category: '準会員', Role: '', Instagram: '', Website: '' },
    { ShopName: 'クライムメダカ', Category: '準会員', Role: '', Instagram: 'https://www.instagram.com/climbyk54/', Website: 'https://linktr.ee/climbyk54' },
    { ShopName: '奥羽めだか', Category: '準会員', Role: '', Instagram: '', Website: '' }
  ];

  const defaultSanjyoMembers: Record<string, string>[] = [
    { ShopName: 'KJ', Category: '賛助会員', Role: '広報・スポンサー・協賛関連', 会員名: 'KJ', 会員種別: '賛助会員', ロゴURL: '', Instagram: '', Website: '' },
    { ShopName: 'たかちゃん', Category: '賛助会員', Role: '', 会員名: 'たかちゃん', 会員種別: '賛助会員', ロゴURL: '/logos/logo_takachan.jpg', Instagram: '', Website: '' }
  ];

  const rawSanjyoLogos = Array.isArray(memberLogos)
    ? memberLogos.filter((logo: Record<string, string>) => logo['会員種別'] === '賛助会員')
    : [];

  const sanjyoLogos = [...rawSanjyoLogos];
  defaultSanjyoMembers.forEach(d => {
    if (!sanjyoLogos.some(l => (l['会員名'] || l.ShopName) === d.ShopName)) {
      sanjyoLogos.push({ 会員名: d.ShopName, 会員種別: '賛助会員', ロゴURL: d.ロゴURL || '', リンク先: '#' });
    }
  });

  const categories = [
    { name: '正会員', key: '正会員' },
    { name: '準会員', key: '準会員' },
    { name: '賛助会員', key: '賛助会員' }
  ];

  const getCategoryMembers = (key: string): Record<string, string>[] => {
    let existingList: Record<string, string>[] = [];
    if (Array.isArray(members)) {
      existingList = members.filter((m: Record<string, string>) => (m['Category'] || m['会員種別'] || '正会員') === key);
    } else if (members && typeof members === 'object') {
      existingList = [...((members as Record<string, Record<string, string>[]>)[key] || [])];
    }

    if (key === '正会員') {
      defaultSeiMembers.forEach(d => {
        if (!existingList.some(m => (m.ShopName || m['屋号'] || m['会員名']) === d.ShopName)) {
          existingList.push(d);
        }
      });
    }

    if (key === '準会員') {
      defaultJunMembers.forEach(d => {
        if (!existingList.some(m => {
          const mName = (m.ShopName || m['屋号'] || m['会員名'] || '').replace(/[\s（）\(\)]/g, '');
          const dName = d.ShopName.replace(/[\s（）\(\)]/g, '');
          return mName === dName || (mName.includes('修') && mName.includes('nobu'));
        })) {
          existingList.push(d);
        }
      });
    }

    if (key === '賛助会員') {
      defaultSanjyoMembers.forEach(d => {
        if (!existingList.some(m => (m.ShopName || m['屋号'] || m['会員名']) === d.ShopName)) {
          existingList.push(d);
        }
      });
    }

    return existingList;
  };

  // Mosaic images for hero background (6 loops = ~210 images to fill grid seamlessly without gaps)
  const mosaicImages = [
    ...galleryImages, ...galleryImages, ...galleryImages,
    ...galleryImages, ...galleryImages, ...galleryImages
  ];
  const marqueeGroup1 = galleryImages.filter((_, i) => i % 2 === 0);
  const marqueeGroup2 = galleryImages.filter((_, i) => i % 2 !== 0);

  return (
    <>
      <Header />

      <main>
        {/* Section 1: Hero Mosaic Background (GAS Top Background) */}
        <section className="hero" style={{ position: 'relative', overflow: 'hidden', minHeight: '450px', background: '#ffffff' }}>
          <div className="hero-mosaic-bg" id="hero-mosaic-bg">
            {mosaicImages.map((src, idx) => (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img key={idx} src={src} alt="メダカ" loading="lazy" />
            ))}
          </div>
          <div className="hero-overlay" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(255, 255, 255, 0.1)', zIndex: 1 }}></div>
          <div className="hero-content" style={{ position: 'relative', zIndex: 2 }}>
            <h1 className="hero-title"><span className="highlight">信頼</span>が文化を育み、<br />文化が<span className="highlight">未来</span>を創る。</h1>
            <p className="hero-subtitle">日本の改良メダカの価値を守り、育て、次の世代へ。</p>
          </div>
        </section>

        {/* Section 2: 事務局からのお知らせ */}
        <section id="news" className="section news-section">
          <div className="container">
            <h2 className="section-title">事務局からのお知らせ</h2>
            <ul className="news-list">
              {globalNews.length > 0 ? (
                globalNews.map((news: Record<string, string>, idx: number) => {
                  let badgeClass = 'badge-member';
                  if (news.Category === 'イベント') badgeClass = 'badge-event';
                  else if (news.Category === '重要') badgeClass = 'badge-important';
                  return (
                    <li key={idx} className="news-item">
                      <span className="news-date">{news.Date}</span>
                      <span className={`news-badge ${badgeClass}`}>{news.Category}</span>
                      {news.URL && news.URL.trim() !== '' && news.URL !== '#' ? (
                        <a href={news.URL} className="news-title" target="_blank" rel="noreferrer" style={{ color: 'var(--primary-color)', textDecoration: 'none' }}>
                          {news.Title}
                        </a>
                      ) : (
                        <span className="news-title" style={{ color: 'var(--text-color)', cursor: 'default' }}>
                          {news.Title}
                        </span>
                      )}
                    </li>
                  );
                })
              ) : (
                <li className="news-item">
                  <span className="news-date">現在お知らせはありません</span>
                </li>
              )}
            </ul>
          </div>
        </section>

        {/* Section 3: 直近の事業計画・スケジュール */}
        <section className="section medaka-news-section bg-light">
          <div className="container">
            <h2 className="section-title">JMDF 直近の事業計画・スケジュール</h2>
            <p className="section-lead" style={{ marginBottom: '25px' }}>公式出店イベントや直近の活動予定です。</p>

            {!isBpOpen ? (
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => setIsBpOpen(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    padding: '16px 36px',
                    background: 'var(--primary-gradient)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '50px',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    boxShadow: '0 8px 25px rgba(0, 151, 167, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <span>📅</span> 直近の事業計画・スケジュールを見る（開く ▼）
                </button>
              </div>
            ) : (
              <div style={{ marginTop: '20px' }}>
                <div className="business-plan-list" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {businessPlan && businessPlan.length > 0 ? (
                    businessPlan.map((bp: Record<string, string>, idx: number) => {
                      const dateStr = bp.DateStr || bp.Date || '';
                      const eventName = bp.EventName || bp.Title || '';
                      const detail = bp.Detail || bp.Category || '';
                      const location = bp.Location || '';
                      const linkUrl = bp.LinkURL || bp.URL || '';

                      const itemContent = (
                        <>
                          <div className="bp-date">📅 {dateStr}</div>
                          <div className="bp-content">
                            <h3 className="bp-title">{eventName}</h3>
                            <p className="bp-desc">{detail}</p>
                          </div>
                          {location && <div className="bp-location">📍 {location}</div>}
                        </>
                      );

                      return linkUrl ? (
                        <a key={idx} href={linkUrl} target="_blank" rel="noreferrer" className="business-plan-item" style={{ textDecoration: 'none', color: 'inherit' }}>
                          {itemContent}
                        </a>
                      ) : (
                        <div key={idx} className="business-plan-item">
                          {itemContent}
                        </div>
                      );
                    })
                  ) : (
                    <div style={{ textAlign: 'center', padding: '30px', background: '#fff', borderRadius: '8px', color: 'var(--text-light)', fontSize: '1.2rem' }}>
                      現在予定されている直近のスケジュールはありません。
                    </div>
                  )}
                </div>
                <div style={{ textAlign: 'center', marginTop: '25px' }}>
                  <button
                    type="button"
                    onClick={() => setIsBpOpen(false)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 30px',
                      background: '#ffffff',
                      color: 'var(--primary-color)',
                      border: '2px solid var(--primary-color)',
                      borderRadius: '50px',
                      fontSize: '1.05rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                    }}
                  >
                    ▲ スケジュールを閉じる
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Section 4: 加盟店の最新の活動 */}
        <section className="section activity-section">
          <div className="container-fluid">
            <h2 className="section-title">加盟店の最新の活動</h2>
            <p className="section-lead">全国のプロブリーダーたちが発信する、メダカの飼育風景や最新動画です。</p>
          </div>
          <div className="activity-marquee-wrapper">
            <div className="activity-marquee">
              {memberNews && memberNews.length > 0 ? [0, 1].map((loop) => (
                <React.Fragment key={loop}>
                  {memberNews.slice(0, 10).map((item: Record<string, string>, idx: number) => {
                    let catClass = 'cat-blog';
                    if (item.Category === '動画') catClass = 'cat-video';
                    if (item.Category === '写真' || item.Category === 'インスタ') catClass = 'cat-photo';

                    return (
                      <a key={`${loop}-${idx}`} href={item.URL || '#'} target="_blank" rel="noreferrer" className="activity-card" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                        <ActivityThumb item={item} />
                        <div className="activity-info">
                          <span className={`activity-category ${catClass}`}>{item.Category}</span>
                          <span className="shop-name">{item.ShopName}</span>
                          <h4>{item.Title}</h4>
                        </div>
                      </a>
                    );
                  })}
                </React.Fragment>
              )) : (
                <div style={{ padding: '20px', margin: '0 auto', fontSize: '1.2rem' }}>現在、最新の活動データは登録されていません。</div>
              )}
            </div>
          </div>
        </section>

        {/* Section 5: 設立のご挨拶 */}
        <section className="section greeting-section bg-primary-light">
          <div className="container">
            <div className="greeting-content">
              <h2 className="section-title text-left">設立のご挨拶</h2>
              <p className="greeting-text">
                2026年4月1日、私たちは日本の改良メダカ文化を守り、次世代へとつないでいくために「JMDF」を設立いたしました。<br /><br />
                日本を起源とする改良メダカは、多くの愛好家や専門店の努力により、世界を魅了する美しい文化へと進化を遂げました。しかしその一方で、インターネット販売の普及や環境の変化に伴い、必ずしも買い手と売り手の双方が安心して取引できる仕組みが十分に整っていたとは言えません。<br /><br />
                私たちJMDFは、改良メダカに真摯に関わるすべての人々が、不安なくこの文化を楽しみ、笑顔で集える場所として、信頼と安心の輪を広げてまいります。
              </p>
              <p className="greeting-author">設立時役員代表：岡崎葵メダカ 天野雅弘</p>
            </div>
          </div>
        </section>

        {/* Section 6: お客さまへの「3つの約束」 */}
        <section id="trust" className="section trust-section">
          <div className="container">
            <h2 className="section-title">お客さまへの「3つの約束」</h2>
            <p className="section-lead">安心してメダカをご購入いただくため、私たちは以下のルールを守ります。</p>

            <div className="trust-grid">
              <div className="trust-card" style={{ position: 'relative', overflow: 'hidden', padding: '35px 30px' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/promise_camera.jpg"
                  alt=""
                  style={{
                    position: 'absolute',
                    right: '-15px',
                    bottom: '-15px',
                    width: '180px',
                    height: '180px',
                    objectFit: 'contain',
                    opacity: 0.18,
                    mixBlendMode: 'multiply',
                    pointerEvents: 'none',
                    zIndex: 0
                  }}
                />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ fontSize: '2.2rem', marginBottom: '15px' }}>📷</div>
                  <h3 className="trust-title">① 加工しない<br />「ありのままの写真」</h3>
                  <p className="trust-desc">実物の美しさをそのまま伝えるため、色を極端に濃くするなどの加工は行いません。「届いたメダカが写真と違う」というガッカリを防ぎます。</p>
                </div>
              </div>
              <div className="trust-card" style={{ position: 'relative', overflow: 'hidden', padding: '35px 30px' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/promise_genetics.jpg"
                  alt=""
                  style={{
                    position: 'absolute',
                    right: '-15px',
                    bottom: '-15px',
                    width: '180px',
                    height: '180px',
                    objectFit: 'contain',
                    opacity: 0.18,
                    mixBlendMode: 'multiply',
                    pointerEvents: 'none',
                    zIndex: 0
                  }}
                />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ fontSize: '2.2rem', marginBottom: '15px' }}>🧬</div>
                  <h3 className="trust-title">② 品種情報の<br />正確な開示</h3>
                  <p className="trust-desc">改良メダカを販売する際は、その交配過程や表現など、品種に関する正確な情報をお伝えします。</p>
                </div>
              </div>
              <div className="trust-card" style={{ position: 'relative', overflow: 'hidden', padding: '35px 30px' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/promise_shield.jpg"
                  alt=""
                  style={{
                    position: 'absolute',
                    right: '-15px',
                    bottom: '-15px',
                    width: '180px',
                    height: '180px',
                    objectFit: 'contain',
                    opacity: 0.18,
                    mixBlendMode: 'multiply',
                    pointerEvents: 'none',
                    zIndex: 0
                  }}
                />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ fontSize: '2.2rem', marginBottom: '15px' }}>🛡️</div>
                  <h3 className="trust-title">③ お店そのものが<br />「安心の目印」</h3>
                  <p className="trust-desc">1匹ずつの証明書ではなく、ルールを守る「JMDF加盟店」という看板自体を信用のおけるブランドとして育てます。</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 7: 全国の公認加盟店 */}
        <section id="members" className="section members-section bg-light">
          <div className="container">
            {/* JMDF公式Instagramバナー */}
            <div style={{ marginBottom: '50px' }}>
              <a
                href="https://www.instagram.com/jmdf.medaka/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '20px',
                  padding: '24px 32px',
                  background: 'linear-gradient(135deg, #ffffff 0%, #fff2f6 100%)',
                  border: '2px solid rgba(225, 48, 108, 0.25)',
                  borderRadius: '20px',
                  boxShadow: '0 10px 25px rgba(225, 48, 108, 0.08)',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '16px',
                      background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      fontSize: '2rem',
                      boxShadow: '0 4px 12px rgba(225, 48, 108, 0.35)',
                      flexShrink: 0
                    }}
                  >
                    <i className="fab fa-instagram"></i>
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '1.35rem', fontWeight: 'bold', color: '#1a1a1a' }}>JMDF 公式 Instagram</span>
                      <span style={{ fontSize: '0.95rem', color: '#e1306c', fontWeight: 'bold', background: '#ffe6ee', padding: '3px 12px', borderRadius: '20px' }}>@jmdf.medaka</span>
                    </div>
                    <p style={{ margin: '6px 0 0 0', fontSize: '1rem', color: '#555555', lineHeight: '1.5' }}>
                      最新の活動や展示会情報、全国の加盟店情報を発信中！
                    </p>
                  </div>
                </div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 28px',
                    background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                    color: '#ffffff',
                    fontWeight: 'bold',
                    fontSize: '1.05rem',
                    borderRadius: '50px',
                    boxShadow: '0 4px 15px rgba(225, 48, 108, 0.3)'
                  }}
                >
                  公式Instagramを見る ↗
                </div>
              </a>
            </div>

            <h2 className="section-title">全国の公認加盟店</h2>
            <p className="section-lead">厳格な基準をクリアし、誠実な取引をお約束する全国のプロショップです。</p>

            {categories.map((cat, cIdx) => {
              const catMembers = getCategoryMembers(cat.key);
              return (
                <React.Fragment key={cat.key}>
                  <h3 className="member-category-title" style={{ marginTop: cIdx === 0 ? '30px' : '50px', marginBottom: '20px', borderBottom: '2px solid var(--primary-color)', display: 'inline-block', paddingBottom: '5px', fontSize: '1.5rem', color: 'var(--primary-color)' }}>
                    {cat.name}
                  </h3>
                  <div className="members-grid">
                    {catMembers.length > 0 ? (
                      catMembers.map((member: Record<string, string>, idx: number) => {
                        const shopName = member.ShopName || member['屋号'] || member['会員名'] || '';
                        const representative = member.Representative || member['代表者'] || '';

                        let logoSrc = resolveLogo(shopName, member.LogoURL || member['ロゴ画像URL'] || member['ロゴURL']);

                        if (!logoSrc) {
                          const instaUrl = member.Instagram || member['Instagram'] || member['インスタグラム'] || member['インスタ'] || '';
                          const username = getInstagramUsername(instaUrl);
                          if (username) {
                            logoSrc = `https://api.microlink.io/?url=https://www.instagram.com/${username}&embed=image.url`;
                          }
                        }

                        const officialRoles: Record<string, string> = {
                          '岡崎葵メダカ': '代表理事',
                          '京めだか': '副代表理事',
                          '美夜古めだか': '理事',
                          '都めだか': '理事',
                          'メダカチョモランマ': '理事',
                          'エムリンク': '理事',
                          'M-LINK': '理事',
                          '桃ちゃんめだか': '理事',
                          'ぼっけーめだか': '監事',
                          'ぼっけぇめだか': '監事',
                          'リビングめだか': '広報・スポンサー・協賛関連',
                          'KJ': '広報・スポンサー・協賛関連'
                        };

                        const role = member.Role || member['Role'] || member['役職・担当'] || member['役職'] || officialRoles[shopName] || '';

                        const isMedaichi =
                          String(member.MEDAICHI).toUpperCase() === 'TRUE' ||
                          String(member.MEDAICHI) === '1' ||
                          String(member.MEDAICHI) === '〇' ||
                          String(member['メダイチ']) === '〇' ||
                          String(member['メダイチ']).toUpperCase() === 'TRUE' ||
                          String(member['MEDAICHI利用']) === '〇' ||
                          String(member['MEDAICHI利用']).toUpperCase() === 'TRUE';

                        const medaichiRaw = member.MEDAICHI || member['メダイチ'] || member['MEDAICHI利用'] || '';
                        const medaichiUrl = typeof medaichiRaw === 'string' && medaichiRaw.startsWith('http') ? medaichiRaw : null;

                        return (
                          <div key={idx} className="member-card">
                            <div className="member-header">
                              {logoSrc ? (
                                <div style={{
                                  width: '100%',
                                  height: '140px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  background: '#ffffff',
                                  borderRadius: '12px',
                                  padding: '8px',
                                  overflow: 'hidden'
                                }}>
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={logoSrc}
                                    alt={shopName}
                                    style={{
                                      maxWidth: '100%',
                                      maxHeight: '100%',
                                      objectFit: 'contain'
                                    }}
                                    loading="lazy"
                                  />
                                </div>
                              ) : (
                                <div style={{
                                  width: '100%',
                                  height: '140px',
                                  borderRadius: '12px',
                                  background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: '#ffffff',
                                  boxShadow: '0 4px 10px rgba(220, 39, 67, 0.3)'
                                }} title="Instagram アイコン">
                                  <i className="fa-brands fa-instagram" style={{ fontSize: '2.2rem' }}></i>
                                </div>
                              )}
                              <div className="member-header-info">
                                <h3>{shopName}</h3>
                                {cat.name !== '賛助会員' && representative && (
                                  <div style={{ fontSize: '0.9rem', color: 'var(--text-color)', marginTop: '4px', marginBottom: '4px' }}>
                                    代表: <strong>{representative}</strong>
                                  </div>
                                )}
                                {role && (
                                  <div style={{ fontSize: '0.9rem', color: 'var(--primary-color)', marginTop: '4px', fontWeight: 'bold' }}>
                                    {role}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="member-footer" style={{ paddingTop: '15px', borderTop: '1px solid #eee' }}>
                              <div className="sns-links" style={{ marginTop: 0, flexWrap: 'wrap', alignItems: 'center' }}>
                                {(member.Website || member['Website'] || member['HP'] || member['ウェブサイト']) && (
                                  <a href={member.Website || member['Website'] || member['HP'] || member['ウェブサイト']} target="_blank" rel="noreferrer" className="sns-link sns-website" title="公式サイト"><i className="fa-solid fa-house"></i></a>
                                )}
                                {(member.Instagram || member['Instagram'] || member['インスタグラム'] || member['インスタ'] || member['Instagram_1'] || member['Instagram1']) && (
                                  <a href={member.Instagram || member['Instagram'] || member['インスタグラム'] || member['インスタ'] || member['Instagram_1'] || member['Instagram1']} target="_blank" rel="noreferrer" className="sns-link sns-instagram" title="Instagram (メイン)"><i className="fa-brands fa-instagram"></i></a>
                                )}
                                {(member.Instagram2 || member['Instagram2'] || member['Instagram_2'] || member['インスタグラム2'] || member['インスタ2'] || member['サブインスタ']) && (
                                  <a href={member.Instagram2 || member['Instagram2'] || member['Instagram_2'] || member['インスタグラム2'] || member['インスタ2'] || member['サブインスタ']} target="_blank" rel="noreferrer" className="sns-link sns-instagram-2" title="Instagram (サブ)">
                                    <i className="fa-brands fa-instagram"></i>
                                    <span style={{ position: 'absolute', bottom: '0px', right: '3px', fontSize: '0.6rem', fontWeight: '900', color: '#ffffff', textShadow: '0 0 3px #000' }}>2</span>
                                  </a>
                                )}
                                {(member.Auction || member['Auction'] || member['Yahoo'] || member['YahooAuction'] || member['ヤフオク'] || member['オークション'] || member['オークションURL']) && (
                                  <a href={member.Auction || member['Auction'] || member['Yahoo'] || member['YahooAuction'] || member['ヤフオク'] || member['オークション'] || member['オークションURL']} target="_blank" rel="noreferrer" className="sns-link sns-auction" title="ヤフオク / オークション"><i className="fa-solid fa-gavel"></i></a>
                                )}
                                {(member.X || member['X'] || member['Twitter'] || member['ツイッター']) && (
                                  <a href={member.X || member['X'] || member['Twitter'] || member['ツイッター']} target="_blank" rel="noreferrer" className="sns-link sns-x" title="X (Twitter)"><i className="fa-brands fa-x-twitter"></i></a>
                                )}
                                {(member.Blog || member['Blog'] || member['ブログ']) && (
                                  <a href={member.Blog || member['Blog'] || member['ブログ']} target="_blank" rel="noreferrer" className="sns-link sns-blog" title="Blog"><i className="fa-solid fa-blog"></i></a>
                                )}
                                {isMedaichi && (
                                  <a
                                    href={medaichiUrl || 'https://note.com/medaichi/n/n0166e73079c3'}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="sns-link sns-medaichi"
                                    title="MEDAICHI加盟店"
                                    style={{
                                      background: 'linear-gradient(135deg, #00b4db 0%, #0083b0 100%)',
                                      color: '#ffffff',
                                      padding: '0 14px',
                                      width: 'auto',
                                      borderRadius: '20px',
                                      fontSize: '0.78rem',
                                      fontWeight: 'bold',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      boxShadow: '0 2px 6px rgba(0, 180, 219, 0.3)',
                                      textDecoration: 'none',
                                      height: '38px',
                                      letterSpacing: '0.5px'
                                    }}
                                  >
                                    MEDAICHI
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p style={{ color: 'var(--text-light)', gridColumn: '1 / -1', textAlign: 'center', padding: '20px', fontSize: '1.1rem', background: '#fff', borderRadius: '8px' }}>
                        現在、登録されている{cat.name}はありません。
                      </p>
                    )}
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </section>

        {/* Section 8: 賛助会員入会案内 */}
        <section id="join" className="section join-section">
          <div className="container">
            <h2 className="section-title">賛助会員入会のご案内</h2>
            <p className="section-lead">JMDFの活動に賛同し、一緒にメダカ文化を育てていただける企業・団体様（賛助会員）を募集しています。</p>

            <div className="join-grid" style={{ gridTemplateColumns: '1fr', maxWidth: '600px', margin: '0 auto' }}>
              <div className="join-card">
                <h3 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>賛助会員<br /><span style={{ fontSize: '1.1rem', color: 'var(--text-light)' }}>（応援していただける企業・団体様）</span></h3>
                <p style={{ fontSize: '1.1rem', marginBottom: '25px' }}>私たちの活動を応援してくださる企業様や団体様が対象です。</p>
                <a href="https://drive.google.com/file/d/1g1LHSpPzh9i9TASaPgEHyQJC8HwhCkf9/view?usp=drivesdk" id="link-sanjyo" target="_blank" rel="noreferrer" className="btn-primary" style={{ display: 'inline-block', fontSize: '1rem', padding: '12px 25px' }}>募集要項を確認する（PDF）</a>
              </div>
            </div>
          </div>
        </section>

        {/* Section 9: お問合せ */}
        <section id="contact" className="section contact-section bg-primary-light">
          <div className="container">
            <h2 className="section-title">お問合せ</h2>
            <p className="section-lead">入会のご相談や、イベントへの審査員派遣のご依頼など、こちらからお気軽にご連絡ください。</p>

            <div style={{ maxWidth: '700px', margin: '0 auto 30px', background: 'var(--white)', padding: '30px', borderRadius: '20px', boxShadow: 'var(--box-shadow)', textAlign: 'center' }}>
              <h3 style={{ color: 'var(--primary-color)', marginBottom: '20px', fontSize: '1.3rem' }}>お電話でのお問合せ</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', gap: '20px' }}>
                <div>
                  <div style={{ fontWeight: 'bold', marginBottom: '5px', color: 'var(--text-color)' }}>岡崎葵メダカ(天野)</div>
                  <a href="tel:09015631412" style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--primary-color)', textDecoration: 'none' }}>090-1563-1412</a>
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', marginBottom: '5px', color: 'var(--text-color)' }}>メダカチョモランマ(姫野)</div>
                  <a href="tel:08027190123" style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--primary-color)', textDecoration: 'none' }}>080-2719-0123</a>
                </div>
              </div>
            </div>

            <div className="contact-form-wrapper" style={{ textAlign: 'center', padding: '30px' }}>
              <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>お問い合わせは以下のフォーム、またはお電話にて承っております。</p>
              <a href="https://forms.gle/zXm9w6T57JvHhL9n9" target="_blank" rel="noreferrer" className="btn-primary" style={{ display: 'inline-block', marginBottom: '20px', padding: '20px 40px', fontSize: '1.3rem', width: '100%', maxWidth: '400px' }}>
                <span className="btn-icon" style={{ marginRight: '10px' }}>✉️</span>お問い合わせフォームへ
              </a>
              <p style={{ marginTop: '20px', color: 'var(--text-light)' }}>※Googleフォームが別タブで開きます</p>
            </div>
          </div>
        </section>

        {/* Section 10: JMDF メダカギャラリー (GAS Marquee) */}
        <section className="section">
          <div className="container-fluid">
            <h2 className="section-title">JMDF メダカギャラリー</h2>
            <p className="section-lead">全国のプロフェッショナルが育てた至高のメダカたち</p>
            <div className="photo-marquee-wrapper">
              <div className="photo-marquee">
                {[...marqueeGroup1, ...marqueeGroup1].map((src, idx) => (
                  <div key={idx} className="photo-card">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="メダカギャラリー" loading="lazy" />
                  </div>
                ))}
              </div>
            </div>
            <div className="photo-marquee-wrapper" style={{ marginTop: '15px' }}>
              <div className="photo-marquee" style={{ animationDirection: 'reverse' }}>
                {[...marqueeGroup2, ...marqueeGroup2].map((src, idx) => (
                  <div key={idx} className="photo-card">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="メダカギャラリー" loading="lazy" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://files.catbox.moe/j7d5pa.png" alt="JMDF ロゴ" style={{ height: '110px' }} />
            </div>
            <p className="footer-desc">一般社団法人ジャパン改良メダカディーラーズフェデレーション</p>
            <div className="footer-links">
              <a href="#">特定商取引法に基づく表記</a>
              <a href="#">プライバシーポリシー</a>
            </div>
          </div>
          <div className="footer-copyright">
            &copy; 2026 JMDF All Rights Reserved.
          </div>
        </div>
      </footer>
    </>
  );
}
