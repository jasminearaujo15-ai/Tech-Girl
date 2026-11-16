CREATE TABLE `learning_audit` (
	`id` text PRIMARY KEY NOT NULL,
	`enrollment_id` text NOT NULL,
	`actor_id` text NOT NULL,
	`action` text NOT NULL,
	`note` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `learning_courses` (
	`id` text PRIMARY KEY NOT NULL,
	`data` text NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `learning_enrollments` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`course_id` text NOT NULL,
	`course_version` integer NOT NULL,
	`course_snapshot` text NOT NULL,
	`completed_lessons` text DEFAULT '[]' NOT NULL,
	`best_score` integer DEFAULT 0 NOT NULL,
	`attempts` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'studying' NOT NULL,
	`practice` text DEFAULT '' NOT NULL,
	`review_status` text DEFAULT 'none' NOT NULL,
	`review_note` text DEFAULT '' NOT NULL,
	`certificate_url` text DEFAULT '' NOT NULL,
	`certificate_reference` text DEFAULT '' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`completed_at` text,
	`issued_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `learning_user_course` ON `learning_enrollments` (`user_id`,`course_id`);