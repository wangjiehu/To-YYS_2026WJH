// python-learning-hub/lessons.js

const lessons = [
  {
    id: 1,
    level: 1,
    title: "1. 你好 Python (Hello World)",
    description: `### 🌟 欢迎来到 Python 的世界！

Python 是一门语法简单、功能强大的编程语言，被广泛应用于人工智能、数据分析、网页开发等领域。几乎所有程序员学习新语言时，写下的第一行代码都是向世界问好。

在 Python 中，我们使用 \`print()\` 函数将信息输出到屏幕上。

#### 📘 详细语法解析：
- **\`print\`**：是一个内置的函数名，意思是“打印”或“输出”。
- **括号 \`()\`**：紧跟在函数名后面，表示调用该函数。括号内填入你想打印的具体内容，这被称为函数的**参数**。
- **引号 \`" "\` 或 \`' '\`**：用来包裹文本。在编程中，文本被称为**字符串 (String)**。如果你不加引号，Python 会误以为这是个变量或代码指令，从而报错。
- **英文半角**：Python 极为严谨。所有的括号、引号、逗号都必须在**英文输入法**状态下输入！中文的 \`（）\` 和 \`“”\` 会导致语法错误 (\`SyntaxError\`)。

#### 📝 示例：
\`\`\`python
print("Hello, World!") # 输出文本
print(2026)            # 输出数字，数字不需要加引号
\`\`\``,
    task: "在右侧编辑器中，编写一行代码，使用 `print()` 函数输出字符串 `Hello, Python!`（注意拼写、大小写以及最后的惊叹号）。",
    hint: "检查拼写：必须精确输入 `print(\"Hello, Python!\")`。注意双引号和括号必须是半角英文符号。",
    defaultCode: "# 在下方写下你的第一行 Python 代码并点击【运行代码】\n",
    solution: "print(\"Hello, Python!\")",
    validate: async (code, stdout, globals, pyodide) => {
      if (!stdout.includes("Hello, Python!")) {
        return {
          success: false,
          message: "控制台输出中没有找到 'Hello, Python!'，请检查拼写、大小写和标点符号。"
        };
      }
      return { success: true, message: "太棒了！你的 Python 魔法成功启航！" };
    }
  },
  {
    id: 2,
    level: 1,
    title: "2. 数据与容器 (变量声明)",
    description: `### 📦 什么是变量？

你可以把**变量**想象成一个带标签的盒子。你可以把数据（如数字、文字等）放进盒子里，然后贴上标签（变量名）。以后只要喊这个标签的名字，就可以拿到或修改里面的数据。

在 Python 中，我们使用等号 \`=\` 来给变量赋值。

#### 📘 详细语法解析：
- **\`=\` 是赋值运算符**：这和数学里的“等于”不同。它的含义是“把右边的值，装进左边的变量盒子里”。
- **变量命名规则**：
  - 只能包含字母、数字和下划线 \`_\`。
  - 不能以数字开头（例如 \`1a\` 是非法的）。
  - 不能是 Python 的保留关键字（如 \`print\`, \`if\` 等）。
  - 严格区分大小写（\`a\` 和 \`A\` 是两个完全不同的变量）。
- 变量之间可以直接进行数学运算，如 \`+\`, \`-\`, \`*\`, \`/\`。

#### 📝 示例：
\`\`\`python
x = 10
y = 20
total = x + y  # 计算 10 + 20，并把 30 存入 total 变量中
\`\`\``,
    task: "请在右侧编写代码：\n1. 创建一个变量 `a` 并赋值为 `23`\n2. 创建一个变量 `b` 并赋值为 `34`\n3. 创建一个变量 `c`，使其值为 `a` 和 `b` 的乘积（使用 `*` 运算符）。",
    hint: "使用乘号 `*` 进行乘法运算。代码写法：\na = 23\nb = 34\nc = a * b",
    defaultCode: "# 声明变量并进行乘法运算\n",
    solution: "a = 23\nb = 34\nc = a * b",
    validate: async (code, stdout, globals, pyodide) => {
      if (!globals.has("a")) return { success: false, message: "未检测到变量 'a'。" };
      if (!globals.has("b")) return { success: false, message: "未检测到变量 'b'。" };
      if (!globals.has("c")) return { success: false, message: "未检测到变量 'c'。" };

      const a = globals.get("a");
      const b = globals.get("b");
      const c = globals.get("c");

      if (a !== 23) return { success: false, message: "变量 'a' 的值应该等于 23。" };
      if (b !== 34) return { success: false, message: "变量 'b' 的值应该等于 34。" };
      if (c !== 782) return { success: false, message: "变量 'c' 计算结果不对，它应该是 a 和 b 的乘积（23 * 34 = 782）。" };

      return { success: true, message: "变量创建与乘法计算完全正确！" };
    }
  },
  {
    id: 3,
    level: 1,
    title: "3. 运算符进阶 (整除、取余与幂)",
    description: `### ➗ 官方文档：数学运算进阶

除了基本的加减乘除之外，Python 提供了几个在算法和数据处理中非常重要且独特的数学运算符：

1. **浮点除法 \`/\`**：结果永远是浮点数（小数）。例如 \`7 / 2\` 得到 \`3.5\`。
2. **整除 \`//\` (Floor Division)**：舍去小数部分，只保留整数商。例如 \`7 // 2\` 得到 \`3\`。
3. **求余数 \`%\` (Modulo)**：获取除法运算的余数。常用于判断奇偶数或整除关系。例如 \`7 % 2\` 得到 \`1\`（因为 7 = 3 * 2 + 1）。
4. **幂运算 \`**\` (Exponentiation)**：求底数的指数次方。例如 \`2 ** 3\` 表示 2 的 3 次方，结果是 \`8\`。

#### 📝 示例：
\`\`\`python
print(9 // 4)  # 输出: 2
print(9 % 4)   # 输出: 1
print(3 ** 3)  # 输出: 27
\`\`\``,
    task: "请在右侧写出代码计算以下三个算式，并将结果依次存入对应的变量中：\n1. `17` 对 `5` 进行整除，结果存入变量 `div_val`\n2. `17` 对 `5` 求余数，结果存入变量 `mod_val`\n3. 计算 `5` 的 `4` 次方，结果存入变量 `power_val`",
    hint: "使用 // 计算整除，使用 % 计算余数，使用 ** 计算幂运算：\ndiv_val = 17 // 5\nmod_val = 17 % 5\npower_val = 5 ** 4",
    defaultCode: "# 编写代码计算整除、求余和幂运算\n",
    solution: "div_val = 17 // 5\nmod_val = 17 % 5\npower_val = 5 ** 4",
    validate: async (code, stdout, globals, pyodide) => {
      if (!globals.has("div_val")) return { success: false, message: "没有定义变量 'div_val'。" };
      if (!globals.has("mod_val")) return { success: false, message: "没有定义变量 'mod_val'。" };
      if (!globals.has("power_val")) return { success: false, message: "没有定义变量 'power_val'。" };

      if (globals.get("div_val") !== 3) return { success: false, message: "div_val 计算错误，17 // 5 应当是 3。" };
      if (globals.get("mod_val") !== 2) return { success: false, message: "mod_val 计算错误，17 % 5 应当是 2。" };
      if (globals.get("power_val") !== 625) return { success: false, message: "power_val 计算错误，5 ** 4 应该是 625。" };

      return { success: true, message: "非常棒！这三种高级数学运算符是编写复杂逻辑的必备基础！" };
    }
  },
  {
    id: 4,
    level: 1,
    title: "4. 类型的秘密 (数据类型转换)",
    description: `### 🔍 认识数据的“性格”

不同类型的数据，其行为和规则是完全不同的。Python 中最常用的基础数据类型包括：
1. **整数 (\`int\`)**：如 \`100\`, \`-5\`，没有小数部分。
2. **浮点数 (\`float\`)**：即小数，如 \`3.14\`, \`0.0\`。
3. **字符串 (\`str\`)**：用引号包裹的文本，如 \`"100"\`。

**⚠️ 经典陷阱**：在计算机眼中，数字 \`100\` 和字符串 \`"100"\` 是两码事！如果你尝试做 \`"100" + 5\`，Python 会抛出类型错误 (\`TypeError\`)。

#### 🔄 类型转换工具：
- **\`int(x)\`**：把 \`x\` 转换成整数。例如 \`int("25")\` 会转换成数字 \`25\`；\`int(3.8)\` 会转换成 \`3\`（直接截断小数，不进行四舍五入）。
- **\`float(x)\`**：把 \`x\` 转换成浮点数。例如 \`float("5.2")\` 变成 \`5.2\`。
- **\`str(x)\`**：把 \`x\` 转换成字符串。例如 \`str(123)\` 变成 \`"123"\`。

#### 📝 示例：
\`\`\`python
a = "10"
b = "20"
c = int(a) + int(b)  # 转换后相加，结果是数字 30，而不是拼接字符串 "1020"
\`\`\``,
    task: "编辑器中预先定义了一个字符串变量 `price_str = \"99.9\"`。请执行以下步骤：\n1. 使用 `float()` 函数将 `price_str` 转换成浮点数，并存入变量 `price_float`。\n2. 使用 `int()` 函数将刚刚转换得到的 `price_float` 再转换为整数（此时小数部分会被丢弃），结果存入变量 `price_int`中。",
    hint: "price_float = float(price_str)\nprice_int = int(price_float)",
    defaultCode: "price_str = \"99.9\"\n# 1. 转换 price_str 为浮点数 price_float\n\n# 2. 转换 price_float 为整数 price_int\n",
    solution: "price_str = \"99.9\"\nprice_float = float(price_str)\nprice_int = int(price_float)",
    validate: async (code, stdout, globals, pyodide) => {
      if (!globals.has("price_float")) return { success: false, message: "未检测到变量 'price_float'。" };
      if (!globals.has("price_int")) return { success: false, message: "未检测到变量 'price_int'。" };

      const pf = globals.get("price_float");
      const pi = globals.get("price_int");

      if (pf !== 99.9) return { success: false, message: "price_float 的值应该为浮点数 99.9。" };
      if (pi !== 99) return { success: false, message: "price_int 的值应该为整数 99（使用 int() 转换浮点数时会自动舍去小数部分）。" };

      return { success: true, message: "非常好！类型转换是数据清洗和用户输入处理的核心步骤！" };
    }
  },
  {
    id: 5,
    level: 1,
    title: "5. 玩转字符串 (索引与切片)",
    description: `### ✂️ 官方文档：字符串切片 (Slicing)

在 Python 中，字符串不仅可以用来打印，还可以像列表一样进行拆分和截取。字符串中的每一个字符都有一个数字编号，称为**索引 (Index)**。

- **正向索引**：从左往右数，从 \`0\` 开始。例如在 \`s = "Python"\` 中，\`s[0]\` 是 \`"P"\`，\`s[1]\` 是 \`"y"\`。
- **反向索引**：从右往左数，从 \`-1\` 开始。例如 \`s[-1]\` 是最后一个字符 \`"n"\`，\`s[-2]\` 是倒数第二个 \`"o"\`。

#### ✂️ 切片语法：\`s[start:stop:step]\`
- 提取从索引 \`start\` 到 \`stop\`（**不包含 stop 本身，即左闭右开**）的子字符串。
- \`step\` 是步长（默认是 1）。
- 如果省略 \`start\`，默认从头开始；如果省略 \`stop\`，默认截取到尾。

#### 📝 示例：
\`\`\`python
word = "HelloWorld"
print(word[0:5])   # 输出: "Hello" (索引 0, 1, 2, 3, 4)
print(word[5:])    # 输出: "World" (从索引 5 一直到最后)
print(word[-5:])   # 输出: "World" (最后 5 个字符)
print(word[::2])   # 输出: "HloWrd" (步长为2，隔一个取一个)
\`\`\``,
    task: "编辑器中已定义了字符串 `message = \"Study Python now!\"`。请编写代码进行截取：\n1. 截取前 5 个字符（即 `\"Study\"`），存入变量 `sub_first`。\n2. 截取中间的 `\"Python\"` 部分（索引从 6 到 12 之前），存入变量 `sub_middle`。\n3. 利用反向索引，截取最后 4 个字符（不包含最后的惊叹号，即 `\"now\"`），存入变量 `sub_last`。",
    hint: "前5个字即 message[0:5] 或 message[:5]。\nPython在 message 中索引是 6 到 12。即 message[6:12]。\nnow在叹号之前，倒数第4个到倒数第1个之间：message[-4:-1]。",
    defaultCode: "message = \"Study Python now!\"\n# 1. 截取前5个字符 \"Study\"\nsub_first = \n\n# 2. 截取 \"Python\"\nsub_middle = \n\n# 3. 截取倒数第4个到倒数第1个之间的字符 \"now\"\nsub_last = \n",
    solution: "message = \"Study Python now!\"\nsub_first = message[:5]\nsub_middle = message[6:12]\nsub_last = message[-4:-1]",
    validate: async (code, stdout, globals, pyodide) => {
      if (!globals.has("sub_first")) return { success: false, message: "未检测到变量 'sub_first'。" };
      if (!globals.has("sub_middle")) return { success: false, message: "未检测到变量 'sub_middle'。" };
      if (!globals.has("sub_last")) return { success: false, message: "未检测到变量 'sub_last'。" };

      if (globals.get("sub_first") !== "Study") return { success: false, message: "sub_first 应当是 'Study'。" };
      if (globals.get("sub_middle") !== "Python") return { success: false, message: "sub_middle 应当是 'Python'。" };
      if (globals.get("sub_last") !== "now") return { success: false, message: "sub_last 应当是 'now'。注意不要包含感叹号哦！" };

      return { success: true, message: "切片技巧掌握得非常透彻！左闭右开是 Python 的核心规范之一！" };
    }
  },
  {
    id: 6,
    level: 2,
    title: "6. 命运抉择 (If-Else 条件分支)",
    description: `### 🛣️ 让程序学会思考与选择

在现实中，我们会根据条件做决定。在 Python 中，我们使用 \`if\`、\`elif\` (else if) 和 \`else\` 语句来实现逻辑分支。

#### 📘 核心语法规则：
1. **冒号 \`:\` 必不可少**：条件表达式的末尾必须加上冒号，告诉 Python 接下来是满足条件后要执行的区域。
2. **强制缩进 (Indentation)**：Python 不使用 \`{}\` 来区分代码块，而是使用缩进（一般是 **4 个空格**）。缩进的代码块表示它们“从属于”上面的条件语句。
3. **多分支判断**：如果有多重条件，可以使用 \`elif\`。
4. **比较运算符**：\`==\` (等于，注意是双等号！单等号是赋值), \`!=\` (不等于), \`>\` (大于), \`<\` (小于), \`>=\` (大于等于)。

#### 📝 示例：
\`\`\`python
age = 18
if age >= 18:
    print("你已经是成年人了")
else:
    print("你还是未成年人")
\`\`\``,
    task: "编辑器中提供了一个变量 `score`。请编写 `if-elif-else`结构，根据 `score` 的大小给变量 `grade` 赋不同的评级：\n1. 如果 `score >= 90`，设置 `grade = \"优秀\"`。\n2. 否则，如果 `score >= 60` 且小于 90，设置 `grade = \"及格\"`。\n3. 否则（小于 60），设置 `grade = \"不及格\"`。",
    hint: "注意缩进和逻辑。语法结构如下：\nif score >= 90:\n    grade = \"优秀\"\nelif score >= 60:\n    grade = \"及格\"\nelse:\n    grade = \"不及格\"",
    defaultCode: "score = 75\n# 根据 score 的值，编写条件分支为变量 grade 赋值\n",
    solution: "score = 75\nif score >= 90:\n    grade = \"优秀\"\nelif score >= 60:\n    grade = \"及格\"\nelse:\n    grade = \"不及格\"",
    validate: async (code, stdout, globals, pyodide) => {
      if (!globals.has("grade")) return { success: false, message: "未检测到变量 'grade'，请确保你在判断语句里正确地给它赋值了。" };

      const gradeVal = globals.get("grade");
      if (gradeVal !== "及格") return { success: false, message: "当 score = 75 时，grade 的值应当是 '及格'。" };

      // 动态测试不同分支。去掉默认 score 赋值，确保测试能覆盖不同输入。
      const branchCode = code
        .split('\n')
        .filter(line => !/^\s*score\s*=/.test(line))
        .join('\n');

      try {
        let pyNamespace = pyodide.toPy({ score: 95 });
        await pyodide.runPythonAsync(`score = 95\n` + branchCode, { globals: pyNamespace });
        let g1 = pyNamespace.get("grade");
        pyNamespace.destroy();

        pyNamespace = pyodide.toPy({ score: 40 });
        await pyodide.runPythonAsync(`score = 40\n` + branchCode, { globals: pyNamespace });
        let g2 = pyNamespace.get("grade");
        pyNamespace.destroy();

        if (g1 !== "优秀") return { success: false, message: "当 score = 95 时，没有正确判断为 '优秀'。" };
        if (g2 !== "不及格") return { success: false, message: "当 score = 40 时，没有正确判断为 '不及格'。" };
      } catch (err) {
        return { success: false, message: "测试分支逻辑时发生运行错误：" + err.message };
      }

      return { success: true, message: "条件分支逻辑编写得完全正确！你成功帮助程序做出了命运的抉择！" };
    }
  },
  {
    id: 7,
    level: 2,
    title: "7. 循环往复 (While 循环)",
    description: `### 🔄 让计算机不知疲倦地重复

如果我们需要不断地执行某段代码，直到满足某个条件为止，就要用到循环。\`while\` 循环的意思是：“**只要条件为真，就一直重复执行缩进内的代码**”。

#### 📘 循环三要素：
1. **初始状态**：定义循环条件的初始变量（如计数器）。
2. **循环条件**：决定循环是否继续执行。
3. **状态更新**：在循环体内必须更新计数器，使得条件在未来的某个时刻变为**假 (False)**。**如果你忘记更新计数器，循环就会永远执行下去，这叫“死循环”，会导致浏览器卡死！**

#### 📝 示例：
\`\`\`python
count = 1
while count <= 5:
    print(count)
    count = count + 1  # 每次自增 1，直到 count 变为 6，循环结束
\`\`\``,
    task: "使用 `while` 循环计算从 `1` 累加到 `100`（包含 100）的累加和，并将最终的和存储在变量 `sum_val` 中。初始变量已经在右侧声明好。",
    hint: "循环条件是 num <= 100。在循环体里，将 num 累加到 sum_val 中，再将 num 加 1：\nwhile num <= 100:\n    sum_val = sum_val + num\n    num = num + 1",
    defaultCode: "sum_val = 0\nnum = 1\n# 在下方使用 while 循环计算 1 到 100 的累加和\n",
    solution: "sum_val = 0\nnum = 1\nwhile num <= 100:\n    sum_val = sum_val + num\n    num = num + 1",
    validate: async (code, stdout, globals, pyodide) => {
      if (!code.includes("while")) return { success: false, message: "本关要求必须使用 'while' 关键字实现循环！" };
      if (!globals.has("sum_val")) return { success: false, message: "未检测到变量 'sum_val'。" };

      const sum_val = globals.get("sum_val");
      if (sum_val !== 5050) return { success: false, message: `1 到 100 的累加和应该是 5050，而你的结果是 ${sum_val}。` };

      return { success: true, message: "太牛了！你成功利用 while 循环在极短时间内计算出了 1-100 的高斯求和！" };
    }
  },
  {
    id: 8,
    level: 2,
    title: "8. 步履不停 (For 循环与 range)",
    description: `### 🚶 遍历序列：For 循环

在 Python 中，\`for\` 循环是最常用的循环形式。它专门用于**遍历**（逐个访问）一个序列，例如一个列表，或者一个特定范围的数字。

#### 📘 range() 范围函数：
为了生成一系列连续的数字，我们常配合 \`range()\` 函数使用：
- \`range(5)\`：生成 \`0, 1, 2, 3, 4\`（共 5 个数，默认从 0 开始，不包含 5）。
- \`range(1, 6)\`：生成 \`1, 2, 3, 4, 5\`（左闭右开，从 1 开始，不包含 6）。
- \`range(1, 10, 2)\`：生成 \`1, 3, 5, 7, 9\`（第三个参数是步长，表示每次加 2）。

#### 📝 示例：
\`\`\`python
# 打印 1, 2, 3
for i in range(1, 4):
    print(i)
\`\`\``,
    task: "请使用 `for` 循环与 `range()` 函数，计算 1 到 50 之间（包含 50）**所有偶数**的和，并将结果存入变量 `even_sum` 中。",
    hint: "偶数可以从 2 开始，步长设为 2，到 51 结束。例如 range(2, 52, 2)。\neven_sum = 0\nfor i in range(2, 52, 2):\n    even_sum = even_sum + i",
    defaultCode: "even_sum = 0\n# 使用 for 循环和 range 计算 1 到 50 的偶数和\n",
    solution: "even_sum = 0\nfor i in range(2, 52, 2):\n    even_sum = even_sum + i",
    validate: async (code, stdout, globals, pyodide) => {
      if (!code.includes("for ")) return { success: false, message: "本关要求必须使用 'for' 关键字！" };
      if (!globals.has("even_sum")) return { success: false, message: "未检测到变量 'even_sum'。" };

      const even_sum = globals.get("even_sum");
      if (even_sum !== 650) return { success: false, message: `1 到 50 的偶数和应该是 650，你的结果是 ${even_sum}。` };

      return { success: true, message: "通关！你成功掌握了 for 循环与带步长的 range 函数的配合！" };
    }
  },
  {
    id: 9,
    level: 2,
    title: "9. 循环的中断与继续 (Break & Continue)",
    description: `### 🛑 控制循环节奏：Break 和 Continue

在循环执行过程中，我们有时需要中途打断循环。Python 提供了两个核心关键字来精确控制循环流程：

1. **\`break\`**：立即**终止整个循环**，程序会跳出循环体，继续执行循环外面的代码。
2. **\`continue\`**：跳过**当前这一轮循环**剩下未执行的代码，直接跳入下一轮循环的条件判定。

#### 📝 示例：
\`\`\`python
# 打印 1, 2, 3，遇到 4 时 break 结束
for i in range(1, 6):
    if i == 4:
        break
    print(i) # 打印出 1, 2, 3

# 打印 1, 2, 4, 5，遇到 3 时跳过
for i in range(1, 6):
    if i == 3:
        continue
    print(i) # 打印出 1, 2, 4, 5 (跳过了 3)
\`\`\``,
    task: "编辑器中提供了一个数字列表 `nums = [3, 0, 7, -1, 10, -5, 8]`。请编写 `for` 循环遍历这个列表，计算列表中所有**正数**的和，存入变量 `positive_sum` 中。\n**特别规则**：遇到 `0` 时使用 `continue` 跳过本轮；一旦遇到**负数**，则使用 `break` 立即终止循环（不再计算负数及后面的所有数字）。",
    hint: "先判断数字是否等于 0，是则 continue 跳过；再判断数字是否小于 0，是则 break 终止；否则加到 positive_sum 里。例如：\nfor n in nums:\n    if n == 0:\n        continue\n    if n < 0:\n        break\n    positive_sum += n",
    defaultCode: "nums = [3, 0, 7, -1, 10, -5, 8]\npositive_sum = 0\n# 使用 for 循环遍历 nums，遇到 0 时 continue，遇到负数时 break，否则累加到 positive_sum\n",
    solution: "nums = [3, 0, 7, -1, 10, -5, 8]\npositive_sum = 0\nfor n in nums:\n    if n == 0:\n        continue\n    if n < 0:\n        break\n    positive_sum = positive_sum + n",
    validate: async (code, stdout, globals, pyodide) => {
      if (!code.includes("break")) return { success: false, message: "你需要使用 'break' 关键字在遇到负数时退出循环。" };
      if (!code.includes("continue")) return { success: false, message: "你需要使用 'continue' 关键字在遇到 0 时跳过本轮循环。" };
      if (!globals.has("positive_sum")) return { success: false, message: "未检测到变量 'positive_sum'。" };

      const psum = globals.get("positive_sum");
      if (psum !== 10) {
        return { success: false, message: `结果应该是 10 (3 + 7)，因为遇到 -1 时循环就应当结束了。你的结果是 ${psum}。` };
      }
      return { success: true, message: "完美！你巧妙利用 continue 跳过无效数据，又用 break 控制了循环边界。" };
    }
  },
  {
    id: 10,
    level: 3,
    title: "10. 宝藏清单 (Lists 列表入门)",
    description: `### 🗃️ 容器一号：列表 (List)

如果说变量是一个个独立的储物盒，那么**列表**就是整齐排列的置物柜。它可以按顺序存储多个元素。

在 Python 中，列表用方括号 \`[]\` 包裹，元素间用英文逗号 \`,\` 分隔。

#### 📘 常用列表方法：
1. **\`list.append(x)\`**：将元素 \`x\` 添加到列表的**末尾**。
2. **\`list.insert(idx, x)\`**：在指定的索引 \`idx\` 处插入元素 \`x\`。
3. **\`len(list)\`**：获取列表的长度（元素个数）。

#### ⚠️ 避坑指南：引用与拷贝 (Shallow Copy)
这是小白做项目最常遇到的 Bug：如果你直接写 \`b = a\`，这**并不是复制**！它只是让 \`b\` 拥有了指向 \`a\` 这个列表的同一个钥匙。修改 \`b\` 的内容，\`a\` 的内容也会跟着改变！
如果你需要真正的副本，请使用 \`b = a.copy()\`（浅拷贝方法）。

#### 📝 示例：
\`\`\`python
a = [1, 2]
b = a          # 只是起了一个别名，同用一把钥匙
c = a.copy()   # 获得了独立的一份复制数据

b.append(3)    # 此时 a 也会变成 [1, 2, 3]!
c.append(4)    # 此时 a 仍然是 [1, 2, 3]，不受影响
\`\`\``,
    task: "编辑器里已有一个列表 `tools = [\"Git\", \"Vim\"]`。请依次完成以下操作：\n1. 使用 `.append()` 方法将字符串 `\"Python\"` 添加到列表的末尾。\n2. 使用 `.insert()` 方法将字符串 `\"VSCode\"` 插入到列表的索引 `1` 处。\n3. 使用 `len()` 函数计算操作后列表的元素个数，并存入变量 `tools_count` 中。",
    hint: "执行如下操作：\ntools.append(\"Python\")\ntools.insert(1, \"VSCode\")\ntools_count = len(tools)",
    defaultCode: "tools = [\"Git\", \"Vim\"]\n# 1. 末尾追加 \"Python\"\n\n# 2. 索引 1 处插入 \"VSCode\"\n\n# 3. 计算长度存入 tools_count\ntools_count = 0\n",
    solution: "tools = [\"Git\", \"Vim\"]\ntools.append(\"Python\")\ntools.insert(1, \"VSCode\")\ntools_count = len(tools)",
    validate: async (code, stdout, globals, pyodide) => {
      if (!globals.has("tools")) return { success: false, message: "未检测到列表变量 'tools'。" };
      if (!globals.has("tools_count")) return { success: false, message: "未检测到变量 'tools_count'。" };

      const tools = globals.get("tools").toJs();
      const count = globals.get("tools_count");

      if (tools.length !== 4) return { success: false, message: "修改后的 tools 列表长度应该为 4。" };
      if (tools[1] !== "VSCode") return { success: false, message: "索引 1 处的元素应该是 'VSCode'。" };
      if (tools[3] !== "Python") return { success: false, message: "末尾元素应该是 'Python'。" };
      if (count !== 4) return { success: false, message: "tools_count 变量的值不正确，应该是 4。" };

      return { success: true, message: "列表基本操作通过！列表是你编程时最常打交道的数据容器之一。" };
    }
  },
  {
    id: 11,
    level: 3,
    title: "11. 列表推导式 (List Comprehensions)",
    description: `### 🚀 Pythonic 语法：列表推导式

**列表推导式**是 Python 官方教程强烈推荐的一种极具特色的简写语法。它能让你用一行代码，优雅地过滤并生成一个新的列表。

#### 📘 语法结构对比：
假如我们要把一个列表中的每个数字平方并生成新列表：

**普通写法**：
\`\`\`python
squares = []
for x in range(1, 6):
    squares.append(x ** 2)
\`\`\`

**列表推导式写法**：
\`\`\`python
squares = [x ** 2 for x in range(1, 6)]
\`\`\`

#### 🔍 还可以加上条件过滤 (\`if\` 条件)：
\`\`\`python
# 只提取 1-10 之间的偶数平方
even_squares = [x ** 2 for x in range(1, 11) if x % 2 == 0]
\`\`\``,
    task: "编辑器中提供了一个源列表 `numbers = [1, 4, 9, 16, 25, 36, 49, 64]`。请编写一行代码，使用**列表推导式**过滤出 `numbers` 中所有**能被 3 整除**的数字，并存入新变量 `div_by_three` 中。",
    hint: "语法为 [x for x in numbers if x % 3 == 0]。请确保使用的是列表推导式（一行搞定，不写多行 for 循环）。",
    defaultCode: "numbers = [1, 4, 9, 16, 25, 36, 49, 64]\n# 一行代码：使用列表推导式过滤出能被 3 整除的数并赋值给 div_by_three\n",
    solution: "numbers = [1, 4, 9, 16, 25, 36, 49, 64]\ndiv_by_three = [x for x in numbers if x % 3 == 0]",
    validate: async (code, stdout, globals, pyodide) => {
      if (!globals.has("div_by_three")) return { success: false, message: "未检测到变量 'div_by_three'。" };
      
      const arr = globals.get("div_by_three").toJs();
      if (arr.length !== 2 || arr[0] !== 9 || arr[1] !== 36) {
        return { success: false, message: "div_by_three 过滤结果不正确，应该包含 [9, 36]。" };
      }
      
      if (code.includes("append") || (code.split('\n').filter(l => l.trim().startsWith('for')).length > 0 && !code.includes('['))) {
        return { success: false, message: "请使用列表推导式单行写法，不要使用传统的 for 循环和 append 叠加。" };
      }

      return { success: true, message: "漂亮！列表推导式让你的 Python 代码显得非常简洁而专业 (Pythonic)！" };
    }
  },
  {
    id: 12,
    level: 3,
    title: "12. 映射字典 (Dicts 字典入门)",
    description: `### 📖 容器二号：键值对映射 - 字典 (Dictionary)

如果列表是排好队的信箱，那么**字典**就是一本地址簿。你可以通过“人名（键 Key）”直接精准定位“电话（值 Value）”，效率极高。

字典在 Python 中用花括号 \`{}\` 包裹，包含一系列 \`key: value\` 的映射关系。

#### 📘 核心规则：
- **键 (Key)**：必须是不可变类型（通常是字符串或数字），且**不能重复**。
- **值 (Value)**：可以是任何类型（数字、字符串、列表甚至另一个字典）。
- **增改查**：使用中括号 \`dict[key]\` 进行访问。如果键已存在则是修改，如果不存在则是新增。
- **防坑拷贝**：字典和列表一样是引用类型！复制时也建议使用 \`b = a.copy()\` 以免原字典被意外破坏。

#### 📝 示例：
\`\`\`python
user = {"name": "Alice", "age": 20}
print(user["name"])    # 输出: "Alice"
user["age"] = 21       # 修改 age 的值为 21
user["email"] = "a@x.com" # 新增键值对
\`\`\``,
    task: "请在右侧编写代码：\n1. 创建一个名为 `hero` 的字典，包含两个初始键值对：`\"name\"` 对应 `\"亚瑟\"`，`\"role\"` 对应 `\"战士\"`。\n2. 将 `hero` 的 `\"role\"` 修改为 `\"坦克\"`。\n3. 为 `hero` 新增一个键值对：`\"hp\"` 对应数字 `4500`。",
    hint: "hero = {\"name\": \"亚瑟\", \"role\": \"战士\"}\nhero[\"role\"] = \"坦克\"\nhero[\"hp\"] = 4500",
    defaultCode: "# 编写代码声明并修改 hero 字典\n",
    solution: "hero = {\"name\": \"亚瑟\", \"role\": \"战士\"}\nhero[\"role\"] = \"坦克\"\nhero[\"hp\"] = 4500",
    validate: async (code, stdout, globals, pyodide) => {
      if (!globals.has("hero")) return { success: false, message: "未检测到字典变量 'hero'。" };
      
      const hero = globals.get("hero");
      if (typeof hero.get !== 'function') return { success: false, message: "hero 必须是字典类型。" };

      if (hero.get("name") !== "亚瑟") return { success: false, message: "键 'name' 的值应该是 '亚瑟'。" };
      if (hero.get("role") !== "坦克") return { success: false, message: "键 'role' 应该被成功更新为 '坦克'。" };
      if (hero.get("hp") !== 4500) return { success: false, message: "键 'hp' 应该是整数 4500。" };

      return { success: true, message: "字典基础操作通关！你已经能够妥善管理结构化信息了！" };
    }
  },
  {
    id: 13,
    level: 3,
    title: "13. 字典的方法与安全读取",
    description: `### 🛡️ 安全地使用字典

在字典中，如果你直接使用 \`dict[key]\` 访问一个**不存在的键**，程序会引发严重的错误：\`KeyError\` 并强行崩溃退出。

为了让程序更加稳健，官方推荐使用以下高级方法：

1. **\`dict.get(key, default)\`**：安全地获取键的值。如果键不存在，它**不会报错**，而是返回我们设定的 \`default\` 默认值。如果不设定默认值，会返回 \`None\`。
2. **\`dict.items()\`**：同时获取字典的所有键和值，常用于 for 循环遍历。
3. **\`dict.keys()\`**：获取所有的键。
4. **\`dict.values()\`**：获取所有的值。

#### 📝 示例：
\`\`\`python
scores = {"Math": 90, "English": 85}
# 安全读取
physics = scores.get("Physics", 0) # 物理不在字典里，返回默认值 0，程序不崩溃

# 遍历键值对
for key, value in scores.items():
    print(key, value)
\`\`\``,
    task: "编辑器中提供了一个字典 `inventory = {\"apple\": 10, \"banana\": 5}`。请实现以下操作：\n1. 使用 `.get()` 方法尝试读取键 `\"orange\"` 的数量。因为不存在该键，请指定默认返回值为 `0`。将结果存入变量 `orange_count` 中。\n2. 使用 `.get()` 方法读取键 `\"apple\"` 的数量，将结果存入变量 `apple_count` 中。",
    hint: "使用 inventory.get(\"orange\", 0) 和 inventory.get(\"apple\")。",
    defaultCode: "inventory = {\"apple\": 10, \"banana\": 5}\n# 1. 安全读取 \"orange\" 数量，默认值为 0\norange_count = \n\n# 2. 读取 \"apple\" 数量\napple_count = \n",
    solution: "inventory = {\"apple\": 10, \"banana\": 5}\norange_count = inventory.get(\"orange\", 0)\napple_count = inventory.get(\"apple\")",
    validate: async (code, stdout, globals, pyodide) => {
      if (!globals.has("orange_count")) return { success: false, message: "未定义变量 'orange_count'。" };
      if (!globals.has("apple_count")) return { success: false, message: "未定义变量 'apple_count'。" };

      if (globals.get("orange_count") !== 0) return { success: false, message: "orange_count 应当等于 0（因为字典里没有 orange 且设置了默认值为 0）。" };
      if (globals.get("apple_count") !== 10) return { success: false, message: "apple_count 应当等于 10。" };
      if (!code.includes(".get(")) return { success: false, message: "本关要求必须使用 '.get()' 方法来进行安全读取！" };

      return { success: true, message: "字典的高级方法应用成功！.get() 方法是日常开发中的守护神，能有效避免 KeyError。" };
    }
  },
  {
    id: 14,
    level: 3,
    title: "14. 元组与集合 (Tuples & Sets)",
    description: `### 🔒 只读的元组与不重复的集合

Python 官方教程中除了列表和字典外，还有两个极其重要的数据容器：

1. **元组 (Tuple)**：用圆括号 \`()\` 包裹。
   - **核心特性**：**不可变 (Immutable)**。一旦创建，无法修改、添加、删除任何元素。
   - **适用场景**：经纬度坐标、数据库记录等安全只读的数据。
   - 例如：\`point = (12, 45)\`。

2. **集合 (Set)**：用花括号 \`{}\` 包裹（但不含冒号，只是单个元素）。
   - **核心特性**：**元素无序且绝对不重复**。
   - **超级技巧**：利用 \`set()\` 转换可以快速给列表**去重**。
   - 例如：\`set([1, 1, 2, 3])\` 会自动剔除重复的 1，变成 \`{1, 2, 3}\`。

#### 📝 示例：
\`\`\`python
data = [1, 2, 2, 3, 3, 3]
unique_data = set(data)  # 得到 {1, 2, 3}
max_val = max(data)      # 常用内置函数：求最大值
\`\`\``,
    task: "编辑器中预先给出了一个包含重复成绩的列表 `scores = [85, 92, 85, 90, 78, 92]`。请完成：\n1. 将 `scores` 转换为集合并存入新变量 `unique_scores` 以实现去重。\n2. 使用内置函数 `min()` 找出这组分数中的最低分，存入变量 `min_score` 中。",
    hint: "使用 unique_scores = set(scores) 和 min_score = min(scores) 。",
    defaultCode: "scores = [85, 92, 85, 90, 78, 92]\n# 1. 转换为集合\nunique_scores = \n# 2. 找出最低分\nmin_score = \n",
    solution: "scores = [85, 92, 85, 90, 78, 92]\nunique_scores = set(scores)\nmin_score = min(scores)",
    validate: async (code, stdout, globals, pyodide) => {
      if (!globals.has("unique_scores")) return { success: false, message: "未检测到变量 'unique_scores'。" };
      if (!globals.has("min_score")) return { success: false, message: "未检测到变量 'min_score'。" };

      const min_score = globals.get("min_score");
      if (min_score !== 78) return { success: false, message: "最低分 min_score 应该是 78。" };

      const us = globals.get("unique_scores");
      if (typeof us.has !== 'function' || us.size !== 4) {
        return { success: false, message: "unique_scores 应该是一个包含 4 个不重复分数的集合。" };
      }
      return { success: true, message: "通关！元组和集合能有效帮助我们规范和筛选数据！" };
    }
  },
  {
    id: 15,
    level: 3,
    title: "15. 优雅的遍历 (Enumerate & Zip)",
    description: `### 🚶 官方推荐：高级循环遍历技术

遍历数据时，普通 for 循环能拿取元素。但有些场景下，我们有更高级的需求：

1. **\`enumerate(sequence)\`**：在遍历列表时，如果**同时需要知道当前元素的索引**（位置），用它最合适。它会同时抛出 \`(index, value)\`。
2. **\`zip(seq1, seq2, ...)\`**：如果你有**两个或多个列表，想同时平行遍历它们**，用它最方便。它会把对应位置的元素打包成一对抛出。

#### 📝 示例：
\`\`\`python
# 使用 enumerate
fruits = ["apple", "banana"]
for index, fruit in enumerate(fruits):
    print(f"索引: {index}, 水果: {fruit}")

# 使用 zip
names = ["张三", "李四"]
ages = [18, 20]
for name, age in zip(names, ages):
    print(f"{name} 的年龄是 {age}")
\`\`\``,
    task: "编辑器里提供了两个对应的列表：`keys = [\"A\", \"B\", \"C\"]` 和 `values = [1, 2, 3]`。请编写代码：\n1. 创建一个空列表 `indexed_keys = []`，使用 `enumerate(keys)` 遍历 `keys`，把每个 `(索引, 键)` 元组追加进去，得到 `[(0, \"A\"), (1, \"B\"), (2, \"C\")]`。\n2. 创建一个空字典 `result_dict = {}`，使用 `for` 循环和 `zip(keys, values)` 平行遍历这两个列表，将键值对写入 `result_dict` 中。",
    hint: "先用 enumerate 记录索引，再用 zip 组合键值：\nindexed_keys = []\nfor index, key in enumerate(keys):\n    indexed_keys.append((index, key))\n\nresult_dict = {}\nfor k, v in zip(keys, values):\n    result_dict[k] = v",
    defaultCode: "keys = [\"A\", \"B\", \"C\"]\nvalues = [1, 2, 3]\nindexed_keys = []\nresult_dict = {}\n# 1. 使用 enumerate 将索引和 key 存入 indexed_keys\n\n# 2. 使用 zip 和 for 循环将键值对填充进 result_dict\n",
    solution: "keys = [\"A\", \"B\", \"C\"]\nvalues = [1, 2, 3]\nindexed_keys = []\nfor index, key in enumerate(keys):\n    indexed_keys.append((index, key))\n\nresult_dict = {}\nfor k, v in zip(keys, values):\n    result_dict[k] = v",
    validate: async (code, stdout, globals, pyodide) => {
      if (!globals.has("result_dict")) return { success: false, message: "未检测到字典 'result_dict'。" };
      if (!globals.has("indexed_keys")) return { success: false, message: "未检测到列表 'indexed_keys'。" };
      if (!code.includes("enumerate")) return { success: false, message: "请使用 'enumerate' 函数同时获得索引和值。" };
      if (!code.includes("zip")) return { success: false, message: "请使用 'zip' 函数进行多列表遍历！" };

      const res = globals.get("result_dict");
      if (res.get("A") !== 1 || res.get("B") !== 2 || res.get("C") !== 3) {
        return { success: false, message: "result_dict 内容不正确，应该是 {'A': 1, 'B': 2, 'C': 3}。" };
      }

      try {
        await pyodide.runPythonAsync(`
assert indexed_keys == [(0, "A"), (1, "B"), (2, "C")], "indexed_keys 应当保存 enumerate 得到的索引和值"
        `);
      } catch (err) {
        return { success: false, message: "enumerate 遍历结果不正确：" + err.message };
      }
      return { success: true, message: "完美！enumerate 负责索引，zip 负责配对，你已经掌握了两种优雅遍历方式。" };
    }
  },
  {
    id: 16,
    level: 4,
    title: "16. 魔法咒语 (Functions 函数定义)",
    description: `### 🧙‍♂️ 封装逻辑：定义函数

当程序规模变大，复制粘贴相同的代码会导致灾难。**函数**就是把一段逻辑打包并起一个名字，以后随时可以通过名字反复调用它。

#### 📘 核心语法：
- 使用关键字 **\`def\`** 声明函数。
- 括号内声明**形参（Parameter）**，相当于输入的接口。
- 函数体必须缩进。
- 使用 **\`return\`** 关键字把计算好的结果抛出来。**注意：一旦执行到 \`return\`，函数就会立刻终止！**

#### 📝 示例：
\`\`\`python
def add(x, y):
    total = x + y
    return total  # 返回和

result = add(5, 7) # 调用并传入实参 5 和 7
print(result) # 输出: 12
\`\`\``,
    task: "请编写一个名为 `calculate_bmi(weight, height)` 的函数，该函数接收体重（公斤）和身高（米）两个参数：\n1. 计算 BMI 指数（公式为 `weight / (height ** 2)`）。\n2. **安全防范**：如果 `height` 小于或等于 `0`，为了避免除以零错误，直接返回 `0`。\n3. 返回计算出的 BMI 浮点数。",
    hint: "在函数体内先判断 height <= 0，若是则 return 0。否则 return weight / (height ** 2)。\ndef calculate_bmi(weight, height):\n    if height <= 0:\n        return 0\n    return weight / (height ** 2)",
    defaultCode: "# 在下方定义你的 calculate_bmi 函数\n",
    solution: "def calculate_bmi(weight, height):\n    if height <= 0:\n        return 0\n    return weight / (height ** 2)",
    validate: async (code, stdout, globals, pyodide) => {
      if (!globals.has("calculate_bmi")) return { success: false, message: "未定义函数 'calculate_bmi'。" };

      try {
        await pyodide.runPythonAsync(`
assert calculate_bmi(70, 0) == 0, "身高为 0 时应当返回 0 以防崩溃"
assert abs(calculate_bmi(70, 1.75) - 22.857) < 0.01, "70kg 和 1.75m 计算出来的 BMI 应该大约是 22.86"
        `);
      } catch (err) {
        return { success: false, message: "函数逻辑运行测试失败：" + err.message };
      }
      return { success: true, message: "恭喜通关！你成功定义了防错且复用性强的函数！" };
    }
  },
  {
    id: 17,
    level: 4,
    title: "17. 边界深渊 (Scope 作用域与默认参数)",
    description: `### 🌐 变量的领地：作用域

并非所有变量都能在任何位置被访问到，这被称为**作用域 (Scope)**：
- **全局变量**：定义在所有函数外的变量，在整段代码中均能被读取。
- **局部变量**：在函数内部创建的变量，只在函数内部可见，外部无法访问。
- **global 关键字**：如果局部需要**修改**全局变量的值，必须在函数首行写 \`global 变量名\`，否则 Python 会把其当做同名的新局部变量。

#### 📘 默认参数：
在定义函数时，我们可以给某些参数设定默认值。如果在调用时没有传这个参数，就会使用默认值。

#### 📝 示例：
\`\`\`python
total_count = 0

def add_one():
    global total_count # 声明我们要对全局变量做修改
    total_count += 1

def welcome(name, title="同学"): # title 默认值为 "同学"
    return f"欢迎，{name}{title}!"
\`\`\``,
    task: "请在右侧编写代码：\n1. 定义一个全局变量 `visitor_count = 0`。\n2. 定义一个函数 `record_visit(name, vip_status=False)`。函数接收姓名 `name` 和可选参数 `vip_status`（默认值为 `False`）。\n3. 函数体内：需要修改全局变量 `visitor_count`（将其值加 1），并返回欢迎字符串。如果是 VIP，返回 `\"Welcome VIP {name}!\"`；否则返回 `\"Welcome {name}!\"`。",
    hint: "record_visit 里使用 global visitor_count。根据 vip_status 判定返回不同的问候语。例如：\nvisitor_count = 0\ndef record_visit(name, vip_status=False):\n    global visitor_count\n    visitor_count += 1\n    if vip_status:\n        return f\"Welcome VIP {name}!\"\n    return f\"Welcome {name}!\"",
    defaultCode: "# 声明全局变量，并编写 record_visit 函数\n",
    solution: "visitor_count = 0\ndef record_visit(name, vip_status=False):\n    global visitor_count\n    visitor_count += 1\n    if vip_status:\n        return f\"Welcome VIP {name}!\"\n    return f\"Welcome {name}!\"",
    validate: async (code, stdout, globals, pyodide) => {
      if (!globals.has("visitor_count")) return { success: false, message: "未定义全局变量 'visitor_count'。" };
      if (!globals.has("record_visit")) return { success: false, message: "未定义函数 'record_visit'。" };

      try {
        await pyodide.runPythonAsync(`
visitor_count = 0
msg1 = record_visit("张三")
assert visitor_count == 1, "调用一次 record_visit 后，visitor_count 应该增加为 1"
assert msg1 == "Welcome 张三!", "普通用户欢迎词不正确"

msg2 = record_visit("李四", True)
assert visitor_count == 2, "第二次调用后，visitor_count 应该增加为 2"
assert msg2 == "Welcome VIP 李四!", "VIP 用户的欢迎词不正确"
        `);
      } catch (err) {
        return { success: false, message: "作用域或默认参数测试未通过：" + err.message };
      }
      return { success: true, message: "出色！你完美处理了全局变量修改与可选默认参数的逻辑！" };
    }
  },
  {
    id: 18,
    level: 4,
    title: "18. 外援力量 (Modules 模块导入)",
    description: `### 📦 站在巨人的肩膀上：内置模块

Python 之所以强大，在于它拥有极为庞大的“功能仓库”——**标准库**和第三方库。库（或叫**模块**）就是前人写好的代码集合，我们能直接拿来用。

使用 **\`import\`** 关键字导入模块。

#### 📘 常用标准库模块：
- **\`math\`**：提供圆周率 \`math.pi\`，开平方 \`math.sqrt()\`，对数等高级数学计算。
- **\`random\`**：提供生成随机整数 \`random.randint(a, b)\`（包含边界 \`a\` 和 \`b\`）等随机数操作。

#### 📝 示例：
\`\`\`python
import math
print(math.pi) # 打印圆周率

import random
num = random.randint(1, 10) # 得到 1 到 10 之间的随机数
\`\`\``,
    task: "请导入 `math` 模块，并编写代码完成计算，将结果赋值给相应的变量：\n1. 使用 `math.radians()` 将角度 `180` 转换为弧度，并将结果存入变量 `rad_val`（结果应大约为 3.14159）。\n2. 使用 `math.factorial()` 计算整数 `5` 的阶乘（即 1*2*3*4*5），并将结果存入变量 `fact_val`（结果为 120）。",
    hint: "代码结构：\nimport math\nrad_val = math.radians(180)\nfact_val = math.factorial(5)",
    defaultCode: "# 导入 math 模块并计算弧度和阶乘\n",
    solution: "import math\nrad_val = math.radians(180)\nfact_val = math.factorial(5)",
    validate: async (code, stdout, globals, pyodide) => {
      if (!code.includes("import math")) return { success: false, message: "你需要使用 'import math' 导入数学模块！" };
      if (!globals.has("rad_val")) return { success: false, message: "未定义变量 'rad_val'。" };
      if (!globals.has("fact_val")) return { success: false, message: "未定义变量 'fact_val'。" };

      const rad = globals.get("rad_val");
      const fact = globals.get("fact_val");

      if (Math.abs(rad - 3.1415926) > 0.0001) return { success: false, message: "rad_val 计算错误，应该大约等于 3.14159。" };
      if (fact !== 120) return { success: false, message: "fact_val 阶乘计算错误，5 的阶乘应该是 120。" };

      return { success: true, message: "模块导入和运算成功！这是引入外部强力模块的标准姿势！" };
    }
  },
  {
    id: 19,
    level: 4,
    title: "19. 文本大变身 (字符串高级方法)",
    description: `### 🔠 项目实战利器：字符串清洗方法

在实际的项目开发（如数据抓取、表单输入清洗）中，用户输入的文字往往有很多空格，或者需要分割和替换。Python 提供了丰富的内置字符串处理方法：

1. **\`s.strip()\`**：移除字符串**开头和结尾**的空格或换行符（不改变中间的空格）。
2. **\`s.split(sep)\`**：根据分隔符 \`sep\`，将字符串**拆分**为一个列表。
3. **\`sep.join(list)\`**：是 \`split\` 的逆向操作。使用连接符 \`sep\`，将列表中的多个字符串**拼接**成一个字符串。
4. **\`s.replace(old, new)\`**：将字符串中所有的 \`old\` 文本**替换**为 \`new\` 文本。

#### 📝 示例：
\`\`\`python
info = "  Apple, Banana, Orange  "
clean_info = info.strip()           # 结果: "Apple, Banana, Orange"
fruits = clean_info.split(", ")     # 结果: ["Apple", "Banana", "Orange"]
connected = "-".join(fruits)        # 结果: "Apple-Banana-Orange"
connected = connected.replace("a", "x") # 结果: "Apple-Bxnxnx-Orxnge" (区分大小写)
\`\`\``,
    task: "编辑器预先提供了一个原始字符串 `raw_data = \"  apple,banana,orange  \"`。\n请按顺序执行以下数据清洗步骤，并将最终字符串存入变量 `cleaned_data` 中：\n1. 去除 `raw_data` 两端的空格。\n2. 根据逗号 `,` 将其拆分为列表。\n3. 使用横杠 `-` 作为连接符，将该列表中的字符串重新拼接，存入 `cleaned_data` 变量中（即最终结果为 `\"apple-banana-orange\"`）。",
    hint: "可以分步写：\nstripped = raw_data.strip()\nwords = stripped.split(',')\ncleaned_data = '-'.join(words)",
    defaultCode: "raw_data = \"  apple,banana,orange  \"\n# 请按要求编写清洗逻辑，将最终拼接后的字符串存入 cleaned_data 变量中\n",
    solution: "raw_data = \"  apple,banana,orange  \"\nstripped = raw_data.strip()\nwords = stripped.split(\",\")\ncleaned_data = \"-\".join(words)",
    validate: async (code, stdout, globals, pyodide) => {
      if (!globals.has("cleaned_data")) return { success: false, message: "未检测到变量 'cleaned_data'。" };
      
      const cleaned = globals.get("cleaned_data");
      if (cleaned !== "apple-banana-orange") {
        return { success: false, message: `结果应该是 'apple-banana-orange'，但你的计算结果是 '${cleaned}'。` };
      }
      return { success: true, message: "通关！熟练运用 strip、split 和 join 是进行文本处理和数据清洗的基础。" };
    }
  },
  {
    id: 20,
    level: 4,
    title: "20. 高级排序与匿名函数 (Lambda 表达式)",
    description: `### ⚡ 高阶数据整理：Lambda 与列表排序

在开发项目中，我们经常需要对结构复杂的数据（例如包含很多字典的列表）进行排序。Python 提供了极具威力的 **\`lambda\` 匿名函数**来解决这个问题。

#### 📘 什么是 Lambda 表达式？
\`lambda\` 是一种不需要用 \`def\` 声明的微型“单行匿名函数”：
\`\`\`python
# 等同于定义了一个加法函数： def add(x, y): return x + y
add = lambda x, y: x + y
\`\`\`

#### 📘 自定义排序法则：
使用内置函数 **\`sorted(list, key=..., reverse=...)\`** 时，我们可以利用 \`lambda\` 指定根据数据的哪个字段进行排序。
- **\`key\`**：接受一个函数，用来返回每个元素的排序依据。
- **\`reverse=True\`**：表示降序（从大到小），默认为升序。

#### 📝 示例（根据年龄对用户进行排序）：
\`\`\`python
users = [
    {"name": "张三", "age": 18},
    {"name": "李四", "age": 22},
    {"name": "王五", "age": 20}
]
# key 接收一个 lambda，代表以字典中的 'age' 值作为排序标准
sorted_users = sorted(users, key=lambda u: u["age"])
# 排序结果：18岁张三，20岁王五，22岁李四
\`\`\``,
    task: "编辑器中提供了一个学生字典列表 `students`。请编写一行代码，使用 `sorted()` 函数配合 `lambda` 表达式，根据每名学生的 **`score`（分数）进行降序（从大到小）排序**，并将排序后的新列表赋值给变量 `sorted_students`。",
    hint: "降序排序需要设置参数 reverse=True。编写的 key 部分应当是：key=lambda s: s[\"score\"]。\n例如：sorted_students = sorted(students, key=lambda s: s[\"score\"], reverse=True)",
    defaultCode: "students = [\n    {\"name\": \"Alice\", \"score\": 85},\n    {\"name\": \"Bob\", \"score\": 95},\n    {\"name\": \"Charlie\", \"score\": 75}\n]\n# 编写一行代码，按成绩降序排序结果存入 sorted_students 变量中\n",
    solution: "students = [\n    {\"name\": \"Alice\", \"score\": 85},\n    {\"name\": \"Bob\", \"score\": 95},\n    {\"name\": \"Charlie\", \"score\": 75}\n]\nsorted_students = sorted(students, key=lambda s: s[\"score\"], reverse=True)",
    validate: async (code, stdout, globals, pyodide) => {
      if (!globals.has("sorted_students")) return { success: false, message: "未检测到变量 'sorted_students'。" };
      if (!code.includes("lambda")) return { success: false, message: "本关要求必须配合使用 'lambda' 匿名函数进行排序！" };
      if (!code.includes("reverse=True") && !code.includes("reverse = True")) {
        return { success: false, message: "请记得开启降序参数 (reverse=True)！" };
      }

      const res = globals.get("sorted_students").toJs();
      if (res.length !== 3 || res[0].get("name") !== "Bob" || res[2].get("name") !== "Charlie") {
        return { success: false, message: "排序结果顺序不正确，降序第一名应当是 Bob (95分)，最后一名是 Charlie (75分)。" };
      }
      return { success: true, message: "非常优秀！Lambda 配合 sorted 是对表格类、接口返回数据进行快速排布与筛选的利器！" };
    }
  },
  {
    id: 21,
    level: 5,
    title: "21. 文件操作与跨平台路径 (Pathlib 与 open)",
    description: `### 📂 跨平台文件管理：Pathlib 与 With

文件读写是本地项目（如保存配置、存储日志）最基础的需求。然而，在 Windows 上路径使用反斜杠 \`\\\`，而在 Mac/Linux 上使用斜杠 \`/\`。如果直接写死路径，很容易引发崩盘报错。

Python 官方推荐使用 **\`pathlib\`** 模块来进行智能的、跨平台的路径运算。

#### 📘 Pathlib 与 With 的黄金搭档：
- **\`Path(x)\`**：将路径文本包裹为 Path 对象。
- **\`Path.mkdir(parents=True, exist_ok=True)\`**：创建文件夹，\`parents=True\` 表示如果上级目录没有也会递归创建，\`exist_ok=True\` 表示如果目录已存在不会报错。
- **斜杠运算符 \`/\`**：Path 对象重载了 \`/\` 运算符，可以用它进行智能路径拼接，自动适配操作系统的斜杠。
- **\`with open(path, mode)\`**：可以直接把 Path 对象传递给 \`open\`。

#### 📝 示例：
\`\`\`python
from pathlib import Path

# 创建一个指向 my_project/logs/info.txt 的跨平台路径
log_dir = Path("my_project") / "logs"
log_dir.mkdir(parents=True, exist_ok=True) # 递归建立目录
file_path = log_dir / "info.txt"

# 写入文件
with open(file_path, "w", encoding="utf-8") as f:
    f.write("Log active.")
\`\`\``,
    task: "请使用 `pathlib.Path` 编写代码完成以下操作：\n1. 导入 `pathlib` 模块中的 `Path`。\n2. 创建一个 Path 路径对象 `target_dir`，指向 `\"temp_data/config\"` 目录。\n3. 使用 `.mkdir()` 方法安全地创建这个文件夹（如果已存在则跳过，如需创建上级文件夹请设置对应参数）。\n4. 使用 `with open` 在该目录下创建/写入文件 `\"settings.txt\"`，写入内容 `\"theme=dark\"`，指定编码为 `utf-8`。",
    hint: " 步骤：\nfrom pathlib import Path\ntarget_dir = Path(\"temp_data/config\")\ntarget_dir.mkdir(parents=True, exist_ok=True)\nwith open(target_dir / \"settings.txt\", \"w\", encoding=\"utf-8\") as f:\n    f.write(\"theme=dark\")",
    defaultCode: "# 导入 Path，创建 temp_data/config 文件夹，并写入 settings.txt 文件\n",
    solution: "from pathlib import Path\ntarget_dir = Path(\"temp_data/config\")\ntarget_dir.mkdir(parents=True, exist_ok=True)\nwith open(target_dir / \"settings.txt\", \"w\", encoding=\"utf-8\") as f:\n    f.write(\"theme=dark\")",
    validate: async (code, stdout, globals, pyodide) => {
      if (!code.includes("Path")) return { success: false, message: "本关要求必须导入并使用 'Path' 路径对象！" };
      if (!code.includes("mkdir")) return { success: false, message: "请调用 mkdir() 来创建对应的文件夹结构。" };
      if (!code.includes("with open")) return { success: false, message: "请配合使用 with open 来确保文件操作安全。" };

      try {
        await pyodide.runPythonAsync(`
import os
assert os.path.exists("temp_data/config/settings.txt"), "文件未在 'temp_data/config/settings.txt' 成功创建"
with open("temp_data/config/settings.txt", "r", encoding="utf-8") as f:
    assert f.read() == "theme=dark", "settings.txt 内写入的内容不正确！"
        `);
      } catch (err) {
        return { success: false, message: "文件路径测试失败：" + err.message };
      }
      return { success: true, message: "做得太棒了！跨平台路径习惯非常关键，它会让你的项目能够在任何服务器和电脑上完美运行！" };
    }
  },
  {
    id: 22,
    level: 5,
    title: "22. 容错大师 (Exceptions 异常处理)",
    description: `### 🛡️ 构建健壮的代码：异常捕获

当你的程序执行遇到错误时（例如除以了零，或者试图读取不存在的文件），Python 默认会抛出异常并且崩溃罢工。为了提供友好的体验，我们需要拦截这些错误。

我们使用 **\`try-except\`** 结构来捕获并优雅处理错误。

#### 📘 语法结构：
\`\`\`python
try:
    # 尝试执行可能出错的代码
    num = 10 / 0
except ZeroDivisionError:
    # 如果在 try 块中触发了除零异常，执行这里的防崩代码
    print("错误：不能除以零！")
\`\`\``,
    task: "请定义一个名为 `safe_division(a, b)` 的函数，该函数执行 `a / b`：\n1. 在 `try` 块中进行除法计算并直接返回结果。\n2. 使用 `except ZeroDivisionError` 捕获除零异常，一旦捕获到，返回字符串 `\"Division by zero error!\"`。\n3. 使用 `except TypeError` 捕获类型错误（比如传了字符串），一旦捕获到，返回字符串 `\"Type error!\"`。",
    hint: "可以多重 except。结构如下：\ndef safe_division(a, b):\n    try:\n        return a / b\n    except ZeroDivisionError:\n        return \"Division by zero error!\"\n    except TypeError:\n        return \"Type error!\"",
    defaultCode: "def safe_division(a, b):\n    # 编写异常处理结构，捕获 ZeroDivisionError 和 TypeError\n    pass\n",
    solution: "def safe_division(a, b):\n    try:\n        return a / b\n    except ZeroDivisionError:\n        return \"Division by zero error!\"\n    except TypeError:\n        return \"Type error!\"",
    validate: async (code, stdout, globals, pyodide) => {
      if (!globals.has("safe_division")) return { success: false, message: "未定义函数 'safe_division'。" };
      if (!code.includes("try:") || !code.includes("except")) {
        return { success: false, message: "你必须使用 try-except 块来处理异常！" };
      }

      try {
        await pyodide.runPythonAsync(`
assert safe_division(10, 2) == 5.0, "10 / 2 应当是 5.0"
assert safe_division(5, 0) == "Division by zero error!", "除以零时应返回指定的错误提示"
assert safe_division(5, "hello") == "Type error!", "传入非数字时应触发 TypeError 并返回指定的错误提示"
        `);
      } catch (err) {
        return { success: false, message: "异常函数功能测试失败：" + err.message };
      }
      return { success: true, message: "棒极了！你的程序从此具备了出色的容错性和抗风险能力！" };
    }
  },
  {
    id: 23,
    level: 5,
    title: "23. 数据交换枢纽 (JSON 编解码 json 模块)",
    description: `### 🌐 现代互联网通用语：JSON 数据

在几乎所有的网络项目、API 开发、或者是前后端交互中，**JSON (JavaScript Object Notation)** 都是最常用的通用数据传输格式。Python 内置了 \`json\` 模块帮助我们在 Python 对象（字典、列表）与 JSON 字符串之间进行完美互转。

#### 📘 核心编解码函数：
1. **\`json.loads(json_str)\`**：(Load String) 将一个 **JSON 字符串**解析为 Python **字典/列表**。
2. **\`json.dumps(py_obj)\`**：(Dump String) 将一个 Python **字典/列表**序列化为 **JSON 字符串**。

#### 📝 示例：
\`\`\`python
import json

# JSON 字符串 -> 字典
json_data = '{"name": "Bob", "active": true}'
user = json.loads(json_data)
print(user["name"]) # 输出: Bob

# 字典 -> JSON 字符串
user["score"] = 90
new_json = json.dumps(user) # 转换回字符串，用于发送给网络或保存到文本
\`\`\``,
    task: "编辑器预先提供了一个 JSON 字符串 `json_str`。请编写代码执行以下操作：\n1. 导入 `json` 模块。\n2. 使用 `json.loads()` 将 `json_str` 解析为 Python 字典并赋值给变量 `user_dict`。\n3. 在 `user_dict` 的 `\"skills\"` 列表中，使用 `.append()` 方法添加一个技能字符串 `\"SQL\"`。\n4. 使用 `json.dumps()` 将修改后的 `user_dict` 重新转换为 JSON 字符串，并存入新变量 `new_json_str` 中。",
    hint: " 步骤：\nimport json\nuser_dict = json.loads(json_str)\nuser_dict[\"skills\"].append(\"SQL\")\nnew_json_str = json.dumps(user_dict)",
    defaultCode: "json_str = '{\"name\": \"Alice\", \"skills\": [\"Python\", \"Git\"], \"age\": 20}'\n# 1. 导入 json，2. 解析为 user_dict，3. 给 skills 追加 \"SQL\"，4. 序列化为 new_json_str\n",
    solution: "import json\njson_str = '{\"name\": \"Alice\", \"skills\": [\"Python\", \"Git\"], \"age\": 20}'\nuser_dict = json.loads(json_str)\nuser_dict[\"skills\"].append(\"SQL\")\nnew_json_str = json.dumps(user_dict)",
    validate: async (code, stdout, globals, pyodide) => {
      if (!code.includes("import json")) return { success: false, message: "请导入 'json' 标准库模块。" };
      if (!globals.has("user_dict")) return { success: false, message: "未检测到解析后的字典变量 'user_dict'。" };
      if (!globals.has("new_json_str")) return { success: false, message: "未检测到序列化后的 JSON 字符串变量 'new_json_str'。" };

      try {
        await pyodide.runPythonAsync(`
import json
data = json.loads(new_json_str)
assert "SQL" in data["skills"], "修改后的 JSON 字符串的 skills 字段应该包含 'SQL'"
assert len(data["skills"]) == 3, "skills 列表的长度应该为 3"
        `);
      } catch (err) {
        return { success: false, message: "JSON 解析或格式化内容测试失败：" + err.message };
      }
      return { success: true, message: "恭喜通关！JSON 数据互转是编写爬虫、Web 后端、以及做数据持久化配置的基础核心技术。" };
    }
  },
  {
    id: 24,
    level: 5,
    title: "24. 时间旅行者 (日期与时间 datetime 模块)",
    description: `### ⏰ 工程中的时间轴：datetime

从文件记录、网页发帖到订单生成，项目开发离不开日期和时间的操作。Python 标准库提供的 \`datetime\` 模块专门用来处理时间运算及格式转换。

#### 📘 常用时间操作：
1. **格式化读取 \`strptime(date_str, format)\`**：将一段代表日期时间的字符串解析为 Python \`datetime\` 对象。
2. **格式化输出 \`strftime(format)\`**：将 \`datetime\` 对象以特定格式打印成字符串。
   - **核心占位符**：\`%Y\` (年), \`%m\` (月), \`%d\` (日), \`%H\` (时), \`%M\` (分), \`%S\` (秒)。
3. **时间差 \`timedelta(days, seconds, ...)\`**：对时间进行加减运算。

#### 📝 示例：
\`\`\`python
from datetime import datetime, timedelta

# 解析字符串时间
t_str = "2026-05-21 21:00:00"
dt = datetime.strptime(t_str, "%Y-%m-%d %H:%M:%S")

# 时间往后推 3 天
future_time = dt + timedelta(days=3)

# 转换格式输出
print(future_time.strftime("%Y/%m/%d")) # 输出: "2026/05/24"
\`\`\``,
    task: "编辑器预先提供了一个代表事件发生时间的字符串 `event_time = \"2026-05-01 12:00:00\"`。\n请编写代码执行以下操作：\n1. 导入 `datetime` 与 `timedelta`。\n2. 将 `event_time` 解析为 datetime 对象并存入变量 `dt`。\n3. 计算 `dt` 往后延期 15 天之后的新日期，存入变量 `deadline_dt`。\n4. 将 `deadline_dt` 格式化为 `\"YYYY/MM/DD\"`（例如 `\"2026/05/16\"`）格式的字符串，存入变量 `formatted_date` 中。",
    hint: " 步骤：\nfrom datetime import datetime, timedelta\ndt = datetime.strptime(event_time, \"%Y-%m-%d %H:%M:%S\")\ndeadline_dt = dt + timedelta(days=15)\nformatted_date = deadline_dt.strftime(\"%Y/%m/%d\")",
    defaultCode: "event_time = \"2026-05-01 12:00:00\"\n# 在下方编写代码计算 15 天后的日期，并格式化存入 formatted_date 变量中\n",
    solution: "event_time = \"2026-05-01 12:00:00\"\nfrom datetime import datetime, timedelta\ndt = datetime.strptime(event_time, \"%Y-%m-%d %H:%M:%S\")\ndeadline_dt = dt + timedelta(days=15)\nformatted_date = deadline_dt.strftime(\"%Y/%m/%d\")",
    validate: async (code, stdout, globals, pyodide) => {
      if (!code.includes("datetime") || !code.includes("timedelta")) {
        return { success: false, message: "请确保导入了 'datetime' 和 'timedelta'。" };
      }
      if (!globals.has("formatted_date")) return { success: false, message: "未检测到最终格式化结果变量 'formatted_date'。" };

      const fdate = globals.get("formatted_date");
      if (fdate !== "2026/05/16") {
        return { success: false, message: `延期 15 天后并进行格式化格式输出应为 '2026/05/16'，而你输出的是 '${fdate}'。` };
      }
      return { success: true, message: "通关！时间与日期对象的运算和序列化在工程中是不可或缺的基本功！" };
    }
  },
  {
    id: 25,
    level: 5,
    title: "25. 初识面向对象 (Classes & Objects)",
    description: `### 🏢 面向对象编程：类与实例

面向对象编程 (OOP) 是把数据和操作这些数据的方法打包在一起的编程思想。
- **类 (Class)**：是图纸，用来规定这个物体拥有什么特征和技能。
- **对象 (Object)**：是根据图纸生产出的实体（也称实例）。

#### 📘 核心要素：
1. **构造方法 \`__init__(self, ...)\`**：在创建新对象时自动调用的函数，用来初始化对象的**属性（Attribute）**。
2. **\`self\` 参数**：代表对象本身，用于在方法中读写对象自身的属性。类里的每个方法的第一个参数都必须是 \`self\`。

#### 📝 示例：
\`\`\`python
class Dog:
    def __init__(self, name):
        self.name = name  # 初始化属性
        
    def bark(self):
        return f"{self.name} 汪汪叫！" # 实例方法

my_dog = Dog("旺财") # 实例化一个对象
print(my_dog.bark()) # 输出: "旺财 汪汪叫！"
\`\`\``,
    task: "请在右侧编写代码：\n1. 定义一个名为 `Student` 的类。\n2. 编写其构造方法 `__init__(self, name, score)`，接收并初始化属性 `self.name` 和 `self.score`。\n3. 编写一个实例方法 `is_passed(self)`。如果属性 `self.score` 大于或等于 `60`，返回 `True`；否则返回 `False`。",
    hint: "注意类的方法首个参数永远是 self！构造方法名必须是 __init__（前后都是双下划线）。例如：\nclass Student:\n    def __init__(self, name, score):\n        self.name = name\n        self.score = score\n    def is_passed(self):\n        return self.score >= 60",
    defaultCode: "# 在下方编写 Student 类及构造方法、实例方法\n",
    solution: "class Student:\n    def __init__(self, name, score):\n        self.name = name\n        self.score = score\n    def is_passed(self):\n        return self.score >= 60",
    validate: async (code, stdout, globals, pyodide) => {
      if (!globals.has("Student")) return { success: false, message: "未定义类 'Student'。" };

      try {
        await pyodide.runPythonAsync(`
s1 = Student("张三", 85)
assert s1.name == "张三" and s1.score == 85, "构造方法初始化属性错误"
assert s1.is_passed() == True, "85分应当被判定为 True (及格)"

s2 = Student("李四", 45)
assert s2.is_passed() == False, "45分应当被判定为 False (不及格)"
        `);
      } catch (err) {
        return { success: false, message: "Student 类运行测试未通过：" + err.message };
      }
      return { success: true, message: "厉害！你成功掌握了面向对象编程 (OOP) 的精髓，能够手写类与实例方法了！" };
    }
  },
  {
    id: 26,
    level: 5,
    title: "26. 类的继承与多态 (Class Inheritance & super())",
    description: `### 🧬 面向对象进阶：继承

继承是面向对象的重要特性之一。如果多个类拥有很多重合的属性和方法，我们可以定义一个“父类（基类）”，然后让其他“子类（派生类）”继承它，实现代码的复用。

#### 📘 关键语法：
- 定义子类时把父类名字写在括号内：\`class Child(Parent):\`。
- **\`super()\`**：代表父类。在子类的 \`__init__\` 中，通常调用 \`super().__init__(...)\` 优先执行父类的初始化逻辑。
- **重写 (Override)**：如果子类定义了与父类同名的方法，执行时会执行子类的新版本。

#### 📝 示例：
\`\`\`python
class Employee:
    def __init__(self, name):
        self.name = name
    def get_salary(self):
        return 2000

class Manager(Employee):
    def __init__(self, name, bonus):
        super().__init__(name) # 调用父类的构造方法初始化 name
        self.bonus = bonus
        
    def get_salary(self): # 重写父类的方法
        return super().get_salary() + self.bonus
\`\`\``,
    task: "请在右侧实现以下类关系：\n1. 定义一个基类 `Animal`，其构造方法 `__init__(self, name)` 初始化属性 `self.name`，且定义实例方法 `make_sound(self)` 返回字符串 `\"Some sound\"`。\n2. 定义继承自 `Animal` 的子类 `Cat`。其构造方法接收 `name` 和 `color` 两个参数，需调用 `super().__init__(name)` 初始化父类属性，并将 `color` 属性存入 `self.color`。\n3. 重写 `Cat` 的 `make_sound(self)` 方法，让其返回字符串 `\"Meow\"`。",
    hint: " 类的继承与 super() 写法：\nclass Animal:\n    def __init__(self, name):\n        self.name = name\n    def make_sound(self):\n        return \"Some sound\"\n\nclass Cat(Animal):\n    def __init__(self, name, color):\n        super().__init__(name)\n        self.color = color\n    def make_sound(self):\n        return \"Meow\"",
    defaultCode: "# 在下方定义基类 Animal 与子类 Cat\n",
    solution: "class Animal:\n    def __init__(self, name):\n        self.name = name\n    def make_sound(self):\n        return \"Some sound\"\n\nclass Cat(Animal):\n    def __init__(self, name, color):\n        super().__init__(name)\n        self.color = color\n    def make_sound(self):\n        return \"Meow\"",
    validate: async (code, stdout, globals, pyodide) => {
      if (!globals.has("Animal")) return { success: false, message: "没有定义父类 'Animal'。" };
      if (!globals.has("Cat")) return { success: false, message: "没有定义子类 'Cat'。" };

      try {
        await pyodide.runPythonAsync(`
c = Cat("咪咪", "橘色")
assert isinstance(c, Animal), "Cat 类应当继承自 Animal 类"
assert c.name == "咪咪", "未能正确继承并初始化属性 name"
assert c.color == "橘色", "未能正确初始化子类特有属性 color"
assert c.make_sound() == "Meow", "make_sound 方法未能成功重写为 'Meow'"
        `);
      } catch (err) {
        return { success: false, message: "继承与重写逻辑验证未通过：" + err.message };
      }
      return { success: true, message: "通关！你已经理解了面向对象中最核心的“继承”和“多态”机制，可以进行复杂软件设计了！" };
    }
  },
  {
    id: 27,
    level: 5,
    title: "27. 类的魔法方法 (Dunder Methods)",
    description: `### 🪄 掌控系统语言：魔法方法

Python 里的类藏着一些以双下划线开头和结尾的方法，它们被称为**双下（Double Under，简称 Dunder）方法**或**魔法方法**。重写这些方法，可以让自定义的类对象像 Python 的原生变量一样进行高雅的操作：

1. **\`__str__(self)\`**：定义对该对象执行 \`str()\` 或 \`print()\` 时，输出给用户看的字符串描述（非常有利于日志调试和开发显示）。
2. **\`__eq__(self, other)\`**：定义该类对象之间的“等于”比较关系。如果不写，默认是用内存地址对比，而重写后可以用值对比。

#### 📝 示例：
\`\`\`python
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y
    
    # 打印对象时的自定义描述
    def __str__(self):
        return f"({self.x}, {self.y})"
        
    # 定义比较符号 ==
    def __eq__(self, other):
        return self.x == other.x and self.y == other.y

p1 = Point(1, 2)
print(p1) # 输出: "(1, 2)" 而不是 "<__main__.Point object at 0x...>"
print(p1 == Point(1, 2)) # 输出: True
\`\`\``,
    task: "请在右侧为已给出框架的 `Book` 类实现两个魔法方法：\n1. 重写 `__str__(self)` 魔法方法，返回格式为 `\"《书名》作者: 作者名\"` 的字符串。\n2. 重写 `__eq__(self, other)` 魔法方法：如果对比的 `other` 对象也是 `Book` 的实例（可以使用 `isinstance(other, Book)` 判断），且它们的 `title` 与 `author` 都完全相同，则返回 `True`；否则返回 `False`。",
    hint: " 编写方法：\nclass Book:\n    def __init__(self, title, author):\n        self.title = title\n        self.author = author\n    def __str__(self):\n        return f\"《{self.title}》作者: {self.author}\"\n    def __eq__(self, other):\n        if not isinstance(other, Book):\n            return False\n        return self.title == other.title and self.author == other.author",
    defaultCode: "class Book:\n    def __init__(self, title, author):\n        self.title = title\n        self.author = author\n    \n    # 1. 编写 __str__ 魔法方法\n    \n    # 2. 编写 __eq__ 魔法方法\n",
    solution: "class Book:\n    def __init__(self, title, author):\n        self.title = title\n        self.author = author\n    def __str__(self):\n        return f\"《{self.title}》作者: {self.author}\"\n    def __eq__(self, other):\n        if not isinstance(other, Book):\n            return False\n        return self.title == other.title and self.author == other.author",
    validate: async (code, stdout, globals, pyodide) => {
      if (!globals.has("Book")) return { success: false, message: "未检测到类 'Book'。" };

      try {
        await pyodide.runPythonAsync(`
b1 = Book("Python 核心开发", "Guido")
b2 = Book("Python 核心开发", "Guido")
b3 = Book("Flask 轻量开发", "Armin")

assert str(b1) == "《Python 核心开发》作者: Guido", "__str__ 返回的字符串格式不正确！"
assert b1 == b2, "当两本书标题和作者相同时，== 对比应当返回 True"
assert b1 != b3, "当两本书不同时，== 对比应当返回 False"
assert b1 != "not a book", "与非 Book 对象对比时应当优雅判定为 False"
        `);
      } catch (err) {
        return { success: false, message: "魔法方法测试失败：" + err.message };
      }
      return { success: true, message: "完美通过！魔法方法赋予了你的自定义类极其高雅、融入 Python 生态圈的代码习惯。" };
    }
  },
  {
    id: 28,
    level: 5,
    title: "28. 跨界连接 (HTTP 网络请求)",
    description: `### 🌐 获取外部世界的信息：HTTP 请求

在真实的系统和工具开发（如网络爬虫、获取天气预报接口、微信公众号后台）中，我们需要向互联网的 API 接口发送请求。Python 标准库提供的 \`urllib.request\` 负责实现网络连接。

#### 📘 标准网络请求写法：
在常规 Python 脚本中，我们这样发送 GET 请求并解析接口数据：
\`\`\`python
import urllib.request
import json

url = "https://api.example.com/data"
with urllib.request.urlopen(url) as response:
    # 1. 读取网页响应的二进制字节流 (bytes)
    raw_bytes = response.read()
    # 2. 将二进制解码为 utf-8 字符串
    html_str = raw_bytes.decode('utf-8')
    # 3. 如果返回的是 JSON 格式，则解析为字典
    data = json.loads(html_str)
\`\`\`

*(提示：当前页面运行在浏览器沙箱内，受网络跨域限制，本关我们会在运行环境中为您拦截并模拟网络返回)*`,
    task: "请编写一个名为 `get_api_data(url)` 的函数，该函数：\n1. 导入 `urllib.request` 与 `json` 模块。\n2. 使用 `urllib.request.urlopen(url)` 打开链接，并配合 `with` 语句安全管理连接。\n3. 读取响应的数据，使用 `.decode('utf-8')` 进行解码。\n4. 使用 `json.loads()` 将解码后的 JSON 字符串解析为 Python 数据（字典或列表）并返回。",
    hint: " 函数编写结构：\ndef get_api_data(url):\n    import urllib.request\n    import json\n    with urllib.request.urlopen(url) as response:\n        raw_data = response.read().decode('utf-8')\n        return json.loads(raw_data)",
    defaultCode: "# 编写 get_api_data(url) 函数获取网页并解析 JSON 数据\n",
    solution: "def get_api_data(url):\n    import urllib.request\n    import json\n    with urllib.request.urlopen(url) as response:\n        raw = response.read().decode('utf-8')\n        return json.loads(raw)",
    validate: async (code, stdout, globals, pyodide) => {
      if (!globals.has("get_api_data")) return { success: false, message: "未定义函数 'get_api_data'。" };

      try {
        // Mock urllib.request in Pyodide sandbox environment
        await pyodide.runPythonAsync(`
import sys
from types import ModuleType
mock_urllib = ModuleType('urllib')
mock_request = ModuleType('request')
mock_urllib.request = mock_request
sys.modules['urllib'] = mock_urllib
sys.modules['urllib.request'] = mock_request

class MockResponse:
    def __init__(self, data_str):
        self.data_str = data_str
    def read(self):
        return self.data_str.encode('utf-8')
    def __enter__(self):
        return self
    def __exit__(self, exc_type, exc_val, exc_tb):
        pass

def mock_urlopen(url):
    if "users" in url:
        return MockResponse('{"status": "success", "users": ["Alice", "Bob"]}')
    return MockResponse('{"status": "unknown"}')

mock_request.urlopen = mock_urlopen
        `);

        await pyodide.runPythonAsync(`
res = get_api_data("https://api.mock.com/users")
assert res["status"] == "success", "网络接口解析不正确"
assert len(res["users"]) == 2, "网络数据结构解析有误"
        `);
      } catch (err) {
        return { success: false, message: "网络请求函数运行测试异常：" + err.message };
      }
      return { success: true, message: "通关！在 Web 开发和数据采集中，通过 API 交互拉取数据是开发各种系统的重要桥梁！" };
    }
  },
  {
    id: 29,
    level: 5,
    title: "29. 工程基石 (Pip 包管理与虚拟环境)",
    description: `### 🛠️ 创建你自己的项目：模块包的安装

在完成本次基础修炼后，你可以直接使用 Python 开发你自己的项目了。在真实的项目工程中，有两个机制必须要掌握：

#### 📘 1. Pip 第三方包管理
除了标准库外，Python 的第三方模块（如非常强大的网页请求库 \`requests\`、游戏开发库 \`pygame\`、机器学习库 \`pandas\`）都发布在 PyPI（Python 官方包托管中心）上。我们使用系统命令行工具 **\`pip\`** 来进行安装：
\`\`\`bash
# 在你电脑自带的命令行终端（非 Python 交互环境内）输入并执行：
pip install requests
\`\`\`

#### 📘 2. requirements.txt 文件
项目开发中依赖的第三方库越来越多。为了让别人的电脑也能运行你的程序，业界标准规范是在项目根目录下创建一个名为 **\`requirements.txt\`** 的纯文本文件，里面每一行写一个库的名字和版本范围。别人只需要通过以下命令，即可一键装齐所有依赖：
\`\`\`bash
pip install -r requirements.txt
\`\`\`

#### 📘 3. 虚拟环境 (Virtual Environment)
每个项目的第三方库版本可能发生冲突。为了互不干扰，我们常使用 \`python -m venv venv\` 来为各个项目独立开辟一个虚拟的、隔离的 Python 环境。

*(提示：本关卡我们将进行一次 requirements 依赖声明文件的编写模拟，掌握声明依赖的方法)*`,
    task: "请声明一个变量 `requirements_content`，保存一个符合规范的多行字符串文本。\n要求在该文本中声明你的项目依赖以下两个第三方库：\n1. `requests` 库（版本要求大于等于 `2.31.0`，即写为 `requests>=2.31.0`）\n2. `flask` 库（版本要求大于等于 `3.0.0`，即写为 `flask>=3.0.0`，单独占一行）。",
    hint: "字符串格式要求：\nrequirements_content = \"\"\"requests>=2.31.0\nflask>=3.0.0\"\"\" 或者简单的换行连接：\nrequirements_content = \"requests>=2.31.0\\nflask>=3.0.0\"",
    defaultCode: "# 编写字符串 requirements_content 声明项目依赖的库及版本\n",
    solution: "requirements_content = \"requests>=2.31.0\\nflask>=3.0.0\"",
    validate: async (code, stdout, globals, pyodide) => {
      if (!globals.has("requirements_content")) return { success: false, message: "未检测到变量 'requirements_content'。" };

      const content = globals.get("requirements_content");
      const lines = content.split("\n").map(l => l.trim()).filter(l => l !== "");

      if (lines.length < 2) {
        return { success: false, message: "依赖信息应该包含 requests 和 flask 两个第三方库，分两行书写。" };
      }

      const hasRequests = lines.some(l => l.replace(/\s+/g, '') === "requests>=2.31.0");
      const hasFlask = lines.some(l => l.replace(/\s+/g, '') === "flask>=3.0.0");

      if (!hasRequests) return { success: false, message: "未正确在 requirements.txt 内容中声明 'requests>=2.31.0'" };
      if (!hasFlask) return { success: false, message: "未正确在 requirements.txt 内容中声明 'flask>=3.0.0'" };

      return { success: true, message: "恭喜！您成功掌握了工程级依赖声明管理方法。利用 requirements 能够使您的项目轻松迁移和分发！" };
    }
  },
  {
    id: 30,
    level: 5,
    title: "30. 终极实战：学生信息管理系统 (Student Info System)",
    description: `### 👑 终极实战练兵：简易信息系统

恭喜你走到了最终一关！我们将把之前学到的**面向对象类结构、列表与字典容器、Lambda 自定义高阶排序、JSON 数据转换、With 语句与文件写入**全部融合进一个真实的小型项目：**学生信息管理系统 (Student Info System)**。

这是很多软件管理模块的缩影，请设计两个类并实现它们的交互：

#### 📐 1. Student 类：
- 构造方法 \`__init__(self, name, scores)\`：初始化姓名（字符串）与成绩（字典，例如 \`{"Math": 90, "English": 85}\`）。
- 实例方法 \`get_average(self)\`：返回这名学生所有科目的**平均成绩**。若成绩字典为空，返回 \`0\`。

#### 📐 2. StudentManager 类：
- 构造方法 \`__init__(self)\`：初始化包含所有学生的空列表 \`self.students\`。
- \`add_student(self, student)\`：往列表里添加一个 Student 实例。
- \`get_top_student(self)\`：使用 \`lambda\`，从学生列表中找到**平均成绩最高**的学生实例并返回。如果列表为空，则返回 \`None\`。
- \`save_to_json(self, filepath)\`：使用 \`with open\` 和 \`json.dump()\`（或 \`json.write\` 结合 dumps），将所有学生的数据（包含 name 和 scores 的字典列表）序列化写入 \`filepath\` 路径代表的文本文件中。`,
    task: "请在右侧完整定义 `Student` 和 `StudentManager` 两个类，并根据上述逻辑实现其构造方法及功能方法。",
    hint: "可以使用内置 max() 函数结合 lambda 实现最强学生查找：\nmax(self.students, key=lambda s: s.get_average())\nsave_to_json 时，将每个学生的信息导出为字典 {'name': s.name, 'scores': s.scores}，放入列表中，然后 json.dump() 写入文件。",
    defaultCode: "import json\n\nclass Student:\n    # 声明构造方法和 get_average\n    pass\n\nclass StudentManager:\n    # 声明构造方法、add_student、get_top_student、save_to_json\n    pass\n",
    solution: "import json\n\nclass Student:\n    def __init__(self, name, scores):\n        self.name = name\n        self.scores = scores\n    def get_average(self):\n        if not self.scores:\n            return 0\n        return sum(self.scores.values()) / len(self.scores)\n\nclass StudentManager:\n    def __init__(self):\n        self.students = []\n    def add_student(self, student):\n        self.students.append(student)\n    def get_top_student(self):\n        if not self.students:\n            return None\n        return max(self.students, key=lambda s: s.get_average())\n    def save_to_json(self, filepath):\n        data = []\n        for s in self.students:\n            data.append({\"name\": s.name, \"scores\": s.scores})\n        with open(filepath, \"w\", encoding=\"utf-8\") as f:\n            json.dump(data, f)",
    validate: async (code, stdout, globals, pyodide) => {
      if (!globals.has("Student")) return { success: false, message: "未定义 'Student' 类。" };
      if (!globals.has("StudentManager")) return { success: false, message: "未定义 'StudentManager' 类。" };

      try {
        await pyodide.runPythonAsync(`
s1 = Student("小明", {"语文": 80, "数学": 90})
s2 = Student("小红", {"语文": 95, "数学": 95})
s3 = Student("小刚", {})

assert s1.get_average() == 85.0, "Student 算平均分逻辑不对！"
assert s3.get_average() == 0, "成绩为空时应返回 0！"

mgr = StudentManager()
assert mgr.get_top_student() is None, "学生列表为空时，get_top_student 应当返回 None"
mgr.add_student(s1)
mgr.add_student(s2)
mgr.add_student(s3)

top = mgr.get_top_student()
assert top.name == "小红", "应该找到平均分最高的小红才对！"

mgr.save_to_json("students.json")
import os
import json
assert os.path.exists("students.json"), "save_to_json 方法未能在本地创建 'students.json' 文件！"
with open("students.json", "r", encoding="utf-8") as f:
    js_data = json.load(f)
    assert len(js_data) == 3, "保存的数据量有误，应当包含 3 条学生记录！"
    assert js_data[1]["name"] == "小红", "保存的学生信息不对应！"
        `);
      } catch (err) {
        return { success: false, message: "学生信息管理系统项目断言测试失败：" + err.message };
      }
      return { success: true, message: "【阶段捷报】恭喜你完成前 30 个 Python 核心基础关卡！你已经独立实现了一个集面向对象、算法排序、JSON 和文件读写于一体的小型管理系统。接下来进入工程化、数据处理、Web、数据库和综合项目进阶篇。" };
    }
  }
];

// Export lessons to window if in browser environment
if (typeof window !== "undefined") {
  window.lessons = lessons;
}
