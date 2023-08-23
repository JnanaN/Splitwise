class MaxHeap {
  constructor() {
    this.heap = [];
  }

  add(value) {
    this.heap.push(value);
    this.bubbleUp(this.heap.length - 1);
  }

  bubbleUp(index) {
    if (index <= 0) {
      return;
    }

    const parentIndex = Math.floor((index - 1) / 2);
    if (this.heap[parentIndex].netBalance < this.heap[index].netBalance) {
      [this.heap[parentIndex], this.heap[index]] = [
        this.heap[index],
        this.heap[parentIndex],
      ];
      this.bubbleUp(parentIndex);
    }
  }

  extractMax() {
    if (this.heap.length === 0) {
      return null;
    }

    const max = this.heap[0];
    const lastElement = this.heap.pop();

    if (this.heap.length > 0) {
      this.heap[0] = lastElement;
      this.sinkDown(0);
    }

    return max;
  }

  sinkDown(index) {
    const leftChildIndex = 2 * index + 1;
    const rightChildIndex = 2 * index + 2;
    let largestIndex = index;

    if (
      leftChildIndex < this.heap.length &&
      this.heap[leftChildIndex].netBalance > this.heap[largestIndex].netBalance
    ) {
      largestIndex = leftChildIndex;
    }

    if (
      rightChildIndex < this.heap.length &&
      this.heap[rightChildIndex].netBalance > this.heap[largestIndex].netBalance
    ) {
      largestIndex = rightChildIndex;
    }

    if (largestIndex !== index) {
      [this.heap[index], this.heap[largestIndex]] = [
        this.heap[largestIndex],
        this.heap[index],
      ];
      this.sinkDown(largestIndex);
    }
  }

  size() {
    return this.heap.length;
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  clear() {
    this.heap = [];
  }

  toArray() {
    return [...this.heap];
  }
}

class MinHeap {
  constructor() {
    this.heap = [];
  }

  add(obj) {
    this.heap.push(obj);
    this.bubbleUp(this.heap.length - 1);
  }

  bubbleUp(index) {
    if (index <= 0) {
      return;
    }

    const parentIndex = Math.floor((index - 1) / 2);
    if (this.heap[parentIndex].netBalance > this.heap[index].netBalance) {
      [this.heap[parentIndex], this.heap[index]] = [
        this.heap[index],
        this.heap[parentIndex],
      ];
      this.bubbleUp(parentIndex);
    }
  }

  extractMin() {
    if (this.heap.length === 0) {
      return null;
    }

    const min = this.heap[0];
    const lastElement = this.heap.pop();

    if (this.heap.length > 0) {
      this.heap[0] = lastElement;
      this.sinkDown(0);
    }

    return min;
  }

  sinkDown(index) {
    const leftChildIndex = 2 * index + 1;
    const rightChildIndex = 2 * index + 2;
    let smallestIndex = index;

    if (
      leftChildIndex < this.heap.length &&
      this.heap[leftChildIndex].netBalance < this.heap[smallestIndex].netBalance
    ) {
      smallestIndex = leftChildIndex;
    }

    if (
      rightChildIndex < this.heap.length &&
      this.heap[rightChildIndex].netBalance <
        this.heap[smallestIndex].netBalance
    ) {
      smallestIndex = rightChildIndex;
    }

    if (smallestIndex !== index) {
      [this.heap[index], this.heap[smallestIndex]] = [
        this.heap[smallestIndex],
        this.heap[index],
      ];
      this.sinkDown(smallestIndex);
    }
  }

  size() {
    return this.heap.length;
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  clear() {
    this.heap = [];
  }

  toArray() {
    return [...this.heap];
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const groupNameSpan = document.getElementById("groupName");
  const groupMembersContainer = document.getElementById("groupMembers");
  const addExpensesButton = document.getElementById("addExpensesButton");
  const paymentDetailsContainer = document.getElementById("paymentDetails");
  const cancelPaymentButton = document.getElementById("cancelPaymentButton");
  // const submitPaymentButton = document.getElementById("submitPaymentButton");
  const overallDataContainer = document.getElementById("overallData");

  // Payment transactions data
  const paymentTransactions = [];
  let members;
  let netBalance = new Map();

  // Retrieve the group name and members from the URL query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const groupName = urlParams.get("group");
  members = JSON.parse(urlParams.get("members"));

  // Set the group name in the span element
  groupNameSpan.textContent = groupName;

  // function call
  createGroupMembers();

  function createGroupMembers() {
    // Add group members to the container
    members.forEach(function (member) {
      const memberLabel = document.createElement("div");
      memberLabel.textContent = member;
      groupMembersContainer.appendChild(memberLabel);
    });
  }

  // Show/hide expenses form when add expenses button is clicked
  addExpensesButton.addEventListener("click", function () {
    createExpensesForm();
  });

  function createExpensesForm() {
    const expensesForm = document.createElement("div");
    expensesForm.classList.add("expensesForm");

    const payerSelect = document.createElement("select");
    payerSelect.id = "payer";
    payerSelect.classList.add("payerSelect");
    const payerLabel = document.createElement("label");
    payerLabel.textContent = "Payer: ";
    payerLabel.appendChild(payerSelect);

    const selectPayeesContainer = document.createElement("div");
    selectPayeesContainer.id = "selectPayees";
    selectPayeesContainer.classList.add("selectPayeesContainer");

    const amountInput = document.createElement("input");
    amountInput.type = "number";
    amountInput.id = "amount";
    amountInput.placeholder = "Enter the amount";
    const amountLabel = document.createElement("label");
    amountLabel.textContent = "Amount: ";
    amountLabel.appendChild(amountInput);

    const submitExpenseButton = document.createElement("button");
    submitExpenseButton.textContent = "Submit";
    submitExpenseButton.addEventListener("click", function () {
      submitExpense(
        payerSelect.value,
        Array.from(
          selectPayeesContainer.querySelectorAll('input[name="payee"]:checked')
        ).map((checkbox) => checkbox.value),
        parseFloat(amountInput.value)
      );
    });

    expensesForm.appendChild(payerLabel);
    expensesForm.appendChild(selectPayeesContainer);
    expensesForm.appendChild(amountLabel);
    expensesForm.appendChild(submitExpenseButton);

    paymentDetailsContainer.appendChild(expensesForm);
    createPayerOptions(payerSelect);
    createPayeeCheckboxes(selectPayeesContainer);
    payerSelect.focus();
  }

  function createPayerOptions(payerSelect) {
    payerSelect.innerHTML = ""; // Clear previous options

    // Add options for payer based on the group members
    members.forEach(function (member) {
      const option = document.createElement("option");
      option.value = member;
      option.textContent = member;
      payerSelect.appendChild(option);
    });
  }

  function createPayeeCheckboxes(selectPayeesContainer) {
    selectPayeesContainer.innerHTML = ""; // Clear previous options

    // Add checkboxes for all group members
    members.forEach(function (member) {
      const checkboxContainer = document.createElement("div");
      checkboxContainer.classList.add("payeeCheckboxContainer");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = member;
      checkbox.name = "payee";
      checkbox.id = `payee_${member}`;

      const label = document.createElement("label");
      label.textContent = member;
      label.htmlFor = `payee_${member}`;

      checkboxContainer.appendChild(checkbox);
      checkboxContainer.appendChild(label);
      selectPayeesContainer.appendChild(checkboxContainer);
    });
  }

  function submitExpense(payer, selectedPayees, amount) {
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    // Add the payment data to the paymentTransactions array
    const paymentData = {
      payer: payer,
      payees: selectedPayees,
      amount: amount,
    };
    console.log(paymentData);
    paymentTransactions.push(paymentData);

    // Update the net balance based on the new payment transaction
    if (netBalance.has(payer))
      netBalance.set(payer, netBalance.get(payer) - amount);
    else netBalance.set(payer, -amount);
    let portion = 1 * (amount / selectedPayees.length).toFixed(2);
    console.log(selectedPayees);
    selectedPayees.forEach((payee) => {
      if (netBalance.has(payee))
        netBalance.set(payee, netBalance.get(payee) + portion);
      else netBalance.set(payee, portion);
    });
    console.log(netBalance);

    const paymentRow = document.createElement("div");
    paymentRow.classList.add("payeePaymentRow");

    const payerLabel = document.createElement("label");
    payerLabel.textContent = "Payer: " + payer;
    const payeesLabel = document.createElement("label");
    payeesLabel.textContent = "Payees: " + selectedPayees.join(", ");

    const amountLabel = document.createElement("label");
    amountLabel.textContent = "Amount: " + amount.toFixed(2);

    paymentRow.appendChild(payerLabel);
    paymentRow.appendChild(payeesLabel);
    paymentRow.appendChild(amountLabel);
    paymentDetailsContainer.appendChild(paymentRow);

    // Clear the expenses form after submission
    paymentDetailsContainer.removeChild(paymentDetailsContainer.lastChild);
    createExpensesForm();
  }

  // Cancel Payment event handler
  cancelPaymentButton.addEventListener("click", function () {
    if (confirm("Are you sure you want to cancel? All data will be lost.")) {
      window.location.href = "index.html"; // Redirect to the main page if canceled
    }
  });

  const submitPaymentButton = document.createElement("button");
  submitPaymentButton.textContent = "Submit Payment";
  document.body.appendChild(submitPaymentButton);
  console.log("submitPaymentButton:", submitPaymentButton);

  submitPaymentButton.addEventListener("click", function () {
    // Submit the payment transactions data to your backend or store it as needed
    console.log("Payment Transactions:", paymentTransactions);

    // Calculate and display the overall data of who should pay whom and how much
    const members = [];
    for (const [key, value] of netBalance) {
      members.push({ name: key, netBalance: value });
    }
    console.log(members);

    const findSubsets = (subset, netChange, output, sum, index) => {
      if (index == netChange.length) {
        if (sum == 0 && output.length != 0) subset.push(output);
        return;
      }
      findSubsets(subset, netChange, [...output], sum, index + 1);
      output.push(netChange[index]);
      findSubsets(
        subset,
        netChange,
        [...output],
        sum + netChange[index].netBalance,
        index + 1
      );
    };
    const findMinTransactions = (netChange, output) => {
      if (netChange.length == 0) {
        if (output.length > groups.length) {
          groups = [...output];
        }
      }
      const possibleSubsets = [];
      findSubsets(possibleSubsets, netChange, [], 0, 0);
      possibleSubsets.forEach((subset) => {
        const remaining = [...netChange].filter((el) => !subset.includes(el));
        findMinTransactions(remaining, [...output, subset]);
      });
    };

    let groups = [];
    const list = members.filter((member) => member.netBalance != 0);
    findMinTransactions(list, []);
    // for each group, create transactions using max heaps
    const transactions = [];
    groups.forEach((group) => {
      const givers = new MaxHeap();
      const recievers = new MinHeap();
      group.forEach((member) => {
        if (member.netBalance < 0) recievers.add(member);
        else givers.add(member);
      });
      while (!givers.isEmpty() && !recievers.isEmpty()) {
        let giver = givers.extractMax();
        let reciever = recievers.extractMin();
        if (giver.netBalance == reciever.netBalance) {
          transactions.push({
            giver: giver.name,
            reciever: reciever.name,
            amount: giver.netBalance,
          });
        } else if (giver.netBalance < -reciever.netBalance) {
          transactions.push({
            giver: giver.name,
            reciever: reciever.name,
            amount: giver.netBalance,
          });
          recievers.add({
            ...reciever,
            netBalance: reciever.netBalance + giver.netBalance,
          });
        } else {
          transactions.push({
            giver: giver.name,
            reciever: reciever.name,
            amount: -reciever.netBalance,
          });
          givers.add({
            ...giver,
            netBalance: reciever.netBalance + giver.netBalance,
          });
        }
      }
    });

    console.log(transactions)

    // Clear the overallDataContainer first
    overallDataContainer.innerHTML = "";
    // giver, reciever, amount;

    transactions.forEach(transaction =>{
      const transactionItem = document.createElement('div');
      transactionItem.innerHTML = `
        <span>${transaction.giver} owes ${transaction.reciever} ₹${transaction.amount} </span>
      `
      overallDataContainer.appendChild(transactionItem);
    })
  });
});
