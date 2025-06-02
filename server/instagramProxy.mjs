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
    
    // Simular navegador real com todos os headers
    const response = await fetch(`https://www.instagram.com/${username}/`, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Language': 'en-US,en;q=0.9,pt;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'DNT': '1'
      },
      redirect: 'follow',
      timeout: 10000
    });

    console.log(`📥 Status da resposta: ${response.status}`);
    console.log(`📥 Headers de resposta:`, Object.fromEntries(response.headers));
    
    if (!response.ok) {
      console.log(`❌ Instagram retornou erro: ${response.status}`);
      return res.status(response.status).json({ error: `Instagram retornou: ${response.status}` });
    }

    const html = await response.text();
    console.log(`📄 HTML recebido: ${html.length} caracteres`);
    console.log(`📄 Primeiros 500 chars:`, html.substring(0, 500));
    
    const $ = load(html);

    // Log do title para debug
    const titleText = $('title').text();
    console.log(`📝 Title encontrado: "${titleText}"`);

    let full_name = titleText.replace(/\(.*?\)|[\u2022@]|Instagram photos.*$/gi, '').trim();
    const profile_pic_url = $('meta[property="og:image"]').attr('content') || null;

    console.log(`✅ Nome processado: "${full_name}"`);
    console.log(`📸 Imagem encontrada: ${profile_pic_url ? 'SIM' : 'NÃO'}`);

    res.json({
      username,
      full_name,
      profile_pic_url
    });
  } catch (error) {
    console.error('❌ Erro completo:', error);
    res.status(500).json({ error: 'Erro ao buscar perfil do Instagram', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Proxy rodando: http://localhost:${PORT}`);
});