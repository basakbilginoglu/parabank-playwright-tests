# ParaBank API Test Raporu

## 1. Genel Bilgiler

| Alan | Değer |
|---|---|
| Proje | ParaBank API Testleri |
| Test aracı | Postman |
| Test ortamı | Yerel Docker ortamı |
| Test tarihi | 23 Ekim 2026 |
| Base URL | `http://localhost:8080/parabank/services/bank` |
| Yanıt formatı | JSON (`Accept: application/json`) |
| Test kapsamı | Hesap listeleme, hesap detayı, para transferi, işlem geçmişi, geçersiz hesap ve sınır durumları |

## 2. Testin Amacı

Bu çalışmanın amacı ParaBank API servislerinin temel işlevlerini, yanıt sözleşmelerini ve seçilen iş kurallarını doğrulamaktır.

Testlerde HTTP durum kodları, yanıt gövdeleri, hesap verileri, transfer sonuçları ve geçersiz işlem davranışları incelenmiştir. Başarılı HTTP yanıtlarının yanı sıra iş kuralı beklentileriyle uyuşmayan davranışların da tespit edilmesi hedeflenmiştir.

## 3. Test Ortamı ve Verileri

| Parametre | Değer |
|---|---|
| `baseUrl` | `http://localhost:8080/parabank/services/bank` |
| `customerId` | `12212` |
| `accountId` | `12345` |
| `toAccountId` | `13011` |
| `transferAmount` | `5` |
| `invalidAccountId` | `999999999` |

> Not: Transfer testleri hesap bakiyelerini ve işlem geçmişini değiştirebilir. Bu nedenle transfer isteği tekrar çalıştırılmadan önce test verilerinin mevcut durumu kontrol edilmelidir.

## 4. Test Senaryoları

### API-01 — Müşteri Hesaplarını Listeleme

**Endpoint:** `GET /customers/{customerId}/accounts`

**Amaç:** İstenen müşterinin hesaplarının listelendiğini ve yanıt verilerinin tutarlı olduğunu doğrulamak.

**Kontroller:**
- HTTP durum kodunun `200` olması.
- Yanıtın boş olmayan bir hesap listesi içermesi.
- Dönen hesapların istenen müşteriyle ilişkili olması.
- Hedef hesabın başlangıç bakiyesinin transfer kontrolü için kaydedilmesi.

**Sonuç:** Hesap listesi ve bakiye alanı incelendi. Hedef hesabın başlangıç bakiyesi, transfer sonrası karşılaştırmada kullanıldı.

### API-02 — Hesap Detayını Görüntüleme

**Endpoint:** `GET /accounts/{accountId}`

**Amaç:** Belirli bir hesaba ait bilgilerin doğru döndürüldüğünü doğrulamak.

**Kontroller:**
- HTTP durum kodunun `200` olması.
- `id`, `customerId`, `type` ve `balance` alanlarının bulunması.
- Dönen hesap ID'sinin istenen hesap ID'siyle eşleşmesi.
- Kaynak hesabın başlangıç bakiyesinin kaydedilmesi.

**Gözlemlenen örnek yanıt:**

```json
{
  "id": 12345,
  "customerId": 12212,
  "type": "CHECKING",
  "balance": -2300.00
}
```

**Sonuç:** Hesap detayları alındı ve başlangıç bakiyesi transfer sonrası karşılaştırmada kullanıldı.

### API-03 — Hesaplar Arasında Para Transferi

**Endpoint:** `POST /transfer`

**Test verileri:**
- Kaynak hesap: `12345`
- Hedef hesap: `13011`
- Tutar: `5`

**Gözlenen yanıt:**

```text
Successfully transferred $5 from account #12345 to account #13011
```

**Kontroller:**
- HTTP durum kodunun `200` olması.
- Yanıtın transferin gerçekleştiğini belirtmesi.
- Transfer tutarının yanıtta bulunması.
- Kaynak ve hedef hesap numaralarının doğru belirtilmesi.
- Transfer öncesi ve sonrası bakiyelerin karşılaştırılması.

**Sonuç:** Transfer yanıtı ve bakiye kontrolleri başarılı oldu. Kaynak hesaptaki düşüş ve hedef hesaptaki artış doğrulandı.

### API-04 — İşlem Geçmişini Sorgulama

**Endpoint:** `GET /accounts/{accountId}/transactions`

**Amaç:** Belirli bir hesabın işlem geçmişinin doğru biçimde döndürüldüğünü doğrulamak.

**Kontroller:**

| Kontrol | Sonuç |
|---|---|
| HTTP durum kodu `200` | PASSED |
| Yanıtın işlem listesi olması | PASSED |
| Gerekli işlem alanlarının bulunması | PASSED |
| İşlemlerin istenen hesaba ait olması | PASSED |
| İşlem türü, tutar ve tarih verilerinin temel doğrulaması | PASSED |

Yanıtta şu alanlar gözlemlendi:

- `id`
- `accountId`
- `type`
- `date`
- `amount`
- `description`

**Sonuç:** Beş kontrolün tamamı başarılı oldu.

**Sınırlama:** İşlem geçmişinde aynı tutara sahip birden fazla transfer kaydı bulunduğu için API-03'teki belirli transferin geçmişe yansıması bağımsız olarak doğrulanmadı.

### API-05 — Geçersiz Hesap Numarası

**Endpoint:** `GET /accounts/999999999`

**Amaç:** Sistemde bulunmayan bir hesap için hata davranışını doğrulamak.

**Gözlenen sonuç:**
- HTTP durum kodu: `400`
- Yanıt mesajı: `Could not find account #999999999`

**Postman kontrolleri:**

| Kontrol | Sonuç |
|---|---|
| Geçersiz hesap için HTTP `400` dönmesi | PASSED |
| Yanıtın isteğin neden başarısız olduğunu açıklaması | PASSED |

**Sonuç:** API, bulunmayan hesap için hata yanıtı döndürdü ve hata mesajında ilgili hesap numarasını belirtti.

### API-06 — Sıfır Tutarlı Transfer

**Endpoint:** `POST /transfer`

**Test verileri:**
- Kaynak hesap: `12345`
- Hedef hesap: `13011`
- Tutar: `0`

**Beklenen davranış:** Transfer tutarının pozitif olması gerekiyorsa API sıfır tutarlı işlemi reddetmeli ve açıklayıcı bir hata yanıtı döndürmelidir.

**Gözlenen davranış:**
- HTTP durum kodu: `200`
- Yanıt: `Successfully transferred $0 from account...`

**Postman sonuçları:**

| Kontrol | Beklenen | Gerçek | Sonuç |
|---|---|---|---|
| Sıfır tutarlı transferin reddedilmesi | HTTP `400` veya `422` | HTTP `200` | FAILED |
| Hata nedeninin açıklanması | Açıklayıcı hata mesajı | Başarılı transfer mesajı | FAILED |

**Değerlendirme:** API, sıfır tutarlı transferi başarılı olarak yanıtladı. Bu davranış, sıfır tutarlı transferin yasak olduğu bir iş kuralı varsa doğrulama kusuruna işaret eder.

**Önemli not:** İki başarısız assertion aynı temel davranışla ilgilidir; otomatik olarak iki ayrı hata olarak değerlendirilmemelidir. Gereksinim teyidi ve bakiye/işlem geçmişi etkisinin incelenmesi gerekir.

## 5. Test Sonuçlarının Özeti

| Senaryo | Durum | Açıklama |
|---|---|---|
| API-01 — Hesapları listeleme | İncelendi | Hesap listesi ve başlangıç bakiyesi kullanıldı |
| API-02 — Hesap detayı | İncelendi | Hesap alanları ve başlangıç bakiyesi kullanıldı |
| API-03 — Para transferi | PASSED | Transfer yanıtı ve bakiye değişimi doğrulandı |
| API-04 — İşlem geçmişi | PASSED | Beş kontrol başarılı |
| API-05 — Geçersiz hesap | PASSED | İki kontrol başarılı |
| API-06 — Sıfır tutarlı transfer | FAILED | İki assertion başarısız; gerçek davranış beklenenle uyuşmadı |

> API-01 ve API-02 için yapılan tüm assertion sonuçları bu özet hazırlanırken ayrı bir test raporundan teyit edilmediğinden, bu senaryolar için kesin bir genel PASSED durumu iddia edilmemiştir.



## 6. Tasarım Değerlendirmesi

İncelenen API davranışları, yalnızca HTTP durum koduna bakmanın iş kurallarının doğru uygulandığını kanıtlamak için yeterli olmadığını göstermektedir.

Aşağıdaki iş kurallarının netleştirilmesi ve otomatik testlerle doğrulanması gerekir:

1. Transfer tutarı sıfır veya negatif olabilir mi?
2. Yetersiz bakiye durumunda işlem reddedilmeli mi?
3. Kaynak ve hedef hesap aynı olabilir mi?
4. Aynı transfer isteği yeniden gönderilirse mükerrer işlem nasıl önlenir?
5. Başarısız işlemler bakiyeleri ve işlem geçmişini değiştirmemeli mi?

Bu kuralların API sözleşmesinde açıkça tanımlanması, sunucu tarafında doğrulanması ve uygun hata yanıtlarıyla desteklenmesi gerekir.

## 7. Araç Seçimi

Testler Postman Collection ve Environment kullanılarak gerçekleştirildi.

Postman tercihinin nedenleri:
- API isteklerini ve testleri tek bir Collection altında toplamak.
- Ortak değişkenleri Environment üzerinden yönetmek.
- HTTP durum kodlarını ve yanıt gövdelerini assertion'larla doğrulamak.
- Testleri tekrar çalıştırmak ve sonuçları kanıtlarla paylaşmak.

Bu kapsam için Postman uygun bir seçimdir. Daha geniş regresyon kapsamı ve karmaşık test verisi yönetimi gerektiğinde API testleri Playwright gibi bir otomasyon çerçevesine de taşınabilir.



## 8. Genel Sonuç

ParaBank API'sinin hesap listeleme, hesap detayı, transfer, işlem geçmişi ve geçersiz hesap akışları incelenmiştir. API-04 için beş, API-05 için iki kontrol başarılı olmuştur. API-03 transfer yanıtı ve bakiye değişimi doğrulanmıştır.

API-06'da sıfır tutarlı transfer için iki kontrol başarısız olmuş; API'nin HTTP `200` ve başarılı işlem mesajı döndürdüğü görülmüştür. Bu bulgu, ilgili iş kuralı teyit edildiğinde doğrulama kusuru olarak ele alınmalıdır.


