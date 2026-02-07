// Placement Test Certificate PDF Generation
// Uses jspdf for client-side PDF generation (dynamically imported for code splitting)

interface QuickCertificateData {
  studentName: string;
  level: string;
  skillsTested: string[];
  completedAt: string;
  sessionCode: string;
  levelBreakdown?: Record<string, { level: string; confidence: number; description: string }>;
}

interface PersonalizedCertificateData {
  studentName: string;
  level: string;
  skillBreakdown: Record<string, { level: string }>;
  completedAt: string;
  certificateCode: string;
  issuedAt: string;
}

export async function generateQuickCertificatePDF(data: QuickCertificateData) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Background
  doc.setFillColor(252, 252, 253);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Single border
  doc.setDrawColor(100, 140, 200);
  doc.setLineWidth(1.5);
  doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

  // Accent line at top
  doc.setDrawColor(100, 140, 200);
  doc.setLineWidth(0.5);
  doc.line(30, 30, pageWidth - 30, 30);

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(32);
  doc.setTextColor(50, 70, 110);
  doc.text('Certificate of Completion', pageWidth / 2, 50, { align: 'center' });

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(14);
  doc.setTextColor(100, 120, 150);
  doc.text('Quick English Placement Test', pageWidth / 2, 62, { align: 'center' });

  // Decorative line
  doc.setDrawColor(100, 140, 200);
  doc.setLineWidth(0.3);
  doc.line(80, 70, pageWidth - 80, 70);

  // "This is to certify that"
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(12);
  doc.setTextColor(120, 130, 150);
  doc.text('This is to certify that', pageWidth / 2, 82, { align: 'center' });

  // Student name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(30, 50, 80);
  doc.text(data.studentName, pageWidth / 2, 96, { align: 'center' });

  // Name underline
  const nameWidth = doc.getTextWidth(data.studentName);
  doc.setDrawColor(180, 190, 210);
  doc.setLineWidth(0.3);
  doc.line(
    pageWidth / 2 - nameWidth / 2 - 10, 100,
    pageWidth / 2 + nameWidth / 2 + 10, 100
  );

  // Body text
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(60, 70, 90);
  const bodyText = `has completed the Quick English Placement Test and demonstrated proficiency at the`;
  doc.text(bodyText, pageWidth / 2, 114, { align: 'center' });

  // Level badge
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(50, 100, 180);
  doc.text(`${data.level} Level (CEFR)`, pageWidth / 2, 128, { align: 'center' });

  // Skills assessed
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(100, 110, 130);
  const skills = data.skillsTested.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' & ');
  doc.text(`Skills Assessed: ${skills}`, pageWidth / 2, 142, { align: 'center' });

  // Skill breakdown if available
  if (data.levelBreakdown && Object.keys(data.levelBreakdown).length > 0) {
    const breakdownY = 152;
    doc.setFontSize(10);
    const entries = Object.entries(data.levelBreakdown);
    const breakdownText = entries.map(([skill, d]) =>
      `${skill.charAt(0).toUpperCase() + skill.slice(1)}: ${d.level}`
    ).join('    |    ');
    doc.setTextColor(80, 90, 110);
    doc.text(breakdownText, pageWidth / 2, breakdownY, { align: 'center' });
  }

  // Bottom section
  const bottomY = 168;

  // Completion date
  const completedDate = new Date(data.completedAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 110, 130);
  doc.text(`Completion Date: ${completedDate}`, 40, bottomY);

  // Session code
  doc.text(`Session: ${data.sessionCode}`, 40, bottomY + 7);

  // Signature
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(50, 70, 110);
  doc.text('Kirby McDonald', pageWidth - 40, bottomY, { align: 'right' });

  doc.setDrawColor(100, 140, 200);
  doc.setLineWidth(0.3);
  doc.line(pageWidth - 100, bottomY + 3, pageWidth - 40, bottomY + 3);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(120, 130, 150);
  doc.text('Professional English Programs', pageWidth - 40, bottomY + 10, { align: 'right' });

  // Footer
  doc.setDrawColor(100, 140, 200);
  doc.setLineWidth(0.3);
  doc.line(30, pageHeight - 28, pageWidth - 30, pageHeight - 28);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(150, 160, 180);
  doc.text(
    'This is an automated placement assessment. For a comprehensive evaluation with expert review, take the Personalized Assessment.',
    pageWidth / 2,
    pageHeight - 22,
    { align: 'center' }
  );

  // Save
  const filename = `Quick_Placement_Certificate_${data.studentName.replace(/\s+/g, '_')}_${data.level}.pdf`;
  doc.save(filename);
}

export async function generatePersonalizedCertificatePDF(data: PersonalizedCertificateData) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Background
  doc.setFillColor(255, 253, 248);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Double border
  doc.setDrawColor(180, 150, 80);
  doc.setLineWidth(2);
  doc.rect(8, 8, pageWidth - 16, pageHeight - 16);
  doc.setLineWidth(0.5);
  doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

  // Gold accent corners (decorative small squares)
  const cornerSize = 6;
  doc.setFillColor(200, 170, 80);
  // Top-left
  doc.rect(8, 8, cornerSize, cornerSize, 'F');
  // Top-right
  doc.rect(pageWidth - 8 - cornerSize, 8, cornerSize, cornerSize, 'F');
  // Bottom-left
  doc.rect(8, pageHeight - 8 - cornerSize, cornerSize, cornerSize, 'F');
  // Bottom-right
  doc.rect(pageWidth - 8 - cornerSize, pageHeight - 8 - cornerSize, cornerSize, cornerSize, 'F');

  // Gold line at top
  doc.setDrawColor(200, 170, 80);
  doc.setLineWidth(0.8);
  doc.line(25, 28, pageWidth - 25, 28);

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(34);
  doc.setTextColor(140, 110, 50);
  doc.text('Certificate of English Proficiency', pageWidth / 2, 48, { align: 'center' });

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(14);
  doc.setTextColor(160, 135, 70);
  doc.text('Comprehensive Assessment', pageWidth / 2, 59, { align: 'center' });

  // Decorative divider
  doc.setDrawColor(200, 170, 80);
  doc.setLineWidth(0.3);
  doc.line(100, 66, pageWidth - 100, 66);

  // "This is to certify that"
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(12);
  doc.setTextColor(130, 120, 100);
  doc.text('This is to certify that', pageWidth / 2, 78, { align: 'center' });

  // Student name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(50, 40, 20);
  doc.text(data.studentName, pageWidth / 2, 93, { align: 'center' });

  // Name underline
  const nameWidth = doc.getTextWidth(data.studentName);
  doc.setDrawColor(200, 170, 80);
  doc.setLineWidth(0.5);
  doc.line(
    pageWidth / 2 - nameWidth / 2 - 10, 97,
    pageWidth / 2 + nameWidth / 2 + 10, 97
  );

  // Body text
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(80, 70, 50);
  doc.text(
    'has been assessed at the following level following comprehensive evaluation',
    pageWidth / 2, 110,
    { align: 'center' }
  );
  doc.text(
    'of all four language skills:',
    pageWidth / 2, 118,
    { align: 'center' }
  );

  // Level badge
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(160, 120, 40);
  doc.text(`${data.level} (CEFR)`, pageWidth / 2, 133, { align: 'center' });

  // Skill breakdown table
  const skills = Object.entries(data.skillBreakdown);
  if (skills.length > 0) {
    const tableY = 142;
    const cellWidth = 50;
    const totalWidth = cellWidth * skills.length;
    const startX = (pageWidth - totalWidth) / 2;

    // Table header
    doc.setFillColor(245, 240, 225);
    doc.rect(startX, tableY, totalWidth, 10, 'F');
    doc.setDrawColor(200, 185, 140);
    doc.setLineWidth(0.3);
    doc.rect(startX, tableY, totalWidth, 10);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(100, 85, 55);

    skills.forEach(([skill], i) => {
      const x = startX + i * cellWidth;
      doc.rect(x, tableY, cellWidth, 10);
      doc.text(
        skill.charAt(0).toUpperCase() + skill.slice(1),
        x + cellWidth / 2,
        tableY + 7,
        { align: 'center' }
      );
    });

    // Table values
    doc.setFillColor(255, 252, 245);
    doc.rect(startX, tableY + 10, totalWidth, 10, 'F');
    doc.rect(startX, tableY + 10, totalWidth, 10);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(50, 40, 20);

    skills.forEach(([, skillData], i) => {
      const x = startX + i * cellWidth;
      doc.rect(x, tableY + 10, cellWidth, 10);
      doc.text(
        skillData.level,
        x + cellWidth / 2,
        tableY + 17,
        { align: 'center' }
      );
    });
  }

  // Bottom section
  const bottomY = 172;

  // Left side - assessed by + date
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 90, 70);
  doc.text(`Assessed by: Kirby McDonald`, 35, bottomY);

  const issuedDate = new Date(data.issuedAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
  doc.text(`Issue Date: ${issuedDate}`, 35, bottomY + 7);

  // Right side - certificate code
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(140, 110, 50);
  doc.text(`Certificate: ${data.certificateCode}`, pageWidth - 35, bottomY, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(120, 110, 85);
  doc.text('Verify at: mrmcdonald.org/certifications/verify', pageWidth - 35, bottomY + 7, { align: 'right' });

  // Signature
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(50, 40, 20);
  doc.text('Kirby McDonald', pageWidth / 2, bottomY, { align: 'center' });

  doc.setDrawColor(200, 170, 80);
  doc.setLineWidth(0.3);
  doc.line(pageWidth / 2 - 35, bottomY + 3, pageWidth / 2 + 35, bottomY + 3);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(130, 120, 100);
  doc.text('Professional English Programs', pageWidth / 2, bottomY + 10, { align: 'center' });

  // Footer
  doc.setDrawColor(200, 170, 80);
  doc.setLineWidth(0.5);
  doc.line(25, pageHeight - 26, pageWidth - 25, pageHeight - 26);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(160, 150, 130);
  doc.text(
    'This certificate is verifiable online. Assessment includes Reading, Listening, Writing, and Speaking with expert review.',
    pageWidth / 2,
    pageHeight - 20,
    { align: 'center' }
  );

  // Save
  const filename = `English_Proficiency_Certificate_${data.studentName.replace(/\s+/g, '_')}_${data.level}.pdf`;
  doc.save(filename);
}
