window.addEventListener('storage', function(event) {
    // Handle changes to suppliers data
    if (event.key === 'suppliers') {
        suppliers = JSON.parse(event.newValue || '[]');
        
        // Update the UI if the supplier section is visible
        if (!document.getElementById('supplierSection').classList.contains('hidden')) {
            renderSupplierTable();
        }
        
        // If the purchase order form is open, update the supplier dropdown
        if (!document.getElementById('createOrderForm').classList.contains('hidden')) {
            populateSupplierDropdown();
        }
    }
    
    // Handle changes to supplier counter
    if (event.key === 'supplierCounter') {
        supplierCounter = parseInt(event.newValue || '1');
    }
    
    // Handle changes to purchase orders data
    if (event.key === 'purchaseOrders') {
        purchaseOrders = JSON.parse(event.newValue || '[]');
        
        // Update the UI if the order list is visible
        if (!document.getElementById('orderListView').classList.contains('hidden')) {
            renderOrderTable();
        }
    }
    
    // Handle changes to purchase order counter
    if (event.key === 'purchaseOrderCounter') {
        purchaseOrderCounter = parseInt(event.newValue || '1');
    }
});

function initializeStorageHandling() {
    // Initial load from localStorage
    loadSuppliersFromLocalStorage();
    loadOrdersFromLocalStorage();
    
    // Force update UI to ensure it's synchronized with the latest data
    renderSupplierTable();
    renderOrderTable();
    populateSupplierDropdown();
    
    console.log("Cross-tab synchronization initialized");
}

// Call this function at the end of your existing DOMContentLoaded handler
document.addEventListener('DOMContentLoaded', function() {
    // The existing DOMContentLoaded code should go here
    // ...
    
    // Initialize the storage handling after all other initialization
    initializeStorageHandling();
});