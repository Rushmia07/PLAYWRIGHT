class CartPage {

    constructor(page) {
        this.page = page;
        this.title = '.title';
        this.cartLink = '.shopping_cart_link';
        this.cartBadge = '.shopping_cart_badge';
        this.productCard = '.inventory_item';
        this.productName = '.inventory_item_name';
        this.cartItemName = '.cart_item .inventory_item_name';
        this.productDesc = '.inventory_item_desc';
        this.productPrice = '.inventory_item_price';
        this.cartItemPrice = '.cart_item .inventory_item_price';
        this.productImage = '.inventory_item_img img';
        this.addToCartButton = '.btn_primary';
        this.inventoryButton = '.btn_inventory';
        this.continueButton="//button[@id='continue-shopping']";
        this.checkoutButton="//button[@id='checkout']"
    }
    getPrice(){
        return this.page.locator(this.productPrice)
    }

    getCartItemPrice(){
        return this.page.locator(this.cartItemPrice)
    }
    getCheckout(){
        return this.page.locator(this.checkoutButton);
    }
    getContinue(){
        return this.page.locator(this.continueButton);
    }
    getTitle() {
        return this.page.locator(this.title);
    }

    getCartLink() {
        return this.page.locator(this.cartLink);
    }

    getCartBadge() {
        return this.page.locator(this.cartBadge);
    }

    getProductCards() {
        return this.page.locator(this.productCard);
    }

    getProductCard(index) {
        return this.page.locator(this.productCard).nth(index);
    }

    getProductNames() {
        return this.page.locator(this.productName);
    }

    getCartItemNames() {
        return this.page.locator(this.cartItemName);
    }

    getProductDescriptions() {
        return this.page.locator(this.productDesc);
    }

    getProductPrices() {
        return this.page.locator(this.productPrice);
    }

    getProductImages() {
        return this.page.locator(this.productImage);
    }

    getAddToCartButtons() {
        return this.page.locator(this.addToCartButton);
    }
    
    getInventoryButtons() {
        return this.page.locator(this.inventoryButton);
    }

    getAddToCartButton(productSlug) {
        return this.page.locator(`[data-test="add-to-cart-${productSlug}"]`);
    }

    getRemoveButton(productSlug) {
        return this.page.locator(`[data-test="remove-${productSlug}"]`);
    }



    async addToCart(productSlug) {
        await this.page.click(`[data-test="add-to-cart-${productSlug}"]`);
    }

    async removeFromCart(productSlug) {
        await this.page.click(`[data-test="remove-${productSlug}"]`);
    }

    async openCart() {
        await this.page.click(this.cartLink);
    }
}

module.exports = CartPage;