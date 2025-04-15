import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
  // Состояние для обработки колбэков
  const [cashInsertCallback, setCashInsertCallback] = useState<((amount: number) => void) | null>(null);
  const [bankCardCallback, setBankCardCallback] = useState<((success: boolean) => void) | null>(null);
  const [bankCardDisplayCallback, setBankCardDisplayCallback] = useState<((message: string) => void) | null>(null);
  const [vendCallback, setVendCallback] = useState<((success: boolean) => void) | null>(null);

  // Функция для эмуляции вставки наличных
  const startCashin = useCallback((callback: (amount: number) => void) => {
    setCashInsertCallback(() => callback);
    console.log('🔵 Эмулятор: Режим приема наличных активирован. Используйте Ctrl+1 для вставки 100₽, Ctrl+2 для 200₽');
  }, []);

  // Функция для остановки эмуляции вставки наличных
  const stopCashin = useCallback((callback: () => void) => {
    setCashInsertCallback(null);
    callback();
    console.log('🔵 Эмулятор: Режим приема наличных остановлен');
  }, []);

  // Функция для эмуляции оплаты банковской картой
  const bankCardPurchase = useCallback(
    (amount: number, callback: (success: boolean) => void, displayCallback: (message: string) => void) => {
      setBankCardCallback(() => callback);
      setBankCardDisplayCallback(() => displayCallback);
      displayCallback('Приложите карту');
      console.log(`🔵 Эмулятор: Режим оплаты картой активирован на сумму ${amount}₽. Используйте Ctrl+S для успешной оплаты, Ctrl+F для отказа`);
    },
    []
  );

  // Функция для отмены оплаты банковской картой
  const bankCardCancel = useCallback(() => {
    if (bankCardCallback) {
      bankCardCallback(false);
      setBankCardCallback(null);
      setBankCardDisplayCallback(null);
      console.log('🔵 Эмулятор: Оплата картой отменена');
    }
  }, [bankCardCallback]);

  // Функция для эмуляции приготовления напитка
  const vend = useCallback((productIdx: number, callback: (success: boolean) => void) => {
    setVendCallback(() => callback);
    console.log(`🔵 Эмулятор: Приготовление напитка #${productIdx} начато. Используйте Ctrl+P для успешного приготовления, Ctrl+E для ошибки`);
  }, []);

  // Обработчики клавиатурных сокращений
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Эмуляция вставки наличных
      if (e.ctrlKey && cashInsertCallback) {
        if (e.key === '1') {
          cashInsertCallback(100);
          console.log('🔵 Эмулятор: Вставлено 100₽');
        } else if (e.key === '2') {
          cashInsertCallback(200);
          console.log('🔵 Эмулятор: Вставлено 200₽');
        }
      }

      // Эмуляция оплаты картой
      if (e.ctrlKey && bankCardCallback) {
        if (e.key === 's' || e.key === 'S') {
          if (bankCardDisplayCallback) {
            bankCardDisplayCallback('Обработка карты');
            setTimeout(() => {
              bankCardDisplayCallback('Связь с банком');
              setTimeout(() => {
                bankCardDisplayCallback('Оплата успешна');
                setTimeout(() => {
                  bankCardCallback(true);
                  setBankCardCallback(null);
                  setBankCardDisplayCallback(null);
                }, 1000);
              }, 1000);
            }, 1000);
          }
          console.log('🔵 Эмулятор: Оплата картой успешна');
        } else if (e.key === 'f' || e.key === 'F') {
          if (bankCardDisplayCallback) {
            bankCardDisplayCallback('Обработка карты');
            setTimeout(() => {
              bankCardDisplayCallback('Связь с банком');
              setTimeout(() => {
                bankCardDisplayCallback('Ошибка оплаты');
                setTimeout(() => {
                  bankCardCallback(false);
                  setBankCardCallback(null);
                  setBankCardDisplayCallback(null);
                }, 1000);
              }, 1000);
            }, 1000);
          }
          console.log('🔵 Эмулятор: Ошибка оплаты картой');
        }
      }

      // Эмуляция приготовления напитка
      if (e.ctrlKey && vendCallback) {
        if (e.key === 'p' || e.key === 'P') {
          setTimeout(() => {
            vendCallback(true);
            setVendCallback(null);
          }, 3000);
          console.log('🔵 Эмулятор: Приготовление напитка успешно');
        } else if (e.key === 'e' || e.key === 'E') {
          setTimeout(() => {
            vendCallback(false);
            setVendCallback(null);
          }, 1000);
          console.log('🔵 Эмулятор: Ошибка приготовления напитка');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [cashInsertCallback, bankCardCallback, bankCardDisplayCallback, vendCallback]);

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