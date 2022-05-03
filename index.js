const puppeteer = require('puppeteer') 
const express = require('express') 
const fs = require('fs'); 
const port = 8090;
const app = express();
app.use(express.json())

/*RESPOSTA
//VALID
Insira o código de segurança
Você esqueceu sua senha?


//NENHUM USUARIO
Cadastre-se para abrir uma conta.
Encontre sua conta.
*/


//APLICAÇÃO
app.get('/app/:user', (req, res)=>{

    (async ()=>{
        const browser = await puppeteer.launch({headless: false})
        const page = await browser.newPage();
        await page.goto('https://mbasic.facebook.com/login/?email='+req.params.user);
        await page.waitForTimeout(1000);
        await page.click('[name="pass"]');
        await page.click('[name="login"]');
        const html = await page.$('body')
        const codehtml = await page.evaluate(body => body.innerHTML, html);
        if(codehtml.includes('Insira o código de segurança') !== false || codehtml.includes('Você esqueceu sua senha?') !== false || codehtml.includes('Tente novamente usando outras informações de login') !== false) {
            var status = 400;
        }
        else if(codehtml.includes('Cadastre-se para abrir uma conta') !== false || codehtml.includes('Encontre sua conta') !== false){
            var status = 500;
        }
        else {var status = 502;}

        await browser.close();
        return res.send(JSON.stringify({status: status}))

    })();

})







//RODANDO APLICAÇÃO
app.listen(port, ()=>{
    console.log(`
    Está Aplicação está rodando na url http://localhost:${port}
    `)
})