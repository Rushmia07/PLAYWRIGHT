class loginPage{

constructor(page){
    this.page=page
    this.username="//input[@id='user-name']"
    this.password="//input[@id='password']"
    this.loginbutton="//input[@id='login-button']"

}
async ValidloginToApplication()
{
    await this.page.fill(this.username,"standard_user")
    await this.page.fill(this.password,"secret_sauce")
    await this.page.click(this.loginbutton)

}

async InvalidloginToApplication()
{
    await this.page.fill(this.username,"standard_user1")
    await this.page.fill(this.password,"secret_sauce2")
    await this.page.click(this.loginbutton)

}

}
module.exports=loginPage