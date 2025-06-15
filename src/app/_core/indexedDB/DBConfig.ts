import Dexie, { Table } from 'dexie';
import { Cart, CartProduct } from '../../models/product';



export class AppDB extends Dexie {
  cart!: Table<Cart, number>;
  

  constructor() {
    super('cart_db');
    this.version(1).stores({
      cart: 'cartId',
      
    });
  }

  async obtenerCarrito(cartId: number): Promise<Cart | undefined> {
    return await db.cart.get(cartId);
  }
  async guardarCarrito(carrito: Cart): Promise<number> {
    return await db.cart.put(carrito);
  }
}

export const db = new AppDB();