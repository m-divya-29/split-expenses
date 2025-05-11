import { useState } from "react";
import "./App.css";
import DynamicList from "./components/DynamicList";
import { TRANSACTIONS_STR } from "./utils/Constants";
import { useEffect } from "react";
import Owes from "./components/Owes";
import People from "./components/People";
import "./tailwind.css";

function App() {
  const [people, setPeople] = useState(() => {
    const saved = localStorage.getItem("people");
    return saved ? JSON.parse(saved) : [];
  });

  const newTransaction = {
    description: "",
    amount: "",
    paidBy: "",
    splitBetween: [],
  };
  function clearAllTxns() {
    localStorage.setItem(TRANSACTIONS_STR, [newTransaction]);
    localStorage.removeItem("owes");
    setTransactions([newTransaction]);
    setOwes(null);
  }
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem(TRANSACTIONS_STR);
    if (saved != null) {
      return JSON.parse(saved);
    }
    return [newTransaction];
  });
  const [owes, setOwes] = useState(() => {
    const saved = localStorage.getItem("owes");
    return saved ? JSON.parse(saved) : null;
  });
  useEffect(() => {
    localStorage.setItem("people", JSON.stringify(people));
  }, [people]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "left",
        alignItems: "center",
        flexDirection: "column", // Changed to column
        textAlign: "center",
      }}
    >
      <div className="p-4" style={{}}>
        <h2>Expenses 💰</h2>
        <DynamicList
          transactions={transactions}
          setTransactions={setTransactions}
          clearAll={clearAllTxns}
          people={people}
          setPeople={setPeople}
          className="p-4"
        />
        <Owes
          className="p-4"
          transactions={transactions}
          owes={owes}
          setOwes={setOwes}
        />
      </div>
      <div className="mt-4">
        {(transactions.length > 0 ||
          (owes && Object.keys(owes).length > 0)) && (
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400"
            onClick={() => clearAllTxns()}
          >
            Clear All
          </button>
        )}
      </div>
      <People
        people={people}
        setPeople={setPeople}
        transactions={transactions}
        setTransactions={setTransactions}
      />
    </div>
  );
}

export default App;
