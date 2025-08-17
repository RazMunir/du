// Load history from localStorage or initialize empty array
let history = JSON.parse(localStorage.getItem('profitHistory')) || [];

// Update table on page load
document.addEventListener('DOMContentLoaded', () => {
    updateHistoryTable();
});

function calculateProfit() {
    const revenue = parseFloat(document.getElementById('revenue').value) || 0;
    const costs = parseFloat(document.getElementById('costs').value) || 0;
    const profit = revenue - costs;
    const resultDiv = document.getElementById('result');
    const errorDiv = document.getElementById('error');

    // Display result
    resultDiv.textContent = `Daily Profit: $${profit.toFixed(2)}`;
    resultDiv.className = 'result';
    if (profit >= 0) {
        resultDiv.classList.add('positive');
    } else {
        resultDiv.classList.add('negative');
    }
    errorDiv.textContent = ''; // Clear any previous errors

    // Add to history with current date and time (adjusted for +06 timezone)
    const date = new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Dhaka' // +06 timezone
    });
    history.push({ date, revenue, costs, profit });

    // Save to localStorage
    try {
        localStorage.setItem('profitHistory', JSON.stringify(history));
    } catch (e) {
        document.getElementById('error').textContent = 'Error saving to localStorage: ' + e.message;
        console.error('localStorage error:', e);
        return;
    }

    // Update table
    updateHistoryTable();
}

function updateHistoryTable() {
    const historyBody = document.getElementById('historyBody');
    historyBody.innerHTML = ''; // Clear existing rows

    history.forEach(entry => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${entry.date}</td>
            <td>$${entry.revenue.toFixed(2)}</td>
            <td>$${entry.costs.toFixed(2)}</td>
            <td class="${entry.profit >= 0 ? 'positive' : 'negative'}">$${entry.profit.toFixed(2)}</td>
        `;
        historyBody.appendChild(row);
    });
}

function clearHistory() {
    if (confirm('Are you sure you want to clear the calculation history?')) {
        history = [];
        try {
            localStorage.removeItem('profitHistory');
        } catch (e) {
            document.getElementById('error').textContent = 'Error clearing localStorage: ' + e.message;
            console.error('localStorage clear error:', e);
            return;
        }
        updateHistoryTable();
        document.getElementById('result').textContent = '';
        document.getElementById('error').textContent = '';
    }
}

function exportToCSV() {
    const errorDiv = document.getElementById('error');
    if (history.length === 0) {
        errorDiv.textContent = 'No history to export!';
        return;
    }

    try {
        // Create CSV content
        let csvContent = 'Date,Revenue ($),Costs ($),Profit ($)\n';
        history.forEach(entry => {
            // Escape quotes in date and wrap in quotes to handle commas
            const escapedDate = entry.date.replace(/"/g, '""');
            csvContent += `"${escapedDate}",${entry.revenue.toFixed(2)},${entry.costs.toFixed(2)},${entry.profit.toFixed(2)}\n`;
        });

        // Create a downloadable file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `profit_history_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        errorDiv.textContent = ''; // Clear any previous errors
    } catch (e) {
        errorDiv.textContent = 'Error exporting to CSV: ' + e.message;
        console.error('Export error:', e);
    }
}

function importFromCSV() {
    const fileInput = document.getElementById('importFile');
    const errorDiv = document.getElementById('error');
    const file = fileInput.files[0];
    if (!file) {
        errorDiv.textContent = 'Please select a CSV file to import.';
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const text = e.target.result;
            const rows = text.split('\n').slice(1); // Skip header row
            const importedHistory = [];

            for (const row of rows) {
                if (row.trim() === '') continue; // Skip empty rows
                // Use regex to handle quoted fields and commas correctly
                const match = row.match(/(?:"([^"]*)"|([^,]*))(?:,|$)/g);
                if (!match || match.length < 4) {
                    errorDiv.textContent = 'Invalid CSV format. Ensure it has Date,Revenue ($),Costs ($),Profit ($) columns.';
                    return;
                }
                const [date, revenue, costs, profit] = match.map(item => item.replace(/^"|"$/g, '').replace(/,$/, '').trim());
                const parsedRevenue = parseFloat(revenue);
                const parsedCosts = parseFloat(costs);
                const parsedProfit = parseFloat(profit);
                if (!date || isNaN(parsedRevenue) || isNaN(parsedCosts) || isNaN(parsedProfit)) {
                    errorDiv.textContent = 'Invalid CSV data. Ensure numeric values for Revenue, Costs, and Profit.';
                    return;
                }
                importedHistory.push({
                    date: date,
                    revenue: parsedRevenue,
                    costs: parsedCosts,
                    profit: parsedProfit
                });
            }

            // Merge imported history with existing history
            history = [...history, ...importedHistory];
            try {
                localStorage.setItem('profitHistory', JSON.stringify(history));
            } catch (e) {
                errorDiv.textContent = 'Error saving to localStorage: ' + e.message;
                console.error('localStorage save error:', e);
                return;
            }
            updateHistoryTable();
            fileInput.value = ''; // Clear file input
            errorDiv.textContent = 'History imported successfully!';
        } catch (e) {
            errorDiv.textContent = 'Error parsing CSV: ' + e.message;
            console.error('Import error:', e);
        }
    };
    reader.onerror = function () {
        errorDiv.textContent = 'Error reading the file. Please try again.';
        console.error('FileReader error');
    };
    reader.readAsText(file);
}
