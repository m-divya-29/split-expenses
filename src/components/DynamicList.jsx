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
    <div className="space-y-4">
      <div>
        <div className="p-4">
          {transactions.length === 0 && (
            <p className="text-gray-700 leading-relaxed">
              No expenses added yet.
              <button
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                onClick={() => addNewTransaction()}
              >
                Add
              </button>
            </p>
          )}
          {transactions.map((txn, index) => (
            <div
              className="p-4 mb-4 border border-gray-200 rounded flex flex-wrap items-center gap-2"
              key={index}
            >
              <input
                type="text"
                placeholder="Description"
                value={txn.description}
                onChange={(e) =>
                  handleTransactionChange(index, "description", e.target.value)
                }
                className="flex-grow rounded border-gray-300 shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-300"
              />
              <input
                type="number"
                placeholder="Amount"
                value={txn.amount}
                onChange={(e) =>
                  handleTransactionChange(index, "amount", e.target.value)
                }
                className={`w-24 rounded border-gray-300 shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-300 ${
                  !txn.amount ? "input-error" : ""
                }`}
              />
              <select
                value={txn.paidBy}
                onChange={(e) =>
                  handleTransactionChange(index, "paidBy", e.target.value)
                }
                className={`w-32 rounded border-gray-300 shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-300 ${
                  !txn.paidBy || txn.paidBy === "" ? "select-error" : ""
                }`}
              >
                <option value="" className="">
                  Paid By
                </option>
                {people.map((person) => (
                  <option key={person} value={person}>
                    {person}
                  </option>
                ))}
              </select>
              {people.length > 0 && (
                <div className="mt-2">
                  <strong className="block mb-1">Split between</strong>
                  <div className="flex flex-wrap gap-2">
                    {people.map((person) => (
                      <label
                        key={person}
                        className="inline-flex items-center space-x-2 text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={txn.splitBetween?.includes(person) || false}
                          onChange={() => toggleSplit(index, person)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        {person}
                      </label>
                    ))}
                  </div>
                </div>
              )}
              <button
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                onClick={() => addNewTransaction()}
              >
                Add
              </button>
              <button
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 text-sm"
                onClick={() => removeTransaction(index)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
