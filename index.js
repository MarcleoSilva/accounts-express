import { select } from "@inquirer/prompts"
import chalk from "chalk"

operation()

async function operation() {
    const action = await select({
        message: 'O que deseja fazer',
        choices: [
            { value: "Criar conta" },
            { value: "Consultar saldo" },
            { value: "Depositar" },
            { value: "Sacar" },
            { value: "Sair" },
        ]
    })

    console.log(action)
}