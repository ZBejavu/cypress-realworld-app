import express from "express";
const router = express.Router();

import {
    getAllUsers,
    createUser,
    updateUserById,
    getUserById,
    getAllForEntity,
    getUserByUsername,
    searchUsers,
    removeUserFromResults,
    getAllTransactions,
  } from "./database";
  import { User } from "../src/models/user";
  import { Transaction } from "../src/models/transaction";
  import { ensureAuthenticated, validateMiddleware } from "./helpers";
  import { isWithinInterval } from "date-fns";
  import {
    shortIdValidation,
    searchValidation,
    userFieldsValidator,
    isUserValidator,
  } from "./validators";


router.get("/allYearsTransactions", ensureAuthenticated, (req, res) => {
    /* istanbul ignore next */
    let transactions: Transaction[] = getAllTransactions();
    const timeNow:Date = new Date()
    const thirtyDaysInMiliSeconds = 2592000000 // 1(ms) * 1000(1s) * 60(60s) *60(60m) * 24(24hrs) * 30(days)
    let month = Number(timeNow.getMonth()+1);
    let monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let orderedMonths:string[] = [];
    let arr:Number[] = [];
    for(let i = 0; i< 12; i++){
        arr.push(month);
        orderedMonths.push(monthNames[month-1]);
        month = month>1 ? month-1 : 12;
    }
    let transactionsMonthArr:[Transaction[]] = [[]];
    for(let i = 0; i<arr.length; i++){
        const monthToInsert = transactions.filter((transaction) => {
            const transactionDate = new Date(transaction.createdAt);
            const thisYear = timeNow.getFullYear();
            const thisMonth = Number(timeNow.getMonth()+1);
            const transactionYear = transactionDate.getFullYear();
            const transactionMonth = Number(transactionDate.getMonth()+1)
            const isNotInRange:Boolean = (transactionMonth <= thisMonth && transactionYear !== thisYear)
            return (transactionMonth === arr[i] && !isNotInRange );
        });
        //transactionsMonthArr.push(monthToInsert)
        if(i === 0){
            transactionsMonthArr = [monthToInsert];
        }else{
            transactionsMonthArr.push(monthToInsert)
        }
    }
    const sumOfTransactionsPerMonth = transactionsMonthArr.map((transactions,i) => {
        if(transactions.length === 0){
            return [orderedMonths[i], 0, 0];
        }else{
            let sum = 0;
            transactions.forEach(transaction =>{
                sum+= transaction.amount;
            })

            return [orderedMonths[i], sum, sum/transactions.length];
        }
    })

    //const oneMonthBack = transactions.filter(transaction => (timeNow - new Date(transaction.createdAt).getTime() < thirtyDaysInMiliSeconds) )
    res.status(200).json({ results: sumOfTransactionsPerMonth });
  });


export default router;