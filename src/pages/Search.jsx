import { useState } from 'react'
import { useData } from '../context/DataContext'

function Search() {
  const { awards: awardsData, noi: noiData } = useData()
  const [searchTerm, setSearchTerm] = useState('')
  const [searchType, setSearchType] = useState('name')
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [contestType, setContestType] = useState('')
  const [contestYear, setContestYear] = useState('')

  // Get base contest types
  const getBaseContest = (contest) => {
    if (contest.includes('NOIP')) return 'NOIP'
    if (contest.includes('CSP') && contest.includes('提高')) return 'CSP-S'
    if (contest.includes('CSP') && contest.includes('入门')) return 'CSP-J'
    if (contest.includes('APIO')) return 'APIO'
    if (contest.includes('NOI') && (contest.includes('邀请') || contest.includes('D类'))) return 'NOI邀请赛'
    if (contest.includes('NOI')) return 'NOI'
    if (contest.includes('WC')) return 'WC'
    if (contest.includes('CTSC')) return 'CTSC'
    if (contest.includes('NGOI')) return 'NGOI'
    // 1985-1994年全国青少年计算机程序设计竞赛
    if (contest.includes('全国青少年计算机程序设计竞赛')) return '青少年信息学奥赛'
    return contest
  }

  // Extract year from contest string
  const getContestYear = (contest) => {
    const match = contest.match(/(\d{4})/)
    return match ? match[1] : null
  }

  // Get all unique contest types from awards
  const awardsContestTypes = [...new Set(awardsData.map(a => getBaseContest(a.contest)))].filter(t => t).sort()
  // Add NOI and NOI邀请赛 from noiData
  const noiContestTypes = [...new Set(noiData.map(n => n.rank?.includes('邀请赛') ? 'NOI邀请赛' : 'NOI'))]
  const contestTypes = [...new Set([...awardsContestTypes, ...noiContestTypes])].sort()

  // Get years for selected contest type
  const contestYears = contestType
    ? [...new Set([
        ...awardsData
          .filter(a => getBaseContest(a.contest) === contestType)
          .map(a => getContestYear(a.contest))
          .filter(y => y),
        ...noiData
          .filter(n => {
            if (contestType === 'NOI' && !n.rank?.includes('邀请赛')) return true
            if (contestType === 'NOI邀请赛' && n.rank?.includes('邀请赛')) return true
            return false
          })
          .map(n => getContestYear(n.competition))
          .filter(y => y)
      ])].sort((a, b) => b - a)
    : []

  // Get all unique contests for filter
  const contests = [...new Set([
    ...awardsData.map(a => a.contest),
    ...noiData.map(n => n.competition)
  ])].sort()

  // Convert NOI data to awards-like format for unified display
  const noiAsAwards = noiData.map(n => ({
    name: n.name,
    contest: n.competition,
    pride: n.rank,
    grade: n.level,
    school: '',
    source: 'noi'
  }))

  // Filter awards
  const filteredAwards = awardsData.filter(award => {
    const term = searchTerm.toLowerCase()

    if (searchType === 'name') {
      if (!award.name.toLowerCase().includes(term)) return false
    } else {
      // Contest search: match by contest name (only when searchTerm has content)
      if (term && !award.contest.toLowerCase().includes(term)) return false
    }

    // Apply contest type filter
    if (contestType && getBaseContest(award.contest) !== contestType) return false

    // Apply year filter
    if (contestYear && getContestYear(award.contest) !== contestYear) return false

    return true
  })

  // Filter NOI data
  const filteredNoi = noiData.filter(n => {
    const term = searchTerm.toLowerCase()

    // Name search: match by name
    if (searchType === 'name') {
      if (!n.name.toLowerCase().includes(term)) return false
    } else {
      // Contest search: match by contest name (only when searchTerm has content)
      if (term && !n.competition.toLowerCase().includes(term)) return false
    }

    // For contest search: only include NOI data when contestType is NOI or NOI邀请赛
    if (searchType === 'contest') {
      if (contestType === 'NOI' && n.rank?.includes('邀请赛')) return false
      if (contestType === 'NOI邀请赛' && !n.rank?.includes('邀请赛')) return false
      // For other contest types (APIO, NOIP, etc.), exclude NOI data
      if (contestType && contestType !== 'NOI' && contestType !== 'NOI邀请赛') return false
    }

    // Apply year filter
    if (contestYear && getContestYear(n.competition) !== contestYear) return false

    return true
  })

  // Convert filtered NOI to awards-like shape so downstream renderers can use uniform fields (pride/contest/grade)
  const filteredNoiAsAwards = filteredNoi.map(n => ({
    name: n.name,
    contest: n.competition,
    pride: n.rank,
    grade: n.level,
    school: '',
    source: 'noi'
  }))

  // Group by student for name search (include both awards and NOI data)
  const getStudentRecords = () => {
    const studentMap = {}
    filteredAwards.forEach(award => {
      if (!studentMap[award.name]) {
        studentMap[award.name] = []
      }
      studentMap[award.name].push(award)
    })
    // Also include NOI data
    filteredNoi.forEach(n => {
      if (!studentMap[n.name]) {
        studentMap[n.name] = []
      }
      studentMap[n.name].push({
        name: n.name,
        contest: n.competition,
        pride: n.rank,
        grade: n.level,
        source: 'noi'
      })
    })
    return Object.entries(studentMap).map(([name, awards]) => ({
      name,
      awards,
      latestContest: awards[awards.length - 1]?.contest
    })).sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'))
  }

  const students = getStudentRecords()

  const handleRecordClick = (record) => {
    setSelectedRecord(selectedRecord?.name === record.name ? null : record)
  }

  // Update filters and refresh results
  const updateFilters = (type, year) => {
    const term = searchTerm.trim()
    if (term) {
      let studentAwards = awardsData.filter(a => a.name.toLowerCase().includes(term.toLowerCase()))
      if (type) studentAwards = studentAwards.filter(a => getBaseContest(a.contest) === type)
      if (year) studentAwards = studentAwards.filter(a => getContestYear(a.contest) === year)
      // Also include NOI data
      let studentNoi = noiData.filter(n => n.name.toLowerCase().includes(term.toLowerCase()))
      if (type === 'NOI' && type) studentNoi = studentNoi.filter(n => !n.rank?.includes('邀请赛'))
      if (type === 'NOI邀请赛' && type) studentNoi = studentNoi.filter(n => n.rank?.includes('邀请赛'))
      if (year) studentNoi = studentNoi.filter(n => getContestYear(n.competition) === year)
      const allStudentAwards = [...studentAwards, ...studentNoi.map(n => ({
        name: n.name,
        contest: n.competition,
        pride: n.rank,
        grade: n.level,
        source: 'noi'
      }))]
      const uniqueNames = [...new Set(allStudentAwards.map(a => a.name))]
      if (uniqueNames.length === 1) {
        setSelectedRecord({ name: uniqueNames[0], awards: allStudentAwards })
      } else if (uniqueNames.length > 0) {
        const firstName = uniqueNames[0]
        setSelectedRecord({ name: firstName, awards: allStudentAwards.filter(a => a.name === firstName) })
      }
    }
  }

  return (
    <div>
      <h1 className="page-title">数据查询</h1>

      {/* Tab toggle */}
      <div style={{display: 'flex', gap: '0.5rem', marginBottom: '1rem'}}>
        <button
          onClick={() => { setSearchType('name'); setSelectedRecord(null); setContestType(''); setContestYear('') }}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            background: searchType === 'name' ? 'var(--primary)' : '#E2E8F0',
            color: searchType === 'name' ? 'white' : 'var(--text)',
            fontWeight: 'bold',
            fontSize: '1rem'
          }}
        >
          按姓名查询
        </button>
        <button
          onClick={() => { setSearchType('contest'); setSelectedRecord(null); setSearchTerm('') }}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            background: searchType === 'contest' ? 'var(--primary)' : '#E2E8F0',
            color: searchType === 'contest' ? 'white' : 'var(--text)',
            fontWeight: 'bold',
            fontSize: '1rem'
          }}
        >
          按赛事查询
        </button>
      </div>

      {/* Name search panel */}
      {searchType === 'name' && (
        <div style={{display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center', background: '#F7FAFC', padding: '1rem', borderRadius: '8px'}}>
          <input
            type="text"
            placeholder="输入学生姓名搜索..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              const term = e.target.value.trim()
              if (term) {
                let studentAwards = awardsData.filter(a => a.name.toLowerCase().includes(term.toLowerCase()))
                if (contestType) studentAwards = studentAwards.filter(a => getBaseContest(a.contest) === contestType)
                if (contestYear) studentAwards = studentAwards.filter(a => getContestYear(a.contest) === contestYear)
                // Also include NOI data
                let studentNoi = noiData.filter(n => n.name.toLowerCase().includes(term.toLowerCase()))
                if (contestType === 'NOI' && contestType) studentNoi = studentNoi.filter(n => !n.rank?.includes('邀请赛'))
                if (contestType === 'NOI邀请赛' && contestType) studentNoi = studentNoi.filter(n => n.rank?.includes('邀请赛'))
                if (contestYear) studentNoi = studentNoi.filter(n => getContestYear(n.competition) === contestYear)
                const allStudentAwards = [...studentAwards, ...studentNoi.map(n => ({
                  name: n.name,
                  contest: n.competition,
                  pride: n.rank,
                  grade: n.level,
                  source: 'noi'
                }))]
                const uniqueNames = [...new Set(allStudentAwards.map(a => a.name))]
                if (uniqueNames.length === 1) {
                  setSelectedRecord({ name: uniqueNames[0], awards: allStudentAwards })
                } else if (uniqueNames.length > 0) {
                  const firstName = uniqueNames[0]
                  setSelectedRecord({ name: firstName, awards: allStudentAwards.filter(a => a.name === firstName) })
                }
              } else {
                setSelectedRecord(null)
              }
            }}
            style={{
              flex: 1,
              minWidth: '200px',
              padding: '0.75rem',
              fontSize: '1rem',
              border: '2px solid var(--border)',
              borderRadius: '8px'
            }}
          />
          <div style={{display: 'flex', gap: '0.5rem'}}>
            <select
              value={contestType}
              onChange={(e) => {
                setContestType(e.target.value)
                setContestYear('')
              }}
              style={{
                padding: '0.75rem',
                fontSize: '1rem',
                border: '2px solid var(--border)',
                borderRadius: '8px',
                minWidth: '120px'
              }}
            >
              <option value="">赛事类型</option>
              {contestTypes.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <select
              value={contestYear}
              onChange={(e) => setContestYear(e.target.value)}
              disabled={!contestType}
              style={{
                padding: '0.75rem',
                fontSize: '1rem',
                border: '2px solid var(--border)',
                borderRadius: '8px',
                minWidth: '100px',
                opacity: contestType ? 1 : 0.5
              }}
            >
              <option value="">年份</option>
              {contestYears.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Contest search panel */}
      {searchType === 'contest' && (
        <div style={{display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center', background: '#F7FAFC', padding: '1rem', borderRadius: '8px'}}>
          <div style={{display: 'flex', gap: '0.5rem'}}>
            <select
              value={contestType}
              onChange={(e) => {
                setContestType(e.target.value)
                setContestYear('')
              }}
              style={{
                padding: '0.75rem',
                fontSize: '1rem',
                border: '2px solid var(--border)',
                borderRadius: '8px',
                minWidth: '120px'
              }}
            >
              <option value="">赛事类型</option>
              {contestTypes.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <select
              value={contestYear}
              onChange={(e) => setContestYear(e.target.value)}
              disabled={!contestType}
              style={{
                padding: '0.75rem',
                fontSize: '1rem',
                border: '2px solid var(--border)',
                borderRadius: '8px',
                minWidth: '100px',
                opacity: contestType ? 1 : 0.5
              }}
            >
              <option value="">年份</option>
              {contestYears.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="stat-grid" style={{marginBottom: '1.5rem'}}>
        <div className="stat-card">
          <div className="stat-value">{students.length}</div>
          <div className="stat-label">查询结果(人数)</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{filteredAwards.length + filteredNoi.length}</div>
          <div className="stat-label">获奖记录数</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{contestTypes.length}</div>
          <div className="stat-label">赛事类型</div>
        </div>
      </div>

      {/* Print button */}
      {searchType === 'contest' && (filteredAwards.length + filteredNoi.length) > 0 && (
        <div style={{marginBottom: '1rem', display: 'flex', justifyContent: 'flex-end'}}>
          <button
            onClick={() => window.print()}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'var(--primary)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            打印报表
          </button>
        </div>
      )}

      {/* Print-only report */}
      <div id="print-section" style={{display: 'none'}}>
        <h2 style={{textAlign: 'center', marginBottom: '1rem'}}>
          {contestType || '全部赛事'}{contestYear ? ` - ${contestYear}年` : ''}获奖记录
        </h2>
        <p style={{textAlign: 'center', marginBottom: '1rem', color: '#666'}}>
          共 {filteredAwards.length + filteredNoi.length} 条记录
        </p>
        <table style={{width: '100%', borderCollapse: 'collapse'}}>
          <thead>
            <tr style={{background: '#ddd'}}>
              <th style={{padding: '0.5rem', border: '1px solid #ccc', textAlign: 'left'}}>姓名</th>
              <th style={{padding: '0.5rem', border: '1px solid #ccc', textAlign: 'left'}}>年级</th>
              <th style={{padding: '0.5rem', border: '1px solid #ccc', textAlign: 'left'}}>获奖等级</th>
            </tr>
          </thead>
          <tbody>
            {filteredAwards.map((item, idx) => (
              <tr key={idx}>
                <td style={{padding: '0.5rem', border: '1px solid #ccc'}}>{item.name}</td>
                <td style={{padding: '0.5rem', border: '1px solid #ccc'}}>{item.grade || '-'}</td>
                <td style={{padding: '0.5rem', border: '1px solid #ccc'}}>{item.pride}</td>
              </tr>
            ))}
            {filteredNoi.map((item, idx) => (
              <tr key={`noi-${idx}`}>
                <td style={{padding: '0.5rem', border: '1px solid #ccc'}}>{item.name}</td>
                <td style={{padding: '0.5rem', border: '1px solid #ccc'}}>{item.level || '-'}</td>
                <td style={{padding: '0.5rem', border: '1px solid #ccc'}}>{item.rank}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Results */}
      <div style={{display: 'grid', gridTemplateColumns: selectedRecord ? '1fr 1fr' : '1fr', gap: '1rem'}}>
        {/* List */}
        <div className="card" style={{maxHeight: '600px', overflowY: 'auto'}}>
          <h3 className="card-title">{searchType === 'name' ? '学生列表' : '赛事记录'}</h3>
          <table style={{width: '100%'}}>
            <thead>
              <tr>
                {searchType === 'name' ? (
                  <>
                    <th>姓名</th>
                    <th>获奖次数</th>
                    <th>最近赛事</th>
                  </>
                ) : (
                  <>
                    <th>姓名</th>
                    <th>年级</th>
                    <th>获奖等级</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {(searchType === 'name' ? students : [...filteredAwards, ...filteredNoiAsAwards].slice(0, 100)).map((item, idx) => (
                <tr
                  key={idx}
                  onClick={() => {
                    if (searchType === 'name') {
                      handleRecordClick(item)
                    } else {
                      const studentAwards = awardsData.filter(a => a.name === item.name)
                      const studentNoi = noiData.filter(n => n.name === item.name)
                      const allAwards = [...studentAwards, ...studentNoi.map(n => ({
                        name: n.name,
                        contest: n.competition,
                        pride: n.rank,
                        grade: n.level,
                        source: 'noi'
                      }))]
                      handleRecordClick({ name: item.name, awards: allAwards })
                    }
                  }}
                  style={{
                    cursor: 'pointer',
                    background: selectedRecord?.name === (searchType === 'name' ? item.name : item.name) ? '#E2E8F0' : 'transparent'
                  }}
                >
                  {searchType === 'name' ? (
                    <>
                      <td style={{fontWeight: 'bold', color: 'var(--primary)'}}>{item.name}</td>
                      <td>{item.awards.length}</td>
                      <td style={{fontSize: '0.875rem', color: '#718096'}}>{item.latestContest}</td>
                    </>
                  ) : (
                    <>
                      <td style={{fontWeight: 'bold', color: 'var(--primary)'}}>{item.name}</td>
                      <td style={{fontSize: '0.875rem', color: '#718096'}}>{item.grade || '-'}</td>
                      <td>
                        <span style={{
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.875rem',
                          fontWeight: 'bold',
                          background: item.pride.includes('金牌') ? '#FFD700' :
                                    item.pride.includes('银牌') ? '#C0C0C0' :
                                    item.pride.includes('铜牌') ? '#CD7F32' :
                                    '#E2E8F0'
                        }}>
                          {item.pride}
                        </span>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {(filteredAwards.length + filteredNoi.length) > 100 && searchType === 'contest' && (
            <p style={{textAlign: 'center', color: '#718096', marginTop: '1rem'}}>
              显示前100条，共{filteredAwards.length + filteredNoi.length}条
            </p>
          )}
        </div>

        {/* Detail */}
        {selectedRecord && (
          <div className="card">
            <h3 className="card-title">{selectedRecord.name}</h3>
            <p style={{color: '#718096', marginBottom: '1rem'}}>
              获奖次数: {selectedRecord.awards.length}
            </p>

            <h4 style={{color: 'var(--primary)', marginBottom: '0.5rem'}}>获奖记录</h4>
            <div style={{maxHeight: '400px', overflowY: 'auto'}}>
              {[...selectedRecord.awards].reverse().map((award, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '0.75rem',
                    marginBottom: '0.5rem',
                    background: '#F7FAFC',
                    borderRadius: '6px',
                    borderLeft: award.pride.includes('金牌') ? '4px solid #FFD700' :
                              award.pride.includes('银牌') ? '4px solid #C0C0C0' :
                              award.pride.includes('铜牌') ? '4px solid #CD7F32' :
                              award.pride.includes('一等') ? '4px solid var(--accent)' :
                              '4px solid var(--secondary)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{fontWeight: 'bold', color: 'var(--primary)'}}>{award.contest}</div>
                    <div style={{fontSize: '0.875rem', color: '#718096'}}>
                      {award.grade && `${award.grade} · `}{award.school}
                    </div>
                  </div>
                  <div style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '4px',
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                    background: award.pride.includes('金牌') ? '#FFD700' :
                              award.pride.includes('银牌') ? '#C0C0C0' :
                              award.pride.includes('铜牌') ? '#CD7F32' :
                              '#E2E8F0',
                    color: award.pride.includes('金') || award.pride.includes('银') || award.pride.includes('铜') ? '#000' : 'var(--text)'
                  }}>
                    {award.pride}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Empty state */}
      {!selectedRecord && students.length === 0 && searchTerm && (
        <div style={{textAlign: 'center', padding: '3rem', color: '#718096'}}>
          <p style={{fontSize: '1.125rem'}}>未找到匹配的结果</p>
          <p style={{fontSize: '0.875rem'}}>尝试使用不同的搜索词或筛选条件</p>
        </div>
      )}
    </div>
  )
}

export default Search