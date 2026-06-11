#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { spawnSync } = require("child_process");

const REQUIRED_FIELDS = [
  "id",
  "level",
  "title",
  "task",
  "hint",
  "defaultCode",
  "solution",
  "validate"
];

function usage() {
  console.log("Usage: node scripts/validate_lessons.js [path/to/lessons.js] [path/to/advanced_lessons.js]");
}

function loadLessons(lessonPaths) {
  const source = lessonPaths
    .map((lessonPath) => fs.readFileSync(lessonPath, "utf8"))
    .join("\n\n");
  const sandbox = {
    window: {},
    console
  };
  const exposeLessons = [
    "",
    ";globalThis.__validatedLessons =",
    "  typeof lessons !== 'undefined' ? lessons :",
    "  (typeof window !== 'undefined' ? window.lessons : undefined);"
  ].join("\n");

  vm.createContext(sandbox);
  new vm.Script(`${source}${exposeLessons}`, { filename: lessonPaths.join(", ") }).runInContext(sandbox, {
    timeout: 5000
  });

  return sandbox.__validatedLessons;
}

function findPython() {
  const candidates = process.platform === "win32"
    ? [
        { command: "python", args: [] },
        { command: "py", args: ["-3"] },
        { command: "python3", args: [] }
      ]
    : [
        { command: "python3", args: [] },
        { command: "python", args: [] }
      ];

  for (const candidate of candidates) {
    const result = spawnSync(candidate.command, [...candidate.args, "--version"], {
      encoding: "utf8"
    });

    if (result.status === 0) {
      const version = `${result.stdout || result.stderr}`.trim();
      return { ...candidate, version };
    }
  }

  return null;
}

function compileSolution(python, source, filename) {
  const compiler = [
    "import sys",
    "source = sys.stdin.read()",
    "filename = sys.argv[1] if len(sys.argv) > 1 else '<solution>'",
    "try:",
    "    compile(source, filename, 'exec')",
    "except SyntaxError as exc:",
    "    print(f'{exc.msg} at line {exc.lineno}, offset {exc.offset}', file=sys.stderr)",
    "    if exc.text:",
    "        print(exc.text.rstrip(), file=sys.stderr)",
    "    sys.exit(1)",
    "except Exception as exc:",
    "    print(str(exc), file=sys.stderr)",
    "    sys.exit(1)"
  ].join("\n");

  return spawnSync(python.command, [...python.args, "-c", compiler, filename], {
    input: source,
    encoding: "utf8",
    maxBuffer: 1024 * 1024
  });
}

function addIssue(issues, lessonLabel, message) {
  issues.push({ lessonLabel, message });
}

function validateLessonShape(lessons, issues) {
  if (!Array.isArray(lessons)) {
    addIssue(issues, "global", "lessons is not an array.");
    return;
  }

  if (lessons.length === 0) {
    addIssue(issues, "global", "lessons array is empty.");
    return;
  }

  const seenIds = new Set();

  lessons.forEach((lesson, index) => {
    const lessonLabel = `lesson[${index}]`;

    if (!lesson || typeof lesson !== "object" || Array.isArray(lesson)) {
      addIssue(issues, lessonLabel, "lesson entry must be an object.");
      return;
    }

    for (const field of REQUIRED_FIELDS) {
      if (!Object.prototype.hasOwnProperty.call(lesson, field)) {
        addIssue(issues, lessonLabel, `missing required field "${field}".`);
      }
    }

    const expectedId = index + 1;
    if (!Number.isInteger(lesson.id)) {
      addIssue(issues, lessonLabel, "id must be an integer.");
    } else {
      if (seenIds.has(lesson.id)) {
        addIssue(issues, `lesson id ${lesson.id}`, "duplicate id.");
      }
      seenIds.add(lesson.id);

      if (lesson.id !== expectedId) {
        addIssue(issues, `lesson id ${lesson.id}`, `id should be ${expectedId} at array position ${index}.`);
      }
    }

    if (!Number.isInteger(lesson.level)) {
      addIssue(issues, lesson.id ? `lesson id ${lesson.id}` : lessonLabel, "level must be an integer.");
    }

    for (const field of ["title", "task", "hint", "defaultCode", "solution"]) {
      if (Object.prototype.hasOwnProperty.call(lesson, field) && typeof lesson[field] !== "string") {
        addIssue(issues, lesson.id ? `lesson id ${lesson.id}` : lessonLabel, `${field} must be a string.`);
      }
    }

    if (Object.prototype.hasOwnProperty.call(lesson, "validate") && typeof lesson.validate !== "function") {
      addIssue(issues, lesson.id ? `lesson id ${lesson.id}` : lessonLabel, "validate must be a function.");
    }
  });
}

function validateSolutionsCompile(lessons, python, issues) {
  if (!Array.isArray(lessons)) {
    return;
  }

  lessons.forEach((lesson, index) => {
    if (!lesson || typeof lesson !== "object" || typeof lesson.solution !== "string") {
      return;
    }

    const id = Number.isInteger(lesson.id) ? lesson.id : index + 1;
    const filename = `<lesson ${id} solution>`;
    const result = compileSolution(python, lesson.solution, filename);

    if (result.status !== 0) {
      const stderr = `${result.stderr || result.stdout || "Python compile failed."}`.trim();
      addIssue(issues, `lesson id ${id}`, `solution does not compile: ${stderr}`);
    }
  });
}

function printReport({ lessons, lessonPaths, python, issues }) {
  const pythonCommand = python
    ? [python.command, ...python.args].join(" ")
    : null;

  console.log("Lesson validation report");
  console.log("========================");
  console.log(`Lessons files: ${lessonPaths.join(", ")}`);
  console.log(`Python: ${python ? `${pythonCommand} (${python.version})` : "not found"}`);
  console.log(`Lessons loaded: ${Array.isArray(lessons) ? lessons.length : "n/a"}`);
  console.log("");

  if (issues.length === 0) {
    console.log("[OK] Structure, ids, required fields, and Python solution compilation all passed.");
    return;
  }

  console.log(`[FAIL] Found ${issues.length} issue(s):`);
  for (const issue of issues) {
    console.log(`- ${issue.lessonLabel}: ${issue.message}`);
  }
}

function main() {
  if (process.argv.includes("--help") || process.argv.includes("-h")) {
    usage();
    return 0;
  }

  const projectRoot = path.resolve(__dirname, "..");
  const defaultPaths = [path.join(projectRoot, "lessons.js")];
  const defaultAdvancedPath = path.join(projectRoot, "advanced_lessons.js");
  if (fs.existsSync(defaultAdvancedPath)) {
    defaultPaths.push(defaultAdvancedPath);
  }
  const lessonPaths = (process.argv.length > 2 ? process.argv.slice(2) : defaultPaths)
    .map((lessonPath) => path.resolve(lessonPath));
  const issues = [];
  let lessons;

  for (const lessonPath of lessonPaths) {
    if (!fs.existsSync(lessonPath)) {
      addIssue(issues, "global", `lessons file not found: ${lessonPath}`);
    }
  }

  if (issues.length === 0) {
    try {
      lessons = loadLessons(lessonPaths);
      validateLessonShape(lessons, issues);
    } catch (error) {
      addIssue(issues, "global", `failed to load lessons files: ${error.message}`);
    }
  }

  const python = findPython();
  if (!python) {
    addIssue(issues, "global", "local Python was not found. Tried python, py -3, and python3.");
  } else {
    validateSolutionsCompile(lessons, python, issues);
  }

  printReport({ lessons, lessonPaths, python, issues });
  return issues.length === 0 ? 0 : 1;
}

process.exitCode = main();
