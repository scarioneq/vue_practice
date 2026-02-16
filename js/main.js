Vue.component('product-details', {
    props: {
        details: {
            type: Array,
            required: true
        }
    },
    template: `
        <ul>
            <li v-for="detail in details">{{ detail }}</li>
        </ul>
    `
})

Vue.component('product', {
    props: {
      premium: {
          type: Boolean,
          required: true,
      }
    },
    template: `
     <div class="product">

        <div class="product-image">
            <img v-bind:alt="altText" v-bind:src="image"/>
        </div>
        <div class="product-info">
            <h1>{{ title }}</h1>
            <p> {{ description }}</p>
            <a v-bind:href="link">More products like this</a>
            <p v-if="inStock">In stock</p>
            <p v-else :class="{ outOfStock: !inStock }" >Out of stock</p>
            <span v-show="onSale">{{sale}}</span>
            <product-details :details="details"></product-details>
            <p>Shipping: {{shipping}}</p>

            <div
                class="color-box"
                v-for="(variant, index) in variants"
                :key="variant.variantId"
                :style="{ backgroundColor:variant.variantColor }"
                @mouseover="updateProduct(index)"
            >
            </div>

            <div>
                <ul>
                    <li v-for="size in sizes">{{ size }}</li>
                </ul>
            </div>
            
            <button
                v-on:click="addToCart"
                :disabled="!inStock"
                :class="{ disabledButton: !inStock }"
            >
                Add to cart
            </button>
            <button v-on:click="deleteFromCart">Delete from cart</button>
        </div>
    </div>`,
    data() {
        return {
                product: "Socks",
                description: "A pair of warm, fuzzy socks.",
                brand: 'Vue Mastery',
                selectedVariant: 0,
                altText: "A pair of socks",
                link: "https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks",
                onSale: true,
                details: ['80% cotton', '20% polyester', 'Gender-neutral'],
                variants: [
                    {
                        variantId: 2234,
                        variantColor: 'green',
                        variantImage: "./assets/vmSocks-green-onWhite.jpg",
                        variantQuantity: 10,
                    },
                    {
                        variantId: 2235,
                        variantColor: 'blue',
                        variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                        variantQuantity: 1,
                    }
                ],
                sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],


        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart',
            this.variants[this.selectedVariant].variantId);
        },
        deleteFromCart() {
            this.$emit('delete-to-cart',
                this.variants[this.selectedVariant].variantId);
        },
        updateProduct(index) {
            this.selectedVariant = index;
        },
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity;
        },
        sale() {
            if (this.onSale) {
                return 'Идет распродажа ' + this.brand + ' ' + this.product;
            }
        },
        shipping() {
            if (this.premium) {
                return "Free";
            } else {
                return 2.99
            }
        }
    }
})

let app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: [],
    },
    methods: {
        updateCart(id) {
            this.cart.push(id);
            console.log(this.cart);
        },
        removeFromCart(id) {
            for (let i = 0; i < this.cart.length; i++) {
                if (this.cart[i] === id) {
                    this.cart.splice(i, 1);
                    break;
                }
            }
            console.log(this.cart);
        }
    }
})

