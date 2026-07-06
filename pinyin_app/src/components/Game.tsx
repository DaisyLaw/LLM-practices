import React, { useState, useEffect, useMemo } from 'react';
import { Play, Volume2, ArrowRight, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

import { POKEMON_LIST, getPokemonImageUrl, Pokemon } from '../data/pokemon';
import { PINYIN_DATA, PinyinItem } from '../data/pinyin';
import { playAudio, selectOptions } from '../utils/gameUtils';
import { POKEBALL_ICON } from '../data/assets';

type GameState = 'intro' | 'playing' | 'catching' | 'caught' | 'failed' | 'pokedex';

export default function Game() {
  const [gameState, setGameState] = useState<GameState>('intro');
  const [caughtPokemon, setCaughtPokemon] = useState<Pokemon[]>([]);
  const [encounteredPokemonIds, setEncounteredPokemonIds] = useState<number[]>([]);
  const [completedPinyinPool, setCompletedPinyinPool] = useState<string[]>([]);
  const [round, setRound] = useState(1);

  
  const [targetPokemon, setTargetPokemon] = useState<Pokemon | null>(null);
  const [targetPinyin, setTargetPinyin] = useState<PinyinItem | null>(null);
  const [options, setOptions] = useState<PinyinItem[]>([]);
  const [selectedPinyin, setSelectedPinyin] = useState<PinyinItem | null>(null);

  // Generate a new round
  const startNewRound = (
    currentEncountered: number[] = encounteredPokemonIds,
    currentCompletedPinyin: string[] = completedPinyinPool
  ) => {
    let availablePokemon = POKEMON_LIST.filter(p => !currentEncountered.includes(p.id));
    if (availablePokemon.length === 0) {
      availablePokemon = POKEMON_LIST;
      currentEncountered = [];
      setEncounteredPokemonIds([]);
    }
    const selectedMon = availablePokemon[Math.floor(Math.random() * availablePokemon.length)];
    setEncounteredPokemonIds([...currentEncountered, selectedMon.id]);
    
    let availablePinyin = PINYIN_DATA.filter(p => !currentCompletedPinyin.includes(p.pinyin));
    if (availablePinyin.length === 0) {
      availablePinyin = PINYIN_DATA;
      currentCompletedPinyin = [];
      setCompletedPinyinPool([]);
    }
    const selectedPin = availablePinyin[Math.floor(Math.random() * availablePinyin.length)];
    
    // Generate Options
    const roundOptions = selectOptions(selectedPin, PINYIN_DATA);

    setTargetPokemon(selectedMon);
    setTargetPinyin(selectedPin);
    setOptions(roundOptions);
    setSelectedPinyin(null);
    setGameState('playing');
    
    // Auto play target audio when round starts
    setTimeout(() => playAudio(selectedPin.audio), 500);
  };

  const handleStartGame = () => {
    // Unlock Speech Synthesis on mobile by playing silent audio exactly on user click
    if (typeof window !== "undefined" && window.speechSynthesis) {
        const u = new SpeechSynthesisUtterance("");
        window.speechSynthesis.speak(u);
    }
    
    setRound(1);
    setCaughtPokemon([]);
    setEncounteredPokemonIds([]);
    setCompletedPinyinPool([]);
    startNewRound([], []);
  };

  const handleOptionClick = (option: PinyinItem) => {
    setSelectedPinyin(option);
    setGameState('catching');
    
    setTimeout(() => {
      if (option.pinyin === targetPinyin?.pinyin) {
        setGameState('caught');
        setCaughtPokemon(prev => [...prev, targetPokemon!]);
        setCompletedPinyinPool(prev => [...prev, targetPinyin.pinyin]);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        playAudio('太棒了'); // "Awesome!"
      } else {
        setGameState('failed');
        playAudio('哎呀，错了'); // "Oops, wrong"
      }
    }, 1500); // Wait for pokeball catch animation
  };

  const handleNextRound = () => {
    setRound(prev => prev + 1);
    startNewRound();
  };

  // Renders the Intro Screen
  if (gameState === 'intro') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-400 to-purple-500 p-4 text-white">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <img 
            src={POKEBALL_ICON} 
            alt="Pokeball" 
            className="w-32 h-32 mx-auto mb-6"
          />
          <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg tracking-tight">拼音宝可梦</h1>
          <p className="text-xl mb-8 opacity-90">听音选拼音，抓住宝可梦！</p>
          
          <div className="flex flex-col gap-4">
            <button 
              onClick={handleStartGame}
              className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-yellow-400 border-4 border-yellow-500 rounded-2xl hover:bg-yellow-300 hover:scale-105 active:scale-95 shadow-xl text-2xl"
            >
              <Play className="w-8 h-8 mr-2 fill-white" />
              开始游戏
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Renders the PokÃ©dex
  if (gameState === 'pokedex') {
    return (
      <div className="flex flex-col items-center min-h-screen bg-slate-100 p-6">
        <div className="w-full max-w-4xl pt-8 pb-4 flex justify-between items-center">
          <h1 className="text-4xl font-bold text-slate-800">我的宝可梦图鉴</h1>
          <button 
            onClick={() => setGameState('intro')}
            className="flex items-center px-4 py-2 bg-slate-300 rounded-lg font-semibold hover:bg-slate-400 transition"
          >
            <Home className="w-5 h-5 mr-2" /> 返回主界面
          </button>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full w-full max-w-4xl">
          {caughtPokemon.length === 0 ? (
            <div className="col-span-full text-center text-slate-500 py-12 text-lg">
              还没有抓到宝可梦哦！快去抓几只吧！
            </div>
          ) : (
            caughtPokemon.map((mon, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center"
              >
                <img src={getPokemonImageUrl(mon.id)} alt={mon.name} className="w-24 h-24 object-contain" />
                <span className="font-bold text-slate-700 mt-2 text-center text-sm">{mon.name}</span>
                <span className="text-xs text-slate-400 text-center">{mon.enName}</span>
              </motion.div>
            ))
          )}
        </div>
      </div>
    );
  }

  // Playing, Catching, Caught, Failed states
  return (
    <div className="flex flex-col items-center flex-1 min-h-[100dvh] bg-blue-50 relative overflow-hidden">
      {/* Header */}
      <div className="w-full max-w-2xl px-6 py-4 flex justify-between items-center bg-white shadow-sm z-10 rounded-b-2xl">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <img src={POKEBALL_ICON} alt="caught" className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold text-gray-700">已抓获 {caughtPokemon.length} 只</span>
        </div>
        <div className="text-lg font-semibold text-gray-500">第 {round} 回合</div>
        <button 
          onClick={() => setGameState('pokedex')}
          className="text-blue-500 font-bold hover:text-blue-600 px-3 py-1 bg-blue-50 rounded-lg"
        >
          图鉴
        </button>
      </div>

      <div className="flex-1 w-full max-w-lg flex flex-col items-center justify-between py-8 px-4 z-10">
        
        {/* Play Audio Button (The Target) */}
        <div className="text-center w-full">
          <h2 className="text-xl md:text-3xl font-bold text-slate-700 mb-6 drop-shadow-sm">
            听读音，选拼音
          </h2>
          <button 
            onClick={() => targetPinyin && playAudio(targetPinyin.audio)}
            className="mx-auto flex flex-col items-center justify-center w-32 h-32 md:w-40 md:h-40 bg-blue-500 rounded-full shadow-[0_8px_0_theme(colors.blue.600)] hover:bg-blue-400 hover:translate-y-1 hover:shadow-[0_4px_0_theme(colors.blue.600)] active:translate-y-2 active:shadow-none transition-all"
            disabled={gameState !== 'playing'}
          >
            <Volume2 className="w-16 h-16 md:w-20 md:h-20 text-white" />
          </button>
        </div>

        {/* Pokemon Display */}
        <div className="relative h-64 w-full flex items-center justify-center mt-6">
          <div className="absolute bottom-0 w-64 h-16 bg-black/10 rounded-full blur-xl animate-pulse"></div>
          
          <AnimatePresence>
            {(gameState === 'playing' || gameState === 'catching' || gameState === 'failed') && (
              <motion.img 
                key="wild-mon"
                initial={{ x: 200, opacity: 0 }}
                animate={{ x: 0, opacity: 1, filter: gameState === 'playing' ? "brightness(0)" : "brightness(1) drop-shadow(0 0 10px rgba(255,255,255,0.8))" }}
                exit={{ scale: 0, opacity: 0, transition: { duration: 0.5 } }}
                // Transition style for brightness revealing
                transition={{ duration: 0.8, type: 'spring' }}
                src={targetPokemon ? getPokemonImageUrl(targetPokemon.id) : ''}
                alt="Wild Pokemon"
                className="w-48 h-48 md:w-64 md:h-64 object-contain z-10"
              />
            )}
          </AnimatePresence>

          {/* Pokeball Animation during catching */}
          {gameState === 'catching' && (
            <motion.img 
              initial={{ y: 200, scale: 0.5 }}
              animate={{ 
                y: -40, 
                scale: 1.5,
                rotate: 360 * 3
              }}
              transition={{ duration: 1, ease: 'easeOut' }}
              src={POKEBALL_ICON}
              className="absolute z-20 w-16 h-16"
            />
          )}
        </div>

        {/* Options */}
        {gameState === 'playing' ? (
          <div className="flex flex-col sm:flex-row gap-4 md:gap-8 w-full mb-[5%]">
            {options.map((option, idx) => (
              <div key={idx} className="flex-1 flex flex-col gap-2">
                <button
                  onClick={() => handleOptionClick(option)}
                  className="w-full py-6 sm:aspect-square flex items-center justify-center bg-white border-b-4 border-slate-300 rounded-2xl shadow-sm text-4xl font-bold text-slate-700 hover:bg-slate-50 hover:translate-y-1 hover:border-b-0 active:bg-slate-100 transition-all font-sans tracking-widest break-all"
                >
                  {option.pinyin}
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    playAudio(option.audio);
                  }}
                  className="mx-auto flex items-center justify-center p-2 rounded-full bg-slate-100 hover:bg-blue-100 text-blue-500 transition-colors"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full flex justify-center items-center h-32">
            {/* Filler placeholder so layout doesn't bounce immediately */}
          </div>
        )}

      </div>

      {/* Result Overlay */}
      <AnimatePresence>
        {(gameState === 'caught' || gameState === 'failed') && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className={`absolute bottom-0 left-0 right-0 p-6 md:p-10 rounded-t-[3rem] shadow-2xl z-50 flex flex-col items-center
              ${gameState === 'caught' ? 'bg-green-500' : 'bg-red-500'}`}
          >
            <h2 className="text-4xl font-extrabold text-white mb-2 tracking-wide text-center">
              {gameState === 'caught' ? '抓到啦！' : '哎呀，错了！'}
            </h2>
            <p className="text-white/90 text-xl font-medium mb-8 text-center max-w-sm">
              {gameState === 'caught' 
                ? `你抓住了一只野生的 ${targetPokemon?.name}（${targetPokemon?.enName}）！` 
                : `野生的 ${targetPokemon?.name} 跑掉了！正确答案是“${targetPinyin?.pinyin}”。`}
            </p>
            
            <button 
              onClick={handleNextRound}
              className="flex items-center justify-center w-full max-w-sm py-4 bg-white rounded-2xl text-xl font-black shadow-lg hover:bg-gray-50 hover:scale-105 active:scale-95 transition-all"
              style={{ color: gameState === 'caught' ? '#22c55e' : '#ef4444' }}
            >
              下一题 <ArrowRight className="ml-2" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 pointer-events-none"></div>
    </div>
  );
}
