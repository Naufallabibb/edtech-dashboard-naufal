# 🎓 EdTech Admin Panel - Platform Pembelajaran Matematika Interaktif

## 📋 Daftar Isi

* Tentang Proyek
* Fitur Utama
* Demo Video
* Teknologi yang Digunakan
* Struktur Folder
* Instalasi dan Setup
* Konfigurasi Firebase
* Menjalankan Aplikasi
* Fitur Detail
* Screenshot
* Arsitektur Aplikasi
* Kontak

## 📖 Tentang Proyek

**EdTech Admin Panel** adalah aplikasi web berbasis React.js yang dirancang untuk mengelola platform pembelajaran matematika interaktif. Aplikasi ini menyediakan interface admin yang lengkap dengan fitur manajemen tutor, penjadwalan booking, serta dashboard analytics yang informatif.

Proyek ini dibuat sebagai bagian dari **Technical Test Web Developer Internship** di EdTech Indonesia, dengan fokus pada:

* ✅ Implementasi CRUD (Create, Read, Update, Delete) lengkap
* ✅ Integrasi Firebase (Authentication & Firestore)
* ✅ State Management dengan Redux Toolkit
* ✅ UI/UX responsif dengan TailwindCSS
* ✅ Dark Mode Support
* ✅ Real-time Data Synchronization

## ✨ Fitur Utama

### 🔐 Authentication

* Login dengan Firebase Authentication (Email & Password)
* Protected Routes untuk keamanan aplikasi
* Logout dengan konfirmasi dialog
* Session management otomatis

### 📊 Dashboard

* **Statistics Cards** : Total Tutors, Total Bookings, Upcoming Sessions, Growth Rate
* **Weekly Bookings Chart** : Visualisasi data booking 7 hari terakhir menggunakan Recharts
* **Upcoming Sessions** : Daftar sesi pembelajaran 3 hari ke depan
* **Latest Tutors** : Preview tutor terbaru dengan pagination
* Real-time data updates dari Firestore

### 👨‍🏫 Manajemen Tutor

* CRUD lengkap untuk data tutor
* Form validation komprehensif
* Search dan filter berdasarkan status (Active/Inactive)
* Tabel responsif dengan pagination
* Avatar generator otomatis
* Subjects selection: 24+ mata pelajaran tersedia
* Hourly rate management dalam Rupiah (Rp)

### 📅 Manajemen Booking

* CRUD lengkap untuk booking sesi pembelajaran
* Dropdown tutor dengan informasi lengkap (nama, subject, rate)
* Validasi tanggal dan waktu (tidak boleh masa lalu)
* Filter berdasarkan status: Scheduled, Completed, Cancelled
* Informasi detail: Tutor, Student, Date, Time, Status
* Responsive table layout dengan pagination
* Warning alert jika belum ada tutor aktif

### 🎨 UI/UX Features

* **Dark Mode** : Toggle tema terang/gelap dengan transisi smooth
* **Skeleton Loading** : Loading state yang informatif
* **Toast Notifications** : Feedback real-time untuk setiap aksi (Sonner)
* **Responsive Design** : Mobile-first approach, optimal di semua device
* **Custom Scrollbar** : Gradient scrollbar dengan StudyIO branding
* **Empty States** : Ilustrasi dan call-to-action untuk data kosong
* **Modal Forms** : Dialog forms yang clean dan user-friendly

## 🛠 Teknologi yang Digunakan

### Core Technologies

* **React 19.1.1** - UI Library
* **Vite 7.1.7** - Build Tool & Dev Server
* **React Router DOM 7.9.4** - Client-side Routing

### State Management

* **Redux Toolkit 2.9.2** - State Management
* **React Redux 9.2.0** - React bindings untuk Redux

### Backend & Database

* **Firebase 12.4.0** - Authentication & Firestore Database
  * Firebase Authentication - User authentication
  * Cloud Firestore - NoSQL database

### UI Framework & Styling

* **TailwindCSS 4.1.16** - Utility-first CSS Framework
* **@tailwindcss/vite 4.1.16** - Tailwind Vite Plugin
* **tw-animate-css 1.4.0** - Animation utilities
* **Radix UI** - Headless UI Components
  * @radix-ui/react-dialog
  * @radix-ui/react-select
  * @radix-ui/react-alert-dialog
  * @radix-ui/react-separator
  * @radix-ui/react-label

### Additional Libraries

* **Recharts 2.15.4** - Chart visualization untuk dashboard
* **FontAwesome 7.1.0** - Icon library
* **Sonner 2.0.7** - Toast notifications
* **next-themes 0.4.6** - Theme management (Dark/Light mode)
* **React Hook Form 7.65.0** - Form state management
* **Zod 4.1.12** - Schema validation
* **clsx & tailwind-merge** - Conditional className utilities

## 📁 Struktur Folder

```

EDTECH_NAUFAL/
│
├── src/
│   ├── assets/
│   │   └── main.css                    # Global styles & TailwindCSS config
│   │
│   ├── components/
│   │   ├── ui/                         # Reusable UI components (ShacnUI)
│   │   ├── BookingCard.jsx             # Booking table row component
│   │   ├── BookingForm.jsx             # Add/Edit booking modal form
│   │   ├── Layout.jsx                  # Main layout with sidebar & header
│   │   ├── mode-toggle.jsx             # Dark/Light theme toggle
│   │   ├── Pagination.jsx              # Reusable pagination component
│   │   ├── ProtectedRoute.jsx          # Authentication route guard
│   │   ├── theme-provider.jsx          # Theme context provider
│   │   ├── TutorCard.jsx               # Tutor table row component
│   │   └── TutorForm.jsx               # Add/Edit tutor modal form
│   │
│   ├── contexts/
│   │   └── theme-context.js            # Theme context definition
│   │
│   ├── hooks/
│   │   ├── use-auth.js                 # Custom hook untuk authentication
│   │   └── use-theme.js                # Custom hook untuk theme management
│   │
│   ├── lib/
│   │   └── utils.js                    # Utility functions (cn helper)
│   │
│   ├── pages/
│   │   ├── Bookings.jsx                # Bookings management page
│   │   ├── Dashboard.jsx               # Dashboard with analytics
│   │   ├── Login.jsx                   # Login page
│   │   └── Tutors.jsx                  # Tutors management page
│   │
│   ├── services/
│   │   ├── firebase.js                 # Firebase configuration
│   │   └── firestoreHelpers.js         # Firestore CRUD operations
│   │
│   ├── store/
│   │   ├── slices/
│   │   │   ├── authSlice.js            # Authentication state
│   │   │   ├── bookingsSlice.js        # Bookings state & async thunks
│   │   │   └── tutorsSlice.js          # Tutors state & async thunks
│   │   └── store.js                    # Redux store configuration
│   │
│   ├── App.jsx                         # Main app component with routing
│   └── main.jsx                        # App entry point
│
├── public/
│   ├── edtech_logo.svg                 # App logo
│   └── edtech_login.png                # Login illustration
│   └── edtech_title.png                # Title logo
|
├── .env.example                        # Environment variables template
├── .gitignore                          # Git ignore rules
├── package.json                        # Dependencies & scripts
├── vite.config.js                      # Vite configuration
└── README.md                           # Project documentation
```

## 🚀 Instalasi dan Setup

### Prerequisites

Pastikan Anda telah menginstal:

* **Node.js** (v18.x atau lebih tinggi)
* **npm** atau **yarn** atau **pnpm**
* **Git**
* Akun **Firebase** (untuk konfigurasi backend)

### Langkah 1: Clone Repository

bash

```bash
git clone https://github.com/Naufallabibb/edtech-dashboard-naufal.git
cd edtech-admin-panel
```

### Langkah 2: Install Dependencies

bash

```bash
npminstall
# atau
yarninstall
# atau
pnpminstall
```

### Langkah 3: Setup Environment Variables

1. Copy file `.env.example` menjadi `.env`:

bash

```bash
cp .env.example .env
```

2. Buka file `.env` dan isi dengan kredensial Firebase Anda:

env

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
```

## 🔥 Konfigurasi Firebase

### 1. Buat Project Firebase

1. Kunjungi [Firebase Console](https://console.firebase.google.com/)
2. Klik **"Add Project"** atau **"Create a project"**
3. Berikan nama project (contoh: `edtech-admin-panel`)
4. Ikuti wizard setup hingga selesai

### 2. Enable Authentication

1. Di Firebase Console, pilih project Anda
2. Buka **Authentication** > **Sign-in method**
3. Enable **Email/Password** provider
4. Klik **Save**

### 3. Create Firestore Database

1. Buka **Firestore Database** dari sidebar
2. Klik **"Create database"**
3. Pilih **Start in production mode** (kita akan set rules nanti)
4. Pilih location server (pilih yang terdekat dengan Indonesia, misalnya `asia-southeast1`)
5. Klik **Enable**

### 4. Set Firestore Security Rules

Setelah database dibuat, buka **Rules** tab dan ganti dengan:

javascript

```javascript
rules_version ='2';
service cloud.firestore{
  match /databases/{database}/documents {
// Allow authenticated users to read and write all documents
    match /{document=**}{
      allow read,write:if request.auth!=null;
}
}
}
```

Klik **Publish** untuk menerapkan rules.

### 5. Create User Account

Ada 2 cara untuk membuat user admin:

#### Opsi A: Melalui Firebase Console (Recommended)

1. Buka **Authentication** > **Users**
2. Klik **"Add user"**
3. Masukkan email: `admin@edtech.com`
4. Masukkan password: `admin123` (atau password pilihan Anda)
5. Klik **"Add user"**

#### Opsi B: Temporary Registration (Not recommended for production)

Jika Anda ingin membuat halaman registrasi sementara, Anda bisa menambahkan:

javascript

```javascript
// Temporary - untuk development only
import{ createUserWithEmailAndPassword }from'firebase/auth';

constregisterUser=async()=>{
try{
awaitcreateUserWithEmailAndPassword(auth,'admin@edtech.com','admin123');
console.log('User created successfully');
}catch(error){
console.error('Error creating user:', error);
}
};
```

### 6. Get Firebase Configuration

1. Di Firebase Console, klik **⚙️ Settings** > **Project settings**
2. Scroll ke bawah ke section **"Your apps"**
3. Klik icon **Web** (`</>`) untuk menambahkan web app
4. Berikan nickname (contoh: `edtech-web-admin`)
5. **JANGAN** centang Firebase Hosting
6. Klik **Register app**
7. Copy konfigurasi Firebase yang muncul
8. Paste nilai-nilai tersebut ke file `.env` Anda

### 7. Create Initial Collections (Optional)

Anda bisa membuat struktur collection awal:

#### Collection: `tutors`

javascript

```javascript
{
name:"John Doe",
email:"john@example.com",
subject:"Matematika",
hourlyRate:50000,
status:"active",
createdAt:Timestamp,
updatedAt:Timestamp
}
```

#### Collection: `bookings`

javascript

```javascript
{
tutorId:"tutor_doc_id",
tutorName:"John Doe",
tutorEmail:"john@example.com",
tutorSubject:"Matematika",
studentName:"Jane Smith",
date:"2025-01-15",
startTime:"10:00",
endTime:"11:00",
status:"scheduled",
createdAt:Timestamp,
updatedAt:Timestamp
}
```

## 🏃‍♂️ Menjalankan Aplikasi

### Development Mode

bash

```bash
npm run dev
```

Aplikasi akan berjalan di: `http://localhost:5173`

### Build untuk Production

bash

```bash
npm run build
```

Output build akan tersimpan di folder `dist/`

### Preview Production Build

bash

```bash
npm run preview
```

### Login Credentials (Development)

```
Email: admin@edtech.com
Password: admin123
```

*Note: Sesuaikan dengan credentials yang Anda buat di Firebase Authentication*

## 🎯 Fitur Detail

### 1. Authentication Flow

* **Login Page** (`/login`)
  * Form dengan validasi email dan password
  * Password visibility toggle
  * Error handling dengan toast notification
  * Redirect otomatis ke dashboard setelah login berhasil
  * Responsive design dengan ilustrasi di desktop
* **Protected Routes**
  * Semua route kecuali `/login` memerlukan autentikasi
  * Redirect otomatis ke login jika tidak terautentikasi
  * Loading state saat memeriksa auth status
* **Logout**
  * Konfirmasi dialog sebelum logout
  * Clear session dan redirect ke login
  * Toast notification untuk feedback

### 2. Dashboard Analytics

* **Statistics Cards**
  * Total Tutors dengan jumlah tutor aktif
  * Total Bookings dengan jumlah completed
  * Upcoming Sessions (3 hari ke depan)
  * Growth Percentage (perbandingan minggu ini vs minggu lalu)
* **Weekly Bookings Chart**
  * Area chart dengan gradient StudyIO branding
  * Data 7 hari terakhir
  * Custom tooltip dengan informasi detail
  * Responsive dan interactive
* **Upcoming Sessions List**
  * Menampilkan 5 booking terjadwal terdekat
  * Avatar tutor dengan fallback
  * Informasi lengkap: tutor, siswa, subjek, tanggal, waktu
  * Pagination support
  * Link ke halaman bookings lengkap
* **Latest Tutors List**
  * Menampilkan tutor terbaru
  * Status badge (Aktif/Tidak Aktif)
  * Hourly rate dalam format Rupiah
  * Pagination support
  * Link ke halaman tutors lengkap

### 3. Tutors Management

* **List View**
  * Tabel responsif dengan kolom: Nama, Email, Subjek, Tarif/Jam, Status, Aksi
  * Search real-time berdasarkan nama, email, atau subjek
  * Filter berdasarkan status (All, Active, Inactive)
  * Badge counter untuk setiap filter
  * Avatar dengan fallback ke service eksternal
  * Pagination dengan kustomisasi items per page (5, 10, 20, 50)
  * Empty state dengan ilustrasi dan CTA
* **Add/Edit Tutor**
  * Modal form dengan validasi lengkap
  * Fields: Name, Email, Subject (dropdown 24+ pilihan), Hourly Rate, Status
  * Real-time error messages
  * Required field indicators (*)
  * Dropdown subjects: Matematika, Fisika, Kimia, Biologi, Programming, dll
  * Auto-format hourly rate dengan thousand separator
  * Loading state pada tombol submit
* **Delete Tutor**
  * Konfirmasi dialog sebelum delete
  * Validasi: cek apakah tutor memiliki booking aktif
  * Error handling jika tutor masih memiliki booking
  * Toast notification untuk feedback

### 4. Bookings Management

* **List View**
  * Tabel responsif dengan kolom: Tutor (dengan avatar), Siswa, Tanggal, Waktu, Status, Aksi
  * Filter berdasarkan status: All, Scheduled, Completed, Cancelled
  * Badge counter untuk setiap status
  * Format tanggal Indonesia (e.g., "15 Jan 2025")
  * Status badge dengan warna berbeda per status
  * Pagination support
  * Warning alert jika belum ada tutor aktif
  * Empty state dengan kondisional message
* **Add/Edit Booking**
  * Modal form dengan 2 column layout di desktop
  * Tutor dropdown dengan informasi lengkap (nama, subject, rate)
  * Info card tutor setelah dipilih
  * Fields: Tutor, Student Name, Date, Time (Start & End), Status
  * Validasi:
    * Tanggal tidak boleh di masa lalu
    * End time harus lebih besar dari start time
    * Required fields validation
  * Date picker dengan min date hari ini
  * Time picker dengan format 24 jam
  * Disabled submit jika belum ada tutor aktif
* **Delete Booking**
  * Konfirmasi dialog sebelum delete
  * Toast notification untuk feedback

### 5. UI/UX Enhancements

* **Dark Mode**
  * Toggle button di header
  * Smooth transition antar tema
  * Persistent preference (localStorage)
  * Support untuk semua komponen dan halaman
* **Skeleton Loading**
  * Loading state yang informatif untuk semua halaman
  * Skeleton yang menyerupai layout final
  * Minimum loading time untuk UX yang lebih baik
  * Dark mode support untuk skeleton
* **Toast Notifications (Sonner)**
  * Success notification (hijau)
  * Error notification (merah)
  * Position: top-right
  * Rich colors untuk better visibility
  * Auto-dismiss dengan timer
* **Responsive Design**
  * Mobile-first approach
  * Breakpoints: mobile (< 640px), tablet (640-1024px), desktop (> 1024px)
  * Sidebar collapse di mobile dengan overlay
  * Responsive tables dengan horizontal scroll
  * Stacked layout untuk form di mobile
  * Touch-friendly button sizes
* **Custom Scrollbar**
  * Gradient scrollbar dengan warna StudyIO branding
  * Smooth hover effects
  * Dark mode variant
  * Hidden scrollbar dengan show on hover untuk cards
* **Empty States**
  * Ilustrasi icon untuk visual feedback
  * Descriptive message
  * Call-to-action button
  * Kondisional message (search vs no data)

### 6. Form Validation

Semua form menggunakan validasi client-side dengan feedback real-time:

* **Required Fields** : Indicator (*) dan error message
* **Email Format** : Regex validation untuk format email
* **Number Validation** : Hourly rate harus number positif
* **Date Validation** : Tidak boleh pilih tanggal masa lalu
* **Time Validation** : End time harus lebih besar dari start time
* **Error Display** : Inline error messages di bawah field
* **Border Highlight** : Red border untuk field dengan error
* **Auto-clear Error** : Error hilang saat user mulai mengetik

### 7. Data Management

* **Real-time Sync** : Data otomatis sync dengan Firestore
* **Optimistic Updates** : UI update langsung, rollback jika gagal
* **Loading States** : Skeleton, spinner, disabled buttons
* **Error Handling** : Try-catch dengan user-friendly messages
* **Timestamp** : Auto-generated createdAt dan updatedAt
* **Data Serialization** : Convert Firebase Timestamp ke ISO string

## 📸 Screenshot

### Login Page
*Clean dan modern login interface dengan ilustrasi di desktop*
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/dc6a7dad-631a-46d8-bcc0-bff59612602b" />

### Dashboard
*Overview analytics dengan charts dan statistics cards*
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/811d4595-8a69-4ceb-8da8-c30e40e577f5" />

### Tutors Management
*Complete CRUD interface untuk manajemen tutor*
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/3b27d2fa-a27d-4cae-a787-63242f891efe" />

### Bookings Management
*Comprehensive booking scheduler dengan filter dan search*
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/0e106792-1df0-4033-b8d4-dc2f15615844" />

### Dark Mode
*Full dark mode support di semua halaman*
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/dc9fae28-990f-43fe-bae8-c1cb704ee9ba" />

### Mobile Responsive
*Optimized untuk mobile devices dengan sidebar collapse*
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/c8b0d6c8-1fa7-4658-87a3-ec240ff9f6de" />

## 🏗 Arsitektur Aplikasi

### State Management (Redux Toolkit)

Aplikasi menggunakan Redux Toolkit dengan struktur slice untuk setiap domain:

javascript

```javascript
store/
├── store.js              # Configure store dengan middleware
└── slices/
    ├── authSlice.js      # Authentication state & thunks
    ├── tutorsSlice.js    # Tutors state &asyncCRUD thunks
    └── bookingsSlice.js  # Bookings state &asyncCRUD thunks
```

**Async Thunks:**

* `loginUser` - Login authentication
* `logoutUser` - Logout dan clear session
* `fetchTutors` - Get all tutors dari Firestore
* `addTutor` - Create new tutor
* `editTutor` - Update existing tutor
* `removeTutor` - Delete tutor
* `fetchBookings` - Get all bookings
* `fetchUpcomingBookings` - Get upcoming 3 days bookings
* `fetchWeeklyBookingsData` - Get weekly chart data
* `addBooking` - Create new booking
* `editBooking` - Update existing booking
* `removeBooking` - Delete booking

### Firebase Services

**firestoreHelpers.js** berisi semua Firestore operations:

javascript

```javascript
// Tutors CRUD
createTutor(tutorData)
getAllTutors()
getActiveTutors()
getTutorById(id)
updateTutor(id, tutorData)
deleteTutor(id)

// Bookings CRUD
createBooking(bookingData)
getAllBookings()
getBookingById(id)
updateBooking(id, bookingData)
deleteBooking(id)
getUpcomingBookings()
getBookingsByStatus(status)
getBookingsByTutor(tutorId)
checkTutorHasBookings(tutorId)
getWeeklyBookingsData()
getBookingsStatistics()
```

### Component Structure

* **Pages** : Container components yang connect ke Redux
* **Components** : Presentational components yang menerima props
* **UI Components** : Reusable components dari Radix UI + custom styling
* **Hooks** : Custom hooks untuk logic reuse (useAuth, useTheme)
* **Context** : Theme context untuk dark mode management

### Routing

javascript

```javascript
/login          → Loginpage(public)
/               → Redirect to /dashboard
/dashboard      → Dashboardwithanalytics(protected)
/tutors         → Tutorsmanagement(protected)
/bookings       → Bookingsmanagement(protected)
*               → Redirect to /dashboard
```

### Firebase Collections Structure

**tutors** collection:

javascript

```javascript
{
id: auto-generated,
name: string,
email: string,
subject: string,
hourlyRate: number,
status:'active'|'inactive',
createdAt: timestamp,
updatedAt: timestamp
}
```

**bookings** collection:

javascript

```javascript
{
id: auto-generated,
tutorId:string(reference),
tutorName: string,
tutorEmail: string,
tutorSubject: string,
studentName: string,
date:string(YYYY-MM-DD),
startTime:string(HH:mm),
endTime:string(HH:mm),
status:'scheduled'|'completed'|'cancelled',
createdAt: timestamp,
updatedAt: timestamp
}
```

## 🎨 Design System

### Color Palette

**Light Mode:**

- Background: `#F9FAFB` (slate-50)
- Foreground: `#0F172A` (slate-900)
- Primary: StudyIO Blue `#3babe9`
- Secondary: StudyIO Purple `#a240e4`
- Accent: StudyIO Pink `#a854ab` & Magenta `#e8217b`
- Border: `#E2E8F0` (slate-200)

**Dark Mode:**

- Background: `#020617` (slate-950)
- Foreground: `#F8FAFC` (slate-50)
- Card: `#0F172A` (slate-900)
- Border: `rgba(255,255,255,0.1)`

### Typography

- **Primary Font**: Poppins (Google Fonts)
- **Secondary Font**: Inter (Google Fonts)
- **Font Weights**: 300, 400, 500, 600, 700

### Spacing & Layout

- **Padding**: 16px base, 24px untuk sections
- **Border Radius**: 8-12px untuk cards, 0.625rem untuk buttons
- **Shadows**: Soft shadows dengan blur 10-20px
- **Breakpoints**:
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px

## 🧪 Testing & Development

### Best Practices Implemented

✅ **Code Organization**

- Modular component structure
- Separation of concerns (services, components, pages)
- Reusable utility functions

✅ **Performance**

- Lazy loading dengan React.lazy (optional)
- Memoization untuk expensive computations
- Optimized re-renders dengan proper React patterns

✅ **Accessibility**

- Semantic HTML elements
- ARIA labels untuk screen readers
- Keyboard navigation support
- Focus management di modals

✅ **Error Handling**

- Try-catch blocks di semua async operations
- User-friendly error messages
- Toast notifications untuk feedback
- Fallback UI untuk error states

✅ **Security**

- Environment variables untuk sensitive data
- Firebase Security Rules implementation
- Protected routes dengan authentication check
- Input sanitization dan validation

## 📦 Dependencies Explanation

### Core Dependencies

- **react & react-dom**: Core library untuk building UI
- **vite**: Fast build tool dan dev server
- **react-router-dom**: Client-side routing
- **@reduxjs/toolkit & react-redux**: State management yang powerful dan efficient

### Firebase & Backend

- **firebase**: Official Firebase SDK untuk web, includes Auth & Firestore

### UI & Styling

- **tailwindcss**: Utility-first CSS framework untuk rapid UI development
- **@radix-ui/react-***: Headless UI components yang accessible dan customizable
- **recharts**: Chart library untuk data visualization
- **sonner**: Modern toast notifications
- **lucide-react**: Icon library yang lightweight

### Utilities

- **clsx & tailwind-merge**: Untuk conditional dan conflicting className handling
- **react-hook-form**: Performant form state management
- **zod**: Schema validation library
- **next-themes**: Theme management dengan system preference support

## 🔧 Troubleshooting

### Common Issues

**1. Firebase Configuration Error**

```
Error:Firebase:Error(auth/invalid-api-key)
```

**Solution**: Pastikan semua environment variables di `.env` sudah diisi dengan benar

**2. Port Already in Use**

```
Error:Port5173 is already in use
```

**Solution**: Kill process yang menggunakan port atau ubah port di `vite.config.js`

**3. Build Error: Cannot find module**

```
Error:Cannot find module '@/components/ui/button'
```

**Solution**: Check import paths dan pastikan alias `@` sudah dikonfigurasi di `vite.config.js`

**4. Firestore Permission Denied**

```
Error:Missing or insufficient permissions
```

**Solution**: Update Firestore Security Rules dan pastikan user sudah terautentikasi

**5. Dark Mode Not Persisting**

```
Theme resets on page reload
```

 **Solution** : Check localStorage permissions dan pastikan ThemeProvider properly wrapped

## 📝 Future Improvements

Fitur yang bisa ditambahkan untuk development selanjutnya:

* [ ] **Advanced Filtering** : Date range filter untuk bookings
* [ ] **Export Data** : Export tables ke CSV/PDF
* [ ] **Real-time Notifications** : WebSocket untuk live updates
* [ ] **User Roles** : Admin, Tutor, Student dengan permissions berbeda
* [ ] **Payment Integration** : Stripe/Midtrans untuk payment processing
* [ ] **Calendar View** : Alternative view untuk bookings
* [ ] **Analytics Dashboard** : More detailed analytics dan insights
* [ ] **Multi-language** : i18n support untuk bahasa Indonesia dan English
* [ ] **File Upload** : Avatar upload untuk tutors
* [ ] **Email Notifications** : Send email untuk booking reminders
* [ ] **Mobile App** : React Native version untuk mobile
* [ ] **Unit Testing** : Jest + React Testing Library
* [ ] **E2E Testing** : Cypress atau Playwright
* [ ] **CI/CD Pipeline** : GitHub Actions untuk automated deployment

## 👨‍💻 Kontak

**Developer:** Muhammad Naufal Labib Ramadhan

📧 **Email:** [muhammadnaufallabibramadhan@gmail.com](mailto:muhammadnaufallabibramadhan@gmail.com)

🔗 **GitHub:** [https://github.com/Naufallabibb
](https://github.com/Naufallabibb)

---

## 📄 License

This project is created for  **EdTech Web Developer Internship Technical Test** .

Copyright © 2025 Muhammad Naufal Labib Ramadhan. All rights reserved.

---

## 🙏 Acknowledgments

* **EdTech Indonesia** - Untuk kesempatan technical test yang menantang
* **Firebase** - Untuk backend infrastructure yang powerful
* **Vercel** - Untuk Recharts library yang amazing
* **Radix UI** - Untuk accessible component primitives
* **TailwindCSS** - Untuk utility-first CSS framework
* **Redux Team** - Untuk Redux Toolkit yang simplify state management

---

## 📚 Additional Resources

* [React Documentation](https://react.dev/)
* [Firebase Documentation](https://firebase.google.com/docs)
* [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
* [TailwindCSS Documentation](https://tailwindcss.com/docs)
* [Vite Documentation](https://vitejs.dev/)
* [Recharts Documentation](https://recharts.org/)
* [Radix UI Documentation](https://www.radix-ui.com/)

---

## 🚀 Deployment Guide

### Deploy to Vercel (Recommended)

1. **Push ke GitHub**

bash

```bash
gitadd.
git commit -m "Initial commit"
git push origin main
```

2. **Import Project ke Vercel**

- Kunjungi [vercel.com](https://vercel.com/)
- Klik "New Project"
- Import repository dari GitHub
- Vercel akan auto-detect Vite configuration

3. **Setup Environment Variables**

- Di Vercel dashboard, buka Settings > Environment Variables
- Tambahkan semua variabel dari `.env`:

```
  VITE_FIREBASE_API_KEY
  VITE_FIREBASE_AUTH_DOMAIN
  VITE_FIREBASE_PROJECT_ID
  VITE_FIREBASE_STORAGE_BUCKET
  VITE_FIREBASE_MESSAGING_SENDER_ID
  VITE_FIREBASE_APP_ID
```

4. **Deploy**

* Klik "Deploy"
* Tunggu hingga build selesai
* Your app is live! 🎉

### Deploy to Firebase Hosting

1. **Install Firebase CLI**

bash

```bash
npminstall -g firebase-tools
```

2. **Login ke Firebase**

bash

```bash
firebase login
```

3. **Initialize Firebase Hosting**

bash

```bash
firebase init hosting
```

* Pilih existing Firebase project Anda
* Public directory: `dist`
* Configure as SPA: Yes
* Setup automatic builds: No

4. **Build dan Deploy**

bash

```bash
npm run build
firebase deploy --only hosting
```

### Deploy to Netlify

1. **Install Netlify CLI**

bash

```bash
npminstall -g netlify-cli
```

2. **Build Project**

bash

```bash
npm run build
```

3. **Deploy**

bash

```bash
netlify deploy --prod
```

4. **Setup Environment Variables**

* Di Netlify dashboard > Site settings > Environment variables
* Tambahkan semua VITE_ variables

---

## 🔐 Security Best Practices

### Environment Variables

bash

```bash
# ❌ JANGAN commit file .env
# ✅ Gunakan .env.example untuk template
# ✅ Tambahkan .env ke .gitignore
```

### Firebase Security Rules

javascript

```javascript
// ✅ Production-ready rules
rules_version ='2';
service cloud.firestore{
  match /databases/{database}/documents {
// Only authenticated users can access
    match /{document=**}{
      allow read,write:if request.auth!=null;
}
  
// Optional: More granular rules
    match /tutors/{tutorId}{
      allow read:if request.auth!=null;
      allow create, update,delete:if request.auth!=null;
}
  
    match /bookings/{bookingId}{
      allow read:if request.auth!=null;
      allow create, update,delete:if request.auth!=null;
}
}
}
```

### Input Validation

javascript

```javascript
// ✅ Client-side validation
// ✅ Server-side validation (Firebase Security Rules)
// ✅ Sanitize user inputs
// ✅ Use Zod for schema validation
```

---

## 📊 Performance Optimization

### Code Splitting

javascript

```javascript
// Lazy load pages untuk faster initial load
constDashboard=lazy(()=>import('./pages/Dashboard'));
constTutors=lazy(()=>import('./pages/Tutors'));
constBookings=lazy(()=>import('./pages/Bookings'));
```

### Image Optimization

javascript

```javascript
// ✅ Use WebP format
// ✅ Lazy load images
// ✅ Use srcset untuk responsive images
// ✅ Optimize avatar service dengan query params
```

### Bundle Size Optimization

bash

```bash
# Analyze bundle size
npm run build
npx vite-bundle-visualizer
```

### Caching Strategy

javascript

```javascript
// ✅ Service Worker untuk offline support
// ✅ Cache Firebase queries dengan TTL
// ✅ Memoize expensive computations
```

---

## 🧪 Testing Guide

### Setup Jest & React Testing Library

bash

```bash
npminstall --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest jest-environment-jsdom
```

### Example Unit Test

javascript

```javascript
// TutorCard.test.jsx
import{ render, screen }from'@testing-library/react';
importTutorCardfrom'./TutorCard';

describe('TutorCard',()=>{
const mockTutor ={
id:'1',
name:'John Doe',
email:'john@example.com',
subject:'Matematika',
hourlyRate:50000,
status:'active'
};

it('renders tutor information correctly',()=>{
render(<TutorCard tutor={mockTutor}/>);
  
expect(screen.getByText('John Doe')).toBeInTheDocument();
expect(screen.getByText('john@example.com')).toBeInTheDocument();
expect(screen.getByText('Matematika')).toBeInTheDocument();
});
});
```

### E2E Testing with Cypress

bash

```bash
npminstall --save-dev cypress
npx cypress open
```

javascript

```javascript
// cypress/e2e/login.cy.js
describe('Login Flow',()=>{
it('should login successfully with valid credentials',()=>{
    cy.visit('/login');
    cy.get('input[type="email"]').type('admin@edtech.com');
    cy.get('input[type="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include','/dashboard');
});
});
```

---

## 🐛 Debugging Tips

### Redux DevTools

javascript

```javascript
// Sudah configured di store.js
// Install Redux DevTools Extension di browser
// Inspect state, actions, dan time-travel debugging
```

### React Developer Tools

javascript

```javascript
// Install React DevTools Extension
// Inspect component tree, props, state, hooks
```

### Firebase Emulator Suite

bash

```bash
# Install Firebase tools
npminstall -g firebase-tools

# Initialize emulators
firebase init emulators

# Start emulators
firebase emulators:start

# Update firebase config untuk local development
const useEmulator = import.meta.env.DEV;
if(useEmulator){
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectAuthEmulator(auth, 'http://localhost:9099');
}
```

### Console Logging Best Practices

javascript

```javascript
// ✅ Use console groups
console.group('Tutor CRUD');
console.log('Creating tutor:', tutorData);
console.groupEnd();

// ✅ Use console.table untuk array objects
console.table(tutors);

// ✅ Remove console.logs di production
// Add vite plugin: vite-plugin-remove-console
```

---

## 📈 Analytics & Monitoring

### Firebase Analytics (Optional)

javascript

```javascript
import{ getAnalytics, logEvent }from'firebase/analytics';

const analytics =getAnalytics(app);

// Track events
logEvent(analytics,'tutor_created',{
subject: tutorData.subject
});

logEvent(analytics,'booking_completed',{
tutor_id: booking.tutorId
});
```

### Error Tracking with Sentry (Optional)

bash

```bash
npminstall @sentry/react
```

javascript

```javascript
import*asSentryfrom"@sentry/react";

Sentry.init({
dsn:"YOUR_SENTRY_DSN",
integrations:[
newSentry.BrowserTracing(),
newSentry.Replay(),
],
tracesSampleRate:1.0,
});
```

---

## 🎓 Learning Resources

### React & Modern JavaScript

* [React Beta Docs](https://react.dev/) - Official React documentation
* [JavaScript Info](https://javascript.info/) - Modern JavaScript tutorial
* [You Don&#39;t Know JS](https://github.com/getify/You-Dont-Know-JS) - Deep dive into JS

### Firebase

* [Firebase Crash Course](https://www.youtube.com/watch?v=q5J5ho7YUhA) - YouTube tutorial
* [Firestore Data Modeling](https://firebase.google.com/docs/firestore/data-model) - Best practices

### State Management

* [Redux Toolkit Official Tutorial](https://redux-toolkit.js.org/tutorials/overview)
* [Redux Essentials](https://redux.js.org/tutorials/essentials/part-1-overview-concepts)

### TailwindCSS

* [Tailwind Play](https://play.tailwindcss.com/) - Online playground
* [Tailwind UI Components](https://tailwindui.com/components) - Component examples

---

## 💡 Pro Tips

### Development Workflow

bash

```bash
# Use npm scripts untuk common tasks
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Use git hooks untuk code quality
npminstall --save-dev husky lint-staged
npx husky init
```

### VS Code Extensions (Recommended)

- **ES7+ React/Redux/React-Native snippets** - Code snippets
- **Tailwind CSS IntelliSense** - Autocomplete untuk Tailwind classes
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Firebase Explorer** - Firebase integration
- **GitLens** - Git supercharged
- **Error Lens** - Inline error highlighting

### Keyboard Shortcuts

```
Ctrl/Cmd + P       → Quick file search
Ctrl/Cmd + Shift + P → Command palette
Ctrl/Cmd + /       → Toggle comment
Alt + Shift + F    → Format document
F12                → Go to definition
```

---

## 📞 Support & Contribution

### Reporting Issues

Jika menemukan bug atau ada pertanyaan:

1. Check existing issues di GitHub
2. Buat issue baru dengan template:
   - **Title**: Brief description
   - **Description**: Detailed explanation
   - **Steps to Reproduce**: How to trigger the bug
   - **Expected vs Actual Behavior**
   - **Screenshots**: If applicable
   - **Environment**: Browser, OS, Node version

### Contributing

Contributions are welcome! Untuk contribute:

1. Fork repository
2. Create feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add some AmazingFeature'`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Open Pull Request

---

## 🏆 Credits & Attribution

### Open Source Libraries

- **React Team** - Core framework
- **Firebase Team** - Backend infrastructure
- **Vercel** - Vite build tool
- **TailwindLabs** - TailwindCSS framework
- **Radix UI** - Accessible components
- **Redux Team** - State management
- **Emil Kowalski** - Sonner toast library

### Design Inspiration

- **shadcn/ui** - Component design patterns
- **Vercel Dashboard** - Layout inspiration
- **Linear App** - UI/UX excellence

### Icons & Assets

- **FontAwesome** - Icon library
- **iran.liara.run** - Avatar placeholder service
- **Google Fonts** - Poppins & Inter typography

---

## 📝 Changelog

### Version 1.0.0 (October 2025)

**Initial Release**

#### ✨ Features

- ✅ Firebase Authentication (Email/Password)
- ✅ Tutors Management (CRUD)
- ✅ Bookings Management (CRUD)
- ✅ Dashboard with Analytics
- ✅ Weekly Bookings Chart
- ✅ Dark Mode Support
- ✅ Responsive Design (Mobile/Tablet/Desktop)
- ✅ Toast Notifications
- ✅ Skeleton Loading States
- ✅ Form Validation
- ✅ Search & Filter Functionality
- ✅ Pagination
- ✅ Empty States
- ✅ Protected Routes

#### 🎨 UI/UX

- ✅ Custom StudyIO Gradient Branding
- ✅ Smooth Animations & Transitions
- ✅ Custom Scrollbar
- ✅ Avatar Integration
- ✅ Status Badges
- ✅ Confirmation Dialogs

#### 🛠 Technical

- ✅ Redux Toolkit State Management
- ✅ Firestore Real-time Database
- ✅ Vite Build Tool
- ✅ TailwindCSS 4.1.16
- ✅ ESLint Configuration
- ✅ Environment Variables Setup

---

## 🎖 Project Stats

```
📦 Total Files: 45+
📝 Lines of Code: 5,000+
⚛️ React Components: 20+
🔥 Firebase Collections: 2
🎨 TailwindCSS Classes: 500+
☕ Coffee Consumed: Unlimited
```

---

## 🌟 Final Notes

Project ini dibuat dengan ❤️ untuk  **EdTech Indonesia Technical Test** .

Terima kasih telah mereview project ini. Saya sangat antusias untuk berkontribusi pada platform pembelajaran yang innovative dan membuat dampak positif untuk pendidikan di Indonesia.

**Key Highlights:**

* ✨ Clean, maintainable, dan scalable code architecture
* 🎨 Modern UI/UX dengan attention to detail
* 🚀 Production-ready dengan best practices
* 📱 Full responsive design
* 🌙 Dark mode support
* 🔥 Real-time Firebase integration
* 💪 Comprehensive CRUD operations
* 📊 Data visualization dengan Recharts
* 🎯 Type-safe dengan proper validation
* 🧪 Ready for testing implementation

Saya terbuka untuk feedback dan siap untuk discuss lebih lanjut tentang technical decisions dan potential improvements.

**Let's build the future of EdTech together! 🚀**

---

**Muhammad Naufal Labib Ramadhan**

Frontend Web Developer Candidate

EdTech Indonesia - Web Developer Internship

📧 [muhammadnaufallabibramadhan@gmail.com](mailto:muhammadnaufallabibramadhan@gmail.com)

🔗 [GitHub](https://github.com/Naufallabibb)

*"Code is like humor. When you have to explain it, it's bad." - Cory House*

---

<div align="center">
**⭐ If you like this project, please give it a star on GitHub! ⭐**

Made with ❤️ and ☕ in Indonesia
