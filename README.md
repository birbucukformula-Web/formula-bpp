# FS Configurator

Formula Student araba konfiguratörü — React, CSS filtre tabanlı renk sistemi, katmanlı PNG mimarisi.

---

## Kurulum

```bash
npm install
npm start
```

---

## Proje Yapısı

```
fs-configurator/
├── public/
│   └── assets/
│       └── car/          ← BÜTÜN GÖRSELLER BURAYA
│
└── src/
    ├── components/
    │   ├── CarConfigurator.jsx   ← Ana konteyner
    │   ├── CarViewer.jsx         ← Görsel katman sistemi
    │   ├── OptionPanel.jsx       ← Sağ panel
    │   ├── ModelSelector.jsx     ← FS-24 / FS-25 tab
    │   └── SummaryBar.jsx        ← Alt özet çubuğu
    ├── data/
    │   └── config.js             ← Tüm seçenekler & ayarlar
    ├── App.js
    └── index.js
```

---

## Görsel İsimlendirme Rehberi

Tüm görseller `public/assets/car/` klasörüne atılacak.

### BASE ARABA (1 adet)

| Dosya adı       | Açıklama                          |
|-----------------|-----------------------------------|
| `white-car.png` | Beyaz araba — tüm renklerin temeli |

> Siyah ve kırmızı bu görsele CSS `filter` uygulanarak elde edilir.
> Ek PNG'ye gerek yok.

---

### DEĞİŞEN KATMANLAR (transparan PNG)

Her görsel `white-car.png` ile **tam aynı boyut ve açıda** olmalı.
Araba dışı **tamamen saydam** olmalı (PNG alpha).
Katmanlar `mix-blend-mode: multiply` ile üst üste biner.

#### Jant (2 adet)

| Dosya adı       | İçerik                        |
|-----------------|-------------------------------|
| `jant-braid.png` | Braid jant — sadece jantlar görünür |
| `jant-oz.png`    | OZ Racing jant                |

#### Arka Kanat (2 adet)

| Dosya adı            | İçerik                    |
|----------------------|---------------------------|
| `kanat-standard.png` | Standart çift elemanlı kanat |
| `kanat-drs.png`      | DRS / üç elemanlı kanat   |

#### Koltuk (2 adet)

| Dosya adı             | İçerik                |
|-----------------------|-----------------------|
| `koltuk-carbon.png`   | Karbon fiber koltuk   |
| `koltuk-standard.png` | Kompozit standart koltuk |

#### Direksiyon (2 adet)

| Dosya adı                | İçerik               |
|--------------------------|----------------------|
| `direksiyon-round.png`   | Yuvarlak direksiyon  |
| `direksiyon-flat.png`    | Flat-bottom direksiyon |

---

### DEĞİŞMEYEN (ayrı katman yok)

Aşağıdakiler zaten `white-car.png` içinde mevcut, ek görsel üretme:

- Lastik
- Süspansiyon
- Motor
- Fren sistemi
- Şasi
- Batarya

---

## Renk Sistemi

CSS filtresiyle `white-car.png` üzerinde uygulanır:

| Renk     | CSS Filter                                              |
|----------|---------------------------------------------------------|
| Beyaz    | `none` (orijinal görsel)                                |
| Siyah    | `brightness(0.12) contrast(1.25) saturate(0.05)`        |
| Kırmızı  | `sepia(1) saturate(6) hue-rotate(320deg) brightness(0.88)` |

> Değer ince ayarı: `src/data/config.js` → `COLORS` array → `filter` alanı.

---

## Yeni Seçenek Ekleme

`src/data/config.js` içindeki `SECTIONS` array'ine yeni entry ekle:

```js
{
  id: "spoiler",
  label: "Spoiler",
  icon: "⟿",
  changeable: true,
  type: "option",
  options: [
    { id: "a", label: "Tip A", sub: "Açıklama", asset: "spoiler-a.png" },
    { id: "b", label: "Tip B", sub: "Açıklama", asset: "spoiler-b.png" },
  ],
  default: "a",
},
```

Sonra `src/components/CarConfigurator.jsx` → `DEFAULT_STATE`'e `spoiler: "a"` ekle.
Ve `CarViewer.jsx` → `layers` array'ine yeni katman ekle.

---

## Mevcut Görsellerden Kullanılabilecekler

Elinde bu görseller var, şu şekilde kullanabilirsin:

| Elindeki görsel         | Projedeki karşılığı        |
|-------------------------|----------------------------|
| `white-car.png`         | `white-car.png` ✓ (direkt kullan) |
| `braid-jant.png`        | → `jant-braid.png` olarak yeniden adlandır |
| `oz-jant.png`           | → `jant-oz.png` olarak yeniden adlandır |
| `high-downforce.png`    | → `kanat-drs.png` |
| `medium-downforce.png`  | → opsiyonel 3. kanat seçeneği |
| `low-downforce.png`     | → `kanat-standard.png` |
| `carbon.png`            | → `koltuk-carbon.png` |
| `lightweight.png`       | → `koltuk-standard.png` veya ayrı seçenek |
| `standard.png`          | → direksiyon ya da ek seçenek |
| `basic-steelwheel.png`  | → `direksiyon-round.png` veya ek jant |
| `display-steelwheel.png`| → `direksiyon-flat.png` veya ek jant |
| `pro-steelwheel.png`    | → ek seçenek |
| `mask.png`              | → overlay maske olarak kullanılabilir |
