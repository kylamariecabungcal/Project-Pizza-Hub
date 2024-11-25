// Select the table body
const tableBody = document.querySelector('#productTableBody');

// Add event listener for delete and edit buttons
tableBody.addEventListener('click', function (e) {
    const target = e.target;

    // Handle Delete
    if (target.closest('.text-danger')) {
        const row = target.closest('tr');
        if (confirm('Are you sure you want to delete this product?')) {
            row.parentNode.removeChild(row); // Remove the row from the table
        }
    }

    // Handle Edit
    if (target.closest('.text-warning')) {
        const row = target.closest('tr');
        const cells = row.querySelectorAll('td');
        
        // Check if already in edit mode
        if (row.dataset.editing) {
            // Save changes
            cells.forEach((cell, index) => {
                if (index < cells.length - 2) { // Skip the "Actions" cell
                    const input = cell.querySelector('input');
                    if (input) {
                        cell.textContent = input.value; // Save the input value to the cell
                    }
                }
            });
            delete row.dataset.editing; // Exit edit mode
        } else {
            // Enter edit mode
            cells.forEach((cell, index) => {
                if (index < cells.length - 2) { // Skip the "Actions" cell
                    const value = cell.textContent.trim();
                    cell.innerHTML = `<input type="text" value="${value}" />`;
                }
            });
            row.dataset.editing = true; // Mark row as editing
        }
    }
});
