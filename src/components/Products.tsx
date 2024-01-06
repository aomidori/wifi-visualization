import { useProductsStore } from "#/store/products";
import { css } from "@emotion/css";

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
    margin: 20px;
    text-align: center;
    font-size: 12px;
    strong, p {
      margin-top: 4px;
    }
  `,
  productImage: css`
    padding: 16px;
    background: #fff;
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.2);
    border-radius: 50%;
    margin: auto;
    margin-bottom: 12px;
    width: 40px;
    height: 40px;
    background-size: cover;
    background-position: center;
  `
};

export function Products() {
  const products = useProductsStore(state => state.products);
  if (!products) return null;
  return (
    <div className={styles.container}>
      {products.map(product => (
        <div key={product.id} className={styles.product}>
          <div
            className={styles.productImage}
            style={{ backgroundImage: `url(${product.imageUrl})`}}
          > 
          </div>
          <strong>{product.name}</strong>
          <p>{product.price}</p>
        </div>
      ))}
    </div>
  );
}