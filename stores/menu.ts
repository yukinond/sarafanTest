import { defineStore } from 'pinia'
import { useMPChange } from './mpChange'

export const useMenuStore = defineStore('menu', {
  state: () => ({
    menu: [] as any,
    cart: [] as any,
  }),
  actions: {
    async getMenu() {
      try {
        const { error, data } = await useFetch('/api/menu/getMenu', {
          method: 'GET',
          watch: false,
        })

        if (data.value) {
          this.setMenu(data.value.menu)
        }
        if (error.value) {
          return
        }
      } catch (error) {
        console.error('Ошибка при получение данных:', error)
        return
      }
    },
    async getProduct(uuid: any) {
      try {
        const { error, data } = await useFetch('/api/menu/getProduct', {
          method: 'GET',
          query: { uuid: uuid },
          watch: false,
        })

        if (data.value) {
          return data.value
        }
        if (error.value) {
          return
        }
      } catch (error) {
        console.error('Ошибка при получение данных:', error)
        return
      }
    },
    setMenu(menu: any) {
      this.menu = menu
    },
    addToCart(product: any) {
      const existingProduct = this.cart.find((item: any) =>
        item.uuid === product.uuid &&
        item.cooking[0]?.uuid === product.cooking[0]?.uuid
      );

      if (existingProduct) {
        existingProduct.count++;
      } else {
        product.count = 1;
        product.totalPrice = product.cooking[0]?.price ? ( parseInt(product.price) + parseInt(product.cooking[0]?.price)) : parseInt(product.price);
        this.cart.push({ ...product }); 
      }
    },
    removeProduct(uuid: any) {
      this.cart.splice(this.cart.findIndex((item: any) => item.uuid === uuid), 1)
    },
    clearCart() {
      this.cart = []
    }
  },
  persist: {
    storage: persistedState.localStorage,
  },
})
