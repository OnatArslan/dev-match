---

#### 🧩 Type (commit türleri)

| Type | Açıklama | Örnek |
|------|-----------|--------|
| **feat** | Yeni özellik / endpoint / model | `feat(project): implement project creation API` |
| **fix** | Hata düzeltmesi | `fix(auth): wrong password check condition` |
| **refactor** | Yapısal değişiklik (davranış değişmeden) | `refactor(user): move hashing to shared utils` |
| **chore** | Altyapı, bağımlılık, config değişikliği | `chore(env): update dotenv paths for keys` |
| **docs** | Sadece dokümantasyon değişikliği | `docs(readme): explain JWT key setup` |
| **test** | Test ekleme veya düzenleme | `test(auth): add signup integration tests` |
| **style** | Format / lint / boşluk düzeni | `style(app): format imports order` |
| **perf** | Performans iyileştirmesi | `perf(prisma): optimize user include fields` |
| **build** | Build veya deploy ayarları | `build(docker): add node 20 base image` |
| **ci** | CI/CD pipeline değişiklikleri | `ci(github): add staging workflow` |

---

#### 🧩 Scope (parantez içi modül adı)

| Scope            | Açıklama                          |
| ---------------- | --------------------------------- |
| **auth**         | Signup, login, JWT, refresh       |
| **user**         | Profil, follow, update            |
| **project**      | Job posting, project management   |
| **proposal**     | Teklif akışı                      |
| **contract**     | Sözleşmeler                       |
| **timelog**      | Çalışma kayıtları                 |
| **invoice**      | Faturalandırma                    |
| **payment**      | Stripe / ödemeler                 |
| **notification** | E-posta, push bildirimler         |
| **admin**        | Admin panel API’leri              |
| **core**         | app.js, server.js, prisma, logger |
| **docs**         | Dokümantasyon ve README           |
| **config**       | dotenv, eslint, jest, vs.         |

---

#### 🧱 Kurallar

- Kısa mesaj **en fazla 72 karakter**.
- İngilizce, **emir kipinde** yaz: `add`, `fix`, `move`, `remove`, `implement` vs.
- Sonuna **nokta koyma.**
- Türkçe mesaj yazma (evrensellik için).
- Tür + scope arasında parantez zorunlu: `feat(auth): ...`

---

#### 🧩 Body ve Footer (isteğe bağlı)
