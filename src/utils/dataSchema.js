// Data field schemas for each data type

export const DATA_SCHEMAS = {
  awards: {
    name: '获奖记录',
    description: '学生个人获奖记录',
    fields: [
      { key: 'name', label: '姓名', type: 'string', required: true, example: '张三' },
      { key: 'contest', label: '比赛名称', type: 'string', required: true, example: 'NOIP2024提高' },
      { key: 'pride', label: '奖项', type: 'select', required: true, options: ['一等奖', '二等奖', '三等奖', '金牌', '银牌', '铜牌', '省一等奖', '省二等奖', '省三等奖'], example: '一等奖' },
      { key: 'grade', label: '年级', type: 'string', required: false, example: '高中组' },
      { key: 'school', label: '学校', type: 'string', required: false, example: '厦门双十中学' },
      { key: 'score', label: '成绩', type: 'string', required: false, example: '350' },
      { key: 'province', label: '省份', type: 'string', required: false, example: '福建' },
      { key: 'gender', label: '性别', type: 'select', required: false, options: ['男', '女'], example: '男' }
    ],
    excelHeaders: ['姓名', '比赛名称', '奖项', '年级', '学校', '成绩', '省份', '性别']
  },
  noip: {
    name: 'NOIP数据',
    description: '全国青少年信息学奥林匹克联赛年度统计',
    fields: [
      { key: 'year', label: '年份', type: 'number', required: true, example: '2024' }
    ],
    groups: ['提高组', '普及组'],
    groupFields: ['一等奖', '二等奖', '三等奖', '获奖人次'],
    excelSheetNames: ['提高组', '普及组']
  },
  csp: {
    name: 'CSP数据',
    description: '计算机软件能力认证年度统计',
    fields: [
      { key: 'year', label: '年份', type: 'number', required: true, example: '2024' }
    ],
    groups: ['CSP-S', 'CSP-J'],
    groupFields: ['一等奖', '二等奖', '三等奖', '获奖人次'],
    excelSheetNames: ['CSP-S', 'CSP-J']
  },
  apio: {
    name: 'APIO数据',
    description: '亚洲太平洋地区信息学奥林匹克年度统计',
    fields: [
      { key: 'year', label: '年份', type: 'number', required: true, example: '2024' },
      { key: '金牌', label: '金牌', type: 'number', required: false, example: '2' },
      { key: '银牌', label: '银牌', type: 'number', required: false, example: '3' },
      { key: '铜牌', label: '铜牌', type: 'number', required: false, example: '5' },
      { key: '总数', label: '总数', type: 'number', required: false, example: '10' }
    ],
    excelHeaders: ['年份', '金牌', '银牌', '铜牌', '总数']
  },
  noi: {
    name: 'NOI数据',
    description: '全国青少年信息学奥林匹克竞赛个人获奖记录',
    fields: [
      { key: 'id', label: 'ID', type: 'number', required: false, example: '1' },
      { key: 'name', label: '姓名', type: 'string', required: true, example: '李四' },
      { key: 'competition', label: '比赛名称', type: 'string', required: true, example: 'NOI2024' },
      { key: 'level', label: '级别', type: 'string', required: false, example: '国家级' },
      { key: 'rank', label: '名次/奖牌', type: 'select', required: true, options: ['金牌', '银牌', '铜牌', '邀请赛金牌', '邀请赛银牌', '邀请赛铜牌'], example: '金牌' }
    ],
    excelHeaders: ['ID', '姓名', '比赛名称', '级别', '名次/奖牌']
  },
  wc: {
    name: 'WC冬令营',
    description: '冬令营获奖统计',
    fields: [
      { key: 'year', label: '年份', type: 'number', required: true, example: '2024' },
      { key: '金牌', label: '金牌', type: 'number', required: false, example: '8' },
      { key: '银牌', label: '银牌', type: 'number', required: false, example: '20' },
      { key: '铜牌', label: '铜牌', type: 'number', required: false, example: '26' }
    ],
    excelHeaders: ['年份', '金牌', '银牌', '铜牌']
  }
}

// Get schema by data type key
export function getSchema(dataType) {
  return DATA_SCHEMAS[dataType] || null
}

// Get field labels for a data type (for display)
export function getFieldLabels(dataType) {
  const schema = DATA_SCHEMAS[dataType]
  if (!schema) return []
  return schema.fields.map(f => f.label)
}

// Validate a single record against schema
export function validateRecord(record, schema) {
  const errors = []
  schema.fields.forEach(field => {
    if (field.required && !record[field.key]) {
      errors.push(`字段 "${field.label}" 为必填项`)
    }
    if (field.type === 'select' && record[field.key] && field.options && !field.options.includes(record[field.key])) {
      errors.push(`字段 "${field.label}" 的值 "${record[field.key]}" 不在可选范围内`)
    }
  })
  return errors
}