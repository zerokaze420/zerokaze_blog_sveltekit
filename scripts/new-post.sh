#!/usr/bin/env bash
#
# new-post.sh - 新建博客文章脚手架
#
# 用法:
#   ./scripts/new-post.sh
#   ./scripts/new-post.sh "文章标题"
#
# 示例:
#   ./scripts/new-post.sh "我的新文章"
#   这将创建 src/lib/posts/my-new-article.md

set -euo pipefail

# 项目根目录
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
POSTS_DIR="$PROJECT_ROOT/src/lib/posts"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}    📝 Zerokaze Blog - 新建文章        ${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# 获取标题
TITLE="${1:-}"
if [ -z "$TITLE" ]; then
  read -r -p "请输入文章标题: " TITLE
fi

if [ -z "$TITLE" ]; then
  echo -e "${RED}错误: 标题不能为空${NC}"
  exit 1
fi

# 生成 slug（从标题拼音/英文生成，非中文则直接转换）
# 中文标题使用日期作为 slug 的一部分
SLUG=$(echo "$TITLE" \
  | tr '[:upper:]' '[:lower:]' \
  | sed 's/[^a-z0-9一-龥]/-/g' \
  | sed 's/--*/-/g' \
  | sed 's/^-//;s/-$//')

# 如果 slug 只包含中文和横杠，则使用日期+哈希
if echo "$SLUG" | grep -qP '^[\xe4-\xe9][\x80-\xbf]+'; then
  SLUG="post-$(date +%Y%m%d)-$(openssl rand -hex 3)"
fi

# 获取描述
read -r -p "请输入文章描述: " DESCRIPTION
if [ -z "$DESCRIPTION" ]; then
  DESCRIPTION="这是文章「${TITLE}」的描述"
fi

# 获取标签
read -r -p "请输入标签（逗号分隔，例如: Svelte, CSS, Linux）: " TAGS_INPUT
TAGS_ARRAY=()
if [ -n "$TAGS_INPUT" ]; then
  IFS=',' read -ra TAGS_ARRAY <<< "$TAGS_INPUT"
  # 去除空格
  for i in "${!TAGS_ARRAY[@]}"; do
    TAGS_ARRAY[$i]=$(echo "${TAGS_ARRAY[$i]}" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
  done
fi

# 获取作者
read -r -p "请输入作者（默认: Zerokaze）: " AUTHOR
if [ -z "$AUTHOR" ]; then
  AUTHOR="Zerokaze"
fi

# 日期
PUBLISH_DATE=$(date +%Y-%m-%d)

# 文件路径
FILE_PATH="$POSTS_DIR/$SLUG.md"

# 检查文件是否已存在
if [ -f "$FILE_PATH" ]; then
  echo -e "${YELLOW}警告: 文件已存在: $FILE_PATH${NC}"
  read -r -p "是否覆盖? (y/N): " CONFIRM
  if [ "$CONFIRM" != "y" ] && [ "$CONFIRM" != "Y" ]; then
    echo -e "${RED}已取消${NC}"
    exit 1
  fi
fi

# 构建标签 YAML
TAGS_YAML=""
if [ ${#TAGS_ARRAY[@]} -gt 0 ]; then
  TAGS_YAML="tags: ["
  for i in "${!TAGS_ARRAY[@]}"; do
    if [ $i -gt 0 ]; then
      TAGS_YAML+=", "
    fi
    TAGS_YAML+="\"${TAGS_ARRAY[$i]}\""
  done
  TAGS_YAML+="]"
fi

# 写入文件
cat > "$FILE_PATH" << EOF
---
title: "${TITLE}"
publishDate: "${PUBLISH_DATE}"
author: "${AUTHOR}"
description: "${DESCRIPTION}"
${TAGS_YAML}
---

# ${TITLE}

欢迎阅读我的新文章！

在这里撰写你的内容...

## 开始写作

你可以使用所有的标准 Markdown 语法：

- **粗体** 和 *斜体*
- `行内代码`
- 代码块：

\`\`\`typescript
const greeting: string = "Hello, World!";
console.log(greeting);
\`\`\`

> 这是一段引用文本

也可以嵌入 Svelte 组件：

<script lang="ts">
  // import YourComponent from '\$lib/components/YourComponent.svelte';
</script>

<!-- <YourComponent /> -->

---

*Happy Coding! 🚀*
EOF

echo ""
echo -e "${GREEN}✅ 文章创建成功!${NC}"
echo -e "   标题: ${BLUE}${TITLE}${NC}"
echo -e "   文件: ${BLUE}${FILE_PATH}${NC}"
echo -e "   日期: ${BLUE}${PUBLISH_DATE}${NC}"
echo -e "   作者: ${BLUE}${AUTHOR}${NC}"
if [ ${#TAGS_ARRAY[@]} -gt 0 ]; then
  echo -e "   标签: ${BLUE}${TAGS_ARRAY[*]}${NC}"
fi
echo ""
echo -e "${GREEN}现在可以开始编辑 ${FILE_PATH} 来撰写内容了！${NC}"
