export function getAIResponse(userMessage) {
  const text = userMessage.toLowerCase();

  if (text.includes("halo")) {
    return "Halo juga! 😊 Senang bertemu denganmu.";
  }

  if (text.includes("react")) {
    return "React adalah library JavaScript untuk membangun antarmuka pengguna (UI).";
  }

  if (text.includes("python")) {
    return "Python adalah bahasa pemrograman yang populer untuk AI, Machine Learning, Web Development, dan Automation.";
  }

  if (text.includes("siapa kamu")) {
    return "Aku Jasmine AI, asisten virtual yang sedang kamu bangun. 🤖";
  }

  return "Maaf, aku belum memahami pertanyaan itu. Nanti saat kita menghubungkan Gemini API, jawabanku akan jauh lebih pintar.";
}