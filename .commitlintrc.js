const { execSync } = require('child_process')
const fg = require('fast-glob')

const getPackages = (packagePath) => fg.sync('*', { cwd: packagePath, onlyDirectories: true })

const scopes = [
  ...getPackages('apps'),
  ...getPackages('packages'),
  'docs',
  'project',
  'core',
  'ci',
  'dev',
  'deploy',
  'other'
]

const gitStatus = execSync('git status --porcelain || true').toString().trim().split('\n')

const scopeEnum = gitStatus
  .find((r) => ~r.indexOf('M  packages'))
  ?.replace(/\//g, '%%')
  ?.match(/packages%%((\w|-)*)/)?.[1]

const subjectEnum = gitStatus
  .find((r) => ~r.indexOf('M  packages'))
  ?.replace(/\//g, '%%')
  ?.match(/packages%%((\w|-)*)/)?.[1]

/** @type {import('cz-git').UserConfig} */
module.exports = {
  rules: {
    // @see: https://commitlint.js.org/#/reference-rules
    'scope-enum': [2, 'always', scopes],
    'body-leading-blank': [1, 'always'],
    'footer-leading-blank': [1, 'always'],
    'header-max-length': [2, 'always', 72],
    'scope-case': [2, 'always', 'lower-case'],
    'subject-case': [1, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'type-enum': [
      2,
      'always',
      [
        'init',
        'build',
        'chore',
        'ci',
        'docs',
        'feat',
        'fix',
        'perf',
        'refactor',
        'revert',
        'release',
        'style',
        'test',
        'config'
      ]
    ]
  },
  prompt: {
    alias: { fd: 'docs: fix typos' },
    messages: {
      type: '选择你要提交的类型 | Select the type of change that you committing:\n',
      scope: '选择一个提交范围（可选）| Denote the SCOPE of this change (optional):\n',
      customScope: '请输入自定义的提交范围 | Denote the SCOPE of this change:\n',
      subject:
        '填写简短精炼的变更描述 | Write a SHORT, IMPERATIVE tense description of the change:\n',
      body: '填写更加详细的变更描述（可选）。使用 "|" 换行 | Provide a LONGER description of the change (optional). Use "|" to break new line:\n',
      breaking:
        '列举非兼容性重大的变更（可选）。使用 "|" 换行 | List any BREAKING CHANGES (optional). Use "|" to break new line:\n',
      footerPrefixesSelect:
        '选择关联issue前缀（可选）| Select the ISSUES type of changeList by this change (optional):\n',
      customFooterPrefix: '输入自定义issue前缀 | Input ISSUES prefix:\n',
      footer:
        '列举关联issue (可选) 例如: #31, #I3244 | List any ISSUES by this change. E.g.: #31, #I3244:\n',
      confirmCommit:
        '是否提交或修改commit? | Are you sure you want to proceed with the commit above?\n'
    },
    types: [
      {
        value: 'init',
        name: 'init:     🎉 初次提交 | Initial Submission',
        emoji: ':tada:'
      },
      {
        value: 'feat',
        name: 'feat:     ✨ 新增功能 | A new feature',
        emoji: ':sparkles:'
      },
      {
        value: 'fix',
        name: 'fix:      🐛 修复缺陷 | A bug fix',
        emoji: ':bug:'
      },
      {
        value: 'docs',
        name: 'docs:     📝 文档更新 | Documentation only changes',
        emoji: ':memo:'
      },
      {
        value: 'style',
        name: 'style:    💄 代码格式 | Changes that do not affect the meaning of the code',
        emoji: ':lipstick:'
      },
      {
        value: 'refactor',
        name: 'refactor: ♻️ 代码重构 | A code change that neither fixes a bug nor adds a feature',
        emoji: ':recycle:'
      },
      {
        value: 'perf',
        name: 'perf:     🐎 性能提升 | A code change that improves performance',
        emoji: ':racehorse:'
      },
      {
        value: 'test',
        name: 'test:     ✅ 测试相关 | Adding missing tests or correcting existing tests',
        emoji: ':white_check_mark:'
      },
      {
        value: 'build',
        name: 'build:    📦️ 构建相关 | Changes that affect the build system or external dependencies',
        emoji: ':package:'
      },
      {
        value: 'ci',
        name: 'ci:       🎡 持续集成 | Changes to our CI configuration files and scripts',
        emoji: ':ferris_wheel:'
      },
      {
        value: 'config',
        name: 'config:   🔧 配置文件 | Change our configuration files and scripts',
        emoji: ':wrench:'
      },
      {
        value: 'revert',
        name: 'revert:   ⏪️ 回退代码 | Revert to a commit',
        emoji: ':rewind:'
      },
      {
        value: 'chore',
        name: 'chore:    🔨 其他修改 | Other changes that do not modify src or test files',
        emoji: ':hammer:'
      }
    ],
    defaultScope: scopeEnum,
    customScopesAlign: !scopeEnum ? 'top' : 'bottom',
    defaultSubject: subjectEnum && `[${subjectEnum}] `,
    allowCustomIssuePrefix: false,
    allowEmptyIssuePrefix: false
  }
}
