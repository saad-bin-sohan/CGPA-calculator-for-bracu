export interface EnrollmentForCalc {
  courseCode: string;
  gradePoint: number;
  credits: number;
  countsTowardsCGPA: boolean;
  countsTowardsCredits: boolean;
  createdAt: Date;
}

export interface SemesterForCalc {
  termName: string;
  enrollments: EnrollmentForCalc[];
}

const roundHalfUp = (value: number, precision: number): number => {
  const factor = Math.pow(10, precision);
  return Math.round(value * factor + Number.EPSILON) / factor;
};

export const computeSemesterGPA = (
  semester: SemesterForCalc,
  precision: number
): { gpa: number; credits: number } => {
  let totalPoints = 0;
  let totalCredits = 0;
  semester.enrollments.forEach((enrollment) => {
    if (!enrollment.countsTowardsCGPA) return;
    totalPoints += enrollment.gradePoint * enrollment.credits;
    if (enrollment.countsTowardsCredits) {
      totalCredits += enrollment.credits;
    }
  });
  const gpa = totalCredits > 0 ? roundHalfUp(totalPoints / totalCredits, precision) : 0;
  return { gpa, credits: totalCredits };
};

export const computeCGPA = (
  semesters: SemesterForCalc[],
  precision: number
): {
  cgpa: number;
  totalCredits: number;
  totalCourses: number;
  perSemester: { termName: string; gpa: number; credits: number }[];
} => {
  const perSemester = semesters.map((s) => ({
    termName: s.termName,
    ...computeSemesterGPA(s, precision)
  }));

  // Retakes are deduped by course code so only the latest attempt counts.
  // Enrollments with no course code yet (a new/blank row) have nothing to
  // dedupe against - grouping them under the shared key '' would silently
  // merge unrelated, not-yet-labeled courses into a single phantom entry.
  // Those are counted individually instead, exactly as the per-semester
  // totals above already do.
  const latestAttemptByCourse = new Map<string, EnrollmentForCalc>();
  const uncodedEnrollments: EnrollmentForCalc[] = [];
  semesters.forEach((sem) => {
    sem.enrollments.forEach((enrollment) => {
      if (!enrollment.countsTowardsCGPA && !enrollment.countsTowardsCredits) return;
      const code = enrollment.courseCode.trim();
      if (!code) {
        uncodedEnrollments.push(enrollment);
        return;
      }
      const existing = latestAttemptByCourse.get(code);
      if (!existing || existing.createdAt < enrollment.createdAt) {
        latestAttemptByCourse.set(code, enrollment);
      }
    });
  });

  const countedEnrollments = [...latestAttemptByCourse.values(), ...uncodedEnrollments];

  let totalPoints = 0;
  let totalCredits = 0;
  countedEnrollments.forEach((enrollment) => {
    if (enrollment.countsTowardsCGPA) {
      totalPoints += enrollment.gradePoint * enrollment.credits;
    }
    if (enrollment.countsTowardsCredits) {
      totalCredits += enrollment.credits;
    }
  });

  const cgpa = totalCredits > 0 ? roundHalfUp(totalPoints / totalCredits, precision) : 0;
  return {
    cgpa,
    totalCredits,
    totalCourses: countedEnrollments.length,
    perSemester
  };
};
