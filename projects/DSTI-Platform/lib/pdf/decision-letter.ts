import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

interface DecisionLetterData {
  outcome: "APPROVED" | "DECLINED";
  projectTitle: string;
  caseReference: string;
  organisationName: string;
  registrationNo: string | null;
  reasoning: string;
  conditions?: string | null;
  decidedAt: Date;
}

export async function generateDecisionLetter(data: DecisionLetterData): Promise<Uint8Array> {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  let currentPage = pdfDoc.addPage([595, 842]); // A4 size

  // Embed fonts
  const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesRomanBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

  const { width, height } = currentPage.getSize();
  const margin = 50;
  let yPosition = height - margin;

  // Helper function to draw text
  const drawText = (
    text: string,
    x: number,
    y: number,
    size: number,
    font: typeof timesRoman,
    color = rgb(0, 0, 0)
  ) => {
    currentPage.drawText(text, {
      x,
      y,
      size,
      font,
      color,
    });
  };

  // Helper to check if we need a new page
  const checkNewPage = () => {
    if (yPosition < 100) {
      currentPage = pdfDoc.addPage([595, 842]);
      yPosition = height - margin;
    }
  };

  // Helper to wrap text
  const wrapText = (text: string, maxWidth: number, fontSize: number): string[] => {
    // First, split by newlines to preserve paragraph breaks
    const paragraphs = text.split(/\r?\n/);
    const allLines: string[] = [];

    paragraphs.forEach((paragraph) => {
      if (!paragraph.trim()) {
        // Empty line - preserve as blank line
        allLines.push("");
        return;
      }

      const words = paragraph.split(" ");
      let currentLine = "";

      words.forEach((word) => {
        const testLine = currentLine + (currentLine ? " " : "") + word;
        const textWidth = timesRoman.widthOfTextAtSize(testLine, fontSize);

        if (textWidth > maxWidth) {
          if (currentLine) allLines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      });

      if (currentLine) allLines.push(currentLine);
    });

    return allLines;
  };

  // Header - DSTI Logo Area (placeholder text)
  drawText("DEPARTMENT OF SCIENCE, TECHNOLOGY AND INNOVATION", margin, yPosition, 12, timesRomanBold);
  yPosition -= 20;
  drawText("R&D Tax Incentive Programme (Section 11D)", margin, yPosition, 10, timesRoman);
  yPosition -= 40;

  // Date
  const dateStr = data.decidedAt.toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  drawText(`Date: ${dateStr}`, margin, yPosition, 10, timesRoman);
  yPosition -= 15;
  drawText(`Ref: ${data.caseReference}`, margin, yPosition, 10, timesRoman);
  yPosition -= 40;

  // Recipient
  drawText(data.organisationName, margin, yPosition, 11, timesRomanBold);
  yPosition -= 15;
  if (data.registrationNo) {
    drawText(`Registration No: ${data.registrationNo}`, margin, yPosition, 10, timesRoman);
    yPosition -= 30;
  } else {
    yPosition -= 15;
  }

  // Subject line
  const subject =
    data.outcome === "APPROVED"
      ? "RE: APPROVAL OF R&D TAX INCENTIVE APPLICATION"
      : "RE: R&D TAX INCENTIVE APPLICATION - NOT APPROVED";
  drawText(subject, margin, yPosition, 11, timesRomanBold);
  yPosition -= 25;

  // Opening salutation
  drawText("Dear Applicant,", margin, yPosition, 10, timesRoman);
  yPosition -= 20;

  // Opening paragraph
  const opening =
    data.outcome === "APPROVED"
      ? `We are pleased to inform you that your application for the R&D Tax Incentive regarding "${data.projectTitle}" has been APPROVED.`
      : `We regret to inform you that your application for the R&D Tax Incentive regarding "${data.projectTitle}" has NOT been approved at this time.`;

  const openingLines = wrapText(opening, width - 2 * margin, 10);
  openingLines.forEach((line) => {
    checkNewPage();
    drawText(line, margin, yPosition, 10, timesRoman);
    yPosition -= 15;
  });
  yPosition -= 10;

  // Decision reasoning
  checkNewPage();
  drawText("Decision Basis:", margin, yPosition, 10, timesRomanBold);
  yPosition -= 20;

  const reasoningLines = wrapText(data.reasoning, width - 2 * margin, 10);
  reasoningLines.forEach((line) => {
    checkNewPage();
    drawText(line, margin, yPosition, 10, timesRoman);
    yPosition -= 15;
  });
  yPosition -= 10;

  // Conditions (for approvals)
  if (data.outcome === "APPROVED" && data.conditions) {
    checkNewPage();
    drawText("Conditions and Requirements:", margin, yPosition, 10, timesRomanBold);
    yPosition -= 20;

    const conditionsLines = wrapText(data.conditions, width - 2 * margin, 10);
    conditionsLines.forEach((line) => {
      checkNewPage();
      drawText(line, margin, yPosition, 10, timesRoman);
      yPosition -= 15;
    });
    yPosition -= 10;
  }

  // Next steps
  if (data.outcome === "APPROVED") {
    checkNewPage();
    drawText("Next Steps:", margin, yPosition, 10, timesRomanBold);
    yPosition -= 20;
    
    const steps = [
      "• Ensure compliance with all reporting requirements",
      "• Submit progress reports as per the agreed schedule",
      "• Maintain accurate records of R&D expenditure",
      "• Notify DSTI of any significant project changes",
    ];

    steps.forEach((step) => {
      checkNewPage();
      drawText(step, margin, yPosition, 10, timesRoman);
      yPosition -= 15;
    });
    yPosition -= 10;
  } else {
    checkNewPage();
    drawText("Options for Reconsideration:", margin, yPosition, 10, timesRomanBold);
    yPosition -= 20;

    checkNewPage();
    drawText(
      "You may address the concerns outlined above and resubmit your application.",
      margin,
      yPosition,
      10,
      timesRoman
    );
    yPosition -= 15;
    checkNewPage();
    drawText(
      "For clarification or assistance, contact us at rdtax@dsti.gov.za",
      margin,
      yPosition,
      10,
      timesRoman
    );
    yPosition -= 20;
  }

  // Closing
  checkNewPage();
  drawText("Sincerely,", margin, yPosition, 10, timesRoman);
  yPosition -= 40;

  checkNewPage();
  drawText("DSTI R&D Tax Incentive Review Committee", margin, yPosition, 10, timesRomanBold);
  yPosition -= 15;
  checkNewPage();
  drawText("Department of Science, Technology and Innovation", margin, yPosition, 9, timesRoman);
  yPosition -= 15;
  checkNewPage();
  drawText("Email: rdtax@dsti.gov.za | Tel: +27 12 843 6300", margin, yPosition, 9, timesRoman);

  // Footer disclaimer
  yPosition = 60;
  drawText(
    "This letter is an official communication from DSTI. Please retain for your records.",
    margin,
    yPosition,
    8,
    timesRoman,
    rgb(0.5, 0.5, 0.5)
  );

  // Serialize the PDF to bytes
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
