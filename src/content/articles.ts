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
