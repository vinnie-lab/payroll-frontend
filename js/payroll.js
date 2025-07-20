document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize Lucid Icons
    lucide.createIcons();

    // --- Sidebar Toggle Logic (same as before) ---
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebarMobileToggle = document.getElementById('sidebar-toggle-mobile');
    if (sidebarToggle) sidebarToggle.addEventListener('click', () => document.querySelector('.dashboard-container').classList.toggle('sidebar-collapsed'));
    if (sidebarMobileToggle) sidebarMobileToggle.addEventListener('click', () => sidebar.classList.remove('open'));
    if (document.getElementById('sidebar-toggle')) document.getElementById('sidebar-toggle').addEventListener('click', () => sidebar.classList.add('open'));

    // --- Sample Data ---
    const payrollData = [
        { period: 'July 2025', total: 8550000, employees: 110, id: 'pr-07-2025' },
        { period: 'June 2025', total: 8495000, employees: 109, id: 'pr-06-2025' },
        { period: 'May 2025', total: 8450000, employees: 108, id: 'pr-05-2025' },
        { period: 'April 2025', total: 8310000, employees: 105, id: 'pr-04-2025' },
        { period: 'March 2025', total: 8250000, employees: 104, id: 'pr-03-2025' },
    ];
    const payslipData = {
        'PS-JUL2025-001': { id: 'PS-JUL2025-001', period: 'July 2025', empName: 'Alicia Heart', empId: 'ZEP001', department: 'Engineering', basic: 120000, houseAllowance: 30000, transport: 15000, paye: 25000, nhif: 1700, nssf: 1080 },
        'PS-JUL2025-002': { id: 'PS-JUL2025-002', period: 'July 2025', empName: 'Brian Lowe', empId: 'ZEP002', department: 'Marketing', basic: 95000, houseAllowance: 25000, transport: 10000, paye: 18000, nhif: 1500, nssf: 1080 },
    };

    let filteredPayroll = [...payrollData];
    let currentPage = 1;
    const rowsPerPage = 5;

    // --- DOM Elements ---
    const payrollTableBody = document.querySelector('#payrollTable tbody');
    const searchInput = document.getElementById('payrollSearchInput');
    const prevPageBtn = document.getElementById('payrollPrevPageBtn');
    const nextPageBtn = document.getElementById('payrollNextPageBtn');
    const pageInfo = document.getElementById('payrollPageInfo');
    const successModal = document.getElementById('successModal');

    // --- Payroll Table Logic ---
    function displayPayrollTable() {
        payrollTableBody.innerHTML = '';
        const totalPages = Math.ceil(filteredPayroll.length / rowsPerPage);
        pageInfo.textContent = `Page ${currentPage} of ${totalPages || 1}`;
        
        const paginatedItems = filteredPayroll.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

        paginatedItems.forEach(run => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${run.period}</td>
                <td>${run.total.toLocaleString('en-US')}</td>
                <td>${run.employees}</td>
                <td class="action-cell">
                    <button class="action-btn" data-payroll-id="${run.id}"><i data-lucide="more-horizontal"></i></button>
                    <div class="action-dropdown">
                        <div class="action-dropdown-item view-details-btn"><i data-lucide="eye"></i> View</div>
                    </div>
                </td>
            `;
            payrollTableBody.appendChild(row);
        });
        lucide.createIcons();
        updatePaginationButtons();
    }

    function updatePaginationButtons() {
        const totalPages = Math.ceil(filteredPayroll.length / rowsPerPage);
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
    }

    // --- Event Listeners for Payroll List ---
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        filteredPayroll = payrollData.filter(p => p.period.toLowerCase().includes(searchTerm));
        currentPage = 1;
        displayPayrollTable();
    });
    prevPageBtn.addEventListener('click', () => { if (currentPage > 1) { currentPage--; displayPayrollTable(); } });
    nextPageBtn.addEventListener('click', () => { if (currentPage < Math.ceil(filteredPayroll.length / rowsPerPage)) { currentPage++; displayPayrollTable(); } });

    // --- Action Dropdown Logic ---
    payrollTableBody.addEventListener('click', (e) => {
        const actionBtn = e.target.closest('.action-btn');
        const viewBtn = e.target.closest('.view-details-btn');

        if (actionBtn) {
            const dropdown = actionBtn.nextElementSibling;
            document.querySelectorAll('.action-dropdown.show').forEach(d => d !== dropdown && d.classList.remove('show'));
            dropdown.classList.toggle('show');
        }
        if (viewBtn) {
            const payrollId = viewBtn.closest('.action-cell').querySelector('.action-btn').dataset.payrollId;
            showPayrollDetailView(payrollId);
        }
    });
    document.body.addEventListener('click', (e) => { if (!e.target.closest('.action-cell')) document.querySelectorAll('.action-dropdown.show').forEach(d => d.classList.remove('show')); });
    
    // --- "Run Payroll" Modal Logic ---
    document.getElementById('runPayrollBtn').addEventListener('click', () => successModal.classList.add('show'));
    successModal.addEventListener('click', (e) => { if (e.target.matches('.modal-overlay, .modal-close')) successModal.classList.remove('show'); });

    // --- View Switching Logic ---
    const listView = document.getElementById('payroll-list-view');
    const detailView = document.getElementById('payroll-detail-view');

    function showPayrollDetailView(payrollId) {
        const data = payrollData.find(p => p.id === payrollId);
        listView.style.display = 'none';
        
        detailView.innerHTML = `
            <section class="panel">
                <div class="detail-view-header">
                    <button id="backToListBtn" class="btn btn-secondary btn-medium"><i data-lucide="arrow-left"></i> Back</button>
                    <h2>Payroll Details: ${data.period}</h2>
                </div>
                <p>A summary of all employee payments for this period.</p>
                <div class="table-container">
                    <table>
                       <thead>
                         <tr><th>Employee ID</th><th>Name</th><th>Department</th><th>Net Pay (KES)</th></tr>
                       </thead>
                       <tbody>
                         <tr><td>ZEP001</td><td>Alicia Heart</td><td>Engineering</td><td>130,520.00</td></tr>
                         <tr><td>ZEP002</td><td>Brian Lowe</td><td>Marketing</td><td>109,720.00</td></tr>
                         <!-- More rows for a real application -->
                       </tbody>
                    </table>
                </div>
            </section>
        `;
        detailView.style.display = 'block';
        lucide.createIcons();
        document.getElementById('backToListBtn').addEventListener('click', showPayrollListView);
    }
    
    function showPayrollListView() {
        detailView.style.display = 'none';
        listView.style.display = 'block';
    }
    
    // --- Payslip Lookup Logic ---
    const payslipIdInput = document.getElementById('payslipIdInput');
    const viewPayslipBtn = document.getElementById('viewPayslipBtn');
    const payslipDisplayArea = document.getElementById('payslip-display-area');

    viewPayslipBtn.addEventListener('click', () => {
        const payslipId = payslipIdInput.value.trim().toUpperCase();
        const data = payslipData[payslipId];
        
        if (data) {
            const gross = data.basic + data.houseAllowance + data.transport;
            const deductions = data.paye + data.nhif + data.nssf;
            const net = gross - deductions;

            payslipDisplayArea.innerHTML = `
                <div class="payslip-header">
                    <div>
                        <p class="logo-text">Zephyra Payroll</p>
                        <p>Official Company Payslip</p>
                    </div>
                    <h3>Payslip</h3>
                </div>
                
                <div class="employee-info">
                    <strong>Employee Name:</strong> <span>${data.empName}</span>
                    <strong>Employee ID:</strong> <span>${data.empId}</span>
                    <strong>Department:</strong> <span>${data.department}</span>
                    <strong>Pay Period:</strong> <span>${data.period}</span>
                    <strong>Payslip ID:</strong> <span>${data.id}</span>
                </div>
                <div class="payslip-header"></div>
                <div class="payslip-details">
                    <table>
                        <thead>
                            <tr><th>Earnings</th><th>Amount (KES)</th><th>Deductions</th><th>Amount (KES)</th></tr>
                        </thead>
                        <tbody>
                            <tr><td>Basic Salary</td><td>${data.basic.toLocaleString()}</td><td>PAYE</td><td>${data.paye.toLocaleString()}</td></tr>
                            <tr><td>House Allowance</td><td>${data.houseAllowance.toLocaleString()}</td><td>NHIF</td><td>${data.nhif.toLocaleString()}</td></tr>
                            <tr><td>Transport Allowance</td><td>${data.transport.toLocaleString()}</td><td>NSSF</td><td>${data.nssf.toLocaleString()}</td></tr>
                            <tr><td></td><td></td><td></td><td></td></tr>
                            <tr>
                                <th>Total Earnings</th><th>${gross.toLocaleString()}</th>
                                <th>Total Deductions</th><th>${deductions.toLocaleString()}</th>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="payslip-summary">
                    <p><strong>Net Salary Payable:</strong> <span class="net-pay">KES ${net.toLocaleString()}</span></p>
                </div>
                <div class="payslip-actions">
                    <button class="btn btn-primary btn-medium" onclick="window.print()"><i data-lucide="printer"></i> Download Payslip</button>
                </div>
            `;
            payslipDisplayArea.className = 'payslip-container-visible';
            lucide.createIcons();
        } else {
            payslipDisplayArea.innerHTML = `<p style="color:red; text-align:center;">Payslip ID not found.</p>`;
            payslipDisplayArea.className = 'payslip-container-visible';
        }
    });

    // --- Initial Load ---
    displayPayrollTable();
});