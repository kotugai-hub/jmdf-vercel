'use client';

import React, { useState } from 'react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <header
      className="header"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 1000,
        background: '#ffffff',
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
      }}
    >
      <div
        className="header-container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 20px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}
      >
        <div className="header-logo">
          <a href="#" onClick={closeMenu} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://files.catbox.moe/j7d5pa.png" alt="JMDF ロゴ" style={{ height: '55px', objectFit: 'contain' }} />
          </a>
        </div>

        {/* デスクトップ用ナビゲーション */}
        <nav className="header-nav desktop-only">
          <ul className="nav-list" style={{ display: 'flex', listStyle: 'none', gap: '25px', margin: 0, padding: 0 }}>
            <li>
              <a href="#news" className="nav-link" style={{ textDecoration: 'none', color: 'var(--text-color)', fontWeight: 'bold', fontSize: '1.05rem' }}>
                お知らせ
              </a>
            </li>
            <li>
              <a href="#trust" className="nav-link" style={{ textDecoration: 'none', color: 'var(--text-color)', fontWeight: 'bold', fontSize: '1.05rem' }}>
                信頼の約束
              </a>
            </li>
            <li>
              <a href="#members" className="nav-link" style={{ textDecoration: 'none', color: 'var(--text-color)', fontWeight: 'bold', fontSize: '1.05rem' }}>
                加盟店一覧
              </a>
            </li>
            <li>
              <a href="#join" className="nav-link" style={{ textDecoration: 'none', color: 'var(--text-color)', fontWeight: 'bold', fontSize: '1.05rem' }}>
                賛助会員入会案内
              </a>
            </li>
          </ul>
        </nav>

        <div className="header-action desktop-only">
          <a
            href="#contact"
            className="btn-contact"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              background: 'var(--primary-gradient)',
              color: '#fff',
              borderRadius: '50px',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '1rem'
            }}
          >
            <span>✉️</span> お問合せ
          </a>
        </div>

        {/* スマホ用ハンバーガーボタン（店長ファースト: 極大タップ領域 54px） */}
        <button
          className="mobile-hamburger-btn"
          onClick={toggleMenu}
          aria-label={isOpen ? 'メニューを閉じる' : 'メニューを開く'}
          style={{
            display: 'none',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '54px',
            height: '54px',
            background: isOpen ? 'var(--primary-color)' : '#f0f4f8',
            color: isOpen ? '#ffffff' : 'var(--primary-color)',
            border: '2px solid var(--primary-color)',
            borderRadius: '10px',
            cursor: 'pointer',
            padding: '6px',
            transition: 'all 0.3s ease',
            zIndex: 1002
          }}
        >
          {isOpen ? (
            <span style={{ fontSize: '1.8rem', lineHeight: '1', fontWeight: 'bold' }}>✕</span>
          ) : (
            <>
              <div style={{ width: '26px', height: '3px', background: 'currentColor', borderRadius: '2px', marginBottom: '4px' }}></div>
              <div style={{ width: '26px', height: '3px', background: 'currentColor', borderRadius: '2px', marginBottom: '4px' }}></div>
              <div style={{ width: '26px', height: '3px', background: 'currentColor', borderRadius: '2px', marginBottom: '2px' }}></div>
              <span style={{ fontSize: '0.65rem', fontWeight: 'bold', lineHeight: '1' }}>メニュー</span>
            </>
          )}
        </button>
      </div>

      {/* スマホ用スライドダウン メニュー（極大文字＆大きなボタン） */}
      {isOpen && (
        <div
          className="mobile-menu-overlay"
          style={{
            position: 'fixed',
            top: '75px',
            left: 0,
            width: '100%',
            height: 'calc(100vh - 75px)',
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(10px)',
            zIndex: 1001,
            display: 'flex',
            flexDirection: 'column',
            padding: '20px 25px',
            overflowY: 'auto'
          }}
        >
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px 0', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <li>
              <a
                href="#news"
                onClick={closeMenu}
                style={{
                  display: 'block',
                  padding: '16px 20px',
                  background: '#f8fafc',
                  borderLeft: '5px solid var(--primary-color)',
                  borderRadius: '10px',
                  fontSize: '1.3rem',
                  fontWeight: 'bold',
                  color: 'var(--text-color)',
                  textDecoration: 'none'
                }}
              >
                📢 お知らせ
              </a>
            </li>
            <li>
              <a
                href="#trust"
                onClick={closeMenu}
                style={{
                  display: 'block',
                  padding: '16px 20px',
                  background: '#f8fafc',
                  borderLeft: '5px solid var(--primary-color)',
                  borderRadius: '10px',
                  fontSize: '1.3rem',
                  fontWeight: 'bold',
                  color: 'var(--text-color)',
                  textDecoration: 'none'
                }}
              >
                🛡️ 信頼の「3つの約束」
              </a>
            </li>
            <li>
              <a
                href="#members"
                onClick={closeMenu}
                style={{
                  display: 'block',
                  padding: '16px 20px',
                  background: '#f8fafc',
                  borderLeft: '5px solid var(--primary-color)',
                  borderRadius: '10px',
                  fontSize: '1.3rem',
                  fontWeight: 'bold',
                  color: 'var(--text-color)',
                  textDecoration: 'none'
                }}
              >
                🏬 全国の公認加盟店一覧
              </a>
            </li>
            <li>
              <a
                href="#join"
                onClick={closeMenu}
                style={{
                  display: 'block',
                  padding: '16px 20px',
                  background: '#f8fafc',
                  borderLeft: '5px solid var(--primary-color)',
                  borderRadius: '10px',
                  fontSize: '1.3rem',
                  fontWeight: 'bold',
                  color: 'var(--text-color)',
                  textDecoration: 'none'
                }}
              >
                🤝 賛助会員 入会案内
              </a>
            </li>
          </ul>

          <div style={{ marginTop: 'auto', paddingTop: '10px', paddingBottom: '30px' }}>
            <a
              href="#contact"
              onClick={closeMenu}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                width: '100%',
                padding: '18px',
                background: 'var(--primary-gradient)',
                color: '#ffffff',
                fontSize: '1.3rem',
                fontWeight: 'bold',
                borderRadius: '50px',
                textDecoration: 'none',
                boxShadow: '0 8px 20px rgba(0, 151, 167, 0.3)'
              }}
            >
              ✉️ お問合せ
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
