# GitHub 部署图文教程

## 📋 准备工作

在你开始之前，请确保：
- ✅ 已有 GitHub 账号（没有？去 https://github.com 注册）
- ✅ 已有智谱 AI API Key（去 https://open.bigmodel.cn/ 获取）

---

## 第一步：创建 GitHub 仓库

### 1. 登录 GitHub

打开浏览器，访问 https://github.com，登录你的账号。

### 2. 创建新仓库

1. 点击页面右上角的 **+** 号
2. 在下拉菜单中点击 **New repository**
   ```
   位置：右上角用户头像旁边
   图标：绿色的 + 号
   ```

### 3. 填写仓库信息

在新页面填写：

| 选项 | 填写内容 | 说明 |
|------|----------|------|
| **Repository name** | `flowingai` | 必须是小写英文字母 |
| **Description** | `全球AI动态情报站` | 可选 |
| **Public/Private** | ⚪ **Public** | **必须选 Public**！ |
| **Add a README file** | ❌ 不勾选 | 我们已经有了 |
| **Add .gitignore** | ❌ 不勾选 | 我们已经有了 |
| **Choose a license** | ❌ 不勾选 | 可选 |

**重要提醒**：
- ⚠️ **必须选择 Public**，GitHub Pages 只支持公开仓库
- ⚠️ 仓库名必须是 `flowingai`，否则需要修改代码配置

### 4. 点击创建

点击页面底部的绿色按钮 **Create repository**

---

## 第二步：推送代码到 GitHub

创建完仓库后，GitHub 会显示一个快速设置页面。你需要：

### 找到你的 GitHub 用户名

看浏览器地址栏，会显示：
```
https://github.com/你的用户名/flowingai
```

记下你的用户名，后面要用。

### 在本地执行推送命令

打开 **命令提示符（CMD）** 或 **PowerShell**：

```bash
# 进入项目目录
cd D:\D_AI_test\flowingai

# 添加远程仓库（把下面的 YOUR_USERNAME 改成你的 GitHub 用户名）
git remote add origin https://github.com/YOUR_USERNAME/flowingai.git

# 示例：如果你的用户名是 bob123，命令就是：
# git remote add origin https://github.com/bob123/flowingai.git

# 重命名分支为 main
git branch -M main

# 推送代码到 GitHub
git push -u origin main
```

### 输入用户名和密码

执行 `git push` 命令后，会提示输入：

```
Username: '你的 GitHub 用户名'
Password: '这里输入你的 Personal Access Token'
```

**⚠️ 重要**：Password 不是你的登录密码，而是 **Personal Access Token**！

---

## 第三步：创建 Personal Access Token（必需）

GitHub 已经不再支持使用密码推送代码，必须创建 Token。

### 3.1 打开 Token 设置页面

1. 在 GitHub 页面，点击右上角**头像**
2. 点击 **Settings**（设置）
3. 在左侧菜单最下方，点击 **Developer settings**
4. 左侧点击 **Personal access tokens** → **Tokens (classic)**
5. 点击 **Generate new token** → **Generate new token (classic)**

### 3.2 生成新 Token

填写以下信息：

| 选项 | 填写内容 |
|------|----------|
| **Name** | `flowingai 部署` |
| **Expiration** | `90 days` 或 `No expiration` |
| **Scopes** | 勾选 **repo**（这会自动勾选下面的所有子选项） |

**Scopes 勾选说明**：
- ✅ repo
  - ✅ repo:status
  - ✅ repo_deployment
  - ✅ public_repo
  - ✅ repo:invite
  - ✅ security_events

### 3.3 复制 Token

点击页面底部的 **Generate token** 按钮。

**⚠️ 极其重要**：
- 页面会显示一串随机字符（以 `ghp_` 开头）
- **这是唯一一次显示，务必复制保存！**
- 建议保存到记事本或密码管理器

Token 格式类似：
```
ghp_1234567890abcdefghijk...
```

---

## 第四步：重新执行推送命令

有了 Token 后，再次执行：

```bash
cd D:\D_AI_test\flowingai
git push -u origin main
```

这次会提示：
```
Username: '输入你的 GitHub 用户名'
Password: '粘贴刚才复制的 Token'
```

**注意**：粘贴 Token 时屏幕上不会显示任何字符，这是正常的！粘贴后直接按回车。

### 推送成功的标志

看到类似这样的输出就成功了：

```
Enumerating objects: 45, done.
Counting objects: 100% (45/45), done.
Writing objects: 100% (35/35), 25.00 KiB | 1.00 MiB/s, done.
Total 35 (delta 5), reused 0 (delta 0)
To https://github.com/YOUR_USERNAME/flowingai.git
 * [new branch]      main -> main
```

---

## 第五步：配置 GitHub Secrets

### 5.1 打开仓库设置

1. 在你的 GitHub 仓库页面
2. 点击上方的 **Settings** 标签
3. 左侧菜单找到 **Secrets and variables**
4. 点击 **Actions**

### 5.2 添加 ZHIPU_API_KEY

1. 点击 **New repository secret**
2. 填写：
   - **Name**: `ZHIPU_API_KEY`
   - **Value**: 粘贴你的智谱 AI API Key
3. 点击 **Add secret**

**如何获取智谱 AI API Key**：
1. 访问 https://open.bigmodel.cn/
2. 登录/注册账号
3. 点击右上角 → **API Key**
4. 复制你的 Key（格式类似 `xxx.yyy.zzz`）

---

## 第六步：启用 GitHub Pages

### 6.1 打开 Pages 设置

1. 在仓库页面点击 **Settings**
2. 左侧菜单找到 **Pages**

### 6.2 配置部署源

在 **Build and deployment** 部分：

| 选项 | 选择 |
|------|------|
| **Source** | **GitHub Actions** |

选择后会自动保存。

---

## 第七步：手动触发首次数据采集

### 7.1 打开 Actions 页面

1. 在仓库页面点击 **Actions** 标签
2. 左侧会看到工作流 **"更新AI动态"**

### 7.2 手动运行工作流

1. 点击 **"更新AI动态"** 进入
2. 右侧点击 **Run workflow** 按钮
3. 确认分支是 **main**
4. 点击绿色的 **Run workflow** 按钮

### 7.3 查看运行状态

- 页面会显示新的工作流运行
- 点击进去可以看到详细日志
- 等待几分钟（大概 2-5 分钟）

### 7.4 成功的标志

工作流运行成功后会显示：
- ✅ 绿色的对勾
- 所有步骤都打勾
- 页面底部会显示网站链接

---

## 第八步：访问你的网站

部署成功后，访问地址：

```
https://你的用户名.github.io/flowingai/
```

**示例**：
- 如果用户名是 `bob123`，网站地址就是：
  ```
  https://bob123.github.io/flowingai/
  ```

### 首次访问注意

- 可能需要等待 1-2 分钟让部署生效
- 如果显示 404，稍等片刻再刷新

---

## 🎉 完成！

现在你的网站已经：
- ✅ 部署到 GitHub Pages
- ✅ 每 4 小时自动更新 AI 动态
- ✅ 可以通过网址访问

### 后续更新

**自动更新**：网站会在北京时间以下时间自动更新：
- 8:00, 12:00, 16:00, 20:00, 0:00, 4:00

**手动更新**：
1. 打开 GitHub 仓库
2. 点击 **Actions** 标签
3. 点击 **"更新AI动态"** → **Run workflow**

---

## ❓ 遇到问题？

### 推送失败 "Authentication failed"
→ 检查是否使用了正确的 Personal Access Token

### 网站显示 404
→ 等待 1-2 分钟，或者检查 GitHub Pages 设置是否启用

### Actions 运行失败
→ 检查 ZHIPU_API_KEY 是否正确配置
→ 查看 Actions 日志找到错误信息

### 找不到 Pages 设置
→ 确认仓库是 **Public** 而不是 Private

---

**需要更多帮助？** 查看 [docs/DEPLOY.md](DEPLOY.md) 获取更详细的说明。
