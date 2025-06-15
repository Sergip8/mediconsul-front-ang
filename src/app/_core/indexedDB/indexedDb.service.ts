
import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { CartProduct } from '../../models/product';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private dbName = 'Cart';
  private objectStoreName = 'cart_items';

  constructor(private dbService: NgxIndexedDBService) {}

  async getCart() {
    // const cart = this.dbService.getAll(this.objectStoreName, );
    // if (!cart) {
    //   return { cartId: 'cart', items: [] }; // Valor inicial si el carrito no existe
    // }
    // return cart;
  }

  async saveCart(cart: {items: CartProduct[] }) {
    this.dbService.update(this.objectStoreName, cart,).subscribe({
        
    });
  }
}