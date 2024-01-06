import { useProductsStore } from '#/store/products';
import { css, cx } from '@emotion/css';

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
  `,
  product: css`
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
  `
};

export function Products() {
  const products = useProductsStore(state => state.products);
  const activeProduct = useProductsStore(state => state.activeProduct);
  const setActiveProduct = useProductsStore(state => state.setActiveProduct);

  if (!products) return null;

  return (
    <div className={styles.container}>
      {products.map(product => (
        <div 
          key={product.id} 
          className={cx(styles.product, activeProduct === product.id && 'active')}
          onClick={() => setActiveProduct(product.id)}
        >
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