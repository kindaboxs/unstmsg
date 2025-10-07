import { db } from "@/lib/db";

const prisma = db;

// Data nama Indonesia (mix alias dan nama asli)
const indonesianNames = [
  // Nama cewe
  "Ayu",
  "Putri",
  "Siti",
  "Rina",
  "Maya",
  "Dini",
  "Cinta",
  "Bella",
  "Aurel",
  "Zahra",
  "Nanda",
  "Kiki",
  "Tari",
  "Bunga",
  "Cantika",
  "Amelia Putri",
  "Siti Nurhaliza",
  "Dinda Kirana",
  "Raisa Andriana",
  "Nadya Fatira",
  "Alisha Zahra",
  "Kirana Larasati",

  // Nama cowo
  "Budi",
  "Ardi",
  "Reza",
  "Dimas",
  "Yoga",
  "Fikri",
  "Rafi",
  "Rizky",
  "Hendra",
  "Andri",
  "Fajar",
  "Bayu",
  "Doni",
  "Agung",
  "Dede",
  "Ahmad Faisal",
  "Rizki Pratama",
  "Dimas Anggara",
  "Farhan Maulana",
  "Arya Saloka",
  "Iqbal Ramadhan",
  "Bima Arya",

  // Alias/panggilan
  "Si Dia",
  "Kamu",
  "Mantan",
  "Sahabat",
  "Teman Sekelasmu",
  "someone",
  "Gebetan",
  "Crush",
  "Bestie",
];

// Template pesan-pesan berbahasa Indonesia
const messageTemplates = [
  // Confess percintaan
  "Gue sebenernya udah suka sama lo dari lama. Tiap kali ketemu, jantung gue selalu deg-degan. Tapi gue gatau harus ngomong gimana. Takut lo nolak, takut rusak pertemanan kita. Jadi ya gue diemin aja sampe sekarang.",

  "Lo tau ga sih, setiap kali lo senyum gue ngerasa dunia gue jadi lebih cerah. Gue pengen banget ngomong ke lo, tapi gue takut. Takut kalo ternyata lo ga suka sama gue. Jadi gue memilih untuk diam dan liat lo bahagia dari jauh.",

  "Dari semua orang yang gue kenal, cuma lo yang bisa bikin gue nervous sekaligus nyaman. Gue udah beberapa kali mau ngomong perasaan gue, tapi selalu gagal di detik-detik terakhir. Mungkin emang ga ditakdirin kali ya.",

  "Sebenernya gue udah naksir lo dari SMA. Sampe sekarang udah kuliah pun masih aja mikirin lo. Tapi gue tau lo udah punya yang lain. Semoga dia bisa bikin lo bahagia ya, lebih dari yang gue bisa kasih.",

  "Gue gatau ini perasaan apa, tapi setiap lo cerita masalah lo ke gue, gue pengen jadi orang yang bisa lindungin lo terus. Tapi gue cuma bisa jadi temen yang dengerin. Gue takut kalo gue ngungkapin perasaan ini, malah bikin lo ga nyaman.",

  // Minta maaf
  "Maaf ya kalo waktu itu gue nyakitin lo. Gue baru sadar sekarang betapa egoisnya gue. Lo gabakal baca ini, tapi at least gue udah nulis apa yang pengen gue omongin ke lo.",

  "Gue nyesel banget udah sia-siain lo waktu itu. Lo yang selalu ada buat gue, tapi gue malah ninggalin lo di saat lo butuh gue. Maafin gue ya, walaupun gue tau lo udah move on.",

  "Andai bisa mundur waktu, gue pengen banget ubah semua kesalahan gue. Gue udah ngecewain lo berkali-kali. Maafin gue yang egois dan ga pernah ngehargain lo.",

  "Maaf gue ga bisa jadi orang yang lo harapin. Gue udah coba yang terbaik, tapi emang gue yang kurang. Lo deserve someone better than me.",

  // Cerita random / curhat
  "Kadang gue mikir, gimana ya kabar lo sekarang? Udah lama banget kita ga ngobrol. Gue kangen obrolan random kita waktu dulu. Semoga lo baik-baik aja disana.",

  "Lo tau ga? Gue masih inget semua cerita lucu yang pernah kita lakuin bareng. Kadang gue suka senyum sendiri kalo inget itu. Miss those days.",

  "Gue pengen ngomong banyak hal ke lo, tapi gue gatau harus mulai dari mana. Udah terlalu lama kita ga contact. Takutnya lo udah lupa sama gue.",

  "Hari ini gue liat foto kita yang dulu. Kangen banget masa-masa itu. Masa dimana kita masih deket, masih sering ketemu. Sekarang udah beda semua.",

  "Sebenernya gue pengen banget ngobrol sama lo lagi. Tapi gue gatau lo masih mau apa engga. Gue takut lo udah ngerasa gue stranger.",

  "Gue sering kepikiran, apa kita masih bisa balik kaya dulu? Atau emang udah waktunya kita jalan sendiri-sendiri?",

  "Lo mungkin gatau, tapi lo pernah jadi alasan gue buat tetep bertahan di masa-masa sulit gue. Thank you udah pernah ada di hidup gue.",

  "Gue ga pernah bilang ini ke lo, tapi setiap kali gue lagi down, kata-kata lo yang selalu gue inget buat bangkit lagi.",

  "Kadang gue berpikir, gimana ya kalo waktu itu gue berani ngomong? Mungkin sekarang ceritanya beda. Tapi yaudahlah, yang penting lo bahagia.",

  "Lo pernah bilang kalo gue harus jadi diri sendiri. Sampe sekarang gue masih pegang kata-kata lo itu. Thank you udah percaya sama gue.",

  "Gue gatau kenapa gue nulis ini. Mungkin karena gue kangen buat cerita ke lo. Cerita tentang apa aja, yang penting sama lo.",

  "Setiap kali gue denger lagu ini, gue selalu inget lo. Inget semua kenangan kita. Kadang bikin sedih, kadang bikin senyum.",

  "Gue pengen lo tau, walaupun kita udah jarang ngobrol, gue masih peduli sama lo. Semoga lo selalu sehat dan bahagia ya.",

  "Andai lo tau betapa seringnya gue mikirin lo. Ga sehari pun gue ga inget sama lo. Tapi gue ga bisa ngomong ini ke lo langsung.",

  "Maafin gue yang gabisa jadi orang yang lo butuhin. Gue udah coba, tapi emang gue yang kurang.",

  "Lo adalah satu-satunya orang yang bisa ngerti gue tanpa gue harus jelasin panjang lebar. Gue kangen itu.",

  "Gue sering ngebayangin gimana jadinya kalo kita dulu beda keputusan. Apa kita masih bakal deket kaya dulu?",

  "Thank you udah ngajarin gue arti keikhlasan. Lo pergi tanpa pamit, tapi lo ninggalin pelajaran yang berharga.",

  "Setiap kali gue lewat tempat itu, gue selalu inget momen kita disana. Bikin kangen, bikin sedih.",

  "Lo mungkin udah lupa, tapi gue masih inget setiap detail cerita kita. Dari awal ketemu sampe terakhir kali ngobrol.",

  "Gue ga nyangka bakal sejauh ini jaraknya. Dulu kita deket banget, sekarang udah kaya strangers.",
];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomDate() {
  const start = new Date(2024, 0, 1); // 1 Jan 2024
  const end = new Date();
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

async function main() {
  console.log("🌱 Starting seed...");

  // Delete existing data
  await prisma.unsentMessage.deleteMany();
  console.log("🗑️  Cleared existing messages");

  // Create 50 random messages
  const messages = [];

  for (let i = 0; i < 50; i++) {
    const from = getRandomElement(indonesianNames);
    let to = getRandomElement(indonesianNames);

    // Pastikan from dan to tidak sama
    while (to === from) {
      to = getRandomElement(indonesianNames);
    }

    const message = getRandomElement(messageTemplates);
    const createdAt = getRandomDate();

    messages.push({
      from,
      to,
      content: message,
      createdAt,
    });
  }

  // Insert all messages
  await prisma.unsentMessage.createMany({
    data: messages,
  });

  console.log(`✅ Created ${messages.length} unsent messages`);

  // Show sample data
  const sampleMessages = await prisma.unsentMessage.findMany({
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  console.log("\n📝 Sample messages:");
  sampleMessages.forEach((msg, idx) => {
    console.log(`\n${idx + 1}. From: ${msg.from} → To: ${msg.to}`);
    console.log(`   Message: ${msg.content.substring(0, 80)}...`);
  });
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
