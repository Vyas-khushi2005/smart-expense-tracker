const form = document.getElementById("expenseForm");
const tableBody = document.querySelector("#expenseTable tbody");
const summary = document.getElementById("summary");
const messageBox = document.getElementById("messageBox");
const emptyState = document.getElementById("emptyState");
const searchBox = document.getElementById("searchBox");
const yearSpan = document.getElementById("year");

// Modal elements
const deleteModal = document.getElementById("deleteModal");
const confirmDeleteBtn = document.getElementById("confirmDelete");
const cancelDeleteBtn = document.getElementById("cancelDelete");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let deleteIndex = null;

// Show current year in footer
yearSpan.innerText = new Date().getFullYear();

// Save to Local Storage
function saveExpenses() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

form.addEventListener("submit", function(e) {
  e.preventDefault();

  const desc = document.getElementById("desc").value.trim();
  const amount = document.getElementById("amount").value.trim();
  const category = document.getElementById("category").value;

  // Validation
  if(desc === "" || amount === "") {
    showMessage("❌ Please fill all fields!", "error");
    return;
  }

  const date = new Date().toLocaleDateString();

  expenses.push({date, desc, amount: parseFloat(amount), category});
  saveExpenses();
  renderTable();
  updateSummary();
  showMessage("✅ Expense Added Successfully!", "success");

  form.reset();
});

function renderTable(filteredExpenses = expenses) {
  tableBody.innerHTML = "";

  if(filteredExpenses.length === 0) {
    emptyState.style.display = "block";
  } else {
    emptyState.style.display = "none";
  }

  filteredExpenses.forEach((exp, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${exp.date}</td>
      <td>${exp.desc}</td>
      <td>₹${exp.amount.toFixed(2)}</td>
      <td>${exp.category}</td>
      <td>
        <button onclick="editExpense(${index})" class="editBtn">✏️ Edit</button>
        <button onclick="openDeleteModal(${index})" class="deleteBtn">❌ Delete</button>
      </td>
    `;

    tableBody.appendChild(row);
  });
}

function updateSummary() {
  let total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  summary.innerText = "₹" + total.toFixed(2);
}

// Open custom delete modal
function openDeleteModal(index) {
  deleteIndex = index;
  deleteModal.style.display = "block";
}

// Confirm delete
confirmDeleteBtn.addEventListener("click", function() {
  if(deleteIndex !== null) {
    expenses.splice(deleteIndex, 1);
    saveExpenses();
    renderTable();
    updateSummary();
    showMessage("🗑 Expense Deleted Successfully!", "success");
    deleteIndex = null;
  }
  deleteModal.style.display = "none";
});

// Cancel delete
cancelDeleteBtn.addEventListener("click", function() {
  deleteModal.style.display = "none";
  deleteIndex = null;
});

function editExpense(index) {
  const exp = expenses[index];
  document.getElementById("desc").value = exp.desc;
  document.getElementById("amount").value = exp.amount;
  document.getElementById("category").value = exp.category;

  expenses.splice(index, 1); // remove old entry
  saveExpenses();
  renderTable();
  updateSummary();
  showMessage("✏️ Edit mode: Update and re-add expense.", "info");
}

function showMessage(msg, type) {
  messageBox.innerText = msg;
  messageBox.style.color = type === "error" ? "red" : (type === "info" ? "orange" : "lime");
  setTimeout(() => { messageBox.innerText = ""; }, 3000);
}

// Search functionality
searchBox.addEventListener("input", function() {
  const query = searchBox.value.toLowerCase();
  const filtered = expenses.filter(exp =>
    exp.desc.toLowerCase().includes(query) ||
    exp.category.toLowerCase().includes(query)
  );

  renderTable(filtered);
});

// Initial render on page load
renderTable();
updateSummary();
