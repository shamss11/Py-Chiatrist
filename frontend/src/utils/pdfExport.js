import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';

export const exportToPDF = async (elementId, filename = 'clinical-report.pdf') => {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error("Export element not found:", elementId);
        return;
    }

    try {
        // High quality capture using html-to-image (better SVG support for charts)
        const dataUrl = await toPng(element, {
            cacheBust: true,
            backgroundColor: '#FFFBF5',
            quality: 1,
            pixelRatio: 2,
            filter: (node) => {
                // Exclude the download button from the report itself
                const isButton = node.tagName === 'BUTTON';
                const isNav = node.classList && node.classList.contains('bg-orange-50'); // Exclude the 7d/30d filter
                return !isButton && !isNav;
            }
        });

        const pdf = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: 'a4',
            compress: true
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        // Add the image to PDF
        // We use a 10mm margin
        const margin = 10;
        const imgWidth = pdfWidth - (margin * 2);

        // Add image - height 0 makes it auto-calculate based on aspect ratio
        pdf.addImage(dataUrl, 'PNG', margin, margin, imgWidth, 0);

        // Footer
        pdf.setFontSize(8);
        pdf.setTextColor(150);
        pdf.text('Py-Chiatrist AI Clinical Synthesis - Information provided for educational purposes.', margin, pdfHeight - margin);

        pdf.save(filename);
        return true;
    } catch (error) {
        console.error('PDF Generation Failed:', error);
        return false;
    }
};
