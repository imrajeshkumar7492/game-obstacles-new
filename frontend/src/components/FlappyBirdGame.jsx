import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Trophy } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

const GAME_CONFIG = {
  BIRD_SIZE: 30,
  PIPE_WIDTH: 60,
  PIPE_GAP: 220,
  GRAVITY: 0.4,
  JUMP_STRENGTH: -8,
  PIPE_SPEED: 2,
  CANVAS_WIDTH: 400, // Smaller for mobile
  CANVAS_HEIGHT: 600
};

const FlappyBirdGame = () => {
  const canvasRef = useRef(null);
  const gameLoopRef = useRef(null);
  
  const [gameState, setGameState] = useState('menu');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [bird, setBird] = useState({
    x: 150,
    y: 200, // Start much higher
    velocity: 0
  });
  const [pipes, setPipes] = useState([]);
  const [gameSpeed, setGameSpeed] = useState(1);

  // Mock high scores data
  const mockHighScores = [
    { id: 1, score: 45, date: '2024-12-20' },
    { id: 2, score: 38, date: '2024-12-19' },
    { id: 3, score: 32, date: '2024-12-18' },
    { id: 4, score: 28, date: '2024-12-17' },
    { id: 5, score: 22, date: '2024-12-16' }
  ];

  // Initialize high score from mock data
  useEffect(() => {
    setHighScore(mockHighScores[0]?.score || 0);
  }, []);

  const resetGame = useCallback(() => {
    setBird({ x: 150, y: 200, velocity: 0 }); // Start much higher
    setPipes([]);
    setScore(0);
    setGameSpeed(1);
  }, []);

  const startGame = useCallback(() => {
    resetGame();
    setGameState('playing');
  }, [resetGame]);

  const pauseGame = useCallback(() => {
    setGameState(gameState === 'paused' ? 'playing' : 'paused');
  }, [gameState]);

  const jump = useCallback(() => {
    if (gameState === 'playing') {
      setBird(prev => ({ ...prev, velocity: GAME_CONFIG.JUMP_STRENGTH }));
    } else if (gameState === 'menu' || gameState === 'gameOver') {
      startGame();
    }
  }, [gameState, startGame]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        jump();
      } else if (e.code === 'KeyP') {
        pauseGame();
      } else if (e.code === 'KeyR' && gameState === 'gameOver') {
        startGame();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [jump, pauseGame, startGame, gameState]);

  // Generate pipes with proper spacing
  const generatePipe = useCallback(() => {
    const minHeight = 80;
    const maxHeight = GAME_CONFIG.CANVAS_HEIGHT - GAME_CONFIG.PIPE_GAP - 80;
    const pipeHeight = Math.random() * (maxHeight - minHeight) + minHeight;
    return {
      id: Date.now() + Math.random(),
      x: GAME_CONFIG.CANVAS_WIDTH + 100,
      topHeight: pipeHeight,
      bottomY: pipeHeight + GAME_CONFIG.PIPE_GAP,
      passed: false
    };
  }, []);

  // Game loop - much more forgiving
  useEffect(() => {
    if (gameState !== 'playing') return;

    gameLoopRef.current = setInterval(() => {
      // Update bird physics
      setBird(prev => {
        let newY = prev.y + prev.velocity;
        let newVelocity = prev.velocity + GAME_CONFIG.GRAVITY;
        
        // Very forgiving ground collision - only fail if bird goes way down
        if (newY > GAME_CONFIG.CANVAS_HEIGHT - GAME_CONFIG.BIRD_SIZE - 10) {
          setGameState('gameOver');
          return prev;
        }
        
        // Ceiling collision - bounce back gently
        if (newY < 0) {
          newY = 0;
          newVelocity = 1; // Small downward velocity to prevent sticking
        }
        
        return {
          ...prev,
          y: newY,
          velocity: newVelocity
        };
      });

      // Update pipes - start with no pipes, add them later
      setPipes(prev => {
        let newPipes = [...prev];
        
        // Move pipes
        newPipes = newPipes.map(pipe => ({
          ...pipe,
          x: pipe.x - GAME_CONFIG.PIPE_SPEED * gameSpeed
        }));
        
        // Remove off-screen pipes
        newPipes = newPipes.filter(pipe => pipe.x + GAME_CONFIG.PIPE_WIDTH > -50);
        
        // Add first pipe only after score > 0 OR after some time
        if (score > 0 || (newPipes.length === 0 && Math.random() < 0.01)) {
          if (newPipes.length === 0 || newPipes[newPipes.length - 1].x < GAME_CONFIG.CANVAS_WIDTH - 350) {
            newPipes.push(generatePipe());
          }
        }
        
        // Check scoring - very generous
        newPipes.forEach(pipe => {
          if (!pipe.passed && pipe.x + GAME_CONFIG.PIPE_WIDTH < bird.x - 10) {
            pipe.passed = true;
            setScore(prev => {
              const newScore = prev + 1;
              if (newScore > highScore) {
                setHighScore(newScore);
              }
              return newScore;
            });
            setGameSpeed(prev => Math.min(prev + 0.05, 2));
          }
        });

        // Very forgiving collision detection
        const collision = newPipes.some(pipe => {
          const birdCenterX = bird.x + GAME_CONFIG.BIRD_SIZE / 2;
          const birdCenterY = bird.y + GAME_CONFIG.BIRD_SIZE / 2;
          const hitboxRadius = 10; // Much smaller hitbox
          
          // Only check collision if bird is really inside pipe
          if (birdCenterX > pipe.x + 10 && birdCenterX < pipe.x + GAME_CONFIG.PIPE_WIDTH - 10) {
            // Very generous gap
            if (birdCenterY - hitboxRadius < pipe.topHeight - 20 || 
                birdCenterY + hitboxRadius > pipe.bottomY + 20) {
              return true;
            }
          }
          return false;
        });

        if (collision) {
          setGameState('gameOver');
        }
        
        return newPipes;
      });
    }, 25); // Slower game loop for easier control

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameState, bird.x, bird.y, generatePipe, gameSpeed, highScore, score]);

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);

    // Draw beautiful gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, GAME_CONFIG.CANVAS_HEIGHT);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#98FB98');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);

    // Draw animated clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    for (let i = 0; i < 4; i++) {
      const x = (i * 220 + Date.now() * 0.01) % (GAME_CONFIG.CANVAS_WIDTH + 100);
      const y = 40 + Math.sin(i * 2) * 20;
      ctx.beginPath();
      ctx.arc(x, y, 25, 0, Math.PI * 2);
      ctx.arc(x + 20, y, 30, 0, Math.PI * 2);
      ctx.arc(x + 40, y, 25, 0, Math.PI * 2);
      ctx.fill();
    }

    if (gameState === 'playing' || gameState === 'paused') {
      // Draw pipes with nice gradients
      pipes.forEach(pipe => {
        // Top pipe
        const topGradient = ctx.createLinearGradient(pipe.x, 0, pipe.x + GAME_CONFIG.PIPE_WIDTH, 0);
        topGradient.addColorStop(0, '#32CD32');
        topGradient.addColorStop(1, '#228B22');
        ctx.fillStyle = topGradient;
        ctx.fillRect(pipe.x, 0, GAME_CONFIG.PIPE_WIDTH, pipe.topHeight);
        
        // Bottom pipe
        const bottomGradient = ctx.createLinearGradient(pipe.x, pipe.bottomY, pipe.x + GAME_CONFIG.PIPE_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);
        bottomGradient.addColorStop(0, '#32CD32');
        bottomGradient.addColorStop(1, '#228B22');
        ctx.fillStyle = bottomGradient;
        ctx.fillRect(pipe.x, pipe.bottomY, GAME_CONFIG.PIPE_WIDTH, GAME_CONFIG.CANVAS_HEIGHT - pipe.bottomY);
        
        // Pipe caps
        ctx.fillStyle = '#228B22';
        ctx.fillRect(pipe.x - 4, pipe.topHeight - 25, GAME_CONFIG.PIPE_WIDTH + 8, 25);
        ctx.fillRect(pipe.x - 4, pipe.bottomY, GAME_CONFIG.PIPE_WIDTH + 8, 25);
      });

      // Draw bird with nice gradient
      const birdGradient = ctx.createRadialGradient(
        bird.x + GAME_CONFIG.BIRD_SIZE/2, bird.y + GAME_CONFIG.BIRD_SIZE/2, 0,
        bird.x + GAME_CONFIG.BIRD_SIZE/2, bird.y + GAME_CONFIG.BIRD_SIZE/2, GAME_CONFIG.BIRD_SIZE/2
      );
      birdGradient.addColorStop(0, '#FFD700');
      birdGradient.addColorStop(1, '#FFA500');
      
      ctx.fillStyle = birdGradient;
      ctx.beginPath();
      ctx.arc(bird.x + GAME_CONFIG.BIRD_SIZE/2, bird.y + GAME_CONFIG.BIRD_SIZE/2, GAME_CONFIG.BIRD_SIZE/2, 0, Math.PI * 2);
      ctx.fill();
      
      // Bird eye
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(bird.x + 18, bird.y + 8, 3, 0, Math.PI * 2);
      ctx.fill();
      
      // Bird beak
      ctx.fillStyle = '#FF6347';
      ctx.beginPath();
      ctx.moveTo(bird.x + GAME_CONFIG.BIRD_SIZE, bird.y + GAME_CONFIG.BIRD_SIZE/2);
      ctx.lineTo(bird.x + GAME_CONFIG.BIRD_SIZE + 8, bird.y + GAME_CONFIG.BIRD_SIZE/2 - 4);
      ctx.lineTo(bird.x + GAME_CONFIG.BIRD_SIZE + 8, bird.y + GAME_CONFIG.BIRD_SIZE/2 + 4);
      ctx.fill();
    }

    // Draw paused overlay
    if (gameState === 'paused') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);
      
      ctx.fillStyle = '#FFF';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('PAUSED', GAME_CONFIG.CANVAS_WIDTH/2, GAME_CONFIG.CANVAS_HEIGHT/2);
    }
  }, [bird, pipes, gameState]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-400 to-green-400 p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">
            Flappy Adventure
          </h1>
          <p className="text-xl text-white/90">Navigate through obstacles and survive as long as you can!</p>
        </div>

        <div className="flex gap-6 justify-center">
          {/* Game Canvas */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4">
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  width={GAME_CONFIG.CANVAS_WIDTH}
                  height={GAME_CONFIG.CANVAS_HEIGHT}
                  className="border-2 border-white/30 rounded-lg cursor-pointer shadow-2xl"
                  onClick={jump}
                />
                
                {/* Game Over Overlay */}
                {gameState === 'gameOver' && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-lg">
                    <div className="text-center text-white">
                      <h2 className="text-4xl font-bold mb-4">Game Over!</h2>
                      <p className="text-xl mb-2">Final Score: {score}</p>
                      {score === highScore && score > 0 && (
                        <p className="text-yellow-300 text-lg mb-4">🎉 New High Score!</p>
                      )}
                      <Button onClick={startGame} className="bg-orange-500 hover:bg-orange-600">
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Play Again
                      </Button>
                    </div>
                  </div>
                )}

                {/* Menu Overlay */}
                {gameState === 'menu' && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-lg">
                    <div className="text-center text-white">
                      <h2 className="text-4xl font-bold mb-6">Ready to Fly?</h2>
                      <p className="text-lg mb-4">Click anywhere or press SPACE to flap!</p>
                      <p className="text-sm mb-6 opacity-75">Press P to pause • R to restart</p>
                      <Button onClick={startGame} className="bg-green-500 hover:bg-green-600 text-xl px-8 py-3">
                        <Play className="w-6 h-6 mr-2" />
                        Start Game
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Side Panel */}
          <div className="flex flex-col gap-4">
            {/* Score Card */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 w-64">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-center">Score</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-center">
                  <div className="text-4xl font-bold text-yellow-300 mb-2">{score}</div>
                  <div className="flex items-center justify-center gap-2">
                    <Trophy className="w-4 h-4 text-yellow-400" />
                    <span className="text-white/80">Best: {highScore}</span>
                  </div>
                  <Badge variant="secondary" className="mt-2 bg-white/20 text-white">
                    Speed: {gameSpeed.toFixed(1)}x
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Controls Card */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 w-64">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-center">Controls</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <Button 
                  onClick={jump} 
                  disabled={gameState === 'paused'}
                  className="w-full bg-yellow-500 hover:bg-yellow-600"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Flap (Space)
                </Button>
                <Button 
                  onClick={pauseGame} 
                  disabled={gameState === 'menu' || gameState === 'gameOver'}
                  variant="outline"
                  className="w-full border-white/30 text-white hover:bg-white/20"
                >
                  <Pause className="w-4 h-4 mr-2" />
                  Pause (P)
                </Button>
              </CardContent>
            </Card>

            {/* High Scores Card */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 w-64">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-center flex items-center justify-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {mockHighScores.slice(0, 5).map((entry, index) => (
                    <div key={entry.id} className="flex justify-between items-center text-white/80 text-sm">
                      <span>#{index + 1}</span>
                      <span className="font-bold">{entry.score}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Instructions */}
        <div className="text-center mt-6 text-white/80">
          <p className="text-sm">
            🎮 Click anywhere on the canvas or press SPACE to flap • P to pause • R to restart after game over
          </p>
        </div>
      </div>
    </div>
  );
};

export default FlappyBirdGame;