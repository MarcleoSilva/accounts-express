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
        } else if(answer === "Consultar saldo") {
            checkBalance()
        }
    }).catch((err) => console.log(err))
}

async function checkBalance() {
    const accounts = loadAccounts()

    if (accounts.length === 0) {
        console.log(chalk.red('\nNenhuma conta cadastrada.'))
        return
    }

    const email = await input({ message: 'Email da conta:' })
    const account = accounts.find((acc) => acc.email === email)

    if (!account) {
        console.log(chalk.red(`\nConta com email "${email}" não encontrada.`))
        return
    }

    console.log(chalk.green(`\nSaldo da conta ${email}: `) + chalk.bgGreen.black(` R$ ${account.balance.toFixed(2)} `))
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