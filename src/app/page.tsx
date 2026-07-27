import React from 'react';

async function getData() {
  try {
    const res = await fetch('https://script.google.com/macros/s/AKfycbzhEIxN1dx86YmL8QXAYaG7vSWdrXdcGDV7w0YEFl2hpBW7Me2TQb-q4sm9iafcCEmP/exec?api=data', {
      next: { revalidate: 60 }
    });
    if (!res.ok) throw new Error('Failed to fetch data');
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return {
      globalNews: [],
      memberNews: [],
      businessPlan: [],
      members: [],
      memberLogos: []
    };
  }
}

export default async function Page() {
  const data = await getData();
  const { globalNews = [], memberNews = [], businessPlan = [], members = [], memberLogos = [] } = data;

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

  const sanjyoLogos = memberLogos.filter((logo: Record<string, string>) => logo['会員種別'] === '賛助会員');

  return (
    <>
      <header className="header">
        <div className="header-container">
          <div className="header-logo">
            <a href="#" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://files.catbox.moe/j7d5pa.png" alt="JMDF ロゴ" style={{ height: '65px' }} />
            </a>
          </div>
          <nav className="header-nav">
            <ul className="nav-list">
              <li><a href="#news" className="nav-link">お知らせ</a></li>
              <li><a href="#trust" className="nav-link">信頼の証</a></li>
              <li><a href="#members" className="nav-link">加盟店一覧</a></li>
              <li><a href="#join" className="nav-link">賛助会員入会案内</a></li>
            </ul>
          </nav>
          <div className="header-action">
            <a href="#contact" className="btn-contact">
              <span className="btn-icon">✉️</span> メールでお問合せ
            </a>
          </div>
        </div>
      </header>

      <main>
        <section className="hero" style={{ position: 'relative', overflow: 'hidden', background: 'var(--bg-dark)' }}>
          <div className="hero-mosaic-bg" id="hero-mosaic-bg"></div>
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <h1 className="hero-title"><span className="highlight">信頼</span>が文化を育み、<br />美しい<span className="highlight">未来</span>を創る。</h1>
            <p className="hero-subtitle">日本の改良メダカの価値を守り、育て、次の世代へ。</p>
          </div>
        </section>

        <div className="logo-marquee-wrapper">
          <div className="logo-marquee">
            {sanjyoLogos.length > 0 && [0, 1].map((loop) => (
              <React.Fragment key={loop}>
                {sanjyoLogos.map((logo: Record<string, string>, idx: number) => {
                  const url = getLogoUrl(logo['ロゴURL']);
                  return (
                    <a key={`${loop}-${idx}`} href={logo['リンク先'] || '#'} className="logo-item" target={logo['リンク先'] ? '_blank' : '_self'} title={logo['会員名']}>
                      {url ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={url} alt={logo['会員名']} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      ) : (
                        <span style={{ display: 'inline-block', padding: '10px', color: 'var(--primary-color)', fontWeight: 'bold' }}>{logo['会員名']}</span>
                      )}
                    </a>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>

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
                      <a href={news.URL || '#'} className="news-title" target="_blank" rel="noreferrer">{news.Title}</a>
                    </li>
                  );
                })
              ) : (
                <li className="news-item">
                  <span className="news-date">現在お知らせはありません（データの取得に失敗しているか、設定されていません）</span>
                </li>
              )}
            </ul>
          </div>
        </section>

        <section className="section medaka-news-section bg-light">
          <div className="container">
            <h2 className="section-title">JMDF 直近の事業計画・スケジュール</h2>
            <div className="business-plan-list" style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {businessPlan.length > 0 ? (
                businessPlan.map((plan: Record<string, string>, idx: number) => {
                  let badgeClass = 'badge-member';
                  if (plan.Category === 'イベント') badgeClass = 'badge-event';
                  else if (plan.Category === '重要') badgeClass = 'badge-important';
                  return (
                    <div key={idx} style={{ background: '#fff', borderRadius: '10px', padding: '15px 25px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '20px' }}>
                      <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-color)', minWidth: '120px' }}>{plan.Date}</span>
                      <span className={`news-badge ${badgeClass}`} style={{ minWidth: '100px' }}>{plan.Category}</span>
                      <span style={{ fontSize: '1.2rem', fontWeight: 500 }}>{plan.Title}</span>
                    </div>
                  );
                })
              ) : (
                <p>現在予定されている事業計画はありません</p>
              )}
            </div>
          </div>
        </section>

        <section className="section activity-section">
          <div className="container-fluid">
            <h2 className="section-title">加盟店の最新の活動</h2>
            <p className="section-lead">全国のプロブリーダーたちが発信する、メダカの飼育風景や最新動画です。</p>
          </div>
          <div className="activity-marquee-wrapper">
            <div className="activity-marquee">
              {memberNews.length > 0 && [0, 1].map((loop) => (
                <React.Fragment key={loop}>
                  {memberNews.slice(0, 15).map((item: Record<string, string>, idx: number) => {
                    let icon = '📝';
                    if (item.Category === '動画') icon = '▶️';
                    if (item.Category === '写真' || item.Category === 'インスタ') icon = '📷';
                    
                    return (
                      <div key={`${loop}-${idx}`} className="activity-card" onClick={() => window.open(item.URL, '_blank')}>
                        <div className="activity-thumb">
                          {item.Thumbnail ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={item.Thumbnail} alt="サムネイル" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />
                          ) : (
                            <i className="fa-solid fa-image"></i>
                          )}
                        </div>
                        <div className="activity-info">
                          <span className="shop-name">{item.ShopName}</span>
                          <span className="activity-category cat-photo" style={{ marginLeft: '10px' }}>{icon} {item.Category}</span>
                          <h4>{item.Title && item.Title.length > 40 ? item.Title.substring(0, 40) + '...' : item.Title}</h4>
                        </div>
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>

        <section id="trust" className="section trust-section bg-light">
          <div className="container">
            <h2 className="section-title">JMDFが約束する「安心」</h2>
            <p className="section-lead">お客様に最高のメダカ体験をお届けするため、私たちは厳しい基準を守ります。</p>
            <div className="trust-grid">
              <div className="trust-card">
                <div className="trust-icon">🧬</div>
                <h3 className="trust-title">血統の保証</h3>
                <p>純粋な血統を守り、品種ごとの特徴が正確に現れる個体のみを厳選。お客様が思い描く姿へと成長します。</p>
              </div>
              <div className="trust-card">
                <div className="trust-icon">🦠</div>
                <h3 className="trust-title">病原菌の徹底排除</h3>
                <p>出荷前の厳格な健康チェックと薬浴を実施。病気のリスクを最小限に抑え、元気な状態でお届けします。</p>
              </div>
              <div className="trust-card">
                <div className="trust-icon">🌱</div>
                <h3 className="trust-title">質の高い育成環境</h3>
                <p>日照時間、水質、栄養バランスなど、メダカにとって最適な環境で大切に育て上げられた個体たちです。</p>
              </div>
            </div>
          </div>
        </section>

        <section id="members" className="section members-section">
          <div className="container">
            <h2 className="section-title">加盟店一覧</h2>
            <p className="section-lead">厳しい基準をクリアした、全国の信頼できるメダカ専門店です。</p>
            <div className="members-grid">
              {members.length > 0 ? (
                members.map((member: Record<string, string>, idx: number) => {
                  let logoSrc = member['ロゴ画像URL'];
                  if (logoSrc && logoSrc.includes('drive.google.com')) {
                    const match = logoSrc.match(/d\/([a-zA-Z0-9_-]+)/);
                    if (match && match[1]) {
                      logoSrc = `https://drive.google.com/thumbnail?id=${match[1]}&sz=w500`;
                    }
                  }
                  return (
                    <div key={idx} className="member-card">
                      <div className="member-header">
                        {logoSrc ? (
                          <div className="member-logo-img" style={{ backgroundImage: `url(${logoSrc})` }}></div>
                        ) : (
                          <div className="member-logo-img">{member['屋号']}</div>
                        )}
                        <div className="member-header-info">
                          <h3>{member['屋号']}</h3>
                          <span className="member-location">📍 {member['所在地(都道府県)']}</span>
                        </div>
                      </div>
                      <div className="member-body">
                        <p>{member['店舗紹介']}</p>
                      </div>
                      <div className="member-footer">
                        {member['店舗URL'] && (
                          <a href={member['店舗URL']} target="_blank" rel="noreferrer" className="btn-link">店舗サイトへ</a>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p>現在登録されている加盟店はありません</p>
              )}
            </div>
          </div>
        </section>

        <section id="join" className="section join-section bg-light">
          <div className="container">
            <div className="text-center mb-5">
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
          </div>
        </section>

        <section id="contact" className="section contact-section bg-primary-light">
          <div className="container">
            <h2 className="section-title">お問い合わせ</h2>
            <p className="section-lead" style={{ marginBottom: '20px' }}>当連盟に関するご質問、入会に関するご相談など、お気軽にお問い合わせください。</p>
            <div className="contact-form-wrapper" style={{ textAlign: 'center', padding: '30px' }}>
              <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>お問い合わせは以下のフォーム、またはお電話にて承っております。</p>
              <a href="https://forms.gle/zXm9w6T57JvHhL9n9" target="_blank" rel="noreferrer" className="btn-primary" style={{ display: 'inline-block', marginBottom: '20px', padding: '20px 40px', fontSize: '1.3rem', width: '100%', maxWidth: '400px' }}>
                <span className="btn-icon" style={{ marginRight: '10px' }}>✉️</span>お問い合わせフォームへ
              </a>
              <p style={{ marginTop: '20px', color: 'var(--text-light)' }}>※Googleフォームが別タブで開きます</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">JMDF</div>
            <p className="footer-desc">ジャパン改良メダカディーラーズフェデレーション<br />日本の改良メダカの価値と信頼を未来へ。</p>
            <div className="footer-links">
              <a href="#news">お知らせ</a>
              <a href="#trust">信頼の証</a>
              <a href="#members">加盟店</a>
              <a href="#join">入会案内</a>
              <a href="#contact">お問合せ</a>
            </div>
          </div>
          <div className="footer-copyright">
            &copy; 2026 一般社団法人 ジャパン改良メダカディーラーズフェデレーション All Rights Reserved.
          </div>
        </div>
      </footer>
    </>
  );
}
