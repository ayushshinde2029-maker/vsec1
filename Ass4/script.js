let addBtn = document.getElementById("addBtn");

addBtn.addEventListener("click", function () {

    let productName = document.getElementById("productName").value;
    let price = Number(document.getElementById("price").value);
    let quantity = Number(document.getElementById("quantity").value);

    if (productName == "" || price <= 0 || quantity <= 0) {
        alert("Please enter valid details");
        return;
    }

    let total = price * quantity;

    let row = document.createElement("tr");

    row.innerHTML = `
        <td>${productName}</td>
        <td>${price}</td>
        <td>${quantity}</td>
        <td>${total}</td>
        <td>
            <button onclick="deleteItem(this)">Delete</button>
        </td>
    `;

    document.getElementById("billItems").appendChild(row);

    calculateBill();

    document.getElementById("productName").value = "";
    document.getElementById("price").value = "";
    document.getElementById("quantity").value = "";
});

function deleteItem(button) {
    button.parentElement.parentElement.remove();
    calculateBill();
}

function calculateBill() {

    let rows = document.querySelectorAll("#billItems tr");
    let subtotal = 0;

    rows.forEach(function(row) {
        let total = Number(row.children[3].innerText);
        subtotal += total;
    });

    let discount = subtotal * 0.05;
    let gst = (subtotal - discount) * 0.05;
    let grandTotal = subtotal - discount + gst;

    document.getElementById("subtotal").innerText = subtotal.toFixed(2);
    document.getElementById("discount").innerText = discount.toFixed(2);
    document.getElementById("gst").innerText = gst.toFixed(2);
    document.getElementById("grandTotal").innerText = grandTotal.toFixed(2);
}

document.getElementById("clearBtn").addEventListener("click", function() {

    document.getElementById("billItems").innerHTML = "";

    document.getElementById("subtotal").innerText = "0";
    document.getElementById("discount").innerText = "0";
    document.getElementById("gst").innerText = "0";
    document.getElementById("grandTotal").innerText = "0";
});

document.getElementById("printBtn").addEventListener("click", function() {
    window.print();
});