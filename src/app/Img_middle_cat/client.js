'use client';

import './page.css';

const PRODUCTS = [
  {
    id: 1,
    title: 'A Pretty Pink Bouquet',
    subtitle: 'CONGRATULATION',
    price: '£16.00',
    img: 'https://picsum.photos/400/400?1'
  },
  {
    id: 2,
    title: 'Beauty Calla Lily Bouquet',
    subtitle: 'FAMILY FLOWERS',
    oldPrice: '£16.00',
    price: '£12.00',
    img: 'https://picsum.photos/400/400?2',
    sale: true
  },
  {
    id: 3,
    title: 'Blooming Cheerful Wishes',
    subtitle: 'CONGRATULATION',
    price: '£16.00',
    img: 'https://picsum.photos/400/400?3'
  },
  {
    id: 4,
    title: 'White Elegance',
    subtitle: 'WEDDING',
    price: '£22.00',
    img: 'https://picsum.photos/400/400?4'
  },
  {
    id: 5,
    title: 'Springtime Joy',
    subtitle: 'FAMILY FLOWERS',
    price: '£19.00',
    img: 'https://picsum.photos/400/400?5'
  }
];

export default function ProductsPage() {
  return (
    <section className="products-section">
      <div className="products-header">
        <h2>BOUQUETS</h2>
        <p>Veritatis et quasi architecto beatae vitae dicta sunt explicabo</p>
      </div>

      <div className="products-grid">
        {PRODUCTS.map(product => (
          <div key={product.id} className="product-card">
            {product.sale && <span className="sale-badge">SALE!</span>}
            <img src={product.img} alt={product.title} />

            <div className="product-info">
              <h3>{product.title}</h3>
              <p className="subtitle">{product.subtitle}</p>
              <div className="price-wrap">
                {product.oldPrice && <span className="old-price">{product.oldPrice}</span>}
                <span className="price">{product.price}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
