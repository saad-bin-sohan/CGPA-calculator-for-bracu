import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';

// This document is built from plain data, not from the live DOM - the app's
// summary numbers and course rows are passed in already-computed, so the
// report can never omit the CGPA/credits result the way the old
// html2canvas-based export did, and there is nothing here for a CSS
// animation or a custom-property lookup to silently break.

export type GradeInputMethod = 'letter' | 'points' | 'percentage';

export interface CgpaReportStat {
  label: string;
  value: string;
  sub?: string;
}

export interface CgpaReportCourse {
  courseCode: string;
  courseTitle: string;
  credits: number;
  gradeLetter?: string;
  gradePoint: number;
  percentage?: number;
  inputMethod: GradeInputMethod;
  countsTowardsCGPA: boolean;
  countsTowardsCredits: boolean;
}

export interface CgpaReportSemester {
  termName: string;
  gpa: number;
  credits: number;
  courses: CgpaReportCourse[];
}

export interface CgpaReportInput {
  /** e.g. "Guest Calculator" or "Student Dashboard" - shown in the running header. */
  reportContext: string;
  studentName?: string;
  departmentName?: string;
  departmentCode?: string;
  /** Rendered as-is, in order - each page decides which of its own on-screen stats to include. */
  stats: CgpaReportStat[];
  requiredCredits?: number;
  totalCredits: number;
  semesters: CgpaReportSemester[];
  generatedAt: Date;
}

const COLORS = {
  primary700: '#155E38',
  stone50: '#FAFAF9',
  stone200: '#E7E5E4',
  stone300: '#D6D3D1',
  stone400: '#A8A29E',
  stone500: '#78716C',
  stone700: '#44403C',
  stone900: '#1C1917',
  white: '#FFFFFF'
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 90,
    paddingBottom: 52,
    paddingHorizontal: 40,
    fontFamily: 'Helvetica',
    fontSize: 9.5,
    color: COLORS.stone900
  },
  header: {
    position: 'absolute',
    top: 28,
    left: 40,
    right: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.stone200,
    paddingBottom: 10
  },
  headerBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  logoMark: {
    width: 16,
    height: 16,
    borderRadius: 4,
    backgroundColor: COLORS.primary700,
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoMarkText: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 7,
    color: COLORS.white
  },
  headerWordmark: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    color: COLORS.stone900
  },
  headerContext: {
    fontFamily: 'Helvetica',
    fontSize: 8,
    color: COLORS.stone400,
    textTransform: 'uppercase',
    letterSpacing: 0.6
  },
  footer: {
    position: 'absolute',
    bottom: 22,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 7.5,
    color: COLORS.stone400
  },
  title: {
    fontFamily: 'Times-Italic',
    fontSize: 22,
    color: COLORS.stone900
  },
  byline: {
    marginTop: 6,
    fontSize: 8.5,
    color: COLORS.stone500
  },
  disclaimer: {
    marginTop: 10,
    fontFamily: 'Helvetica-Oblique',
    fontSize: 7.5,
    color: COLORS.stone400
  },
  statsRow: {
    marginTop: 20,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: COLORS.stone200
  },
  statCell: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRightWidth: 1,
    borderRightColor: COLORS.stone200
  },
  statCellLast: {
    borderRightWidth: 0
  },
  statLabel: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 7,
    color: COLORS.stone500,
    textTransform: 'uppercase',
    letterSpacing: 0.8
  },
  statValue: {
    marginTop: 4,
    fontFamily: 'Helvetica-Bold',
    fontSize: 15,
    color: COLORS.stone900
  },
  statSub: {
    marginTop: 2,
    fontSize: 7.5,
    color: COLORS.stone500
  },
  progressSection: {
    marginTop: 18
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  progressLabel: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 7,
    color: COLORS.stone500,
    textTransform: 'uppercase',
    letterSpacing: 0.8
  },
  progressValue: {
    fontFamily: 'Courier',
    fontSize: 8.5,
    color: COLORS.stone700
  },
  progressTrack: {
    marginTop: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.stone200,
    width: '100%'
  },
  progressFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary700
  },
  progressNote: {
    marginTop: 4,
    fontSize: 7.5,
    color: COLORS.stone400
  },
  semesterBlock: {
    marginTop: 22
  },
  semesterHeaderRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.stone900,
    paddingBottom: 5
  },
  semesterName: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
    color: COLORS.stone900
  },
  semesterMeta: {
    fontFamily: 'Courier',
    fontSize: 8,
    color: COLORS.stone500
  },
  tableHeaderRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.stone300,
    paddingVertical: 5,
    marginTop: 2
  },
  tableHeaderCell: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 7,
    color: COLORS.stone500,
    textTransform: 'uppercase',
    letterSpacing: 0.6
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.stone200,
    paddingVertical: 6
  },
  tableRowAlt: {
    backgroundColor: COLORS.stone50
  },
  courseCode: {
    fontFamily: 'Courier-Bold',
    fontSize: 9,
    color: COLORS.stone900
  },
  courseTitle: {
    marginTop: 1,
    fontFamily: 'Helvetica',
    fontSize: 7.5,
    color: COLORS.stone500
  },
  cellText: {
    fontFamily: 'Courier',
    fontSize: 8.5,
    color: COLORS.stone700
  },
  noteText: {
    fontSize: 7,
    color: COLORS.stone400
  },
  emptyNote: {
    marginTop: 8,
    fontFamily: 'Helvetica-Oblique',
    fontSize: 8.5,
    color: COLORS.stone400
  },
  colCourse: { width: '32%' },
  colCredits: { width: '11%', textAlign: 'center' },
  colGrade: { width: '18%', textAlign: 'center' },
  colPoints: { width: '13%', textAlign: 'center' },
  colNotes: { width: '26%' }
});

const resolveGradeLabel = (course: CgpaReportCourse): string => {
  if (course.gradeLetter && course.gradeLetter.trim().length > 0) {
    return course.gradeLetter;
  }
  if (course.inputMethod === 'percentage' && course.percentage != null) {
    return `${course.percentage}%`;
  }
  if (course.gradePoint > 0 || course.inputMethod === 'points') {
    return `${course.gradePoint.toFixed(2)} / 4.00`;
  }
  return 'Not graded';
};

const resolveNotes = (course: CgpaReportCourse): string => {
  const parts: string[] = [];
  if (!course.countsTowardsCGPA) parts.push('Excl. CGPA');
  if (!course.countsTowardsCredits) parts.push('Excl. credits');
  return parts.join(' · ');
};

const formatDateTime = (date: Date): string => {
  const datePart = date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  const timePart = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  });
  return `${datePart}, ${timePart}`;
};

const clampPercent = (value: number): number => Math.max(0, Math.min(100, value));

const renderCourseRow = (course: CgpaReportCourse, index: number) => (
  <View
    key={`${course.courseCode}-${index}`}
    style={[styles.tableRow, index % 2 === 1 ? styles.tableRowAlt : undefined]}
    wrap={false}
  >
    <View style={styles.colCourse}>
      <Text style={styles.courseCode}>{course.courseCode || 'Untitled'}</Text>
      {course.courseTitle ? <Text style={styles.courseTitle}>{course.courseTitle}</Text> : null}
    </View>
    <Text style={[styles.cellText, styles.colCredits]}>{course.credits}</Text>
    <Text style={[styles.cellText, styles.colGrade]}>{resolveGradeLabel(course)}</Text>
    <Text style={[styles.cellText, styles.colPoints]}>{course.gradePoint.toFixed(2)}</Text>
    <Text style={[styles.noteText, styles.colNotes]}>{resolveNotes(course)}</Text>
  </View>
);

const TableHeaderRow = () => (
  <View style={styles.tableHeaderRow}>
    <Text style={[styles.tableHeaderCell, styles.colCourse]}>Course</Text>
    <Text style={[styles.tableHeaderCell, styles.colCredits]}>Credits</Text>
    <Text style={[styles.tableHeaderCell, styles.colGrade]}>Grade</Text>
    <Text style={[styles.tableHeaderCell, styles.colPoints]}>Points</Text>
    <Text style={[styles.tableHeaderCell, styles.colNotes]}>Notes</Text>
  </View>
);

export default function CgpaReportDocument({ input }: { input: CgpaReportInput }) {
  const progressPercent =
    input.requiredCredits && input.requiredCredits > 0
      ? clampPercent((input.totalCredits / input.requiredCredits) * 100)
      : null;
  const creditsRemaining =
    input.requiredCredits != null ? Math.max(0, input.requiredCredits - input.totalCredits) : null;

  const bylineParts = [
    input.studentName,
    input.departmentName
      ? input.departmentCode
        ? `${input.departmentName} (${input.departmentCode})`
        : input.departmentName
      : null,
    `Generated ${formatDateTime(input.generatedAt)}`
  ].filter((part): part is string => Boolean(part));

  return (
    <Document
      title={`${input.reportContext} — BRACU CGPA Report`}
      author={input.studentName}
      creator="BRACU CGPA"
      producer="BRACU CGPA"
      creationDate={input.generatedAt}
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.header} fixed>
          <View style={styles.headerBrand}>
            <View style={styles.logoMark}>
              <Text style={styles.logoMarkText}>BU</Text>
            </View>
            <Text style={styles.headerWordmark}>BRACU CGPA</Text>
          </View>
          <Text style={styles.headerContext}>{input.reportContext}</Text>
        </View>

        <Text style={styles.title}>CGPA Report</Text>
        <Text style={styles.byline}>{bylineParts.join('   ·   ')}</Text>
        <Text style={styles.disclaimer}>
          Self-generated with the BRACU CGPA calculator. This is a planning document, not an
          official BRAC University transcript.
        </Text>

        <View style={styles.statsRow}>
          {input.stats.map((stat, index) => (
            <View
              key={stat.label}
              style={[
                styles.statCell,
                index === input.stats.length - 1 ? styles.statCellLast : undefined
              ]}
            >
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
              {stat.sub ? <Text style={styles.statSub}>{stat.sub}</Text> : null}
            </View>
          ))}
        </View>

        {progressPercent !== null && (
          <View style={styles.progressSection}>
            <View style={styles.progressLabelRow}>
              <Text style={styles.progressLabel}>Graduation progress</Text>
              <Text style={styles.progressValue}>
                {input.totalCredits} / {input.requiredCredits} credits (
                {Math.round(progressPercent)}%)
              </Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
            </View>
            <Text style={styles.progressNote}>
              {creditsRemaining && creditsRemaining > 0
                ? `${creditsRemaining} credits remaining`
                : 'Credit requirement met'}
            </Text>
          </View>
        )}

        {input.semesters.length === 0 ? (
          <Text style={styles.emptyNote}>No semesters added yet.</Text>
        ) : (
          input.semesters.map((semester, semIndex) => {
            const semesterHeader = (
              <View style={styles.semesterHeaderRow}>
                <Text style={styles.semesterName}>{semester.termName}</Text>
                <Text style={styles.semesterMeta}>
                  GPA {semester.gpa.toFixed(2)} · {semester.credits} cr ·{' '}
                  {semester.courses.length} course{semester.courses.length === 1 ? '' : 's'}
                </Text>
              </View>
            );

            return (
              <View key={`${semester.termName}-${semIndex}`} style={styles.semesterBlock}>
                {semester.courses.length === 0 ? (
                  <>
                    {semesterHeader}
                    <Text style={styles.emptyNote}>No courses added yet.</Text>
                  </>
                ) : (
                  <>
                    {/* The semester name, the column headers, AND the first course row
                        are one atomic (wrap={false}) unit, so a page break can never
                        strand the header without at least one row of real data under
                        it - if it doesn't fit, the whole group moves to the next page
                        together. Only the second row onward wraps independently. */}
                    <View wrap={false}>
                      {semesterHeader}
                      <TableHeaderRow />
                      {renderCourseRow(semester.courses[0], 0)}
                    </View>
                    {semester.courses.slice(1).map((course, i) => renderCourseRow(course, i + 1))}
                  </>
                )}
              </View>
            );
          })
        )}

        <View style={styles.footer} fixed>
          <Text>BRACU CGPA · whatsmycgpa.vercel.app</Text>
          <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}
