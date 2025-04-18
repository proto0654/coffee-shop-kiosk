/**
 * Утилита для предзагрузки изображений
 */

/**
 * Предзагружает изображение
 * @param src URL изображения
 * @returns Promise, который разрешается, когда изображение загружено
 */
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Не удалось загрузить изображение: ${src}`));
  });
};

/**
 * Предзагружает массив изображений
 * @param srcs Массив URL изображений
 * @returns Promise, который разрешается, когда все изображения загружены
 */
export const preloadImages = async (srcs: string[]): Promise<void[]> => {
  const promises = srcs.map(src => preloadImage(src));
  return Promise.all(promises);
};

/**
 * Предзагружает изображения категорий
 */
export const preloadCategoryImages = (): Promise<void[]> => {
  const categoryImages = [
    `/images/icons/coffee-cat.png`,
    `/images/icons/tea-cat.png`,
    `/images/icons/coctail-cat.png`,
    `/images/icons/drinks-cat.png`,
  ].map(path => `${process.env.PUBLIC_URL}${path}`);
  
  return preloadImages(categoryImages);
};

/**
 * Предзагружает изображения всех продуктов
 */
export const preloadProductImages = (productImages: string[]): Promise<void[]> => {
  return preloadImages(productImages);
}; 