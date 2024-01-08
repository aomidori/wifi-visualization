import { css, cx } from '@emotion/css';

import { useProductsStore } from '#/store/products';

const styles = {
  container: css`
    position: absolute;
    top: 10%;
    right: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 20px;
    margin: 0 auto;
    user-select: none;
    @media (max-width: 768px) {
      padding: 0px;
    }
  `,
  product: css`
    position: relative;
    width: 100px;
    margin: 6px 12px;
    text-align: center;
    font-size: 12px;
    strong, p {
      margin-top: 4px;
    }
    &:hover, &.active {
      cursor: pointer;
      transform: scale(1.1);
    }
    @media (max-width: 768px) {
      font-size: 10px;
    }
  `,
  productImage: css`
    padding: 16px;
    background: #fff;
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.2);
    &:hover,  .active & {
      box-shadow: 0 0 13px 0 rgba(0, 150, 200, 0.4);
    }
    border-radius: 50%;
    margin: auto;
    margin-bottom: 12px;
    width: 40px;
    height: 40px;
    aspect-ratio: 1 / 1;
    background-size: cover;
    background-position: center;
  `,
  badge: css`
    background: #2F2F2F;
    color: #fff;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    position: absolute;
    top: 0px;
    right: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  markerColor: css`
    width: 10px;
    height: 10px;
    border-radius: 50%;
    position: absolute;
    top: 12px;
    left: 12px;
    opacity: 0.5;
  `,
};

export function Products() {
  const products = useProductsStore(state => state.products);
  const activeProduct = useProductsStore(state => state.activeProduct);
  const anchoredProducts = useProductsStore(state => state.anchoredProducts);
  const setActiveProduct = useProductsStore(state => state.setActiveProduct);

  if (!products) return null;

  const getProductCount = (productId: string): number => {
    return anchoredProducts?.filter(p => p.productId === productId).length || 0;
  };

  return (
    <div className={styles.container}>
      {products.map(product => (
        <div 
          key={product.id} 
          className={cx(styles.product, activeProduct === product.id && 'active')}
          onClick={() => setActiveProduct(product.id)}
        >
          {
            getProductCount(product.id) > 0 &&
            <>
              <div className={styles.badge}>{getProductCount(product.id)}</div>
              <div className={styles.markerColor} style={{ backgroundColor: product.markerColor }}></div>
            </>
          }
          <div
            className={styles.productImage}
            style={{ backgroundImage: `url(${product.imageUrl})`}}
          > 
          </div>
          <strong>{product.name}</strong>
          <p>{product.description}</p>
        </div>
      ))}
    </div>
  );
}