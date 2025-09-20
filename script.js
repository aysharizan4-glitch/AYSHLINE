const expensesList = document.getElementById("expensesList");
const addExpense = document.getElementById("addExpense");
const totalAmount = document.getElementById("totalAmount");
const saveBudget = document.getElementById("saveBudget");
const viewSaved = document.getElementById("viewSaved");
const savedBudgets = document.getElementById("savedBudgets");
const savedList = document.getElementById("savedList");
const clearAll = document.getElementById("clearAll");

let budgets = JSON.parse(localStorage.getItem("budgets")) || [];

// Add expense input
addExpense.addEventListener("click", () => {
  const div = document.createElement("div");
  div.classList.add("expense-item");
  div.innerHTML = `
    <input type="text" placeholder="List" class="expenseName">
    <input type="number" placeholder="Amount" class="expenseAmount">
  `;
  expensesList.appendChild(div);
});

// Calculate total dynamically
expensesList.addEventListener("input", () => {
  let total = 0;
  document.querySelectorAll(".expenseAmount").forEach(input => {
    total += Number(input.value) || 0;
  });
  totalAmount.textContent = total;
});

// Save budget
saveBudget.addEventListener("click", () => {
  const budgetName = document.getElementById("budgetName").value;
  const monthYear = document.getElementById("monthYear").value;
  const expenseNames = [...document.querySelectorAll(".expenseName")].map(e => e.value);
  const expenseAmounts = [...document.querySelectorAll(".expenseAmount")].map(e => Number(e.value) || 0);

  let expenses = expenseNames.map((name, i) => ({ name, amount: expenseAmounts[i] }));
  let total = expenseAmounts.reduce((a, b) => a + b, 0);

  if (!budgetName || !monthYear) {
    alert("Please fill Budget Name and Date!");
    return;
  }

  budgets.push({ budgetName, monthYear, expenses, total });
  localStorage.setItem("budgets", JSON.stringify(budgets));

  alert("Budget saved!");
});

// Show saved budgets
viewSaved.addEventListener("click", () => {
  savedBudgets.classList.toggle("hidden");
  savedList.innerHTML = "";

  budgets.forEach((b, index) => {
    const li = document.createElement("li");
    li.classList.add("saved-item");
    li.textContent = `${b.budgetName} (${b.monthYear})`;

    // Expand details on click
    li.addEventListener("click", () => {
      if (li.querySelector(".saved-details")) {
        li.querySelector(".saved-details").remove();
      } else {
        const details = document.createElement("div");
        details.classList.add("saved-details");

        details.innerHTML = `
          <strong>Total:</strong> ${b.total}<br>
          <ul>
            ${b.expenses.map(e => `<li>${e.name}: ${e.amount}</li>`).join("")}
          </ul>
        `;
        li.appendChild(details);
      }
    });

    savedList.appendChild(li);
  });
});

// Clear all inputs
clearAll.addEventListener("click", () => {
  document.getElementById("budgetName").value = "";
  document.getElementById("monthYear").value = "";
  expensesList.innerHTML = `
    <div class="expense-item">
      <input type="text" placeholder="List" class="expenseName">
      <input type="number" placeholder="Amount" class="expenseAmount">
    </div>
  `;
  totalAmount.textContent = "0";
});
