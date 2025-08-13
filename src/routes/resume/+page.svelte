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
    title: "",
    contact: {
      email: "erfu81856@gmail.com",
      phone: "+86 18062072170", // Taiwan contact example
      github: "github.com/zerokaze420",
    //   website: "yourwebsite.com"
    },
    // 精简总结，控制在2-3行
    summary: "一位充满热情的开发者, 6年 Linux 日常使用经验, 精通 Arch Linux , Gentoo, NixOS 等发行版下的开发、编程与测试脚本. 熟练编写 Shell 脚本, Python 脚本。熟悉 Vue, Next.js, Svelte等前端框架基础 , 对 Linux 以及操作系统有强烈兴趣。熟练编写 github ci-cd 脚本 , 并利用 GitHub Actions 实现CI-CD。",
    experience: [
      {
        title: "运维",
        company: "开放原子工作室",
        startDate: "2022年1月",
        endDate: "至今",
        description: [
          // 精简描述
          "搭建后端项目 CI-CD 流程, push 后通过 semantic-release 自动确认版本发布 release 和 package。",
          "利用 GitHub Actions 和 Podman 实现持续集成/部署及告警集成,到服务器上进行编译构建发布到 Podman 容器中运行。当构建失败后通过飞书 webhook 和 github email 进行告警，以及说明日志。",
          "通过Nix优化CI-CD , 确保构建可复现并解决环境依赖问题。",
        ]
      }
    ],
    education: [
      {
        degree: "专科，武汉职业技术大学",
        institution: "武汉职业技术大学",
        startDate: "2023年9月",
        endDate: "2026年6月"
      },

    ],
    skills: [
      {
        category: "工具与平台",
        skills: [
          { name: "Git" },
          { name: "LINUX" },
          { name: "Docker|podman" },
          { name: "Makefile" },
          { name: "NIX (基础)" },
          { name: "NixOS" },
          { name: "github" },
        ]
      },
      {
        category: "编程语言",
        skills: [
          { name: "Go" },
          { name: "C++" },
          { name: "Python" },
          { name: "Java" }
      ]
      },
      {
        category: "前端技术",
        skills: [
          { name: "Svelte" },
          { name: "TypeScript" },
          { name: "JavaScript (ES6+)" },
          { name: "HTML5" },
          { name: "CSS3 / SCSS" },
          { name: "React / Vue (基础)" }
        ]
      },
      {
        category: "后端技术",
        skills: [
          { name: "Node.js" },
        ]
      },
      
    ],
    projects: [
           {
        title: "Lychee运维工具",
        company: "个人项目",
        startDate: "2025年5月",
        endDate: "-",
        description: [
          // 精简描述
          "基于Golang实现动态服务运行状况检测工具。,是一款集成了 CI/CD 部署、系统监控 的监控程序实现对Systemd服务的监控, 通过正则表达式将日志过滤发送到飞书。",
        ]
      },

      {
        title: "个人博客网站",
        company: "个人项目",
        startDate: "2023年3月",
        endDate: "2023年5月",
        description: [
          // 精简描述
          "使用 Svelte/TypeScript 构建响应式个人作品集网站。",
          "集成动态 CMS 并部署于 GitHub Actions, 实现 CI-CD。",
        ]
      }
    ],
    openSourceContributions: [
      {
        title: "NIXOSCN 文档修复",
        company: "NIXCN",
        startDate: "2024年1月",
        endDate: "至今",
        description: [
          // 精简描述
          "维护更新NIXOSCN陈旧页面, 修复了关于安装的错误信息。",
          "PR链接: https://github.com/NixOS-CN/nixos-cn.github.io/pull/37",
        ]
      },
      {
        title: "HaikuOS 翻译",
        company: "HaikuOS",
        startDate: "2023年7月",
        endDate: "2023年10月",
        description: [
          // 精简描述
          "参与 HaikuOS 国际化翻译工作。",
          "个人贡献链接: https://i18n.haiku-os.org/pootle/user/Honghuajun/",
        ]
      }
    ]
  };
</script>

<main class="font-serif max-w-5xl mx-auto my-3 px-6 py-6 shadow-lg bg-white leading-tight text-gray-800 rounded-md">
  <header class="text-center mb-6 pb-3 border-b border-gray-300">
    <h1 class="m-0 text-gray-800 text-2xl uppercase tracking-wide">
      {resumeData.name}
    </h1>
    <h2 class="mt-0.5 mb-2 text-md text-gray-700 font-normal">
      {resumeData.title}
    </h2>
    <div class="text-xs text-gray-600 mt-2">
      <span class="mx-1.5">邮箱: <a href="mailto:{resumeData.contact.email}" class="text-blue-700 no-underline hover:underline">{resumeData.contact.email}</a></span>
      {#if resumeData.contact.phone}
        <span class="mx-1.5"> | 电话: {resumeData.contact.phone}</span>
      {/if}
      {#if resumeData.contact.linkedin}
        <span class="mx-1.5"> |领英: <a href="https://{resumeData.contact.linkedin}" target="_blank" rel="noopener noreferrer" class="text-blue-700 no-underline hover:underline">{resumeData.contact.linkedin}</a></span>
      {/if}
      {#if resumeData.contact.github}
        <span class="mx-1.5"> | GitHub: <a href="https://{resumeData.contact.github}" target="_blank" rel="noopener noreferrer" class="text-blue-700 no-underline hover:underline">{resumeData.contact.github}</a></span>
      {/if}
      {#if resumeData.contact.website}
        <span class="mx-1.5"> | 网站: <a href="https://{resumeData.contact.website}" target="_blank" rel="noopener noreferrer" class="text-blue-700 no-underline hover:underline">{resumeData.contact.website}</a></span>
      {/if}
    </div>
  </header>

  <section class="mb-5">
    <h3 class="text-blue-700 border-b border-gray-300 pb-1 mb-3 text-lg uppercase tracking-tight">
      个人总结
    </h3>
    <p class="mb-1 text-sm leading-snug">{resumeData.summary}</p>
  </section>

  <section class="mb-5">
    <h3 class="text-blue-700 border-b border-gray-300 pb-1 mb-3 text-lg uppercase tracking-tight">
      实习经历
    </h3>
    {#each resumeData.experience as exp}
      <div class="mb-3">
        <h4 class="m-0 mb-0.5 text-gray-800 text-md">
          {exp.title} <span class="font-bold">@ {exp.company}</span>
        </h4>
        <p class="text-gray-600 mb-0.5 text-xs">{exp.startDate} - {exp.endDate}</p>
        <ul class="ml-4 list-disc list-outside text-sm leading-snug">
          {#each exp.description as item}
            <li class="mb-0.5 text-gray-700">{item}</li>
          {/each}
        </ul>
      </div>
    {/each}
  </section>

  <section class="mb-5">
    <h3 class="text-blue-700 border-b border-gray-300 pb-1 mb-3 text-lg uppercase tracking-tight">
      教育背景
    </h3>
    {#each resumeData.education as edu}
      <div class="mb-3">
        <h4 class="m-0 mb-0.5 text-gray-800 text-md">{edu.degree}</h4>
        <p class="text-gray-700 mb-0.5 text-xs">{edu.institution}</p>
        <p class="text-gray-600 mb-0.5 text-xs">{edu.startDate} - {edu.endDate}</p>
        {#if edu.details && edu.details.length > 0}
          <ul class="ml-4 list-disc list-outside text-sm leading-snug">
            {#each edu.details as item}
              <li class="mb-0.5 text-gray-700">{item}</li>
            {/each}
          </ul>
        {/if}
      </div>
    {/each}
  </section>

  <section class="mb-5">
    <h3 class="text-blue-700 border-b border-gray-300 pb-1 mb-3 text-lg uppercase tracking-tight">
      技能
    </h3>
    {#each resumeData.skills as skillCat}
      <div class="mb-1">
        <h5 class="m-0 mb-0.5 text-gray-700 text-sm font-bold">
          {skillCat.category}
        </h5>
        <ul class="flex flex-wrap p-0 m-0 list-none">
          {#each skillCat.skills as skill}
            <li class="bg-blue-50 px-1 py-0.5 mr-0.5 mb-0.5 rounded text-xs text-blue-800 border border-blue-200">
              {skill.name}
            </li>
          {/each}
        </ul>
      </div>
    {/each}
  </section>

  {#if resumeData.projects && resumeData.projects.length > 0}
    <section class="mb-5">
      <h3 class="text-blue-700 border-b border-gray-300 pb-1 mb-3 text-lg uppercase tracking-tight">
        个人项目
      </h3>
      {#each resumeData.projects as project}
        <div class="mb-3">
          <h4 class="m-0 mb-0.5 text-gray-800 text-md">
            {project.title} <span class="font-bold">@ {project.company}</span>
          </h4>
          <p class="text-gray-600 mb-0.5 text-xs">{project.startDate} - {project.endDate}</p>
          <ul class="ml-4 list-disc list-outside text-sm leading-snug">
            {#each project.description as item}
              <li class="mb-0.5 text-gray-700">{item}</li>
            {/each}
          </ul>
        </div>
      {/each}
    </section>
  {/if}

  {#if resumeData.openSourceContributions && resumeData.openSourceContributions.length > 0}
    <section class="mb-5">
      <h3 class="text-blue-700 border-b border-gray-300 pb-1 mb-3 text-lg uppercase tracking-tight">
        开源贡献
      </h3>
      {#each resumeData.openSourceContributions as contribution}
        <div class="mb-3">
          <h4 class="m-0 mb-0.5 text-gray-800 text-md">
            {contribution.title} <span class="font-bold">@ {contribution.company}</span>
          </h4>
          <p class="text-gray-600 mb-0.5 text-xs">{contribution.startDate} - {contribution.endDate}</p>
          <ul class="ml-4 list-disc list-outside text-sm leading-snug">
            {#each contribution.description as item}
              <li class="mb-0.5 text-gray-700">{item}</li>
            {/each}
          </ul>
        </div>
      {/each}
    </section>
  {/if}
</main>