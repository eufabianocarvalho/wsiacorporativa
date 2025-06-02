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
    console.log(`🔍 Buscando dados para: ${username}`);
    
    const response = await fetch(`https://www.instagram.com/${username}/`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      }
    });

    console.log(`📥 Status da resposta: ${response.status}`);
    
    const html = await response.text();
    console.log(`📄 HTML recebido: ${html.length} caracteres`);
    
    const $ = load(html);

    let full_name = $('title').text().replace(/\(.*?\)|[\u2022@]|Instagram photos.*$/gi, '').trim();
    const profile_pic_url = $('meta[property="og:image"]').attr('content') || null;

    console.log(`✅ Dados encontrados: ${full_name}, ${profile_pic_url ? 'com imagem' : 'sem imagem'}`);

    res.json({
      username,
      full_name,
      profile_pic_url
    });
  } catch (error) {
    console.error('❌ Erro no scraping:', error);
    res.status(500).json({ error: 'Erro ao buscar perfil do Instagram' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Proxy rodando: http://localhost:${PORT}`);
});