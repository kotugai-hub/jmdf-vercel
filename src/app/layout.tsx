import type { Metadata } from 'next'
import { Noto_Sans_JP } from 'next/font/google'
import './globals.css'

const notoSansJP = Noto_Sans_JP({ subsets: ['latin'], weight: ['400', '500', '700', '900'] })

export const metadata: Metadata = {
  title: '一般社団法人JMDF | ジャパン改良メダカディーラーズフェデレーション',
  description: '日本の改良メダカの価値を守り、育て、次の世代へ。',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <head>
        <meta name="referrer" content="no-referrer" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
      </head>
      <body className={notoSansJP.className}>{children}</body>
    </html>
  )
}
