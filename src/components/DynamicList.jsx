import { useEffect, useState } from "react";
import { TRANSACTIONS_STR } from "../utils/Constants";

export default function DynamicList({
  transactions,
  setTransactions,
  clearAll,
  people,
  setPeople,
}) {
  useEffect(() => {
    localStorage.setItem(TRANSACTIONS_STR, JSON.stringify(transactions));
  }, [transactions]);

  function handleTransactionChange(index, field, value) {
    const newTxns = [...transactions];
    newTxns[index][field] = value;
    setTransactions(newTxns); // since newInputs is a new object, React triggers a re-render.
    console.log(newTxns);
    localStorage.setItem(TRANSACTIONS_STR, JSON.stringify(transactions));
  }

  function toggleSplit(index, person) {
    const newTxns = [...transactions];
    const splitList = newTxns[index].splitBetween;
    if (splitList.includes(person)) {
      newTxns[index].splitBetween = splitList.filter((p) => p !== person);
    } else {
      newTxns[index].splitBetween = [...splitList, person];
    }
    setTransactions(newTxns);
    localStorage.setItem(TRANSACTIONS_STR, JSON.stringify(transactions));
  }
  function addNewTransaction() {
    const newTxns = [
      ...transactions,
      {
        description: "",
        amount: "",
        paidBy: "",
        splitBetween: "",
      },
    ];
    setTransactions(newTxns);
    localStorage.setItem(TRANSACTIONS_STR, JSON.stringify(transactions));
  }
  function removeTransaction(index) {
    const newTxns = transactions.filter((_, i) => i != index);
    setTransactions(newTxns);
    localStorage.setItem(TRANSACTIONS_STR, JSON.stringify(transactions));
  }
  function clearAllTxns() {
    clearAll();
  }
  return (
    <div class="p-4 ">
      {transactions.length === 0 && (
        <p class="text-gray-700 leading-relaxed">No expenses added yet.</p>
      )}
      {transactions.map((txn, index) => (
        <div class="p-4 " key={index}>
          <input
            type="text"
            placeholder="Description"
            value={txn.description}
            onChange={(e) =>
              handleTransactionChange(index, "description", e.target.value)
            }
             
          />
          <input
            type="number"
            placeholder="Amount"
            value={txn.amount}
            onChange={(e) =>
              handleTransactionChange(index, "amount", e.target.value)
            }
            className={!txn.amount ? "input-error" : ""}
             
          />

          <select
            value={txn.paidBy}
            onChange={(e) =>
              handleTransactionChange(index, "paidBy", e.target.value)
            }
            className={!txn.paidBy || txn.paidBy === "" ? "select-error" : ""}
             
          >
            <option value="" className="">
              {" "}
              Paid By{" "}
            </option>
            {people.map((person) => (
              <option key={person} value={person}>
                {person}
              </option>
            ))}
          </select>

          <div class="p-4 ">
            <strong>Split between</strong>
            <div>
              {people.map((person) => (
                <label key={person} class="inline-flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={txn.splitBetween.includes(person)} // instead of value, checked for input type checkbox
                    onChange={() => toggleSplit(index, person)}
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  {person}
                </label>
              ))}
            </div>
          </div>
          <button
            
            onClick={() => removeTransaction(index)}
          >
            {" "}
            Remove Expense{" "}
          </button>
        </div>
      ))}
      <button
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        onClick={() => addNewTransaction()}
      >
        {" "}
        Add Expense{" "}
      </button>
      <button
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        onClick={() => clearAllTxns()}
      >
        Clear All
      </button>
    </div>
  );
}
