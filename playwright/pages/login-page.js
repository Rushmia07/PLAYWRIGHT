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
async CaseSensitiveApplication()
{
    await this.page.fill(this.username,"STANDARD_USER")
    await this.page.fill(this.password,"SECRECT_SAUCE")
    await this.page.click(this.loginbutton)

}
async PasswordrequiredValidation()
{
    await this.page.fill(this.username,"standard_user1")
     await this.page.fill(this.password,"")
    await this.page.click(this.loginbutton)

}
async UsernamerequiredValidation()
{
    await this.page.fill(this.username,"")
     await this.page.fill(this.password,"secret_sauce")
    await this.page.click(this.loginbutton)

}
async InvalidUserNameValidation()
{
    await this.page.fill(this.username,"standard_user67")
     await this.page.fill(this.password,"secret_sauce")
    await this.page.click(this.loginbutton)

}
async locked_out_userloginToApplication()
{
    await this.page.fill(this.username,"locked_out_user")
    await this.page.fill(this.password,"secret_sauce")
    await this.page.click(this.loginbutton)

}

async EmptyloginToApplication()
{

    await this.page.click(this.loginbutton)

}

async KeyboardValidloginToApplication()
{
    await this.page.fill(this.username,"standard_user")
    await this.page.press(this.username,"Tab")
    await this.page.fill(this.password,"secret_sauce")
    await this.page.press(this.password,"Enter")

}

async KeyboardInvalidloginToApplication()
{
    await this.page.fill(this.username,"standard_user1")
    await this.page.fill(this.password,"secret_sauce2")
    await this.page.press(this.password,"Enter")

}

async KeyboardEnterFromUsernameField()
{
    await this.page.fill(this.username,"standard_user")
    await this.page.fill(this.password,"secret_sauce")
    await this.page.press(this.username,"Enter")

}

async TabNavigationloginToApplication()
{
    await this.page.click(this.username)
    await this.page.keyboard.type("standard_user")
    await this.page.keyboard.press("Tab")
    await this.page.keyboard.type("secret_sauce")
    await this.page.keyboard.press("Tab")
    await this.page.keyboard.press("Enter")

}

async KeyboardEmptyloginToApplication()
{
    await this.page.click(this.username)
    await this.page.keyboard.press("Enter")

}

}
module.exports=loginPage