import { EnrollmentInput, Semester, Summary } from '../types';

const roundHalfUp = (value: number, precision: number) => {
  const factor = Math.pow(10, precision);
  return Math.round(value * factor + Number.EPSILON) / factor;
};

const toEnrollmentCalc = (enrollment: EnrollmentInput) => ({
  courseCode: enrollment.courseCode,
  gradePoint: enrollment.gradePoint,
  credits: enrollment.credits,
  countsTowardsCGPA: enrollment.countsTowardsCGPA,
  countsTowardsCredits: enrollment.countsTowardsCredits,
  createdAt: enrollment.createdAt ? new Date(enrollment.createdAt) : new Date()
});

export const computeSummary = (semesters: Semester[], precision: number): Summary => {
  const perSemester = semesters.map((sem) => {
    let totalPoints = 0;
    let totalCredits = 0;
    sem.enrollments.forEach((e) => {
      if (!e.countsTowardsCGPA) return;
      totalPoints += e.gradePoint * e.credits;
      if (e.countsTowardsCredits) totalCredits += e.credits;
    });
    const gpa = totalCredits > 0 ? roundHalfUp(totalPoints / totalCredits, precision) : 0;
    return { termName: sem.termName, gpa, credits: totalCredits };
  });

  // Retakes are deduped by course code so only the latest attempt counts.
  // A blank/not-yet-labeled row has no code to dedupe on - grouping every
  // such row under the shared key '' would silently merge unrelated courses
  // into a single phantom entry, which is why a fresh plan with several
  // empty rows used to show far fewer "unique courses"/credits than the
  // per-semester totals above. Those are counted individually instead.
  const latestAttemptByCourse = new Map<string, ReturnType<typeof toEnrollmentCalc>>();
  const uncodedEntries: ReturnType<typeof toEnrollmentCalc>[] = [];
  semesters.forEach((sem) => {
    sem.enrollments.forEach((e) => {
      const calc = toEnrollmentCalc(e);
      if (!calc.countsTowardsCGPA && !calc.countsTowardsCredits) return;
      const code = calc.courseCode.trim();
      if (!code) {
        uncodedEntries.push(calc);
        return;
      }
      const existing = latestAttemptByCourse.get(code);
      if (!existing || existing.createdAt < calc.createdAt) {
        latestAttemptByCourse.set(code, calc);
      }
    });
  });

  const countedEntries = [...Array.from(latestAttemptByCourse.values()), ...uncodedEntries];

  let totalPoints = 0;
  let totalCredits = 0;
  countedEntries.forEach((e) => {
    if (e.countsTowardsCGPA) totalPoints += e.gradePoint * e.credits;
    if (e.countsTowardsCredits) totalCredits += e.credits;
  });

  const cgpa = totalCredits > 0 ? roundHalfUp(totalPoints / totalCredits, precision) : 0;
  return { cgpa, totalCredits, totalCourses: countedEntries.length, perSemester };
};
