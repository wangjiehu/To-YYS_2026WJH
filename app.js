// python-learning-hub/app.js

// Dynamic script loader with fallback and custom timeouts
function loadScriptWithFallback(name, urls, timeoutMs = 4000) {
  return new Promise((resolve, reject) => {
    let index = 0;
    
    function tryLoad() {
      if (index >= urls.length) {
        reject(new Error(`所有备用 CDN 节点加载 ${name} 均失败！`));
        return;
      }
      
      const url = urls[index];
      console.log(`[Loader] 正在加载 ${name} (尝试 ${index + 1}/${urls.length}): ${url}`);
      
      const script = document.createElement('script');
      script.src = url;
      script.async = true;
      
      let timer = setTimeout(() => {
        script.onerror = null;
        script.onload = null;
        script.remove();
        console.warn(`[Loader] 加载 ${name} 超时 (${timeoutMs}ms): ${url}`);
        index++;
        tryLoad();
      }, timeoutMs);
      
      script.onload = () => {
        clearTimeout(timer);
        console.log(`[Loader] 成功加载 ${name}: ${url}`);
        resolve({ url: url });
      };
      
      script.onerror = () => {
        clearTimeout(timer);
        script.remove();
        console.warn(`[Loader] 加载 ${name} 出错: ${url}`);
        index++;
        tryLoad();
      };
      
      document.head.appendChild(script);
    }
    
    tryLoad();
  });
}

function showFatalError(msg) {
  const detailBody = document.getElementById('lesson-detail-body');
  if (detailBody) {
    detailBody.innerHTML = `
      <div style="padding: 16px; background-color: var(--error-bg); border-left: 4px solid var(--error); border-radius: 4px; color: var(--error); font-family: sans-serif; font-size: 14px; line-height: 1.5;">
        <h4 style="margin-bottom: 8px; font-weight: bold; color: var(--error);">❌ 关键环境依赖加载失败</h4>
        <p style="color: var(--text-main);">${msg}</p>
        <button id="fatal-reload-btn" style="margin-top: 12px; padding: 8px 16px; background-color: var(--error); color: var(--bg-secondary); border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">
          🔄 重新加载网页
        </button>
      </div>
    `;
    const reloadBtn = document.getElementById('fatal-reload-btn');
    if (reloadBtn) {
      reloadBtn.addEventListener('click', () => window.location.reload());
    }
  }
  const detailTitle = document.getElementById('lesson-detail-title');
  if (detailTitle) {
    detailTitle.innerText = "加载失败";
  }
}

const STORAGE_KEYS = {
  completed: 'python_lessons_completed',
  unlocked: 'python_learning_hub_unlocked',
  theme: 'python_learning_hub_theme'
};

const SUBMIT_BUTTON_READY_TEXT = '🚀 提交验证，冲向下一关！';
const ANSWER_BUTTON_READY_TEXT = '💡 查看答案';
const ANSWER_BUTTON_CANCEL_TEXT = '✕ 取消查看';
const RUN_BUTTON_READY_TEXT = '⚡ 运行代码';
const FOCUS_RUN_BUTTON_READY_TEXT = '▶ 运行';

function safeStorageGet(key) {
  try {
    return localStorage.getItem(key);
  } catch (err) {
    console.warn(`读取本地设置失败: ${key}`, err);
    return null;
  }
}

function safeStorageSet(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (err) {
    console.warn(`保存本地设置失败: ${key}`, err);
  }
}

function safeStorageRemove(key) {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.warn(`删除本地设置失败: ${key}`, err);
  }
}

function normalizeCompletedLessons(ids) {
  const completedSet = new Set((Array.isArray(ids) ? ids : [])
    .map(Number)
    .filter(id => lessons.some(lesson => lesson.id === id)));

  const contiguousCompleted = [];
  for (const lesson of lessons) {
    if (!completedSet.has(lesson.id)) break;
    contiguousCompleted.push(lesson.id);
  }
  return contiguousCompleted;
}

function readCompletedLessons() {
  try {
    return normalizeCompletedLessons(JSON.parse(safeStorageGet(STORAGE_KEYS.completed) || '[]'));
  } catch (err) {
    console.warn('学习进度数据损坏，已自动重置。', err);
    safeStorageRemove(STORAGE_KEYS.completed);
    return [];
  }
}

function saveCompletedLessons() {
  completedLessons = normalizeCompletedLessons(completedLessons);
  safeStorageSet(STORAGE_KEYS.completed, JSON.stringify(completedLessons));
}

let pyodide = null;
let editor = null;
let currentLessonIndex = 0;
let completedLessons = readCompletedLessons();
let isSoundEnabled = true;
let pendingConfirmResolve = null;
let answerPanelInitialized = false;

// Web Audio API sound generator (no external files required!)
const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;
try {
  audioCtx = AudioContextCtor ? new AudioContextCtor() : null;
} catch (err) {
  console.warn('音频环境初始化失败，音效将保持静默。', err);
}

function playSound(type) {
  if (!isSoundEnabled || !audioCtx) return;
  
  // Resume AudioContext if suspended (browser security autoplay policies)
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  if (type === 'click') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
  } else if (type === 'success') {
    // Happy Arpeggio: C4, E4, G4, C5
    const now = audioCtx.currentTime;
    const notes = [261.63, 329.63, 392.00, 523.25];
    notes.forEach((freq, index) => {
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.connect(g);
      g.connect(audioCtx.destination);
      o.frequency.setValueAtTime(freq, now + index * 0.1);
      g.gain.setValueAtTime(0.1, now + index * 0.1);
      g.gain.exponentialRampToValueAtTime(0.001, now + index * 0.1 + 0.3);
      o.start(now + index * 0.1);
      o.stop(now + index * 0.1 + 0.3);
    });
  } else if (type === 'fail') {
    // Sad double buzz
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, audioCtx.currentTime);
    osc.frequency.setValueAtTime(110, audioCtx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.3);
  }
}

// Custom Toast notification system
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icon = type === 'success' ? '✨' : '⚠️';
  const iconEl = document.createElement('span');
  iconEl.className = 'toast-icon';
  iconEl.innerText = icon;

  const messageEl = document.createElement('span');
  messageEl.className = 'toast-message';
  messageEl.innerText = message;

  toast.appendChild(iconEl);
  toast.appendChild(messageEl);
  
  container.appendChild(toast);
  
  // Play sound if applicable
  if (type === 'success') playSound('success');
  if (type === 'error') playSound('fail');

  setTimeout(() => {
    toast.style.animation = 'toastIn 0.3s reverse forwards';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Particle Canvas Confetti Effect
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function createParticles() {
  particles = [];
  const colors = ['#94714D', '#D4A373', '#528062', '#E8C547', '#E0A96D', '#B5838D'];
  for (let i = 0; i < 120; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2 - 50,
      radius: Math.random() * 5 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 15,
      vy: (Math.random() - 0.6) * 15 - 5,
      gravity: 0.3,
      alpha: 1,
      decay: Math.random() * 0.015 + 0.01
    });
  }
}

function animateParticles() {
  if (particles.length === 0) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    p.vy += p.gravity;
    p.x += p.vx;
    p.y += p.vy;
    p.alpha -= p.decay;
    
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    
    if (p.alpha <= 0 || p.y > canvas.height) {
      particles.splice(i, 1);
      i--;
    }
  }
  
  if (particles.length > 0) {
    requestAnimationFrame(animateParticles);
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

function triggerConfetti() {
  createParticles();
  animateParticles();
}

// Monaco Editor Initialization
function initFallbackEditor(reason) {
  if (editor) return;

  console.warn("Monaco 编辑器不可用，已切换到基础编辑器。", reason);
  const editorBody = document.getElementById('monaco-editor-body');
  if (!editorBody) return;

  editorBody.innerHTML = '';
  const textarea = document.createElement('textarea');
  textarea.className = 'fallback-code-editor';
  textarea.spellcheck = false;
  textarea.value = lessons[currentLessonIndex].defaultCode;
  textarea.setAttribute('aria-label', 'Python 代码编辑器');
  editorBody.appendChild(textarea);

  editor = {
    getValue: () => textarea.value,
    setValue: (value) => {
      textarea.value = value;
      textarea.focus();
    }
  };

  appendConsole("高级代码编辑器加载不稳定，已自动切换到基础编辑器；运行与提交功能不受影响。", "system");
  checkLoadersReady();
}

function initMonaco(vsPath) {
  if (typeof require === "undefined") {
    console.error("Monaco Editor loader (require) is not defined.");
    appendConsole("Monaco 代码编辑器加载失败，请检查网络并刷新页面。", "error");
    const loaderText = document.getElementById('loader-text');
    if (loaderText) {
      loaderText.innerText = "编辑器加载失败，请刷新页面！";
    }
    initFallbackEditor("require 未定义");
    return;
  }
  try {
    require.config({
      paths: {
        vs: vsPath,
        stackframe: "https://cdn.jsdelivr.net/npm/stackframe@1.3.4/stackframe",
        "error-stack-parser": "https://cdn.jsdelivr.net/npm/error-stack-parser@2.1.4/error-stack-parser"
      }
    });

    const fallbackTimer = setTimeout(() => {
      initFallbackEditor("Monaco 初始化超时");
    }, 8000);
    
    require(['vs/editor/editor.main'], function () {
      clearTimeout(fallbackTimer);
      if (editor) return;

      // Register custom theme that aligns with our Cream Theme
      monaco.editor.defineTheme('cream-editor', {
        base: 'vs', // Light base theme
        inherit: true,
        rules: [
          { token: 'keyword', foreground: '4F786D', fontStyle: 'bold' },
          { token: 'string', foreground: '6D875C' },
          { token: 'number', foreground: 'A8614E' },
          { token: 'comment', foreground: '8C8377', fontStyle: 'italic' },
        ],
        colors: {
          'editor.background': '#FFFCF6',
          'editor.lineHighlightBackground': '#F3ECE0',
          'editorLineNumber.foreground': '#B9AB98',
          'editorLineNumber.activeForeground': '#4F786D',
          'editor.selectionBackground': '#DCE8DF',
          'editor.border': '#DED2BF'
        }
      });

      // Register custom theme that aligns with our Cream Theme (Dark Mode)
      monaco.editor.defineTheme('cream-editor-dark', {
        base: 'vs-dark', // Dark base theme
        inherit: true,
        rules: [
          { token: 'keyword', foreground: 'D4A373', fontStyle: 'bold' }, // Warm gold
          { token: 'string', foreground: '6CA580' },                    // Sage green
          { token: 'number', foreground: 'E07D70' },                    // Terracotta red
          { token: 'comment', foreground: '7C7567', fontStyle: 'italic' },
        ],
        colors: {
          'editor.background': '#221F1A',
          'editor.lineHighlightBackground': '#2D2923',
          'editorLineNumber.foreground': '#7C7567',
          'editorLineNumber.activeForeground': '#D4A373',
          'editor.selectionBackground': '#3F392F',
          'editor.border': '#3F392F'
        }
      });

      const isDark = document.body.classList.contains('dark-mode');
      editor = monaco.editor.create(document.getElementById('monaco-editor-body'), {
        value: lessons[currentLessonIndex].defaultCode,
        language: 'python',
        theme: isDark ? 'cream-editor-dark' : 'cream-editor',
        fontSize: 13,
        fontFamily: "'JetBrains Mono', Courier, monospace",
        lineHeight: 21,
        automaticLayout: true,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        roundedSelection: true,
        lineNumbersMinChars: 3,
        padding: { top: 12, bottom: 12 }
      });

      // Hide overlay if Pyodide is also ready
      checkLoadersReady();
    }, function (err) {
      clearTimeout(fallbackTimer);
      console.error("Monaco dependency loading error:", err);
      initFallbackEditor(err && err.message ? err.message : err);
    });
  } catch (err) {
    console.error("Monaco initialization error:", err);
    initFallbackEditor(err && err.message ? err.message : err);
  }
}

let isPyodideReady = false;
function checkLoadersReady() {
  if (isPyodideReady && editor) {
    const loadingOverlay = document.getElementById('pyodide-loader');
    if (loadingOverlay) {
      loadingOverlay.style.opacity = 0;
      setTimeout(() => {
        loadingOverlay.style.display = 'none';
      }, 500);
    }
  }
}

// Pyodide Initialization
async function initPyodide(indexURL) {
  const loadingOverlay = document.getElementById('pyodide-loader');
  try {
    if (typeof loadPyodide === "undefined") {
      throw new Error("loadPyodide 未定义，可能因为 Pyodide CDN 脚本加载失败。");
    }
    pyodide = await loadPyodide({
      indexURL: indexURL
    });
    
    // Warm up the compiler
    await pyodide.runPythonAsync("print('Pyodide Engine Active.')");
    
    isPyodideReady = true;
    checkLoadersReady();
    
    appendConsole("Python 解释器加载完成！已准备就绪。", "system");
  } catch (error) {
    console.error(error);
    document.getElementById('loader-text').innerText = "编译器初始化失败，请检查网络并刷新页面！";
    appendConsole("Python 引擎加载失败，请刷新页面重试。" + (error.message ? " 错误详情: " + error.message : ""), "error");
  }
}

// Console helper functions
function getConsoleTarget(target) {
  if (target && typeof target.appendChild === 'function') return target;
  if (typeof target === 'string') return document.getElementById(target);
  return document.getElementById('console-log');
}

function clearConsole(target) {
  const consoleLog = getConsoleTarget(target);
  if (consoleLog) consoleLog.innerHTML = '';
}

function appendConsole(text, type = 'output', target) {
  const consoleLog = getConsoleTarget(target);
  if (!consoleLog) return;
  const line = document.createElement('div');
  line.className = `console-line ${type}`;
  
  if (type === 'input') {
    line.innerText = text;
  } else {
    line.innerText = text;
  }
  
  consoleLog.appendChild(line);
  consoleLog.scrollTop = consoleLog.scrollHeight;
}

function getStdinLines(stdinInput) {
  const input = stdinInput || document.getElementById('stdin-input');
  if (!input || typeof input.value !== 'string') return [];
  return input.value.replace(/\r\n/g, '\n').split('\n');
}

async function installPyodideStdin(stdinLines) {
  if (!pyodide) return;
  pyodide.globals.set('__stdin_lines__', stdinLines);
  await pyodide.runPythonAsync(`
import builtins
try:
    __stdin_values__ = list(__stdin_lines__.to_py())
except AttributeError:
    __stdin_values__ = list(__stdin_lines__)
__stdin_iter__ = iter(__stdin_values__)
def __codex_input(prompt=""):
    if prompt:
        print(prompt, end="")
    try:
        return str(next(__stdin_iter__))
    except StopIteration:
        raise EOFError("标准输入已用完，请在 stdin 面板按行补充输入。")
builtins.input = __codex_input
  `);
}

// Reset variables inside Pyodide context
async function clearPyodideGlobals() {
  if (!pyodide) return;
  await pyodide.runPythonAsync(`
import sys
for name in list(globals().keys()):
    if not name.startswith('__') and name not in ['sys', 'io', 'pyodide', 'js']:
        del globals()[name]
import os
import shutil
for module_name in ["urllib", "urllib.request", "math_tools"]:
    if module_name in sys.modules:
        del sys.modules[module_name]
for path in [
    "notes.txt", "data.txt", "students.json", "users.json", "temp_data",
    "math_tools.py", "scores.csv", "events.jsonl", "inbox", "profile.txt",
    "profile.bak", "page.html", "app.log"
]:
    if os.path.isdir(path):
        shutil.rmtree(path, ignore_errors=True)
    elif os.path.exists(path):
        try:
            os.remove(path)
        except Exception:
            pass
  `);
}

// Run Code Logic
async function runCode(options = {}) {
  if (!pyodide || (!editor && typeof options.sourceCode !== 'string')) return;
  
  const runBtn = options.runButton || document.getElementById('btn-run');
  const readyText = options.readyText || RUN_BUTTON_READY_TEXT;
  const runningText = options.runningText || '⚡ 运行中...';
  const consoleTarget = getConsoleTarget(options.consoleTarget);
  const stdinInput = options.stdinInput || document.getElementById('stdin-input');

  if (runBtn) {
    runBtn.disabled = true;
    runBtn.innerHTML = runningText;
  }
  
  playSound('click');
  clearConsole(consoleTarget);
  appendConsole("开始执行代码...", "system", consoleTarget);
  
  const userCode = typeof options.sourceCode === 'string' ? options.sourceCode : editor.getValue();
  
  // Captured outputs
  let stdoutLogs = "";
  
  pyodide.setStdout({
    batched: (text) => {
      stdoutLogs += text + "\n";
      appendConsole(text, 'output', consoleTarget);
    }
  });
  
  pyodide.setStderr({
    batched: (text) => {
      stdoutLogs += text + "\n";
      appendConsole(text, 'error', consoleTarget);
    }
  });

  try {
    await clearPyodideGlobals();
    await installPyodideStdin(getStdinLines(stdinInput));
    await pyodide.runPythonAsync(userCode);
    appendConsole("\n--- 执行完成 (Exit Code: 0) ---", "system", consoleTarget);
    return { success: true, stdout: stdoutLogs };
  } catch (err) {
    appendConsole(err.message, 'error', consoleTarget);
    appendConsole("\n--- 执行失败 (Exit Code: 1) ---", "system", consoleTarget);
    return { success: false, error: err.message, stdout: stdoutLogs };
  } finally {
    if (runBtn) {
      runBtn.disabled = false;
      runBtn.innerHTML = readyText;
    }
  }
}

// Submit and Validate Code Logic
async function submitCode() {
  if (!pyodide || !editor) return;
  
  const submitBtn = document.getElementById('btn-submit');
  submitBtn.disabled = true;
  submitBtn.innerHTML = '🔍 验证中...';
  
  playSound('click');
  
  // Run first to check for syntax error and capture output
  let runResult;
  try {
    runResult = await runCode();
  } catch (err) {
    appendConsole(`\n运行环境错误：${err.message}`, "error");
    showToast("运行环境遇到错误，请刷新后再试。", 'error');
    submitBtn.disabled = false;
    submitBtn.innerHTML = SUBMIT_BUTTON_READY_TEXT;
    return;
  }
  if (!runResult || !runResult.success) {
    showToast("代码运行失败，先修复错误再提交验证。", 'error');
    submitBtn.disabled = false;
    submitBtn.innerHTML = SUBMIT_BUTTON_READY_TEXT;
    return;
  }

  const userCode = editor.getValue();
  const currentLesson = lessons[currentLessonIndex];
  
  // Retrieve global namespace from Python
  const globals = pyodide.globals;
  
  try {
    const validation = await currentLesson.validate(userCode, runResult.stdout, globals, pyodide);
    
    if (validation.success) {
      appendConsole(`\n验证通过！恭喜通关：${currentLesson.title}`, "success");
      
      // Save progress
      if (!completedLessons.includes(currentLesson.id)) {
        completedLessons.push(currentLesson.id);
        saveCompletedLessons();
      }
      
      updateUI();
      triggerConfetti();
      showSuccessModal(validation.message);
    } else {
      appendConsole(`\n验证失败：${validation.message}`, "error");
      showToast(validation.message, 'error');
    }
  } catch (err) {
    appendConsole(`\n验证脚本执行异常：${err.message}`, "error");
    showToast("验证逻辑发生错误，请检查代码结构是否完整！", 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = SUBMIT_BUTTON_READY_TEXT;
  }
}

// Show validation completion Modal
function showSuccessModal(message) {
  const modal = document.getElementById('modal-overlay');
  document.getElementById('modal-custom-text').innerText = message;
  modal.classList.add('active');
  playSound('success');
}

function hideSuccessModal() {
  const modal = document.getElementById('modal-overlay');
  modal.classList.remove('active');
  playSound('click');
  
  // Auto-advance to next lesson if available
  if (currentLessonIndex < lessons.length - 1) {
    loadLesson(currentLessonIndex + 1);
  }
}

// Load Lesson content
function loadLesson(index) {
  currentLessonIndex = index;
  const lesson = lessons[index];
  closeAnswerPanel();
  
  // Set active sidebar item
  document.querySelectorAll('.lesson-item').forEach((item, idx) => {
    item.classList.toggle('active', idx === index);
  });
  
  // Render Markdown details
  document.getElementById('lesson-detail-title').innerText = lesson.title;
  document.getElementById('lesson-detail-body').innerHTML = marked.parse(lesson.description);
  document.getElementById('task-text').innerText = lesson.task;
  document.getElementById('hint-content').innerText = lesson.hint;
  
  // Close hint
  document.getElementById('hint-content').classList.remove('active');
  document.getElementById('btn-hint-text').innerText = '查看提示';
  
  // Load code in Editor
  if (editor) {
    editor.setValue(lesson.defaultCode);
  }
  
  // Scroll content panel back to top
  document.getElementById('content-panel').scrollTop = 0;
  clearConsole();
  appendConsole(`加载关卡：${lesson.title}。请阅读左侧内容并开始编程。`, "system");
}

// Generate the sidebar dynamically
function renderSidebar() {
  const sidebar = document.getElementById('sidebar-lessons');
  sidebar.innerHTML = '';
  
  // Group lessons by level
  const levels = {
    1: 'Level 1: 启程 (Basics)',
    2: 'Level 2: 分支与循环 (Control)',
    3: 'Level 3: 数据结构 (Structures)',
    4: 'Level 4: 函数与模块 (Logic)',
    5: 'Level 5: 实战炼金 (Projects)',
    6: 'Level 6: 工程化与调试 (Engineering)',
    7: 'Level 7: 数据文件处理 (Data)',
    8: 'Level 8: 命令行工具 (CLI)',
    9: 'Level 9: Web 与 API (Web)',
    10: 'Level 10: SQLite 数据库 (Database)',
    11: 'Level 11: 软件设计与测试 (Quality)',
    12: 'Level 12: 综合项目 (Capstone)'
  };
  
  const levelNumbers = Array.from(new Set(lessons.map(lesson => lesson.level))).sort((a, b) => a - b);

  levelNumbers.forEach((lvl) => {
    const groupLessons = lessons.filter(l => l.level === lvl);
    if (groupLessons.length === 0) return;

    const groupDiv = document.createElement('div');
    groupDiv.className = 'level-group';
    
    const groupTitle = document.createElement('div');
    groupTitle.className = 'level-group-title';
    groupTitle.innerHTML = `<span>${levels[lvl] || `Level ${lvl}`}</span>`;
    groupDiv.appendChild(groupTitle);
    
    const ul = document.createElement('ul');
    ul.className = 'lesson-list';

    groupLessons.forEach((lesson) => {
      const isCompleted = completedLessons.includes(lesson.id);
      
      // A lesson is unlocked if it's the very first lesson, or if the previous lesson is completed
      let isUnlocked = false;
      const lessonGlobalIndex = lessons.findIndex(l => l.id === lesson.id);
      if (lessonGlobalIndex === 0) {
        isUnlocked = true;
      } else {
        const prevLesson = lessons[lessonGlobalIndex - 1];
        if (completedLessons.includes(prevLesson.id)) {
          isUnlocked = true;
        }
      }

      const li = document.createElement('li');
      li.className = `lesson-item ${isCompleted ? 'completed' : ''} ${!isUnlocked ? 'locked' : ''}`;
      if (lessonGlobalIndex === currentLessonIndex) {
        li.classList.add('active');
      }
      
      li.innerHTML = `
        <span>${lesson.title.split('. ')[1]}</span>
        <span class="lesson-status"></span>
      `;
      
      if (isUnlocked) {
        li.addEventListener('click', () => {
          playSound('click');
          loadLesson(lessonGlobalIndex);
        });
      }
      
      ul.appendChild(li);
    });
    
    groupDiv.appendChild(ul);
    sidebar.appendChild(groupDiv);
  });
}

// Refresh overall progress values
function updateUI() {
  completedLessons = normalizeCompletedLessons(completedLessons);

  // Render sidebar links with correct unlocked/completed states
  renderSidebar();
  
  // Calculate percentage
  const total = lessons.length;
  const completed = completedLessons.length;
  const percent = Math.round((completed / total) * 100);
  
  document.getElementById('progress-bar').style.width = `${percent}%`;
  document.getElementById('progress-pct').innerText = `${percent}%`;
  document.getElementById('progress-header-label').innerText = `修炼进度: ${completed}/${total} 关`;
}

// Reset all levels progress
async function resetProgress() {
  const confirmed = await showConfirmDialog({
    icon: '🔄',
    title: '重置学习进度',
    message: '确定要清空所有已通关记录吗？这个操作无法恢复。',
    confirmText: '重置进度',
    danger: true
  });

  if (confirmed) {
    completedLessons = [];
    safeStorageRemove(STORAGE_KEYS.completed);
    playSound('fail');
    showToast("进度已被完全重置！", 'error');
    updateUI();
    loadLesson(0);
  }
}

function showConfirmDialog({ icon = '⚠️', title, message, confirmText = '确认', cancelText = '取消', danger = false }) {
  const overlay = document.getElementById('confirm-modal-overlay');
  const iconEl = document.getElementById('confirm-modal-icon');
  const titleEl = document.getElementById('confirm-modal-title');
  const textEl = document.getElementById('confirm-modal-text');
  const acceptBtn = document.getElementById('btn-confirm-accept');
  const cancelBtn = document.getElementById('btn-confirm-cancel');

  if (!overlay || !iconEl || !titleEl || !textEl || !acceptBtn || !cancelBtn) {
    return Promise.resolve(false);
  }

  iconEl.innerText = icon;
  titleEl.innerText = title;
  textEl.innerText = message;
  acceptBtn.innerText = confirmText;
  cancelBtn.innerText = cancelText;
  acceptBtn.classList.toggle('btn-danger', danger);
  acceptBtn.classList.toggle('btn-primary', !danger);

  overlay.classList.add('active');
  overlay.setAttribute('aria-hidden', 'false');
  setTimeout(() => acceptBtn.focus(), 50);

  return new Promise((resolve) => {
    pendingConfirmResolve = resolve;
  });
}

function closeConfirmDialog(result) {
  const overlay = document.getElementById('confirm-modal-overlay');
  if (overlay) {
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
  }

  if (pendingConfirmResolve) {
    pendingConfirmResolve(result);
    pendingConfirmResolve = null;
  }
}

function getAnswerPanelBounds() {
  const header = document.querySelector('.app-header');
  const workspace = document.querySelector('.workspace-panel');
  const headerBottom = header ? header.getBoundingClientRect().bottom : 0;
  const workspaceRect = workspace ? workspace.getBoundingClientRect() : null;
  const sideBySideWorkspace = workspaceRect && workspaceRect.left > window.innerWidth * 0.45 && workspaceRect.top <= headerBottom + 4;
  const rightEdge = sideBySideWorkspace ? workspaceRect.left - 12 : window.innerWidth - 12;
  const leftEdge = 12;
  const topEdge = headerBottom + 12;
  const bottomEdge = window.innerHeight - 12;

  return {
    left: leftEdge,
    top: topEdge,
    right: Math.max(leftEdge + 300, rightEdge),
    bottom: Math.max(topEdge + 220, bottomEdge),
    minWidth: 300,
    minHeight: 220
  };
}

function applyAnswerPanelRect(panel, rect) {
  panel.style.left = `${Math.round(rect.left)}px`;
  panel.style.top = `${Math.round(rect.top)}px`;
  panel.style.width = `${Math.round(rect.width)}px`;
  panel.style.height = `${Math.round(rect.height)}px`;
}

function constrainAnswerPanelRect(rect) {
  const bounds = getAnswerPanelBounds();
  const maxWidth = Math.max(bounds.minWidth, bounds.right - bounds.left);
  const maxHeight = Math.max(bounds.minHeight, bounds.bottom - bounds.top);
  const width = Math.max(bounds.minWidth, Math.min(rect.width, maxWidth));
  const height = Math.max(bounds.minHeight, Math.min(rect.height, maxHeight));
  const left = Math.max(bounds.left, Math.min(rect.left, bounds.right - width));
  const top = Math.max(bounds.top, Math.min(rect.top, bounds.bottom - height));

  return { left, top, width, height };
}

function positionAnswerPanel(panel) {
  const contentPanel = document.getElementById('content-panel');
  const header = document.querySelector('.app-header');
  const contentRect = contentPanel ? contentPanel.getBoundingClientRect() : null;
  const headerBottom = header ? header.getBoundingClientRect().bottom : 0;
  const bounds = getAnswerPanelBounds();
  const left = contentRect ? contentRect.left + 28 : bounds.left;
  const top = Math.max(headerBottom + 18, contentRect ? contentRect.top + 18 : bounds.top);
  const width = Math.min(500, bounds.right - bounds.left);
  const height = Math.min(460, bounds.bottom - top);

  applyAnswerPanelRect(panel, constrainAnswerPanelRect({ left, top, width, height }));
}

function updateAnswerButton(isOpen) {
  const btn = document.getElementById('btn-reveal-solution');
  if (!btn) return;
  btn.innerText = isOpen ? ANSWER_BUTTON_CANCEL_TEXT : ANSWER_BUTTON_READY_TEXT;
  btn.classList.toggle('active', isOpen);
}

function closeAnswerPanel() {
  const panel = document.getElementById('answer-panel');
  if (!panel) return;
  panel.classList.remove('active', 'dragging', 'resizing');
  panel.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('answer-panel-moving');
  updateAnswerButton(false);
}

function openAnswerPanel() {
  const panel = document.getElementById('answer-panel');
  const codeView = document.getElementById('answer-code-view');
  const titleText = document.getElementById('answer-panel-title-text');
  if (!panel || !codeView || !titleText) return;

  const lesson = lessons[currentLessonIndex];
  titleText.innerText = `${lesson.title} · 参考答案`;
  codeView.textContent = lesson.solution;
  panel.classList.add('active');
  panel.setAttribute('aria-hidden', 'false');
  positionAnswerPanel(panel);
  updateAnswerButton(true);
  playSound('click');
  appendConsole("已打开只读参考答案浮窗，编辑器仍可继续编写。", "system");
}

// Toggle readonly floating answer viewer
function revealSolution() {
  const panel = document.getElementById('answer-panel');
  if (panel && panel.classList.contains('active')) {
    closeAnswerPanel();
    playSound('click');
    appendConsole("已取消查看参考答案。", "system");
  } else {
    openAnswerPanel();
  }
}

function initAnswerPanelControls() {
  if (answerPanelInitialized) return;
  const panel = document.getElementById('answer-panel');
  const header = document.getElementById('answer-panel-drag-handle');
  const resizeHandle = document.getElementById('answer-panel-resize-handle');
  const closeBtn = document.getElementById('btn-answer-panel-close');
  if (!panel || !header || !resizeHandle || !closeBtn) return;

  answerPanelInitialized = true;

  closeBtn.addEventListener('click', () => {
    closeAnswerPanel();
    playSound('click');
  });

  header.addEventListener('pointerdown', (event) => {
    if (event.target.closest('button')) return;
    event.preventDefault();
    const startRect = panel.getBoundingClientRect();
    const startX = event.clientX;
    const startY = event.clientY;
    panel.classList.add('dragging');
    document.body.classList.add('answer-panel-moving');

    function onMove(moveEvent) {
      const nextRect = constrainAnswerPanelRect({
        left: startRect.left + moveEvent.clientX - startX,
        top: startRect.top + moveEvent.clientY - startY,
        width: startRect.width,
        height: startRect.height
      });
      applyAnswerPanelRect(panel, nextRect);
    }

    function onUp() {
      panel.classList.remove('dragging');
      document.body.classList.remove('answer-panel-moving');
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    }

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  });

  resizeHandle.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    event.stopPropagation();
    const startRect = panel.getBoundingClientRect();
    const startX = event.clientX;
    const startY = event.clientY;
    panel.classList.add('resizing');
    document.body.classList.add('answer-panel-moving');

    function onMove(moveEvent) {
      const nextRect = constrainAnswerPanelRect({
        left: startRect.left,
        top: startRect.top,
        width: startRect.width + moveEvent.clientX - startX,
        height: startRect.height + moveEvent.clientY - startY
      });
      applyAnswerPanelRect(panel, nextRect);
    }

    function onUp() {
      panel.classList.remove('resizing');
      document.body.classList.remove('answer-panel-moving');
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    }

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  });

  window.addEventListener('resize', () => {
    if (!panel.classList.contains('active')) return;
    const currentRect = panel.getBoundingClientRect();
    applyAnswerPanelRect(panel, constrainAnswerPanelRect({
      left: currentRect.left,
      top: currentRect.top,
      width: currentRect.width,
      height: currentRect.height
    }));
  });
}

function getEditorValue() {
  return editor && typeof editor.getValue === 'function' ? editor.getValue() : '';
}

function setEditorValue(value) {
  if (editor && typeof editor.setValue === 'function') {
    editor.setValue(value);
  }
}

function syncFocusToMain() {
  const focusEditor = document.getElementById('focus-code-editor');
  const focusStdin = document.getElementById('focus-stdin-input');
  const mainStdin = document.getElementById('stdin-input');
  if (focusEditor) setEditorValue(focusEditor.value);
  if (focusStdin && mainStdin) mainStdin.value = focusStdin.value;
}

function syncFocusConsoleToMain() {
  const focusConsole = document.getElementById('focus-console-log');
  const mainConsole = document.getElementById('console-log');
  if (!focusConsole || !mainConsole || !focusConsole.childElementCount) return;
  mainConsole.innerHTML = focusConsole.innerHTML;
  mainConsole.scrollTop = mainConsole.scrollHeight;
}

function openFocusMode() {
  const modal = document.getElementById('focus-modal');
  const focusEditor = document.getElementById('focus-code-editor');
  const focusStdin = document.getElementById('focus-stdin-input');
  const mainStdin = document.getElementById('stdin-input');
  const focusConsole = document.getElementById('focus-console-log');
  if (!modal || !focusEditor || !focusStdin || !focusConsole) return;

  closeAnswerPanel();
  focusEditor.value = getEditorValue();
  focusStdin.value = mainStdin ? mainStdin.value : '';
  clearConsole(focusConsole);
  appendConsole("专注模式已打开。运行结果会显示在这里，关闭后代码会同步回主编辑器。", "system", focusConsole);
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('focus-mode-open');
  playSound('click');
  setTimeout(() => focusEditor.focus(), 50);
}

function closeFocusMode() {
  const modal = document.getElementById('focus-modal');
  if (!modal) return;
  syncFocusToMain();
  syncFocusConsoleToMain();
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('focus-mode-open');
  playSound('click');
}

async function runFocusCode() {
  const focusEditor = document.getElementById('focus-code-editor');
  const focusStdin = document.getElementById('focus-stdin-input');
  const focusConsole = document.getElementById('focus-console-log');
  const focusRunBtn = document.getElementById('btn-focus-run');
  if (!focusEditor || !focusConsole) return;

  syncFocusToMain();
  await runCode({
    sourceCode: focusEditor.value,
    consoleTarget: focusConsole,
    stdinInput: focusStdin,
    runButton: focusRunBtn,
    readyText: FOCUS_RUN_BUTTON_READY_TEXT,
    runningText: '▶ 运行中...'
  });
}

function insertTextAtSelection(textarea, text) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  textarea.value = `${textarea.value.slice(0, start)}${text}${textarea.value.slice(end)}`;
  textarea.selectionStart = start + text.length;
  textarea.selectionEnd = start + text.length;
}

function bindFocusEditorShortcuts() {
  const focusEditor = document.getElementById('focus-code-editor');
  if (!focusEditor) return;

  focusEditor.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      insertTextAtSelection(focusEditor, '    ');
      return;
    }

    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault();
      runFocusCode();
    }
  });
}

// Toggle sound control
function toggleSound() {
  isSoundEnabled = !isSoundEnabled;
  const btn = document.getElementById('btn-sound');
  if (isSoundEnabled) {
    btn.innerHTML = '🔊';
    btn.classList.remove('active');
    showToast("音效已开启", 'success');
  } else {
    btn.innerHTML = '🔇';
    btn.classList.add('active');
  }
}

// Event Bindings on DOM load
document.addEventListener("DOMContentLoaded", async () => {
  // Custom Password Lock Screen Logic
  const lockOverlay = document.getElementById('lock-overlay');
  const lockInput = document.getElementById('lock-password-input');
  const lockSubmit = document.getElementById('lock-submit-btn');
  const lockError = document.getElementById('lock-error-msg');
  const lockBtnHeader = document.getElementById('btn-lock');

  function checkLockStatus() {
    const isUnlocked = safeStorageGet(STORAGE_KEYS.unlocked) === 'true';
    if (isUnlocked) {
      if (lockOverlay) lockOverlay.classList.add('hidden');
    } else {
      if (lockOverlay) lockOverlay.classList.remove('hidden');
      if (lockInput) {
        setTimeout(() => lockInput.focus(), 100);
      }
    }
  }

  function handleUnlock() {
    if (!lockInput) return;
    const value = lockInput.value.trim().toUpperCase();
    if (value === 'YYS') {
      safeStorageSet(STORAGE_KEYS.unlocked, 'true');
      if (lockOverlay) lockOverlay.classList.add('hidden');
      if (lockError) lockError.style.display = 'none';
      try {
        playSound('success');
        triggerConfetti();
      } catch (soundErr) {
        console.warn(soundErr);
      }
      showToast("✨ 专属修炼场已解锁，祝你生日快乐！🎂", 'success');
    } else {
      try {
        playSound('fail');
      } catch (soundErr) {
        console.warn(soundErr);
      }
      if (lockError) {
        lockError.style.display = 'block';
        lockError.style.animation = 'none';
        lockError.offsetHeight; // trigger reflow
        lockError.style.animation = 'shakeError 0.4s ease-in-out';
      }
      lockInput.select();
      lockInput.focus();
    }
  }

  if (lockSubmit && lockInput) {
    lockSubmit.addEventListener('click', handleUnlock);
    lockInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleUnlock();
    });
  }

  if (lockBtnHeader) {
    lockBtnHeader.addEventListener('click', async () => {
      const confirmed = await showConfirmDialog({
        icon: '🔐',
        title: '锁定修炼场',
        message: '锁定后需要重新输入暗号才能进入。',
        confirmText: '重新锁定'
      });

      if (confirmed) {
        safeStorageRemove(STORAGE_KEYS.unlocked);
        window.location.reload();
      }
    });
  }

  checkLockStatus();
  initAnswerPanelControls();
  bindFocusEditorShortcuts();

  // Theme toggle button action
  const btnTheme = document.getElementById('btn-theme');
  
  function updateThemeButtonState() {
    if (!btnTheme) return;
    const isDark = document.body.classList.contains('dark-mode');
    btnTheme.innerHTML = isDark ? '☀️' : '🌙';
    btnTheme.title = isDark ? '切换浅色主题' : '切换深色主题';
    btnTheme.classList.toggle('active', isDark);
  }
  
  // Initialize theme button icon based on current state
  updateThemeButtonState();
  
  if (btnTheme) {
    btnTheme.addEventListener('click', () => {
      playSound('click');
      document.body.classList.toggle('dark-mode');
      const isDark = document.body.classList.contains('dark-mode');
      safeStorageSet(STORAGE_KEYS.theme, isDark ? 'dark' : 'light');
      updateThemeButtonState();
      
      if (typeof monaco !== 'undefined' && monaco.editor) {
        monaco.editor.setTheme(isDark ? 'cream-editor-dark' : 'cream-editor');
      }
      
      showToast(isDark ? '已切换至深色护眼模式' : '已切换至米白护眼模式', 'success');
    });
  }

  // Action listeners
  document.getElementById('btn-run').addEventListener('click', () => runCode());
  document.getElementById('btn-submit').addEventListener('click', submitCode);
  document.getElementById('btn-focus-code').addEventListener('click', openFocusMode);
  document.getElementById('btn-focus-run').addEventListener('click', runFocusCode);
  document.getElementById('btn-focus-close').addEventListener('click', closeFocusMode);
  document.getElementById('btn-reveal-solution').addEventListener('click', revealSolution);
  document.getElementById('btn-close-modal').addEventListener('click', hideSuccessModal);
  document.getElementById('btn-reset-progress').addEventListener('click', resetProgress);
  document.getElementById('btn-sound').addEventListener('click', toggleSound);
  document.getElementById('btn-clear-console').addEventListener('click', clearConsole);
  document.getElementById('btn-clear-stdin').addEventListener('click', () => {
    const stdinInput = document.getElementById('stdin-input');
    if (stdinInput) stdinInput.value = '';
  });

  const confirmOverlay = document.getElementById('confirm-modal-overlay');
  const confirmAccept = document.getElementById('btn-confirm-accept');
  const confirmCancel = document.getElementById('btn-confirm-cancel');

  if (confirmAccept) {
    confirmAccept.addEventListener('click', () => closeConfirmDialog(true));
  }

  if (confirmCancel) {
    confirmCancel.addEventListener('click', () => closeConfirmDialog(false));
  }

  if (confirmOverlay) {
    confirmOverlay.addEventListener('click', (event) => {
      if (event.target === confirmOverlay) {
        closeConfirmDialog(false);
      }
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && pendingConfirmResolve) {
      closeConfirmDialog(false);
    } else if (event.key === 'Escape') {
      const focusModal = document.getElementById('focus-modal');
      if (focusModal && focusModal.classList.contains('active')) {
        closeFocusMode();
      }
    }
  });

  const focusModal = document.getElementById('focus-modal');
  if (focusModal) {
    focusModal.addEventListener('click', (event) => {
      if (event.target === focusModal) {
        closeFocusMode();
      }
    });
  }

  // Toggle Hint content visibility
  document.getElementById('btn-hint').addEventListener('click', () => {
    playSound('click');
    const content = document.getElementById('hint-content');
    const text = document.getElementById('btn-hint-text');
    const isActive = content.classList.contains('active');
    
    if (isActive) {
      content.classList.remove('active');
      text.innerText = '查看提示';
    } else {
      content.classList.add('active');
      text.innerText = '隐藏提示';
    }
  });

  // Render temporary progress status in Left tutorial panel
  const detailTitle = document.getElementById('lesson-detail-title');
  const detailBody = document.getElementById('lesson-detail-body');
  
  if (detailTitle) detailTitle.innerText = "正在初始化修炼场环境...";
  if (detailBody) {
    detailBody.innerHTML = `
      <div style="font-family: sans-serif; line-height: 1.6; color: var(--text-main);">
        <p>正在努力为您准备精彩的教学内容，正在并行加载学习组件：</p>
        <ul style="list-style-type: none; padding-left: 0; margin-top: 16px;">
          <li id="step-marked" style="margin-bottom: 12px; display: flex; align-items: center;">⏳ 正在准备 Markdown 解析引擎 (1/3) ...</li>
          <li id="step-monaco" style="margin-bottom: 12px; display: flex; align-items: center;">⏳ 正在准备代码编辑器 (2/3) ...</li>
          <li id="step-pyodide" style="margin-bottom: 12px; display: flex; align-items: center;">⏳ 正在准备 Python 编译引擎 (3/3) ...</li>
        </ul>
        <p style="margin-top: 24px; font-size: 13px; color: var(--text-muted);">提示：系统内置了多个备用 CDN 加速通道。若首选通道较慢，系统将在 4 秒后自动尝试备用通道，无需手动干预。</p>
      </div>
    `;
  }

  const stepMarked = document.getElementById('step-marked');
  const stepMonaco = document.getElementById('step-monaco');
  const stepPyodide = document.getElementById('step-pyodide');

  const markedUrls = [
    "https://cdn.staticfile.net/marked/11.1.1/marked.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/marked/11.1.1/marked.min.js",
    "https://cdn.bootcdn.net/ajax/libs/marked/11.1.1/marked.min.js",
    "https://gcore.jsdelivr.net/npm/marked@11.1.1/lib/marked.umd.js"
  ];
  
  const monacoUrls = [
    "https://gcore.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs/loader.js",
    "https://testingcf.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs/loader.js",
    "https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs/loader.js",
    "https://fastly.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs/loader.js",
    "https://cdn.staticfile.net/monaco-editor/0.45.0/min/vs/loader.min.js",
    "https://cdn.bootcdn.net/ajax/libs/monaco-editor/0.45.0/min/vs/loader.min.js"
  ];
  
  const isLocal = window.location.hostname === 'localhost' || 
                  window.location.hostname === '127.0.0.1' || 
                  window.location.protocol === 'file:';

  const pyodideUrls = isLocal ? [
    "./pyodide/pyodide.js",
    "https://gcore.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js",
    "https://testingcf.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js",
    "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js",
    "https://fastly.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js"
  ] : [
    "https://gcore.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js",
    "https://testingcf.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js",
    "./pyodide/pyodide.js",
    "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js",
    "https://fastly.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js"
  ];

  // 1. Load Marked.js first to render text immediately
  let loadedMarked = null;
  try {
    loadedMarked = await loadScriptWithFallback("Marked.js", markedUrls, 4000);
    if (stepMarked) stepMarked.innerHTML = "✅ Markdown 解析引擎准备就绪！";
    
    try {
      if (typeof marked !== "undefined") {
        if (typeof marked.use === "function") {
          marked.use({ breaks: true, gfm: true });
        } else if (typeof marked.setOptions === "function") {
          marked.setOptions({ breaks: true, gfm: true });
        }
      }
    } catch (e) {
      console.warn("Failed to configure marked:", e);
    }
    
    // Render the tutorial and sidebar immediately!
    try {
      updateUI();
      let targetIndex = 0;
      for (let i = 0; i < lessons.length; i++) {
        if (!completedLessons.includes(lessons[i].id)) {
          targetIndex = i;
          break;
        }
      }
      loadLesson(targetIndex);
    } catch (uiErr) {
      console.error("UI Initialization failed:", uiErr);
    }
  } catch (err) {
    if (stepMarked) stepMarked.innerHTML = "❌ Markdown 解析引擎加载失败！";
    showFatalError("Markdown 解析引擎在所有备用通道上加载均超时或出错，请检查您的网络连接并重试。");
    return;
  }

  // 2. Load Monaco Editor
  let loadedMonaco = null;
  try {
    loadedMonaco = await loadScriptWithFallback("Monaco Editor Loader", monacoUrls, 4000);
    const vsPath = loadedMonaco.url.substring(0, loadedMonaco.url.lastIndexOf('/'));
    initMonaco(vsPath);
    if (stepMonaco) stepMonaco.innerHTML = "✅ 代码编辑器加载成功！";
  } catch (err) {
    if (stepMonaco) stepMonaco.innerHTML = "❌ 代码编辑器加载失败！";
    console.error(err);
    appendConsole("代码编辑器在所有通道加载失败，请检查网络并刷新重试。", "error");
    const loaderText = document.getElementById('loader-text');
    if (loaderText) {
      loaderText.innerText = "代码编辑器载入失败！";
    }
  }

  // 3. Load Pyodide
  let loadedPyodide = null;
  try {
    loadedPyodide = await loadScriptWithFallback("Pyodide Python Compiler", pyodideUrls, 5000);
    const pyodideBaseUrl = loadedPyodide.url.substring(0, loadedPyodide.url.lastIndexOf('/') + 1);
    await initPyodide(pyodideBaseUrl);
    if (stepPyodide) stepPyodide.innerHTML = "✅ Python 编译引擎载入成功！";
  } catch (err) {
    if (stepPyodide) stepPyodide.innerHTML = "❌ Python 编译引擎加载失败！";
    console.error(err);
    appendConsole("Python 编译环境在所有通道加载失败，请检查网络并刷新重试。", "error");
    const loaderText = document.getElementById('loader-text');
    if (loaderText) {
      loaderText.innerText = "编译器载入失败！";
    }
  }
});
