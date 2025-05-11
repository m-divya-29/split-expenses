import { useState } from "react";
export default function Owes({ transactions, owes, setOwes }) {
  const [sortOption, setSortOption] = useState("highest"); // default

  function calculateOwes() {
    const newOwes = {};
    for (const t of transactions) {
      const { paidBy, amount, splitBetween } = t;
      const eachPays = amount / splitBetween.length;
      for (const payer of splitBetween) {
        if (payer == paidBy) continue;

        // put if absent
        if (!newOwes[payer]) newOwes[payer] = {};
        if (!newOwes[payer][paidBy]) newOwes[payer][paidBy] = 0;

        newOwes[payer][paidBy] += eachPays;
      }
    }

    // tally
    for (const personA of Object.keys(newOwes)) {
      for (const personB of Object.keys(newOwes[personA])) {
        if (newOwes[personB]?.[personA]) {
          const aToB = newOwes[personA][personB];
          const bToA = newOwes[personB][personA];

          if (aToB > bToA) {
            newOwes[personA][personB] = aToB - bToA;
            delete newOwes[personB][personA];
          } else if (bToA > aToB) {
            newOwes[personB][personA] = bToA - aToB;
            delete newOwes[personA][personB];
          } else {
            delete newOwes[personA][personB];
            delete newOwes[personB][personA];
          }
        }
      }
    }
    setOwes(newOwes);
    localStorage.setItem("owes", JSON.stringify(owes));
  }
  return (
    <div class="p-4 ">
      <button
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        onClick={calculateOwes}
      >
        Calculate
      </button>

      {owes && Object.keys(owes).length > 0 ? (
        <>
          <div class="p-4 " style={{ margin: "1rem 0" }}>
            <label>
              Sort by: &nbsp;
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="highest">Amount (High → Low)</option>
                <option value="lowest">Amount (Low → High)</option>
                <option value="from">From (A → Z)</option>
                <option value="to">To (A → Z)</option>
              </select>
            </label>
          </div>
          <div className="flex flex-col overflow-x-auto p-1.5 w-full inline-block align-middle overflow-hidden border rounded-lg">
            <table class="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                  >
                    From
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                  >
                    To
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                  >
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {Object.entries(owes)
                  .flatMap(([from, toMap]) =>
                    Object.entries(toMap).map(([to, amount]) => ({
                      from,
                      to,
                      amount,
                    }))
                  )
                  .sort((a, b) => {
                    if (sortOption === "highest") return b.amount - a.amount;
                    if (sortOption === "lowest") return a.amount - b.amount;
                    if (sortOption === "from")
                      return a.from.localeCompare(b.from);
                    if (sortOption === "to") return a.to.localeCompare(b.to);
                    return 0;
                  })
                  .map(({ from, to, amount }) => (
                    <tr key={`${from}->${to}`}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                        {from}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                        {to}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                        ₹{amount}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <p class="text-gray-700 leading-relaxed">
          No balances yet. Click "Calculate" to see results.
        </p>
      )}
    </div>
  );
}
