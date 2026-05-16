# STARTRADER AI Pioneer Program — 项目规格文档

> 本文档汇总了 STARTRADER AI Pioneer Program 报名与推广网页的完整产品规格、技术方案与数据结构。

---

## 1. 项目概述

| 属性 | 内容 |
|------|------|
| **项目名称** | STARTRADER AI Pioneer Program |
| **目标用户** | STARTRADER 内部员工 |
| **核心目的** | 招募员工参与 2 个月企业级 AI 账户学习与实践计划，通过评估选拔优秀 AI 使用者，颁发 **AI Leadership Pioneer Award** |
| **页面类型** | 单页推广 + 报名表单（Landing Page with Application Form） |
| **技术栈** | TanStack Start (React 19) + Tailwind CSS v4 + shadcn/ui + Supabase |

### 品牌定位
- **英文标语**: "Learn Faster. Think Bigger. Build Smarter."
- **核心价值**: 培养未来就绪的员工、AI 增强型团队、内部创新者、AI-first 组织文化

---

## 2. 页面结构与内容模块

页面为单页应用，包含以下 7 个核心区块：

### 2.1 Hero 区块
- **标题**: STARTRADER AI Pioneer Program
- **副标题**: Learn Faster. Think Bigger. Build Smarter.  A 2-month enterprise AI sandbox for STARTRADER's most curious minds — top performers earn the AI Leadership Award.
- **CTA**: Apply to the Program（滚动至表单）
- **三栏数据展示**:
  - 2 mo — Enterprise AI Access
  - 30 — Assessment Questions
  - 1 — AI Leadership Award

### 2.2 Who we're looking for（Pillars）
展示项目寻找的 5 类特质：
1. Curiosity about AI — 对 AI 的好奇心
2. Strong learning motivation — 强烈的自我驱动学习意愿
3. Innovation mindset — 创新思维，重构工作流程
4. Willingness to explore — 愿意测试、分享、迭代
5. Transformation potential — 帮助塑造 STARTRADER 的 AI-first 未来

### 2.3 What selected participants get（Offer）
入选者可获得：
- Company-sponsored AI model accounts
- Access to advanced AI tools
- Internal AI training resources
- Opportunities to join future AI projects

### 2.4 The Pioneer Journey（流程）
7 步流程：
1. Application & Assessment
2. Selected Candidates
3. AI Account Access Granted
4. 2-Month Exploration Phase
5. AI Use Case Submission
6. AI Champion Selection
7. Advanced Internal AI Projects

### 2.5 Judging Panel（评委）
- **评审组长**: Peter
- **评审团队**: STARTRADER AI 专家团队
- **评审维度与权重**:
  - Learning Initiative — 30%
  - AI Understanding — 20%
  - Business Application — 30%
  - Collaboration & Sharing — 20%

### 2.6 AI Leadership Awards（奖项）
- 优秀参与者将被选为 STARTRADER 首批 **AI Champions**
- 加入未来高级内部 AI 项目
- 塑造公司 AI-first 文化

### 2.7 Application Form（报名表单）
核心功能区，包含：
- 用户信息采集
- 30 题 AI 评估问卷
- 进度追踪与提交

---

## 3. 问卷设计（30 题）

问卷分为 **3 个 Section**，总计 30 题，预计耗时 30–40 分钟：

| Section | 主题 | 题数 | 题型 |
|---------|------|------|------|
| SECTION 1 | AI Fundamentals | 10 题 | 单选题 |
| SECTION 2 | AI Application & Business Thinking | 10 题 | 单选题 |
| SECTION 3 | Learning Motivation & Growth Potential | 10 题 | 单选题 + 开放题 |

### 题型说明
- **MC（单选题）**: A/B/C/D 四选一（部分题目含 E/F 选项）
- **Open（开放题）**: 自由文本输入，max 2000 字符

### 开放题列表（共 4 题）
| 题号 | 问题 |
|------|------|
| Q22 | What area of your work would you most like AI to improve? |
| Q25 | What do you think is the biggest risk or challenge of AI adoption? |
| Q27 | If AI could save you 1 hour every day, how would you use that extra time? |
| Q30 | Why would you like to join the STARTRADER AI Pioneer Program? |

---

## 4. 数据库设计

### 4.1 表结构

```sql
CREATE TABLE public.applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,           -- 申请人姓名
  phone TEXT NOT NULL,          -- 联系电话
  company_email TEXT NOT NULL,  -- 公司邮箱
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,  -- 30 题答案
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 4.2 RLS 策略

| 操作 | 权限 | 说明 |
|------|------|------|
| INSERT | anon, authenticated | 任何人（无需登录）可提交申请 |
| SELECT | authenticated | 仅认证用户可查看申请数据 |

---

## 5. 前端技术实现

### 5.1 技术栈

| 层 | 技术 |
|----|------|
| 框架 | TanStack Start v1 (React 19, SSR/SSG) |
| 构建工具 | Vite 7 |
| 样式 | Tailwind CSS v4 (native CSS @import + theme variables) |
| UI 组件 | shadcn/ui (Button, Input, Card, Progress, RadioGroup, Textarea, Label, Sonner) |
| 状态管理 | React useState/useMemo |
| 表单验证 | Zod |
| 数据库客户端 | Supabase JS SDK |
| 通知 | Sonner toast |

### 5.2 关键组件

| 组件 | 文件 | 职责 |
|------|------|------|
| LandingPage | `src/routes/index.tsx` | 页面主组件，组合所有区块 |
| Hero | `src/routes/index.tsx` | 首屏展示与 CTA |
| Pillars | `src/routes/index.tsx` | 5 项特质卡片 |
| Offer | `src/routes/index.tsx` | 入选福利列表 |
| Journey | `src/routes/index.tsx` | 7 步流程时间线 |
| Judges | `src/routes/index.tsx` | 评审介绍与权重 |
| Awards | `src/routes/index.tsx` | 奖项与二次 CTA |
| ApplicationForm | `src/routes/index.tsx` | 表单与问卷逻辑 |

### 5.3 表单功能细节

- **进度追踪**: 顶部 sticky progress bar，实时显示完成百分比
- **分组展示**: 按 Section 分组展示题目
- **验证逻辑**:
  - 姓名、电话、公司邮箱必填（Zod 校验）
  - 公司邮箱需为有效 email 格式
  - 30 题全部回答后方可提交
  - 未答完题目自动 scroll 到第一题位置
- **提交行为**:
  - 数据写入 Supabase `applications` 表
  - 成功后展示感谢页面，提示评审将由 Peter 带领的评委组审核
- **用户体验**:
  - 单选题使用 radio card（带边框 hover 效果）
  - 开放题使用 textarea（4 行，max 2000 字符）
  - 提交按钮 loading 状态
  - 错误提示通过 Sonner toast

---

## 6. 路由结构

```
/                    → 首页（Landing Page + Application Form）
```

项目为单页应用，所有内容集中在 `/` 路由。

---

## 7. SEO & 元数据

```
Title:       STARTRADER AI Pioneer Program — Apply Now
Description: Join the STARTRADER AI Pioneer Program. 2-month enterprise AI accounts, training, and AI Leadership Awards for top performers.
OG Title:    STARTRADER AI Pioneer Program
OG Desc:     Apply for 2 months of enterprise AI access, hands-on learning, and a chance to win the AI Leadership Award.
Twitter:     summary card
```

---

## 8. 数据流

```
用户填写表单 → 前端 Zod 验证 → Supabase INSERT → applications 表
                                     ↓
                              成功: Toast 成功 + 感谢页面
                              失败: Toast 错误提示
```

---

## 9. 文件清单

### 核心文件

| 文件 | 说明 |
|------|------|
| `src/routes/index.tsx` | 首页组件（完整 Landing + Form） |
| `src/routes/__root.tsx` | 根布局（SEO meta + QueryClientProvider + Sonner Toaster） |
| `src/router.tsx` | TanStack Router 配置 |
| `src/data/questions.ts` | 30 题问卷数据定义 |
| `src/styles.css` | Tailwind CSS v4 主题变量与设计系统 |

### 数据库文件

| 文件 | 说明 |
|------|------|
| `supabase/migrations/20260516*.sql` | applications 表 + RLS 策略 |

---

## 10. 后续扩展建议

1. **管理后台**: 新增 `/admin` 路由，使用 `requireSupabaseAuth` 中间件保护，展示所有申请数据表格
2. **答案评分**: 对 26 道 MC 题自动评分，开放题人工评审
3. **邮件通知**: 入选/落选自动发送邮件通知（使用公司邮箱）
4. **多语言支持**: 当前为全英文，可扩展中文版本
5. **导出功能**: 管理后台支持 CSV 导出申请数据

---

*文档生成时间: 2026-05-16*
*对应项目版本: 初始 MVP 版本*
