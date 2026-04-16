/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  UserPlus, 
  Play, 
  User, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Trophy, 
  RotateCcw, 
  Trash2, 
  ChevronRight,
  HelpCircle,
  AlertCircle,
  Languages,
  Moon,
  Sun,
  Plus,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Player, GameState, CATEGORIES } from './types';
import { getSecretWord } from './services/wordService';
import { playSound } from './services/soundService';
import { cn } from '@/lib/utils';

// Translations
const TRANSLATIONS = {
  en: {
    title: 'Impostor',
    subtitle: 'Find the odd one out',
    players: 'Players',
    addPlayersDesc: 'Add at least 3 players to start',
    playerName: 'Player name',
    category: 'Category',
    addCategory: 'Add Category',
    newCategoryTitle: 'New Category',
    categoryName: 'Category Name',
    wordsPlaceholder: 'Enter words (one per line)...',
    cancel: 'Cancel',
    submit: 'Submit',
    uploadSuccess: 'Category added successfully!',
    duplicateName: 'Name already taken!',
    duplicateCategory: 'Category already exists!',
    emptyFields: 'Please fill all fields',
    startGame: 'Start Game',
    generating: 'Starting...',
    noPlayers: 'No players added yet',
    passPhone: 'Pass the phone',
    handTo: 'Hand it to the player below',
    secretWordIs: 'The secret word is:',
    impostorMsg: 'YOU ARE THE IMPOSTOR',
    dontLetThemKnow: "Don't let them find out!",
    clickToReveal: 'Click to reveal your word',
    hideWord: 'Hide Word',
    revealWord: 'Reveal Word',
    nextPlayer: 'Next Player',
    discussionTime: 'Discussion Time',
    askQuestions: 'Ask questions and find the impostor!',
    rules: 'Rules:',
    rule1: 'Take turns describing the word.',
    rule2: "Don't be too obvious!",
    rule3: 'The impostor must try to blend in.',
    goToVoting: 'Go to Voting',
    whoIsImpostor: 'Who is the Impostor?',
    pointSuspect: 'Point at the suspect on the count of three!',
    impostorWinQ: 'Did the impostor(s) win?',
    impostorWon: 'Impostor Won',
    foundThem: 'Found Them',
    roundOver: 'Round Over',
    secretWordWas: 'The secret word was:',
    impostorsWere: 'The Impostor(s) were:',
    scoreboard: 'Scoreboard:',
    playAgain: 'Play Again',
    pts: 'pts',
    howToPlay: 'How to Play',
    objective: 'Objective',
    scoring: 'Scoring',
    objectiveDesc: 'The secret word is shown to everyone except the Impostor. The Impostor must blend in and guess the word, while others must identify the Impostor.',
    howToPlayStep1: '1. Pass the phone to each player to reveal their secret word or Impostor role.',
    howToPlayStep2: '2. Once everyone knows their role, take turns describing the word with one single word or short phrase.',
    howToPlayStep3: '3. After the discussion, everyone points at the person they suspect is the Impostor on the count of three.',
    scoringDesc: 'If the Impostor is caught, everyone else gets 1 point. If the Impostor escapes or guesses the word correctly, the Impostor gets 1 point.',
    close: 'Close',
    categories: {
      Object: 'Object',
      Idea: 'Idea',
      Place: 'Place',
      Movie: 'Movie',
      Animal: 'Animal',
      Uploaded: 'Uploaded',
      All: 'All'
    }
  },
  es: {
    title: 'Impostor',
    subtitle: 'Encuentra al infiltrado',
    players: 'Jugadores',
    addPlayersDesc: 'Añade al menos 3 jugadores para empezar',
    playerName: 'Nombre del jugador',
    category: 'Categoría',
    addCategory: 'Añadir Categoría',
    newCategoryTitle: 'Nueva Categoría',
    categoryName: 'Nombre de la Categoría',
    wordsPlaceholder: 'Escribe las palabras (una por línea)...',
    cancel: 'Cancelar',
    submit: 'Añadir',
    uploadSuccess: '¡Categoría añadida con éxito!',
    duplicateName: '¡Ese nombre ya existe!',
    duplicateCategory: '¡Esa categoría ya existe!',
    emptyFields: 'Por favor, rellena todos los campos',
    startGame: 'Empezar Juego',
    generating: 'Empezando...',
    noPlayers: 'No hay jugadores aún',
    passPhone: 'Pasa el teléfono',
    handTo: 'Entrégalo al siguiente jugador',
    secretWordIs: 'La palabra secreta es:',
    impostorMsg: 'ERES EL IMPOSTOR',
    dontLetThemKnow: "¡Que no te descubran!",
    clickToReveal: 'Haz clic para ver tu palabra',
    hideWord: 'Ocultar Palabra',
    revealWord: 'Ver Palabra',
    nextPlayer: 'Siguiente Jugador',
    discussionTime: 'Tiempo de Discusión',
    askQuestions: '¡Haz preguntas y busca al impostor!',
    rules: 'Reglas:',
    rule1: 'Tomen turnos describiendo la palabra.',
    rule2: '¡No sean demasiado obvios!',
    rule3: 'El impostor debe intentar mezclarse.',
    goToVoting: 'Ir a Votación',
    whoIsImpostor: '¿Quién es el Impostor?',
    pointSuspect: '¡Señalen al sospechoso a la de tres!',
    impostorWinQ: '¿Ganó el impostor?',
    impostorWon: 'Ganó Impostor',
    foundThem: 'Lo Encontramos',
    roundOver: 'Ronda Terminada',
    secretWordWas: 'La palabra secreta era:',
    impostorsWere: 'El Impostor era:',
    scoreboard: 'Puntuación:',
    playAgain: 'Jugar de Nuevo',
    pts: 'pts',
    howToPlay: 'Cómo Jugar',
    objective: 'Objetivo',
    scoring: 'Puntuación',
    objectiveDesc: 'La palabra secreta se muestra a todos excepto al Impostor. El Impostor debe mezclarse y adivinar la palabra, mientras que los demás deben identificar al Impostor.',
    howToPlayStep1: '1. Pasen el teléfono a cada jugador para ver su palabra secreta o su rol de Impostor.',
    howToPlayStep2: '2. Una vez que todos sepan su rol, tomen turnos describiendo la palabra con una sola palabra o frase corta.',
    howToPlayStep3: '3. Después de la discusión, todos señalan a la persona que sospechan que es el Impostor a la cuenta de tres.',
    scoringDesc: 'Si el Impostor es atrapado, todos los demás obtienen 1 punto. Si el Impostor escapa o adivina la palabra correctamente, el Impostor obtiene 1 punto.',
    close: 'Cerrar',
    categories: {
      Personality: 'Personalidad',
      Object: 'Objeto',
      Idea: 'Idea',
      Place: 'Lugar',
      Movie: 'Película',
      Animal: 'Animal',
      Uploaded: 'Subidas',
      All: 'Todo'
    }
  }
};

export default function App() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('impostor_app_state') : null;
    let initialTheme: 'light' | 'dark' = 'dark';
    
    if (typeof window !== 'undefined' && window.matchMedia) {
      initialTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          players: parsed.players || [],
          status: 'setup',
          currentWord: '',
          impostorIds: [],
          currentPlayerIndex: 0,
          revealedToCurrent: false,
          hasRevealedOnce: false,
          revealOrder: [],
          category: 'Object',
          language: parsed.language || 'en',
          theme: parsed.theme || initialTheme,
          customCategories: parsed.customCategories || {},
        };
      } catch (e) {
        console.error("Failed to parse saved state");
      }
    }

    return {
      players: [],
      status: 'setup',
      currentWord: '',
      impostorIds: [],
      currentPlayerIndex: 0,
      revealedToCurrent: false,
      hasRevealedOnce: false,
      revealOrder: [],
      category: 'Object',
      language: 'en',
      theme: initialTheme,
      customCategories: {},
    };
  });

  const [newPlayerName, setNewPlayerName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Custom Category Popup State
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatWords, setNewCatWords] = useState('');
  
  // Rules Modal State
  const [isRulesOpen, setIsRulesOpen] = useState(false);

  const t = TRANSLATIONS[gameState.language];

  // Load state from localStorage on mount - Handled in lazy initializer now
  useEffect(() => {
    // We still keep this for any potential side effects or sync needs
  }, []);

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem('impostor_app_state', JSON.stringify({
      players: gameState.players,
      language: gameState.language,
      theme: gameState.theme,
      customCategories: gameState.customCategories
    }));
    
    // Apply theme
    if (gameState.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [gameState.players, gameState.language, gameState.theme]);

  const addPlayer = () => {
    playSound('click');
    const name = newPlayerName.trim();
    if (!name) return;
    
    if (gameState.players.some(p => p.name.toLowerCase() === name.toLowerCase())) {
      setError(t.duplicateName);
      setTimeout(() => setError(null), 3000);
      return;
    }

    const newPlayer: Player = {
      id: Math.random().toString(36).substr(2, 9),
      name: name,
      score: 0,
    };
    setGameState(prev => ({
      ...prev,
      players: [...prev.players, newPlayer]
    }));
    setNewPlayerName('');
    setError(null);
  };

  const removePlayer = (id: string) => {
    playSound('click');
    setGameState(prev => ({
      ...prev,
      players: prev.players.filter(p => p.id !== id)
    }));
  };

  const startGame = async () => {
    if (gameState.players.length < 3) return;
    
    playSound('start');
    setIsLoading(true);
    const word = await getSecretWord(gameState.category, gameState.language, gameState.customCategories);
    
    const numPlayers = gameState.players.length;
    let numImpostors = 1;
    if (numPlayers >= 5 && Math.random() < 0.2) {
      numImpostors = 2;
    }
    
    const shuffledIds = [...gameState.players].sort(() => Math.random() - 0.5).map(p => p.id);
    const impostorIds = shuffledIds.slice(0, numImpostors);
    
    // Randomize reveal order
    const revealOrder = [...gameState.players].sort(() => Math.random() - 0.5).map(p => p.id);

    setGameState(prev => ({
      ...prev,
      status: 'assigning',
      currentWord: word,
      impostorIds,
      revealOrder,
      currentPlayerIndex: 0,
      revealedToCurrent: false,
      hasRevealedOnce: false,
    }));
    setIsLoading(false);
  };

  const nextPlayer = () => {
    playSound('transition');
    if (gameState.currentPlayerIndex < gameState.revealOrder.length - 1) {
      setGameState(prev => ({
        ...prev,
        currentPlayerIndex: prev.currentPlayerIndex + 1,
        revealedToCurrent: false,
        hasRevealedOnce: false,
      }));
    } else {
      setGameState(prev => ({
        ...prev,
        status: 'playing',
      }));
    }
  };

  const toggleReveal = () => {
    setGameState(prev => ({ 
      ...prev, 
      revealedToCurrent: !prev.revealedToCurrent,
      hasRevealedOnce: true 
    }));
  };

  const finishRound = (impostorWon: boolean) => {
    playSound('roundEnd');
    if (impostorWon) {
      setGameState(prev => ({
        ...prev,
        players: prev.players.map(p => 
          prev.impostorIds.includes(p.id) ? { ...p, score: p.score + 1 } : p
        ),
        status: 'results'
      }));
    } else {
      setGameState(prev => ({
        ...prev,
        status: 'results'
      }));
    }
  };

  const resetGame = () => {
    playSound('click');
    setGameState(prev => ({
      ...prev,
      status: 'setup',
      currentWord: '',
      impostorIds: [],
      currentPlayerIndex: 0,
      revealedToCurrent: false,
    }));
  };

  const toggleLanguage = () => {
    playSound('click');
    setGameState(prev => ({ ...prev, language: prev.language === 'en' ? 'es' : 'en' }));
  };

  const toggleTheme = () => {
    playSound('click');
    setGameState(prev => ({ ...prev, theme: prev.theme === 'light' ? 'dark' : 'light' }));
  };

  const handleAddCategory = () => {
    const name = newCatName.trim();
    const words = newCatWords.split('\n').map(w => w.trim()).filter(w => w.length > 0);

    if (!name || words.length === 0) {
      setError(t.emptyFields);
      setTimeout(() => setError(null), 3000);
      return;
    }

    if (CATEGORIES.includes(name as any) || gameState.customCategories[name]) {
      setError(t.duplicateCategory);
      setTimeout(() => setError(null), 3000);
      return;
    }

    setGameState(prev => ({
      ...prev,
      customCategories: {
        ...prev.customCategories,
        [name]: words
      },
      category: name
    }));

    setNewCatName('');
    setNewCatWords('');
    setIsPopupOpen(false);
    setError(t.uploadSuccess);
    setTimeout(() => setError(null), 3000);
  };

  const removeCustomCategory = (name: string, e: import('react').MouseEvent) => {
    e.stopPropagation();
    setGameState(prev => {
      const newCats = { ...prev.customCategories };
      delete newCats[name];
      return {
        ...prev,
        customCategories: newCats,
        category: prev.category === name ? 'Object' : prev.category
      };
    });
  };

  const currentPlayer = gameState.players.find(p => p.id === gameState.revealOrder[gameState.currentPlayerIndex]);
  const isImpostor = currentPlayer && gameState.impostorIds.includes(currentPlayer.id);

  const getCurrentWordDisplay = () => {
    if (!gameState.currentWord) return '';
    if (typeof gameState.currentWord === 'string') return gameState.currentWord;
    return (gameState.currentWord as any)[gameState.language] || (gameState.currentWord as any).en;
  };

  return (
    <div className={cn(
      "min-h-screen flex flex-col items-center p-2 sm:p-4 font-sans transition-colors duration-300 overflow-x-hidden",
      gameState.theme === 'dark' ? "bg-[#1C1B1F] text-[#E6E1E5]" : "bg-[#FEF7FF] text-[#1D1B20]"
    )}>
      <div className="w-full max-w-md flex flex-col gap-4 sm:gap-6 flex-1">
        
        {/* Header */}
        <header className="flex flex-col items-center gap-1 sm:gap-2 mt-2 sm:mt-4 mb-1 sm:mb-2 relative shrink-0">
          <div className="absolute top-0 left-0">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => {
                playSound('click');
                setIsRulesOpen(true);
              }}
              className="rounded-full hover:bg-[#6750A4]/10"
            >
              <HelpCircle className="w-5 h-5 text-[#6750A4]" />
            </Button>
          </div>
          <div className="absolute top-0 right-0 flex gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleLanguage}
              className="rounded-full hover:bg-[#6750A4]/10"
            >
              <Languages className="w-5 h-5 text-[#6750A4]" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme}
              className="rounded-full hover:bg-[#6750A4]/10"
            >
              {gameState.theme === 'light' ? <Moon className="w-5 h-5 text-[#6750A4]" /> : <Sun className="w-5 h-5 text-[#D0BCFF]" />}
            </Button>
          </div>

          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={cn(
              "w-12 h-12 sm:w-16 sm:h-16 rounded-[16px] sm:rounded-[20px] flex items-center justify-center shadow-lg",
              gameState.theme === 'dark' ? "bg-[#D0BCFF]" : "bg-[#6750A4]"
            )}
          >
            <HelpCircle className={cn("w-8 h-8 sm:w-10 sm:h-10", gameState.theme === 'dark' ? "text-[#381E72]" : "text-white")} />
          </motion.div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display">{t.title}</h1>
          <p className={cn("text-xs sm:text-sm font-medium", gameState.theme === 'dark' ? "text-[#CAC4D0]" : "text-[#49454F]")}>
            {t.subtitle}
          </p>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={cn(
                  "absolute -bottom-10 left-0 right-0 text-center text-xs font-bold py-1 px-3 rounded-full shadow-sm z-50",
                  error === t.uploadSuccess 
                    ? (gameState.theme === 'dark' ? "bg-[#D0BCFF] text-[#381E72]" : "bg-[#EADDFF] text-[#21005D]")
                    : (gameState.theme === 'dark' ? "bg-[#F2B8B5] text-[#601410]" : "bg-[#F9DEDC] text-[#410E0B]")
                )}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        <AnimatePresence mode="wait">
          {/* Setup Screen */}
          {gameState.status === 'setup' && (
            <motion.div
              key="setup"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="flex flex-col gap-3 sm:gap-4 flex-1"
            >
              <Card className={cn(
                "rounded-[24px] sm:rounded-[28px] border-none shadow-sm flex-1 flex flex-col",
                gameState.theme === 'dark' ? "bg-[#2B2930]" : "bg-[#F7F2FA]"
              )}>
                <CardHeader className="py-3 sm:py-6">
                  <CardTitle className="text-lg sm:text-xl font-display">{t.players}</CardTitle>
                  <CardDescription className={cn("text-xs sm:text-sm", gameState.theme === 'dark' ? "text-[#CAC4D0]" : "")}>
                    {t.addPlayersDesc}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 sm:gap-4 flex-1 min-h-0">
                  <div className="flex gap-2 shrink-0">
                    <Input 
                      placeholder={t.playerName} 
                      value={newPlayerName}
                      onChange={(e) => setNewPlayerName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
                      className={cn(
                        "rounded-xl focus-visible:ring-[#6750A4] h-10 sm:h-12",
                        gameState.theme === 'dark' ? "bg-[#1C1B1F] border-[#938F99] text-white" : "border-[#79747E]"
                      )}
                    />
                    <Button onClick={addPlayer} className={cn(
                      "rounded-xl h-10 sm:h-12 w-10 sm:w-12 shrink-0",
                      gameState.theme === 'dark' ? "bg-[#D0BCFF] text-[#381E72] hover:bg-[#EADDFF]" : "bg-[#6750A4] text-white hover:bg-[#5a4590]"
                    )}>
                      <UserPlus className="w-4 h-4" />
                    </Button>
                  </div>

                  <ScrollArea className="flex-1 pr-4 min-h-[150px]">
                    <div className="flex flex-col gap-2">
                      {gameState.players.map((player) => (
                        <motion.div 
                          layout
                          key={player.id}
                          className={cn(
                            "flex items-center justify-between p-3 rounded-2xl shadow-sm border",
                            gameState.theme === 'dark' ? "bg-[#1C1B1F] border-[#49454F]" : "bg-white border-[#CAC4D0]"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center font-bold",
                              gameState.theme === 'dark' ? "bg-[#49454F] text-[#D0BCFF]" : "bg-[#EADDFF] text-[#21005D]"
                            )}>
                              {player.name[0].toUpperCase()}
                            </div>
                            <span className="font-medium">{player.name}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <Badge variant="secondary" className={cn(
                              "rounded-lg",
                              gameState.theme === 'dark' ? "bg-[#49454F] text-[#E6E1E5]" : "bg-[#E8DEF8] text-[#1D192B]"
                            )}>
                              {player.score} {t.pts}
                            </Badge>
                            <button 
                              onClick={() => removePlayer(player.id)}
                              className="text-[#F2B8B5] hover:bg-[#8C1D18]/20 p-2 rounded-full transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                      {gameState.players.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-40 opacity-50">
                          <User className="w-12 h-12 mb-2" />
                          <p>{t.noPlayers}</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
                <CardFooter className="flex flex-col gap-3 sm:gap-4 py-3 sm:py-6 shrink-0">
                  <div className="w-full">
                    <Label className={cn(
                      "text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1 sm:mb-2 block",
                      gameState.theme === 'dark' ? "text-[#CAC4D0]" : "text-[#49454F]"
                    )}>{t.category}</Label>
                    <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                      {CATEGORIES.map(cat => (
                        <button
                          key={cat}
                          onClick={() => setGameState(prev => ({ ...prev, category: cat }))}
                          className={cn(
                            "px-1 py-1.5 sm:py-2 text-[10px] sm:text-[11px] font-medium rounded-xl border transition-all",
                            gameState.category === cat 
                              ? (gameState.theme === 'dark' ? "bg-[#D0BCFF] border-[#D0BCFF] text-[#381E72]" : "bg-[#EADDFF] border-[#6750A4] text-[#21005D]")
                              : (gameState.theme === 'dark' ? "bg-[#1C1B1F] border-[#49454F] text-[#CAC4D0]" : "bg-white border-[#79747E] text-[#49454F]")
                          )}
                        >
                          {(t.categories as any)[cat] || cat}
                        </button>
                      ))}
                      
                      {Object.keys(gameState.customCategories).map(cat => (
                        <button
                          key={cat}
                          onClick={() => setGameState(prev => ({ ...prev, category: cat }))}
                          className={cn(
                            "px-1 py-1.5 sm:py-2 text-[10px] sm:text-[11px] font-medium rounded-xl border transition-all flex items-center justify-center gap-1 relative group",
                            gameState.category === cat 
                              ? (gameState.theme === 'dark' ? "bg-[#D0BCFF] border-[#D0BCFF] text-[#381E72]" : "bg-[#EADDFF] border-[#6750A4] text-[#21005D]")
                              : (gameState.theme === 'dark' ? "bg-[#1C1B1F] border-[#49454F] text-[#CAC4D0]" : "bg-white border-[#79747E] text-[#49454F]")
                          )}
                        >
                          <span className="truncate max-w-[50px] sm:max-w-[60px]">{cat}</span>
                          <X 
                            className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5" 
                            onClick={(e) => removeCustomCategory(cat, e)}
                          />
                        </button>
                      ))}

                      <button
                        onClick={() => setIsPopupOpen(true)}
                        className={cn(
                          "px-1 py-1.5 sm:py-2 text-[10px] sm:text-[11px] font-bold rounded-xl border border-dashed flex items-center justify-center gap-1",
                          gameState.theme === 'dark' ? "bg-[#1C1B1F] border-[#D0BCFF] text-[#D0BCFF]" : "bg-white border-[#6750A4] text-[#6750A4]"
                        )}
                      >
                        <Plus className="w-3 h-3" />
                        {t.addCategory}
                      </button>
                    </div>
                  </div>

                  <Button 
                    disabled={gameState.players.length < 3 || isLoading}
                    onClick={startGame}
                    className={cn(
                      "w-full h-12 sm:h-14 rounded-full text-base sm:text-lg font-bold shadow-md",
                      gameState.theme === 'dark' ? "bg-[#D0BCFF] text-[#381E72] hover:bg-[#EADDFF]" : "bg-[#6750A4] text-white hover:bg-[#5a4590]"
                    )}
                  >
                    {isLoading ? t.generating : t.startGame}
                    {!isLoading && <Play className="ml-2 w-5 h-5 fill-current" />}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}

          {/* Assigning Screen */}
          {gameState.status === 'assigning' && (
            <motion.div
              key="assigning"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="flex flex-col gap-6"
            >
              <Card className={cn(
                "rounded-[28px] border-none shadow-lg overflow-hidden",
                gameState.theme === 'dark' ? "bg-[#2B2930]" : "bg-[#F7F2FA]"
              )}>
                <div className={cn("h-2", gameState.theme === 'dark' ? "bg-[#D0BCFF]" : "bg-[#6750A4]")} style={{ width: `${((gameState.currentPlayerIndex + 1) / gameState.revealOrder.length) * 100}%` }} />
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-display">{t.passPhone}</CardTitle>
                  <CardDescription className={gameState.theme === 'dark' ? "text-[#CAC4D0]" : ""}>
                    {t.handTo}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center py-8 gap-8">
                  <div className="flex flex-col items-center gap-4">
                    {currentPlayer && (
                      <>
                        <div className={cn(
                          "w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold shadow-inner",
                          gameState.theme === 'dark' ? "bg-[#D0BCFF] text-[#381E72]" : "bg-[#6750A4] text-white"
                        )}>
                          {currentPlayer.name[0].toUpperCase()}
                        </div>
                        <h2 className="text-3xl font-extrabold font-display">{currentPlayer.name}</h2>
                      </>
                    )}
                  </div>

                  <div 
                    onClick={toggleReveal}
                    className={cn(
                      "w-full p-6 rounded-[24px] border-2 border-dashed flex flex-col items-center gap-4 cursor-pointer transition-all active:scale-95",
                      gameState.theme === 'dark' 
                        ? "bg-[#1C1B1F] border-[#49454F] hover:bg-[#2B2930]" 
                        : "bg-white border-[#CAC4D0] hover:bg-gray-50"
                    )}
                  >
                    {gameState.revealedToCurrent ? (
                      <motion.div 
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-center"
                      >
                        <p className={cn("text-sm mb-2", gameState.theme === 'dark' ? "text-[#CAC4D0]" : "text-[#49454F]")}>
                          {t.secretWordIs}
                        </p>
                        <h3 className={cn(
                          "text-4xl font-black tracking-tight font-display",
                          isImpostor 
                            ? (gameState.theme === 'dark' ? "text-[#F2B8B5]" : "text-[#B3261E]") 
                            : (gameState.theme === 'dark' ? "text-[#D0BCFF]" : "text-[#6750A4]")
                        )}>
                          {isImpostor ? t.impostorMsg : getCurrentWordDisplay()}
                        </h3>
                        {isImpostor && (
                          <p className={cn("mt-4 text-sm italic", gameState.theme === 'dark' ? "text-[#CAC4D0]" : "text-[#49454F]")}>
                            {t.dontLetThemKnow}
                          </p>
                        )}
                        <p className={cn("mt-6 text-[10px] uppercase tracking-widest opacity-50 font-bold", gameState.theme === 'dark' ? "text-[#D0BCFF]" : "text-[#6750A4]")}>
                          {t.hideWord}
                        </p>
                      </motion.div>
                    ) : (
                      <div className="flex flex-col items-center gap-4 py-4">
                        <div className={cn(
                          "w-16 h-16 rounded-full flex items-center justify-center",
                          gameState.theme === 'dark' ? "bg-[#49454F]/30" : "bg-[#EADDFF]/30"
                        )}>
                          <Eye className={cn("w-8 h-8", gameState.theme === 'dark' ? "text-[#D0BCFF]" : "text-[#6750A4]")} />
                        </div>
                        <p className={cn("font-bold text-lg text-center", gameState.theme === 'dark' ? "text-[#D0BCFF]" : "text-[#6750A4]")}>
                          {t.clickToReveal}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-3">
                  <Button 
                    disabled={!gameState.hasRevealedOnce}
                    onClick={nextPlayer}
                    className={cn(
                      "w-full h-14 rounded-full font-bold",
                      gameState.theme === 'dark' ? "bg-[#D0BCFF] text-[#381E72] hover:bg-[#EADDFF]" : "bg-[#6750A4] text-white hover:bg-[#5a4590]"
                    )}
                  >
                    {t.nextPlayer}
                    <ChevronRight className="ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}

          {/* Playing Screen */}
          {gameState.status === 'playing' && (
            <motion.div
              key="playing"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="flex flex-col gap-6"
            >
              <Card className={cn(
                "rounded-[28px] border-none shadow-lg",
                gameState.theme === 'dark' ? "bg-[#2B2930]" : "bg-[#F7F2FA]"
              )}>
                <CardHeader className="text-center">
                  <Badge className={cn(
                    "w-fit mx-auto mb-2 border-none",
                    gameState.theme === 'dark' ? "bg-[#49454F] text-[#D0BCFF]" : "bg-[#EADDFF] text-[#21005D]"
                  )}>
                    {t.category}: {(t.categories as any)[gameState.category] || gameState.category}
                  </Badge>
                  <CardTitle className="text-3xl font-display">{t.discussionTime}</CardTitle>
                  <CardDescription className={gameState.theme === 'dark' ? "text-[#CAC4D0]" : ""}>
                    {t.askQuestions}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-6 py-8">
                  <div className="flex flex-col gap-4">
                    <div className={cn(
                      "flex items-start gap-4 p-4 rounded-2xl border",
                      gameState.theme === 'dark' ? "bg-[#1C1B1F] border-[#49454F]" : "bg-white border-[#CAC4D0]"
                    )}>
                      <AlertCircle className={cn("shrink-0 mt-1", gameState.theme === 'dark' ? "text-[#D0BCFF]" : "text-[#6750A4]")} />
                      <div>
                        <p className="font-bold">{t.rules}</p>
                        <ul className={cn("text-sm list-disc list-inside space-y-1 mt-1", gameState.theme === 'dark' ? "text-[#CAC4D0]" : "text-[#49454F]")}>
                          <li>{t.rule1}</li>
                          <li>{t.rule2}</li>
                          <li>{t.rule3}</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-center gap-2">
                    {gameState.players.map(p => (
                      <div key={p.id} className="flex flex-col items-center gap-1">
                        <div className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center font-bold border",
                          gameState.theme === 'dark' ? "bg-[#49454F] text-[#D0BCFF] border-[#CAC4D0]/20" : "bg-[#E8DEF8] text-[#1D192B] border-[#CAC4D0]"
                        )}>
                          {p.name[0].toUpperCase()}
                        </div>
                        <span className={cn("text-[10px] font-medium", gameState.theme === 'dark' ? "text-[#CAC4D0]" : "text-[#49454F]")}>
                          {p.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-3">
                  <Button 
                    onClick={() => {
                      playSound('transition');
                      setGameState(prev => ({ ...prev, status: 'voting' }));
                    }}
                    className={cn(
                      "w-full h-14 rounded-full font-bold text-lg",
                      gameState.theme === 'dark' ? "bg-[#D0BCFF] text-[#381E72] hover:bg-[#EADDFF]" : "bg-[#6750A4] text-white hover:bg-[#5a4590]"
                    )}
                  >
                    {t.goToVoting}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}

          {/* Voting Screen */}
          {gameState.status === 'voting' && (
            <motion.div
              key="voting"
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col gap-6"
            >
              <Card className={cn(
                "rounded-[28px] border-none shadow-lg",
                gameState.theme === 'dark' ? "bg-[#2B2930]" : "bg-[#F7F2FA]"
              )}>
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-display">{t.whoIsImpostor}</CardTitle>
                  <CardDescription className={gameState.theme === 'dark' ? "text-[#CAC4D0]" : ""}>
                    {t.pointSuspect}
                  </CardDescription>
                </CardHeader>
                <CardContent className="py-8">
                  <div className="text-center mb-8">
                    <p className={cn("mb-4", gameState.theme === 'dark' ? "text-[#CAC4D0]" : "text-[#49454F]")}>
                      {t.impostorWinQ}
                    </p>
                    <div className="flex gap-4 justify-center">
                      <Button 
                        onClick={() => finishRound(true)}
                        className={cn(
                          "h-20 w-32 rounded-3xl flex flex-col gap-1",
                          gameState.theme === 'dark' ? "bg-[#D0BCFF] text-[#381E72]" : "bg-[#6750A4] text-white"
                        )}
                      >
                        <Trophy className="w-6 h-6" />
                        <span>{t.impostorWon}</span>
                      </Button>
                      <Button 
                        onClick={() => finishRound(false)}
                        variant="outline"
                        className={cn(
                          "h-20 w-32 rounded-3xl flex flex-col gap-1",
                          gameState.theme === 'dark' ? "border-[#938F99] text-[#D0BCFF]" : "border-[#79747E] text-[#6750A4]"
                        )}
                      >
                        <CheckCircle2 className="w-6 h-6" />
                        <span>{t.foundThem}</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Results Screen */}
          {gameState.status === 'results' && (
            <motion.div
              key="results"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex flex-col gap-6"
            >
              <Card className={cn(
                "rounded-[28px] border-none shadow-xl",
                gameState.theme === 'dark' ? "bg-[#2B2930]" : "bg-[#F7F2FA]"
              )}>
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl font-display">{t.roundOver}</CardTitle>
                  <CardDescription className={gameState.theme === 'dark' ? "text-[#CAC4D0]" : ""}>
                    {t.secretWordWas} <span className={cn("font-bold", gameState.theme === 'dark' ? "text-[#D0BCFF]" : "text-[#6750A4]")}>
                      {getCurrentWordDisplay()}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <div className={cn(
                    "p-4 rounded-2xl border",
                    gameState.theme === 'dark' ? "bg-[#381E72] border-[#D0BCFF]" : "bg-[#EADDFF] border-[#6750A4]"
                  )}>
                    <p className={cn(
                      "text-xs font-bold uppercase tracking-widest mb-3",
                      gameState.theme === 'dark' ? "text-[#D0BCFF]" : "text-[#21005D]"
                    )}>{t.impostorsWere}</p>
                    <div className="flex flex-col gap-2">
                      {gameState.players.filter(p => gameState.impostorIds.includes(p.id)).map(p => (
                        <div key={p.id} className="flex items-center gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center font-bold",
                            gameState.theme === 'dark' ? "bg-[#D0BCFF] text-[#381E72]" : "bg-[#6750A4] text-white"
                          )}>
                            {p.name[0].toUpperCase()}
                          </div>
                          <span className="text-lg font-bold">{p.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className={gameState.theme === 'dark' ? "bg-[#49454F]" : "my-2"} />
                  
                  <p className={cn("text-sm font-bold", gameState.theme === 'dark' ? "text-[#CAC4D0]" : "text-[#49454F]")}>
                    {t.scoreboard}
                  </p>
                  <div className="flex flex-col gap-2">
                    {gameState.players.sort((a, b) => b.score - a.score).map(p => (
                      <div key={p.id} className={cn(
                        "flex items-center justify-between p-3 rounded-xl border",
                        gameState.theme === 'dark' ? "bg-[#1C1B1F] border-[#49454F]" : "bg-white border-[#CAC4D0]"
                      )}>
                        <span className="font-medium">{p.name}</span>
                        <Badge className={cn(
                          "border-none",
                          gameState.theme === 'dark' ? "bg-[#49454F] text-[#E6E1E5]" : "bg-[#E8DEF8] text-[#1D192B]"
                        )}>
                          {p.score} {t.pts}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={resetGame}
                    className={cn(
                      "w-full h-14 rounded-full font-bold",
                      gameState.theme === 'dark' ? "bg-[#D0BCFF] text-[#381E72] hover:bg-[#EADDFF]" : "bg-[#6750A4] text-white hover:bg-[#5a4590]"
                    )}
                  >
                    <RotateCcw className="mr-2 w-5 h-5" />
                    {t.playAgain}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Info */}
      </div>

      {/* Custom Category Popup */}
      <AnimatePresence>
        {isPopupOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPopupOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className={cn(
                "w-full max-w-sm rounded-[28px] shadow-2xl overflow-hidden relative z-10",
                gameState.theme === 'dark' ? "bg-[#2B2930] text-[#E6E1E5]" : "bg-white text-[#1D1B20]"
              )}
            >
              <div className="p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold font-display">{t.newCategoryTitle}</h3>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsPopupOpen(false)}
                    className="rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="text-xs font-bold uppercase tracking-wider opacity-70">
                    {t.categoryName}
                  </Label>
                  <Input 
                    placeholder="e.g. Star Wars"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className={cn(
                      "rounded-xl",
                      gameState.theme === 'dark' ? "bg-[#1C1B1F] border-[#49454F]" : "border-[#CAC4D0]"
                    )}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="text-xs font-bold uppercase tracking-wider opacity-70">
                    Words
                  </Label>
                  <textarea 
                    placeholder={t.wordsPlaceholder}
                    value={newCatWords}
                    onChange={(e) => setNewCatWords(e.target.value)}
                    rows={6}
                    className={cn(
                      "w-full rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#6750A4]",
                      gameState.theme === 'dark' ? "bg-[#1C1B1F] border-[#49454F]" : "border border-[#CAC4D0]"
                    )}
                  />
                </div>

                <div className="flex gap-3 mt-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsPopupOpen(false)}
                    className="flex-1 rounded-full border-[#79747E]"
                  >
                    {t.cancel}
                  </Button>
                  <Button 
                    onClick={handleAddCategory}
                    className={cn(
                      "flex-1 rounded-full font-bold",
                      gameState.theme === 'dark' ? "bg-[#D0BCFF] text-[#381E72]" : "bg-[#6750A4] text-white"
                    )}
                  >
                    {t.submit}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Rules Modal */}
        {isRulesOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={cn(
                "w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl",
                gameState.theme === 'dark' ? "bg-[#2B2930] text-[#E6E1E5]" : "bg-[#FEF7FF] text-[#1D1B20]"
              )}
            >
              <div className="p-6 sm:p-8 flex flex-col gap-6 max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black font-display">{t.howToPlay}</h2>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsRulesOpen(false)}
                    className="rounded-full"
                  >
                    <X className="w-6 h-6" />
                  </Button>
                </div>

                <div className="space-y-6">
                  <section className="space-y-2">
                    <h3 className="text-sm font-black uppercase tracking-widest text-[#6750A4] dark:text-[#D0BCFF]">
                      {t.objective}
                    </h3>
                    <p className="text-sm leading-relaxed opacity-90">
                      {t.objectiveDesc}
                    </p>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-sm font-black uppercase tracking-widest text-[#6750A4] dark:text-[#D0BCFF]">
                      {t.howToPlay}
                    </h3>
                    <div className="space-y-3">
                      <p className="text-sm leading-relaxed opacity-90">{t.howToPlayStep1}</p>
                      <p className="text-sm leading-relaxed opacity-90">{t.howToPlayStep2}</p>
                      <p className="text-sm leading-relaxed opacity-90">{t.howToPlayStep3}</p>
                    </div>
                  </section>

                  <section className="space-y-2">
                    <h3 className="text-sm font-black uppercase tracking-widest text-[#6750A4] dark:text-[#D0BCFF]">
                      {t.scoring}
                    </h3>
                    <p className="text-sm leading-relaxed opacity-90">
                      {t.scoringDesc}
                    </p>
                  </section>
                </div>

                <Button 
                  onClick={() => setIsRulesOpen(false)}
                  className={cn(
                    "w-full h-12 rounded-full font-bold mt-4",
                    gameState.theme === 'dark' ? "bg-[#D0BCFF] text-[#381E72]" : "bg-[#6750A4] text-white"
                  )}
                >
                  {t.close}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
