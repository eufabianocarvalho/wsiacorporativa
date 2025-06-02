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
    const canvas = await html2canvas(ticketRef.current, { scale: 2, useCORS: true });
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
    const canvas = await html2canvas(ticketRef.current, { scale: 3, useCORS: true });
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
                <div ref={ticketRef} className="bg-blue-900 text-white rounded-3xl p-8 w-full max-w-2xl">
                  <div className="text-center mb-6">
                    <div className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-full inline-block font-bold text-sm mb-4">
                      🎫 INGRESSO VIP
                    </div>
                    <h1 className="text-2xl font-bold">IA CORPORATIVA: ALÉM DO CHATGPT</h1>
                    <p className="text-blue-200">Workshop Online Exclusivo</p>
                  </div>
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-yellow-400">
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
                        <div className="w-full h-full bg-blue-500 flex items-center justify-center">
                          {instagramFullName.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-lg font-bold">{instagramFullName}</p>
                      <p className="text-blue-200">@{instagramName}</p>
                    </div>
                  </div>
                  <div className="text-center pt-4 border-t border-white/20">
                    <p className="text-blue-200 text-sm">
                      ID: WIA-{instagramName.substring(0, 3).toUpperCase()}-{Math.random().toString(36).substring(2, 8).toUpperCase()}
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
