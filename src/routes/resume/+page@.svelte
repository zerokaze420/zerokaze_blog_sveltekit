<script lang="ts">
  // Define all necessary TypeScript interfaces
  interface Contact {
    email: string;
    phone?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  }

  interface Experience {
    title: string;
    company: string;
    startDate: string;
    endDate: string;
    description: string[];
  }

  interface Education {
    degree: string;
    institution: string;
    startDate: string;
    endDate: string;
    details?: string[];
  }

  interface Skill {
    name: string;
    level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  }

  interface SkillCategory {
    category: string;
    skills: Skill[];
  }

  interface ResumeData {
    name: string;
    title: string;
    contact: Contact;
    summary: string;
    experience: Experience[];
    education: Education[];
    skills: SkillCategory[];
    projects?: Experience[]; // Reuse Experience interface for personal projects
    openSourceContributions?: Experience[]; // New: for open source contributions
  }

  // Your resume data (modify with your real information here)
  const resumeData: ResumeData = {
    name: "洪华俊",
    title: "运维开发 & 系统测试",
    contact: {
   email: "erfu81856@gmail.com",
   phone: "+86 18062072170",
   github: "github.com/zerokaze420",
    },
    summary: "一位充满热情的开发者, 6年 Linux 日常使用经验, 精通 Arch Linux , Gentoo, NixOS 等发行版下的开发、编程与测试脚本. 熟练编写 Shell 脚本, Python 脚本。熟悉 Vue, Next.js, Svelte等前端框架基础 , 对 Linux 以及操作系统有强烈兴趣。熟练编写 Github CI-CD 脚本 , 并利用 GitHub Actions 实现CI-CD。",
    experience: [
   {
     title: "RISC-V 系统测试实习生",
     company: "中科院软件所编程语言与编译技术实验室 RevyOS 小队",
     startDate: "2025年8月",
     endDate: "至今",
     description: [
    "负责 RevyOS 在 RISC-V 架构下的功能、性能及兼容性测试。",
    "参与自动化测试框架的搭建与维护，编写自动化测试脚本以提升测试效率。",
    "定位、报告并跟踪软件缺陷，与开发团队协作解决问题。",
     ]
   },
   {
     title: "运维+开发",
     company: "字节筑梦",
     startDate: "2025年6月",
     endDate: "至今",
     description: [
    "搭建后端项目 CI-CD 流程, push 后通过 semantic-release 自动确认版本发布 release 和 package。",
    "利用 GitHub Actions 和 Podman 实现持续集成/部署及告警集成, 编译构建后发布到 Podman 容器中运行，并通过飞书 webhook 和邮件进行失败告警。",
    "通过 Nix 优化CI-CD , 确保构建可复现并解决环境依赖问题。",
    "优化和维护基于 .NET ASP 的后端项目，通过优化字段与压缩请求减少了约30%的带宽。"
     ]
   },
    ],
    education: [
   {
     degree: "专科, 计算机应用",
     institution: "武汉职业技术大学",
     startDate: "2023年9月",

     endDate: "2026年6月"
   },
    ],
    skills: [
        { category: "工具与平台", skills: [{ name: "Git" }, { name: "Linux" }, { name: "Docker & Podman" }, { name: "Makefile" }, { name: "Nix & NixOS" }, { name: "GitHub Actions" }] },
        { category: "编程语言", skills: [{ name: "Go" }, { name: "Python" }, { name: "Shell Script" }, { name: "C++" }, { name: "Java" }, { name: "Rust (基础)" }] },
        { category: "前端技术", skills: [{ name: "Svelte" }, { name: "TypeScript" }, { name: "JavaScript (ES6+)" }, { name: "HTML5/CSS3" }, { name: "React / Vue (基础)" }] },
        { category: "后端技术", skills: [{ name: "Node.js" }, { name: ".NET (基础)" }] }
    ],
    projects: [
   {
     title: "Lychee运维工具",
     company: "个人项目",
     startDate: "2025年5月",
     endDate: "至今",
     description: [
    "基于Golang开发动态服务健康监测工具，集成CI/CD部署与系统监控功能，实现对Systemd服务的监控并通过正则表达式过滤日志发送到飞书。",
     ]
   },
   {
     title: "个人博客网站",
     company: "个人项目",
     startDate: "2025年3月",
     endDate: "2025年5月",
     description: [
    "使用 Svelte/TypeScript 构建响应式个人网站，集成动态 CMS 并通过 GitHub Actions 实现 CI-CD。",
     ]
   }
    ],
    openSourceContributions: [
   {
     title: "NIXOS-CN 文档修复",
     company: "NIXCN",
     startDate: "2024年1月",
     endDate: "2024年1月",
     description: [
    "维护更新 NIXOS-CN 陈旧页面, 修复了关于安装的错误信息 (PR: github.com/NixOS-CN/nixos-cn.github.io/pull/37)。",
     ]
   },
   {
     title: "HaikuOS 国际化",
     company: "HaikuOS",
     startDate: "2024年7月",
     endDate: "2024年10月",
     description: [
    "参与 HaikuOS 操作系统界面的简体中文翻译工作。",
     ]
   }
    ]
  };
</script>

<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; max-width: 8.5in; margin: auto; color: #000; font-size: 10.5pt; line-height: 1.3;">
  
  <header style="text-align: center; margin-bottom: 16px; border-bottom: 1px solid #ccc; padding-bottom: 12px;">
    <h1 style="margin: 0; font-size: 24pt; letter-spacing: 2px;">
      {resumeData.name}
    </h1>
    {#if resumeData.title}
    <h2 style="margin: 4px 0; font-size: 12pt; font-weight: normal;">
      {resumeData.title}
    </h2>
    {/if}
    <div style="font-size: 10pt; margin-top: 8px;">
      <span style="margin: 0 6px;">{resumeData.contact.email}</span>
      {#if resumeData.contact.phone}
        <span style="margin: 0 6px;">| {resumeData.contact.phone}</span>
      {/if}
      {#if resumeData.contact.github}
        <span style="margin: 0 6px;">| {resumeData.contact.github}</span>
      {/if}
    </div>
  </header>

  <section style="margin-bottom: 12px;">
    <h3 style="font-size: 11pt; border-bottom: 1px solid #333; padding-bottom: 2px; margin: 0 0 8px 0; text-transform: uppercase;">
      个人总结
    </h3>
    <p style="margin: 0;">{resumeData.summary}</p>
  </section>

  <section style="margin-bottom: 12px;">
    <h3 style="font-size: 11pt; border-bottom: 1px solid #333; padding-bottom: 2px; margin: 0 0 8px 0; text-transform: uppercase;">
      实习经历
    </h3>
    {#each resumeData.experience as exp}
      <div style="margin-bottom: 10px;">
        <div style="display: flex; justify-content: space-between;">
          <h4 style="margin: 0; font-size: 11pt;">
            {exp.title} <span style="font-weight: normal;">@</span> <span style="font-weight: bold;">{exp.company}</span>
          </h4>
          <p style="margin: 0; font-size: 10pt;">{exp.startDate} - {exp.endDate}</p>
        </div>
        <ul style="margin: 4px 0 0 0; padding-left: 20px; list-style-type: disc;">
          {#each exp.description as item}
            <li style="margin-bottom: 2px;">{item}</li>
          {/each}
        </ul>
      </div>
    {/each}
  </section>
  
  {#if resumeData.projects && resumeData.projects.length > 0}
    <section style="margin-bottom: 12px;">
      <h3 style="font-size: 11pt; border-bottom: 1px solid #333; padding-bottom: 2px; margin: 0 0 8px 0; text-transform: uppercase;">
        个人项目
      </h3>
      {#each resumeData.projects as project}
        <div style="margin-bottom: 10px;">
          <div style="display: flex; justify-content: space-between;">
            <h4 style="margin: 0; font-size: 11pt; font-weight: bold;">
              {project.title}
            </h4>
             <p style="margin: 0; font-size: 10pt;">{project.startDate} - {project.endDate}</p>
          </div>
          <ul style="margin: 4px 0 0 0; padding-left: 20px; list-style-type: disc;">
            {#each project.description as item}
              <li style="margin-bottom: 2px;">{item}</li>
            {/each}
          </ul>
        </div>
      {/each}
    </section>
  {/if}
  
  {#if resumeData.openSourceContributions && resumeData.openSourceContributions.length > 0}
    <section style="margin-bottom: 12px;">
       <h3 style="font-size: 11pt; border-bottom: 1px solid #333; padding-bottom: 2px; margin: 0 0 8px 0; text-transform: uppercase;">
        开源贡献
      </h3>
      {#each resumeData.openSourceContributions as contribution}
        <div style="margin-bottom: 10px;">
          <div style="display: flex; justify-content: space-between;">
            <h4 style="margin: 0; font-size: 11pt;">
               {contribution.title} <span style="font-weight: normal;">@</span> <span style="font-weight: bold;">{contribution.company}</span>
            </h4>
            <p style="margin: 0; font-size: 10pt;">{contribution.startDate} - {contribution.endDate}</p>
          </div>
          <ul style="margin: 4px 0 0 0; padding-left: 20px; list-style-type: disc;">
            {#each contribution.description as item}
              <li style="margin-bottom: 2px;">{item}</li>
            {/each}
          </ul>
        </div>
      {/each}
    </section>
  {/if}

  <section style="margin-bottom: 12px;">
    <h3 style="font-size: 11pt; border-bottom: 1px solid #333; padding-bottom: 2px; margin: 0 0 8px 0; text-transform: uppercase;">
      技能
    </h3>
    <div style="font-size: 10.5pt;">
    {#each resumeData.skills as skillCat, i}
      <p style="margin: 0 0 2px 0;">
        <span style="font-weight: bold;">{skillCat.category}:</span>
        {skillCat.skills.map(s => s.name).join(', ')}
      </p>
    {/each}
    </div>
  </section>

  <section>
    <h3 style="font-size: 11pt; border-bottom: 1px solid #333; padding-bottom: 2px; margin: 0 0 8px 0; text-transform: uppercase;">
      教育背景
    </h3>
    {#each resumeData.education as edu}
      <div>
        <div style="display: flex; justify-content: space-between;">
          <h4 style="margin: 0; font-size: 11pt; font-weight: bold;">{edu.institution}</h4>
          <p style="margin: 0;">{edu.startDate} - {edu.endDate}</p>
        </div>
        <p style="margin: 2px 0 0 0;">{edu.degree}</p>
      </div>
    {/each}
  </section>

</div>