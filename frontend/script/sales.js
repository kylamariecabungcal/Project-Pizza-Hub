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

            console.log(`Request URL: ${url.toString()}`); 

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();

            console.log('Filtered sales data:', result); 

            return result;
        } catch (err) {
            console.error('Error fetching sales data:', err);
            return null;
        }
    };


    const createSalesTableRow = (saleItem) => {
        const row = document.createElement('tr');

        const dateCell = document.createElement('td');
        dateCell.innerText = new Date(saleItem.date).toLocaleDateString();

        const productIdCell = document.createElement('td');
        const productId = saleItem.product ? saleItem.product._id : 'N/A';
        productIdCell.innerText = productId;

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
            salesData.forEach(saleItem => {
                const row = createSalesTableRow(saleItem);
                salesTableBody.appendChild(row);
            });
        } else {
     
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.colSpan = 5; 
            cell.innerText = 'No sales found for the selected date';
            row.appendChild(cell);
            salesTableBody.appendChild(row);
        }
    };

    
    const updatePagination = (totalPages, currentPage) => {
        paginationContainer.innerHTML = '';

        const prevButton = document.createElement('button');
        prevButton.classList.add('btn', 'btn-secondary', 'me-2');
        prevButton.innerText = 'Previous';
        prevButton.disabled = currentPage === 1;
        prevButton.onclick = () => loadSalesData(currentPage - 1);

        const nextButton = document.createElement('button');
        nextButton.classList.add('btn', 'btn-secondary');
        nextButton.innerText = 'Next';
        nextButton.disabled = currentPage === totalPages;
        nextButton.onclick = () => loadSalesData(currentPage + 1);

        const pageInfo = document.createElement('span');
        pageInfo.classList.add('mx-3');
        pageInfo.innerText = `Page ${currentPage} of ${totalPages}`;

        paginationContainer.append(prevButton, pageInfo, nextButton);
    };


    const loadSalesData = (page = 1) => {
        const selectedDate = dateInput.value; 
        console.log('Selected Date:', selectedDate); 

        showLoading(); 

   
        getSalesData(selectedDate, page, itemsPerPage).then(result => {
            hideLoading(); 

            if (result && Array.isArray(result)) {
                const salesData = result; 
                updateSalesTable(salesData);
            } else {
                console.error('Invalid data format:', result);
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
