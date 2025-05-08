/**
 * Global variables and state
 */
// Initialize supplier data array and counter
let suppliers = [];
let currentEditId = null;
let supplierCounter = 1;

// Initialize purchase order data array and counter
let purchaseOrders = [];
let purchaseOrderCounter = 1;

/**
 * Local Storage Functions
 */
// Load suppliers from localStorage
function loadSuppliersFromLocalStorage() {
    const storedSuppliers = localStorage.getItem('suppliers');
    const storedCounter = localStorage.getItem('supplierCounter');
    
    if (storedSuppliers) {
        suppliers = JSON.parse(storedSuppliers);
    }
    
    if (storedCounter) {
        supplierCounter = parseInt(storedCounter);
    }
    
    renderSupplierTable();
}

// Save suppliers to localStorage
function saveSuppliersToLocalStorage() {
    localStorage.setItem('suppliers', JSON.stringify(suppliers));
    localStorage.setItem('supplierCounter', supplierCounter);
}

// Load purchase orders from localStorage
function loadOrdersFromLocalStorage() {
    const storedOrders = localStorage.getItem('purchaseOrders');
    const storedCounter = localStorage.getItem('purchaseOrderCounter');
    
    if (storedOrders) {
        purchaseOrders = JSON.parse(storedOrders);
    }
    
    if (storedCounter) {
        purchaseOrderCounter = parseInt(storedCounter);
    }
    
    renderOrderTable();
}

// Save purchase orders to localStorage
function saveOrdersToLocalStorage() {
    localStorage.setItem('purchaseOrders', JSON.stringify(purchaseOrders));
    localStorage.setItem('purchaseOrderCounter', purchaseOrderCounter);
}

/**
 * Menu and Section Toggle Functions
 */
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

// Toggle between main sections
function toggleSection(showSectionId, hideSectionId) {
    document.getElementById(showSectionId).classList.remove('hidden');
    document.getElementById(hideSectionId).classList.add('hidden');
    
    // Reset active states in menu
    document.querySelectorAll('.menu-link').forEach(link => {
        link.classList.remove('active-menu');
    });
    
    // Set active state for the current section's menu link
    if (showSectionId === 'supplierSection') {
        document.querySelector('.menu-item:nth-child(4) .menu-link').classList.add('active-menu');
    } else if (showSectionId === 'purchaseOrderSection') {
        document.querySelector('.menu-item:nth-child(5) .menu-link').classList.add('active-menu');
    }
}

/**
 * Supplier Functions
 */
// Show supplier list view
function showSupplierList(event) {
    if (event) event.preventDefault();
    
    document.getElementById('supplierListView').classList.remove('hidden');
    document.getElementById('addSupplierForm').classList.add('hidden');
    
    // Update active state in supplier submenu only
    const supplierMenuItems = document.querySelectorAll('.menu-item:nth-child(4) .submenu-item');
    supplierMenuItems.forEach(item => item.classList.remove('active'));
    
    // If triggered by a click event, set the clicked item as active
    if (event && event.target) {
        event.target.classList.add('active');
    } else {
        // If called programmatically, set the first supplier submenu item as active
        if (supplierMenuItems.length > 0) {
            supplierMenuItems[0].classList.add('active');
        }
    }
    
    // Update supplier table
    renderSupplierTable();
}

// Show add supplier form
function showAddSupplierForm(event) {
    if (event) event.preventDefault();
    
    document.getElementById('supplierListView').classList.add('hidden');
    document.getElementById('addSupplierForm').classList.remove('hidden');
    
    // Update active state in supplier submenu only
    const supplierMenuItems = document.querySelectorAll('.menu-item:nth-child(4) .submenu-item');
    supplierMenuItems.forEach(item => item.classList.remove('active'));
    
    // If triggered by a click event, set the clicked item as active
    if (event && event.target) {
        event.target.classList.add('active');
    } else {
        // If called programmatically, set the second supplier submenu item as active
        if (supplierMenuItems.length > 1) {
            supplierMenuItems[1].classList.add('active');
        }
    }
    
    // Clear form fields
    document.getElementById('supplierForm').reset();
    currentEditId = null;
}

// Save supplier data
function saveSupplier(e) {
    // Prevent default form submission
    if (e) e.preventDefault();
    
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
            id: supplierCounter++,
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
    saveSuppliersToLocalStorage();
    
    // Reset form and show supplier list
    document.getElementById('supplierForm').reset();
    currentEditId = null;
    showSupplierList();
}

// Render supplier table
function renderSupplierTable() {
    const tbody = document.querySelector('#supplierTable tbody');
    if (!tbody) return; // Guard against null element
    
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
    const supplierCountElement = document.getElementById('supplierCount');
    if (supplierCountElement) {
        supplierCountElement.textContent = `${suppliers.length} SUPPLIERS`;
    }
}

// Edit supplier
function editSupplier(id) {
    const supplier = suppliers.find(s => s.id === id);
    if (supplier) {
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
        saveSuppliersToLocalStorage();
        
        renderSupplierTable();
    }
}

/**
 * Purchase Order Functions
 */
// Show order list view
function showOrderList(event) {
    if (event) event.preventDefault();
    
    document.getElementById('orderListView').classList.remove('hidden');
    document.getElementById('createOrderForm').classList.add('hidden');
    
    // Update active state in purchase order submenu only
    const orderMenuItems = document.querySelectorAll('.menu-item:nth-child(5) .submenu-item');
    orderMenuItems.forEach(item => item.classList.remove('active'));
    
    // If triggered by a click event, set the clicked item as active
    if (event && event.target) {
        event.target.classList.add('active');
    } else {
        // If called programmatically, set the second order submenu item as active
        if (orderMenuItems.length > 1) {
            orderMenuItems[1].classList.add('active');
        }
    }
    
    // Update order table
    renderOrderTable();
}

// Show create order form
function showCreateOrder(event) {
    if (event) event.preventDefault();
    
    document.getElementById('orderListView').classList.add('hidden');
    document.getElementById('createOrderForm').classList.remove('hidden');
    
    // Update active state in purchase order submenu only
    const orderMenuItems = document.querySelectorAll('.menu-item:nth-child(5) .submenu-item');
    orderMenuItems.forEach(item => item.classList.remove('active'));
    
    // If triggered by a click event, set the clicked item as active
    if (event && event.target) {
        event.target.classList.add('active');
    } else {
        // If called programmatically, set the first order submenu item as active
        if (orderMenuItems.length > 0) {
            orderMenuItems[0].classList.add('active');
        }
    }
    
    // Set current date
    const now = new Date();
    const dateString = now.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
    document.getElementById('currentDate').textContent = dateString;
    
    // Populate supplier dropdown
    populateSupplierDropdown();
}

