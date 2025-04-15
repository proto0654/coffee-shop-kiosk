import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DrinkSelectionScreen.css';
import Header from './Header';
import { useDrink } from '../context/DrinkContext';
import { SizeOption, Addon } from '../types/types';

const DrinkSelectionScreen: React.FC = () => {
  const navigate = useNavigate();
  const { 
    drinks, 
    selectedCategory, 
    setSelectedCategory, 
    selectDrink,
    selectedDrink,
    sizeOptions,
    addonOptions,
    updateSize,
    addAddon,
    removeAddon,
    calculateTotalPrice,
    setSelectedDrinks
  } = useDrink();

  // Состояния для модальных окон
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [showAddonsModal, setShowAddonsModal] = useState(false);

  // Получаем напитки в зависимости от выбранной категории
  const getDisplayedDrinks = () => {
    switch (selectedCategory) {
      case 'coffee':
        return drinks.coffee;
      case 'tea':
        return drinks.tea;
      case 'milkshake':
        return drinks.milkshake;
      case 'softDrink':
        return drinks.softDrinks;
      default:
        return drinks.coffee;
    }
  };
  
  const displayedDrinks = getDisplayedDrinks();

  // Обработчик выбора категории
  const handleCategoryChange = (category: 'coffee' | 'tea' | 'milkshake' | 'softDrink') => {
    setSelectedCategory(category);
  };

  // Обработчик выбора напитка
  const handleDrinkSelect = (drink: any) => {
    selectDrink(drink);
    setShowSizeModal(true);
  };
  
  // Обработчик выбора размера
  const handleSizeSelect = (size: SizeOption) => {
    updateSize(size);
  };
  
  // Обработчик добавления/удаления добавки
  const handleAddonToggle = (addon: Addon) => {
    if (selectedDrink?.addons.some(a => a.id === addon.id)) {
      removeAddon(addon.id);
    } else {
      addAddon(addon);
    }
  };
  
  // Обработчик перехода к оплате
  const handleGoToPayment = () => {
    // Закрываем оба модальных окна при переходе к оплате
    setShowSizeModal(false);
    setShowAddonsModal(false);
    
    // Сохраняем выбранный напиток в контекст
    if (selectedDrink) {
      setSelectedDrinks((prevDrinks: any) => [...prevDrinks, selectedDrink]);
    }
    
    // Переходим на экран оплаты
    navigate('/payment');
  };
  
  // Функция для проверки, выбрана ли добавка
  const isAddonSelected = (addonId: number) => {
    return selectedDrink?.addons.some(addon => addon.id === addonId) || false;
  };
  
  // Получаем CSS класс фона в зависимости от выбранной категории
  const getBackgroundClass = () => {
    switch (selectedCategory) {
      case 'coffee':
        return 'coffee-bg';
      case 'tea':
        return 'tea-bg';
      case 'milkshake':
        return 'milkshake-bg';
      case 'softDrink':
        return 'soft-drinks-bg';
      default:
        return 'coffee-bg';
    }
  };

  const openAddonsModal = () => {
    // Не закрываем первое модальное окно при открытии второго
    setShowAddonsModal(true);
  };

  const closeSizeModal = () => {
    setShowSizeModal(false);
  };

  const closeAddonsModal = () => {
    setShowAddonsModal(false);
  };

  // Получаем путь к изображению категории в зависимости от выбранной категории
  const getCategoryImage = (category: string) => {
    switch (category) {
      case 'coffee':
        return '/images/coffee-cat.png';
      case 'tea':
        return '/images/tea-cat.png';
      case 'milkshake':
        return '/images/coctail-cat.png';
      case 'softDrink':
        return '/images/drinks-cat.png';
      default:
        return '/images/coffee-cat.png';
    }
  };

  return (
    <div className={`drink-selection-screen ${getBackgroundClass()}`}>
      <Header title="Выбор напитка" />
      
      {/* Табы категорий */}
      <div className="category-tabs">
        <div 
          className={`category-tab ${selectedCategory === 'coffee' ? 'active' : ''}`} 
          onClick={() => handleCategoryChange('coffee')}
        >
          <img 
            src={getCategoryImage('coffee')} 
            alt="Кофе" 
            className="category-icon" 
          />
          <span className="category-name">Кофе</span>
          {selectedCategory === 'coffee' && <div className="indicator coffee"></div>}
        </div>
        
        <div 
          className={`category-tab ${selectedCategory === 'tea' ? 'active' : ''}`} 
          onClick={() => handleCategoryChange('tea')}
        >
          <img 
            src={getCategoryImage('tea')} 
            alt="Чай" 
            className="category-icon" 
          />
          <span className="category-name">Чай</span>
          {selectedCategory === 'tea' && <div className="indicator tea"></div>}
        </div>
        
        <div 
          className={`category-tab ${selectedCategory === 'milkshake' ? 'active' : ''}`} 
          onClick={() => handleCategoryChange('milkshake')}
        >
          <img 
            src={getCategoryImage('milkshake')} 
            alt="Молочный коктейль" 
            className="category-icon" 
          />
          <span className="category-name">Молочный коктейль</span>
          {selectedCategory === 'milkshake' && <div className="indicator milkshake"></div>}
        </div>
        
        <div 
          className={`category-tab ${selectedCategory === 'softDrink' ? 'active' : ''}`} 
          onClick={() => handleCategoryChange('softDrink')}
        >
          <img 
            src={getCategoryImage('softDrink')} 
            alt="Морсы и газ. напитки" 
            className="category-icon" 
          />
          <span className="category-name">Морсы и газ. напитки</span>
          {selectedCategory === 'softDrink' && <div className="indicator soft-drinks"></div>}
        </div>
      </div>
      
      {/* Сетка напитков */}
      <div className="products-grid">
        {displayedDrinks.map((drink) => (
          <div 
            key={drink.id} 
            className="product-card" 
            onClick={() => handleDrinkSelect(drink)}
          >
            <div className="product-image-container">
              <img 
                src={drink.image} 
                alt={drink.name} 
                className="product-image" 
              />
              {drink.id === 2 && (
                <div className="product-badge">2x</div>
              )}
            </div>
            <h3 className="product-name">{drink.name}</h3>
            <p className="product-price">от {drink.price}₽</p>
          </div>
        ))}
      </div>
      
      {/* Модальное окно выбора размера */}
      {showSizeModal && selectedDrink && (
        <div className="modal-overlay">
          <div className="size-modal">
            <div className="modal-header">
              <span></span>
              <button className="close-button" onClick={closeSizeModal}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 6L18 18" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <span></span>
            </div>
            
            <div className="drink-image-container">
              <img
                src={selectedDrink.drink.image}
                alt={selectedDrink.drink.name}
                className="drink-image"
              />
            </div>
            
            <h2 className="selected-drink-name">{selectedDrink.drink.name}</h2>
            
            <div className="size-options cup-size-options">
              {sizeOptions.map((size) => (
                <div
                  key={size.id}
                  className={`cup-size-option ${selectedDrink.size.id === size.id ? 'selected' : ''}`}
                  onClick={() => handleSizeSelect(size)}
                >
                  <div className="cup-icon">
                    <svg width="40" height="48" viewBox="0 0 40 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 16H32V38C32 39.0609 31.5786 40.0783 30.8284 40.8284C30.0783 41.5786 29.0609 42 28 42H12C10.9391 42 9.92172 41.5786 9.17157 40.8284C8.42143 40.0783 8 39.0609 8 38V16Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M13 6L8 16" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M27 6L32 16" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="cup-size-info">
                    <div className="cup-size-value">{size.value} мл.</div>
                    <div className="cup-size-price">{size.priceModifier > 0 ? `+${size.priceModifier}₽` : '0₽'}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="addon-button-toggle" onClick={openAddonsModal}>
              Хотите добавить сироп?
            </button>
            
            <button 
              className="confirm-button"
              onClick={handleGoToPayment}
            >
              Оплатить {calculateTotalPrice()}₽
            </button>
          </div>
        </div>
      )}
      
      {/* Модальное окно выбора добавок (сиропов) */}
      {showAddonsModal && selectedDrink && (
        <div className="modal-overlay addons-overlay">
          <div className="addons-modal">
            <div className="modal-header">
              <span></span>
              <button className="close-button" onClick={closeAddonsModal}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 6L18 18" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <span></span>
            </div>
            
            <h2 className="addons-title">Выбор сиропа</h2>
            
            <div className="addons-options">
              {addonOptions.map((addon) => (
                <div key={addon.id} className="addon-item">
                  <div className="addon-name">{addon.name}</div>
                  <div className="addon-controls">
                    <button 
                      className="addon-button minus" 
                      onClick={() => removeAddon(addon.id)}
                      disabled={!isAddonSelected(addon.id)}
                    >
                      −
                    </button>
                    <span className="addon-count">
                      {isAddonSelected(addon.id) ? '1' : '0'} гр.
                    </span>
                    <button 
                      className="addon-button plus" 
                      onClick={() => addAddon(addon)}
                      disabled={isAddonSelected(addon.id)}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              className="confirm-button"
              onClick={handleGoToPayment}
            >
              Оплатить {calculateTotalPrice()}₽
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DrinkSelectionScreen; 