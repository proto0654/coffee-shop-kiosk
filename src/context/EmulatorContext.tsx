import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { EmulatorInterface } from '../types/types';

// Создаем контекст для эмулятора
const EmulatorContext = createContext<EmulatorInterface | undefined>(undefined);

// Хук для использования контекста эмулятора
export const useEmulator = (): EmulatorInterface => {
  const context = useContext(EmulatorContext);
  if (context === undefined) {
    throw new Error('useEmulator must be used within an EmulatorProvider');
  }
  return context;
};

export const EmulatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Используем useRef вместо useState для хранения колбэков
  const cashInsertCallbackRef = useRef<((amount: number) => void) | null>(null);
  const bankCardCallbackRef = useRef<((success: boolean) => void) | null>(null);
  const bankCardDisplayCallbackRef = useRef<((message: string) => void) | null>(null);
  const vendCallbackRef = useRef<((success: boolean) => void) | null>(null);

  // Функция для эмуляции вставки наличных
  const startCashin = useCallback((callback: (amount: number) => void) => {
    cashInsertCallbackRef.current = callback;
    console.log(
      '🔵 Эмулятор: Режим приема наличных активирован. Используйте Ctrl+1 для вставки 100₽, Ctrl+2 для 200₽'
    );
  }, []);

  // Функция для остановки эмуляции вставки наличных
  const stopCashin = useCallback((callback: () => void) => {
    cashInsertCallbackRef.current = null;
    callback();
    console.log('🔵 Эмулятор: Режим приема наличных остановлен');
  }, []);

  // Функция для эмуляции оплаты банковской картой
  const bankCardPurchase = useCallback(
    (
      amount: number,
      callback: (success: boolean) => void,
      displayCallback: (message: string) => void
    ) => {
      bankCardCallbackRef.current = callback;
      bankCardDisplayCallbackRef.current = displayCallback;
      displayCallback('Приложите карту к терминалу');
      console.log(
        `🔵 Эмулятор: Режим оплаты картой активирован на сумму ${amount}₽. Используйте пробел для приложения карты.`
      );
    },
    []
  );

  // Функция для отмены оплаты банковской картой
  const bankCardCancel = useCallback(() => {
    if (bankCardCallbackRef.current) {
      bankCardCallbackRef.current(false);
      bankCardCallbackRef.current = null;
      bankCardDisplayCallbackRef.current = null;
      console.log('🔵 Эмулятор: Оплата картой отменена');
    }
  }, []);

  // Функция для эмуляции приготовления напитка
  const vend = useCallback((productIdx: number, callback: (success: boolean) => void) => {
    vendCallbackRef.current = callback;
    console.log(
      `🔵 Эмулятор: Приготовление напитка #${productIdx} начато. Используйте Ctrl+P для успешного приготовления, Ctrl+E для ошибки`
    );
  }, []);

  // Обработчики клавиатурных сокращений
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Эмуляция вставки наличных
      if (cashInsertCallbackRef.current) {
        if (e.key === '1') {
          cashInsertCallbackRef.current(1);
          console.log('🔵 Эмулятор: Вставлено 1₽');
        } else if (e.key === '5') {
          cashInsertCallbackRef.current(5);
          console.log('🔵 Эмулятор: Вставлено 5₽');
        } else if (e.key === '0') {
          cashInsertCallbackRef.current(10);
          console.log('🔵 Эмулятор: Вставлено 10₽');
        } else if (e.key === ' ') {
          // пробел
          cashInsertCallbackRef.current(100);
          console.log('🔵 Эмулятор: Вставлено 100₽');
        }
      }

      // Эмуляция оплаты картой
      if (bankCardCallbackRef.current && e.key === ' ' && !cashInsertCallbackRef.current) {
        console.log('🔵 Эмулятор: Карта приложена, оплата прошла успешно');
        if (bankCardDisplayCallbackRef.current) {
          const callback = bankCardCallbackRef.current;
          bankCardCallbackRef.current = null;
          bankCardDisplayCallbackRef.current = null;

          // Вызываем колбэк после очистки ссылок
          callback(true);
        }
      }

      // Эмуляция приготовления напитка
      if (e.ctrlKey && vendCallbackRef.current) {
        if (e.key === 'p' || e.key === 'P') {
          const callback = vendCallbackRef.current;
          setTimeout(() => {
            if (callback) {
              callback(true);
              vendCallbackRef.current = null;
            }
          }, 3000);
          console.log('🔵 Эмулятор: Приготовление напитка успешно');
        } else if (e.key === 'e' || e.key === 'E') {
          const callback = vendCallbackRef.current;
          setTimeout(() => {
            if (callback) {
              callback(false);
              vendCallbackRef.current = null;
            }
          }, 1000);
          console.log('🔵 Эмулятор: Ошибка приготовления напитка');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []); // Пустой массив зависимостей

  // Значение контекста эмулятора
  const emulatorValue: EmulatorInterface = {
    startCashin,
    stopCashin,
    bankCardPurchase,
    bankCardCancel,
    vend,
  };

  return <EmulatorContext.Provider value={emulatorValue}>{children}</EmulatorContext.Provider>;
};
