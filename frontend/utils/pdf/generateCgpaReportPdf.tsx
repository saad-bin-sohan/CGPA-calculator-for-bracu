import type { CgpaReportCourse, CgpaReportInput } from './CgpaReportDocument';

export class PdfGenerationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PdfGenerationError';
  }
}

// A freshly added semester starts with a handful of blank placeholder rows
// (see blankEnrollment() in the calculator/dashboard pages) so the form has
// something to render. Those blanks are meaningless in an exported report -
// the old screenshot-based export used to include them verbatim, complete
// with "E.G. CSE110" placeholder text. Filtering them out here (once, before
// the guard check and before the data reaches the document) means the
// layout component never has to know about this UI-only concept, and the
// "did they actually add anything" check below is checking the same data
// that will actually be rendered.
const hasRealCourse = (course: CgpaReportCourse): boolean =>
  course.courseCode.trim().length > 0 || course.courseTitle.trim().length > 0;

const normalizeInput = (input: CgpaReportInput): CgpaReportInput => ({
  ...input,
  semesters: input.semesters.map((semester) => ({
    ...semester,
    courses: semester.courses.filter(hasRealCourse)
  }))
});

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'report';

const triggerBrowserDownload = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  // Revoking immediately can occasionally race the download start in some
  // browsers, so give it a moment first.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

/**
 * Builds and downloads a CGPA report PDF entirely client-side. Nothing here
 * touches the live DOM: the document is built from the structured data the
 * caller already has in state, so the export can't silently omit content
 * the way the old element-screenshot approach did, and there's no CSS
 * animation or custom property for a headless capture to mis-render.
 *
 * @react-pdf/renderer is dynamically imported so its ~300KB isn't added to
 * the initial bundle of any page that merely has an Export PDF button.
 */
export async function generateCgpaReportPdf(rawInput: CgpaReportInput): Promise<void> {
  if (typeof window === 'undefined') {
    throw new PdfGenerationError('PDF export is only available in the browser.');
  }

  const input = normalizeInput(rawInput);
  const hasAnyCourse = input.semesters.some((semester) => semester.courses.length > 0);
  if (!hasAnyCourse) {
    throw new PdfGenerationError('Add at least one course before exporting a PDF.');
  }

  const [{ pdf }, { default: CgpaReportDocument }] = await Promise.all([
    import('@react-pdf/renderer'),
    import('./CgpaReportDocument')
  ]);

  let blob: Blob;
  try {
    blob = await pdf(<CgpaReportDocument input={input} />).toBlob();
  } catch (err) {
    console.error('PDF rendering failed', err);
    throw new PdfGenerationError('Something went wrong while building the PDF. Please try again.');
  }

  const filename = `bracu-cgpa-${slugify(input.reportContext)}-${input.generatedAt
    .toISOString()
    .slice(0, 10)}.pdf`;
  triggerBrowserDownload(blob, filename);
}
