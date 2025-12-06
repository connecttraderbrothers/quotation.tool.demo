var items = [];
var currentRateType = 'job';
var estimateNumber = 1;

var tradeRates = {
    'Downtakings': { hourly: 30, daily: 220, job: 0 },
    'General Building': { hourly: 30, daily: 230, job: 0 },
    'Building work': { hourly: 30, daily: 230, job: 0 },
    'Carpentry': { hourly: 32, daily: 240, job: 0 },
    'Joinery': { hourly: 32, daily: 240, job: 0 },
    'Electrical': { hourly: 45, daily: 320, job: 200 },
    'Plumbing': { hourly: 45, daily: 300, job: 200 },
    'Gas work/Plumbing': { hourly: 50, daily: 340, job: 250 },
    'Plastering': { hourly: 30, daily: 240, job: 0 },
    'Skimming /Painting': { hourly: 28, daily: 220, job: 0 },
    'Painting & Decorating': { hourly: 28, daily: 220, job: 0 },
    'Tiling': { hourly: 32, daily: 250, job: 0 },
    'Roofing': { hourly: 35, daily: 260, job: 0 },
    'Kitchen Fitting': { hourly: 32, daily: 250, job: 3000 },
    'Bathroom Fitting': { hourly: 32, daily: 250, job: 2200 },
    'Bathrooms': { hourly: 32, daily: 250, job: 2200 },
    'Flooring': { hourly: 28, daily: 220, job: 0 },
    'Bricklaying': { hourly: 32, daily: 250, job: 0 },
    'HVAC': { hourly: 40, daily: 300, job: 0 },
    'Groundworks': { hourly: 30, daily: 230, job: 0 },
    'Scaffolding': { hourly: 0, daily: 200, job: 0 },
    'Glazing': { hourly: 32, daily: 250, job: 0 },
    'Insulation': { hourly: 28, daily: 220, job: 0 },
    'Materials': { hourly: 0, daily: 0, job: 0 }
};

if (localStorage.getItem('traderBrosEstimateCount')) {
    estimateNumber = parseInt(localStorage.getItem('traderBrosEstimateCount')) + 1;
}
updateEstimateCounter();

function updateEstimateCounter() {
    document.getElementById('estimateCounter').textContent = '#' + String(estimateNumber).padStart(4, '0');
}

document.getElementById('clientName').addEventListener('input', function() {
    var name = this.value.trim();
    if (name) {
        var parts = name.split(' ');
        var customerId = '';
        
        if (parts.length >= 2) {
            var firstName = parts[0].substring(0, 3).toUpperCase();
            var lastName = parts[parts.length - 1].substring(0, 3).toUpperCase();
            var randomNum = Math.floor(1000 + Math.random() * 9000);
            customerId = firstName + lastName + randomNum;
        } else if (parts.length === 1) {
            var singleName = parts[0].substring(0, 6).toUpperCase();
            var randomNum = Math.floor(1000 + Math.random() * 9000);
            customerId = singleName + randomNum;
        }
        
        document.getElementById('customerId').value = customerId;
    } else {
        document.getElementById('customerId').value = '';
    }
});

document.getElementById('tradeCategory').addEventListener('change', function() {
    var selectedTrade = this.value;
    var rateInfo = document.getElementById('tradeRateInfo');
    
    if (selectedTrade && tradeRates[selectedTrade]) {
        var rates = tradeRates[selectedTrade];
        var infoText = 'Standard rates: ';
        var rateParts = [];
        
        if (rates.hourly > 0) rateParts.push('£' + rates.hourly + '/hr');
        if (rates.daily > 0) rateParts.push('£' + rates.daily + '/day');
        if (rates.job > 0) rateParts.push('£' + rates.job + '/job');
        
        if (rateParts.length > 0) {
            infoText += rateParts.join(' | ');
            rateInfo.textContent = infoText;
        } else {
            rateInfo.textContent = '';
        }
        
        updatePriceFromTrade();
    } else {
        rateInfo.textContent = '';
        document.getElementById('unitPrice').value = '';
    }
});

function updatePriceFromTrade() {
    var selectedTrade = document.getElementById('tradeCategory').value;
    if (selectedTrade && tradeRates[selectedTrade]) {
        var rates = tradeRates[selectedTrade];
        var price = 0;
        
        if (currentRateType === 'hourly' && rates.hourly > 0) {
            price = rates.hourly;
        } else if (currentRateType === 'daily' && rates.daily > 0) {
            price = rates.daily;
        } else if (currentRateType === 'job' && rates.job > 0) {
            price = rates.job;
        }
        
        if (price > 0) {
            document.getElementById('unitPrice').value = price;
        }
    }
}

document.querySelectorAll('.rate-type-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.rate-type-btn').forEach(function(b) {
            b.classList.remove('active');
        });
        this.classList.add('active');
        currentRateType = this.getAttribute('data-type');
        
        var customUnitGroup = document.getElementById('customUnitGroup');
        var rateLabel = document.getElementById('rateLabel');
        
        if (currentRateType === 'custom') {
            customUnitGroup.classList.remove('hidden');
            rateLabel.textContent = 'Unit Price (£) *';
        } else if (currentRateType === 'daily') {
            customUnitGroup.classList.add('hidden');
            rateLabel.textContent = 'Day Rate (£) *';
        } else if (currentRateType === 'job') {
            customUnitGroup.classList.add('hidden');
            rateLabel.textContent = 'Per Job Rate (£) *';
        } else {
            customUnitGroup.classList.add('hidden');
            rateLabel.textContent = 'Hourly Rate (£) *';
        }
        
        updatePriceFromTrade();
    });
});

function addItem() {
    var category = document.getElementById('tradeCategory').value || 'General';
    var description = document.getElementById('description').value;
    var quantity = parseFloat(document.getElementById('quantity').value);
    var unitPrice = parseFloat(document.getElementById('unitPrice').value);
    var customUnit = document.getElementById('customUnit').value;

    if (!description || !unitPrice) {
        alert('Please enter description and unit price');
        return;
    }

    var unit = '';
    if (currentRateType === 'hourly') {
        unit = 'hour';
    } else if (currentRateType === 'daily') {
        unit = 'day';
    } else if (currentRateType === 'job') {
        unit = 'job';
    } else {
        unit = customUnit || 'item';
    }

    var lineTotal = unitPrice * quantity;

    items.push({
        category: category,
        description: description,
        quantity: quantity,
        unit: unit,
        unitPrice: unitPrice,
        lineTotal: lineTotal
    });

    updateQuoteTable();
    
    document.getElementById('description').value = '';
    document.getElementById('quantity').value = '1';
    document.getElementById('unitPrice').value = '';
    document.getElementById('customUnit').value = '';
    document.getElementById('tradeCategory').selectedIndex = 0;
    document.getElementById('tradeRateInfo').textContent = '';
}

function removeItem(index) {
    items.splice(index, 1);
    updateQuoteTable();
}

function updateQuoteTable() {
    var tbody = document.getElementById('quoteItems');
    var quoteSection = document.getElementById('quoteSection');
    var generateSection = document.getElementById('generateSection');

    if (items.length === 0) {
        quoteSection.style.display = 'none';
        generateSection.style.display = 'none';
        return;
    }

    quoteSection.style.display = 'block';
    generateSection.style.display = 'block';

    var html = '';
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        html += '<tr>';
        html += '<td>' + item.category + '</td>';
        html += '<td>' + item.description + '</td>';
        html += '<td class="text-center">' + item.quantity + '</td>';
        html += '<td class="text-right">£' + item.unitPrice.toFixed(2) + '</td>';
        html += '<td class="text-right" style="font-weight: 600;">£' + item.lineTotal.toFixed(2) + '</td>';
        html += '<td class="text-center"><button class="btn-delete" onclick="removeItem(' + i + ')">Delete</button></td>';
        html += '</tr>';
    }

    var subtotal = 0;
    for (var j = 0; j < items.length; j++) {
        subtotal += items[j].lineTotal;
    }

    var vat = subtotal * 0.20;
    var total = subtotal + vat;
    
    html += '<tr class="total-row">';
    html += '<td colspan="4" class="text-right">Subtotal:</td>';
    html += '<td class="text-right">£' + subtotal.toFixed(2) + '</td>';
    html += '<td></td>';
    html += '</tr>';
    html += '<tr class="total-row">';
    html += '<td colspan="4" class="text-right">VAT (20%):</td>';
    html += '<td class="text-right">£' + vat.toFixed(2) + '</td>';
    html += '<td></td>';
    html += '</tr>';
    html += '<tr class="total-row">';
    html += '<td colspan="4" class="text-right" style="font-size: 16px;"><strong>TOTAL:</strong></td>';
    html += '<td class="text-right" style="font-size: 16px;"><strong>£' + total.toFixed(2) + '</strong></td>';
    html += '<td></td>';
    html += '</tr>';

    tbody.innerHTML = html;
}

function previewQuote() {
    var clientName = document.getElementById('clientName').value || '[Client Name]';
    var clientPhone = document.getElementById('clientPhone').value;
    var projectName = document.getElementById('projectName').value || '[Project Name]';
    var projectAddress = document.getElementById('projectAddress').value || '[Project Address]';
    var customerId = document.getElementById('customerId').value || 'N/A';
    var depositPercent = document.getElementById('depositPercent').value || '30';
    
    var today = new Date();
    var quoteDate = today.toLocaleDateString('en-GB');
    var expiryDate = new Date(today.getTime() + 31 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB');
    var estNumber = String(estimateNumber).padStart(4, '0');
    
    var subtotal = 0;
    for (var j = 0; j < items.length; j++) {
        subtotal += items[j].lineTotal;
    }
    var vat = subtotal * 0.20;
    var total = subtotal + vat;

    var categories = {};
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (!categories[item.category]) {
            categories[item.category] = [];
        }
        categories[item.category].push(item);
    }

    var previewHtml = '<div class="preview-content">';
    previewHtml += '<div class="preview-header">';
    previewHtml += '<div class="preview-logo"><img src="https://github.com/infotraderbrothers-lgtm/traderbrothers-assets-logo/blob/main/Trader%20Brothers.png?raw=true" alt="TB"></div>';
    previewHtml += '<div class="preview-company-info">';
    previewHtml += '<div class="preview-company">TRADER BROTHERS LTD</div>';
    previewHtml += '<div>8 Craigour Terrace</div>';
    previewHtml += '<div>Edinburgh, EH17 7PB</div>';
    previewHtml += '<div>📞: 07979309957</div>';
    previewHtml += '<div>✉: traderbrotherslimited@gmail.com</div>';
    previewHtml += '</div></div>';

    previewHtml += '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 15px 0; padding-top: 10px; border-top: 1px solid #ddd;">';
    previewHtml += '<div>';
    previewHtml += '<div style="font-weight: bold; margin-bottom: 8px;">Estimate for</div>';
    previewHtml += '<div>' + clientName + '</div>';
    previewHtml += '<div>' + projectName + '</div>';
    previewHtml += '<div>' + projectAddress + '</div>';
    if (clientPhone) previewHtml += '<div>' + clientPhone + '</div>';
    previewHtml += '</div>';
    previewHtml += '<div style="text-align: right;">';
    previewHtml += '<div><strong>Date</strong> ' + quoteDate + '</div>';
    previewHtml += '<div><strong>Estimate #</strong> ' + estNumber + '</div>';
    previewHtml += '<div><strong>Customer ID</strong> ' + customerId + '</div>';
    previewHtml += '<div><strong>Expiry date</strong> ' + expiryDate + '</div>';
    previewHtml += '</div>';
    previewHtml += '</div>';

    previewHtml += '<table class="preview-table">';
    previewHtml += '<thead><tr>';
    previewHtml += '<th style="width: 55%;">Description</th>';
    previewHtml += '<th style="text-align: center; width: 10%;">Qty</th>';
    previewHtml += '<th style="text-align: right; width: 17%;">Unit price</th>';
    previewHtml += '<th style="text-align: right; width: 18%;">Total price</th>';
    previewHtml += '</tr></thead>';
    previewHtml += '<tbody>';

    for (var category in categories) {
        previewHtml += '<tr class="preview-category">';
        previewHtml += '<td colspan="4"><strong>' + category + '</strong></td>';
        previewHtml += '</tr>';

        var categoryItems = categories[category];
        for (var k = 0; k < categoryItems.length; k++) {
            var item = categoryItems[k];
            previewHtml += '<tr>';
            previewHtml += '<td>' + item.description + '</td>';
            previewHtml += '<td style="text-align: center;">' + item.quantity + '</td>';
            previewHtml += '<td style="text-align: right;">£' + item.unitPrice.toFixed(2) + '</td>';
            previewHtml += '<td style="text-align: right;">£' + item.lineTotal.toFixed(2) + '</td>';
            previewHtml += '</tr>';
        }
    }

    previewHtml += '</tbody></table>';

    previewHtml += '<div style="margin-top: 15px; font-size: 10px;">';
    previewHtml += '<div style="margin-bottom: 10px;"><strong>Notes:</strong></div>';
    previewHtml += '<div>1. Estimate valid for 31 days</div>';
    previewHtml += '<div>2. Deposit of ' + depositPercent + '% is required to secure start date</div>';
    previewHtml += '<div>3. Extra works to be charged accordingly</div>';
    var customNotes = document.getElementById('customNotes').value;
    if (customNotes) {
        previewHtml += '<div style="margin-top: 8px;">4. ' + customNotes + '</div>';
    }
    previewHtml += '</div>';

    previewHtml += '<div style="text-align: right; margin-top: 15px; font-size: 10px;">';
    previewHtml += '<div style="margin-bottom: 3px;"><strong>Subtotal</strong> £' + subtotal.toFixed(2) + '</div>';
    previewHtml += '<div style="margin-bottom: 3px;"><strong>VAT</strong> £' + vat.toFixed(2) + '</div>';
    previewHtml += '<div style="font-size: 12px; font-weight: bold; padding-top: 5px; border-top: 1px solid #ddd;">£' + total.toFixed(2) + '</div>';
    previewHtml += '</div>';

    previewHtml += '<div style="margin-top: 15px; font-size: 8px; border-top: 1px solid #ddd; padding-top: 8px;">';
    previewHtml += 'If you have any questions about this estimate, please contact traderbrotherslimited@gmail.com, or 07979309957.<br>';
    previewHtml += '<strong>Thank you for your business</strong>';
    previewHtml += '</div>';

    previewHtml += '</div>';

    document.getElementById('previewBody').innerHTML = previewHtml;
    document.getElementById('previewModal').style.display = 'block';
}

function closePreview() {
    document.getElementById('previewModal').style.display = 'none';
}

function downloadQuote() {
    var projectAddress = document.getElementById('projectAddress').value || '[Project Address]';
    var estNumber = String(estimateNumber).padStart(4, '0');
    
    // Get the preview content
    var previewContent = document.getElementById('previewBody');
    
    // Use html2canvas to capture the preview as an image
    html2canvas(previewContent, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
    }).then(function(canvas) {
        var imgData = canvas.toDataURL('image/png');
        
        var { jsPDF } = window.jspdf;
        var doc = new jsPDF('p', 'mm', 'a4');
        
        var imgWidth = 210; // A4 width in mm
        var pageHeight = 297; // A4 height in mm
        var imgHeight = (canvas.height * imgWidth) / canvas.width;
        var heightLeft = imgHeight;
        var position = 0;
        
        // Add first page
        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        // Add additional pages if content is longer than one page
        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            doc.addPage();
            doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }
        
        // Save the PDF
        localStorage.setItem('traderBrosEstimateCount', estimateNumber);
        estimateNumber++;
        updateEstimateCounter();
        
        var filename = 'Estimate #' + estNumber + ' ' + projectAddress.substring(0, 30).replace(/[^a-zA-Z0-9]/g, '_') + '.pdf';
        doc.save(filename);
        
        closePreview();
    });
}

window.onclick = function(event) {
    var modal = document.getElementById('previewModal');
    if (event.target == modal) {
        closePreview();
    }
}
