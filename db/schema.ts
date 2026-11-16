import { sqliteTable, text, integer, uniqueIndex } from "drizzle-orm/sqlite-core";
export const programState = sqliteTable("program_state", {
  id: text("id").primaryKey(),
  data: text("data").notNull(),
  revision: integer("revision").notNull().default(1),
  updatedAt: text("updated_at").notNull(),
});

export const learningCourses=sqliteTable('learning_courses',{
 id:text('id').primaryKey(),data:text('data').notNull(),version:integer('version').notNull().default(1),updatedAt:text('updated_at').notNull(),
});
export const learningEnrollments=sqliteTable('learning_enrollments',{
 id:text('id').primaryKey(),userId:text('user_id').notNull(),name:text('name').notNull(),courseId:text('course_id').notNull(),courseVersion:integer('course_version').notNull(),courseSnapshot:text('course_snapshot').notNull(),completedLessons:text('completed_lessons').notNull().default('[]'),bestScore:integer('best_score').notNull().default(0),attempts:integer('attempts').notNull().default(0),status:text('status').notNull().default('studying'),practice:text('practice').notNull().default(''),reviewStatus:text('review_status').notNull().default('none'),reviewNote:text('review_note').notNull().default(''),certificateUrl:text('certificate_url').notNull().default(''),certificateReference:text('certificate_reference').notNull().default(''),createdAt:text('created_at').notNull(),updatedAt:text('updated_at').notNull(),completedAt:text('completed_at'),issuedAt:text('issued_at'),
},table=>[uniqueIndex('learning_user_course').on(table.userId,table.courseId)]);
export const learningAudit=sqliteTable('learning_audit',{
 id:text('id').primaryKey(),enrollmentId:text('enrollment_id').notNull(),actorId:text('actor_id').notNull(),action:text('action').notNull(),note:text('note').notNull(),createdAt:text('created_at').notNull(),
});
