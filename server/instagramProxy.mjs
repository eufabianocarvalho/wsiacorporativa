// server/instagramProxy.mjs
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import { load } from 'cheerio';

const app = express();
const PORT = 3333;

app.use(cors());

// Armazenar cookies de sessão
let sessionCookies = '';

app.get('/api/instagram-info', async (req, res) => {
  const username = req.query.username;
  if (!username) return res.status(400).json({ error: 'Username é obrigatório' });

  try {
    console.log(`🔍 Buscando dados para: ${username}`);
    
    // Primeiro, pegar cookies se não temos
    if (!sessionCookies) {
      console.log('🍪 Obtendo cookies de sessão...');
      const homeResponse = await fetch('https://www.instagram.com/', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1'
        }
      });
      
      const cookies = homeResponse.headers.get('set-cookie');
      if (cookies) {
        sessionCookies = cookies.split(',').map(cookie => cookie.split(';')[0]).join('; ');
        console.log('🍪 Cookies obtidos:', sessionCookies.substring(0, 100) + '...');
      }
    }

    // Agora buscar o perfil com cookies
    const response = await fetch(`https://www.instagram.com/${username}/`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cookie': sessionCookies,
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Cache-Control': 'max-age=0'
      }
    });

    console.log(`📥 Status da resposta: ${response.status}`);
    
    const html = await response.text();
    console.log(`📄 HTML recebido: ${html.length} caracteres`);
    
    const $ = load(html);
    const titleText = $('title').text();
    console.log(`📝 Title encontrado: "${titleText}"`);

    // Verificar se ainda estamos na página de login
    if (titleText.includes('Login') && titleText.includes('Instagram')) {
      console.log('❌ Ainda redirecionando para login, tentando método alternativo...');
      
      // Tentar buscar dados diretamente do script JSON
      const scripts = $('script[type="application/ld+json"]');
      for (let i = 0; i < scripts.length; i++) {
        try {
          const scriptContent = $(scripts[i]).html();
          const jsonData = JSON.parse(scriptContent);
          if (jsonData && jsonData.name) {
            console.log('✅ Dados encontrados via JSON-LD');
            return res.json({
              username,
              full_name: jsonData.name,
              profile_pic_url: jsonData.image || null
            });
          }
        } catch (e) {
          // Continuar tentando outros scripts
        }
      }
      
      return res.json({
        username,
        full_name: null,
        profile_pic_url: null,
        error: 'Profile not accessible - Instagram may be blocking server access'
      });
    }

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