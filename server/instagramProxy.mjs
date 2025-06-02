// server/instagramProxy.mjs
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import { load } from 'cheerio';

const app = express();
const PORT = 3333;

app.use(cors());

// SEUS COOKIES COMPLETOS DO INSTAGRAM
const INSTAGRAM_COOKIES = 'csrftoken=0V2hLRK3jRsdtLN0UEr9EcnSU4AllT3Q; datr=olI5Z8KTav-N9sbrHjDwFxF; ds_user_id=53462390484; ig_did=048C4A95-FE33-4098-9CF5-A8A920E96635; rur=53462390484%3ABrDIp4cRuq31Wp%3A11%3AAYeyxE0UvnsOsb0W63uE0yGyUPknQHvJfzZGNUEhtA; sessionid=53462390484%3ABrDIp4cRuq31Wp%3A11%3AAYeyxE0UvnsOsb0W63uE0yGyUPknQHvJfzZGNUEhtA';

app.get('/api/instagram-info', async (req, res) => {
  const username = req.query.username;
  if (!username) return res.status(400).json({ error: 'Username é obrigatório' });

  try {
    console.log(`🔍 Buscando dados para: ${username} (com seus cookies autenticados)`);
    
    const response = await fetch(`https://www.instagram.com/${username}/`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cookie': INSTAGRAM_COOKIES,
        'Referer': 'https://www.instagram.com/',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Fetch-User': '?1'
      }
    });

    console.log(`📥 Status: ${response.status}`);
    
    const html = await response.text();
    const $ = load(html);
    const titleText = $('title').text();
    
    console.log(`📝 Title: "${titleText}"`);

    // Se ainda for login, tentar extrair dados do JSON embeddado
    if (titleText.includes('Login')) {
      console.log('⚠️ Ainda redirecionando para login com cookies');
    }

     let full_name = titleText
     .replace(/\(.*?\)/gi, '')
     .replace(/[\u2022@]/gi, '')
     .replace(/Instagram photos.*$/gi, '')
     .replace(/Fotos e vídeos do Instagram.*$/gi, '')
     .replace(/Photos and videos from Instagram.*$/gi, '')
     .replace(/\s+/g, ' ')
     .trim();
     const profile_pic_url = $('meta[property="og:image"]').attr('content') || null;

    console.log(`✅ Nome extraído: "${full_name}"`);
    console.log(`📸 Imagem extraída: ${profile_pic_url ? 'SIM' : 'NÃO'}`);

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
  console.log(`✅ Proxy rodando com cookies autenticados do Instagram`);
});