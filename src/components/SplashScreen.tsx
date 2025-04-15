import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SplashScreen.css';

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
    <div className="splash-screen coffee-bg" onClick={handleClick}>
      {/* Кофейные зерна */}
      {animationStep >= 1 && (
        <>
          <CoffeeBean className="coffee-bean bean-1" />
          <CoffeeBean className="coffee-bean bean-2" />
          <CoffeeBean className="coffee-bean bean-3" />
          <CoffeeBean className="coffee-bean bean-4" />
          <CoffeeBean className="coffee-bean bean-5" />
          <CoffeeBean className="coffee-bean bean-6" />
        </>
      )}

      {/* Стаканчики кофе */}
      {animationStep >= 2 && (
        <>
          <CoffeeCup className="coffee-cup cup-left" />
          <CoffeeCup className="coffee-cup cup-right" />
        </>
      )}

      {/* Текст */}
      {animationStep >= 3 && (
        <div className="splash-text">
          <h1>ЭТО</h1>
          <h1>ТВОЙ</h1>
          <h1>КОФЕ</h1>
        </div>
      )}

      {/* Кнопка призыва к действию */}
      {animationStep >= 4 && (
        <div className="splash-cta">
          <div className="cta-circle"></div>
          <p className="cta-text">Коснитесь экрана</p>
        </div>
      )}
    </div>
  );
};

export default SplashScreen; 