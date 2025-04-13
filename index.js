import express from 'express';
import multer from 'multer';
import fs from 'fs';
import pdfParse from 'pdf-parse';

const app = express();
const upload = multer({ dest: 'uploads/' });

app.post('/ocr', upload.single('file'), async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      console.log("❌ Nenhum arquivo recebido.");
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    const buffer = fs.readFileSync(req.file.path);
    const data = await pdfParse(buffer);

    console.log("📄 Texto extraído com sucesso.");
    res.json({ text: data.text.trim() });
  } catch (error) {
    console.error("❌ Erro ao processar o PDF:", error);
    res.status(500).json({ error: 'OCR failed' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ API OCR (pdf-parse) rodando na porta ${PORT}`));
