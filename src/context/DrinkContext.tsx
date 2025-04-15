import React, { createContext, useContext, useState, useEffect } from 'react';
import { Drink, SizeOption, Addon, SelectedDrink } from '../types/types';

// Данные о напитках
const coffeeData: Drink[] = [
  {
    id: 1,
    name: 'Эспрессо',
    price: 79,
    image: '/images/products/espresso.png',
    category: 'coffee',
  },
  {
    id: 2,
    name: 'Эспрессо 2x',
    price: 109,
    image: '/images/products/double-espresso.png',
    category: 'coffee',
  },
  {
    id: 3,
    name: 'Американо',
    price: 119,
    image: '/images/products/americano.png',
    category: 'coffee',
  },
  {
    id: 4,
    name: 'Латте',
    price: 129,
    image: '/images/products/latte.png',
    category: 'coffee',
  },
  {
    id: 5,
    name: 'Капучино',
    price: 129,
    image: '/images/products/cappuccino.png',
    category: 'coffee',
  },
  {
    id: 6,
    name: 'Макиато',
    price: 129,
    image: '/images/products/macchiato.png',
    category: 'coffee',
  },
];

const teaData: Drink[] = [
  {
    id: 7,
    name: 'Чёрный чай',
    price: 69,
    image: '/images/products/tea-black.png',
    category: 'tea',
  },
  {
    id: 8,
    name: 'Зелёный чай',
    price: 69,
    image: '/images/products/tea-green.png',
    category: 'tea',
  },
  {
    id: 9,
    name: 'Чай с мятой',
    price: 79,
    image: '/images/products/tea-mint.png',
    category: 'tea',
  },
  {
    id: 10,
    name: 'Чай с имбирём',
    price: 79,
    image: '/images/products/tea-ginger.png',
    category: 'tea',
  },
];

const milkshakeData: Drink[] = [
  {
    id: 11,
    name: 'Ванильный коктейль',
    price: 129,
    image: '/images/products/milkshake-vanilla.png',
    category: 'milkshake',
  },
  {
    id: 12,
    name: 'Шоколадный коктейль',
    price: 129,
    image: '/images/products/milkshake-chocolate.png',
    category: 'milkshake',
  },
  {
    id: 13,
    name: 'Клубничный коктейль',
    price: 129,
    image: '/images/products/milkshake-strawberry.png',
    category: 'milkshake',
  },
];

const softDrinksData: Drink[] = [
  {
    id: 14,
    name: 'Клюквенный морс',
    price: 89,
    image: '/images/products/soft-drink-cranberry.png',
    category: 'softDrink',
  },
  {
    id: 15,
    name: 'Лимонад',
    price: 99,
    image: '/images/products/soft-drink-lemonade.png',
    category: 'softDrink',
  },
  {
    id: 16,
    name: 'Газированная вода',
    price: 69,
    image: '/images/products/soft-drink-soda.png',
    category: 'softDrink',
  },
];

// Опции размеров напитков
const sizeOptions: SizeOption[] = [
  { id: 1, name: '200 мл.', value: 200, priceModifier: 0 },
  { id: 2, name: '300 мл.', value: 300, priceModifier: 20 },
  { id: 3, name: '400 мл.', value: 400, priceModifier: 40 },
];

// Опции добавок (сиропы)
const addonOptions: Addon[] = [
  { id: 1, name: 'Ванильный сироп', price: 20 },
  { id: 2, name: 'Мятный сироп', price: 20 },
  { id: 3, name: 'Карамельный сироп', price: 20 },
  { id: 4, name: 'Шоколадный сироп', price: 20 },
];

// Интерфейс контекста напитков
interface DrinkContextType {
  drinks: {
    coffee: Drink[];
    tea: Drink[];
    milkshake: Drink[];
    softDrinks: Drink[];
  };
  sizeOptions: SizeOption[];
  addonOptions: Addon[];
  selectedDrink: SelectedDrink | null;
  selectedCategory: 'coffee' | 'tea' | 'milkshake' | 'softDrink';
  setSelectedCategory: (category: 'coffee' | 'tea' | 'milkshake' | 'softDrink') => void;
  selectDrink: (drink: Drink) => void;
  updateSize: (size: SizeOption) => void;
  addAddon: (addon: Addon) => void;
  removeAddon: (addonId: number) => void;
  clearSelection: () => void;
  calculateTotalPrice: () => number;
  setSelectedDrinks: (callback: (prevDrinks: SelectedDrink[]) => SelectedDrink[]) => void;
}

// Создание контекста
const DrinkContext = createContext<DrinkContextType | undefined>(undefined);

// Хук для использования контекста
export const useDrink = (): DrinkContextType => {
  const context = useContext(DrinkContext);
  if (context === undefined) {
    throw new Error('useDrink must be used within a DrinkProvider');
  }
  return context;
};

// Провайдер контекста
export const DrinkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Состояние выбранной категории напитков
  const [selectedCategory, setSelectedCategory] = useState<'coffee' | 'tea' | 'milkshake' | 'softDrink'>('coffee');
  
  // Состояние выбранного напитка
  const [selectedDrink, setSelectedDrink] = useState<SelectedDrink | null>(null);

  // Состояние списка выбранных напитков
  const [selectedDrinks, setSelectedDrinks] = useState<SelectedDrink[]>([]);

  // Функция выбора напитка
  const selectDrink = (drink: Drink) => {
    // По умолчанию выбираем первый размер
    const defaultSize = sizeOptions[0];
    
    setSelectedDrink({
      drink,
      size: defaultSize,
      addons: [],
      totalPrice: drink.price + defaultSize.priceModifier,
    });
  };

  // Функция обновления размера напитка
  const updateSize = (size: SizeOption) => {
    if (selectedDrink) {
      setSelectedDrink({
        ...selectedDrink,
        size,
        totalPrice: calculatePriceWithSize(selectedDrink.drink.price, size, selectedDrink.addons),
      });
    }
  };

  // Функция добавления добавки
  const addAddon = (addon: Addon) => {
    if (selectedDrink) {
      // Проверяем, не добавлена ли уже эта добавка
      if (!selectedDrink.addons.some((a) => a.id === addon.id)) {
        const updatedAddons = [...selectedDrink.addons, addon];
        setSelectedDrink({
          ...selectedDrink,
          addons: updatedAddons,
          totalPrice: calculatePriceWithAddons(
            selectedDrink.drink.price,
            selectedDrink.size,
            updatedAddons
          ),
        });
      }
    }
  };

  // Функция удаления добавки
  const removeAddon = (addonId: number) => {
    if (selectedDrink) {
      const updatedAddons = selectedDrink.addons.filter((addon) => addon.id !== addonId);
      setSelectedDrink({
        ...selectedDrink,
        addons: updatedAddons,
        totalPrice: calculatePriceWithAddons(
          selectedDrink.drink.price,
          selectedDrink.size,
          updatedAddons
        ),
      });
    }
  };

  // Функция очистки выбора
  const clearSelection = () => {
    setSelectedDrink(null);
  };

  // Функция расчета итоговой цены
  const calculateTotalPrice = (): number => {
    if (!selectedDrink) return 0;
    return selectedDrink.totalPrice;
  };

  // Вспомогательная функция для расчета цены с учетом размера
  const calculatePriceWithSize = (
    basePrice: number,
    size: SizeOption,
    addons: Addon[]
  ): number => {
    const addonsTotal = addons.reduce((total, addon) => total + addon.price, 0);
    return basePrice + size.priceModifier + addonsTotal;
  };

  // Вспомогательная функция для расчета цены с учетом добавок
  const calculatePriceWithAddons = (
    basePrice: number,
    size: SizeOption,
    addons: Addon[]
  ): number => {
    const addonsTotal = addons.reduce((total, addon) => total + addon.price, 0);
    return basePrice + size.priceModifier + addonsTotal;
  };

  // Значение контекста
  const value: DrinkContextType = {
    drinks: {
      coffee: coffeeData,
      tea: teaData,
      milkshake: milkshakeData,
      softDrinks: softDrinksData,
    },
    sizeOptions,
    addonOptions,
    selectedDrink,
    selectedCategory,
    setSelectedCategory,
    selectDrink,
    updateSize,
    addAddon,
    removeAddon,
    clearSelection,
    calculateTotalPrice,
    setSelectedDrinks,
  };

  return <DrinkContext.Provider value={value}>{children}</DrinkContext.Provider>;
}; 