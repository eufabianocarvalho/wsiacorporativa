
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Brain, Cpu, Sparkles, Home, ArrowLeft } from 'lucide-react';
import Background3D from '@/components/Background3D';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden bg-black flex items-center justify-center">
      <Background3D />
      
      <div className="relative z-10 text-center max-w-2xl mx-auto px-4">
        <div className="bg-gray-900/80 backdrop-blur-md border border-gray-700/50 rounded-3xl p-12 shadow-2xl hover:shadow-blue-500/20 hover:border-blue-500/30 transition-all duration-300 hover:scale-105">
          {/* Icons */}
          <div className="flex justify-center items-center mb-8">
            <Brain className="w-16 h-16 text-slate-300 mr-4 animate-pulse hover:text-blue-400 hover:scale-110 transition-all duration-300" />
            <Cpu className="w-20 h-20 text-slate-400 animate-spin hover:text-blue-300 hover:scale-110 transition-all duration-300" style={{ animationDuration: '3s' }} />
            <Sparkles className="w-16 h-16 text-slate-300 ml-4 animate-pulse hover:text-blue-400 hover:scale-110 transition-all duration-300" />
          </div>

          {/* Error Message */}
          <h1 className="text-8xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-slate-300 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300">
            404
          </h1>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-200 hover:text-blue-300 transition-colors duration-300">
            PÁGINA NÃO ENCONTRADA
          </h2>
          
          <p className="text-xl text-gray-300 mb-8 hover:text-blue-200 transition-colors duration-300">
            A página que você está procurando não existe ou foi movida.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/')}
              className="h-14 text-lg font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-500 hover:via-blue-600 hover:to-blue-700 text-white shadow-2xl transform hover:scale-105 transition-all duration-300 px-8 border-0 rounded-2xl hover:shadow-blue-500/50"
            >
              <Home className="mr-3 hover:rotate-12 transition-transform duration-300" size={20} />
              VOLTAR AO INÍCIO
            </Button>
            
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="h-14 text-lg font-bold border-2 border-slate-600/50 bg-slate-800/80 text-white hover:bg-slate-700/80 hover:border-blue-400 shadow-xl transform hover:scale-105 transition-all duration-300 px-8 rounded-2xl backdrop-blur-sm"
            >
              <ArrowLeft className="mr-3 hover:translate-x-1 transition-transform duration-300" size={20} />
              PÁGINA ANTERIOR
            </Button>
          </div>

          {/* Workshop Link */}
          <div className="mt-8 pt-8 border-t border-gray-700/30">
            <p className="text-gray-400 mb-4 hover:text-blue-300 transition-colors duration-300">
              Que tal conhecer nossa Masterclass sobre IA Corporativa?
            </p>
            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 transition-all duration-300 hover:scale-105"
            >
              <Sparkles className="mr-2" size={16} />
              Ir para o Workshop
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
