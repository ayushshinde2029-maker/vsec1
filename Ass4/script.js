let addBtn = document.getElementById("addBtn");

addBtn.addEventListener("click", function() {

    let name = document.getElementById("productName").value;
    let price = Number(document.getElementById("price").value);
    let quantity = Number(document.getElementById("quantity").value);

    if (name == "" || price <= 0 || quantity <= 0) {
        alert("Enter valid details");
        return;
    }

    let total = price * quantity;

    let row = document.createElement("tr");

    row.innerHTML = `
        <td>${name}</td>
        <td>${price}</td>
        <td>${quantity}</td>
        <td>${total}</td>
        <td>
            <button onclick="deleteItem(this)">Delete</button>
        </td>
    `;

    document.getElementById("billItems").appendChild(row);

    calculateTotal();

    document.getElementById("productName").value = "";
    document.getElementById("price").value = "";
    document.getElementById("quantity").value = "";
});


function deleteItem(button) {

    button.parentElement.parentElement.remove();

    calculateTotal();
}


function calculateTotal() {

    let rows = document.querySelectorAll("#billItems tr");

    let total = 0;

    rows.forEach(function(row) {

        total = total + Number(row.children[3].innerText);

    });

    document.getElementById("grandTotal").innerText = total;
}


document.getElementById("clearBtn").addEventListener("click", function() {

    document.getElementById("billItems").innerHTML = "";

    document.getElementById("grandTotal").innerText = "0";
});


document.getElementById("printBtn").addEventListener("click", function() {

    window.print();

});
