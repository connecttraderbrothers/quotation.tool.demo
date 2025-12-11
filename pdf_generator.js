// Backend API URL - Update this with your Railway deployment URL
const API_URL = 'http://localhost:3000'; // Change to your Railway URL in production

async function downloadQuote() {
    try {
        // Show loading state
        const downloadBtn = event.target;
        const originalText = downloadBtn.textContent;
        downloadBtn.textContent = 'Generating PDF...';
        downloadBtn.disabled = true;

        // Generate the full HTML content
        const htmlContent = generateFullHTMLForPDF();
        const estNumber = String(estimateNumber).padStart(4, '0');
        const filename = `Trader_Brothers_Estimate_${estNumber}.pdf`;

        // Call backend API
        const response = await fetch(`${API_URL}/api/generate-pdf`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                htmlContent: htmlContent,
                filename: filename
            })
        });

        if (!response.ok) {
            throw new Error('PDF generation failed');
        }

        // Download the PDF
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        // Increment and save estimate number
        estimateNumber++;
        localStorage.setItem('traderBrosEstimateCount', estimateNumber);
        updateEstimateCounter();

        // Show success message
        alert('PDF downloaded successfully!');

        // Restore button state
        downloadBtn.textContent = originalText;
        downloadBtn.disabled = false;

    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Failed to generate PDF. Please try again or check your connection.');
        
        // Restore button state
        const downloadBtn = event.target;
        downloadBtn.textContent = 'Download PDF';
        downloadBtn.disabled = false;
    }
}

function generateFullHTMLForPDF() {
    var clientName = document.getElementById('clientName').value || '[Client Name]';
    var clientPhone = document.getElementById('clientPhone').value;
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

    // Start building complete HTML document with embedded styles
    var html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Estimate ${estNumber}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: "Times New Roman", Times, serif;
            background: white;
            padding: 20px;
        }
        
        .estimate-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 40px;
        }
        
        .preview-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #333;
        }
        
        .company-info {
            flex: 1;
        }
        
        .company-name {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
            color: #333;
        }
        
        .company-name .highlight {
            color: #d4af37;
        }
        
        .company-details {
            font-size: 11px;
            line-height: 1.6;
            color: #666;
        }
        
        .logo-container {
            width: 120px;
        }
        
        .logo-container img {
            width: 100%;
            height: auto;
        }
        
        .estimate-banner {
            background: linear-gradient(135deg, #bc9c22, #d4af37);
            padding: 15px 20px;
            margin-bottom: 25px;
            display: inline-block;
            font-weight: bold;
            font-size: 16px;
            color: white;
        }
        
        .info-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
        }
        
        .client-info {
            flex: 1;
        }
        
        .client-info h3 {
            font-size: 12px;
            color: #666;
            margin-bottom: 8px;
        }
        
        .client-info p {
            font-size: 13px;
            line-height: 1.5;
            color: #333;
        }
        
        .estimate-details {
            flex: 0 0 250px;
        }
        
        .details-table {
            width: 100%;
            border-collapse: collapse;
        }
        
        .details-table td {
            padding: 8px 10px;
            font-size: 13px;
            border: none;
        }
        
        .detail-label {
            color: #666;
            text-align: left;
            width: 120px;
        }
        
        .detail-value {
            font-weight: bold;
            color: #333;
            text-align: left;
        }
        
        .expiry-date {
            background: linear-gradient(135deg, #bc9c22, #d4af37);
            padding: 5px 10px;
            display: inline-block;
            color: white;
            font-weight: bold;
        }
        
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin: 30px 0;
        }
        
        .items-table thead {
            background: #f5f5f5;
        }
        
        .items-table th {
            padding: 12px;
            text-align: left;
            font-size: 12px;
            font-weight: bold;
            color: #333;
            border-bottom: 2px solid #ddd;
        }
        
        .items-table th:nth-child(2),
        .items-table th:nth-child(3),
        .items-table th:nth-child(4) {
            text-align: right;
            width: 100px;
        }
        
        .items-table td {
            padding: 12px;
            font-size: 13px;
            border-bottom: 1px solid #eee;
            color: #333;
        }
        
        .items-table td:nth-child(2),
        .items-table td:nth-child(3),
        .items-table td:nth-child(4) {
            text-align: right;
        }
        
        .notes-section {
            margin: 30px 0;
            padding: 20px;
            background: #f9f9f9;
            border-left: 3px solid #bc9c22;
        }
        
        .notes-section h3 {
            font-size: 13px;
            margin-bottom: 10px;
            color: #333;
        }
        
        .notes-section ol {
            margin-left: 20px;
            font-size: 12px;
            line-height: 1.8;
            color: #666;
        }
        
        .totals-section {
            margin-top: 30px;
            display: flex;
            justify-content: flex-end;
        }
        
        .totals-box {
            width: 300px;
        }
        
        .total-row-preview {
            display: flex;
            justify-content: space-between;
            padding: 10px 15px;
            font-size: 13px;
        }
        
        .total-row-preview.subtotal {
            border-top: 1px solid #ddd;
        }
        
        .total-row-preview.vat {
            color: #666;
        }
        
        .total-row-preview.final {
            background: linear-gradient(135deg, #bc9c22, #d4af37);
            color: white;
            font-weight: bold;
            font-size: 16px;
            border-top: 2px solid #333;
            margin-top: 5px;
        }
        
        .footer-note {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            text-align: center;
            font-size: 11px;
            color: #666;
            font-style: italic;
        }
        
        .thank-you {
            margin-top: 15px;
            font-weight: bold;
            color: #333;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="estimate-container">`;

    // Header
    html += `<div class="preview-header">
        <div class="company-info">
            <div class="company-name">TR<span class="highlight">A</span>DER BROTHERS LTD</div>
            <div class="company-details">
                8 Craigour Terrace<br>
                Edinburgh, EH17 7PB<br>
                07979309957<br>
                traderbrotherslimited@gmail.com
            </div>
        </div>
        <div class="logo-container">
            <img src="https://github.com/infotraderbrothers-lgtm/traderbrothers-assets-logo/blob/main/Trader%20Brothers.png?raw=true" alt="Trader Brothers Logo">
        </div>
    </div>`;

    // Estimate banner
    html += `<div class="estimate-banner">Estimate for</div>`;

    // Info section
    html += `<div class="info-section">
        <div class="client-info">
            <h3>${clientName}</h3>
            <p>${projectAddress}`;
    if (clientPhone) html += `<br>${clientPhone}`;
    html += `</p></div>
        <div class="estimate-details">
            <table class="details-table">
                <tr><td class="detail-label">Date:</td><td class="detail-value">${quoteDate}</td></tr>
                <tr><td class="detail-label">Estimate #:</td><td class="detail-value">${estNumber}</td></tr>
                <tr><td class="detail-label">Customer Ref:</td><td class="detail-value">${customerId}</td></tr>
                <tr><td class="detail-label">Expiry Date:</td><td class="expiry-date">${expiryDate}</td></tr>
            </table>
        </div>
    </div>`;

    // Items table
    html += `<table class="items-table">
        <thead>
            <tr>
                <th>Description</th>
                <th>Qty</th>
                <th>Unit price</th>
                <th>Total price</th>
            </tr>
        </thead>
        <tbody>`;

    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        html += `<tr>
            <td>${item.description}</td>
            <td>${item.quantity}</td>
            <td>£${item.unitPrice.toFixed(2)}</td>
            <td>£${item.lineTotal.toFixed(2)}</td>
        </tr>`;
    }

    html += `</tbody></table>`;

    // Notes section
    html += `<div class="notes-section">
        <h3>Notes:</h3>
        <ol>
            <li>Estimate valid for 31 days</li>
            <li>Payment of ${depositPercent}% is required to secure start date</li>
            <li>Pending to be supplied by customer</li>
            <li>Any extras to be charged accordingly</li>`;
    
    var customNotes = document.getElementById('customNotes').value;
    if (customNotes) {
        html += `<li>${customNotes}</li>`;
    }
    
    html += `</ol></div>`;

    // Totals section
    html += `<div class="totals-section">
        <div class="totals-box">
            <div class="total-row-preview subtotal"><span>Subtotal</span><span>£${subtotal.toFixed(2)}</span></div>
            <div class="total-row-preview vat"><span>VAT</span><span>£${vat.toFixed(2)}</span></div>
            <div class="total-row-preview final"><span>Total</span><span>£${total.toFixed(2)}</span></div>
        </div>
    </div>`;

    // Footer
    html += `<div class="footer-note">
        If you have any questions about this estimate, please contact<br>
        Trader Brothers on 07448835577
        <div class="thank-you">Thank you for your business</div>
    </div>`;

    html += `</div></body></html>`;

    return html;
}
