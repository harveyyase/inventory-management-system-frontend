 // Toggle submenu open/close
 function toggleSubmenu(element) {
    const submenu = element.nextElementSibling;
    submenu.classList.toggle('open');
   
    // Toggle arrow direction
    const arrow = element.querySelector('.arrow');
    if (arrow.textContent === '▸') {
        arrow.textContent = '▾';
    } else {
        arrow.textContent = '▸';
    }
}


// Show order list view
function showOrderList(e) {
    document.getElementById('orderListView').classList.remove('hidden');
    document.getElementById('createOrderForm').classList.add('hidden');
   
    // Update active state
    const menuItems = document.querySelectorAll('.submenu-item');
    menuItems.forEach(item => item.classList.remove('active'));
   
    // Only update the active class if called from a click event
    if (e && e.target) {
        e.target.classList.add('active');
    } else {
        // If called programmatically, set the second submenu item as active
        document.querySelectorAll('.submenu-item')[1].classList.add('active');
    }
}


// Show create order form
function showCreateOrder(e) {
    document.getElementById('orderListView').classList.add('hidden');
    document.getElementById('createOrderForm').classList.remove('hidden');
   
    // Update active state
    const menuItems = document.querySelectorAll('.submenu-item');
    menuItems.forEach(item => item.classList.remove('active'));
   
    // Only update the active class if called from a click event
    if (e && e.target) {
        e.target.classList.add('active');
    } else {
        // If called programmatically, set the first submenu item as active
        document.querySelector('.submenu-item').classList.add('active');
    }
   
    // Set current date
    const now = new Date();
    const dateString = now.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
    document.getElementById('currentDate').textContent = dateString;
}


// Cancel form submission
function cancelForm() {
    document.getElementById('orderForm').reset();
    showOrderList();
}


// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Set initial view
    showOrderList();
   
    // Add event listeners for create order form
    document.getElementById('orderForm').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Order submitted successfully!');
        showOrderList();
    });
   
    // Add event listener for "Add Another Product" button
    document.querySelector('.add-product-btn').addEventListener('click', function() {
        const productRow = document.querySelector('.product-row').cloneNode(true);
        const inputs = productRow.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.value = '';
            input.id = input.id + Math.floor(Math.random() * 1000);
        });
       
        const labels = productRow.querySelectorAll('label');
        labels.forEach((label, index) => {
            label.setAttribute('for', inputs[index].id);
        });
       
        productRow.querySelector('.remove-btn').addEventListener('click', function() {
            this.parentElement.remove();
        });
       
        document.querySelector('.add-product-btn').before(productRow);
    });
   
    // Add event listener for existing "Remove" button
    document.querySelector('.remove-btn').addEventListener('click', function() {
        if (document.querySelectorAll('.product-row').length > 1) {
            this.parentElement.remove();
        } else {
            alert('You must have at least one product.');
        }
    });
});

