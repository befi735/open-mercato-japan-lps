# Open Mercato JP Mobile LP デプロイ・SNSマーケティングWBS

## 1. 前提と再定義

本WBSは、`2026-06-14-liff-fulfillment-paypay-yamato-glass.md` に基づき、従来の「3アプリ個別訴求」から「日本向けスマホMVPの統合業務導線」へマーケティング設計を再定義するものである。

訴求対象は、以下の4要素を単独製品として並べるのではなく、受注から出荷までを接続する一連のシステムとして説明する。

| 構成要素 | 役割 | 訴求上の位置付け |
| --- | --- | --- |
| LINE LIFF注文 App | 購入者がLINE内またはスマホブラウザから商品選択、配送先入力、支払いへ進む | 購入者体験の入口 |
| Fulfillment Shipping App | 受注者が注文選択、ピッキング、送り状連携を行う | 現場作業の中心 |
| PayPay Gateway Provider | PayPay Dynamic QRセッション作成、HMAC署名、資格情報管理をBackendへ集約 | 決済連携の安全境界 |
| Yamato Carrier Provider | Shipment作成、送り状番号、追跡レコード、注文ステータス同期を担う | 出荷連携の安全境界 |

本番訴求では、LINE、PayPay、ヤマト運輸について「公式認定」「認定連携」「完全自動」といった表現を使用しない。現段階では、MVPとして実装境界と検証済みフローを説明し、実証協力・導入相談を獲得することを目的とする。

## 2. デプロイ方針

### 2.1 推奨公開先

| 項目 | 方針 |
| --- | --- |
| 第一公開先 | GitHub Pages |
| 理由 | 静的HTMLで即時公開でき、SNS検証に必要なURLを短時間で確保できる |
| 現行公開URL | `https://befi735.github.io/open-mercato-japan-lps/` |
| 公開状態 | 統合LPへ再デプロイ済み。公開URL上で新H1、LIFF画面画像、Fulfillment画面画像、実装ログMarkdownの取得を確認済み |
| 将来移行先 | Vercelまたは独自ドメイン |
| Vercelの現状 | CLI認証トークンが無効であり、再ログインまたは新規トークンが必要 |

### 2.2 デプロイWBS

| ID | 期限 | タスク | 成果物 | 完了条件 |
| --- | --- | --- | --- | --- |
| D1 | 2026-06-14 | 統合LPの公開対象を確定 | `index.html`, `styles.css`, `app.js`, 画面画像2点 | ローカル表示でH1、画像、CTA、仕様タブが確認できる |
| D2 | 2026-06-14 | GitHub Pages公開リポジトリへ統合LPを反映 | GitHub commit | 公開リポジトリの`main`に統合LPがpushされる |
| D3 | 2026-06-14 | Pagesビルド確認 | 公開URL | `https://befi735.github.io/open-mercato-japan-lps/`で統合LPのH1が表示される |
| D4 | 2026-06-14 | SNS投稿用URL一覧を確定 | 投稿URL表 | LP本体、実装ログ、画面画像のURLを整理 |
| D5 | 2026-06-15 | OGP確認・改善 | OGPタイトル、説明文、画像案 | SNSカードで訴求内容が誤読されない |
| D6 | 2026-06-17 | Vercel再検討 | Vercel preview URLまたは移行判断 | 認証復旧できる場合のみVercelへ移行 |

## 3. ペルソナ

### Persona A: B2B卸・小規模ECの事業責任者

| 項目 | 内容 |
| --- | --- |
| 役割 | 売上責任、受注効率、顧客対応品質を管理 |
| 現状 | LINE、電話、メール、手入力、配送システムが分断されている |
| 課題 | 注文受付後の入金確認、出荷判断、配送番号登録が遅れる |
| 関心 | 少人数でも回る受注・決済・出荷フロー |
| 懸念 | 既存業務に合うか、現場が使えるか、外部連携の契約が複雑ではないか |
| 訴求 | 「購入者体験と現場作業を2つのスマホ画面に分け、Backendで同期する」 |

### Persona B: 受注・物流現場の運用責任者

| 項目 | 内容 |
| --- | --- |
| 役割 | 注文確認、ピッキング、送り状発行、出荷ステータス更新を管理 |
| 現状 | Excel、紙、配送システム、受注管理画面を行き来している |
| 課題 | ピッキング漏れ、送り状番号の登録漏れ、ステータス更新遅延 |
| 関心 | 今日の作業、未処理、要確認がスマホで見えること |
| 懸念 | 操作が増えないか、誤出荷を防げるか |
| 訴求 | 「全明細pickedまで出荷作成をブロックし、送り状番号を注文へ戻す」 |

### Persona C: Open Mercato導入・開発担当者

| 項目 | 内容 |
| --- | --- |
| 役割 | Open Mercato Backend、決済Provider、配送Provider、環境変数、API連携を管理 |
| 現状 | 日本向け決済・配送・LIFF導線をどう分離実装するか検討している |
| 課題 | 資格情報をフロントに置けない、決済/配送Provider境界を整理したい |
| 関心 | typecheck/build/Browser QA済みの構成、Backend境界、拡張性 |
| 懸念 | MVPがモック止まりではないか、Backendデータへ本当に接続しているか |
| 訴求 | 「catalog/products、sales/orders、sales/payments、carrier_shipmentsまで検証済み」 |

## 4. カスタマージャーニーマップ

| フェーズ | 顧客心理 | 情報ニーズ | SNSで出すべき内容 | 誘導 |
| --- | --- | --- | --- | --- |
| 認知 | LINE注文、決済、出荷が分断していて非効率だが、解決像が曖昧 | 自分の業務に近い問題提起 | 「注文、支払い、出荷が別々に動く問題」 | 統合LP |
| 課題自覚 | 入金確認や送り状登録がボトルネックだと気づく | 分断がどのミス・遅延を生むか | SPINのProblem/Implication投稿 | 統合LPの運用フロー |
| 解決探索 | LINE注文・PayPay・ヤマトを一気通貫にできるか知りたい | 実装構成、責務分離、現場画面 | FABE投稿、画面画像、仕様タブ紹介 | LPのアプリ仕様 |
| 技術検証 | 実データ接続、Provider境界、検証済み範囲を確認したい | build/typecheck/Backend persistence/QA証跡 | 実装ログ紹介、検証済み項目の抜粋 | 実装ログMarkdown |
| 導入判断 | 自社で使えるか、実証協力できるか判断したい | 必要資格情報、本番化条件、相談導線 | 本番化要件、実証協力募集 | 導入相談CTA |

## 5. SPIN話法

### 5.1 Situation Questions

- 現在、取引先からの注文はLINE、電話、メール、フォームのどれで受け付けているか。
- 注文確定後、支払い確認と出荷判断はどの画面・誰の作業で行っているか。
- 送り状番号は配送システムから受注管理へ手入力で戻しているか。
- 倉庫や店舗現場では、出荷対象注文をPCとスマホのどちらで確認しているか。

### 5.2 Problem Questions

- 注文受付、入金確認、出荷準備が別々の画面に分かれていることで、確認漏れや二重入力は発生していないか。
- 決済が未完了の注文を、現場が誤って出荷準備してしまうリスクはないか。
- ピッキングが完了していない状態で送り状発行へ進む運用になっていないか。
- 送り状番号や出荷ステータスの反映遅れにより、顧客問い合わせが増えていないか。

### 5.3 Implication Questions

- 注文、支払い、出荷の分断が続くと、少人数運用では処理件数が増えた瞬間に現場が詰まりやすいのではないか。
- 手入力や画面横断が多いままだと、売上拡大より先に運用負荷が上限になるのではないか。
- 出荷ステータスが遅れて更新されると、顧客対応、営業確認、現場作業のすべてに余計な確認が発生するのではないか。

### 5.4 Need-Payoff Questions

- 購入者はLINE LIFFで注文し、受注者はスマホでピッキングと送り状連携を行い、Backendで注文・支払い・出荷が同期されるなら、現場負荷はどれだけ下がるか。
- PayPayやヤマトの資格情報をBackend Providerへ閉じ込められれば、フロント実装と運用管理を分離しやすくならないか。
- 全明細pickedまで出荷作成をブロックできれば、誤出荷や確認戻りを減らせるのではないか。

## 6. FABE分析

| Feature | Advantage | Benefit | Evidence |
| --- | --- | --- | --- |
| LINE LIFF注文 App | 購入者はLINE文脈から商品選択、配送先入力、支払いへ進める | 取引先に新しい業務画面を覚えさせず、スマホ注文へ移行しやすい | `liff-order-blue-light.png`、`GET /api/products` HTTP 200 |
| Fulfillment Shipping App | 受注者は未処理注文、ピッキング、送り状連携をスマホで確認できる | 現場がPCに戻らず、出荷対象と進捗を把握しやすい | `fulfillment-shipping-blue-dark.png`、`GET /api/orders` HTTP 200 |
| PayPay Gateway Provider | 資格情報、HMAC署名、Dynamic QR sessionをBackendへ集約 | 決済ロジックをフロントから分離し、運用上の安全境界を作れる | `POST /api/paypay-session`がBackend order/payment作成まで到達 |
| Yamato Carrier Provider | Shipment作成、tracking number、label_created状態をBackendへ保存 | 送り状番号の登録漏れを減らし、注文と出荷情報を結び付けられる | `carrier_shipments = 1`, tracking number `495186440847` |
| 全明細pickedまで出荷作成をブロック | 作業順序をUIで強制できる | ピッキング漏れのまま送り状作成へ進むリスクを抑えられる | Fulfillment App仕様、Browser QA済み |
| Blue Glass UI | 購入者側はLight Blue、受注者側はDark Blueで役割を分離 | 操作主体の違いが視覚的に分かり、説明資料としても伝わりやすい | 390x844 browser QA、CSS変数確認済み |

## 7. 投稿設計

### 7.1 投稿カテゴリ

| カテゴリ | 目的 | 主対象 | 誘導先 |
| --- | --- | --- | --- |
| Problem投稿 | 分断業務への共感を作る | 事業責任者、運用責任者 | 統合LP |
| SPIN投稿 | 課題の深刻化と必要性を引き出す | 事業責任者 | 統合LPの運用フロー |
| FABE投稿 | 機能価値を証拠付きで説明する | 開発担当者、運用責任者 | LPの仕様セクション |
| Evidence投稿 | 実装済みMVPであることを示す | 開発担当者 | 実装ログMarkdown |
| CTA投稿 | 実証協力・導入相談へ誘導する | 全ペルソナ | 導入相談CTA |

## 8. X投稿テキスト

### X-01: Problem / 統合訴求

LINEで注文を受け、PayPayで支払い、ヤマトで出荷する。

この流れ自体は自然ですが、実務では注文画面、決済確認、ピッキング、送り状番号登録が別々に分断されがちです。

Open Mercato JP Mobile MVPでは、購入者のLIFF注文と受注者の出荷作業を2つのスマホ画面に分け、BackendでOrder / Payment / Shipmentを同期する構成にしました。

### X-02: Situation → Problem

受注業務で確認したいこと。

- 注文はLINE、電話、メールに分散していないか
- 支払い確認は誰がどの画面で行っているか
- 送り状番号は手入力で戻していないか
- 倉庫現場はPCに戻らないと出荷判断できないか

このどれかが当てはまるなら、注文から出荷までの導線をスマホ前提で再設計する余地があります。

### X-03: Implication

注文、支払い、出荷が別々に動いていると、件数が少ないうちは人力で吸収できます。

ただし、件数が増えると問題は一気に表面化します。

入金確認待ち、ピッキング漏れ、送り状番号の登録漏れ、出荷ステータス更新遅延。

売上より先に、運用負荷が上限になりやすい構造です。

### X-04: Need-Payoff

購入者はLINE LIFFで注文する。
受注者はスマホでピッキングする。
PayPayとヤマトの連携はBackend Providerへ閉じ込める。

この分離により、利用者の画面は単純にしつつ、決済・配送の資格情報や同期処理はBackendで管理できます。

日本向けOpen Mercato運用では、この責務分離が重要です。

### X-05: FABE / LIFF注文

Feature:
LINE LIFF注文 App

Advantage:
購入者はLINE文脈から商品選択、配送先入力、PayPay支払いへ進める。

Benefit:
取引先に複雑な管理画面を覚えさせず、スマホ注文へ移行しやすい。

Evidence:
Backend catalog/productsから商品を取得し、Browser QAでAPI 200と表示を確認済み。

### X-06: FABE / Fulfillment

Feature:
受注者側 Fulfillment Shipping App

Advantage:
未処理注文、ピッキング、ヤマト送り状連携をスマホで確認できる。

Benefit:
現場がPCに戻らず、出荷対象と進捗を把握しやすい。

Evidence:
Backend sales/ordersから実注文キューを読み込み、390x844のモバイルQAで表示確認済み。

### X-07: FABE / PayPay Backend

PayPay連携は、スマホ画面ではなくBackend Providerへ閉じ込めるべきです。

理由は単純で、資格情報、HMAC署名、merchant設定、Dynamic QR session作成をフロントへ持ち出すべきではないからです。

Open Mercato JP Mobile MVPでは、LIFF AppはBackendへ支払いセッションを要求するだけの責務にしています。

### X-08: FABE / Yamato Carrier

出荷連携で重要なのは、送り状番号を発行することだけではありません。

注文、Shipment、tracking number、出荷ステータスを同じBackend文脈へ戻すことです。

Open Mercato JP Mobile MVPでは、Yamato Carrier Provider境界でshipmentを作成し、注文へ出荷メタデータを書き戻す流れを検証しました。

### X-09: Evidence

今回のOpen Mercato JP Mobile MVPで確認したこと。

- LIFF注文 App build/typecheck通過
- Fulfillment Shipping App build/typecheck通過
- Backend catalog/products取得
- sales/orders, sales/payments作成
- carrier_shipments作成
- 390x844モバイルBrowser QAでconsole errorゼロ

モックLPではなく、実装済み導線の営業・検証用LPです。

### X-10: CTA

Open Mercatoを日本市場向けに展開する場合、課題はEC画面だけではありません。

LINE注文、PayPay決済、ピッキング、ヤマト出荷、ステータス同期まで含めて、現場が扱える導線にする必要があります。

実証協力・導入相談を受け付けます。

## 9. LinkedIn投稿テキスト

### LinkedIn-01: 事業責任者向け

日本向けのB2Bコマース運用では、単にEC画面を用意するだけでは業務は完結しない。

実際の現場では、購入者はLINEで注文したい。支払いはPayPayのようなスマホ決済を使いたい。受注者側は、注文確認、ピッキング、送り状発行、送り状番号登録、出荷ステータス更新までを滞りなく進めたい。

問題は、これらの工程が別々の画面や手入力で分断されることである。件数が少ないうちは人力で吸収できるが、注文数が増えると、入金確認待ち、ピッキング漏れ、送り状番号の登録漏れ、顧客問い合わせの増加として表面化する。

Open Mercato JP Mobile MVPでは、この課題に対し、購入者側のLINE LIFF注文 Appと、受注者側のFulfillment Shipping Appを分離した。PayPayとヤマト連携はスマホ画面へ直接持たせず、Open Mercato BackendのProvider境界へ集約している。

これにより、購入者には分かりやすい注文画面を、現場には出荷作業に集中できるスマホ画面を提供し、Backend側でOrder、Payment、Shipmentを同期する構成になる。

現時点では本番認定や公式連携を主張する段階ではない。重要なのは、MVPとして実装境界、責務分離、実データ接続、モバイルQAまで検証したことである。

日本市場向けにOpen Mercatoを展開する場合、この「購入者体験」と「現場作業」を分けて設計する視点が必要になる。

### LinkedIn-02: 開発・導入担当者向け

Open Mercato JP Mobile MVPでは、日本向けスマホ受注・出荷導線を以下の4構成に分離した。

1. `apps/jp-liff-order`
2. `apps/jp-fulfillment-shipping`
3. `packages/gateway-paypay`
4. `packages/carrier-yamato`

設計上のポイントは、PayPayとヤマトを「フロント機能」ではなくBackend Providerとして扱う点である。

PayPayでは、資格情報、HMAC署名、merchant設定、Dynamic QR session作成をBackendへ閉じ込める。LIFF Appは`POST /api/paypay-session`を呼び、BackendのPayment Gateway Session APIへ転送する。

ヤマト側では、Fulfillment Appが全明細pickedまでshipment作成をブロックし、`POST /api/ship-order`を通じてShipping Carrier Providerへshipment作成を要求する。その後、tracking numberやshipment metadataをBackend orderへ書き戻す。

検証では、typecheck、build、Backend API、実データ読み込み、carrier shipment作成、390x844モバイルBrowser QAまで確認している。

この構成は、単なる日本向けUI追加ではなく、決済・配送・現場作業の責務を分けるための実装パターンである。

## 10. note / Zenn記事タイトル案

1. `Open Mercatoを日本向けにするなら、LINE注文・PayPay・ヤマト配送をどう分離すべきか`
2. `LIFF注文とFulfillment出荷を分ける: Open Mercato JP Mobile MVPの設計メモ`
3. `PayPayとヤマトをフロントに置かない: Backend Provider境界で作る日本向け受注導線`

## 11. DM / 営業接触テキスト

### DM-01: 卸・小規模EC向け

突然のご連絡失礼いたします。

現在、Open Mercato向けに、LINE LIFF注文、PayPay決済、受注者側ピッキング、ヤマト送り状連携を接続する日本向けスマホMVPを検証しています。

特に、注文受付、入金確認、出荷作業、送り状番号登録が分断されている事業者様に向けて、購入者側と現場側を2つのスマホ画面に分ける構成を試しています。

もし現在、LINE注文、スマホ決済、出荷ステータス管理のいずれかに課題があれば、短時間でヒアリングさせていただけないでしょうか。

### DM-02: 開発会社・導入支援会社向け

突然のご連絡失礼いたします。

Open Mercatoの日本向け導入を想定し、LINE LIFF注文、PayPay Backend Gateway、受注者側Fulfillment、Yamato Carrier Providerを分離したMVPを検証しています。

狙いは、決済・配送資格情報をフロントへ持たせず、Backend Provider境界で注文、支払い、出荷を同期することです。

日本向けB2Bコマースや小規模EC導入で同様の課題があれば、実装パターンとして意見交換できれば幸いです。

## 12. 実行WBS

| ID | 期間 | タスク | 成果物 | 完了条件 |
| --- | --- | --- | --- | --- |
| M1 | 2026-06-14 | 統合LPをGitHub Pagesへ再反映 | 公開URL | 公開URL上で新H1「LINE注文から、PayPay決済、ヤマト出荷まで。」が表示される |
| M2 | 2026-06-14 | 投稿URLと画像URLを確定 | URL一覧 | LP、実装ログ、2画面画像、レンダリング画像のURLが整理される |
| M3 | 2026-06-15 | X投稿10本を予約 | 投稿予約 | Problem、SPIN、FABE、Evidence、CTAの各カテゴリを含む |
| M4 | 2026-06-15 | LinkedIn投稿2本を作成 | 投稿本文 | 事業責任者向け、開発担当者向けの2本が完成 |
| M5 | 2026-06-16 | 記事草案を作成 | note/Zenn下書き | Backend Provider境界と業務導線の設計意図を説明 |
| M6 | 2026-06-17 | 初回投稿 | X / LinkedIn | LPクリック、反応、返信を記録開始 |
| M7 | 2026-06-20 | 初回反応分析 | 72時間レポート | クリック30以上、合計反応10以上、有望返信1件以上を判定 |
| M8 | 2026-06-21 | 訴求改善 | 改善案 | 反応が高い投稿カテゴリをLP見出しまたはCTAへ反映 |
| M9 | 2026-06-24 | 個別DM 10件 | 接触ログ | 卸、小規模EC、開発会社、導入支援会社へ送付 |
| M10 | 2026-06-28 | 2週目レビュー | 継続判断 | 実証協力候補2件未満ならペルソナまたは訴求を見直す |

## 13. 運用上の注意

- LINE、PayPay、ヤマト運輸のロゴ、商標、公式連携・認定表現は掲載前に確認する。
- `公式対応`、`認定連携`、`完全自動` は使用しない。
- 投稿では「MVP」「検証済み範囲」「Backend Provider境界」を明示し、本番契約や資格情報が未設定である点を誤魔化さない。
- 初回KPIは売上ではなく、実証協力候補、導入相談、技術的フィードバックの獲得に置く。
