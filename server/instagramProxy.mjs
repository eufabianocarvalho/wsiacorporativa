// server/instagramProxy.mjs
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import { load } from 'cheerio';
import { HttpsProxyAgent } from 'https-proxy-agent';

const app = express();
const PORT = 3333;

app.use(cors());

// Lista de proxies gratuitos rotativos (você pode adicionar mais)
const PROXY_LIST = [
  // Adicionar proxies se necessário
];

app.get('/api/instagram-info', async (req, res) => {
  const username = req.query.username;
  if (!username) return res.status(400).json({ error: 'Username é obrigatório' });

  try {
    console.log(`🔍 Tentando buscar dados para: ${username}`);
    
    // Simular delay como navegador real
    await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));
    
    const response = await fetch(`https://www.instagram.com/${username}/`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'DNT': '1',
        'Referer': 'https://www.google.com/'
      }
    });

    console.log(`📥 Status: ${response.status}`);
    
    const html = await response.text();
    const $ = load(html);
    const titleText = $('title').text();
    
    console.log(`📝 Title: "${titleText}"`);

    if (titleText.includes('Login')) {
      // Instagram está bloqueando - retornar dados fictícios para teste
      console.log('⚠️ Instagram bloqueando - retornando dados de fallback');
      return res.json({
        username,
        full_name: `${username} (Bloqueado pelo Instagram)`,
        profile_pic_url: 'https://via.placeholder.com/150x150/4267B2/FFFFFF?text=' + username.charAt(0).toUpperCase(),
        note: 'Instagram is blocking datacenter IPs. This would work on residential connections.'
      });
    }

    let full_name = titleText.replace(/\(.*?\)|[\u2022@]|Instagram photos.*$/gi, '').trim();
    const profile_pic_url = $('meta[property="og:image"]').attr('content') || null;

    res.json({
      username,
      full_name,
      profile_pic_url
    });

  } catch (error) {
    console.error('❌ Erro:', error.message);
    res.status(500).json({ error: 'Erro ao buscar perfil do Instagram' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Proxy rodando: http://localhost:${PORT}`);
});