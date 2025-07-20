document.addEventListener('DOMContentLoaded', function() {
    
    // --- Data Store ---
    const db = {
        scales: [{ id: 1, scale: 'S1', salary: 50000 }, { id: 2, scale: 'S2', salary: 65000 }],
        bonuses: [{ id: 1, name: 'End of Year', amount: 25000 }],
        deductions: [{ id: 1, name: 'NHIF', type: 'Statutory', empPercent: 2.5, comPercent: 0 }],
        allowances: [{ id: 1, name: 'House Allowance', percent: 20 }]
    };

    // --- Helper function ---
    const getDbKey = (type) => (type === 'bonus' ? 'bonuses' : `${type}s`);

    // --- Table Rendering ---
    function renderTable(type, data, tableId, columns) {
        const tableBody = document.querySelector(`#${tableId} tbody`);
        const tableFoot = document.querySelector(`#${tableId} tfoot`);
        tableBody.innerHTML = '';
        tableFoot.innerHTML = '';

        if (!data || data.length === 0) {
            tableFoot.innerHTML = `<tr><td colspan="${columns.length + 1}">No ${type} settings found.</td></tr>`;
            return;
        }

        data.forEach(item => {
            const cellsHTML = columns.map(col => {
                const value = item[col.key] ?? '';
                const displayValue = typeof value === 'number' ? value.toLocaleString('en-US') : value;
                return `<td>${displayValue}${col.suffix || ''}</td>`;
            }).join('');

            tableBody.insertAdjacentHTML('beforeend', `
                <tr>
                    ${cellsHTML}
                    <td class="action-cell"><button class="btn btn-secondary btn-small edit-btn" data-type="${type}" data-id="${item.id}">Edit</button></td>
                </tr>`);
        });
    }

    function renderAllTables() {
        renderTable('scale', db.scales, 'scalesTable', [{ key: 'scale' }, { key: 'salary' }]);
        renderTable('bonus', db.bonuses, 'bonusesTable', [{ key: 'name' }, { key: 'amount' }]);
        renderTable('deduction', db.deductions, 'deductionsTable', [{ key: 'name' }, { key: 'type' }, { key: 'empPercent', suffix: '%' }, { key: 'comPercent', suffix: '%' }]);
        renderTable('allowance', db.allowances, 'allowancesTable', [{ key: 'name' }, { key: 'percent', suffix: '%' }]);
        lucide.createIcons();
    }

    // --- Modal Logic ---
    function showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.add('show');
    }

    function closeModal(modalElement) {
        if (modalElement) modalElement.classList.remove('show');
    }

    function showFormModal(type, id = null) {
        const formModal = document.getElementById('formModal');
        const modalTitle = formModal.querySelector('#modalTitle');
        const modalBody = formModal.querySelector('#modalBody');
        const modalForm = formModal.querySelector('#modalForm');

        const isEdit = id !== null;
        const dbKey = getDbKey(type);
        const item = isEdit ? db[dbKey].find(i => i.id == id) : {};
        
        modalTitle.textContent = `${isEdit ? 'Edit' : 'Add'} ${type.charAt(0).toUpperCase() + type.slice(1)}`;
        
        let formHTML = '';
        switch (type) {
            case 'scale': formHTML = `<div class="form-group"><label class="form-label">Scale Name</label><input name="scale" class="form-control" value="${item.scale||''}" required></div><div class="form-group"><label class="form-label">Salary (KES)</label><input name="salary" class="form-control" type="number" value="${item.salary||''}" required></div>`; break;
            case 'bonus': formHTML = `<div class="form-group"><label class="form-label">Bonus Name</label><input name="name" class="form-control" value="${item.name||''}" required></div><div class="form-group"><label class="form-label">Amount (KES)</label><input name="amount" class="form-control" type="number" value="${item.amount||''}" required></div>`; break;
            case 'deduction': formHTML = `<div class="form-group"><label class="form-label">Deduction Name</label><input name="name" class="form-control" value="${item.name||''}" required></div><div class="form-group"><label class="form-label">Type</label><input name="type" class="form-control" value="${item.type||''}" required></div><div class="form-group"><label class="form-label">Employee %</label><input name="empPercent" class="form-control" type="number" step="0.01" value="${item.empPercent||''}" required></div><div class="form-group"><label class="form-label">Company %</label><input name="comPercent" class="form-control" type="number" step="0.01" value="${item.comPercent||''}" required></div>`; break;
            case 'allowance': formHTML = `<div class="form-group"><label class="form-label">Allowance Name</label><input name="name" class="form-control" value="${item.name||''}" required></div><div class="form-group"><label class="form-label">% of Basic</label><input name="percent" class="form-control" type="number" step="0.01" value="${item.percent||''}" required></div>`; break;
        }
        
        modalBody.innerHTML = formHTML;
        modalForm.dataset.type = type;
        modalForm.dataset.id = id || '';
        showModal('formModal');
    }

    // --- Event Listeners ---
    document.body.addEventListener('click', function(e) {
        if (e.target.closest('.add-btn')) showFormModal(e.target.closest('.add-btn').dataset.type);
        if (e.target.closest('.edit-btn')) showFormModal(e.target.closest('.edit-btn').dataset.type, e.target.closest('.edit-btn').dataset.id);
        if (e.target.closest('.modal-close, .modal-cancel')) closeModal(e.target.closest('.modal-overlay'));
    });

    const mainForm = document.getElementById('modalForm');
    mainForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const { type, id } = e.target.dataset;
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        let isValid = true;
        for (const key in data) {
            if (data[key].trim() === '') {
                isValid = false;
                break;
            }
        }

        if (!isValid) {
            showModal('errorModal');
            return;
        }
        
        Object.keys(data).forEach(key => { if (!isNaN(data[key]) && data[key] !== '') data[key] = parseFloat(data[key]); });
        
        const dbKey = getDbKey(type);
        const dataArray = db[dbKey];
        if (id) {
            const index = dataArray.findIndex(i => i.id == id);
            if (index > -1) dataArray[index] = { ...dataArray[index], ...data };
        } else {
            const newId = dataArray.length > 0 ? Math.max(...dataArray.map(i => i.id)) + 1 : 1;
            dataArray.push({ id: newId, ...data });
        }

        closeModal(document.getElementById('formModal'));
        showModal('successModal');
        renderAllTables();
    });

    // --- Initial Load & Sidebar ---
    renderAllTables();
    lucide.createIcons();

    const sidebarToggle = document.getElementById('sidebar-toggle');
    if(sidebarToggle) sidebarToggle.addEventListener('click', () => {
        document.querySelector('.dashboard-container').classList.toggle('sidebar-collapsed');
    });
});