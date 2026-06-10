import os
import urllib.request

pyodide_dir = 'pyodide'
os.makedirs(pyodide_dir, exist_ok=True)

# 使用国内访问较快的 Gcore CDN 镜像作为下载源
base_url = 'https://gcore.jsdelivr.net/pyodide/v0.25.0/full/'
files = [
    'pyodide.js',
    'pyodide.asm.js',
    'pyodide.asm.wasm',
    'pyodide-lock.json',
    'python_stdlib.zip'
]

print("开始下载 Pyodide 核心组件到本地目录...")
for f in files:
    target_path = os.path.join(pyodide_dir, f)
    url = base_url + f
    if os.path.exists(target_path):
        print(f"文件已存在，跳过: {f}")
        continue
    print(f"正在下载: {url} -> {target_path}")
    try:
        urllib.request.urlretrieve(url, target_path)
        print(f"下载成功: {f}")
    except Exception as e:
        print(f"下载失败 {f}: {e}")
print("下载流程结束。")
