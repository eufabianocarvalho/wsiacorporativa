import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Download, Instagram } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Background3D from '@/components/Background3D';

interface TicketGeneratorProps {
  userEmail: string;
  userName: string;
  formData: {
    nome: string;
    email: string;
    whatsapp: string;
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
  const ticketRef = useRef<HTMLDivElement>(null);

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
      toast({ title: "Campo obrigatório", description: "Insira seu link ou @ do Instagram", variant: "destructive" });
      return;
    }

    setIsGenerating(true);
    const username = extractInstagramUsername(instagramUrl);
    if (!username) {
      toast({ title: "Usuário inválido", description: "Verifique o link ou o @ informado.", variant: "destructive" });
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
    toast({ title: "Ingresso gerado!", description: "Seu ingresso personalizado foi criado." });
  };

  useEffect(() => {
    if (ticketGenerated) setTimeout(sendTicketToWebhook, 1000);
  }, [ticketGenerated]);

  const sendTicketToWebhook = async () => {
    if (!ticketRef.current) return;
    const canvas = await html2canvas(ticketRef.current, { scale: 2, useCORS: true, backgroundColor: null });
    const imageData = canvas.toDataURL('image/png');
    const payload = {
      ...formData,
      instagramUrl,
      instagramName,
      instagramFullName,
      profileImage,
      ticketImage: imageData,
      timestamp: new Date().toISOString(),
      action: 'ticket_generated',
    };
    await fetch('https://hook.us1.make.com/5kpb2wdyfl9tf7y6u0tu44ypaal8l8tj', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  };

  const generateAndSendImage = async (format: 'PNG' | 'PDF') => {
    if (!ticketRef.current) return null;
    const canvas = await html2canvas(ticketRef.current, { 
      scale: 3, 
      useCORS: true,
      backgroundColor: null  // Fundo transparente
    });
    const imgData = canvas.toDataURL('image/png');
    if (format === 'PNG') return imgData;
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [200, 120] });
    const imgWidth = 180;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
    return pdf.output('datauristring');
  };

  const downloadAsPNG = async () => {
    const imageData = await generateAndSendImage('PNG');
    if (!imageData) return;
    const link = document.createElement('a');
    link.href = imageData;
    link.download = `ingresso-${instagramName}.png`;
    link.click();
  };

  const downloadAsPDF = async () => {
    const pdfData = await generateAndSendImage('PDF');
    if (!pdfData) return;
    const response = await fetch(pdfData);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ingresso-${instagramName}.pdf`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <Background3D />
      <div className="relative z-10 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {!ticketGenerated ? (
            <div className="bg-gray-900/80 rounded-3xl p-8 shadow-2xl max-w-md mx-auto">
              <div className="text-center mb-6">
                <Instagram className="mx-auto text-pink-500 mb-4" size={48} />
                <h2 className="text-2xl font-bold text-white mb-2">Cole seu link do Instagram</h2>
                <p className="text-gray-300">Vamos buscar sua foto e nome</p>
              </div>
              <Input
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                placeholder="https://instagram.com/seuperfil ou @seuperfil"
                className="mb-4"
              />
              <Button onClick={fetchInstagramProfile} disabled={isGenerating} className="w-full">
                {isGenerating ? 'Gerando...' : '✨ Gerar Ingresso'}
              </Button>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex justify-center">
                <div ref={ticketRef} className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white rounded-3xl p-8 w-full max-w-2xl shadow-2xl overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-4 left-4 w-32 h-32 border border-white/20 rounded-full"></div>
                    <div className="absolute bottom-4 right-4 w-24 h-24 border border-white/20 rounded-full"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-white/10 rounded-full"></div>
                  </div>

                  {/* Header */}
                  <div className="relative z-10 text-center mb-8">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-6 py-3 rounded-full inline-block font-bold text-lg mb-6 shadow-lg">
                      🎫 INGRESSO VIP EXCLUSIVO
                    </div>
                    <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                      IA CORPORATIVA: ALÉM DO CHATGPT
                    </h1>
                    <p className="text-blue-200 text-lg font-medium">Workshop Online Exclusivo</p>
                    <div className="mt-4 flex justify-center space-x-6 text-sm">
                      <div className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                        <span className="text-yellow-400">📅</span> 15 Junho 2025
                      </div>
                      <div className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                        <span className="text-yellow-400">🕐</span> 19:30
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
                      <div className="flex space-x-3">
                        <span className="bg-green-500 text-green-100 px-3 py-1 rounded-full text-sm font-semibold">
                          ✓ CONFIRMADO
                        </span>
                        <span className="bg-yellow-500 text-yellow-100 px-3 py-1 rounded-full text-sm font-semibold">
                          🎯 VIP ACCESS
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Benefits Section */}
                  <div className="relative z-10 mb-6">
                    <h3 className="text-lg font-bold mb-4 text-center text-yellow-400">🌟 SEUS BENEFÍCIOS VIP</h3>
                    <div className="grid grid-cols-3 gap-4 text-center text-sm">
                      <div className="bg-white/5 p-3 rounded-lg">
                        <div className="text-2xl mb-1">📚</div>
                        <div className="font-semibold">Material Exclusivo</div>
                      </div>
                      <div className="bg-white/5 p-3 rounded-lg">
                        <div className="text-2xl mb-1">🎥</div>
                        <div className="font-semibold">Gravação Vitalícia</div>
                      </div>
                      <div className="bg-white/5 p-3 rounded-lg">
                        <div className="text-2xl mb-1">💬</div>
                        <div className="font-semibold">Suporte Premium</div>
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
              <div className="flex flex-col md:flex-row gap-4 justify-center max-w-md mx-auto">
                <Button onClick={downloadAsPNG} className="flex-1 bg-green-600">📥 Baixar PNG</Button>
                <Button onClick={downloadAsPDF} className="flex-1 bg-red-600">📄 Baixar PDF</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketGenerator;