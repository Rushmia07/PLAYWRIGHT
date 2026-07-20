class homepage{

constructor(page){
  this.page=page
  this.menuButton="//button[@id='react-burger-menu-btn']"
  this.logoutLink="//a[@id='logout_sidebar_link']"

}

async logout(){

await this.page.click(this.menuButton)
await this.page.click(this.logoutLink)

}


}
module.exports=homepage
