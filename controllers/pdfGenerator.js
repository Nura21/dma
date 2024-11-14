const PDFDocument = require("pdfkit");
const fileSystem = require("fs");

function generatePDF(data) {
  const doc = new PDFDocument({
    bufferPages: false,
    font: "Times-Roman",
  });
  doc.pipe(fileSystem.createWriteStream("public/docs/report.pdf"));

  doc.fontSize(18).text("Data Report", { align: "center" });
  doc.fontSize(14).text("Best Selling Products:", { underline: true });

  data.bestSellingProducts.forEach((product, index) => {
    doc.text(`${index + 1}. ${product.name}`);
  });

  doc.moveDown(); // Add some vertical space
  doc.fontSize(14).text("Total Transactions and Prices:", { underline: true });
  doc.text(
    `Total Transactions: ${data.totalTransactionsAndPrices[0].total_transactions}`
  );
  doc.text(`Total Sum: ${data.totalTransactionsAndPrices[0].total_sum}`);
  doc.end();
}

module.exports = generatePDF;
