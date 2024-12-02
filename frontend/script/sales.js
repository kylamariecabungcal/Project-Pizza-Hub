document.addEventListener('DOMContentLoaded', () => {
    const salesTableBody = document.querySelector('#salesTable');
    const dateInput = document.getElementById('date');
    const paginationContainer = document.getElementById('paginationContainer');
    const loadingMessage = document.getElementById('loadingMessage');

    const itemsPerPage = 7; 
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

        // Create pagination container
        const paginationNav = document.createElement('nav');
        paginationNav.setAttribute('aria-label', 'Page navigation');
        const paginationUl = document.createElement('ul');
        paginationUl.classList.add('pagination', 'justify-content-center', 'pagination-sm');

        // Previous button
        const prevLi = document.createElement('li');
        prevLi.classList.add('page-item');
        prevLi.classList.toggle('disabled', currentPage === 1);
        const prevLink = document.createElement('a');
        prevLink.classList.add('page-link');
        prevLink.href = '#';
        prevLink.innerText = 'Previous';
        if (currentPage !== 1) {
            prevLink.addEventListener('click', (e) => {
                e.preventDefault();
                loadSalesData(currentPage - 1);
            });
        }
        prevLi.appendChild(prevLink);
        paginationUl.appendChild(prevLi);

        // Calculate page range
        const maxPageButtons = 5;
        let startPage = Math.max(currentPage - Math.floor(maxPageButtons / 2), 1);
        let endPage = Math.min(startPage + maxPageButtons - 1, totalPages);

        if (endPage - startPage + 1 < maxPageButtons) {
            startPage = Math.max(endPage - maxPageButtons + 1, 1);
        }

        // First page and ellipsis
        if (startPage > 1) {
            const firstLi = document.createElement('li');
            firstLi.classList.add('page-item');
            const firstLink = document.createElement('a');
            firstLink.classList.add('page-link');
            firstLink.href = '#';
            firstLink.innerText = '1';
            firstLink.addEventListener('click', (e) => {
                e.preventDefault();
                loadSalesData(1);
            });
            firstLi.appendChild(firstLink);
            paginationUl.appendChild(firstLi);

            if (startPage > 2) {
                const ellipsisLi = document.createElement('li');
                ellipsisLi.classList.add('page-item', 'disabled');
                const ellipsisSpan = document.createElement('span');
                ellipsisSpan.classList.add('page-link');
                ellipsisSpan.innerHTML = '&hellip;';
                ellipsisLi.appendChild(ellipsisSpan);
                paginationUl.appendChild(ellipsisLi);
            }
        }

        // Page numbers
        for (let i = startPage; i <= endPage; i++) {
            const pageLi = document.createElement('li');
            pageLi.classList.add('page-item');
            pageLi.classList.toggle('active', currentPage === i);
            const pageLink = document.createElement('a');
            pageLink.classList.add('page-link');
            pageLink.href = '#';
            pageLink.innerText = i;
            if (currentPage !== i) {
                pageLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    loadSalesData(i);
                });
            }
            pageLi.appendChild(pageLink);
            paginationUl.appendChild(pageLi);
        }

        // Last page and ellipsis
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                const ellipsisLi = document.createElement('li');
                ellipsisLi.classList.add('page-item', 'disabled');
                const ellipsisSpan = document.createElement('span');
                ellipsisSpan.classList.add('page-link');
                ellipsisSpan.innerHTML = '&hellip;';
                ellipsisLi.appendChild(ellipsisSpan);
                paginationUl.appendChild(ellipsisLi);
            }

            const lastLi = document.createElement('li');
            lastLi.classList.add('page-item');
            const lastLink = document.createElement('a');
            lastLink.classList.add('page-link');
            lastLink.href = '#';
            lastLink.innerText = totalPages;
            lastLink.addEventListener('click', (e) => {
                e.preventDefault();
                loadSalesData(totalPages);
            });
            lastLi.appendChild(lastLink);
            paginationUl.appendChild(lastLi);
        }

        // Next button
        const nextLi = document.createElement('li');
        nextLi.classList.add('page-item');
        nextLi.classList.toggle('disabled', currentPage === totalPages);
        const nextLink = document.createElement('a');
        nextLink.classList.add('page-link');
        nextLink.href = '#';
        nextLink.innerText = 'Next';
        if (currentPage !== totalPages) {
            nextLink.addEventListener('click', (e) => {
                e.preventDefault();
                loadSalesData(currentPage + 1);
            });
        }
        nextLi.appendChild(nextLink);
        paginationUl.appendChild(nextLi);

        paginationNav.appendChild(paginationUl);
        paginationContainer.appendChild(paginationNav);
    };

    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    dateInput.value = getTodayDate();

    const loadSalesData = (page = 1) => {
        const selectedDate = dateInput.value || getTodayDate();
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
