# NexusWeb Market

NexusWeb Market adalah web marketplace modern berbasis Next.js yang dirancang untuk menampilkan produk secara premium, responsif, dan profesional. Aplikasi ini memiliki sistem autentikasi admin, CRUD produk, formulir kontak yang tersimpan ke database, serta integrasi Drizzle ORM dan TiDB Cloud.

## Ringkasan

Proyek ini dibuat untuk menjadi landing page dan marketplace kecil yang terlihat kredibel, cepat, dan mudah dikelola. Admin dapat menambah, mengubah, dan menghapus produk, sedangkan pengunjung dapat melihat katalog produk dan mengirim pesan melalui form kontak.

## Fitur Utama

- Landing page modern dan responsif
- Hero section, about section, services, product catalog, dan contact form
- Login dengan Auth.js v5 dan GitHub provider
- Role-based access control untuk admin
- CRUD produk: tambah, edit, hapus
- Dukungan image URL untuk produk
- Form kontak yang menyimpan pesan ke database
- Integrasi Drizzle ORM
- Database TiDB Cloud
- UI premium dengan animasi dan efek glassmorphism

## Tech Stack

- Next.js
- React
- TypeScript
- Auth.js v5 / NextAuth
- Drizzle ORM
- TiDB Cloud Serverless
- Framer Motion
- Lucide React

## Cara Menjalankan

### 1. Install dependency

```bash
npm install
```

### 2. Isi environment variable

Buat file `.env` lalu sesuaikan variabel berikut:

```env
DATABASE_URL=
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=
AUTH_ADMIN_EMAIL=
AUTH_SECRET=
AUTH_TRUST_HOST=true
```

### 3. Jalankan development server

```bash
npm run dev
```

Buka:

```bash
http://localhost:3000
```

## Skrip Tersedia

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Struktur Singkat

- `app/page.tsx` - halaman utama dan fetch data server-side
- `app/components/ClientSections.tsx` - UI utama client, termasuk product list dan drawer
- `app/lib/actions.ts` - server actions untuk CRUD produk dan pesan kontak
- `auth.ts` - konfigurasi Auth.js v5
- `db/schema.ts` - schema Drizzle
- `app/api/auth/[...nextauth]/route.ts` - route handler Auth.js

## Catatan Admin

Akun admin ditentukan dari email yang sama dengan `AUTH_ADMIN_EMAIL`. Jika email login cocok, session akan mendapatkan role `admin` dan tombol admin seperti Add Product akan muncul.

## Deploy

Aplikasi ini bisa dideploy ke platform yang mendukung Next.js seperti Vercel atau hosting Node.js lainnya. Pastikan environment variable sudah diisi dan database sudah terhubung.

## Lisensi

Private project.
