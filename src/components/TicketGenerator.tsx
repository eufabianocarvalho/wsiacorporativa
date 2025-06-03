import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Download, Instagram } from 'lucide-react';
import html2canvas from 'html2canvas';
import Background3D from '@/components/Background3D';

interface TicketGeneratorProps {
  userEmail: string;
  userName: string;
  formData: {
    nome: string;
    email: string;
    whatsapp: string;
    pais: string;
    perfil: string;
    nivel: string;
    desafio: string;
  };
}

const TicketGenerator: React.FC<TicketGeneratorProps> = ({ userEmail, userName, formData }) => {
  const [instagramUrl, setInstagramUrl] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [instagramName, setInstagramName] = useState('');
  const [instagramFullName, setInstagramFullName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [ticketGenerated, setTicketGenerated] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const ticketRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Função para formatar WhatsApp para webhook
  const formatWhatsAppForWebhook = (whatsapp: string, countryCode: string) => {
    const numbersOnly = whatsapp.replace(/\D/g, '');
    return `${countryCode}${numbersOnly}`;
  };

  // Efeito de fade-in quando o componente aparece na tela
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const extractInstagramUsername = (url: string) => {
    const patterns = [
      /instagram\.com\/([^\/\?]+)/,
      /^@?([a-zA-Z0-9._]+)$/
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1].replace(/\/$/, '');
      }
    }
    return null;
  };

  const scrapeInstagramProfile = async (username: string) => {
    try {
      const response = await fetch(`https://automacoes-wsiacorporativa-ws-proxy.euenvr.easypanel.host/api/instagram-info?username=${username}`);
      if (!response.ok) throw new Error("Erro ao acessar proxy local");
      const data = await response.json();
      return {
        full_name: data.full_name,
        profile_pic_url: data.profile_pic_url,
        username: data.username
      };
    } catch (error) {
      console.error("Erro no scraping:", error);
      // Fallback para quando o proxy não está disponível
      return {
        full_name: username,
        profile_pic_url: null,
        username: username
      };
    }
  };

  const fetchInstagramProfile = async () => {
    if (!instagramUrl) {
      toast({ 
        title: "Campo obrigatório", 
        description: "Insira seu link ou @ do Instagram", 
        variant: "destructive",
        className: "bottom-4 right-4 md:top-4 md:bottom-auto"
      });
      return;
    }

    setIsGenerating(true);
    const username = extractInstagramUsername(instagramUrl);
    if (!username) {
      toast({ 
        title: "Usuário inválido", 
        description: "Verifique o link ou o @ informado.", 
        variant: "destructive",
        className: "bottom-4 right-4 md:top-4 md:bottom-auto"
      });
      setIsGenerating(false);
      return;
    }

    const profileData = await scrapeInstagramProfile(username);
    if (profileData) {
      setProfileImage(profileData.profile_pic_url);
      setInstagramName(profileData.username);
      setInstagramFullName(profileData.full_name);
    } else {
      setInstagramName(username);
      setInstagramFullName(username);
    }

    setTicketGenerated(true);
    setIsGenerating(false);
    toast({ 
      title: "Ingresso gerado!", 
      description: "Seu ingresso personalizado foi criado.",
      className: "bottom-4 right-4 md:top-4 md:bottom-auto"
    });
  };

  useEffect(() => {
    if (ticketGenerated) setTimeout(sendTicketToWebhook, 1000);
  }, [ticketGenerated]);

  const sendTicketToWebhook = async () => {
    if (!ticketRef.current) return;
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Gerar a imagem com as mesmas configurações do download (qualidade máxima)
      const canvas = await html2canvas(ticketRef.current, { 
        scale: 3, 
        useCORS: true, 
        backgroundColor: null,
        allowTaint: false,
        logging: false,
        width: ticketRef.current.offsetWidth,
        height: ticketRef.current.offsetHeight,
        scrollX: 0,
        scrollY: 0
      });
      
      const imageData = canvas.toDataURL('image/png', 1.0); // Qualidade máxima
      
      // Formatar WhatsApp para envio (só números)
      const whatsappFormatted = formatWhatsAppForWebhook(formData.whatsapp, formData.pais);
      
      // Gerar nome do arquivo
      const fileName = `ingresso-${instagramName}-${Date.now()}.png`;
      
      const payload = {
        ...formData,
        whatsapp: whatsappFormatted, // Ex: 5511999999999 (só números)
        whatsappOriginal: formData.whatsapp, // Como o usuário digitou
        instagramUrl,
        instagramName,
        instagramFullName,
        profileImage,
        ticketImageUrl: fileName, // Nome do arquivo .png
        ticketImageBase64: imageData, // Base64 para o webhook processar
        imageFormat: 'png',
        imageQuality: 'high',
        timestamp: new Date().toISOString(),
        action: 'ticket_generated',
      };
      
      await fetch('https://hook.us1.make.com/5kpb2wdyfl9tf7y6u0tu44ypaal8l8tj', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (error) {
      console.error('Erro ao enviar webhook:', error);
    }
  };

  const generateAndSendImage = async () => {
    if (!ticketRef.current) return null;
    
    try {
      // Aguardar um pouco para garantir que tudo foi renderizado
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Detectar se é mobile para ajustar configurações
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      const canvas = await html2canvas(ticketRef.current, { 
        scale: isMobile ? 2 : 3, // Menor escala no mobile para melhor performance
        useCORS: true,
        allowTaint: false,
        backgroundColor: null,
        logging: false,
        width: ticketRef.current.offsetWidth,
        height: ticketRef.current.offsetHeight,
        scrollX: 0,
        scrollY: 0,
        windowWidth: isMobile ? 414 : window.innerWidth, // Largura específica para mobile
        windowHeight: isMobile ? 896 : window.innerHeight,
        onclone: (clonedDoc) => {
          // Garantir que fontes e estilos sejam aplicados no clone
          const clonedElement = clonedDoc.querySelector('[data-testid="ticket"]') || clonedDoc.querySelector('[ref]');
          if (clonedElement) {
            clonedElement.style.transform = 'none';
            clonedElement.style.animation = 'none';
          }
        }
      });
      
      return canvas.toDataURL('image/png', 0.9); // Qualidade um pouco menor para mobile
    } catch (error) {
      console.error('Erro ao gerar imagem:', error);
      return null;
    }
  };

  const downloadAsPNG = async () => {
    try {
      const imageData = await generateAndSendImage();
      if (!imageData) {
        toast({ 
          title: "Erro no download", 
          description: "Não foi possível gerar a imagem. Tente novamente.", 
          variant: "destructive",
          className: "bottom-4 right-4 md:top-4 md:bottom-auto"
        });
        return;
      }

      // Detectar se é mobile
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobile) {
        // Para mobile: abrir em nova aba para visualizar/salvar
        const newWindow = window.open();
        if (newWindow) {
          newWindow.document.write(`
            <html>
              <head><title>Ingresso - ${instagramName}</title></head>
              <body style="margin:0; display:flex; justify-content:center; align-items:center; min-height:100vh; background:#000;">
                <img src="${imageData}" alt="Ingresso" style="max-width:100%; height:auto;" />
                <script>
                  // Adicionar botão de download para iOS/Android
                  setTimeout(() => {
                    const img = document.querySelector('img');
                    const button = document.createElement('button');
                    button.textContent = 'Tocar para Salvar';
                    button.style.cssText = 'position:fixed; bottom:20px; left:50%; transform:translateX(-50%); padding:12px 24px; background:#2563eb; color:white; border:none; border-radius:8px; font-size:16px; font-weight:bold; cursor:pointer; z-index:1000;';
                    button.onclick = () => {
                      const a = document.createElement('a');
                      a.href = '${imageData}';
                      a.download = 'ingresso-${instagramName}.png';
                      a.click();
                    };
                    document.body.appendChild(button);
                  }, 500);
                </script>
              </body>
            </html>
          `);
          newWindow.document.close();
        } else {
          // Fallback: tentar download direto
          const a = document.createElement('a');
          a.href = imageData;
          a.download = `ingresso-${instagramName}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
      } else {
        // Para desktop: download normal
        const link = document.createElement('a');
        link.href = imageData;
        link.download = `ingresso-${instagramName}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      toast({ 
        title: "Download iniciado!", 
        description: isMobile ? "Toque na imagem para salvar" : "Arquivo baixado com sucesso!",
        className: "bottom-4 right-4 md:top-4 md:bottom-auto"
      });

    } catch (error) {
      console.error('Erro no download:', error);
      toast({ 
        title: "Erro no download", 
        description: "Tente novamente ou use um navegador diferente.", 
        variant: "destructive",
        className: "bottom-4 right-4 md:top-4 md:bottom-auto"
      });
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <Background3D />
      <div className="relative z-10 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {!ticketGenerated ? (
            <div 
              ref={containerRef}
              className={`bg-gray-900/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl max-w-md mx-auto transition-all duration-1000 transform ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-10'
              }`}
            >
              <div className={`text-center mb-6 transition-all duration-700 delay-200 transform ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-5'
              }`}>
                <Instagram className="mx-auto text-pink-500 mb-4 animate-pulse" size={48} />
                <h2 className="text-2xl font-bold text-white mb-2">Cole seu link do Instagram</h2>
                <p className="text-gray-300">Vamos buscar sua foto e nome</p>
              </div>
              <div className={`space-y-4 transition-all duration-700 delay-400 transform ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-5'
              }`}>
                <Input
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  placeholder="https://instagram.com/seuperfil ou @seuperfil"
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                />
                <Button onClick={fetchInstagramProfile} disabled={isGenerating} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:scale-105">
                  {isGenerating ? 'Gerando...' : '✨ Gerar Ingresso'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex justify-center transform transition-all duration-700 animate-slideUp">
                <div 
                  ref={ticketRef} 
                  data-testid="ticket"
                  className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white rounded-3xl p-8 w-full max-w-2xl shadow-2xl overflow-hidden hover:scale-105 transition-transform duration-300"
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-4 left-4 w-32 h-32 border border-white/20 rounded-full"></div>
                    <div className="absolute bottom-4 right-4 w-24 h-24 border border-white/20 rounded-full"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-white/10 rounded-full"></div>
                  </div>

                  {/* Header */}
                  <div className="relative z-10 text-center mb-8">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-6 py-3 rounded-full inline-flex items-center justify-center font-bold text-lg mb-6 shadow-lg">
                      🎫 INGRESSO VIP EXCLUSIVO
                    </div>
                    <h1 className="text-3xl font-bold mb-2 text-white">
                      IA CORPORATIVA: ALÉM DO CHATGPT
                    </h1>
                    <p className="text-blue-200 text-lg font-medium">Workshop Online Exclusivo</p>
                    <div className="mt-4 flex justify-center space-x-6 text-sm">
                      <div className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                        <span className="text-yellow-400">📅</span> 11 Junho 2025
                      </div>
                      <div className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                        <span className="text-yellow-400">🕐</span> 20h00
                      </div>
                      <div className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                        <span className="text-yellow-400">💻</span> Online
                      </div>
                    </div>
                  </div>

                  {/* Profile Section */}
                  <div className="relative z-10 flex items-center space-x-6 mb-8 bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-yellow-400 shadow-xl">
                      {profileImage ? (
                        <img
                          src={profileImage}
                          alt="Profile"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(instagramFullName)}&background=3b82f6&color=fff&size=200`;
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-bold">
                          {instagramFullName.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold mb-1">{instagramFullName}</h2>
                      <p className="text-blue-200 text-lg mb-2">@{instagramName}</p>
                      <div className="flex flex-wrap gap-3">
                        <span className="bg-green-500 text-green-100 px-3 py-1 rounded-full text-sm font-semibold flex items-center justify-center">
                          ✓ CONFIRMADO
                        </span>
                        <span className="bg-yellow-500 text-yellow-100 px-3 py-1 rounded-full text-sm font-semibold flex items-center justify-center">
                          🎯 VIP ACCESS
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Benefits Section */}
                  <div className="relative z-10 mb-6">
                    <h3 className="text-lg font-bold mb-4 text-center text-yellow-400">🌟 Quem participa ganha:</h3>
                    <div className="grid grid-cols-3 gap-4 text-center text-sm">
                      <div className="bg-white/5 p-3 rounded-lg">
                        <div className="text-2xl mb-1">🎯</div>
                        <div className="font-semibold">Acesso a casos de uso da IA</div>
                      </div>
                      <div className="bg-white/5 p-3 rounded-lg">
                        <div className="text-2xl mb-1">💡</div>
                        <div className="font-semibold">Prompts que serão Usados</div>
                      </div>
                      <div className="bg-white/5 p-3 rounded-lg">
                        <div className="text-2xl mb-1">📹</div>
                        <div className="font-semibold">Acesso a Aula Gravada por 24h</div>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="relative z-10 text-center pt-6 border-t border-white/20">
                    <div className="flex justify-between items-center text-sm text-blue-200">
                      <div>
                        <p className="font-semibold">ID do Ingresso</p>
                        <p className="font-mono">WIA-{instagramName.substring(0, 3).toUpperCase()}-{Math.random().toString(36).substring(2, 8).toUpperCase()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">Valor</p>
                        <p className="text-green-400 font-bold">GRATUITO</p>
                      </div>
                    </div>
                    <p className="mt-4 text-xs opacity-75">
                      Este ingresso é pessoal e intransferível • Workshop IA Corporativa 2025
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-center animate-slideUp delay-300">
                <Button 
                  onClick={downloadAsPNG} 
                  className="bg-green-600 hover:bg-green-700 px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-200 hover:scale-105 shadow-lg touch-manipulation"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  📥 Baixar PNG
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
        }
        
        .delay-300 {
          animation-delay: 0.3s;
          opacity: 0;
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  );
};

export default TicketGenerator;