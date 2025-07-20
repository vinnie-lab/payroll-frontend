document.addEventListener('DOMContentLoaded', function() {
    
    lucide.createIcons();

    // --- Sidebar Toggle Logic ---
    // (This can be refactored into a shared script in a real project)
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebarMobileToggle = document.getElementById('sidebar-toggle-mobile');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            const isMobile = window.innerWidth <= 768;
            if (isMobile) sidebar.classList.add('open');
            else document.querySelector('.dashboard-container').classList.toggle('sidebar-collapsed');
        });
    }
    if (sidebarMobileToggle) {
        sidebarMobileToggle.addEventListener('click', () => sidebar.classList.remove('open'));
    }

    // --- Sample Department Data ---
    const departments = [
        { id: 'D01', name: 'Engineering', manager: 'John Doe', employees: 45 },
        { id: 'D02', name: 'Sales', manager: 'Jane Smith', employees: 25 },
        { id: 'D03', name: 'Marketing', manager: 'Brian Lowe', employees: 15 },
        { id: 'D04', name: 'Human Resources', manager: 'Eva Rostova', employees: 10 },
        { id: 'D05', name: 'Support', manager: 'Henry Wilson', employees: 5 },
        { id: 'D06', name: 'Product', manager: 'Alicia Heart', employees: 12 },
        { id: 'D07', name: 'Data Science', manager: 'David Chen', employees: 8 },
    ];
    let filteredDepartments = [...departments];
    let currentPage = 1;
    const rowsPerPage = 5;

    // --- DOM Elements ---
    const tableBody = document.querySelector('#departmentsTable tbody');
    const searchInput = document.getElementById('searchInput');
    const prevPageBtn = document.getElementById('prevPageBtn');
    const nextPageBtn = document.getElementById('nextPageBtn');
    const pageInfo = document.getElementById('pageInfo');
    
    // Modals
    const editModal = document.getElementById('editModal');
    const successModal = document.getElementById('successModal');
    const errorModal = document.getElementById('errorModal');
    const editForm = document.getElementById('editDepartmentForm');

    // --- Table & Pagination Logic ---
    function displayTable() {
        tableBody.innerHTML = '';
        const totalPages = Math.ceil(filteredDepartments.length / rowsPerPage);
        pageInfo.textContent = `Page ${currentPage} of ${totalPages || 1}`;
        
        const paginatedItems = filteredDepartments.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

        paginatedItems.forEach(dept => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${dept.name}</td>
                <td>${dept.manager}</td>
                <td>${dept.employees}</td>
                <td class="action-cell">
                    <button class="action-btn" data-dept-id="${dept.id}"><i data-lucide="more-horizontal"></i></button>
                    <div class="action-dropdown">
                        <div class="action-dropdown-item edit-btn"><i data-lucide="edit-2"></i> Edit</div>
                        <div class="action-dropdown-item delete-btn"><i data-lucide="trash-2"></i> Delete</div>
                    </div>
                </td>
            `;
            tableBody.appendChild(row);
        });

        lucide.createIcons();
        updatePaginationButtons();
    }

    function updatePaginationButtons() {
        const totalPages = Math.ceil(filteredDepartments.length / rowsPerPage);
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
    }
    
    // --- Search & Pagination Event Listeners ---
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        filteredDepartments = departments.filter(d => 
            d.name.toLowerCase().includes(searchTerm) ||
            d.manager.toLowerCase().includes(searchTerm) ||
            d.email.toLowerCase().includes(searchTerm)
        );
        currentPage = 1;
        displayTable();
    });
    prevPageBtn.addEventListener('click', () => { if (currentPage > 1) { currentPage--; displayTable(); } });
    nextPageBtn.addEventListener('click', () => { if (currentPage < Math.ceil(filteredDepartments.length / rowsPerPage)) { currentPage++; displayTable(); } });

    // --- Modal Logic ---
    function openModal(modal) { modal.classList.add('show'); }
    function closeModal(modal) { modal.classList.remove('show'); }

    // Event delegation for table actions
    tableBody.addEventListener('click', e => {
        const actionBtn = e.target.closest('.action-btn');
        const editBtn = e.target.closest('.edit-btn');

        // Handle dropdown toggle
        if (actionBtn) {
            const dropdown = actionBtn.nextElementSibling;
            document.querySelectorAll('.action-dropdown.show').forEach(d => { if(d !== dropdown) d.classList.remove('show'); });
            dropdown.classList.toggle('show');
        }

        // Handle edit button click
        if (editBtn) {
            const deptId = editBtn.closest('.action-cell').querySelector('.action-btn').dataset.deptId;
            const deptData = departments.find(d => d.id === deptId);
            
            // Populate and show edit modal
            editForm.querySelector('#editDeptId').value = deptData.id;
            editForm.querySelector('#deptName').value = deptData.name;
            editForm.querySelector('#deptManager').value = deptData.manager;
            editForm.querySelector('#deptEmail').value = deptData.email;
            openModal(editModal);
        }
    });

    // Close dropdowns when clicking outside
    document.body.addEventListener('click', e => {
        if (!e.target.closest('.action-cell')) {
            document.querySelectorAll('.action-dropdown.show').forEach(d => d.classList.remove('show'));
        }
    });
    
    // Handle form submission
    editForm.addEventListener('submit', e => {
        e.preventDefault();
        const deptName = editForm.querySelector('#deptName').value.trim();
        const deptManager = editForm.querySelector('#deptManager').value.trim();
        const deptEmail = editForm.querySelector('#deptEmail').value.trim();

        if (!deptName || !deptManager || !deptEmail) {
            // Show error modal
            errorModal.querySelector('#errorMessage').textContent = 'All fields are required. Please fill out the form completely.';
            openModal(errorModal);
        } else {
            // In a real app, you would send this to the server. Here we just simulate success.
            closeModal(editModal);
            openModal(successModal);
            
            // To see the update on the table, you could update the `departments` array here
            // and then call displayTable() after closing the success modal.
        }
    });

    // Add listeners to close modals
    [editModal, successModal, errorModal].forEach(modal => {
        modal.addEventListener('click', e => {
            if (e.target.classList.contains('modal-overlay') || e.target.closest('.cancel-btn') || e.target.closest('.ok-btn') || e.target.closest('.modal-close')) {
                closeModal(modal);
            }
        });
    });

    // --- Initial Chart & Table Load ---
    const deptSizeOptions = {
        chart: { type: 'bar', height: 300, toolbar: { show: false } },
        series: [{ name: 'Employees', data: [45, 25, 15, 12, 10, 8, 5] }],
        xaxis: { categories: ['Eng', 'Sales', 'Mktg', 'Product', 'HR', 'Data', 'Support'] },
        colors: ['#4F46E5'],
    };
    new ApexCharts(document.querySelector("#department-size-chart"), deptSizeOptions).render();

    const budgetAllocOptions = {
        chart: { type: 'pie', height: 300 },
        series: [40, 25, 15, 10, 10],
        labels: ['Engineering', 'Sales', 'Marketing', 'R&D', 'Admin'],
        legend: { position: 'bottom' },
        colors: ['#667eea', '#f7971e', '#2af598', '#EF4444', '#6B7280'],
    };
    new ApexCharts(document.querySelector("#budget-allocation-chart"), budgetAllocOptions).render();
    
    displayTable();
});