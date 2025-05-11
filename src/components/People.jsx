import { useState } from "react";
export default function People({
  people,
  setPeople,
  transactions,
  setTransactions,
}) {
  const [newPerson, setNewPerson] = useState("");
  function addPerson() {
    const name = newPerson.trim();
    if (!name || people.includes(name)) return;
    const updated = [...people, name];
    setPeople(updated);
    setNewPerson("");
    localStorage.setItem("people", JSON.stringify(updated));
  }

  function removePerson(name) {
    const isInvolved = transactions.some((txn) =>
      txn.splitBetween.includes(name)
    );
    const isPayer = transactions.some((txn) => txn.paidBy === name);
    if (isInvolved || isPayer) {
      const confirmed = window.confirm(
        `${name} is involved in one or more transactions. Are you sure you want to remove them? This will also remove them from those transactions.`
      );
      if (!confirmed) return;
    }
    const updated = people.filter((p) => p !== name);
    setPeople(updated);
    localStorage.setItem("people", JSON.stringify(updated));

    // Remove from all transactions
    const updatedTxns = transactions.map((t) => ({
      ...t,
      splitBetween: t.splitBetween.filter((p) => p !== name),
    }));
    setTransactions(updatedTxns);
    localStorage.setItem("transactions", JSON.stringify(updatedTxns));
  }

  function countInvolvement(name) {
    let count = 0;

    transactions.forEach((txn) => {
      if (txn.paidBy === name || txn.splitBetween.includes(name)) {
        count++;
      }
    });

    return count;
  }
  function countInvolvementBreakdown(name) {
    let involvedCount = 0;
    let paidCount = 0;

    transactions.forEach((txn) => {
      if (txn.paidBy === name) paidCount++;
      if (txn.involved.includes(name)) involvedCount++;
    });

    return { involvedCount, paidCount };
  }

  return (
    <div class="">
      <h3>People 👥</h3>
      <ul style={{justifyContent: "left", textAlign: "left"}}>
        {people.map((p) => {
          const count = countInvolvement(p);
          return (
            <li  key={p}>
              <strong>{p} </strong>
              {count > 0 && (
                <span className="info">
                  involved in {count}txn {count > 1 ? "s" : ""}
                </span>
              )}
              <button
                class="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                onClick={() => removePerson(p)}
              >
                -
              </button>
            </li>
          );
        })}
      </ul>
      <input
        type="text"
        value={newPerson}
        onChange={(e) => setNewPerson(e.target.value)}
        placeholder="Enter name"
         
      />
      <button
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        onClick={addPerson}
      >
        Add Person
      </button>
    </div>
  );
}
