export type Lesson={id:string;title:string;body:string;exercise:string;videoUrl:string;materialUrl:string};
export type Question={id:string;prompt:string;options:string[];correctIndex?:number;explanation:string};
export type Course={id:string;title:string;summary:string;category:string;hours:number;passingScore:number;published:boolean;intro:string;practicePrompt:string;lessons:Lesson[];questions:Question[];version:number};
export type Enrollment={id:string;userId:string;name:string;courseId:string;courseVersion:number;completedLessons:string[];bestScore:number;attempts:number;status:string;practice:string;reviewStatus:string;reviewNote:string;certificateUrl:string;certificateReference:string;createdAt:string;updatedAt:string;completedAt:string|null;issuedAt:string|null;course:Course};
export type LearningData={viewer:{name:string;admin:boolean}|null;courses:Course[];enrollments:Enrollment[];reviews:Enrollment[];policyUrl:string};
