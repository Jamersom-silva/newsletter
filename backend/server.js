import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";
import 'dotenv/config';

const app = express();

app.use(cors({
  origin: [
    process.env.CLIENT_URL,
    "https://newsletter-two-rouge.vercel.app"
  ],
  methods: ["GET", "POST"],
}));

app.use(express.json());

const db = new sqlite3.Database(process.env.DATABASE_PATH);

db.run(`
  CREATE TABLE IF NOT EXISTS subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE
  )
`);

async function sendConfirmationEmail(to) {
  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
        "api-key": process.env.BREVO_API_KEY
      },
      body: JSON.stringify({
        sender: { name: "Newsletter", email: process.env.EMAIL_FROM },
        to: [{ email: to }],
        subject: "Bem-vindo à Newsletter!",
        htmlContent: "<p>Obrigado por se inscrever! Em breve você receberá novidades.</p>"
      })
    });

    const data = await response.json();
    console.log("📨 Email enviado:", data);

  } catch (error) {
    console.error("❌ Erro ao enviar e-mail:", error);
  }
}

app.post("/subscribe", (req, res) => {
  const { email } = req.body;

  if (!email)
    return res.status(400).json({ message: "O e-mail é obrigatório." });

  db.run(
    "INSERT INTO subscribers (email) VALUES (?)",
    [email],
    async (err) => {
      if (err)
        return res.status(400).json({ message: "E-mail já cadastrado ou inválido." });

      await sendConfirmationEmail(email);
      return res.json({ message: "Inscrição realizada com sucesso!" });
    }
  );
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend rodando na porta ${PORT}`));
