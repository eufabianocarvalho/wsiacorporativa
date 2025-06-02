// server/instagramProxy.mjs

import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import { load } from 'cheerio';

const app = express();
const PORT = 3333;

app.use(cors());

app.get('/api/instagram-info', async (req, res) => {
  const username = req.query.username;
  if (!username) return res.status(400).json({ error: 'Username é obrigatório' });

  try {
    const response = await fetch(`https://www.instagram.com/${username}/`);
    const html = await response.text();
    const $ = load(html);

    // Pega o <title> que tem o nome, mas remove @, bullets, etc
    let full_name = $('title').text().replace(/\(.*?\)|[\u2022@]|Instagram photos.*$/gi, '').trim();

    // Procura a imagem dentro da tag <meta property="og:image">
    const profile_pic_url = $('meta[property="og:image"]').attr('content') || null;

    res.json({
      username,
      full_name,
      profile_pic_url
    });
  } catch (error) {
    console.error('Erro no scraping:', error);
    res.status(500).json({ error: 'Erro ao buscar perfil do Instagram' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Proxy rodando: http://localhost:${PORT}`);
});
