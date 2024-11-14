## Persyaratan

- [npm](https://www.npmjs.com/) (Node Package Manager) telah terinstal.
- [xampp](https://www.apachefriends.org/download.html) (XAMPP) telah terinstal.

## Cara menjalankan
Buat dan import database yang sudah disediakan

Clone project
```bash
git clone https://gitlab.com/Nura21/dapurmamaadit-api.git
```

Jalankan perintah 
untuk meninstall package
```bash
npm install
```

copy file .env.example menjadi .env
```bash
cp .env.example .env
```

sesuaikan isi file .env dengan credential anda untuk bagian database connection
```bash
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_DATABASE=
DB_SSL=false
```

jalankan project dengan
```bash
node ServiceDMA.js
```
