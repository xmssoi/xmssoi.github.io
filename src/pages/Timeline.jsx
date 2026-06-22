import { useState } from 'react'
import { useData } from '../context/DataContext'

// NOIP photos
import Noip2010 from '../../picture/noip/Noip2010.jpg'
import Noip2011 from '../../picture/noip/Noip2011.jpg'
import Noip2015 from '../../picture/noip/Noip2015.jpg'
import Noip2017 from '../../picture/noip/Noip2017.jpg'
import Noip2017_1 from '../../picture/noip/Noip2017-1.JPG'
import Noip2017_2 from '../../picture/noip/Noip2017-2.jpg'
import Noip2017_3 from '../../picture/noip/Noip2017-3.JPG'
import Noip2018 from '../../picture/noip/Noip2018.jpg'
import Noip2018_2 from '../../picture/noip/Noip2018-2.JPG'

// NOI photos
import Noi2010 from '../../picture/noi/Noi2010.jpg'
import Noi2011_huangtao from '../../picture/noi/Noi2011-黄涛岸.JPG'
import Noi2011_linyang from '../../picture/noi/Noi2011-林洋.JPG'
import Noi2012 from '../../picture/noi/Noi2012.jpg'
import Noi2013 from '../../picture/noi/Noi2013.jpg'
import Noi2014_close from '../../picture/noi/Noi2014 闭幕式.JPG'
import Noi2014 from '../../picture/noi/Noi2014.JPG'
import Noi2015 from '../../picture/noi/Noi2015.jpg'
import Noi2016 from '../../picture/noi/Noi2016.JPEG'
import Noi2016_2 from '../../picture/noi/Noi2016-2.JPEG'
import Noi2017 from '../../picture/noi/Noi2017.jpg'
import Noi2017_1 from '../../picture/noi/Noi2017-1.jpg'
import Noi2018 from '../../picture/noi/Noi2018.jpg'
import Noi2019 from '../../picture/noi/Noi2019.jpg'
import Noi2019_1 from '../../picture/noi/Noi2019_1.jpg'
import Noi2020 from '../../picture/noi/Noi2020.jpg'
import Noi2020_2 from '../../picture/noi/Noi2020_2.jpg'
import Noi2021 from '../../picture/noi/Noi2021.jpg'
import Noi2021_1 from '../../picture/noi/Noi2021_1.jpg'
import Noi2022 from '../../picture/noi/Noi2022.jpeg'
import Noi2023 from '../../picture/noi/Noi2023.JPG'
import NOI2024 from '../../picture/noi/NOI2024.jpg'

// Get all unique contest types
const contestTypes = ['NOIP提高', 'NOIP普及', 'CSP-S', 'CSP-J', 'APIO', 'NOI', 'NOI邀请赛', 'WC', 'CTSC', 'NGOI', 'CTS']

// 赛事 emoji 图标（仅展示用，不参与逻辑判断）
const CONTEST_ICONS = {
  'NOIP提高': '🥇',
  'NOIP普及': '🥈',
  'CSP-S': '🚀',
  'CSP-J': '📗',
  'APIO': '🌏',
  'NOI': '🏆',
  'NOI邀请赛': '🎟️',
  'WC': '❄️',
  'CTSC': '🎯',
  'NGOI': '👧',
  'CTS': '🎓',
}
const labelContest = (type) => {
  const icon = CONTEST_ICONS[type]
  return icon ? `${icon} ${type}` : type
}

function Timeline() {
  const { awards: awardsData } = useData()
  const [selectedYear, setSelectedYear] = useState(null)
  const [contestFilter, setContestFilter] = useState('')
  const [yearRange, setYearRange] = useState('all')
  const [lightboxImg, setLightboxImg] = useState(null)

  // Group contests by year and type
  const getYearStats = () => {
    const stats = {}

    awardsData.forEach(award => {
      // Handle NOI separately to avoid matching NOIP (NOI starts with NOI but NOIP does too)
      const isNoi = /^NOI\d/.test(award.contest)
      const isNoip = award.contest.startsWith('NOIP')
      const isCsp = award.contest.startsWith('CSP')

      // Handle historical competition (全国青少年计算机程序设计竞赛)
      const isHistorical = /^\d{4}全国青少年计算机程序设计竞赛/.test(award.contest)

      // Handle 全国计算机基础知识大奖赛
      const isBasicKnowledge = /^\d{4}年全国计算机基础知识大奖赛/.test(award.contest)

      // Find base contest type from other contests (APIO, WC, CTSC, etc.)
      const otherContestTypes = ['APIO', 'WC', 'CTSC', 'NGOI', 'CTS']
      const baseContestType = otherContestTypes.find(t => award.contest.startsWith(t))

      if (!isNoi && !isNoip && !isCsp && !baseContestType && !isHistorical && !isBasicKnowledge) return

      // Determine the specific contest key
      let key
      if (isNoi) {
        // Distinguish NOI and NOI D类 (invitation)
        key = award.contest.includes('D类') ? 'NOI邀请赛' : 'NOI'
      } else if (isNoip) {
        if (award.contest.includes('优秀参赛学校')) {
          key = 'NOIP团队奖'
        } else if (award.contest.includes('提高')) {
          key = 'NOIP提高'
        } else if (award.contest.includes('普及')) {
          key = 'NOIP普及'
        } else {
          key = 'NOIP提高'
        }
      } else if (isCsp) {
        if (award.contest.includes('-S') || award.contest.includes('提高')) {
          key = 'CSP-S'
        } else if (award.contest.includes('-J') || award.contest.includes('入门')) {
          key = 'CSP-J'
        } else {
          key = 'CSP-S'
        }
      } else if (isHistorical) {
        let historicalType = '全国青少年计算机程序设计竞赛'
        if (award.contest.includes('LOGO')) {
          historicalType += 'LOGO'
        } else if (award.contest.includes('BASIC')) {
          historicalType += 'BASIC'
        }
        if (award.contest.includes('初中组')) {
          historicalType += '初中组'
        } else if (award.contest.includes('高中组')) {
          historicalType += '高中组'
        }
        key = historicalType
      } else if (isBasicKnowledge) {
        key = '计算机基础知识'
      } else if (award.contest.includes('信息学奥林匹克特色学校奖')) {
        key = '特色学校奖'
      } else {
        key = baseContestType
      }

      if (contestFilter && key !== contestFilter && baseContestType !== contestFilter) return

      const yearMatch = award.contest.match(/\d{4}/)
      if (!yearMatch) return
      const year = yearMatch[0]

      if (yearRange !== 'all') {
        const currentYear = new Date().getFullYear()
        const startYear = yearRange === 'recent' ? currentYear - 5 : 1985
        if (parseInt(year) < startYear) return
      }

      if (!stats[year]) {
        stats[year] = {}
      }
      if (!stats[year][key]) {
        stats[year][key] = {
          '一等奖': [],
          '二等奖': [],
          '三等奖': [],
          '金牌': [],
          '银牌': [],
          '铜牌': [],
          '团队奖': [],
          '特色学校奖': []
        }
      }

      // Categorize by award type - store full award object
      const pride = award.pride
      const awardInfo = { name: award.name, grade: award.grade, score: award.score }
      if (pride.includes('金牌')) {
        stats[year][key]['金牌'].push(awardInfo)
      } else if (pride.includes('银牌')) {
        stats[year][key]['银牌'].push(awardInfo)
      } else if (pride.includes('铜牌')) {
        stats[year][key]['铜牌'].push(awardInfo)
      } else if (pride.includes('一等')) {
        stats[year][key]['一等奖'].push(awardInfo)
      } else if (pride.includes('二等')) {
        stats[year][key]['二等奖'].push(awardInfo)
      } else if (pride.includes('三等')) {
        stats[year][key]['三等奖'].push(awardInfo)
      } else if (pride.includes('优秀参赛学校') || pride.includes('特色学校奖')) {
        stats[year][key]['团队奖'].push(awardInfo)
      }
    })

    return stats
  }

  const stats = getYearStats()
  const sortedYears = Object.keys(stats).sort((a, b) => b - a)

  const getBadgeColor = (prideType) => {
    switch (prideType) {
      case '金牌': return '#FFD700'
      case '银牌': return '#C0C0C0'
      case '铜牌': return '#CD7F32'
      case '一等奖': return '#ED8936'
      case '二等奖': return '#3182CE'
      case '三等奖': return '#38A169'
      case '团队奖': return '#9F7AEA'
      default: return '#718096'
    }
  }

  const getTextColor = (prideType) => {
    return ['金牌', '银牌', '铜牌'].includes(prideType) ? '#000' : '#fff'
  }

  const getContestPhoto = (year, compType) => {
    const yearNum = parseInt(year)
    const noipPhotos = {
      2010: Noip2010,
      2011: Noip2011,
      2015: Noip2015,
      2017: [Noip2017, Noip2017_1, Noip2017_2, Noip2017_3],
      2018: [Noip2018, Noip2018_2],
    }
    const noiPhotos = {
      2010: Noi2010,
      2011: [Noi2011_linyang, Noi2011_huangtao],
      2012: Noi2012,
      2013: Noi2013,
      2014: [Noi2014, Noi2014_close],
      2015: Noi2015,
      2016: [Noi2016, Noi2016_2],
      2017: [Noi2017, Noi2017_1],
      2018: Noi2018,
      2019: [Noi2019, Noi2019_1],
      2020: [Noi2020, Noi2020_2],
      2021: [Noi2021, Noi2021_1],
      2022: Noi2022,
      2023: Noi2023,
      2024: NOI2024,
    }

    if ((compType === 'NOIP提高' || compType === 'NOIP普及') && noipPhotos[yearNum]) {
      return noipPhotos[yearNum]
    }
    if (compType === 'NOI' && noiPhotos[yearNum]) {
      return noiPhotos[yearNum]
    }
    return null
  }

  const renderPhoto = (photo, label) => {
    if (!photo) return null
    if (Array.isArray(photo)) {
      return photo.map((p, idx) => (
        <div key={idx} style={{marginBottom: '1rem'}}>
          {label && idx === 0 && <div style={{fontWeight: 'bold', marginBottom: '0.5rem'}}>{label}</div>}
          <img
            src={p}
            alt={`${label || ''} ${idx + 1}`}
            style={{maxWidth: '100%', maxHeight: '300px', borderRadius: '8px', cursor: 'pointer'}}
            onClick={() => setLightboxImg(p)}
          />
        </div>
      ))
    }
    return <img
      src={photo}
      alt={label}
      style={{maxWidth: '100%', maxHeight: '300px', borderRadius: '8px', cursor: 'pointer'}}
      onClick={() => setLightboxImg(photo)}
    />
  }

  const renderStudentList = (awards) => {
    if (awards.length === 0) return <span style={{color: '#A0AEC0'}}>暂无</span>
    return (
      <>
        {awards.map((award, idx) => (
          <div key={idx} style={{
            display: 'inline-block',
            padding: '0.25rem 0.5rem',
            margin: '0.15rem',
            background: '#EDF2F7',
            borderRadius: '4px',
            fontSize: '0.75rem',
            lineHeight: '1.4'
          }}>
            <div style={{fontWeight: 'bold'}}>{award.name}</div>
            {award.grade && <div style={{color: '#718096', fontSize: '0.7rem'}}>{award.grade}</div>}
            {award.score && <div style={{color: '#A0AEC0', fontSize: '0.7rem'}}>成绩: {award.score}</div>}
          </div>
        ))}
      </>
    )
  }

  return (
    <div>
      <h1 className="page-title">发展时间轴</h1>

      {/* Filters */}
      <div style={{display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center'}}>
        <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
          <span style={{fontWeight: 'bold'}}>赛事:</span>
          <button
            onClick={() => setContestFilter('')}
            style={{
              padding: '0.4rem 0.8rem',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              background: contestFilter === '' ? 'var(--primary)' : '#E2E8F0',
              color: contestFilter === '' ? 'white' : 'var(--text)',
              fontSize: '0.875rem',
              fontWeight: contestFilter === '' ? 'bold' : 'normal'
            }}
          >
            全部
          </button>
          {contestTypes.map(type => (
            <button
              key={type}
              onClick={() => setContestFilter(type)}
              style={{
                padding: '0.4rem 0.8rem',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                background: contestFilter === type ? 'var(--primary)' : '#E2E8F0',
                color: contestFilter === type ? 'white' : 'var(--text)',
                fontSize: '0.875rem',
                fontWeight: contestFilter === type ? 'bold' : 'normal'
              }}
            >
              {labelContest(type)}
            </button>
          ))}
        </div>

        <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center', marginLeft: 'auto'}}>
          <span style={{fontSize: '0.875rem', color: '#718096'}}>年份:</span>
          <select
            value={yearRange}
            onChange={(e) => setYearRange(e.target.value)}
            style={{
              padding: '0.4rem',
              borderRadius: '6px',
              border: '2px solid var(--border)',
              fontSize: '0.875rem'
            }}
          >
            <option value="all">全部 (1985-2026)</option>
            <option value="recent">近5年 (2021-2026)</option>
          </select>
        </div>
      </div>

      {/* Stats summary */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '0.75rem',
        marginBottom: '2rem'
      }}>
        {['一等奖', '二等奖', '三等奖', '金牌', '银牌', '铜牌'].map(type => {
          const count = Object.values(stats).reduce((sum, yearData) => {
            return sum + Object.values(yearData).reduce((s, compData) => {
              return s + (compData[type]?.length || 0)
            }, 0)
          }, 0)
          return (
            <div
              key={type}
              style={{
                background: 'white',
                padding: '0.75rem',
                borderRadius: '8px',
                textAlign: 'center',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                borderLeft: `4px solid ${getBadgeColor(type)}`
              }}
            >
              <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: getBadgeColor(type)}}>{count}</div>
              <div style={{fontSize: '0.75rem', color: '#718096'}}>{type}</div>
            </div>
          )
        })}
      </div>

      {/* Year Index */}
      <div style={{display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center'}}>
        <select
          onChange={(e) => {
            if (e.target.value) {
              document.getElementById(`year-${e.target.value}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
          }}
          style={{
            padding: '0.4rem 0.8rem',
            borderRadius: '6px',
            border: '2px solid var(--border)',
            fontSize: '0.875rem',
            cursor: 'pointer',
            background: 'white'
          }}
        >
          <option value="">选择年份</option>
          {sortedYears.map(year => (
            <option key={year} value={year}>{year}年</option>
          ))}
        </select>
      </div>

      {/* Timeline */}
      <div className="timeline">
        {sortedYears.map(year => (
          <div key={year} id={`year-${year}`} className="timeline-item">
            <div className="timeline-year">{year}</div>

            {/* Year competitions */}
            <div style={{display: 'grid', gap: '1rem', paddingLeft: '1rem'}}>
              {Object.entries(stats[year]).map(([compType, compData]) => (
                <div
                  key={compType}
                  style={{
                    background: 'white',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  {/* Competition header */}
                  <div
                    onClick={() => setSelectedYear(selectedYear === `${year}-${compType}` ? null : `${year}-${compType}`)}
                    style={{
                      padding: '0.75rem 1rem',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: selectedYear === `${year}-${compType}` ? '#EDF2F7' : 'white'
                    }}
                  >
                    <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        background: 'var(--primary)',
                        color: 'white',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold'
                      }}>
                        {labelContest(compType)}
                      </span>
                      <span style={{fontWeight: 'bold', color: 'var(--primary)'}}>
                        {compType === '计算机基础知识' ? `${year}年全国计算机基础知识大奖赛` : `${year}${compType}`}
                      </span>
                    </div>

                    <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
                      {['一等奖', '金牌', '银牌', '铜牌', '二等奖', '三等奖'].map(type => {
                        const names = compData[type] || []
                        if (names.length === 0) return null
                        return (
                          <span
                            key={type}
                            style={{
                              padding: '0.2rem 0.4rem',
                              borderRadius: '4px',
                              fontSize: '0.7rem',
                              fontWeight: 'bold',
                              background: getBadgeColor(type),
                              color: getTextColor(type)
                            }}
                          >
                            {type}: {names.length}
                          </span>
                        )
                      })}
                      <span style={{color: '#A0AEC0', marginLeft: '0.5rem'}}>
                        {selectedYear === `${year}-${compType}` ? '▲' : '▼'}
                      </span>
                    </div>
                  </div>

                  {/* Expanded student details */}
                  {selectedYear === `${year}-${compType}` && (
                    <div style={{padding: '1rem', borderTop: '1px solid var(--border)', background: '#FAFAFA'}}>
                      {(() => {
                        const photo = getContestPhoto(year, compType)
                        return (
                          <>
                           <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem'}}>
                              {['一等奖', '金牌', '银牌', '铜牌', '二等奖', '三等奖'].map(type => {
                                const names = compData[type] || []
                                if (names.length === 0) return null
                                return (
                                  <div key={type} style={{marginBottom: '0.5rem'}}>
                                    <div style={{
                                      fontSize: '0.75rem',
                                      fontWeight: 'bold',
                                      color: getBadgeColor(type),
                                      marginBottom: '0.25rem'
                                    }}>
                                      {type} ({names.length}人)
                                    </div>
                                    <div>{renderStudentList(names)}</div>
                                  </div>
                                )
                              })}
                            </div>
                            {photo && (
                              <div style={{marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)'}}>
                                <div style={{fontWeight: 'bold', marginBottom: '0.5rem'}}>赛事合影</div>
                                {renderPhoto(photo)}
                              </div>
                            )}
                          </>
                        )
                      })()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox modal */}
      {lightboxImg && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            cursor: 'pointer'
          }}
          onClick={() => setLightboxImg(null)}
        >
          <img
            src={lightboxImg}
            alt=""
            style={{maxWidth: '90%', maxHeight: '90%', borderRadius: '8px'}}
            onClick={(e) => e.stopPropagation()}
          />
          <div style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            color: 'white',
            fontSize: '2rem',
            cursor: 'pointer'
          }}>
            ×
          </div>
        </div>
      )}
    </div>
  )
}

export default Timeline