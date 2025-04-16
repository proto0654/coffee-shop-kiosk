import React from 'react';
import { Drink } from '../../types/types';

interface ProductCardProps {
  drink: Drink;
  onClick: (drink: Drink) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ drink, onClick }) => {
  return (
    <div
      className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer text-center"
      onClick={() => onClick(drink)}
    >
      <img src={drink.image} alt={drink.name} className="w-full h-auto mb-3 rounded" />
      <h3 className="text-base font-medium mb-1">{drink.name}</h3>
      <p className="text-lg font-semibold">{drink.price}₽</p>
    </div>
  );
};

export default ProductCard;
