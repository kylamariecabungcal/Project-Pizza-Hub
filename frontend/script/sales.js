document.addEventListener('DOMContentLoaded', () => {
    const salesTableBody = document.querySelector('#salesTable');
    const dateInput = document.getElementById('date');
    const paginationContainer = document.getElementById('paginationContainer');
    const loadingMessage = document.getElementById('loadingMessage');

    const itemsPerPage = 10; 
    let currentPage = 1;

    const showLoading = () => {
        if (loadingMessage) {
            loadingMessage.style.display = 'block';
        }
    };

    const hideLoading = () => {
        if (loadingMessage) {
            loadingMessage.style.display = 'none';
        }
    };

    const getSalesData = async (date = '', page = 1, limit = 10) => {
        try {
            const formattedDate = date ? date.split('T')[0] : ''; 
            const url = new URL('http://localhost:4000/api/sale');
            
            if (formattedDate) {
                url.searchParams.append('date', formattedDate);  
            }
            url.searchParams.append('page', page);
            url.searchParams.append('limit', limit);
    
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const result = await response.json();
            if (Array.isArray(result.sales) && result.sales.length > 0) {
                return {
                    sales: result.sales,   
                    totalSalesCount: result.totalSalesCount || result.totalSales || 0, 
                };
            } else {
                return { sales: [], totalSalesCount: 0 };
            }
        } catch (err) {
            console.error('Error fetching sales data:', err);
            return { sales: [], totalSalesCount: 0 };
        }
    };

    const createSalesTableRow = (saleItem, index, currentPage) => {
        const row = document.createElement('tr');
    
        const dateCell = document.createElement('td');
        const saleDate = new Date(saleItem.date); 
        dateCell.innerText = saleDate.toLocaleDateString(); 
    
        const productIdCell = document.createElement('td');
        const globalIndex = (currentPage - 1) * itemsPerPage + index + 1;  
        productIdCell.innerText = globalIndex;
    
        const productNameCell = document.createElement('td');
        const productName = saleItem.product ? saleItem.product.name : 'Unknown Product';
        productNameCell.innerText = productName;
    
        const quantitySoldCell = document.createElement('td');
        quantitySoldCell.innerText = saleItem.quantity;
    
        const salesAmountCell = document.createElement('td');
        salesAmountCell.innerText = `₱${saleItem.totalPrice.toFixed(2)}`;
    
        row.append(dateCell, productIdCell, productNameCell, quantitySoldCell, salesAmountCell);
    
        return row;
    };

    const updateSalesTable = (salesData) => {
        salesTableBody.innerHTML = ''; 
        
        if (salesData.length > 0) {
            let totalSalesAmount = 0;
            salesData.forEach((saleItem, index) => {
                const row = createSalesTableRow(saleItem, index, currentPage);  
                salesTableBody.appendChild(row);
                totalSalesAmount += saleItem.totalPrice;  
            });
    
            const totalRow = document.createElement('tr');
            const totalCell = document.createElement('td');
            totalCell.colSpan = 4;  
            totalCell.innerHTML = '<strong>Total Sales:</strong>';  
            totalRow.appendChild(totalCell);
    
            const totalAmountCell = document.createElement('td');
            totalAmountCell.innerText = `₱${totalSalesAmount.toFixed(2)}`;
            totalRow.appendChild(totalAmountCell);
    
            salesTableBody.appendChild(totalRow);  
        } else {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.colSpan = 5;
            cell.innerText = 'No sales found for the selected date';
            row.appendChild(cell);
            salesTableBody.appendChild(row);
        }
    };

    const updatePagination = (totalSalesCount, currentPage) => {
        const totalPages = Math.ceil(totalSalesCount / itemsPerPage);
        paginationContainer.innerHTML = '';  

        
        const prevButton = document.createElement('button');
        prevButton.classList.add('btn', 'btn-sm', 'btn-primary');
        prevButton.innerText = 'Previous';
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener('click', () => loadSalesData(currentPage - 1));

        paginationContainer.appendChild(prevButton);

        
        const maxPageButtons = 5;  
        const halfRange = Math.floor(maxPageButtons / 2);
        let startPage = Math.max(currentPage - halfRange, 1);
        let endPage = Math.min(startPage + maxPageButtons - 1, totalPages);

        
        if (endPage - startPage + 1 < maxPageButtons) {
            startPage = Math.max(endPage - maxPageButtons + 1, 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            const pageButton = document.createElement('button');
            pageButton.innerText = i;
            pageButton.classList.add('btn', 'btn-sm', 'btn-secondary', 'mx-1');
            pageButton.disabled = currentPage === i;
            pageButton.addEventListener('click', () => loadSalesData(i));
            paginationContainer.appendChild(pageButton);
        }

        
        const nextButton = document.createElement('button');
        nextButton.classList.add('btn', 'btn-sm', 'btn-primary');
        nextButton.innerText = 'Next';
        nextButton.disabled = currentPage === totalPages;
        nextButton.addEventListener('click', () => loadSalesData(currentPage + 1));

        paginationContainer.appendChild(nextButton);
    };

    const loadSalesData = (page = 1) => {
        const selectedDate = dateInput.value;
        currentPage = page; 
        showLoading();

        getSalesData(selectedDate, page, itemsPerPage).then(result => {
            hideLoading();

            if (result && Array.isArray(result.sales)) {
                const salesData = result.sales;
                const totalSalesCount = result.totalSalesCount;
                updateSalesTable(salesData);
                updatePagination(totalSalesCount, page);
            } else {
                updateSalesTable([]);
            }
        }).catch(err => {
            console.error('Error loading sales data:', err);
            hideLoading();
            updateSalesTable([]);
        });
    };

    dateInput.addEventListener('change', () => loadSalesData(1));

    loadSalesData();
});
