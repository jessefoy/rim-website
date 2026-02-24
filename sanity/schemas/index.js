import weekdays from "./weekdays";
import programCategories from "./programCategories";
import classRecordingTopics from "./classRecordingTopics";
import lessonResources from "./lessonResources";
import teams from "./teams";
import glossary from "./glossary";
import magazineArticles from "./magazineArticles";
import volunteerPositions from "./volunteerPositions";
import lessons from "./lessons";
import courses from "./courses";
import classRecordings from "./classRecordings";
import programs from "./programs";

export const schemaTypes = [
  // Lookup tables (no references)
  weekdays,
  programCategories,
  classRecordingTopics,
  lessonResources,

  // People
  teams,

  // Content (standalone)
  glossary,
  magazineArticles,

  // Content (with references)
  volunteerPositions,
  lessons,
  courses,
  classRecordings,

  // Main content (most references)
  programs,
];
