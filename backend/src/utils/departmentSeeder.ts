import { Department } from '../models/Department.js';
import { Course } from '../models/Course.js';
import { SemesterTemplate } from '../models/SemesterTemplate.js';
import { CourseDefinition, SemesterPlanEntry } from '../data/departments/cse.js';

export async function seedDepartmentCourses(
  departmentCode: string,
  courses: CourseDefinition[],
  semesterPlan: SemesterPlanEntry[]
): Promise<void> {
  // 1. Find the department by code
  const department = await Department.findOne({ code: departmentCode.toUpperCase() });
  if (!department) {
    console.warn(`[DeptSeeder] Department with code "${departmentCode}" not found. Skipping.`);
    return;
  }

  // 2. Upsert each course
  //    - If course with that code exists: skip (do nothing — admin may have edited it)
  //    - If course does NOT exist: create it and associate with this department
  const courseIdByCode = new Map<string, string>();

  for (const courseData of courses) {
    const existing = await Course.findOne({ code: courseData.code.toUpperCase() });
    if (existing) {
      courseIdByCode.set(courseData.code.toUpperCase(), existing._id.toString());
      // Ensure this department is linked to the course (add if not already present)
      const deptIdStr = department._id.toString();
      const alreadyLinked = existing.departments.some(
        (d) => d.toString() === deptIdStr
      );
      if (!alreadyLinked) {
        existing.departments.push(department._id);
        await existing.save();
      }
    } else {
      const created = await Course.create({
        code: courseData.code.toUpperCase(),
        title: courseData.title,
        credits: courseData.credits,
        category: courseData.category,
        departments: [department._id],
        countsTowardsCGPA: courseData.countsTowardsCGPA,
        countsTowardsCredits: courseData.countsTowardsCredits,
        active: true,
      });
      courseIdByCode.set(courseData.code.toUpperCase(), created._id.toString());
    }
  }

  // 3. Upsert each semester template
  //    - If template for (department, termName) exists: skip (preserve admin edits)
  //    - If does NOT exist: create it, resolving course codes to ObjectIds
  for (const semPlan of semesterPlan) {
    const existing = await SemesterTemplate.findOne({
      department: department._id,
      termName: semPlan.termName,
    });
    if (existing) {
      continue; // Skip — already seeded; admin may have customised it
    }

    // Resolve course codes to ObjectIds
    const resolvedCourseIds: string[] = [];
    for (const code of semPlan.courseCodes) {
      const id = courseIdByCode.get(code.toUpperCase());
      if (id) {
        resolvedCourseIds.push(id);
      } else {
        console.warn(
          `[DeptSeeder] Course code "${code}" in semester plan "${semPlan.termName}" not found in course list. Skipping this course in the template.`
        );
      }
    }

    await SemesterTemplate.create({
      department: department._id,
      termName: semPlan.termName,
      courses: resolvedCourseIds,
      active: true,
    });
  }

  console.log(
    `[DeptSeeder] Seeded ${courses.length} courses and ${semesterPlan.length} semester templates for department: ${departmentCode}`
  );
}
