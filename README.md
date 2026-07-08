#  DevFlow — Website Monitoring Progress SDLC

<div align="center">

  <!-- Logo Placeholder -->
  <img src="https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/www/public/og.png" alt="DevFlow Logo" width="200" style="border-radius: 12px; margin-bottom: 16px;" />

  <p><strong>Aplikasi Monitoring Progress Pengembangan Software Berbasis Alur Kerja SDLC Modern & Minimalis</strong></p>

  <!-- Badges -->
  [![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)](https://opensource.org/licenses/MIT)

  <!-- Screenshot Placeholder -->
  <img src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=1200&auto=format&fit=crop" alt="DevFlow Project Screenshot" width="100%" style="border-radius: 12px; border: 1px solid #e2e8f0; margin-top: 20px; margin-bottom: 20px;" />

</div>

---

## 📖 Tentang Proyek

**DevFlow** adalah website pemantauan progress pengembangan perangkat lunak yang dirancang untuk membantu Software Engineers, Product Managers, dan Stakeholders melacak siklus hidup software secara terstruktur.

Aplikasi ini beroperasi sepenuhnya secara **client-side (static website)** tanpa ketergantungan pada server backend, database eksternal, atau sistem autentikasi kompleks. Pelacakan tahapan didasarkan pada siklus **Software Development Life Cycle (SDLC)**, mulai dari perumusan ide awal hingga pemeliharaan sistem jangka panjang. Seluruh data proyek, catatan, dan progres checklist disimpan langsung di browser pengguna untuk kenyamanan instan dan kepatuhan privasi.

---

## ✨ Fitur Utama

- **📊 Dashboard Project**: Menyajikan ringkasan proyek aktif, batas waktu (deadline), penanggung jawab, skala prioritas, dan progress keseluruhan.
- **📍 SDLC Timeline**: Jalur timeline vertikal interaktif yang melacak 17 tahapan alur kerja pengembangan software.
- **📈 Progress Tracking**: Persentase progress dihitung secara otomatis berdasarkan rasio checklist tugas yang diselesaikan.
- **☑️ Interactive Checklist**: Butir checklist pekerjaan pada setiap tahap yang dapat dicentang, ditambahkan, atau dihapus secara dinamis.
- **📝 Notes & Remarks**: Bidang teks catatan per tahap yang terintegrasi dengan fitur penyimpanan otomatis (*auto-save*).
- **🔋 Statistics Card**: Ringkasan data kuantitatif yang menunjukkan total tahap, jumlah tahap selesai, sedang berjalan, dan belum dimulai.
- **📱 Responsive Design**: Antarmuka responsif yang disesuaikan untuk kenyamanan penggunaan di perangkat seluler, tablet, dan desktop.
- **🌙 Dark & Light Mode**: Skema warna modern minimalis bergaya Vercel & Linear dengan transisi yang halus.
- **💾 Local Storage Persistence**: Penyimpanan data instan di sisi client yang menjaga data Anda tetap aman saat halaman dimuat ulang.
- **⚡ Static Website & Ready to Deploy**: Siap dideploy ke layanan hosting statis seperti Vercel, Netlify, atau GitHub Pages tanpa konfigurasi server tambahan.

---

## 🔄 SDLC Workflow

Alur kerja pengembangan di dalam aplikasi mengikuti 17 tahapan standar industri berikut secara berurutan:

```mermaid
graph TD
    A[Business Idea] --> B[Market Research]
    B --> C[Requirement Analysis]
    C --> D[Software Requirement Specification - SRS]
    D --> E[Product Requirement Document - PRD]
    E --> F[User Flow]
    F --> G[Wireframe]
    G --> H[UI Design]
    H --> I[Design System]
    I --> J[Database Design]
    J --> K[API Design]
    K --> L[Software Architecture]
    L --> M[Development Sprint]
    M --> N[Testing]
    N --> O[Deployment]
    O --> P[Monitoring]
    P --> Q[Maintenance]

    style A fill:#3b82f6,stroke:#1d4ed8,stroke-width:2px,color:#fff
    style M fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
    style O fill:#10b981,stroke:#047857,stroke-width:2px,color:#fff
```

---

## 🛠️ Tech Stack

| Teknologi | Kategori | Fungsi |
| :--- | :--- | :--- |
| **Next.js / React** | Framework Frontend | Kerangka kerja rendering UI & Router |
| **TypeScript** | Bahasa Pemrograman | Keamanan tipe data statis & kejelasan kode |
| **Tailwind CSS** | Styling (CSS) | Kerangka CSS utilitas untuk desain modern dan responsif |
| **shadcn/ui** | Komponen UI | Reusable component bergaya minimalis & premium |
| **Lucide Icons** | Perpustakaan Ikon | Penyedia set ikon vektor clean & informatif |
| **Framer Motion** | Animasi | Animasi mikro untuk transisi halaman dan elemen |

---

## 📂 Folder Structure

Berikut adalah struktur direktori proyek yang terorganisir:

```text
src/
├── components/         # Komponen UI Reusable (Navbar, Sidebar, Checklist, dll.)
├── data/               # File JSON penyimpan dummy data proyek awal (projects.json)
├── pages/              # Halaman dashboard dan navigasi utama
├── styles/             # Stylesheet utama & kustomisasi tokens CSS
├── public/             # Aset statis (ikon, gambar, ilustrasi)
├── types/              # Deklarasi tipe data TypeScript (interfaces)
├── App.tsx             # Entry point komponen inti dan manajemen state
└── main.tsx            # Poin eksekusi React DOM render
```

---

## 💻 Panduan Instalasi

Ikuti langkah-langkah di bawah ini untuk menjalankan proyek di komputer lokal Anda:

1. **Clone Repositori**
   ```bash
   git clone <repository-url>
   ```
2. **Masuk ke Direktori Proyek**
   ```bash
   cd project
   ```
3. **Instalasi Dependensi**
   ```bash
   npm install
   ```
4. **Jalankan Development Server**
   ```bash
   npm run dev
   ```
   Buka [http://localhost:3000](http://localhost:3000) (atau port yang tertera pada terminal Anda) untuk melihat aplikasi.

---

## 📦 Build untuk Produksi

Untuk mengompilasi proyek menjadi kode produksi HTML, CSS, dan JS statis yang optimal:

```bash
npm run build
```
Hasil kompilasi akan berada di folder `dist/` (atau `.next/` jika menggunakan Next.js export).

---

## 🚀 Panduan Deployment

### Deploy ke Vercel (Rekomendasi)
1. Buat akun di [Vercel](https://vercel.com).
2. Hubungkan akun GitHub Anda dan pilih repositori proyek ini.
3. Vercel akan mendeteksi pengaturan proyek secara otomatis.
4. Klik tombol **Deploy**.

### Deploy ke GitHub Pages
1. Pastikan Anda mengonfigurasi base path di konfigurasi bundler (misalnya `vite.config.ts` atau `next.config.js`) jika nama repositori Anda bukan domain utama (misal: `https://username.github.io/nama-repo/`).
2. Instal paket `gh-pages` jika diperlukan, atau buat GitHub Actions workflow untuk otomatisasi build dan deploy.
3. Push kode Anda ke branch `gh-pages` atau direktori `/docs` di branch utama Anda.

---

## ⚙️ Konfigurasi Data

Aplikasi ini bekerja sepenuhnya di sisi klien:
- **Awal Mula Data**: Data dasar proyek didefinisikan secara statis di dalam file `src/data/projects.json`.
- **Modifikasi Pengguna**: Ketika pengguna mengubah status checklist, menambahkan tugas, menulis catatan, atau mengubah profil proyek, data hasil pembaruan langsung disimpan ke **Local Storage** browser dengan nama key `devflow_projects`.

---

## 📸 Screenshots (Placeholder)

Berikut adalah visualisasi antarmuka utama dari aplikasi:

| Dashboard Overview | Vertikal Timeline & Checklist |
| :--- | :--- |
| ![Dashboard Overview](https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=500&auto=format&fit=crop) | ![Timeline SDLC](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=500&auto=format&fit=crop) |

| Checklist Mode | Dark Mode & Mobile View |
| :--- | :--- |
| ![Checklist Detail](https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=500&auto=format&fit=crop) | ![Dark & Mobile](https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=500&auto=format&fit=crop) |

---

## 🗺️ Roadmap Pengembangan

Rencana penambahan fitur di masa mendatang untuk mengubah aplikasi statis ini menjadi platform kolaboratif:

- [ ] 🔐 **Sistem Login**: Integrasi dengan layanan OAuth (Google, GitHub) atau email/password.
- [ ] 🖥️ **Backend Server**: Sinkronisasi data multi-user menggunakan REST atau GraphQL API.
- [ ] 🗄️ **Database Integration**: Menyimpan data proyek di database cloud (PostgreSQL, MongoDB).
- [ ] 📁 **File Upload**: Kemampuan untuk mengunggah berkas asli secara langsung (bukan sekadar daftar nama dokumen).
- [ ] 👥 **Kolaborasi Tim**: Berbagi proyek, menugaskan anggota tim pada tahap tertentu, dan komentar real-time.
- [ ] 🔔 **Notifikasi**: Pemberitahuan email/browser untuk deadline dan pembaruan penting.
- [ ] 📅 **Kalender Integrasi**: Tampilan deadline dalam bentuk kalender bulanan/mingguan.
- [ ] 📊 **Gantt Chart**: Visualisasi rentang waktu tahapan SDLC yang interaktif untuk proyek skala besar.

---

## 🤝 Kontribusi

Kontribusi selalu diterima dengan tangan terbuka! Jika Anda memiliki ide atau perbaikan bug:

1. Lakukan **Fork** pada repositori ini.
2. Buat branch fitur baru Anda (`git checkout -b fitur/FiturKeren`).
3. Lakukan commit pada perubahan Anda (`git commit -m 'Menambahkan fitur keren'`).
4. Push ke branch tersebut (`git push origin fitur/FiturKeren`).
5. Buat **Pull Request** baru di GitHub.

---

## 📄 License

Proyek ini dilisensikan di bawah lisensi MIT - lihat file [LICENSE](LICENSE) untuk detail lebih lanjut.

---

## 👤 Author

* **Nama Lengkap** - *Software Engineer*
* GitHub: [@yourusername](https://github.com/yourusername)
* LinkedIn: [yourprofile](https://linkedin.com/in/yourprofile)
* Website: [yourwebsite.com](https://yourwebsite.com)
