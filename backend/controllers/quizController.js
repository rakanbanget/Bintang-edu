const { GoogleGenerativeAI } = require('@google/generative-ai');
const pdfModule = require('pdf-parse');

// Helper ekstraksi teks PDF universal (kompatibel pdf-parse v1 function & v2 class)
const extractPdfText = async (buffer) => {
  if (!buffer) return '';
  try {
    // 1. Versi pdf-parse v1.x (function style)
    if (typeof pdfModule === 'function') {
      const data = await pdfModule(buffer);
      return data?.text ? data.text.trim() : '';
    }
    // 2. Versi pdf-parse v2.x (class PDFParse style dengan Uint8Array)
    if (pdfModule.PDFParse) {
      const parser = new pdfModule.PDFParse(new Uint8Array(buffer));
      const res = await parser.getText();
      if (typeof res === 'string') return res.trim();
      if (res && res.text) return res.text.trim();
    }
    // 3. Versi default export
    if (typeof pdfModule.default === 'function') {
      const data = await pdfModule.default(buffer);
      return data?.text ? data.text.trim() : '';
    }
  } catch (err) {
    console.error('❌ Detail error ekstraksi PDF:', err.message);
  }
  return '';
};

// Bank soal cadangan cerdas jika API key tidak tersedia atau kuota habis
const generateFallbackQuiz = (topic, materiText) => {
  const t = topic || 'Tata Surya';
  if (t === 'Siklus Air' || (materiText && materiText.toLowerCase().includes('air'))) {
    return [
      {
        question: 'Peristiwa penguapan air di permukaan bumi oleh energi panas matahari disebut...',
        options: ['Evaporasi', 'Kondensasi', 'Presipitasi', 'Infiltrasi'],
        answer: 'Evaporasi',
      },
      {
        question: 'Perubahan uap air di atmosfer menjadi butiran titik-titik air pembentuk awan adalah...',
        options: ['Membeku', 'Kondensasi', 'Menyublim', 'Transpirasi'],
        answer: 'Kondensasi',
      },
      {
        question: 'Turunnya titik-titik air dari awan di atmosfer ke permukaan bumi disebut peristiwa...',
        options: ['Evaporasi', 'Kondensasi', 'Presipitasi (Hujan)', 'Transpirasi'],
        answer: 'Presipitasi (Hujan)',
      },
      {
        question: 'Penguapan air yang dilepaskan melalui pori-pori stomata daun tumbuhan hijau disebut...',
        options: ['Transpirasi', 'Infiltrasi', 'Presipitasi', 'Sublimasi'],
        answer: 'Transpirasi',
      },
      {
        question: 'Peresapan air hujan ke dalam lapisan pori-pori tanah dan batuan disebut...',
        options: ['Kondensasi', 'Infiltrasi', 'Evaporasi', 'Presipitasi'],
        answer: 'Infiltrasi',
      },
    ];
  } else if (t === 'Gaya Magnet' || (materiText && materiText.toLowerCase().includes('magnet'))) {
    return [
      {
        question: 'Kutub magnet yang senama (misalnya Kutub Utara dengan Utara) jika didekatkan akan...',
        options: ['Tarik-menarik', 'Tolak-menolak', 'Saling menempel kuat', 'Diam tidak bereaksi'],
        answer: 'Tolak-menolak',
      },
      {
        question: 'Benda di bawah ini yang dapat ditarik dengan sangat kuat oleh magnet adalah...',
        options: ['Klip kertas dari besi', 'Penghapus karet', 'Penggaris mika plastik', 'Kertas HVS'],
        answer: 'Klip kertas dari besi',
      },
      {
        question: 'Daerah di sekitar magnet yang masih dipengaruhi oleh gaya tarikan magnet disebut...',
        options: ['Kutub Magnet', 'Medan Magnet', 'Garis Magnet', 'Sudut Deklinasi'],
        answer: 'Medan Magnet',
      },
      {
        question: 'Ujung magnet yang selalu mengarah ke arah kutub utara bumi disebut...',
        options: ['Kutub Selatan', 'Kutub Utara', 'Kutub Barat', 'Kutub Positif'],
        answer: 'Kutub Utara',
      },
      {
        question: 'Magnet yang sifat kemagnetannya ditimbulkan karena adanya aliran listrik dinamakan...',
        options: ['Magnet Alam', 'Elektromagnet', 'Magnet U', 'Magnet Jarum'],
        answer: 'Elektromagnet',
      },
    ];
  } else {
    // Tata Surya default
    return [
      {
        question: 'Planet apakah yang memiliki cincin es terluas dan terindah di Tata Surya?',
        options: ['Mars', 'Saturnus', 'Jupiter', 'Venus'],
        answer: 'Saturnus',
      },
      {
        question: 'Gaya tarik yang menjaga planet tetap beredar pada orbitnya mengelilingi Matahari adalah...',
        options: ['Gaya Gesek Udara', 'Gaya Magnet Bumi', 'Gaya Gravitasi Matahari', 'Gaya Pegas'],
        answer: 'Gaya Gravitasi Matahari',
      },
      {
        question: 'Planet terbesar dalam tata surya yang memiliki satelit alami bernama Ganymede adalah...',
        options: ['Uranus', 'Bumi', 'Jupiter', 'Saturnus'],
        answer: 'Jupiter',
      },
      {
        question: 'Planet terdekat dari Matahari yang memiliki suhu permukaan sangat panas di siang hari adalah...',
        options: ['Merkurius', 'Venus', 'Bumi', 'Mars'],
        answer: 'Merkurius',
      },
      {
        question: 'Berapakah jumlah planet utama yang mengorbit Matahari dalam tata surya kita?',
        options: ['7 Planet', '8 Planet', '9 Planet', '10 Planet'],
        answer: '8 Planet',
      },
    ];
  }
};

/**
 * Controller: Generate Kuis Sains berbasis Gemini AI dari PDF / Teks Materi
 * Endpoint: POST /api/generate-quiz
 * Payload: Multipart form-data dengan file PDF (req.file) ATAU req.body.materiText
 */
const generateQuiz = async (req, res) => {
  try {
    let extractedText = '';

    // 1. Ekstraksi teks dari file PDF jika diunggah via Multer (req.file)
    if (req.file && req.file.buffer) {
      try {
        extractedText = await extractPdfText(req.file.buffer);
      } catch (pdfErr) {
        console.error('❌ Gagal mem-parse file PDF:', pdfErr.message);
      }
    }

    // Jika tidak ada PDF atau PDF kosong, gunakan materiText dari form body
    if (!extractedText && req.body && req.body.materiText) {
      extractedText = req.body.materiText.trim();
    }

    const topic = req.body?.topic || 'Sains SD';
    const TEKS_MATERI = extractedText || topic;

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    // Jika API Key tidak ada, gunakan generator cadangan
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      console.warn('⚠️ GEMINI_API_KEY belum disetel. Mengembalikan bank soal cerdas.');
      const fallback = generateFallbackQuiz(topic, TEKS_MATERI);
      return res.json(fallback);
    }

    // 2. Inisialisasi Google Generative AI
    const genAI = new GoogleGenerativeAI(apiKey);

    // Prioritaskan model aktif dan paling stabil pada API Key akun pengguna
    const candidateModels = [
      'gemini-flash-latest',
      'gemini-flash-lite-latest',
      'gemini-3.5-flash-lite',
      'gemini-2.5-flash',
    ];

    // Gemini Prompt sesuai spesifikasi
    const prompt = `Generate 3-5 multiple-choice science questions for elementary students based on this text. Return STRICT JSON Array ONLY: [{"question": "...", "options": ["A","B","C","D"], "answer": "Correct Answer"}]. Gunakan Bahasa Indonesia yang ramah anak SD.

Materi / Teks Sumber:
"""
${TEKS_MATERI}
"""`;

    let responseText = '';
    let lastError = null;

    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        responseText = result.response.text();
        if (responseText) break;
      } catch (err) {
        lastError = err;
        console.warn(`Model ${modelName} kendala (${err.message.substring(0, 80)}), mencoba model berikutnya...`);
      }
    }

    if (!responseText) {
      throw lastError || new Error('Tidak ada respons dari model Gemini');
    }

    // 3. Sanitasi format JSON (hapus markdown code blocks jika AI menyertakan ```json)
    let cleanJson = responseText.trim();
    if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    }

    let parsedQuestions = [];
    try {
      parsedQuestions = JSON.parse(cleanJson);
    } catch (parseErr) {
      console.warn('⚠️ Gagal parse JSON langsung, mencoba ekstraksi regex array...');
      const match = cleanJson.match(/\[[\s\S]*\]/);
      if (match) {
        parsedQuestions = JSON.parse(match[0]);
      } else {
        throw new Error('Format respons AI tidak berupa array JSON');
      }
    }

    // 4. Normalisasi opsi dan jawaban
    const formattedQuestions = parsedQuestions.map((q, idx) => {
      const rawOptions = Array.isArray(q.options) && q.options.length >= 2
        ? q.options
        : ['Pilihan A', 'Pilihan B', 'Pilihan C', 'Pilihan D'];

      // Bersihkan prefix opsi (misal "A. ", "B) ") jika AI menambahkan prefix huruf
      const options = rawOptions.map((opt) =>
        typeof opt === 'string' ? opt.replace(/^[A-Da-d][\.\:\-\)]\s*/, '').trim() : String(opt)
      );

      return {
        question: q.question || `Pertanyaan #${idx + 1}`,
        options,
        answer: q.answer !== undefined ? q.answer : options[0],
      };
    });

    // 5. Kirimkan JSON hasil generate Gemini ke frontend
    return res.json(formattedQuestions);
  } catch (error) {
    console.error('❌ Error generate quiz controller:', error.message);
    const fallback = generateFallbackQuiz(req.body?.topic, req.body?.materiText);
    return res.json(fallback);
  }
};

module.exports = {
  generateQuiz,
  generateFallbackQuiz,
};
