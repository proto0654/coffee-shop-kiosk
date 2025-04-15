import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// SVG для кофейных зерен
const CoffeeBean: React.FC<{ className: string }> = ({ className }) => (
  <svg className={className} width="40" height="24" viewBox="0 0 40 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 0C13.6364 0 8 5.37223 8 12C8 18.6278 13.6364 24 20 24C26.3636 24 32 18.6278 32 12C32 5.37223 26.3636 0 20 0ZM20 20C16.0909 20 12.7273 16.4223 12.7273 12C12.7273 7.57772 16.0909 4 20 4C23.9091 4 27.2727 7.57772 27.2727 12C27.2727 16.4223 23.9091 20 20 20Z" fill="#3D240F"/>
    <path d="M20 8C18.6364 8 17.4545 9.79116 17.4545 12C17.4545 14.2088 18.6364 16 20 16C21.3636 16 22.5455 14.2088 22.5455 12C22.5455 9.79116 21.3636 8 20 8Z" fill="#3D240F"/>
  </svg>
);

// SVG для стаканчика
const CoffeeCup: React.FC<{ className: string }> = ({ className }) => (
  <svg className={className} width="70" height="90" viewBox="0 0 70 90" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 20H60L55 90H15L10 20Z" fill="white" stroke="#E0E0E0" strokeWidth="2"/>
    <path d="M18 10H52L55 20H15L18 10Z" fill="#F2F2F2" stroke="#E0E0E0" strokeWidth="2"/>
    <circle cx="35" cy="55" r="15" fill="#F2F2F2" stroke="#E0E0E0" strokeWidth="2"/>
  </svg>
);

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    // Последовательные анимации
    const animationTimers = [
      setTimeout(() => setAnimationStep(1), 500), // Появление зерен
      setTimeout(() => setAnimationStep(2), 1500), // Появление стаканчиков
      setTimeout(() => setAnimationStep(3), 2500), // Появление текста
      setTimeout(() => setAnimationStep(4), 3500), // Появление кнопки
    ];

    // Очистка таймеров при размонтировании компонента
    return () => {
      animationTimers.forEach(timer => clearTimeout(timer));
    };
  }, [navigate]);

  // Обработчик клика для перехода на экран выбора напитков
  const handleClick = () => {
    navigate('/drinks');
  };

  return (
    <div className="w-full h-full bg-coffee flex flex-col items-center justify-center relative" onClick={handleClick}>
      {/* Кофейные зерна */}
      {animationStep >= 1 && (
        <>
          <CoffeeBean className="absolute top-20 left-20 animate-[float_3s_ease-in-out_infinite]" />
          <CoffeeBean className="absolute top-40 left-10 animate-[float_4s_ease-in-out_infinite]" />
          <CoffeeBean className="absolute top-60 left-30 animate-[float_5s_ease-in-out_infinite]" />
          <CoffeeBean className="absolute top-30 right-20 animate-[float_3.5s_ease-in-out_infinite]" />
          <CoffeeBean className="absolute top-50 right-10 animate-[float_4.5s_ease-in-out_infinite]" />
          <CoffeeBean className="absolute top-70 right-30 animate-[float_5.5s_ease-in-out_infinite]" />
        </>
      )}

      {/* Стаканчики кофе */}
      {animationStep >= 2 && (
        <>
          <CoffeeCup className="absolute left-0 top-1/2 transform -translate-y-1/2 animate-[slide-in-left_1s_ease]" />
          <CoffeeCup className="absolute right-0 top-1/2 transform -translate-y-1/2 animate-[slide-in-right_1s_ease]" />
        </>
      )}

      {/* Текст */}
      {animationStep >= 3 && (
        <div className="text-center text-black animate-[fade-in_1s_ease]">
          <h1 className="text-4xl font-bold m-2">ЭТО</h1>
          <h1 className="text-4xl font-bold m-2">ТВОЙ</h1>
          <h1 className="text-4xl font-bold m-2">КОФЕ</h1>
        </div>
      )}

      {/* Кнопка призыва к действию */}
      {animationStep >= 4 && (
        <div className="absolute bottom-20 flex flex-col items-center animate-[fade-in_1s_ease]">
          <div className="w-16 h-16 rounded-full border-2 border-black animate-[pulse_2s_infinite]">
          </div>
          <p className="text-lg mt-4">Коснитесь экрана</p>
        </div>
      )}
    </div>
  );
};

export default SplashScreen; 