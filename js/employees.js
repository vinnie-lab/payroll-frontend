
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize Lucid Icons
    lucide.createIcons();

    // --- Sidebar Toggle Logic (same as dashboard) ---
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebarMobileToggle = document.getElementById('sidebar-toggle-mobile');

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
             // For desktop, it toggles a class on the main container to shrink sidebar
            document.querySelector('.dashboard-container').classList.toggle('sidebar-collapsed');
        });
    }
    
    if(sidebarMobileToggle) {
        sidebarMobileToggle.addEventListener('click', () => {
             sidebar.classList.remove('open');
        });
         // Add a separate listener for the main toggle on mobile
         const mainToggle = document.getElementById('sidebar-toggle');
         mainToggle.addEventListener('click', () => sidebar.classList.add('open'));
    }

    // --- Sample Employee Data ---
    const employees = [
        { id: 'ZEP001', name: 'Alicia Heart', email: 'alicia.h@zephyra.com', department: 'Engineering', status: 'Active', avatar: 'https://i.pravatar.cc/150?img=1', joinDate: '2022-01-15' },
        { id: 'ZEP002', name: 'Brian Lowe', email: 'brian.l@zephyra.com', department: 'Marketing', status: 'Active', avatar: 'https://i.pravatar.cc/150?img=2', joinDate: '2021-11-20' },
        { id: 'ZEP003', name: 'Carla Diaz', email: 'carla.d@zephyra.com', department: 'Sales', status: 'Active', avatar: 'https://i.pravatar.cc/150?img=3', joinDate: '2023-03-10' },
        { id: 'ZEP004', name: 'David Chen', email: 'david.c@zephyra.com', department: 'Engineering', status: 'Active', avatar: 'https://i.pravatar.cc/150?img=4', joinDate: '2020-07-22' },
        { id: 'ZEP005', name: 'Eva Rostova', email: 'eva.r@zephyra.com', department: 'HR', status: 'Active', avatar: 'https://i.pravatar.cc/150?img=5', joinDate: '2023-05-30' },
        { id: 'ZEP006', name: 'Frank Miller', email: 'frank.m@zephyra.com', department: 'Sales', status: 'Active', avatar: 'https://i.pravatar.cc/150?img=6', joinDate: '2022-08-19' },
        { id: 'ZEP007', name: 'Grace Lee', email: 'grace.l@zephyra.com', department: 'Marketing', status: 'Active', avatar: 'https://i.pravatar.cc/150?img=7', joinDate: '2024-01-05' },
        { id: 'ZEP008', name: 'Henry Wilson', email: 'henry.w@zephyra.com', department: 'Support', status: 'Active', avatar: 'https://i.pravatar.cc/150?img=8', joinDate: '2023-09-11' },
        { id: 'ZEP009', name: 'Isla Brown', email: 'isla.b@zephyra.com', department: 'Engineering', status: 'Active', avatar: 'https://i.pravatar.cc/150?img=9', joinDate: '2022-02-28' },
        { id: 'ZEP010', name: 'Jack Taylor', email: 'jack.t@zephyra.com', department: 'Product', status: 'Active', avatar: 'https://i.pravatar.cc/150?img=10', joinDate: '2021-06-15' },
    ];
    let filteredEmployees = [...employees];
    let currentPage = 1;
    const rowsPerPage = 5;

    // --- DOM Elements ---
    const tableBody = document.querySelector('#employeesTable tbody');
    const searchInput = document.getElementById('searchInput');
    const prevPageBtn = document.getElementById('prevPageBtn');
    const nextPageBtn = document.getElementById('nextPageBtn');
    const pageInfo = document.getElementById('pageInfo');
    const modal = document.getElementById('viewModal');
    const modalCloseBtn = modal.querySelector('.modal-close');
    const modalBody = document.getElementById('modalBody');

    // --- Table & Pagination Logic ---
    function displayTable() {
        tableBody.innerHTML = '';
        const totalPages = Math.ceil(filteredEmployees.length / rowsPerPage);
        pageInfo.textContent = `Page ${currentPage} of ${totalPages || 1}`;
        
        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const paginatedItems = filteredEmployees.slice(start, end);

        paginatedItems.forEach(emp => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${emp.id}</td>
                <td>
                    <div class="employee-name">
                        <img src="${emp.avatar}" alt="${emp.name}">
                        <span>${emp.name}</span>
                    </div>
                </td>
                <td>${emp.email}</td>
                <td>${emp.department}</td>
                
                <td class="action-cell">
                    <button class="action-btn" data-employee-id="${emp.id}"><i data-lucide="more-horizontal"></i></button>
                    <div class="action-dropdown">
                        <div class="action-dropdown-item view-btn"><i data-lucide="eye"></i> View</div>
                        <div class="action-dropdown-item edit-btn"><i data-lucide="edit-2"></i> Edit</div>
                    </div>
                </td>
            `;
            tableBody.appendChild(row);
        });

        lucide.createIcons(); // Re-render icons for new rows
        updatePaginationButtons();
    }

    function updatePaginationButtons() {
        const totalPages = Math.ceil(filteredEmployees.length / rowsPerPage);
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
    }

    // --- Event Listeners ---
    searchInput.addEventListener('keyup', () => {
        const searchTerm = searchInput.value.toLowerCase();
        filteredEmployees = employees.filter(emp => 
            emp.name.toLowerCase().includes(searchTerm) ||
            emp.email.toLowerCase().includes(searchTerm) ||
            emp.id.toLowerCase().includes(searchTerm) ||
            emp.department.toLowerCase().includes(searchTerm)
        );
        currentPage = 1;
        displayTable();
    });

    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayTable();
        }
    });

    nextPageBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(filteredEmployees.length / rowsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            displayTable();
        }
    });

    // --- Actions Dropdown & Modal Logic ---
    document.body.addEventListener('click', (e) => {
        // Close all dropdowns if clicking outside
        if (!e.target.closest('.action-cell')) {
            document.querySelectorAll('.action-dropdown.show').forEach(d => d.classList.remove('show'));
        }
    });

    tableBody.addEventListener('click', (e) => {
        const actionBtn = e.target.closest('.action-btn');
        const viewBtn = e.target.closest('.view-btn');
        
        if (actionBtn) {
            const dropdown = actionBtn.nextElementSibling;
            // Close other open dropdowns first
            document.querySelectorAll('.action-dropdown.show').forEach(d => {
                if(d !== dropdown) d.classList.remove('show');
            });
            dropdown.classList.toggle('show');
        }

        if (viewBtn) {
            const employeeId = viewBtn.closest('.action-cell').querySelector('.action-btn').dataset.employeeId;
            const employeeData = employees.find(emp => emp.id === employeeId);
            showModal(employeeData);
        }
    });

    function showModal(emp) {
        modalBody.innerHTML = `
            <div class="detail-row"><span class="detail-label">Employee ID</span> <span>${emp.id}</span></div>
            <div class="detail-row"><span class="detail-label">Full Name</span> <span>${emp.name}</span></div>
            <div class="detail-row"><span class="detail-label">Email</span> <span>${emp.email}</span></div>
            <div class="detail-row"><span class="detail-label">Department</span> <span>${emp.department}</span></div>
            <div class="detail-row"><span class="detail-label">Joining Date</span> <span>${emp.joinDate}</span></div>
            <div class="detail-row"><span class="detail-label">Status</span> <span>${emp.status}</span></div>
        `;
        modal.classList.add('show');
    }

    modalCloseBtn.addEventListener('click', () => modal.classList.remove('show'));
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });

    
    // --- Initial Load ---
    displayTable();
});