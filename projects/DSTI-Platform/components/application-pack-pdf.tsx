import React from 'react';
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Define types for the PDF data
interface ProjectData {
  title: string;
  sector: string | null;
  startDate: string | null;
  endDate: string | null;
  location: string | null;
  caseReference?: string;
  submittedAt?: string;
  sections: {
    sectionKey: string;
    sectionData: Record<string, unknown>;
  }[];
  evidenceFiles: {
    filename: string;
    category: string;
    uploadedAt: Date;
  }[];
  organisation?: {
    name: string;
  };
}

// PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottom: 2,
    borderBottomColor: '#2563eb',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 3,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 10,
    borderBottom: 1,
    borderBottomColor: '#cbd5e1',
    paddingBottom: 3,
  },
  fieldLabel: {
    fontSize: 10,
    color: '#64748b',
    marginBottom: 2,
  },
  fieldValue: {
    fontSize: 11,
    marginBottom: 8,
    lineHeight: 1.5,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  column: {
    flex: 1,
    marginRight: 10,
  },
  evidenceItem: {
    marginBottom: 6,
    paddingLeft: 10,
  },
  evidenceCategory: {
    fontSize: 10,
    color: '#64748b',
  },
  evidenceFilename: {
    fontSize: 11,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    color: '#64748b',
    fontSize: 9,
    borderTop: 1,
    borderTopColor: '#cbd5e1',
    paddingTop: 10,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 20,
    right: 40,
    fontSize: 9,
    color: '#64748b',
  },
});

const getSectionData = (sections: ProjectData['sections'], key: string) => {
  return sections.find(s => s.sectionKey === key)?.sectionData || {};
};

const formatDate = (dateString: string | null) => {
  if (!dateString) return 'Not specified';
  return new Date(dateString).toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const ApplicationPackPDF: React.FC<{ project: ProjectData }> = ({ project }) => {
  const uncertaintyData = getSectionData(project.sections, 'uncertainty');
  const methodologyData = getSectionData(project.sections, 'methodology');
  const teamData = getSectionData(project.sections, 'team');
  const expenditureData = getSectionData(project.sections, 'expenditure');

  return (
    <Document>
      {/* Page 1: Cover & Basic Information */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>R&D Tax Incentive Application</Text>
          <Text style={styles.subtitle}>Department of Science, Technology and Innovation</Text>
          <Text style={styles.subtitle}>Section 11D - Income Tax Act</Text>
        </View>

        {project.caseReference && (
          <View style={{ marginBottom: 15 }}>
            <Text style={styles.fieldLabel}>Case Reference</Text>
            <Text style={[styles.fieldValue, { fontWeight: 'bold' }]}>{project.caseReference}</Text>
          </View>
        )}

        {project.submittedAt && (
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.fieldLabel}>Submission Date</Text>
            <Text style={styles.fieldValue}>{formatDate(project.submittedAt)}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Applicant Organisation</Text>
          <Text style={styles.fieldLabel}>Organisation Name</Text>
          <Text style={styles.fieldValue}>{project.organisation?.name || 'Not specified'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Project Overview</Text>
          
          <Text style={styles.fieldLabel}>Project Title</Text>
          <Text style={styles.fieldValue}>{project.title}</Text>

          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.fieldLabel}>Sector</Text>
              <Text style={styles.fieldValue}>{project.sector || 'Not specified'}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.fieldLabel}>Location</Text>
              <Text style={styles.fieldValue}>{project.location || 'Not specified'}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.fieldLabel}>Start Date</Text>
              <Text style={styles.fieldValue}>{formatDate(project.startDate)}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.fieldLabel}>End Date</Text>
              <Text style={styles.fieldValue}>{formatDate(project.endDate)}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
          `Page ${pageNumber} of ${totalPages}`
        )} fixed />
      </Page>

      {/* Page 2: R&D Uncertainty & Objectives */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. R&D Uncertainty</Text>
          
          <Text style={styles.fieldLabel}>Technical/Scientific Uncertainty</Text>
          <Text style={styles.fieldValue}>
            {(uncertaintyData.uncertainty as string) || 'Not provided'}
          </Text>

          <Text style={styles.fieldLabel}>R&D Objectives</Text>
          <Text style={styles.fieldValue}>
            {(uncertaintyData.objectives as string) || 'Not provided'}
          </Text>
        </View>

        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
          `Page ${pageNumber} of ${totalPages}`
        )} fixed />
      </Page>

      {/* Page 3: Methodology & Innovation */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Methodology & Innovation</Text>
          
          <Text style={styles.fieldLabel}>Research Approach</Text>
          <Text style={styles.fieldValue}>
            {(methodologyData.researchApproach as string) || 'Not provided'}
          </Text>

          <Text style={styles.fieldLabel}>Innovation Description</Text>
          <Text style={styles.fieldValue}>
            {(methodologyData.innovationDescription as string) || 'Not provided'}
          </Text>

          <Text style={styles.fieldLabel}>Challenges Overcome</Text>
          <Text style={styles.fieldValue}>
            {(methodologyData.challengesOvercome as string) || 'Not provided'}
          </Text>

          <Text style={styles.fieldLabel}>Experiments Planned</Text>
          <Text style={styles.fieldValue}>
            {(methodologyData.experimentsPlanned as string) || 'Not provided'}
          </Text>
        </View>

        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
          `Page ${pageNumber} of ${totalPages}`
        )} fixed />
      </Page>

      {/* Page 4: Team & Budget */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. R&D Team</Text>
          
          <Text style={styles.fieldLabel}>Team Size</Text>
          <Text style={styles.fieldValue}>
            {(teamData.teamSize as string) || 'Not specified'}
          </Text>

          <Text style={styles.fieldLabel}>Key Personnel</Text>
          <Text style={styles.fieldValue}>
            {(teamData.keyPersonnel as string) || 'Not provided'}
          </Text>

          <Text style={styles.fieldLabel}>Qualifications</Text>
          <Text style={styles.fieldValue}>
            {(teamData.qualifications as string) || 'Not provided'}
          </Text>

          <Text style={styles.fieldLabel}>Roles & Responsibilities</Text>
          <Text style={styles.fieldValue}>
            {(teamData.rolesResponsibilities as string) || 'Not provided'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Budget & Expenditure</Text>
          
          <Text style={styles.fieldLabel}>Total Budget</Text>
          <Text style={styles.fieldValue}>
            {(expenditureData.totalBudget as string) || 'Not specified'}
          </Text>

          <Text style={styles.fieldLabel}>R&D Costs Breakdown</Text>
          <Text style={styles.fieldValue}>
            {(expenditureData.rdCostsBreakdown as string) || 'Not provided'}
          </Text>

          <Text style={styles.fieldLabel}>Expenditure Timeline</Text>
          <Text style={styles.fieldValue}>
            {(expenditureData.expenditureTimeline as string) || 'Not provided'}
          </Text>
        </View>

        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
          `Page ${pageNumber} of ${totalPages}`
        )} fixed />
      </Page>

      {/* Page 5: Evidence Manifest */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Supporting Evidence</Text>
          
          {project.evidenceFiles.length > 0 ? (
            project.evidenceFiles.map((file, index) => (
              <View key={index} style={styles.evidenceItem}>
                <Text style={styles.evidenceFilename}>• {file.filename}</Text>
                <Text style={styles.evidenceCategory}>  Category: {file.category}</Text>
                <Text style={styles.evidenceCategory}>
                  Uploaded: {new Date(file.uploadedAt).toLocaleDateString('en-ZA')}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.fieldValue}>No evidence files uploaded.</Text>
          )}
        </View>

        <View style={styles.footer}>
          <Text>This application pack was generated automatically by the DSTI R&D Tax Incentive Platform.</Text>
          <Text>For inquiries, please contact: rdtax@dst.gov.za</Text>
        </View>

        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
          `Page ${pageNumber} of ${totalPages}`
        )} fixed />
      </Page>
    </Document>
  );
};
