 /**
 * ===================================================
 * LOCAL STORAGE IMPLEMENTATION - JavaScript
 * ===================================================
 *
 * These modifications will:
 * 1. Save supplier data to localStorage whenever changes are made
 * 2. Load data from localStorage when the page loads
 * 3. Handle data persistence across page refreshes
 */


// Initialize supplier data array and counter
let suppliers = [];
let currentEditId = null;
let counter = 1;


// Load data from localStorage
function loadFromLocalStorage() {
    const storedSuppliers = localStorage.getItem('suppliers');
    const storedCounter = localStorage.getItem('supplierCounter');
   
    if (storedSuppliers) {
        suppliers = JSON.parse(storedSuppliers);
    }
   
    if (storedCounter) {
        counter = parseInt(storedCounter);
    }
   
    renderSupplierTable();
}


// Save data to localStorage
function saveToLocalStorage() {
    localStorage.setItem('suppliers', JSON.stringify(suppliers));
    localStorage.setItem('supplierCounter', counter);
}


// Sample data for initial display - only used if no data in localStorage
function initializeSampleData() {
    // Only initialize if no data exists in localStorage
    if (!localStorage.getItem('suppliers')) {
        suppliers = [];
        saveToLocalStorage();
    } else {
        loadFromLocalStorage();
    }
    renderSupplierTable();
}


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


// Show supplier list view
function showSupplierList(e) {
    document.getElementById('supplierListView').classList.remove('hidden');
    document.getElementById('addSupplierForm').classList.add('hidden');
   
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
   
    // Update supplier table
    renderSupplierTable();
}


// Show add supplier form
function showAddSupplierForm(e) {
    document.getElementById('supplierListView').classList.add('hidden');
    document.getElementById('addSupplierForm').classList.remove('hidden');
   
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
   
    // Clear form fields
    document.getElementById('supplierForm').reset();
    currentEditId = null;
}


// Save supplier data
function saveSupplier(e) {
    // Prevent default form submission if event is passed
    if (e) {
        e.preventDefault();
    }
   
    // Get form values
    const name = document.getElementById('supplierName').value;
    const location = document.getElementById('supplierLocation').value;
    const email = document.getElementById('contactEmail').value;
    const productsText = document.getElementById('products').value;
   
    // Validate form
    if (!name || !location || !email) {
        alert('Please fill all required fields');
        return;
    }
   
    // Create date string
    const now = new Date();
    const dateString = now.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
   
    // Create or update supplier
    if (currentEditId) {
        // Update existing supplier
        const index = suppliers.findIndex(s => s.id === currentEditId);
        if (index !== -1) {
            suppliers[index].name = name;
            suppliers[index].location = location;
            suppliers[index].email = email;
            suppliers[index].products = productsText;
            suppliers[index].updatedAt = dateString;
        }
    } else {
        // Add new supplier
        suppliers.push({
            id: counter++,
            name: name,
            location: location,
            email: email,
            products: productsText,
            createdBy: "John Doe",
            createdAt: dateString,
            updatedAt: dateString
        });
    }
   
    // Save to localStorage
    saveToLocalStorage();
   
    // Reset form and show supplier list
    document.getElementById('supplierForm').reset();
    currentEditId = null;
    showSupplierList();
}


// Cancel form submission
function cancelForm() {
    document.getElementById('supplierForm').reset();
    currentEditId = null;
    showSupplierList();
}


// Render supplier table
function renderSupplierTable() {
    const tbody = document.querySelector('#supplierTable tbody');
    tbody.innerHTML = '';
   
    suppliers.forEach((supplier, index) => {
        // Format products as bullet list if there are any
        let productsHTML = '';
        if (supplier.products) {
            const productsList = supplier.products.split(',').map(p => p.trim());
            productsHTML = productsList.map(product => `<li>${product}</li>`).join('');
            productsHTML = `<ul>${productsHTML}</ul>`;
        }
       
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${supplier.name}</td>
            <td>${supplier.location}</td>
            <td>${supplier.email}</td>
            <td>${productsHTML}</td>
            <td>${supplier.createdBy}</td>
            <td>${supplier.createdAt}</td>
            <td>${supplier.updatedAt}</td>
            <td>
                <button class="btn btn-edit action-btn" onclick="editSupplier(${supplier.id})">Edit</button>
                <button class="btn btn-danger action-btn" onclick="deleteSupplier(${supplier.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
   
    // Update supplier count
    document.getElementById('supplierCount').textContent = `${suppliers.length} SUPPLIERS`;
}


// Edit supplier
function editSupplier(id) {
    const supplier = suppliers.find(s => s.id === id);
    if (supplier) {
        // Call showAddSupplierForm without an event argument
        showAddSupplierForm();
       
        // Fill form with supplier data
        document.getElementById('supplierName').value = supplier.name;
        document.getElementById('supplierLocation').value = supplier.location;
        document.getElementById('contactEmail').value = supplier.email;
        document.getElementById('products').value = supplier.products;
       
        // Set current edit ID
        currentEditId = id;
    }
}


// Delete supplier
function deleteSupplier(id) {
    if (confirm('Are you sure you want to delete this supplier?')) {
        suppliers = suppliers.filter(s => s.id !== id);
       
        // Save to localStorage after deletion
        saveToLocalStorage();
       
        renderSupplierTable();
    }
}


// Clear all data (for testing purposes)
function clearAllData() {
    if (confirm('Are you sure you want to clear all supplier data?')) {
        localStorage.removeItem('suppliers');
        localStorage.removeItem('supplierCounter');
        suppliers = [];
        counter = 1;
        renderSupplierTable();
    }
}


// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Load data from localStorage
    loadFromLocalStorage();
   
    // Set initial view
    showSupplierList();
   
    // Add form submit event listener
    document.getElementById('supplierForm').addEventListener('submit', saveSupplier);
});

