#! /usr/bin/env node
import { faker } from "@faker-js/faker";
import chalk, { Chalk } from "chalk";
import inquirer from "inquirer";


console.log(chalk.yellow.bold.italic("\t\t*********************WELCOME TO MEHTAB KANWAL'S BANK****************************"));
//customer class
class Customer {
    firstName:string
    lastName:string
    age:number
    gender:string
    mobileNumber:number
    accNumber:number

    constructor (fName:string, lName:string , age:number ,gender:string, mob:number, acc:number) {
        this.firstName=fName
        this.lastName=lName
        this.age=age
        this.gender=gender
        this.mobileNumber=mob
        this.accNumber=acc
    }
}
//interface bankaccount
interface BankAccount {
    accNumber : number,
    balance:number
}
//class bank
class Bank {
    customer:Customer[] = []
    account:BankAccount[]=[]

    addCustomer(obj:Customer){
        this.customer.push(obj);
    }

    addAccountNumber(obj:BankAccount){
        this.account.push(obj);
    }
    transaction(accObj:BankAccount) {
        let newAccounts = this.account.filter(acc => acc.accNumber !== accObj.accNumber);
        this.account = [...newAccounts , accObj];
    };
}
let myBank = new Bank();

//customer create
for(let i:number= 1; i<=3 ; i++) {
    let fName= faker.person.firstName('male');
    let lName= faker.person.lastName();
    let num= parseInt(faker.string.numeric('301-###-####'));
    const cus = new Customer(fName,lName,25*i,"male",num,1000+i);
    myBank.addCustomer(cus);
    myBank.addAccountNumber({accNumber:cus.accNumber , balance:1000*i});
}
//bank functionality
async function bankService(bank:Bank) {
    do{let service = await inquirer.prompt({
        name:"select",
        type:"list",
        message:chalk.bold.redBright("\t\tPlease Select the Service..:"),
        choices:["View Balance", "Cash Withdraw" , "Cash Deposit" , "Exit"]
    })
    if (service.select == "View Balance"){
        let res = await inquirer.prompt({
            type:"input",
            name:"number",
            message:chalk.blue.bold("Please Enter Your Account Number")
        });
        let account = myBank.account.find((acc)=>acc.accNumber == res.number);
        if (!account) {
            console.log(chalk.red.bold("\t\tInvalid Account Number"))
        }
        if(account) {
            let name = myBank.customer.find((item)=>item.accNumber == account?.accNumber)
            console.log(`\t\tDear ${chalk.green.bold(name?.firstName)} ${chalk.green.bold(name?.lastName)} Your Account Balance is ${chalk.bold.blue(`$${account.balance}`)}`);
        }
    }
    if (service.select == "Cash Withdraw"){
        let res = await inquirer.prompt({
            type:"input",
            name:"number",
            message:chalk.blue.bold("Please Enter Your Account Number")
        });
        let account = myBank.account.find((acc)=>acc.accNumber == res.number);
        if (!account) {
            console.log(chalk.red.bold("\t\tInvalid Account Number!!"))
        }
        if (account) {
            let ans = await inquirer.prompt({
                type:"number",
                name:"rupee",
                message:chalk.yellow.bold("Please Enter Your Amount To Withdraw:")
            });
            if (ans.rupee > account.balance) {
                console.log(chalk.red.bold("\t\tInsufficient Balance!!!"))
            }
            let newBalance = account.balance - ans.rupee
            //transaction method
            bank.transaction({accNumber:account.accNumber , balance:newBalance});
            console.log(`\t\tDear Your Account Balance is ${chalk.bold.blue(`$${newBalance}`)}`);
        }
    }
    if (service.select == "Cash Deposit"){
        let res = await inquirer.prompt({
        type:"input",
        name:"number",
        message:chalk.blue.bold("Please Enter Your Account Number")
    });
    let account = myBank.account.find((acc)=>acc.accNumber == res.number);
    if (!account) {
        console.log(chalk.red.bold("\t\tInvalid Account Number!!"))
    }
    if (account) {
        let ans = await inquirer.prompt({
            type:"number",
            name:"rupee",
            message:chalk.yellow.bold("Please Enter Your Amount To Deposit:")
        });
        let newBalance = account.balance + ans.rupee
        //transaction method
        bank.transaction({accNumber:account.accNumber , balance:newBalance});
        console.log(`\t\tDear Your Account Balance is ${chalk.bold.blue(`$${newBalance}`)}`);``
    }}
    if (service.select== "Exit") {
        console.log(chalk.magenta.bold.italic("\t\t**************Thank You For Visiting Mehtab Kanwal Bank..Have a Good Day******************")) ;
        process.exit();
        }
        
}
    while(true)
}
bankService(myBank)