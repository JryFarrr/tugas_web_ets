export type ArticleSection =
  | { type: "intro"; text: string }
  | { type: "list"; title: string; items: string[] }
  | { type: "paragraph"; title?: string; text: string };

export type ArticleMeta = {
  slug: string;
  title: string;
  date: string; // ISO format
  readTime: string;
  tags: string[];
  excerpt: string;
  sourceUrl: string;
  sections: ArticleSection[];
};

export const articles: ArticleMeta[] = [
  {
    slug: "tips-kencan-pertama-kencan-kedua",
    title: "Tips Kencan Pertama untuk Mendapatkan Kencan Kedua",
    date: "2025-10-22",
    readTime: "6 menit",
    tags: ["Kencan Pertama", "Keamanan", "Percakapan"],
    excerpt:
      "Ramsey Solutions membahas cara menjaga kesan pertama tetap positif, nyaman, dan menghargai batasan agar peluang kencan kedua lebih terbuka.",
    sourceUrl:
      "https://www.ramseysolutions.com/relationships/first-date-tips",
    sections: [
      {
        type: "intro",
        text:
          "Kencan pertama sering memadukan rasa antusias sekaligus gugup. Artikel Ramsey Solutions menawarkan panduan praktis supaya pertemuan pertama terasa hangat sekaligus membuka jalan untuk agenda berikutnya.",
      },
      {
        type: "list",
        title: "Persiapan dan keamanan",
        items: [
          "Pilih tempat umum yang nyaman bagi kedua belah pihak untuk menjaga rasa aman dan ruang komunikasi.",
          "Datang tepat waktu atau sedikit lebih awal sebagai sinyal bahwa kamu serius dan menghargai waktu lawan kencan.",
          "Beritahukan rencana kencan kepada teman atau keluarga sebagai langkah pengamanan tambahan.",
        ],
      },
      {
        type: "list",
        title: "Komunikasi yang efektif",
        items: [
          "Ajukan pertanyaan bermakna yang memancing cerita dan minat tulus, bukan sekadar basa-basi.",
          "Dengarkan secara aktif dan beri tanggapan lanjutan untuk menunjukkan keterlibatan nyata.",
          "Jauhkan ponsel agar perhatian penuh tercurah pada percakapan di depan mata.",
        ],
      },
      {
        type: "list",
        title: "Sikap dan perilaku",
        items: [
          "Gunakan bahasa tubuh terbuka: jaga kontak mata, tersenyum tulus, dan hindari sikap defensif.",
          "Singkirkan topik negatif tentang mantan, pekerjaan, atau keluhan lain yang mengurangi suasana positif.",
          "Tetap waspada terhadap red flag seperti ketidakjujuran tanpa langsung menilai berlebihan.",
          "Jujur dan autentik agar koneksi terbangun pada kepribadian asli alih-alih pencitraan.",
        ],
      },
      {
        type: "list",
        title: "Ekspektasi yang realistis",
        items: [
          "Nikmati proses mengenal tanpa tekanan harus terlihat sempurna.",
          "Biarkan percakapan mengalir alami tanpa memaksakan cerita dramatis untuk mengesankan.",
          "Hormati batasan pribadi satu sama lain dan hindari sikap terlalu agresif.",
        ],
      },
      {
        type: "paragraph",
        title: "Langkah penutup",
        text:
          "Dengan menjaga keamanan, komunikasi, dan ekspektasi tetap proporsional, kencan pertama dapat menjadi pengalaman hangat yang menumbuhkan rasa ingin bertemu lagi.",
      },
    ],
  },
  {
    slug: "tips-berguna-sukses-aplikasi-kencan",
    title: "Tips Berguna untuk Sukses di Aplikasi Kencan",
    date: "2025-08-27",
    readTime: "8 menit",
    tags: ["Strategi", "Profil", "Keamanan"],
    excerpt:
      "Vice merangkum cara menjaga momentum percakapan, mengoptimalkan profil, dan memilih kecocokan berkualitas di aplikasi kencan.",
    sourceUrl:
      "https://www.vice.com/en/article/7-actually-useful-tips-for-crushing-it-on-dating-apps/",
    sections: [
      {
        type: "intro",
        text:
          "Aplikasi kencan memberi akses ke banyak match, tetapi butuh strategi tepat agar koneksi berkembang menjadi hubungan bermakna. Vice menyarikan langkah praktis supaya prosesnya terasa menyenangkan sekaligus produktif.",
      },
      {
        type: "list",
        title: "Strategi komunikasi",
        items: [
          "Jangan terlalu lama berkutat di chat; begitu obrolan nyambung, ajak bertemu di tempat publik.",
          "Hindari terjebak dalam fase penpal digital dengan segera mengarahkan percakapan ke interaksi nyata.",
        ],
      },
      {
        type: "list",
        title: "Presentasi visual yang optimal",
        items: [
          "Pilih foto profil yang jelas, bercahaya baik, dan menunjukkan ekspresi natural.",
          "Kurangi filter berlebihan serta hindari foto grup yang membingungkan calon match.",
          "Sertakan variasi foto aktivitas atau hobi, tetapi pastikan foto utama fokus pada wajah.",
        ],
      },
      {
        type: "list",
        title: "Membuat bio yang menarik",
        items: [
          "Tulis bio yang memicu percakapan alih-alih daftar minat generik.",
          "Tambahkan hook spesifik, misalnya aktivitas favorit atau proyek unik, agar orang mudah menanggapi.",
          "Jaga agar bio tetap ringkas namun menggambarkan kepribadian secara jelas.",
        ],
      },
      {
        type: "list",
        title: "Fokus pada kualitas",
        items: [
          "Jangan terpaku pada banyaknya match; prioritaskan koneksi yang terasa selaras.",
          "Swipe secara selektif setelah membaca profil dan menemukan kesamaan nilai.",
          "Alokasikan waktu untuk percakapan terbaik dibanding merespons semua pesan sekaligus.",
        ],
      },
      {
        type: "list",
        title: "Keamanan dan verifikasi",
        items: [
          "Lakukan screening ringan seperti cek media sosial atau video call sebelum bertemu.",
          "Selalu kabari orang terdekat mengenai rencana kencan, lokasi, dan waktu.",
          "Percayai intuisi dan batalkan jika ada sinyal mencurigakan meski match terlihat menarik.",
        ],
      },
      {
        type: "list",
        title: "Kejelasan tujuan",
        items: [
          "Kenali tujuan dating sejak awal dan komunikasikan ekspektasi secara jujur.",
          "Pilih platform yang sesuai dengan tujuan, apakah hubungan serius, kasual, atau sekadar mencari teman.",
          "Sampaikan niat agar kedua pihak menghemat waktu dan menghindari kesalahpahaman.",
        ],
      },
      {
        type: "list",
        title: "Mindset positif",
        items: [
          "Nikmati proses mencari koneksi baru tanpa menjadikannya sumber stres.",
          "Pelajari sesuatu dari setiap interaksi untuk memahami kebutuhan pribadi.",
          "Tetap optimistis karena match yang kurang berhasil bukan berarti kamu gagal.",
        ],
      },
      {
        type: "paragraph",
        title: "Catatan akhir",
        text:
          "Dengan strategi komunikasi, profil yang autentik, dan fokus pada keamanan, pengalaman menggunakan aplikasi kencan dapat terasa lebih menyenangkan sekaligus produktif.",
      },
    ],
  },
  {
    slug: "aturan-baru-dating-modern",
    title: "Aturan Baru dalam Dating Modern",
    date: "2025-05-01",
    readTime: "7 menit",
    tags: ["Tren", "Mindset", "Dating Modern"],
    excerpt:
      "Psychology Today menelaah paradoks kencan masa kini, di mana pilihan tak terbatas justru membuat orang sulit membangun niat dan koneksi tulus.",
    sourceUrl:
      "https://www.psychologytoday.com/us/articles/202505/the-new-rules-of-dating",
    sections: [
      {
        type: "intro",
        text:
          "Emily Jamea mengamati bahwa banyak lajang modern terjebak antara keinginan akan koneksi mendalam dan budaya swipe yang serba instan. Artikel ini membedah tantangan dan menawarkan alternatif yang lebih sehat.",
      },
      {
        type: "list",
        title: "Paradoks modern dating",
        items: [
          "Kita mendambakan kedekatan emosional namun menyingkirkan kandidat hanya karena detail sepele.",
          "Keinginan akan stabilitas justru dibarengi ketertarikan pada sosok yang tidak tersedia.",
          "Budaya pura-pura cuek membuat rasa aman sulit tercipta.",
        ],
      },
      {
        type: "list",
        title: "Krisis generasi muda",
        items: [
          "Hampir separuh Gen Z dewasa masih lajang meski akses ke aplikasi kencan melimpah.",
          "Mereka memiliki pandangan seksual terbuka namun merasa canggung saat bertemu langsung.",
          "Perpaduan selektivitas ekstrem dan kepercayaan diri rendah mempersulit proses mendekat.",
        ],
      },
      {
        type: "list",
        title: "Mentalitas ROI dan fenomena \"the ick\"",
        items: [
          "Banyak orang memperlakukan kencan seperti investasi dengan rumus untung rugi.",
          "Fenomena the ick membuat ketertarikan hilang total hanya karena momen kecil yang tidak ideal.",
          "Hardballing menjadikan pertemuan pertama seperti daftar cek ketat, bukan eksplorasi.",
        ],
      },
      {
        type: "list",
        title: "Standar ganda penilaian",
        items: [
          "Calon pasangan sering dinilai secara kejam berdasarkan foto atau bio singkat.",
          "Di sisi lain, kita takut dinilai dengan standar yang sama oleh orang lain.",
        ],
      },
      {
        type: "list",
        title: "Masalah inti",
        items: [
          "Masalah utama bukan penolakan, melainkan kurangnya niat untuk benar-benar memilih.",
          "Cinta membutuhkan keputusan sadar untuk hadir dan berinvestasi, bukan sekadar opsi tanpa batas.",
        ],
      },
      {
        type: "list",
        title: "Solusi yang disarankan",
        items: [
          "Sadari bahwa chemistry tidak selalu muncul seketika dan berikan kesempatan kedua.",
          "Lihat melampaui penampilan demi menemukan kecocokan nilai dan tujuan hidup.",
          "Ubahlah cara memaknai penolakan: itu hanya tanda bahwa orang tersebut bukan pasangan yang tepat.",
          "Seimbangkan penggunaan aplikasi dengan interaksi dunia nyata.",
        ],
      },
      {
        type: "list",
        title: "Tren baru yang lebih sehat",
        items: [
          "Contra-dating mengajak keluar dari tipe lama demi perspektif baru.",
          "Dating for the plot mendorong pendekatan lebih petualang dan kurang transaksional.",
        ],
      },
      {
        type: "paragraph",
        title: "Kesimpulan",
        text:
          "Cinta selalu butuh keberanian, kerentanan, dan kesediaan memilih. Ketika niat kembali diprioritaskan, dating terasa lebih manusiawi meski pilihan tampak tak berbatas.",
      },
    ],
  },
  {
    slug: "tips-komunikasi-efektif-hubungan",
    title: "Tips Komunikasi yang Efektif dalam Hubungan",
    date: "2024-11-10",
    readTime: "9 menit",
    tags: ["Komunikasi", "Hubungan", "Kepercayaan"],
    excerpt:
      "Better Health Victoria merinci cara berbicara dan mendengar dengan empati agar hubungan tetap sehat dan penuh kepercayaan.",
    sourceUrl:
      "https://www.betterhealth.vic.gov.au/health/healthyliving/relationships-and-communication",
    sections: [
      {
        type: "intro",
        text:
          "Komunikasi adalah fondasi hubungan yang langgeng. Better Health Victoria menegaskan pentingnya berbicara jujur, mendengar dengan empati, serta merespons secara konstruktif.",
      },
      {
        type: "list",
        title: "Prinsip dasar komunikasi",
        items: [
          "Sadari bahwa komunikasi tidak pernah sempurna, tapi upaya konsisten akan meningkatkan kualitasnya.",
          "Sampaikan pesan secara jelas agar mudah dipahami tanpa ruang tafsir berlebihan.",
          "Pastikan kamu memahami pesan pasangan dengan mengulang atau merangkum balik.",
        ],
      },
      {
        type: "list",
        title: "Teknik komunikasi yang konstruktif",
        items: [
          "Gunakan pernyataan \"saya\" untuk mengurangi nada menyalahkan dan membuat pesan terasa personal.",
          "Sisihkan waktu khusus tanpa gangguan gawai untuk percakapan penting.",
          "Fokus pada isu yang sedang dibahas tanpa menyeret masalah lama.",
        ],
      },
      {
        type: "list",
        title: "Seni mendengarkan",
        items: [
          "Latih mendengarkan aktif dengan menahan komentar hingga pasangan selesai berbicara.",
          "Perhatikan bahasa tubuh, nada suara, dan gestur sebagai bagian dari pesan.",
          "Hindari memotong pembicaraan agar pasangan merasa dihargai.",
        ],
      },
      {
        type: "list",
        title: "Berbagi emosi positif",
        items: [
          "Ekspresikan apresiasi dan ungkapkan seberapa penting pasangan dalam hidupmu.",
          "Rayakan keberhasilan dan kabar baik untuk memperkuat ikatan emosional.",
          "Biasakan mengatakan hal-hal baik agar suasana komunikasi tetap hangat.",
        ],
      },
      {
        type: "list",
        title: "Mengelola konflik",
        items: [
          "Hindari silent treatment karena hanya memperlebar jarak emosional.",
          "Cari fakta terlebih dahulu sebelum menyimpulkan motif pasangan.",
          "Diskusikan apa yang benar-benar terjadi dan temukan solusi sebagai tim.",
        ],
      },
      {
        type: "list",
        title: "Topik yang sulit",
        items: [
          "Jangan mengabaikan topik sensitif karena bisa menjadi sumber luka jangka panjang.",
          "Pertimbangkan bantuan konselor bila percakapan terasa buntu.",
          "Gunakan jurnal untuk menyalurkan emosi sebelum siap membicarakannya.",
        ],
      },
      {
        type: "list",
        title: "Membangun kepercayaan melalui komunikasi",
        items: [
          "Jaga konsistensi agar pasangan tahu mereka bisa mengandalkanmu.",
          "Hormati privasi emosional dengan menciptakan ruang aman untuk berbagi.",
          "Tindak lanjuti kesepakatan atau janji sehingga kata-kata sejalan dengan tindakan.",
        ],
      },
      {
        type: "paragraph",
        title: "Penutup",
        text:
          "Komunikasi efektif adalah keterampilan yang terus diasah. Dengan komitmen saling mendengar dan berbicara terbuka, hubungan menjadi lebih kuat dan memuaskan.",
      },
    ],
  },
  {
    slug: "tips-dating-cerdas-2025",
    title: "Tips Penting untuk Dating yang Lebih Cerdas di 2025",
    date: "2025-02-04",
    readTime: "5 menit",
    tags: ["Mindset", "Tujuan", "Strategi"],
    excerpt:
      "Essence menyoroti tiga langkah utama dari Chanel Nicole Scott agar pengalaman dating tahun ini selaras dengan tujuan hidup dan rasa aman.",
    sourceUrl: "https://www.essence.com/lifestyle/dating-in-2025/",
    sections: [
      {
        type: "intro",
        text:
          "Chanel Nicole Scott menekankan bahwa berkencan secara cerdas berarti bersenang-senang sambil tahu kapan harus mundur dan untuk siapa kita membuka hati.",
      },
      {
        type: "list",
        title: "Kenali tujuan hidup",
        items: [
          "Bangun kepercayaan diri dan pahami apa yang pantas kamu terima.",
          "Nilai diri sendiri sehingga kekecewaan tidak mengguncangmu secara berlebihan.",
          "Utamakan integritas, karakter, visi, dan nilai saat memilih pasangan.",
          "Selaraskan proses dating dengan purpose agar menarik orang-orang yang sejalan.",
        ],
      },
      {
        type: "list",
        title: "Bangun fondasi persahabatan",
        items: [
          "Kenali pasangan di berbagai situasi, bukan hanya euforia awal.",
          "Lakukan vetting menyeluruh untuk memahami reaksi mereka saat senang maupun marah.",
          "Hindari kejutan dengan mengenal karakter sebelum masuk fase yang lebih serius.",
        ],
      },
      {
        type: "list",
        title: "Jangan bertahan terlalu lama",
        items: [
          "Jangan abaikan red flag dan tindaklanjuti tanpa menunggu masalah membesar.",
          "Percaya pada sinyal pertama tentang siapa mereka sebenarnya.",
          "Jangan berusaha mengubah orang yang tidak sejalan dengan nilai hidupmu.",
          "Keluar dengan tegas ketika situasi tidak lagi sehat.",
        ],
      },
      {
        type: "list",
        title: "Perubahan mindset yang diperlukan",
        items: [
          "Berhenti mengandalkan bar atau klub sebagai satu-satunya tempat mencari pasangan.",
          "Fokus pada substansi dan nilai, bukan sekadar tampilan fisik.",
          "Manfaatkan media sosial untuk memperjelas visi, tujuan, dan nilai diri.",
        ],
      },
      {
        type: "paragraph",
        title: "Arah baru berkencan",
        text:
          "Ketika tujuan hidup jelas, hubungan dibangun dari persahabatan yang kuat, dan keberanian mundur dijaga, dating terasa lebih ringan sekaligus melindungi kesejahteraan emosional.",
      },
    ],
  },
  {
    slug: "10-tips-efektif-aplikasi-dating",
    title: "10 Tips Efektif Mendapatkan Jodoh Lewat Aplikasi Dating",
    date: "2024-04-08",
    readTime: "7 menit",
    tags: ["Keamanan", "Strategi", "Percakapan"],
    excerpt:
      "Panduan dari Centrea agar proses menemukan pasangan lewat aplikasi tetap aman, tulus, dan fokus pada kecocokan yang nyata.",
    sourceUrl:
      "https://www.centrea.id/opinion/661146812/10-tips-efektif-mendapatkan-jodoh-melalui-aplikasi-dating-agar-cepat-bertemu-pasangan-yang-serasi",
    sections: [
      {
        type: "intro",
        text:
          "Centrea merangkum sepuluh cara penting untuk memaksimalkan pengalaman kencan daring. Intinya adalah memadukan keaslian diri, filter yang tepat, dan komunikasi hangat tanpa mengabaikan keamanan pribadi.",
      },
      {
        type: "list",
        title: "Langkah yang ditekankan Centrea",
        items: [
          "Kenali tujuanmu sejak awal dan sampaikan secara jujur di profil.",
          "Gunakan foto yang wajar serta deskripsi singkat yang menonjolkan nilai dan minat secara positif.",
          "Manfaatkan fitur filter aplikasi untuk menyaring kecocokan berdasar nilai, kebiasaan, dan gaya hidup.",
          "Jaga percakapan tetap hangat - mulai dengan topik ringan, dengarkan lawan bicara, dan hindari interogasi.",
          "Rencanakan pertemuan tatap muka hanya setelah merasa nyaman dan pilih tempat aman yang ramai.",
          "Hormati batasan diri sendiri dan pasangan; jangan memaksakan data pribadi atau pertemuan cepat.",
          "Tetap waspada terhadap penipuan: verifikasi profil, hindari berbagi data finansial, dan laporkan akun mencurigakan.",
          "Bangun konsistensi komunikasi agar kedua belah pihak tahu ekspektasi dan ritme hubungan.",
          "Evaluasi kecocokan secara berkala; tanyakan apa yang dirasakan dan dibutuhkan satu sama lain.",
          "Ketika siap melangkah lebih serius, ajak pasangan berdiskusi mengenai ekspektasi hubungan jangka panjang.",
        ],
      },
      {
        type: "paragraph",
        title: "Catatan penting",
        text:
          "Centrea menekankan bahwa aplikasi hanyalah alat bantu. Fokus pada kualitas interaksi dan kesiapan membuka diri membuat proses pencarian pasangan terasa lebih bermakna.",
      },
    ],
  },
  {
    slug: "8-tips-aman-kenalan",
    title: "8 Tips Kenalan di Aplikasi Dating agar Sukses dan Aman",
    date: "2023-12-14",
    readTime: "6 menit",
    tags: ["Keamanan", "Pertemuan", "Percakapan"],
    excerpt:
      "Saran BeritaSatu untuk menjaga keamanan sekaligus menikmati percakapan ketika berkenalan di aplikasi kencan.",
    sourceUrl:
      "https://www.beritasatu.com/ototekno/2866720/8-tips-kenalan-di-aplikasi-dating-agar-lebih-sukses-dan-aman",
    sections: [
      {
        type: "intro",
        text:
          "BeritaSatu menyoroti pentingnya kewaspadaan dan komunikasi sehat saat berkenalan secara daring. Tips berikut membantu kamu lebih percaya diri ketika memulai percakapan dan merencanakan pertemuan.",
      },
      {
        type: "list",
        title: "Saran utama BeritaSatu",
        items: [
          "Perbarui profil secara berkala agar mencerminkan diri terkini sekaligus menunjukkan keseriusan.",
          "Gunakan bahasa sopan dan hindari kalimat yang menekan atau merendahkan lawan bicara.",
          "Lakukan verifikasi ringan - misalnya bertukar akun media sosial - sebelum melangkah lebih jauh.",
          "Jaga kerahasiaan data personal seperti alamat rumah, informasi finansial, atau detail pekerjaan sensitif.",
          "Manfaatkan fitur laporan dan blokir bila menemukan perilaku yang tidak pantas.",
          "Rencanakan pertemuan pertama di tempat publik, kabari teman atau keluarga, dan atur transportasi mandiri.",
          "Perhatikan sinyal bahaya seperti desakan uang, permintaan foto pribadi, atau perubahan sikap mendadak.",
          "Tetap realistis: bangun hubungan perlahan sambil menilai kecocokan nilai dan tujuan masing-masing.",
        ],
      },
      {
        type: "paragraph",
        title: "Ringkasan",
        text:
          "Kunci keberhasilan berkenalan lewat aplikasi adalah menyatukan rasa ingin tahu dengan langkah-langkah keamanan. Dengan begitu, kamu dapat menikmati proses menemukan koneksi baru tanpa mengorbankan kenyamanan diri sendiri.",
      },
    ],
  },
];
