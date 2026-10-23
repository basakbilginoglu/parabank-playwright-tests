# ENVIRONMENT_CHECK.md

**Tarih:** 21.10.2026
**Saat:** 15:43

- **Local UI:** http://localhost:8080/parabank/index.htm
- **Public demo:** https://parabank.parasoft.com/parabank/index.htm

## 1. Ortam Kontrolü

| Kontrol | Sonuç | Açıklama |
|---|---|---|
| UI | PASS | Local UI açıldı. |
| API | PASS | Hesap detayı endpoint'i `200 OK` döndürdü. |
| Docker | PASS | `parabank-t03` container'ı çalışıyor. |
| DB | Kısmi | HSQLDB container içinde `9001` portunda dinliyor; doğrudan SQL bağlantısı doğrulanmadı. |
| Güvenlik | Uygun | Gerçek müşteri verisi ve kontrolsüz veri değişikliklerinden kaçınılmalı. |

## 2. API Kontrolü

**Request:** `GET /parabank/services/bank/accounts/12345`

**HTTP Status:** `200 OK`

**Content-Type:** `application/json`

**Response:**

```json
{
  "id": 12345,
  "customerId": 12212,
  "type": "CHECKING",
  "balance": -2300.00
}
```

Gerekli alanlar doğrulandı. Negatif bakiye tek başına bug kanıtı değildir; iş gereksinimleriyle karşılaştırılmalıdır.

## 3. Docker Kontrolü
docker images parasoft/parabank
- **Image:** `parasoft/parabank`

docker ps --filter name=parabank-t03
- **Container:** `parabank-t03` — `Up`

- **Port:** `8080:8080`
docker logs --tail 80 parabank-t03
- **Log:** Tomcat başladı; HSQLDB 2.7.4, container içinde `9001` portunda dinlemeye başladı.
- **Image Tag:** latest

**Kanıtlar:**
- `evidence/docker-images.png`
- `evidence/docker-containers.png`
- `evidence/ui-local.png`
- `evidence/parabank-startup.log`



## 4. OpenAPI Keşfi

Dokümantasyon: https://parabank.parasoft.com/parabankv2/api-docs/index.html

Hesap listeleme ve hesap detayı GET istekleri yerelde doğrulandı. Transfer ve transaction endpoint'lerinin method, path, parametre ve response tipleri dokümantasyondan incelenerek eklenmelidir.

## 5. Mentor Sorusu

**Public ortamda geçen bir test local ortamda başarısız olursa ne yaparım?**

Önce ürünün veya ortamın hatalı olduğuna karar vermem. URL, sürüm, konfigürasyon, test verisi, DB durumu ve servis bağımlılıklarını karşılaştırırım. Logları, request/response verilerini ve trace'leri incelerim. Sorun gereksinime aykırı ürün davranışıysa bug; ortam farkından kaynaklanıyorsa çevresel sorun olarak değerlendiririm.

## 6. Sonuç

Local UI, API ve Docker container erişimi doğrulandı. Teslim öncesinde ekran görüntüleri eklenmeli, image tag'i doğrulanmalı ve transfer/transaction endpoint bilgileri tamamlanmalıdır.