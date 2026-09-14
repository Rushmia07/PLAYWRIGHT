class CheckoutPage{

constructor(page){
    this.page=page
    this.firstname="//input[@id='first-name']"
    this.lastname="//input[@id='last-name']"
    this.postalcode="//input[@id='postal-code']"
    this.continue="//input[@id='continue']"
    this.checkoutButton="//button[@id='checkout']"
    this.cancelButton="//button[@id='cancel']"
    this.error="h3[data-test='error']"
    this.dismiss="//button[@aria-label='Dismiss error']"

}

async cancel(){
await this.page.click(this.cancelButton)
}
async checkout(){
await this.page.click(this.checkoutButton)
}
async noinput(){
 await this.page.click(this.continue) 

}
async onlyfirstnameinput()
{
    await this.page.fill(this.firstname,"standard_user")
    await this.page.click(this.continue)

}
async firstLastnameinput()
{
    await this.page.fill(this.firstname,"standard_user")
    await this.page.fill(this.lastname,"standard_user")
    await this.page.click(this.continue)

}
async allinput()
{
    await this.page.fill(this.firstname,"standard_user")
    await this.page.fill(this.lastname,"standard_user")
    await this.page.fill(this.postalcode,"1219")
    await this.page.click(this.continue)

}}
module.exports=CheckoutPage