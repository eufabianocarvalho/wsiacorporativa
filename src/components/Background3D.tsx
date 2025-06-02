
import React from 'react';

const Background3D = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Fundo principal preto profissional */}
      <div className="absolute inset-0 bg-black"></div>
      
      {/* Rede Neural 3D com movimento inspirada na imagem */}
      <div className="absolute inset-0">
        {/* Nós da rede neural - distribuídos como na imagem */}
        <div 
          className="absolute top-[15%] left-[10%] w-3 h-3 rounded-full"
          style={{
            background: 'radial-gradient(circle, #ffffff, #e2e8f0)',
            animation: 'neuralPulse 3s ease-in-out infinite, neuralFloat 8s ease-in-out infinite',
            boxShadow: '0 0 15px rgba(255, 255, 255, 0.8), 0 0 30px rgba(96, 165, 250, 0.4)',
          }}
        ></div>
        
        <div 
          className="absolute top-[25%] left-[20%] w-2.5 h-2.5 rounded-full"
          style={{
            background: 'radial-gradient(circle, #ffffff, #e2e8f0)',
            animation: 'neuralPulse 2.5s ease-in-out infinite, neuralFloat 6s ease-in-out infinite reverse',
            boxShadow: '0 0 12px rgba(255, 255, 255, 0.7), 0 0 25px rgba(59, 130, 246, 0.3)',
            animationDelay: '1s'
          }}
        ></div>
        
        <div 
          className="absolute top-[35%] left-[8%] w-2 h-2 rounded-full"
          style={{
            background: 'radial-gradient(circle, #ffffff, #e2e8f0)',
            animation: 'neuralPulse 4s ease-in-out infinite, neuralFloat 10s ease-in-out infinite',
            boxShadow: '0 0 10px rgba(255, 255, 255, 0.6), 0 0 20px rgba(59, 130, 246, 0.4)',
            animationDelay: '2s'
          }}
        ></div>
        
        <div 
          className="absolute top-[45%] left-[15%] w-3.5 h-3.5 rounded-full"
          style={{
            background: 'radial-gradient(circle, #ffffff, #e2e8f0)',
            animation: 'neuralPulse 3.5s ease-in-out infinite, neuralFloat 7s ease-in-out infinite reverse',
            boxShadow: '0 0 18px rgba(255, 255, 255, 0.9), 0 0 35px rgba(96, 165, 250, 0.5)',
            animationDelay: '3s'
          }}
        ></div>
        
        <div 
          className="absolute top-[20%] left-[35%] w-2.5 h-2.5 rounded-full"
          style={{
            background: 'radial-gradient(circle, #ffffff, #e2e8f0)',
            animation: 'neuralPulse 2.8s ease-in-out infinite, neuralFloat 9s ease-in-out infinite',
            boxShadow: '0 0 15px rgba(255, 255, 255, 0.8), 0 0 30px rgba(59, 130, 246, 0.4)',
            animationDelay: '0.5s'
          }}
        ></div>
        
        <div 
          className="absolute top-[40%] left-[45%] w-3 h-3 rounded-full"
          style={{
            background: 'radial-gradient(circle, #ffffff, #e2e8f0)',
            animation: 'neuralPulse 3.2s ease-in-out infinite, neuralFloat 5s ease-in-out infinite reverse',
            boxShadow: '0 0 16px rgba(255, 255, 255, 0.8), 0 0 32px rgba(96, 165, 250, 0.4)',
            animationDelay: '4s'
          }}
        ></div>
        
        <div 
          className="absolute top-[60%] left-[25%] w-2 h-2 rounded-full"
          style={{
            background: 'radial-gradient(circle, #ffffff, #e2e8f0)',
            animation: 'neuralPulse 2.7s ease-in-out infinite, neuralFloat 8s ease-in-out infinite',
            boxShadow: '0 0 12px rgba(255, 255, 255, 0.7), 0 0 25px rgba(59, 130, 246, 0.3)',
            animationDelay: '1.5s'
          }}
        ></div>
        
        <div 
          className="absolute top-[30%] left-[60%] w-2.5 h-2.5 rounded-full"
          style={{
            background: 'radial-gradient(circle, #ffffff, #e2e8f0)',
            animation: 'neuralPulse 3.8s ease-in-out infinite, neuralFloat 6s ease-in-out infinite reverse',
            boxShadow: '0 0 14px rgba(255, 255, 255, 0.7), 0 0 28px rgba(96, 165, 250, 0.4)',
            animationDelay: '2.5s'
          }}
        ></div>
        
        <div 
          className="absolute top-[50%] left-[70%] w-3 h-3 rounded-full"
          style={{
            background: 'radial-gradient(circle, #ffffff, #e2e8f0)',
            animation: 'neuralPulse 2.9s ease-in-out infinite, neuralFloat 9s ease-in-out infinite',
            boxShadow: '0 0 16px rgba(255, 255, 255, 0.8), 0 0 32px rgba(59, 130, 246, 0.4)',
            animationDelay: '3.5s'
          }}
        ></div>
        
        <div 
          className="absolute top-[70%] left-[55%] w-2 h-2 rounded-full"
          style={{
            background: 'radial-gradient(circle, #ffffff, #e2e8f0)',
            animation: 'neuralPulse 3.3s ease-in-out infinite, neuralFloat 7s ease-in-out infinite reverse',
            boxShadow: '0 0 11px rgba(255, 255, 255, 0.6), 0 0 22px rgba(96, 165, 250, 0.3)',
            animationDelay: '4.5s'
          }}
        ></div>
        
        <div 
          className="absolute top-[15%] left-[80%] w-2.5 h-2.5 rounded-full"
          style={{
            background: 'radial-gradient(circle, #ffffff, #e2e8f0)',
            animation: 'neuralPulse 2.6s ease-in-out infinite, neuralFloat 8s ease-in-out infinite',
            boxShadow: '0 0 13px rgba(255, 255, 255, 0.7), 0 0 26px rgba(59, 130, 246, 0.4)',
            animationDelay: '1.8s'
          }}
        ></div>
        
        <div 
          className="absolute top-[45%] left-[85%] w-3 h-3 rounded-full"
          style={{
            background: 'radial-gradient(circle, #ffffff, #e2e8f0)',
            animation: 'neuralPulse 3.1s ease-in-out infinite, neuralFloat 6s ease-in-out infinite reverse',
            boxShadow: '0 0 17px rgba(255, 255, 255, 0.8), 0 0 34px rgba(96, 165, 250, 0.5)',
            animationDelay: '2.8s'
          }}
        ></div>
        
        <div 
          className="absolute top-[65%] left-[75%] w-2 h-2 rounded-full"
          style={{
            background: 'radial-gradient(circle, #ffffff, #e2e8f0)',
            animation: 'neuralPulse 2.4s ease-in-out infinite, neuralFloat 9s ease-in-out infinite',
            boxShadow: '0 0 10px rgba(255, 255, 255, 0.6), 0 0 20px rgba(59, 130, 246, 0.3)',
            animationDelay: '3.2s'
          }}
        ></div>

        {/* Conexões da rede neural com brilho animado */}
        <svg className="absolute inset-0 w-full h-full opacity-70" style={{ pointerEvents: 'none' }}>
          <defs>
            <linearGradient id="neuralConnection1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="neuralConnection2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e40af" stopOpacity="0.7" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.5" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Conexões principais como na imagem */}
          <line 
            x1="10%" y1="15%" x2="20%" y2="25%" 
            stroke="url(#neuralConnection1)" 
            strokeWidth="1.5"
            filter="url(#glow)"
            style={{ animation: 'neuralFlow 4s ease-in-out infinite' }}
          />
          <line 
            x1="20%" y1="25%" x2="35%" y2="20%" 
            stroke="url(#neuralConnection2)" 
            strokeWidth="1.2"
            filter="url(#glow)"
            style={{ animation: 'neuralFlow 3.5s ease-in-out infinite reverse', animationDelay: '0.5s' }}
          />
          <line 
            x1="8%" y1="35%" x2="15%" y2="45%" 
            stroke="url(#neuralConnection1)" 
            strokeWidth="1.3"
            filter="url(#glow)"
            style={{ animation: 'neuralFlow 5s ease-in-out infinite', animationDelay: '1s' }}
          />
          <line 
            x1="15%" y1="45%" x2="25%" y2="60%" 
            stroke="url(#neuralConnection2)" 
            strokeWidth="1.4"
            filter="url(#glow)"
            style={{ animation: 'neuralFlow 3.8s ease-in-out infinite reverse', animationDelay: '1.5s' }}
          />
          <line 
            x1="35%" y1="20%" x2="45%" y2="40%" 
            stroke="url(#neuralConnection1)" 
            strokeWidth="1.2"
            filter="url(#glow)"
            style={{ animation: 'neuralFlow 4.2s ease-in-out infinite', animationDelay: '2s' }}
          />
          <line 
            x1="45%" y1="40%" x2="60%" y2="30%" 
            stroke="url(#neuralConnection2)" 
            strokeWidth="1.5"
            filter="url(#glow)"
            style={{ animation: 'neuralFlow 3.2s ease-in-out infinite reverse', animationDelay: '2.5s' }}
          />
          <line 
            x1="60%" y1="30%" x2="70%" y2="50%" 
            stroke="url(#neuralConnection1)" 
            strokeWidth="1.3"
            filter="url(#glow)"
            style={{ animation: 'neuralFlow 4.5s ease-in-out infinite', animationDelay: '3s' }}
          />
          <line 
            x1="70%" y1="50%" x2="80%" y2="15%" 
            stroke="url(#neuralConnection2)" 
            strokeWidth="1.1"
            filter="url(#glow)"
            style={{ animation: 'neuralFlow 3.7s ease-in-out infinite reverse', animationDelay: '3.5s' }}
          />
          <line 
            x1="70%" y1="50%" x2="85%" y2="45%" 
            stroke="url(#neuralConnection1)" 
            strokeWidth="1.4"
            filter="url(#glow)"
            style={{ animation: 'neuralFlow 4.1s ease-in-out infinite', animationDelay: '4s' }}
          />
          <line 
            x1="55%" y1="70%" x2="75%" y2="65%" 
            stroke="url(#neuralConnection2)" 
            strokeWidth="1.2"
            filter="url(#glow)"
            style={{ animation: 'neuralFlow 3.9s ease-in-out infinite reverse', animationDelay: '4.5s' }}
          />
          
          {/* Conexões secundárias para complexidade */}
          <line 
            x1="10%" y1="15%" x2="35%" y2="20%" 
            stroke="url(#neuralConnection1)" 
            strokeWidth="0.8"
            filter="url(#glow)"
            style={{ animation: 'neuralFlow 5.5s ease-in-out infinite', animationDelay: '1.2s' }}
          />
          <line 
            x1="20%" y1="25%" x2="15%" y2="45%" 
            stroke="url(#neuralConnection2)" 
            strokeWidth="0.9"
            filter="url(#glow)"
            style={{ animation: 'neuralFlow 4.8s ease-in-out infinite reverse', animationDelay: '2.3s' }}
          />
          <line 
            x1="25%" y1="60%" x2="45%" y2="40%" 
            stroke="url(#neuralConnection1)" 
            strokeWidth="1"
            filter="url(#glow)"
            style={{ animation: 'neuralFlow 4.3s ease-in-out infinite', animationDelay: '3.1s' }}
          />
          <line 
            x1="60%" y1="30%" x2="85%" y2="45%" 
            stroke="url(#neuralConnection2)" 
            strokeWidth="0.7"
            filter="url(#glow)"
            style={{ animation: 'neuralFlow 5.2s ease-in-out infinite reverse', animationDelay: '1.8s' }}
          />
        </svg>
      </div>
      
      {/* Overlay de profundidade */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20"></div>
    </div>
  );
};

export default Background3D;
