document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize icons on initial page load
    lucide.createIcons();

    // --- Sidebar Toggle Logic ---
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebarMobileToggle = document.getElementById('sidebar-toggle-mobile');

    if (sidebarToggle) {
        // This is for larger screens, it pins/unpins the sidebar
        sidebarToggle.addEventListener('click', () => {
             document.querySelector('.dashboard-container').classList.toggle('sidebar-collapsed');
        });
        // This is for smaller screens, it shows the sidebar
        sidebarToggle.addEventListener('click', () => sidebar.classList.add('open'));
    }
    if (sidebarMobileToggle) {
        // This closes the sidebar on mobile
        sidebarMobileToggle.addEventListener('click', () => sidebar.classList.remove('open'));
    }

    // --- Data Sources ---
    // Summary data for the main table
    const employeePayslips = [
        { id: 'PS-JUL2025-001', period: 'July 2025', netPay: 137220 },
        { id: 'PS-JUN2025-001', period: 'June 2025', netPay: 137220 },
        { id: 'PS-MAY2025-001', period: 'May 2025', netPay: 136800 },
        { id: 'PS-APR2025-001', period: 'April 2025', netPay: 136800 },
    ];
    
    // Detailed data for the payslip view
    const payslipDetailsData = {
        'PS-JUL2025-001': {
            payPeriod: 'July 2025', payDate: 'July 31, 2025',
            earnings: [ { name: 'Basic Salary', amount: 150000 }, { name: 'Housing Allowance', amount: 20000 } ],
            deductions: [ { name: 'PAYE Tax', amount: 24580 }, { name: 'NHIF', amount: 1700 }, { name: 'NSSF', amount: 6500 } ]
        },
        'PS-JUN2025-001': {
            payPeriod: 'June 2025', payDate: 'June 30, 2025',
            earnings: [ { name: 'Basic Salary', amount: 150000 }, { name: 'Housing Allowance', amount: 20000 } ],
            deductions: [ { name: 'PAYE Tax', amount: 24580 }, { name: 'NHIF', amount: 1700 }, { name: 'NSSF', amount: 6500 } ]
        },
        'PS-MAY2025-001': {
            payPeriod: 'May 2025', payDate: 'May 31, 2025',
            earnings: [ { name: 'Basic Salary', amount: 150000 }, { name: 'Bonus', amount: 10000 } ],
            deductions: [ { name: 'PAYE Tax', amount: 25000 }, { name: 'NHIF', amount: 1700 }, { name: 'NSSF', amount: 6500 } ]
        },
        'PS-APR2025-001': {
            payPeriod: 'April 2025', payDate: 'April 30, 2025',
            earnings: [ { name: 'Basic Salary', amount: 150000 } ],
            deductions: [ { name: 'PAYE Tax', amount: 25000 }, { name: 'NHIF', amount: 1700 }, { name: 'NSSF', amount: 6500 } ]
        }
    };


    // --- DOM Elements ---
    const tableBody = document.querySelector('#payslipsTable tbody');
    const searchInput = document.getElementById('payslipSearchInput');
    const payslipContainer = document.getElementById('payslip-view-container');

    // --- Helper for currency formatting ---
    const formatCurrency = (amount) => amount.toLocaleString('en-KE', { style: 'currency', currency: 'KES', minimumFractionDigits: 2 });

    // --- Function to display payslips in the table ---
    function displayPayslips(data) {
        tableBody.innerHTML = ''; // Clear existing rows

        if (data.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding: 2rem;">No payslips found.</td></tr>';
            return;
        }

        data.forEach(payslip => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${payslip.id}</td>
                <td>${payslip.period}</td>
                
                <td class="action-cell">
                    <button class="btn btn-primary btn-small view-payslip-btn" data-payslip-id="${payslip.id}">View</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
    
    // --- Function to populate and show the payslip view ---
    function showPayslip(payslipId) {
        const data = payslipDetailsData[payslipId];
        if (!data) {
            console.error('No details found for payslip ID:', payslipId);
            return;
        }

        // Populate basic info
        document.getElementById('ps-pay-period').textContent = data.payPeriod;
        document.getElementById('ps-pay-date').textContent = data.payDate;

        // Populate details table (Earnings & Deductions)
        const detailsBody = document.getElementById('ps-details-body');
        detailsBody.innerHTML = '';
        const maxRows = Math.max(data.earnings.length, data.deductions.length);
        let grossEarnings = 0;
        let totalDeductions = 0;

        for (let i = 0; i < maxRows; i++) {
            const row = document.createElement('tr');
            const earning = data.earnings[i];
            const deduction = data.deductions[i];
            
            if(earning) grossEarnings += earning.amount;
            if(deduction) totalDeductions += deduction.amount;

            row.innerHTML = `
                <td>${earning ? earning.name : ''}</td>
                <td style="text-align: right;">${earning ? formatCurrency(earning.amount) : ''}</td>
                <td>${deduction ? deduction.name : ''}</td>
                <td style="text-align: right;">${deduction ? formatCurrency(deduction.amount) : ''}</td>
            `;
            detailsBody.appendChild(row);
        }

        // Populate summary
        document.getElementById('ps-gross-earnings').textContent = formatCurrency(grossEarnings);
        document.getElementById('ps-total-deductions').textContent = formatCurrency(totalDeductions);
        document.getElementById('ps-net-pay').textContent = formatCurrency(grossEarnings - totalDeductions);

        // Show the container
        payslipContainer.classList.remove('payslip-container-hidden');
        payslipContainer.classList.add('payslip-container-visible');
        
        // IMPORTANT: Re-render icons that were added dynamically
        lucide.createIcons();
        
        // Scroll to the payslip
        payslipContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // --- Function to hide the payslip view ---
    function hidePayslip() {
        payslipContainer.classList.add('payslip-container-hidden');
        payslipContainer.classList.remove('payslip-container-visible');
    }

    // --- Event Listeners ---

    // 1. Search Functionality
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const filteredPayslips = employeePayslips.filter(p => 
            p.id.toLowerCase().includes(searchTerm) ||
            p.period.toLowerCase().includes(searchTerm)
        );
        displayPayslips(filteredPayslips);
        hidePayslip(); // Hide payslip view when searching
    });
    
    // 2. View Button Clicks (using Event Delegation)
    tableBody.addEventListener('click', function(event) {
        if (event.target.classList.contains('view-payslip-btn')) {
            const payslipId = event.target.dataset.payslipId;
            showPayslip(payslipId);
        }
    });

    // 3. Print/Download Button
    document.getElementById('print-payslip-btn').addEventListener('click', () => {
        window.print();
    });

    // 4. Close Button for Payslip View
    document.getElementById('close-payslip-btn').addEventListener('click', () => {
        hidePayslip();
    });

    // --- Initial Load ---
    displayPayslips(employeePayslips);
});