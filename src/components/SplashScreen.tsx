import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SplashScreen.css';

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    // Последовательные анимации
    const animationTimers = [
      setTimeout(() => setAnimationStep(1), 300),  // Появление фона
      setTimeout(() => setAnimationStep(2), 600),  // Появление зерен
      setTimeout(() => setAnimationStep(3), 900),  // Появление стаканчиков
      setTimeout(() => setAnimationStep(4), 1500), // Появление текста
      setTimeout(() => setAnimationStep(5), 2100), // Появление белого круга
      setTimeout(() => setAnimationStep(6), 2700), // Появление призыва к действию
    ];

    // Очистка таймеров при размонтировании компонента
    return () => {
      animationTimers.forEach(timer => clearTimeout(timer));
    };
  }, []);

  // Обработчик клика для перехода на экран выбора напитков
  const handleClick = () => {
    navigate('/drinks');
  };

  return (
    <div className="w-full h-full relative overflow-hidden" onClick={handleClick}>
      {/* Желтый фон */}
      <div className={`splash-yellow-bg ${animationStep >= 1 ? 'visible' : ''}`}></div>

      {/* Декоративные круги */}
      <div
        className={`cta-bg absolute bottom-[-270px] right-[-170px] w-[500px] h-[500px] bg-white rounded-full z-20${animationStep >= 5 ? ' cta-visible' : ''}`}
      ></div>

      {/* Текст */}
      {animationStep >= 4 && (
        <div className="absolute top-[10%] left-[3%] text-left text-black z-10 animate-[fade-in_1s_ease]">
          <h1 className="font-light mb-2">
            ЭТО
            <br />
            ТВОЙ
            <br />
            КОФЕ
          </h1>
        </div>
      )}

      {/* Стаканчики кофе */}
      {animationStep >= 3 && (
        <>
          <img
            src={`${process.env.PUBLIC_URL}/images/splash/cup-right.png`}
            alt="Cup Right"
            className="absolute top-[14%] right-[-20%] w-74 h-auto z-20 animate-[slide-in-right_1.5s_ease]"
          />
          <img
            src={`${process.env.PUBLIC_URL}/images/splash/cup-left.png`}
            alt="Cup Left"
            className="absolute bottom-0 left-[-40%] w-124 h-auto z-20 animate-[slide-in-left_1.5s_ease]"
          />
        </>
      )}

      {/* Кофейные зерна */}
      {animationStep >= 2 && (
        <>
          <img
            src={`${process.env.PUBLIC_URL}/images/splash/bean1.png`}
            alt="Coffee Bean"
            className={`absolute top-[15%] left-[20%] w-12 h-auto z-40 animate-[float_3s_ease-in-out_infinite] transition-opacity duration-500${animationStep >= 5 ? ' beans-visible' : ''}`}
            style={{ transitionDelay: animationStep >= 5 ? '0ms' : '0ms' }}
          />
          <img
            src={`${process.env.PUBLIC_URL}/images/splash/bean2.png`}
            alt="Coffee Bean"
            className={`absolute top-[10%] right-[15%] w-16 h-auto z-40 animate-[float_4s_ease-in-out_infinite] transition-opacity duration-500${animationStep >= 5 ? ' beans-visible' : ''}`}
            style={{ transitionDelay: animationStep >= 5 ? '120ms' : '0ms' }}
          />
          <img
            src={`${process.env.PUBLIC_URL}/images/splash/bean3.png`}
            alt="Coffee Bean"
            className={`absolute top-[75%] left-[40%] w-24 h-auto z-40 animate-[float_3.5s_ease-in-out_infinite] transition-opacity duration-500${animationStep >= 5 ? ' beans-visible' : ''}`}
            style={{ transitionDelay: animationStep >= 5 ? '240ms' : '0ms' }}
          />
          <img
            src={`${process.env.PUBLIC_URL}/images/splash/bean4.png`}
            alt="Coffee Bean"
            className={`absolute top-[5%] left-[30%] w-20 h-auto z-40 animate-[float_5s_ease-in-out_infinite] transition-opacity duration-500${animationStep >= 5 ? ' beans-visible' : ''}`}
            style={{ transitionDelay: animationStep >= 5 ? '360ms' : '0ms' }}
          />
          <img
            src={`${process.env.PUBLIC_URL}/images/splash/bean5.png`}
            alt="Coffee Bean"
            className={`absolute top-[55%] right-[20%] w-14 h-auto z-40 animate-[float_4.5s_ease-in-out_infinite] transition-opacity duration-500${animationStep >= 5 ? ' beans-visible' : ''}`}
            style={{ transitionDelay: animationStep >= 5 ? '480ms' : '0ms' }}
          />
          <img
            src={`${process.env.PUBLIC_URL}/images/splash/bean6.png`}
            alt="Coffee Bean"
            className={`absolute top-[5%] right-[2%] w-16 h-auto z-40 animate-[float_5.5s_ease-in-out_infinite] transition-opacity duration-500${animationStep >= 5 ? ' beans-visible' : ''}`}
            style={{ transitionDelay: animationStep >= 5 ? '600ms' : '0ms' }}
          />
        </>
      )}

      {/* Призыв к действию */}
      {animationStep >= 6 && (
        <div className="absolute bottom-10 right-10 z-30 animate-[fade-in_1s_ease]">
          <p className="text-2xl font-medium text-center">
            Коснитесь
            <br />
            экрана
          </p>
        </div>
      )}
    </div>
  );
};

export default SplashScreen;
