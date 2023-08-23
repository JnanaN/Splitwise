document.addEventListener("DOMContentLoaded", function() {
    const addGroupButton = document.getElementById("addGroupButton");
    const namesContainer = document.getElementById("namesContainer");
    const submitButton = document.getElementById("submitButton");
    const cancelButton = document.getElementById("cancelButton");
    let nameCount = 0;

    addGroupButton.addEventListener("click", function() {
        addMoreNames();
    });

    function addMoreNames() {
        const nameInput = document.createElement("input");
        nameInput.type = "text";
        nameInput.className = "nameInput";
        nameInput.placeholder = "Enter a name";

        const plusSymbol = document.createElement("span");
        plusSymbol.textContent = "+";
        plusSymbol.className = "plusSymbol";
        plusSymbol.addEventListener("click", function() {
            addMoreNames();
        });

        namesContainer.appendChild(nameInput);
        namesContainer.appendChild(plusSymbol);
        nameCount++;
    }

    submitButton.addEventListener("click", function() {
        const groupName = document.getElementById("groupName").value.trim();
        if (groupName === "") {
            alert("Please enter a group name.");
            return;
        }

        const nameInputs = document.getElementsByClassName("nameInput");
        const namesArray = [];
        for (let i = 0; i < nameInputs.length; i++) {
            if (nameInputs[i].value.trim() !== "") {
                namesArray.push(nameInputs[i].value.trim());
            }
        }
        if (namesArray.length > 0) {
            // Process the group name and member names (e.g., store them, display, etc.)
            console.log("Group Name:", groupName);
            console.log("Member Names:", namesArray);

            // Display the group name as a clickable link
            const groupList = document.getElementById("groupList");
            const groupLink = document.createElement("a");
            groupLink.textContent = groupName;
            groupLink.href = "#"; // For now, it points to an anchor (#), we'll update it later
            groupList.appendChild(groupLink);

            // Navigate to the payment details page when group name is clicked
            groupLink.addEventListener("click", function(event) {
                event.preventDefault(); // Prevent default link behavior
                navigateToPaymentDetails(groupName, namesArray);
            });

            // Reset the form after submission
            document.getElementById("groupName").value = "";
            namesContainer.innerHTML = "";
            nameCount = 0;
        } else {
            alert("Please enter at least one member name.");
        }
    });

    cancelButton.addEventListener("click", function() {
        namesContainer.innerHTML = "";
        nameCount = 0;
    });
});

function navigateToPaymentDetails(groupName, members) {
    // Create the URL for the payment details page with query parameters
    const paymentDetailsURL = `payment_details.html?group=${encodeURIComponent(groupName)}&members=${encodeURIComponent(JSON.stringify(members))}`;


    window.location.href = paymentDetailsURL;
}
