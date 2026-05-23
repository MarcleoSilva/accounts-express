import { select, input, number } from "@inquirer/prompts"
import chalk from "chalk"
import fs from "fs"

const ACCOUNTS_FILE = "accounts.json"

function loadAccounts() {
    if (!fs.existsSync(ACCOUNTS_FILE)) return []
    const data = fs.readFileSync(ACCOUNTS_FILE, "utf-8")
    return JSON.parse(data)
}

function saveAccounts(accounts) {
    fs.writeFileSync(ACCOUNTS_FILE, JSON.stringify(accounts, null, 2))
}

operation()

function operation() {
    const action = select({
        message: 'O que deseja fazer',
        choices: [
            { value: "Criar conta" },
            { value: "Consultar saldo" },
            { value: "Depositar" },
            { value: "Sacar" },
            { value: "Sair" },
        ]
    })
    .then((answer) => {
        if(answer === "Criar conta") {
            createAccount()
        }
    }).catch((err) => console.log(err))
}

async function createAccount() {
    console.log(chalk.bgGreen.black('Parabéns por escolher nosso banco!!'))
    console.log(chalk.green('Defina as opções a seguir:'))

    const accounts = loadAccounts()
    const email = await input({ message: 'Email da conta:' })

    if (accounts.some((acc) => acc.email === email)) {
        console.log(chalk.red(`\nErro: já existe uma conta com o email "${email}".`))
        return
    }

    const balance = await number({ message: 'Saldo inicial (R$):', default: 0 })

    const account = { email, balance }
    accounts.push(account)
    saveAccounts(accounts)
    console.log(chalk.green(`\nConta criada com sucesso!`))
    console.log(account)

    return account
}