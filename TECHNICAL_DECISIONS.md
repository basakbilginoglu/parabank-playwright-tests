
# Teknik Kararlar

## 1. Risk Seçimi ve Önceliklendirme

ParaBank, değerlendirme görevi kapsamında sağlanmıştır. Test stratejisi, uygulamanın para transferi akışı ve bu akışta gözlemlenen davranışlar temel alınarak oluşturulmuştur.

Üç ana risk önceliklendirilmiştir:

1. **Geçersiz transfer tutarları:** Sıfır ve negatif tutarlarla yapılan transferlerin başarılı kabul edilmesi, hesap bakiyelerinin beklenmeyen şekilde değişmesine neden olabilir. Testler, uygulamanın bu sınır durumlarına verdiği yanıtı ve bakiye üzerindeki etkisini inceler.
2. **Transfer sınırlarının ihlali:** Yetersiz bakiye veya aynı kaynak ve hedef hesap kullanımı, hesap bakiyelerinin beklenen iş kurallarına aykırı biçimde değişmesi riskini taşır. Bu senaryolarda işlem sonucu ve hesap durumları birlikte değerlendirilir.
3. **Yinelenen transferler ve işlem tutarlılığı:** Aynı transferin tekrar işlenmesi, beklenmeyen bakiye değişikliklerine ve işlem geçmişinde tutarsızlıklara neden olabilir. Bu risk, tekrar eden isteklerin ve işlem kayıtlarının sonuçları üzerinden ele alınır.

Risk önceliklendirmesinde olası iş etkisi ve testlerin sağlayabileceği kanıt dikkate alınmıştır. Para transferinde yalnızca başarılı yanıt veya onay mesajı yeterli kabul edilmemiş; hesap bakiyeleri ve işlem geçmişi de değerlendirmeye dahil edilmiştir.

## 2. Test Katmanı Kararları

### UI — Playwright

Playwright UI testleri giriş yapma, hesap özetini görüntüleme, para transferi ve işlem geçmişi akışlarına odaklanır. Bu katman, kullanıcı etkileşimlerinin ve işlem sonuçlarının arayüzde doğru yansıtılıp yansıtılmadığını doğrular.

UI'da görülen “Transfer Complete!” mesajı tek başına transferin doğru gerçekleştiğini kanıtlamaz. Bu nedenle transfer senaryolarında mümkün olduğunda mesajın yanı sıra hesap bakiyeleri ve işlem geçmişi de kontrol edilir.

### API — Postman

Postman testleri API yanıtlarını, durum kodlarını, yanıt içeriklerini ve transfer sınır durumlarını inceler. API katmanı, iş kurallarının kullanıcı arayüzünden bağımsız değerlendirilmesini ve negatif senaryolara daha doğrudan geri bildirim alınmasını sağlar.

Test sonuçları, yanıtın yalnızca HTTP düzeyinde başarılı olup olmadığına göre değerlendirilmez. Örneğin sıfır tutarlı transfer isteğinin başarılı yanıt vermesi, beklenen iş davranışının sağlandığı anlamına gelmez.

### Veritabanı — Doğrudan İnceleme

Veritabanı incelemesi, katmanlar arasında görülen farklılıkları araştırmak ve işlemlerin kalıcı veriler üzerindeki etkisini anlamak amacıyla kullanılmıştır. UI, API yanıtı, hesap bakiyesi ve işlem kaydı arasındaki tutarsızlıklar bu incelemede karşılaştırılabilir.

Bu çalışma, otomatik veritabanı test paketi olarak değil, test bulgularını araştırmaya ve uygulama davranışını anlamaya yardımcı olan bir inceleme yöntemi olarak ele alınmıştır.

## 3. Test Oracle'ı ve Doğrulama Yaklaşımı

Test oracle'ı, uygulamanın bir işlem için ürettiği sonucun beklenen davranışla karşılaştırılmasıdır. ParaBank projesinde tek bir çıktı yerine birbiriyle ilişkili kanıtlar değerlendirilmiştir:

- HTTP durum kodu ve yanıt içeriği.
- UI üzerindeki işlem sonucu.
- Transfer öncesi ve sonrası kaynak ve hedef hesap bakiyeleri.
- İşlem geçmişindeki kayıtlar.
- Gerektiğinde doğrudan incelenen kalıcı veriler.

Geçerli bir transferde kaynak hesaptaki azalma, hedef hesaptaki artış ve işlem kaydı transfer tutarıyla tutarlı olmalıdır. Geçersiz bir transferde ise beklenen davranış, isteğin reddedilmesi ve hesaplarda istenmeyen değişiklik oluşmamasıdır.

Uygulamanın fiilen gösterdiği davranış ile beklenen iş kuralı birbirinden ayrılmıştır. Örneğin uygulamanın negatif tutarlı bir transferi başarılı göstermesi, beklenen davranışın da bu olduğu anlamına gelmez. Böyle bir sonuç, uygulama davranışının ayrıca incelenmesini gerektiren bir bulgudur.

## 4. Test Verisi ve Ortam Kararları

ParaBank yerel ortamda Docker kullanılarak çalıştırılmıştır. Testlerin yürütülmesinde uygulamanın erişilebilir olması ve gerekli kimlik bilgilerinin sağlanması ortam ön koşullarıdır. Gizli bilgiler kaynak kod deposunda tutulmaz; CI ortamında gerekli kimlik bilgileri repository secrets üzerinden sağlanır.

Para transferi testleri, hesap bakiyelerini ve işlem geçmişini değiştirebildiği için paylaşılan test verisine bağımlıdır. Bu nedenle transfer sonuçları değerlendirilirken ilgili başlangıç bakiyesi, transfer tutarı ve işlem sonrası durum birlikte ele alınmıştır. Sabit bir bakiyenin her çalıştırmada korunacağı varsayılmadığından, daha önceki testlerin oluşturduğu değişiklikler sonuçların yorumlanmasında dikkate alınmıştır.

Bu yaklaşım, özellikle bakiye değişimlerinin ve işlem kayıtlarının karşılaştırıldığı senaryolarda önemlidir. Ortak test verisi, testler arasında bağımlılık oluşması ve sonuçların tekrar üretilebilirliğinin azalması açısından bilinen bir sınırlamadır.

## 5. POM ve Fixture Tercihleri

Page Object Model (POM), sayfa etkileşimlerini ve locator tanımlarını test senaryolarından ayırmak için kullanılmıştır. Böylece testler, arayüzdeki her adımı doğrudan uygulamak yerine doğruladıkları davranışı daha açık biçimde ifade eder. Ortak işlemlerin yeniden kullanılabilmesi de bakım kolaylığı sağlar.

POM'un maliyeti, ek dosyalar ve soyutlamalar nedeniyle oluşan bakım yüküdür. Gereğinden fazla soyutlama, basit testlerin izlenmesini zorlaştırabilir. Bu nedenle sayfa nesneleri, ortak etkileşimleri merkezileştiren ve test okunabilirliğini artıran bir yapı olarak değerlendirilmiştir.

Fixture'lar, ortak hazırlık adımlarını ve test bağlamını standartlaştırmak için yararlıdır. Bununla birlikte, fixture yaşam döngüsü ve bağımlılıkları testlerin nasıl hazırlandığını anlamayı zorlaştırabilir. Bu projede yapıların değeri, tekrar eden hazırlığı azaltmaları ve testlerin anlaşılabilirliğine katkıları üzerinden değerlendirilmiştir.

## 6. Ekip Büyüdüğünde Öncelikli İyileştirmeler

1. **Test verisi izolasyonu:** Hesap bakiyeleri ve işlem geçmişi testler arasında değişebildiğinden, güvenilir veri hazırlığı ve sıfırlama mekanizması tekrar üretilebilirliği artıracak en önemli iyileştirmelerden biridir.
2. **Katmanlar arası doğrulama:** Yüksek riskli transfer senaryolarında UI, API ve kalıcı veri kanıtlarının ilişkilendirilmesi, başarılı görünen ancak yanlış sonuç üreten işlemlerin tespitini güçlendirir.
3. **CI tanılaması ve sürdürülebilirlik:** Açık typecheck ve test adımları, başarısız çalıştırmalara ait rapor ve ekran görüntüleri ile belgelenmiş ortam gereksinimleri, sorunların daha hızlı araştırılmasını ve ekip içinde paylaşılmasını destekler.

Bu iyileştirmeler, mevcut test yaklaşımının karşılaştığı temel sınırlamalarla ilişkilidir: değişken test verisi, katmanlar arasında tutarlılık ihtiyacı ve hataların tekrarlanabilir biçimde incelenmesi.

## 7. Mentor Sorusu: Hangi Testi Çıkarırdım ve Neden?

İlk olarak, aynı iş kuralını API seviyesinde yeterli biçimde doğrulayan ve UI katmanında ek bir kullanıcı davranışı kanıtı sağlamayan tekrarlı bir UI testini değerlendirmeye alırdım.

Bu kararın nedeni yalnızca testin çalışma süresinin daha uzun olması değildir. API testi, iş kuralı için daha hızlı geri bildirim sağlayabilirken UI testi kullanıcı akışının doğru çalıştığına ilişkin farklı bir kanıt sunar. Bu nedenle iki test aynı amaca hizmet ediyor ve UI testi ek bir doğrulama değeri sağlamıyorsa, UI testinin bakım ve yürütme maliyeti sağladığı ek kanıtla karşılaştırılır.

Yüksek riskli bir senaryonun tek doğrulaması olan test, yalnızca yavaş olduğu veya başarısız sonuç verdiği için çıkarılmaz. Test seçimi; bakım maliyeti, kapsanan risk ve sağlanan benzersiz kanıt arasındaki dengeye dayanır. Amaç, kritik risk kapsamını korurken gereksiz tekrarları azaltmaktır.
