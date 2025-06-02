import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Calendar, Users, Target, Zap, CheckCircle, Brain, Cpu, Sparkles, Award, Building, Code, Rocket } from 'lucide-react';
import TicketGenerator from '@/components/TicketGenerator';
import Background3D from '@/components/Background3D';

const Index = () => {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    whatsapp: '',
    perfil: '',
    nivel: '',
    desafio: ''
  });
  const [showTicketGenerator, setShowTicketGenerator] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    userEmail: '',
    userName: ''
  });

  // Countdown timer - Target date: June 4, 2025 at 8 PM
  useEffect(() => {
    const targetDate = new Date('2025-06-04T20:00:00-03:00').getTime();
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;
      if (difference > 0) {
        setCountdown({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor(difference % (1000 * 60 * 60 * 24) / (1000 * 60 * 60)),
          minutes: Math.floor(difference % (1000 * 60 * 60) / (1000 * 60)),
          seconds: Math.floor(difference % (1000 * 60) / 1000)
        });
      }
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {
      name,
      value
    } = e.target;
    if (name === 'whatsapp') {
      const formatted = value.replace(/\D/g, '').replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      setFormData(prev => ({
        ...prev,
        [name]: formatted
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.email || !formData.whatsapp || !formData.perfil || !formData.nivel) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    setIsLoading(true);
    try {
      // Store registration data and proceed to ticket generation
      setRegistrationData({
        userEmail: formData.email,
        userName: formData.nome
      });
      setShowTicketGenerator(true);
      toast({
        title: "Inscrição realizada com sucesso! 🎉",
        description: "Agora vamos gerar seu ingresso personalizado. Digite seu Instagram para personalizar!"
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erro na inscrição",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  if (showTicketGenerator) {
    return <TicketGenerator userEmail={registrationData.userEmail} userName={registrationData.userName} formData={formData} />;
  }
  return <div className="min-h-screen relative overflow-hidden bg-black">
      <Background3D />
      
      {/* Header/Hero Section */}
      <header className="relative z-10 overflow-hidden backdrop-blur-sm text-white">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative container mx-auto px-4 py-8 md:py-16 text-center">
          <div className="mb-6 md:mb-8">
            <div className="flex justify-center items-center mb-4 md:mb-6">
              <Brain className="w-8 h-8 md:w-12 md:h-12 text-slate-300 mr-2 md:mr-4 animate-pulse hover:text-blue-400 hover:scale-110 transition-all duration-300" />
              <Cpu className="w-10 h-10 md:w-16 md:h-16 text-slate-400 animate-spin hover:text-blue-300 hover:scale-110 transition-all duration-300" style={{
              animationDuration: '3s'
            }} />
              <Sparkles className="w-8 h-8 md:w-12 md:h-12 text-slate-300 ml-2 md:ml-4 animate-pulse hover:text-blue-400 hover:scale-110 transition-all duration-300" />
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-white via-gray-200 to-slate-300 bg-clip-text text-transparent hover:scale-105 transition-transform">
              IA CORPORATIVA
            </h1>
            <h2 className="text-lg md:text-2xl lg:text-3xl mb-4 md:mb-6 text-gray-200 font-semibold hover:text-blue-300 transition-colors duration-300">
              ALÉM DO CHATGPT
            </h2>
            <p className="text-base md:text-xl lg:text-2xl font-bold mb-6 md:mb-8 text-gray-100 hover:text-blue-200 transition-colors duration-300 px-2">
              🚀 Workshop Online Gratuito Para Profissionais Corporativos
            </p>
          </div>

          {/* Event Date */}
          <div className="bg-gray-900/80 backdrop-blur-md border border-gray-700/50 rounded-2xl md:rounded-3xl p-4 md:p-8 mb-6 md:mb-8 max-w-2xl mx-auto shadow-2xl hover:shadow-blue-500/20 hover:border-blue-500/30 transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-center mb-3 md:mb-4">
              <Calendar className="mr-2 md:mr-3 text-blue-400 hover:text-blue-300 transition-colors duration-300" size={20} />
              <span className="text-lg md:text-2xl font-bold">04 DE JUNHO 2025 | 20h</span>
            </div>
            <div className="flex items-center justify-center">
              <span className="text-red-500 font-bold text-sm md:text-lg text-center">🎯 VAGAS LIMITADAS - GRUPO SELETO</span>
            </div>
          </div>

          {/* Botão Garanta sua Vaga */}
          <div className="mb-6 md:mb-8 flex justify-center">
            <Button 
              onClick={() => document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' })} 
              className="w-full max-w-md h-12 md:h-14 text-sm md:text-base font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-500 hover:via-blue-600 hover:to-blue-700 text-white shadow-2xl transform hover:scale-105 transition-all duration-300 px-4 md:px-6 border-0 rounded-xl md:rounded-2xl hover:shadow-blue-500/50"
            >
              <Rocket className="mr-2 hover:rotate-12 transition-transform duration-300 flex-shrink-0" size={16} />
              <span>GARANTIR MINHA VAGA GRATUITA</span>
            </Button>
          </div>

          {/* Countdown Timer */}
          <div className="bg-gradient-to-r from-gray-800/90 to-gray-900/90 backdrop-blur-md rounded-2xl md:rounded-3xl p-4 md:p-8 mb-6 md:mb-8 max-w-4xl mx-auto shadow-2xl border border-gray-700/30 hover:shadow-blue-500/20 hover:border-blue-500/20 transition-all duration-300 hover:scale-105">
            <h3 className="text-xl md:text-3xl font-bold text-white mb-4 md:mb-6 flex items-center justify-center text-center">
              ⏰ TEMPO LIMITADO PARA INSCRIÇÕES
            </h3>
            <div className="grid grid-cols-4 gap-2 md:gap-6 text-center">
              <div className="bg-gray-800/70 backdrop-blur-sm rounded-xl md:rounded-2xl p-2 md:p-4 border border-gray-600/30 hover:border-blue-500/40 hover:shadow-blue-500/20 hover:scale-105 transition-all duration-300">
                <div className="text-2xl md:text-4xl font-bold text-white">{countdown.days}</div>
                <div className="text-xs md:text-sm text-gray-300 font-semibold">DIAS</div>
              </div>
              <div className="bg-gray-800/70 backdrop-blur-sm rounded-xl md:rounded-2xl p-2 md:p-4 border border-gray-600/30 hover:border-blue-500/40 hover:shadow-blue-500/20 hover:scale-105 transition-all duration-300">
                <div className="text-2xl md:text-4xl font-bold text-white">{countdown.hours}</div>
                <div className="text-xs md:text-sm text-gray-300 font-semibold">HORAS</div>
              </div>
              <div className="bg-gray-800/70 backdrop-blur-sm rounded-xl md:rounded-2xl p-2 md:p-4 border border-gray-600/30 hover:border-blue-500/40 hover:shadow-blue-500/20 hover:scale-105 transition-all duration-300">
                <div className="text-2xl md:text-4xl font-bold text-white">{countdown.minutes}</div>
                <div className="text-xs md:text-sm text-gray-300 font-semibold">MIN</div>
              </div>
              <div className="bg-gray-800/70 backdrop-blur-sm rounded-xl md:rounded-2xl p-2 md:p-4 border border-gray-600/30 hover:border-blue-500/40 hover:shadow-blue-500/20 hover:scale-105 transition-all duration-300">
                <div className="text-2xl md:text-4xl font-bold text-white">{countdown.seconds}</div>
                <div className="text-xs md:text-sm text-gray-300 font-semibold">SEG</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Registration Form */}
      <section className="relative z-10 py-8 md:py-16 bg-black/60 backdrop-blur-sm">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-4 bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300">
              🚀 GARANTA SUA VAGA AGORA
            </h2>
            <p className="text-lg md:text-xl text-gray-300 hover:text-blue-300 transition-colors duration-300 px-2">
              Preencha o formulário abaixo e receba acesso exclusivo
            </p>
          </div>

          <div className="bg-gray-900/70 backdrop-blur-md rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-2xl border border-gray-700/50 hover:shadow-blue-500/20 hover:border-blue-500/30 transition-all duration-300 hover:scale-105">
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                <div className="hover:scale-105 transition-transform duration-300">
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Nome Completo *
                  </label>
                  <Input name="nome" value={formData.nome} onChange={handleInputChange} required className="h-10 md:h-12 border-2 border-slate-600/50 bg-slate-800/80 text-white placeholder-slate-400 focus:border-blue-400 focus:ring-blue-400 backdrop-blur-sm hover:border-slate-400 transition-all duration-300" placeholder="Seu nome completo" />
                </div>
                <div className="hover:scale-105 transition-transform duration-300">
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    E-mail *
                  </label>
                  <Input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="h-10 md:h-12 border-2 border-slate-600/50 bg-slate-800/80 text-white placeholder-slate-400 focus:border-blue-400 focus:ring-blue-400 backdrop-blur-sm hover:border-slate-400 transition-all duration-300" placeholder="seu@email.com" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                <div className="hover:scale-105 transition-transform duration-300">
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    WhatsApp *
                  </label>
                  <Input name="whatsapp" value={formData.whatsapp} onChange={handleInputChange} required className="h-10 md:h-12 border-2 border-slate-600/50 bg-slate-800/80 text-white placeholder-slate-400 focus:border-blue-400 focus:ring-blue-400 backdrop-blur-sm hover:border-slate-400 transition-all duration-300" placeholder="(11) 99999-9999" maxLength={15} />
                </div>
                <div className="hover:scale-105 transition-transform duration-300">
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Perfil *
                  </label>
                  <Select onValueChange={value => handleSelectChange('perfil', value)}>
                    <SelectTrigger className="h-10 md:h-12 border-2 border-slate-600/50 bg-slate-800/80 text-white focus:border-blue-400 focus:ring-blue-400 backdrop-blur-sm hover:border-slate-400 transition-all duration-300">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600/50 text-white">
                      <SelectItem value="gestor" className="text-white hover:bg-slate-700">Gestor/Líder</SelectItem>
                      <SelectItem value="empresario" className="text-white hover:bg-slate-700">Empresário</SelectItem>
                      <SelectItem value="clevel" className="text-white hover:bg-slate-700">C-Level</SelectItem>
                      <SelectItem value="analista" className="text-white hover:bg-slate-700">Analista/Especialista</SelectItem>
                      <SelectItem value="consultor" className="text-white hover:bg-slate-700">Consultor</SelectItem>
                      <SelectItem value="outro" className="text-white hover:bg-slate-700">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="hover:scale-105 transition-transform duration-300">
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  Nível com IA *
                </label>
                <Select onValueChange={value => handleSelectChange('nivel', value)}>
                  <SelectTrigger className="h-10 md:h-12 border-2 border-slate-600/50 bg-slate-800/80 text-white focus:border-blue-400 focus:ring-blue-400 backdrop-blur-sm hover:border-slate-400 transition-all duration-300">
                    <SelectValue placeholder="Selecione seu nível" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600/50 text-white">
                    <SelectItem value="nao-uso" className="text-white hover:bg-slate-700">Não uso nada</SelectItem>
                    <SelectItem value="so-vi-chatgpt" className="text-white hover:bg-slate-700">Só vi um pouco do ChatGPT (ou similar)</SelectItem>
                    <SelectItem value="uso-dia-a-dia" className="text-white hover:bg-slate-700">Uso no dia a dia o ChatGPT e algumas outras IAs</SelectItem>
                    <SelectItem value="especialista" className="text-white hover:bg-slate-700">Sou especialista</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="hover:scale-105 transition-transform duration-300">
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  Seu Maior Desafio
                </label>
                <Textarea name="desafio" value={formData.desafio} onChange={handleInputChange} className="border-2 border-slate-600/50 bg-slate-800/80 text-white placeholder-slate-400 focus:border-blue-400 focus:ring-blue-400 backdrop-blur-sm hover:border-slate-400 transition-all duration-300" placeholder="Qual o principal desafio no seu trabalho que a IA poderia resolver?" rows={3} />
              </div>

              <Button type="submit" disabled={isLoading} className="w-full h-12 md:h-16 text-sm md:text-xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-500 hover:via-blue-600 hover:to-blue-700 text-white shadow-2xl transform hover:scale-105 transition-all duration-300 border-0 rounded-xl md:rounded-2xl hover:shadow-blue-500/50">
                {isLoading ? <div className="flex items-center">
                    <Cpu className="animate-spin mr-2 md:mr-3 flex-shrink-0" size={16} />
                    <span className="truncate">PROCESSANDO...</span>
                  </div> : <div className="flex items-center">
                    <Sparkles className="mr-2 md:mr-3 hover:rotate-12 transition-transform duration-300 flex-shrink-0" size={16} />
                    <span className="truncate">🚀 GARANTIR MINHA VAGA GRATUITA</span>
                  </div>}
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Quem vai lhe guiar nessa jornada */}
      <section className="relative z-10 py-8 md:py-16 bg-black/70 backdrop-blur-sm text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300">
              QUEM VAI LHE GUIAR NESSA JORNADA
            </h2>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl md:rounded-3xl p-4 md:p-8 border border-slate-700/30 hover:scale-105 hover:shadow-blue-500/20 hover:border-blue-500/30 transition-all duration-300 hover:bg-slate-800/80">
              <div className="flex flex-col lg:flex-row items-center gap-6 md:gap-8">
                {/* Foto do Fabiano */}
                <div className="flex-shrink-0">
                  <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-blue-400/30 shadow-2xl hover:border-blue-400/60 transition-all duration-300">
                    <img src="/lovable-uploads/74907e01-52ab-4781-a984-87c339cf767c.png" alt="Fabiano Carvalho" className="w-full h-full object-cover object-center scale-125" />
                  </div>
                </div>

                {/* Informações do Fabiano */}
                <div className="flex-1 text-center lg:text-left">
                  <h3 className="text-2xl md:text-4xl font-bold text-white mb-4 md:mb-6 hover:text-blue-300 transition-colors duration-300">
                    FABIANO CARVALHO
                  </h3>
                  
                  <div className="space-y-3 md:space-y-4 text-base md:text-lg text-slate-200">
                    <div className="flex items-start space-x-3 hover:scale-105 transition-transform duration-300">
                      <Brain className="text-blue-400 mt-1 flex-shrink-0" size={20} />
                      <span className="hover:text-blue-200 transition-colors duration-300">
                        Especialista em Inteligência Artificial com ênfase em Machine Learning.
                      </span>
                    </div>

                    <div className="flex items-start space-x-3 hover:scale-105 transition-transform duration-300">
                      <Building className="text-blue-400 mt-1 flex-shrink-0" size={20} />
                      <span className="hover:text-blue-200 transition-colors duration-300">
                        Fundador da Startup Carper Soluções Tecnológicas, que produz soluções de IA para o mundo corporativo. Startup premiada no programa Startup Nordestes. Startup Top 1000 no Startup Brasil 2025.
                      </span>
                    </div>

                    <div className="flex items-start space-x-3 hover:scale-105 transition-transform duration-300">
                      <Award className="text-blue-400 mt-1 flex-shrink-0" size={20} />
                      <span className="hover:text-blue-200 transition-colors duration-300">
                        Executivo com mais de 30 anos de experiência em grandes projetos.
                      </span>
                    </div>

                    <div className="flex items-start space-x-3 hover:scale-105 transition-transform duration-300">
                      <Code className="text-blue-400 mt-1 flex-shrink-0" size={20} />
                      <span className="hover:text-blue-200 transition-colors duration-300">
                        Atua com tecnologia desde 1994.
                      </span>
                    </div>

                    <div className="flex items-start space-x-3 hover:scale-105 transition-transform duration-300">
                      <Sparkles className="text-blue-400 mt-1 flex-shrink-0" size={20} />
                      <span className="hover:text-blue-200 transition-colors duration-300">
                        Polímata: possui experiência profunda em diversas áreas, algo que ajuda a criar soluções práticas e eficazes em diversos setores dos negócios.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="relative z-10 py-8 md:py-16 bg-black/70 backdrop-blur-sm text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300">
              AO FINAL DO WORKSHOP, VOCÊ TERÁ:
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 max-w-6xl mx-auto">
            {["Visão clara de como IA pode revolucionar seu negócio (com cases reais)", "Metodologia comprovada para implementação corporativa (passo a passo)", "Identificação de 3-5 oportunidades de IA no seu setor (análise personalizada)", "Roadmap estratégico para os próximos 90 dias (plano de ação)", "Acesso a recursos e parcerias exclusivas (apenas para participantes)", "Network de executivos implementando IA (grupo VIP contínuo)"].map((item, index) => <div key={index} className="flex items-start space-x-3 bg-slate-800/60 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-slate-700/30 hover:scale-105 hover:shadow-blue-500/20 hover:border-blue-500/30 transition-all duration-300 hover:bg-slate-800/80">
                <CheckCircle className="text-slate-300 mt-1 flex-shrink-0 hover:text-blue-400 transition-colors duration-300" size={20} />
                <span className="text-base md:text-lg hover:text-blue-200 transition-colors duration-300">{item}</span>
              </div>)}
          </div>
        </div>
      </section>

      {/* Workshop Content */}
      <section className="relative z-10 py-8 md:py-16 bg-black/60 backdrop-blur-sm text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-xl md:text-3xl lg:text-5xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent leading-tight hover:scale-105 transition-transform duration-300">
              2 HORAS QUE VÃO TRANSFORMAR<br />
              <span className="text-blue-400 hover:text-blue-300 transition-colors duration-300">SUA VISÃO SOBRE IA</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 md:gap-12 max-w-6xl mx-auto">
            <div className="space-y-6 md:space-y-8">
              <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl md:rounded-3xl p-4 md:p-8 border border-slate-700/30 hover:scale-105 hover:shadow-blue-500/20 hover:border-blue-500/30 transition-all duration-300 hover:bg-slate-800/80">
                <h3 className="text-lg md:text-2xl font-bold mb-3 md:mb-4 flex items-center">
                  <Zap className="mr-2 md:mr-3 text-yellow-400 flex-shrink-0" size={20} />
                  <span className="text-yellow-400">DEMONSTRAÇÃO AO VIVO</span>
                </h3>
                <p className="text-slate-200 mb-3 md:mb-4 hover:text-blue-200 transition-colors duration-300">Você verá na prática como empresas estão implementando IA para:</p>
                <ul className="space-y-2 text-slate-200 text-sm md:text-base">
                  <li className="hover:text-blue-200 transition-colors duration-300">• Automatizar processos complexos (não apenas tarefas simples)</li>
                  <li className="hover:text-blue-200 transition-colors duration-300">• Multiplicar produtividade em vendas, marketing e operações</li>
                  <li className="hover:text-blue-200 transition-colors duration-300">• Reduzir custos operacionais em até 40%</li>
                  <li className="hover:text-blue-200 transition-colors duration-300">• Acelerar tomada de decisões com análise preditiva</li>
                </ul>
              </div>

              <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl md:rounded-3xl p-4 md:p-8 border border-slate-700/30 hover:scale-105 hover:shadow-blue-500/20 hover:border-blue-500/30 transition-all duration-300 hover:bg-slate-800/80">
                <h3 className="text-lg md:text-2xl font-bold mb-3 md:mb-4 flex items-center">
                  <Target className="mr-2 md:mr-3 text-green-400 flex-shrink-0" size={20} />
                  <span className="text-green-400">CASES REAIS DE SUCESSO</span>
                </h3>
                <ul className="space-y-2 text-slate-200 text-sm md:text-base">
                  <li className="hover:text-blue-200 transition-colors duration-300">• Como uma empresa reduziu tempo em relatórios financeiros</li>
                  <li className="hover:text-blue-200 transition-colors duration-300">• Estratégia de IA que aumenta conversão em vendas 30%+</li>
                  <li className="hover:text-blue-200 transition-colors duration-300">• Otimização de processos de RH em grande empresa</li>
                  <li className="hover:text-blue-200 transition-colors duration-300">• Sistema de IA que revolucionou atendimento ao cliente</li>
                  <li className="hover:text-blue-200 transition-colors duration-300">• Implementação que otimizou Segurança do Trabalho</li>
                </ul>
              </div>
            </div>

            <div className="space-y-6 md:space-y-8">
              <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl md:rounded-3xl p-4 md:p-8 border border-slate-700/30 hover:scale-105 hover:shadow-blue-500/20 hover:border-blue-500/30 transition-all duration-300 hover:bg-slate-800/80">
                <h3 className="text-lg md:text-2xl font-bold mb-3 md:mb-4 flex items-center">
                  <CheckCircle className="mr-2 md:mr-3 text-green-400 flex-shrink-0" size={20} />
                  <span className="text-green-400">METODOLOGIA EXCLUSIVA</span>
                </h3>
                <ul className="space-y-2 text-slate-200 text-sm md:text-base">
                  <li className="hover:text-blue-200 transition-colors duration-300">• Framework de 3 etapas para implementação corporativa</li>
                  <li className="hover:text-blue-200 transition-colors duration-300">• Análise de ROI para projetos de IA</li>
                  <li className="hover:text-blue-200 transition-colors duration-300">• Roadmap estratégico personalizado para seu setor</li>
                  <li className="hover:text-blue-200 transition-colors duration-300">• Identificação de oportunidades no seu negócio atual</li>
                </ul>
              </div>

              <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl md:rounded-3xl p-4 md:p-8 border border-slate-700/30 hover:scale-105 hover:shadow-blue-500/20 hover:border-blue-500/30 transition-all duration-300 hover:bg-slate-800/80">
                <h3 className="text-lg md:text-2xl font-bold mb-3 md:mb-4 text-blue-400 hover:text-blue-300 transition-colors duration-300">
                  🚀 APLICAÇÕES PRÁTICAS EM:
                </h3>
                <div className="flex flex-wrap gap-2 md:gap-3">
                  {['Vendas', 'Marketing', 'RH', 'Financeiro', 'Gestão', 'TI', 'Processos', 'Segurança'].map((area, index) => <span key={index} className="bg-gradient-to-r from-slate-600 to-slate-700 text-white px-2 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold shadow-lg border border-slate-500/30 hover:from-blue-600 hover:to-blue-700 hover:scale-110 transition-all duration-300">
                      {area}
                    </span>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Elements */}
      <section className="relative z-10 py-8 md:py-16 bg-black/80 backdrop-blur-sm text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300">
              POR QUE ESSE WORKSHOP É DIFERENTE?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 max-w-6xl mx-auto">
            {[{
            icon: Target,
            title: "ACESSO EXCLUSIVO",
            desc: "Conteúdo desenvolvido especificamente para líderes corporativos"
          }, {
            icon: Zap,
            title: "DEMONSTRAÇÕES REAIS",
            desc: "Verá implementações funcionando ao vivo"
          }, {
            icon: CheckCircle,
            title: "ESTRATÉGIA PRÁTICA",
            desc: "Saia com um plano de ação personalizado"
          }, {
            icon: Users,
            title: "NETWORKING QUALIFICADO",
            desc: "Conecte-se com outros executivos visionários"
          }, {
            icon: Brain,
            title: "RESULTADOS MENSURÁVEIS",
            desc: "Cases com ROI comprovado"
          }, {
            icon: Sparkles,
            title: "OPORTUNIDADES EXCLUSIVAS",
            desc: "Recursos e parcerias apenas para participantes"
          }].map((item, index) => <div key={index} className="text-center bg-slate-800/60 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-slate-700/30 hover:scale-105 hover:shadow-blue-500/20 hover:border-blue-500/30 transition-all duration-300 hover:bg-slate-800/80">
                <item.icon className="mx-auto mb-3 md:mb-4 text-slate-300 hover:text-blue-400 transition-colors duration-300" size={32} />
                <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 hover:text-blue-300 transition-colors duration-300">{item.title}</h3>
                <p className="text-sm md:text-base text-slate-300 hover:text-blue-200 transition-colors duration-300">{item.desc}</p>
              </div>)}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 md:py-16 bg-black/95 backdrop-blur-sm text-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-bold mb-6 md:mb-8 bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300">DETALHES DO WORKSHOP</h2>
            
            <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-center justify-center md:justify-start hover:scale-105 transition-transform duration-300">
                  <CheckCircle className="mr-2 md:mr-3 text-slate-300 hover:text-green-400 transition-colors duration-300" size={16} />
                  <span className="hover:text-blue-200 transition-colors duration-300 text-sm md:text-base">Workshop 100% gratuito e online via Zoom</span>
                </div>
                <div className="flex items-center justify-center md:justify-start hover:scale-105 transition-transform duration-300">
                  <CheckCircle className="mr-2 md:mr-3 text-slate-300 hover:text-green-400 transition-colors duration-300" size={16} />
                  <span className="hover:text-blue-200 transition-colors duration-300 text-sm md:text-base">Link de acesso enviado por e-mail e WhatsApp</span>
                </div>
                <div className="flex items-center justify-center md:justify-start hover:scale-105 transition-transform duration-300">
                  <CheckCircle className="mr-2 md:mr-3 text-slate-300 hover:text-green-400 transition-colors duration-300" size={16} />
                  <span className="hover:text-blue-200 transition-colors duration-300 text-sm md:text-base">Gravação exclusiva disponível por 72h</span>
                </div>
                <div className="flex items-center justify-center md:justify-start hover:scale-105 transition-transform duration-300">
                  <CheckCircle className="mr-2 md:mr-3 text-slate-300 hover:text-green-400 transition-colors duration-300" size={16} />
                  <span className="hover:text-blue-200 transition-colors duration-300 text-sm md:text-base">Kit de materiais de apoio inclusos</span>
                </div>
              </div>
              
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-center justify-center md:justify-start hover:scale-105 transition-transform duration-300">
                  <CheckCircle className="mr-2 md:mr-3 text-slate-300 hover:text-green-400 transition-colors duration-300" size={16} />
                  <span className="hover:text-blue-200 transition-colors duration-300 text-sm md:text-base">Grupo VIP no WhatsApp para networking</span>
                </div>
                <div className="flex items-center justify-center md:justify-start hover:scale-105 transition-transform duration-300">
                  <CheckCircle className="mr-2 md:mr-3 text-slate-300 hover:text-green-400 transition-colors duration-300" size={16} />
                  <span className="hover:text-blue-200 transition-colors duration-300 text-sm md:text-base">Recursos exclusivos revelados no evento</span>
                </div>
                <div className="flex items-center justify-center md:justify-start hover:scale-105 transition-transform duration-300">
                  <CheckCircle className="mr-2 md:mr-3 text-slate-300 hover:text-green-400 transition-colors duration-300" size={16} />
                  <span className="hover:text-blue-200 transition-colors duration-300 text-sm md:text-base">Acesso prioritário a futuras oportunidades</span>
                </div>
                <div className="flex items-center justify-center md:justify-start hover:scale-105 transition-transform duration-300">
                  <CheckCircle className="mr-2 md:mr-3 text-slate-300 hover:text-green-400 transition-colors duration-300" size={16} />
                  <span className="hover:text-blue-200 transition-colors duration-300 text-sm md:text-base">Suporte contínuo pós-workshop</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl md:rounded-3xl p-4 md:p-8 mb-6 md:mb-8 border border-slate-700/30 hover:scale-105 hover:shadow-blue-500/20 hover:border-blue-500/30 transition-all duration-300 hover:bg-slate-800/80">
              <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-slate-300 hover:text-blue-300 transition-colors duration-300">💎 COMPROMISSO COM A QUALIDADE</h3>
              <p className="text-base md:text-lg text-slate-200 hover:text-blue-200 transition-colors duration-300">
                Este workshop foi desenvolvido com base em anos de experiência prática em implementação de IA corporativa. 
                Nosso foco é entregar conteúdo aplicável que gere resultados reais para sua empresa.
              </p>
            </div>

            <Button onClick={() => document.querySelector('form')?.scrollIntoView({
            behavior: 'smooth'
          })} className="w-full md:w-auto h-12 md:h-16 text-sm md:text-xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-500 hover:via-blue-600 hover:to-blue-700 text-white shadow-2xl transform hover:scale-105 transition-all duration-300 px-4 md:px-12 border-0 rounded-xl md:rounded-2xl hover:shadow-blue-500/50">
              <Rocket className="mr-2 md:mr-3 hover:rotate-12 transition-transform duration-300 flex-shrink-0" size={16} />
              <span>GARANTIR ACESSO VIP GRATUITO</span>
            </Button>
          </div>
        </div>
      </footer>

      {/* Tracking Pixels */}
      <div className="hidden">
        <img src="https://www.facebook.com/tr?id=YOUR_PIXEL_ID&ev=PageView&noscript=1" width="1" height="1" alt="" />
      </div>
    </div>;
};
export default Index;
