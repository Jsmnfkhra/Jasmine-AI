import { Zap, ShieldCheck, MessageCircle } from "lucide-react";

function Features() {

  const features = [
    {
      icon: <Zap size={40} className="text-cyan-400" />,
      title: "Cepat",
      description: "AI memberikan respon hanya dalam hitungan detik."
    },
    {
      icon: <ShieldCheck size={40} className="text-cyan-400" />,
      title: "Aman",
      description: "Semua percakapanmu tersimpan dengan aman."
    },
    {
      icon: <MessageCircle size={40} className="text-cyan-400" />,
      title: "Ramah",
      description: "AI siap menjadi teman ngobrol kapan saja."
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-8 py-24">

      <h2 className="text-4xl font-bold text-center">
        Kenapa Memilih Jasmine AI?
      </h2>

      <p className="text-center text-gray-400 mt-4">
        Dibuat untuk menemani aktivitasmu setiap hari.
      </p>

      <div className="grid md:grid-cols-3 gap-8 mt-16">

        {features.map((feature) => (

          <div
            key={feature.title}
            className="bg-slate-900 rounded-2xl border border-slate-800 p-8 hover:border-cyan-400 hover:-translate-y-2 transition"
          >

            {feature.icon}

            <h3 className="text-2xl font-semibold mt-6">
              {feature.title}
            </h3>

            <p className="text-gray-400 mt-4">
              {feature.description}
            </p>

          </div>

        ))}

      </div>

    </section>
  );
}

export default Features;