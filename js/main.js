document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize Lucid Icons
    lucide.createIcons();

    // --- Sidebar Toggle Functionality ---
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebarMobileToggle = document.getElementById('sidebar-toggle-mobile');

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }
    
    if(sidebarMobileToggle) {
        sidebarMobileToggle.addEventListener('click', () => {
             sidebar.classList.remove('open');
        });
    }


    // --- ApexCharts Initialization ---

    // Chart 1: Monthly Payment Trends (Line Chart)
    const monthlyPaymentsOptions = {
        chart: {
            type: 'area',
            height: 350,
            toolbar: { show: false },
            zoom: { enabled: false }
        },
        series: [{
            name: 'Payments',
            data: [31000, 40000, 28000, 51000, 42000, 109000, 100000]
        }],
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        },
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: 2 },
        fill: {
            type: "gradient",
            gradient: {
              shadeIntensity: 1,
              opacityFrom: 0.7,
              opacityTo: 0.9,
              stops: [0, 90, 100]
            }
        },
        colors: ['#4F46E5'], // Primary Button Color
    };

    const monthlyPaymentsChart = new ApexCharts(document.querySelector("#monthly-payments-chart"), monthlyPaymentsOptions);
    monthlyPaymentsChart.render();


    // Chart 2: Salary by Department (Donut Chart)
    const salaryByDeptOptions = {
        chart: {
            type: 'donut',
            height: 350,
        },
        series: [44000, 55000, 41000, 17000, 15000],
        labels: ['Engineering', 'Sales', 'Marketing', 'HR', 'Support'],
        dataLabels: { enabled: false },
        legend: {
            position: 'bottom'
        },
        colors: ['#667eea', '#f7971e', '#2af598', '#EF4444', '#6B7280'],
    };

    const salaryByDeptChart = new ApexCharts(document.querySelector("#salary-by-department-chart"), salaryByDeptOptions);
    salaryByDeptChart.render();

});
