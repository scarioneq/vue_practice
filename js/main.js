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

Vue.component('product-tabs', {
    template: `
        <div>   
            <ul>
                <span
                    class="tab"
                    :class="{ activeTab: selectedTab === tab }"
                    v-for="(tab, index) in tabs"
                    :key="index"
                    @click="selectedTab = tab"
                >{{ tab }}</span>
            </ul>

            <div v-show="selectedTab === 'Reviews'">
                <p v-if="!reviews.length">There are no reviews yet.</p>
                <ul>
                    <li v-for="(review, index) in reviews" :key="index">
                        <p>{{ review.name }}</p>
                        <p>Rating: {{ review.rating }}</p>
                        <p>{{ review.review }}</p>
                        <p>Recommend: {{ review.recommend }}</p>
                    </li>
                </ul>
            </div>

            <div v-show="selectedTab === 'Make a Review'">
                <product-review></product-review>
            </div>

            <div v-show="selectedTab === 'Shipping'">
                <p>Shipping cost: {{ shipping }}</p>
            </div>

            <div v-show="selectedTab === 'Details'">
                <ul>
                    <li v-for="(detail, index) in details" :key="index">{{ detail }}</li>
                </ul>
            </div>
        </div>
    `,
    data() {
        return {
            tabs: ['Reviews', 'Make a Review', 'Shipping', 'Details'],
            selectedTab: 'Reviews'
        }
    },
    props: {
        reviews: {
            type: Array,
            required: false
        },
        shipping: {
            type: String,
            required: false
        },
        details: {
            type: Array,
            required: false
        }
    }
})

Vue.component('product-review', {
    template: `
    <div>
    <div v-if="errors.length">
      <p><b>Please correct the following error(s):</b></p>
      <ul>
        <li v-for="error in errors" :key="error">{{ error }}</li>
      </ul>
    </div>
    <form class="review-form" @submit.prevent="onSubmit">
    
 <p>
   <label for="name">Name:</label>
   <input id="name" v-model="name" placeholder="name">
 </p>

 <p>
   <label for="review">Review:</label>
   <textarea id="review" v-model="review"></textarea>
 </p>

 <p>
   <label for="rating">Rating:</label>
   <select id="rating" v-model.number="rating">
     <option>5</option>
     <option>4</option>
     <option>3</option>
     <option>2</option>
     <option>1</option>
   </select>
 </p>
<p>Would you recommend this product?</p>
        <p>
          <label>
            <input type="radio" value="yes" v-model="recommend"> Yes
          </label>
          <label>
            <input type="radio" value="no" v-model="recommend"> No
          </label>
        </p>

 <p>
   <input type="submit" value="Submit"> 
 </p>

</form>
</div>
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            recommend: null,
            errors: []
        }
    },
    methods: {
        onSubmit() {
            if(this.name && this.review && this.rating) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    recommend: this.recommend
                }
                eventBus.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
                this.recommend = null
            } else {
                if(!this.name) this.errors.push("Name required.")
                if(!this.review) this.errors.push("Review required.")
                if(!this.rating) this.errors.push("Rating required.")
                if (!this.recommend) this.errors.push("Recommendation required.")
            }
        }
    }
})

Vue.component('product', {
    props: {
      premium: {
          type: Boolean,
          required: true,
      },

      cart: {
          type: Array,
          required: false
        }
    },
    template: `
     <div class="product">

        <div class="product-image" :style="{ filter: isSoldOut ? 'grayscale(100%)' : 'none' }">
            <img v-bind:alt="altText" v-bind:src="image"/>
        </div>
        <div class="product-info">
            <h1>{{ title }}</h1>
            <p> {{ description }}</p>
            <a v-bind:href="link">More products like this</a>
            <p v-if="inStock">In stock</p>
            <p v-else :class="{ outOfStock: !inStock }" >Out of stock</p>
            <span v-show="onSale">{{sale}}</span>
            <span v-if="!isSoldOut">
                {{ variants[selectedVariant].variantQuantity }} штук
            </span>
            <span v-else>
                РАСПРОДАНО
            </span>
     
            <div
                class="color-box"
                v-for="(variant, index) in variants"
                :key="variant.variantId"
                :style="{ backgroundColor:variant.variantColor }"
                @mouseover="updateProduct(index)"
            >
            </div>
            <p>Цена: {{ variants[selectedVariant].cost }} руб.</p>
           

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
        <div>
       
</div>
           <product-tabs
                :reviews="reviews"
                :shipping="shipping"
                :details="details"
            >
            
            </product-tabs>

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
                        cost: 50,
                    },
                    {
                        variantId: 2235,
                        variantColor: 'blue',
                        variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                        variantQuantity: 1,
                        cost: 25
                    }
                ],
                sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
                reviews: []



        }
    },
    methods: {
        addToCart() {
            if (this.variants[this.selectedVariant].variantQuantity > 0) {
                    this.variants[this.selectedVariant].variantQuantity -= 1;
                    this.$emit('add-to-cart',
                    this.variants[this.selectedVariant].variantId, this.variants[this.selectedVariant].cost);
            } else {

            }
        },
        deleteFromCart() {
            if (this.cart.length !== 0) {
                this.variants[this.selectedVariant].variantQuantity += 1;
                this.$emit('delete-to-cart', this.variants[this.selectedVariant].variantId, this.variants[this.selectedVariant].cost);
            }
        },
        updateProduct(index) {
            this.selectedVariant = index;
        }
    },
    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview)
        })
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
        },
        isSoldOut() {
            return this.variants[this.selectedVariant].variantQuantity === 0;
        }
    }
})
let eventBus = new Vue()

let app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: [],
        totalCost: 0,
    },

    methods: {
        updateCart(id, cost) {
            this.cart.push(id);
            this.totalCost += cost;
        },

        removeFromCart(id, cost) {

            for (let i = 0; i < this.cart.length; i++) {
                if (this.cart[i] === id) {
                    this.cart.splice(i, 1);
                    this.totalCost -= cost;
                    break;
                }
            }

        }
    }
})

