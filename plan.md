# FS-Configurator: Supabase Entegrasyonu Adım Adım Planı

Bu dosya, projeyi sadece sizin bilgisayarınızda çalışan bir taslaktan çıkartıp, herkesin kullanabildiği **gerçek bir foruma** dönüştürmek için yapmamız gerekenleri çok detaylı bir şekilde anlatmaktadır.

Yarın projeye başladığımızda bu listeyi takip edeceğiz.

---

## 🏁 AŞAMA 1: SUPABASE HESABI VE PROJE KURULUMU (Sizin Yapacağınız Kısım)

Supabase arka planda bizim veritabanımız (PostgreSQL) ve sunucumuz olacak.

1. [Supabase](https://supabase.com/) sitesine gidin ve GitHub hesabınızla giriş yapın.
2. **"New Project" (Yeni Proje)** butonuna tıklayın.
3. Proje adı olarak `fs-configurator` (veya istediğiniz bir isim) yazın.
4. Güçlü bir veritabanı şifresi (Database Password) belirleyin. (Bunu bir yere not edin)
5. Region (Bölge) olarak size en yakın olanı (örneğin Central EU - Frankfurt) seçip projeyi oluşturun.
6. Projenin kurulması birkaç dakika sürecektir. Kurulum bittikten sonra sol menüden **"Project Settings" (Proje Ayarları) ⚙️ -> "API"** sekmesine gidin.
7. Oradaki **`Project URL`** ve **`anon` (public key)** değerlerini kopyalayıp buraya (bana) atın. Bu kodlar bizim React projemizin Supabase ile konuşmasını sağlayacak.

---

## 🗄️ AŞAMA 2: VERİTABANI TABLOLARININ OLUŞTURULMASI (Birlikte Yapacağız)

Supabase paneline girdikten sonra sol taraftaki **"SQL Editor"** menüsünü kullanarak veritabanı tablolarımızı oluşturacağız. Ben size yarın tam SQL kodunu vereceğim ama mantığı şu şekilde olacak:

1. **`users` (Özel Kullanıcı Tablomuz):**
   - Kayıt olan kişilerin takma adını (nickname) ve avatar rengini tutacak.
2. **`threads` (Konular Tablosu):**
   - Kim, ne zaman, hangi kategoriye konu açmış onu tutacak.
3. **`replies` (Cevaplar Tablosu):**
   - Konulara yazılan yorumları tutacak.

*Not: Verilerin güvenliği için (RLS - Row Level Security) kurallarını da yazacağız. (Örn: Sadece giriş yapanlar mesaj yazabilir)*

---

## 💻 AŞAMA 3: REACT PROJESİNDE KODLAMAYA BAŞLAMA (Benim Yapacağım Kısım)

Projenizin içine Supabase kütüphanesini kurup kodları gerçek veritabanına bağlayacağım.

### 3.1. Kütüphane Kurulumu ve Bağlantı
- Terminalde `npm install @supabase/supabase-js` komutunu çalıştıracağız.
- `src/supabaseClient.js` dosyası oluşturup, sizin bana attığınız `URL` ve `ANON_KEY` bilgilerini buraya gireceğiz.

### 3.2. Authentication (Kayıt Ol / Giriş Yap) Sisteminin Yazılması
- `src/App.js` dosyasındaki sahte `localStorage` mantığı silinecek.
- Supabase'in sunduğu gerçek Auth sistemi (E-posta ve Şifre) entegre edilecek.
- "Giriş Yap" modalı, gerçek bir e-posta/şifre kontrolü yapacak şekilde güncellenecek.
- Sisteme kayıt (Sign Up) olma özelliği eklenecek.

### 3.3. Forum Sayfasının (Forum.jsx) Gerçek Verilere Bağlanması
- `INITIAL_THREADS` adlı sahte veriler silinecek.
- `useEffect` kullanılarak, sayfa açıldığında Supabase'den güncel konular çekilecek (`supabase.from('threads').select()`).
- "Yeni Konu Aç" butonuna basıldığında yazılan mesaj, Supabase veritabanına gönderilecek (`supabase.from('threads').insert()`).
- Yorum yapma (Reply) özelliği yine Supabase üzerinden canlıya bağlanacak.

---

## 🚀 AŞAMA 4: CANLIYA ALMA (DEPLOYMENT)

Proje kendi bilgisayarımızda sorunsuz çalıştığında onu internete açacağız.

1. Proje kodlarını GitHub'a (Private veya Public repo olarak) yükleyeceğiz.
2. Vercel'e girip bu GitHub deposunu bağlayacağız.
3. Çevresel değişkenler olarak (Environment Variables) Supabase URL ve Key'inizi Vercel'e ekleyeceğiz.
4. Vercel projeyi otomatik derleyecek ve size `https://fs-configurator.vercel.app` gibi bir link verecek.
5. **Sonuç:** Takımdaki herkes bu linke girip kayıt olabilecek, forumda konu açıp gerçek zamanlı mesajlaşabilecek!

---

**Yarın görüşmek üzere!** 
Siz ilk aşamadaki Supabase hesabını açıp `URL` ve `ANON KEY` ile geldiğinizde, kodlamaya hızla başlayabiliriz.
