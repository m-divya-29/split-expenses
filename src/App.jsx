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
        flexDirection: "row",
        textAlign: "center",
      }}
    >
      <div class="p-4" style={{}}>
        <h2>Expenses 💰</h2>
        <DynamicList
          transactions={transactions}
          setTransactions={setTransactions}
          clearAll={clearAllTxns}
          people={people}
          setPeople={setPeople}
          class="p-4"
        />
        <Owes
          class="p-4"
          transactions={transactions}
          owes={owes}
          setOwes={setOwes}
        />
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
