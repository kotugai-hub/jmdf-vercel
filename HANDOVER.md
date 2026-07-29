# 📗 JMDF（日本改良メダカディーラーズフェデレーション）公式HP
# 開発・運用・GASバックエンド引き継ぎ完全仕様書 (Complete Specification & Handover Manual)

本ドキュメントは、JMDF（一般社団法人ジャパン改良メダカディーラーズフェデレーション）公式Webサイトおよびシステム（Next.js / Vercel / Google Apps Script / Googleスプレッドシート / Apify API）の管理者・開発者向け引き継ぎ完全マニュアルです。

---

## 1. システムアーキテクチャと全自動データフロー

本システムは、**「エンジニアでなくてもGoogleスプレッドシートを更新するだけでHPが全自動更新される」** 仕組みで構築されています。

```
【入力 / 運用】                      【自動処理 / データ配信】                【フロントエンド表示】
Googleスプレッドシート ──────────────> Google Apps Script (GAS) ────────────> Vercel (Next.js 14)
・Members (加盟店名簿)                 ・Code.gs (JSON API配信)              ・jmdf-vercel.app
・News (手動お知らせ)                  ・fetchApifyInstagram.gs              ・ISR/SSR ハイブリッド表示
・Instagram_Data (自動蓄積)           ・定期トリガー(日次スクレイピング)    ・スマホ用ハンバーガー対応
                                               │
                                               ▼
                                      Apify API (Scraper)
                                      ・Instagram最新投稿3件取得
```

---

## 2. Google Apps Script (GAS) バックエンド完全仕様

GASはスプレッドシートの裏側で動くバックエンドプログラムです。スプレッドシートメニューの **「拡張機能」>「Apps Script」** からアクセスできます。

### 📁 プログラム構成ファイル

1. **`Code.gs`** (Web APIおよびデータ取得ロジック)
2. **`fetchApifyInstagram.gs`** (Apify API連携・Instagram全自動スクレイピング・データ蓄積)

---

### ⚙️ `Code.gs` の主要関数と仕様

| 関数名 | 役割 / 処理内容 | 戻り値 / 出力 |
| :--- | :--- | :--- |
| **`doGet(e)`** | WebAppアクセス時のエントリーポイント。<br>`?api=data` パラメータが渡された場合、全データをJSONで返却します。 | JSONレスポンス (`globalNews`, `memberNews`, `businessPlan`, `members`, `memberLogos`) |
| **`getMembers()`** | `Members` シートからデータを行単位でオブジェクト化。`Status` が `Active` の店舗のみ抽出します。 | 加盟店配列オブジェクト |
| **`getMemberNews()`** | `News` シートおよび `Instagram_Data` シートの投稿を日付降順（新しい順）で結合・ソートして返却します。 | ニュース配列オブジェクト |
| **`addRequestedMembers()`** | 新規加盟店の初期データを一括生成するメンテナンスタスク関数。 | なし |

#### 🌐 APIレスポンスURL仕様
* **APIエンドポイント**: スプレッドシートに紐づくGAS WebAppの公開URL
* **リクエスト例**: `https://script.google.com/macros/s/AKfycb.../exec?api=data`

---

### ⚙️ `fetchApifyInstagram.gs` の主要関数と仕様

Instagramからの最新投稿取得およびApifyサービスとの通信を担当します。

#### ① `getApifyToken()`
* スクリプトプロパティから Apify API トークンを取得します。
* 取得キー: `APIFY_API_TOKEN`

#### ② `syncInstagramUsernames()`
* `Members` シートの `Instagram` 列から各店舗のURLを読み込み、正規表現 `/instagram\.com\/([a-zA-Z0-9_\.]+)\/?/` を用いてユーザー名を自動抽出します。
* 不要な予約語（`p`, `reel`, `tv` 等）を自動除外します。
* 重複を削除（`[...new Set(usernames)]`）し、**`Config` シート** の A列へ一覧を出力します。

#### ③ `fetchInstagramViaApify()`
* `Config` シートに登録された全ユーザー名を取得。
* 重複URLによるApify側の 400 Bad Request エラーを回避するため、`[...new Set(rawUsernames)]` でリストを事前に完全重複排除します。
* Apifyの Actor `apify~instagram-scraper` のエンドポイント（`https://api.apify.com/v2/acts/apify~instagram-scraper/run-sync-get-dataset-items`）へPOSTリクエストを送信します。
* 各アカウントの最新3件の投稿（画像URL、キャプション、投稿ID、いいね数、投稿日時）を取得し、`saveToInstagramDataSheet()` へ渡します。

#### ④ `saveToInstagramDataSheet(items)`
* 取得したデータを **`Instagram_Data` シート** へ一括保存します。
* **重複ガード機能**: 既存の `投稿ID` を `Set` オブジェクトでメモリ保持し、既に保存済みの投稿はスキップして新規投稿のみを最下行へ追記（`setValues`）します。

#### ⑤ `setupDailyInstagramTrigger()`
* GASの「時間主導型トリガー」をプログラムから自動生成します。
* 既存の同名トリガーを自動削除した上で、**毎日深夜2時〜3時** に `fetchInstagramViaApify` を定期実行するトリガーを登録します。

---

### 🔑 スクリプトプロパティの設置方法
1. GASエディタ画面の左メニュー **「プロジェクトの設定（歯車アイコン）」** をクリック。
2. 画面最下部の **「スクリプト プロパティ」** の「スクリプト プロパティを追加」をクリック。
3. **プロパティ**: `APIFY_API_TOKEN`
4. **値**: Apify Console（`console.apify.com`）の「Settings > Integrations > API Token」からコピーした文字列を貼り付けて保存。

---

## 3. Google スプレッドシート データベース構造

データ管理用のGoogleスプレッドシート（`JMDF_加盟店・ニュース管理`）内のシート構造と各列の完全定義です。

### 📄 シート1：`Members`（加盟店名簿マスター）

| 列名（ヘッダー） | 型 | 説明 | 必須 |
| :--- | :---: | :--- | :---: |
| **`ShopName`** | 文字列 | 屋号名（例: `岡崎葵メダカ`, `京めだか`） | **必須** |
| **`Status`** | 文字列 | **`Active`** と入力されている店舗のみHPに表示されます。 | **必須** |
| **`Category`** | 文字列 | **`正会員`** / **`準会員`** / **`賛助会員`** のいずれか | **必須** |
| **`Representative`**| 文字列 | 代表者氏名（賛助会員カードでは非表示） | 任意 |
| **`Role`** | 文字列 | 役職名（例: `代表理事`, `副代表理事`, `理事`, `監事`） | 任意 |
| **`Website`** | URL | 公式サイト / Linktree 等のURL。入力で 🏠 アイコン表示 | 任意 |
| **`Instagram`** | URL | メインInstagramアカウントURL。入力で 📷 アイコン表示 | 任意 |
| **`Instagram2`** | URL | **サブInstagram**URL。入力で 「2」付き 📷 アイコン表示 | 任意 |
| **`Auction`** | URL | **ヤフオク等**オークションURL。入力で 🔨 アイコン表示 | 任意 |
| **`X`** | URL | X (旧Twitter) アカウントURL。入力で 🐦 アイコン表示 | 任意 |
| **`Blog`** | URL | ブログ / note アカウントURL。入力で 📝 アイコン表示 | 任意 |
| **`MEDAICHI`** | フラグ | **`〇`** または **`TRUE`** で note解説記事への直リンクバッジを表示 | 任意 |
| **`LogoURL`** | URL | 独自の店舗ロゴ画像直リンクURL（未指定時は自動フォールバック） | 任意 |

---

### 📄 シート2：`News`（お知らせ・活動投稿）

| 列名（ヘッダー） | 説明 |
| :--- | :--- |
| **`Title`** | お知らせのタイトル |
| **`Date`** | 投稿日時（例: `2026-08-01`） |
| **`Category`** | `お知らせ`, `イベント`, `写真`, `動画` |
| **`URL`** | クリック時の遷移先URL |
| **`Thumbnail`** | サムネイル画像URL（未指定時はグラデーションバッジが適用） |
| **`Source`** | `Manual`（手動投稿） / `Instagram`（自動収集） |

---

### 📄 シート3：`Instagram_Data`（Apify自動蓄積用）

Apifyスクレイパーが自動的に投稿データを保存するシートです。手動編集は不要です。
* 列構成: `ユーザー名`, `投稿ID`, `メディア種別`, `キャプション`, `いいね数`, `コメント数`, `投稿日時(UTC)`, `URL`, `サムネイルURL`, `取得日時`

---

## 4. Next.js フロントエンド（Vercel）構造と表示ロジック

Webサイト本体は Next.js 14 (App Router) で構築されており、`jmdf-vercel` リポジトリで管理されています。

### 📁 ディレクトリ構造

```
jmdf-vercel/
├── src/
│   └── app/
│       ├── page.tsx            # メインLP画面 (全セクションコンポーネント)
│       ├── Header.tsx          # ヘッダー＆スマホ用ハンバーガーメニュー (Client Component)
│       ├── ActivityThumb.tsx   # Instagramサムネイル・403回避・プロキシ処理 (Client Component)
│       ├── globals.css         # 全体CSSデザイン・3D演出・レスポンシブメディアクエリ
│       └── gallery.json        # ギャラリー用画像リスト
├── public/
│   ├── logos/                  # 店舗公式ロゴ画像 (.png / .jpg)
│   └── images/                 # 3Dグラスモフィズム画像 (promise_camera.jpg 等)
└── HANDOVER.md                 # プロジェクト内本マニュアル
```

---

### 💡 主要コンポーネントと表示ロジック

#### 1. `Header.tsx` (スマホ対応ハンバーガーメニュー)
* 画面幅 `768px` 以下で **54px × 54px の押しやすいハンバーガーボタン**（三本線＋「メニュー」文字）が表示されます。
* ボタンタップで画面上部から **1.3remの極大文字** を使ったドロワーメニュー（`mobile-menu-overlay`）がスライドダウン表示されます。
* 各メニュー選択時、自動的にメニューが閉じてスムーズスクロール移動します。

#### 2. `ActivityThumb.tsx` (Instagram画像の直リンクブロック403回避)
* InstagramのCDN画像（`scontent-*.cdninstagram.com`, `*.fbcdn.net`）は、外部Webサイトに直接埋め込むと Meta側で **403 Forbidden（アクセス拒否）** エラーとなります。
* **解決ロジック**:
  1. `<img referrerPolicy="no-referrer" />` を付与し、呼び出し元ヘッダーを隠蔽。
  2. 高速画像配信プロキシ `https://wsrv.nl/?url=${encodeURIComponent(url)}` を経由して読み込み。
  3. 万が一画像が切れている場合は `onError` で綺麗なInstagramグラデーションバッジに自動切替。

#### 3. `page.tsx` 内のフォールバックマッピング辞書
* **`officialRoles`**: スプレッドシートで役職が空欄の場合でも、公式名簿に基づき役職を自動表示（岡崎葵メダカ: 代表理事, 京めだか: 副代表理事, 美夜古/都/チョモ/エムリンク/桃ちゃん: 理事, ぼっけー/ぼっけぇ: 監事）。
* **`knownLogos`**: `/logos/logo_okazaki.png`, `/logos/logo_shizuka.jpg`, `/logos/logo_living.jpg` などの店舗ロゴ画像を自動マッピング。
* **Microlink API**: 画像未受領店舗は `api.microlink.io/?url=https://www.instagram.com/${username}&embed=image.url` から実際のInstagramプロフィールアイコンをリアルタイム取得。
* **`isMedaichi`**: `MEDAICHI` 列が `〇` または `TRUE` の加盟店に `MEDAICHI` note解説記事（`https://note.com/medaichi/n/n0166e73079c3`）への直リンクバッジを表示。

---

## 5. 後任者への引き継ぎ・移行完全手順

後任者の方が運用・開発を引き継ぐ際の一連のステップです。

### ステップ 1: スプレッドシートの権限譲渡
1. スプレッドシート右上 **「共有」** ボタンをクリック。
2. 後任者のGoogleアカウントを追加し、**「オーナー権限を譲渡」** を選択。

### ステップ 2: GASスクリプトプロパティとトリガーの再設定
1. スプレッドシートの「拡張機能」>「Apps Script」を開く。
2. 「プロジェクトの設定（歯車）」>「スクリプト プロパティ」で `APIFY_API_TOKEN` に後任者のApify APIキーをセット。
3. エディタで `setupDailyInstagramTrigger` を開き、「実行」をクリックして日次トリガーを有効化。

### ステップ 3: GitHubおよびVercel権限の移管
1. GitHubの `kotugai-hub/jmdf-vercel` リポジトリの設定（Settings > Collaborators）から後任者を招待し、Admin権限を付与。
2. Vercelダッシュボード（`vercel.com`）の「Project Settings > Members」から後任者を招待。

### ステップ 4: コード修正・開発のフロー（エンジニア向け）
```bash
# 1. リポジトリのクローン
git clone https://github.com/kotugai-hub/jmdf-vercel.git
cd jmdf-vercel

# 2. 依存パッケージのインストール
npm install

# 3. ローカル開発サーバー起動
npm run dev

# 4. ビルドテスト（エラーチェック必須）
npm run build

# 5. 変更のコミットとデプロイ（Vercelへ自動デプロイされます）
git add .
git commit -m "Update feature..."
git push origin main
```

---

## 6. 緊急時トラブルシューティングガイド

| 現象・エラー | 考えられる原因 | 解決手順 |
| :--- | :--- | :--- |
| **スプレッドシートの変更がHPに反映されない** | キャッシュまたはVercelビルド未反映 | 1. 5分程度待ってブラウザをスーパーリロード（`Ctrl + Shift + R`）。<br>2. Vercelダッシュボードで Deployments ログを確認。 |
| **GASで `APIエラー: 400 invalid-input` が発生** | Apifyに送信する `directUrls` に重複URLが含まれている | `fetchApifyInstagram.gs` 内で `[...new Set(rawUsernames)]` が正しく実行されているか確認してください。 |
| **Instagramの写真が画像切れ（崩れ）になる** | Meta側のCDNリンク有効期限切れ | `ActivityThumb.tsx` の `wsrv.nl` プロキシおよび `referrerPolicy="no-referrer"` が正しく機能しているか確認。 |
| **特定店舗が加盟店一覧に表示されない** | スプレッドシートの `Status` 列の誤り | `Members` シートの `Status` 列が正確に半角英字で **`Active`** になっているか確認してください。 |
