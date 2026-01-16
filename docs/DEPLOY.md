# GitHub 部署指南

完整的 GitHub Pages 部署步骤（适合技术小白）

## 第一步：在 GitHub 创建仓库

1. 打开浏览器，访问 https://github.com
2. 登录你的账号（如果没有需要先注册）
3. 点击右上角的 **+** 号，选择 **New repository**
4. 填写仓库信息：
   - **Repository name**: `flowingai`（必须和 vite.config.js 中的 base 名称一致）
   - **Description**: 全球AI动态情报站
   - **Public/Private**: 选择 **Public**（GitHub Pages 只支持公开仓库）
5. 点击 **Create repository** 按钮

**重要**：如果仓库名不是 `flowingai`，需要修改 `vite.config.js` 第 10 行：
```javascript
base: '/你的仓库名/',  // 把 flowingai 改成你的仓库名
```

## 第二步：准备本地代码

打开 Windows 命令提示符（CMD）或 PowerShell，进入项目目录：

```bash
# 进入项目目录
cd D:\D_AI_test\flowingai

# 检查是否已经有 git 仓库
git status
```

**情况A：如果显示 "fatal: not a git repository"（不是 git 仓库）**

执行以下命令初始化：

```bash
# 初始化 git 仓库
git init

# 添加所有文件
git add .

# 创建第一次提交
git commit -m "初始化项目"
```

**情况B：如果已经有 git 仓库**

检查当前状态，确保有最近一次提交：

```bash
# 如果有未提交的更改，先提交
git add .
git commit -m "更新配置"
```

## 第三步：推送到 GitHub

### 3.1 关联远程仓库

```bash
# 添加远程仓库（把 YOUR_USERNAME 改成你的 GitHub 用户名）
git remote add origin https://github.com/YOUR_USERNAME/flowingai.git

# 如果之前已经添加过，可以用这个命令更新：
# git remote set-url origin https://github.com/YOUR_USERNAME/flowingai.git
```

**示例**：如果你的 GitHub 用户名是 `bob-jery`，命令就是：
```bash
git remote add origin https://github.com/bob-jery/flowingai.git
```

### 3.2 推送代码

```bash
# 重命名主分支为 main（如果还是 master 的话）
git branch -M main

# 推送代码到 GitHub
git push -u origin main
```

**如果推送时要求输入用户名和密码**：
- **Username**: 你的 GitHub 用户名
- **Password**: 你的 **Personal Access Token**（不是登录密码！）

### 3.3 创建 Personal Access Token（PAT）

GitHub 已经不支持使用密码推送，需要创建 Token：

1. 登录 GitHub
2. 点击右上角头像 → **Settings**
3. 左侧菜单最下方 → **Developer settings**
4. 左侧 → **Personal access tokens** → **Tokens (classic)**
5. 点击 **Generate new token** → **Generate new token (classic)**
6. 填写：
   - **Note**: flowingai 部署
   - **Expiration**: 选择过期时间（建议 90 天）
   - **Scopes**: 勾选 **repo**（这个选项下的所有子项都勾选）
7. 点击 **Generate token**
8. **重要**：复制生成的 token（只显示一次，保存好！）

推送时，在 Password 粘贴这个 token 即可。

## 第四步：配置 GitHub Secrets

GitHub Actions 需要智谱 AI 的 API Key 才能采集数据：

1. 打开你刚创建的 GitHub 仓库页面
2. 点击上方的 **Settings** 标签
3. 左侧菜单 → **Secrets and variables** → **Actions**
4. 点击 **New repository secret**
5. 添加以下 secret：
   - **Name**: `ZHIPU_API_KEY`
   - **Value**: 你的智谱 AI API Key
6. 点击 **Add secret**

**如何获取智谱 AI API Key**：
1. 访问 https://open.bigmodel.cn/
2. 登录/注册账号
3. 点击右上角 → **API Key**
4. 复制你的 API Key

## 第五步：启用 GitHub Pages

1. 在 GitHub 仓库页面，点击 **Settings**
2. 左侧菜单 → **Pages**
3. **Build and deployment** 部分：
   - **Source**: 选择 **GitHub Actions**
4. 保存设置

## 第六步：手动触发一次数据采集

1. 在 GitHub 仓库页面，点击 **Actions** 标签
2. 左侧会看到 **"更新AI动态"** 工作流
3. 点击进入
4. 右侧点击 **"Run workflow"** 按钮
5. 点击绿色的 **"Run workflow"** 确认
6. 等待几分钟，工作流会自动：
   - 采集最新 AI 动态
   - 构建前端
   - 部署到 GitHub Pages

## 第七步：访问你的网站

部署成功后，访问地址：

```
https://YOUR_USERNAME.github.io/flowingai/
```

**示例**：如果你的用户名是 `bob-jery`，地址就是：
```
https://bob-jery.github.io/flowingai/
```

## 自动更新机制

配置完成后，网站会**每 4 小时自动更新**一次：

- 北京时间：8:00, 12:00, 16:00, 20:00, 0:00, 4:00
- 你也可以在 GitHub Actions 页面**手动触发**更新

## 常见问题

### Q1: 推送时提示 "Authentication failed"
**A**: 检查是否使用了 Personal Access Token，而不是登录密码。

### Q2: 网站显示 404
**A**:
1. 检查 GitHub Pages 设置是否启用
2. 等待 1-2 分钟让部署生效
3. 检查 vite.config.js 中的 base 配置是否正确

### Q3: 数据没有更新
**A**:
1. 检查 GitHub Secrets 是否正确配置了 ZHIPU_API_KEY
2. 在 Actions 页面查看工作流运行日志，找到错误信息

### Q4: 修改代码后如何更新网站？
**A**:
```bash
git add .
git commit -m "更新内容"
git push
```
推送后会自动触发构建和部署。

## 本地开发

如果想在本地测试：

```bash
# 安装依赖（首次运行）
npm install

# 启动开发服务器
npm run dev

# 采集最新数据
npm run fetch

# 构建生产版本
npm run build
```

开发服务器地址：http://localhost:5173

---

**需要帮助？** 检查 GitHub Actions 的运行日志，里面有详细的错误信息。
