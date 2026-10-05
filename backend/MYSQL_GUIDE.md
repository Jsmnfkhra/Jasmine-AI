# Cara Melihat Data MySQL (Database `jasmine_ai`)

Semua data chat (users, conversations, messages) tersimpan di MySQL
database `jasmine_ai`.

## Password & Koneksi

- Host: `localhost`
- Port: `3306`
- User: `root`
- Password: `JsmnnF198*`
- Database: `jasmine_ai`

## Opsi 1 — Lewat Command Line (paling cepat)

Buka **PowerShell / CMD** lalu jalankan (sesuaikan path mysql.exe):

```powershell
& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p"JsmnnF198*" -D jasmine_ai -e "SELECT * FROM users;"
```

Perintah yang umum dipakai:

```powershell
# Lihat semua tabel yang ada
mysql -u root -p -D jasmine_ai -e "SHOW TABLES;"

# Lihat semua user
mysql -u root -p -D jasmine_ai -e "SELECT * FROM users;"

# Lihat semua percakapan
mysql -u root -p -D jasmine_ai -e "SELECT * FROM conversations;"

# Lihat semua pesan
mysql -u root -p -D jasmine_ai -e "SELECT * FROM messages;"

# Lihat pesan beserta isinya (lebih ringkas, tidak menampilkan image_data yang panjang)
mysql -u root -p -D jasmine_ai -e "SELECT id, conversation_id, sender, LEFT(text, 60) AS text FROM messages ORDER BY id DESC LIMIT 20;"
```

> Catatan: di PowerShell, gunakan `& "path mysql.exe"` dan `-p"password"`
> tanpa spasi. Tanda `&` memanggil executable ber-path-spasi.
> Jika tidak mau password di command history, pakai `mysql -u root -p` lalu
> ketik password saat diminta.

## Opsi 2 — MySQL Workbench (GUI, paling mudah)

1. Buka **MySQL Workbench**.
2. Klik ikon `+` untuk koneksi baru.
3. Isi:
   - Connection Name: `Jasmine AI`
   - Hostname: `localhost`
   - Port: `3306`
   - Username: `root`
   - Password: klik **Store in Vault** lalu isi `JsmnnF198*`
4. Klik **Test Connection** → bila sukses klik **OK** lalu **Connect**.
5. Di panel kiri, cari schema `jasmine_ai`, lalu klik tabel
   (`users`, `conversations`, `messages`) untuk melihat datanya.
6. Atau buka tab **Query** dan jalankan:
   ```sql
   USE jasmine_ai;
   SELECT * FROM users;
   SELECT * FROM conversations;
   SELECT * FROM messages;
   ```

## Opsi 3 — Lewat Script / Kode

Bisa juga lewat file Python menggunakan SQLAlchemy:

```python
# lihat_data.py
from app.database.connection import SessionLocal
from app.models.user import User
from app.models.conversation import Conversation
from app.models.message import Message

db = SessionLocal()

for u in db.query(User).all():
    print(u.id, u.email, u.username)

for c in db.query(Conversation).all():
    print(c.id, c.user_id, c.title)

for m in db.query(Message).all():
    print(m.id, m.conversation_id, m.sender, m.text[:50])

db.close()
```

Jalankan dari folder `backend`:

```powershell
venv\Scripts\python -m app.scripts.lihat_data
```

## Catatan

- Kolom `messages.image_data`: berisi `base64` (gambar yang dikirim user)
  atau `[JSON array URL]` (foto yang dikirim AI).
- Hapus data test itu aman, tapi jangan hapus user asli
  (`fakhirajasmine7@gmail.com`) dan percakapannya kecuali memang mau.
