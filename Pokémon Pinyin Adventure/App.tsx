import React, { useState, useEffect, useCallback } from 'react';
import { Pokemon, PinyinData, GameState, CaughtRecord } from './types';
import { POKEMONS, PINYIN_LEVELS } from './constants';
import { playPinyinSound } from './services/audioService';

const TARGET_SCORE = 3;

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('START');
  const [currentPokemon, setCurrentPokemon] = useState<Pokemon | null>(null);
  const [currentScore, setCurrentScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<{ pinyin: string; options: string[]; char: string } | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);
  const [feedback, setFeedback] = useState<{ status: 'correct' | 'wrong' | null; message: string }>({ status: null, message: '' });
  const [pokedex, setPokedex] = useState<CaughtRecord[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('pokemonPinyin_pokedex');
    if (saved) {
      try { setPokedex(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('pokemonPinyin_pokedex', JSON.stringify(pokedex));
  }, [pokedex]);

  // 核心逻辑：题目更新后 1 秒钟自动播放声音
  useEffect(() => {
    if (currentQuestion && gameState === 'BATTLE' && !isAnswering) {
      const timer = setTimeout(() => {
        playPinyinSound(currentQuestion.char);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentQuestion, gameState, isAnswering]);

  const generateQuestion = useCallback((pokemonLevel: number) => {
    const levelData = PINYIN_LEVELS[pokemonLevel];
    const target = levelData[Math.floor(Math.random() * levelData.length)];
    
    let distractors: string[] = [];
    const otherKeys = levelData.filter(item => item.pinyin !== target.pinyin);
    
    if (otherKeys.length < 2) {
      const allPinyin = Object.values(PINYIN_LEVELS).flat().map(i => i.pinyin);
      distractors = allPinyin.filter(p => p !== target.pinyin).sort(() => 0.5 - Math.random()).slice(0, 2);
    } else {
      distractors = otherKeys.sort(() => 0.5 - Math.random()).slice(0, 2).map(i => i.pinyin);
    }

    const options = [target.pinyin, ...distractors].sort(() => 0.5 - Math.random());
    setCurrentQuestion({ pinyin: target.pinyin, options, char: target.char });
  }, []);

  const startEncounter = () => {
    const randomPokemon = POKEMONS[Math.floor(Math.random() * POKEMONS.length)];
    setCurrentPokemon(randomPokemon);
    setCurrentScore(0);
    setGameState('ENCOUNTER');
  };

  const startBattle = () => {
    if (currentPokemon) {
      generateQuestion(currentPokemon.level);
      setGameState('BATTLE');
    }
  };

  const handleAnswer = async (selected: string) => {
    if (isAnswering || !currentQuestion || !currentPokemon) return;
    setIsAnswering(true);

    if (selected === currentQuestion.pinyin) {
      const nextScore = currentScore + 1;
      setFeedback({ status: 'correct', message: `✅ 命中！读音：${currentQuestion.pinyin} (${currentQuestion.char})` });
      
      if (nextScore >= TARGET_SCORE) {
        setTimeout(() => {
          setPokedex(prev => [...prev, { pokemon: currentPokemon, caughtAt: new Date().toISOString() }]);
          setGameState('CAUGHT');
          setFeedback({ status: null, message: '' });
          setIsAnswering(false);
        }, 1500);
      } else {
        setCurrentScore(nextScore);
        setTimeout(() => {
          setFeedback({ status: null, message: '' });
          generateQuestion(currentPokemon.level);
          setIsAnswering(false);
        }, 1200);
      }
    } else {
      setFeedback({ status: 'wrong', message: `❌ 失败！精灵球被弹开了。答案是 ${currentQuestion.pinyin}` });
      setCurrentScore(0);
      setTimeout(() => {
        setFeedback({ status: null, message: '' });
        generateQuestion(currentPokemon.level);
        setIsAnswering(false);
      }, 1800);
    }
  };

  return (
    <div className="min-h-screen bg-sky-100 flex flex-col items-center p-4">
      <header className="w-full max-w-2xl flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-yellow-500 pokemon-font drop-shadow-md">宝可梦拼音大冒险</h1>
        <button onClick={() => setGameState('POKEDEX')} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full font-bold shadow-lg">我的图鉴 📖</button>
      </header>

      <main className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 relative overflow-hidden flex flex-col items-center">
        {gameState === 'START' && (
          <div className="text-center py-12">
            <img src="https://assets.pokemon.com/assets/cms2/img/pokedex/full/025.png" className="w-48 mx-auto mb-6" />
            <button onClick={startEncounter} className="bg-yellow-400 hover:bg-yellow-500 text-slate-800 text-2xl px-12 py-4 rounded-full font-bold shadow-xl transition-all hover:scale-105">出发！去草丛 🌾</button>
          </div>
        )}

        {gameState === 'ENCOUNTER' && currentPokemon && (
          <div className="text-center py-8">
            <p className="text-xl font-bold text-slate-400 mb-2">🌾 发现野生宝可梦！</p>
            <div className="bg-yellow-50 rounded-2xl p-6 mb-4 inline-block"><img src={currentPokemon.url} className="w-56 animate-bounce" /></div>
            <h2 className="text-3xl font-bold mb-2">{currentPokemon.name}</h2>
            <div className="flex justify-center mb-6">
              {[...Array(currentPokemon.level)].map((_, i) => <span key={i} className="text-2xl">⭐</span>)}
            </div>
            <button onClick={startBattle} className="bg-red-500 hover:bg-red-600 text-white text-xl px-10 py-3 rounded-full font-bold shadow-lg">扔出精灵球！⚾</button>
          </div>
        )}

        {gameState === 'BATTLE' && currentPokemon && currentQuestion && (
          <div className="w-full flex flex-col items-center">
            <div className="w-full flex justify-between items-center mb-4 px-4 font-bold text-slate-500">
              <div className="flex gap-2">
                {[...Array(TARGET_SCORE)].map((_, i) => (
                  <div key={i} className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${i < currentScore ? 'bg-red-500 text-white border-red-700' : 'bg-slate-100'}`}>{i < currentScore ? '⚾' : ''}</div>
                ))}
              </div>
              <span>进度: {currentScore}/{TARGET_SCORE}</span>
            </div>

            <div className="relative mb-6 w-full flex justify-center h-36 items-center bg-slate-50 rounded-xl">
               <img src={currentPokemon.url} className={`w-32 ${feedback.status === 'wrong' ? 'shake-animation' : ''}`} />
               <button onClick={() => playPinyinSound(currentQuestion.char)} className="absolute top-2 right-2 bg-blue-500 text-white p-2 rounded-full text-xs">🔊 重播</button>
            </div>

            <div className="w-full space-y-4 px-2">
              <div className="grid grid-cols-1 gap-4">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    disabled={isAnswering}
                    onClick={() => handleAnswer(option)}
                    className={`w-full py-6 rounded-2xl text-5xl font-black shadow-xl border-4 transition-all
                      ${feedback.status === 'correct' && option === currentQuestion.pinyin ? 'bg-green-500 text-white border-green-700' : 
                        feedback.status === 'wrong' && option === currentQuestion.pinyin ? 'bg-green-100 border-green-500 text-green-900' :
                        'bg-white border-slate-300 text-slate-900'}
                      ${isAnswering ? '' : 'hover:border-blue-400 active:scale-95'}
                    `}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {feedback.message && (
              <div className={`mt-4 p-3 rounded-xl text-lg font-bold w-full text-center ${feedback.status === 'correct' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {feedback.message}
              </div>
            )}
          </div>
        )}

        {gameState === 'CAUGHT' && currentPokemon && (
          <div className="text-center py-8">
            <img src={currentPokemon.url} className="w-64 mx-auto mb-4" />
            <h2 className="text-4xl font-bold text-yellow-600 mb-2 pokemon-font">太棒了！</h2>
            <p className="text-xl mb-6">成功收服 <span className="font-black text-red-500">{currentPokemon.name}</span>！</p>
            <button onClick={startEncounter} className="bg-yellow-400 hover:bg-yellow-500 text-slate-800 text-xl px-12 py-3 rounded-full font-bold shadow-lg">继续冒险 🌾</button>
          </div>
        )}

        {gameState === 'POKEDEX' && (
          <div className="w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">我的图鉴 ({pokedex.length}/386)</h2>
              <button onClick={() => setGameState('START')} className="text-blue-500 font-bold">返回</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 h-[400px] overflow-y-auto pr-2">
              {pokedex.map((record, i) => (
                <div key={i} className="bg-slate-50 rounded-xl p-3 flex flex-col items-center shadow-sm border">
                  <img src={record.pokemon.url} className="w-16" />
                  <span className="text-xs font-bold mt-1">{record.pokemon.name}</span>
                </div>
              ))}
              {pokedex.length === 0 && <div className="col-span-full text-center py-20 text-slate-300">还没抓到宝可梦哦</div>}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
