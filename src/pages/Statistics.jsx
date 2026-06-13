import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useData } from '../context/DataContext'

function Statistics() {
  const [searchParams] = useSearchParams()
  const { awards: awardsData, noip: noipData, csp: cspData, apio: apioData, noi: noiData } = useData()
  const [selectedCompetition, setSelectedCompetition] = useState(searchParams.get('comp') || 'NOI')
  const [selectedMedal, setSelectedMedal] = useState(searchParams.get('medal') || null)

  // NOIP提高 state - default to most recent year
  const allNoipYears = [...new Set(awardsData.filter(item => item.contest?.startsWith('NOIP')).map(item => {
    const match = item.contest.match(/NOIP(\d{4})/)
    return match ? parseInt(match[1]) : null
  }).filter(Boolean))]
  const noipYears = [...new Set([...allNoipYears, 2020, 2021, 2022, 2023, 2024, 2025])].sort((a, b) => b - a)
  const [noipYear, setNoipYear] = useState(noipYears[0] || 2025)
  const [noipLevel, setNoipLevel] = useState('全部')

  // NOIP普及 state
  const noipPujiYears = [...new Set(awardsData.filter(item => item.contest?.startsWith('NOIP') && item.contest?.includes('普及')).map(item => {
    const match = item.contest.match(/NOIP(\d{4})/)
    return match ? parseInt(match[1]) : null
  }).filter(Boolean))].sort((a, b) => b - a)
  const [noipPujiYear, setNoipPujiYear] = useState('全部')
  const [noipPujiLevel, setNoipPujiLevel] = useState('全部')

  // CSP-S state
  const cspYears = [...new Set(cspData.map(item => item.year))].sort((a, b) => b - a)
  const [cspSYear, setCspSYear] = useState('全部')
  const [cspSLevel, setCspSLevel] = useState('全部')

  // CSP-J state
  const [cspJYear, setCspJYear] = useState('全部')
  const [cspJLevel, setCspJLevel] = useState('全部')

  // NOI medals
  const noiMedals = {
    gold: noiData.filter(x => x.rank === '金牌').length,
    silver: noiData.filter(x => x.rank === '银牌').length,
    bronze: noiData.filter(x => x.rank === '铜牌').length,
  }

  // Calculate totals
  const totalAPIO = {
    gold: apioData.reduce((sum, y) => sum + (y.金牌 || 0), 0),
    silver: apioData.reduce((sum, y) => sum + (y.银牌 || 0), 0),
    bronze: apioData.reduce((sum, y) => sum + (y.铜牌 || 0), 0),
  }

  // NOIP提高组 awards.json counts (consistent with table and timeline)
  const noipAwardsData = {
    first: awardsData.filter(a => {
      const match = a.contest.match(/NOIP(\d{4})/)
      if (!match) return false
      if (parseInt(match[1]) >= 2020) return a.pride === '一等奖'
      return a.contest.includes('提高') && a.pride === '一等奖'
    }).length,
    second: awardsData.filter(a => {
      const match = a.contest.match(/NOIP(\d{4})/)
      if (!match) return false
      if (parseInt(match[1]) >= 2020) return a.pride === '二等奖'
      return a.contest.includes('提高') && a.pride === '二等奖'
    }).length,
    third: awardsData.filter(a => {
      const match = a.contest.match(/NOIP(\d{4})/)
      if (!match) return false
      if (parseInt(match[1]) >= 2020) return a.pride === '三等奖'
      return a.contest.includes('提高') && a.pride === '三等奖'
    }).length,
  }

  // NOIP普及组 awards.json counts
  const noipPujiAwardsData = {
    first: awardsData.filter(a => {
      if (!a.contest?.startsWith('NOIP')) return false
      if (!a.contest?.includes('普及')) return false
      return a.pride === '一等奖'
    }).length,
    second: awardsData.filter(a => {
      if (!a.contest?.startsWith('NOIP')) return false
      if (!a.contest?.includes('普及')) return false
      return a.pride === '二等奖'
    }).length,
    third: awardsData.filter(a => {
      if (!a.contest?.startsWith('NOIP')) return false
      if (!a.contest?.includes('普及')) return false
      return a.pride === '三等奖'
    }).length,
  }

  // CSP-S awards.json counts
  const cspSData = {
    first: awardsData.filter(a => {
      if (!a.contest?.startsWith('CSP')) return false
      if (!a.contest?.includes('-S') && !a.contest?.includes('提高')) return false
      return a.pride === '一等奖'
    }).length,
    second: awardsData.filter(a => {
      if (!a.contest?.startsWith('CSP')) return false
      if (!a.contest?.includes('-S') && !a.contest?.includes('提高')) return false
      return a.pride === '二等奖'
    }).length,
    third: awardsData.filter(a => {
      if (!a.contest?.startsWith('CSP')) return false
      if (!a.contest?.includes('-S') && !a.contest?.includes('提高')) return false
      return a.pride === '三等奖'
    }).length,
  }

  // CSP-J awards.json counts
  const cspJData = {
    first: awardsData.filter(a => {
      if (!a.contest?.startsWith('CSP')) return false
      if (!a.contest?.includes('-J') && !a.contest?.includes('入门')) return false
      return a.pride === '一等奖'
    }).length,
    second: awardsData.filter(a => {
      if (!a.contest?.startsWith('CSP')) return false
      if (!a.contest?.includes('-J') && !a.contest?.includes('入门')) return false
      return a.pride === '二等奖'
    }).length,
    third: awardsData.filter(a => {
      if (!a.contest?.startsWith('CSP')) return false
      if (!a.contest?.includes('-J') && !a.contest?.includes('入门')) return false
      return a.pride === '三等奖'
    }).length,
  }

  // NOI D类 records from awards.json (same as NOI全国赛, NOT邀请赛)
  const noiD类Data = {
    gold: awardsData.filter(a => a.contest?.includes('D类') && a.pride === '金牌').length,
    silver: awardsData.filter(a => a.contest?.includes('D类') && a.pride === '银牌').length,
    bronze: awardsData.filter(a => a.contest?.includes('D类') && a.pride === '铜牌').length,
  }

  // Competition totals for summary cards
  const competitionTotals = [
    { key: 'NOI', name: 'NOI 全国赛', total: noiMedals.gold + noiMedals.silver + noiMedals.bronze, color: '#805AD5' },
    { key: 'NOI邀请赛', name: 'NOI邀请赛', total: noiData.filter(x => x.rank?.includes('邀请赛')).length + noiD类Data.gold + noiD类Data.silver + noiD类Data.bronze, color: '#9F7AEA' },
    { key: 'WC', name: 'WC冬令营', total: 54, color: '#DD6B20' },
    { key: 'APIO', name: 'APIO', total: totalAPIO.gold + totalAPIO.silver + totalAPIO.bronze, color: '#38A169' },
    { key: 'NOIP提高', name: 'NOIP 提高组', total: noipAwardsData.first + noipAwardsData.second + noipAwardsData.third, color: '#E53E3E' },
    { key: 'NOIP普及', name: 'NOIP 普及组', total: noipPujiAwardsData.first + noipPujiAwardsData.second + noipPujiAwardsData.third, color: '#DD6B20' },
    { key: 'CSP-S', name: 'CSP-S', total: cspSData.first + cspSData.second + cspSData.third, color: '#3182CE' },
    { key: 'CSP-J', name: 'CSP-J', total: cspJData.first + cspJData.second + cspJData.third, color: '#38A169' },
  ]

  return (
    <div>
      <h1 className="page-title">统计分析</h1>

      {/* Competition Summary Cards - sorted by total participants */}
      <div style={{marginBottom: '2rem'}}>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem'}}>
          {competitionTotals.map(comp => (
            <div key={comp.key} style={{background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', cursor: 'pointer', border: selectedCompetition === comp.key ? '2px solid var(--primary)' : '2px solid transparent'}} onClick={() => { setSelectedCompetition(comp.key); setSelectedMedal(null); if(comp.key === 'NOIP提高') setNoipLevel('全部'); if(comp.key === 'NOIP普及') setNoipPujiLevel('全部'); if(comp.key === 'CSP-S') setCspSLevel('全部'); if(comp.key === 'CSP-J') setCspJLevel('全部'); }}>
              <h3 style={{color: comp.color, marginBottom: '0.25rem', fontSize: '1rem'}}>{comp.name}</h3>
              <p style={{color: '#718096', fontSize: '0.75rem', marginBottom: '0.75rem'}}>{comp.total}人</p>
              <div style={{display: 'flex', justifyContent: 'space-around', textAlign: 'center'}}>
                {comp.key === 'NOI' && <>
                  <div onClick={(e) => { e.stopPropagation(); setSelectedCompetition('NOI'); setSelectedMedal('金牌'); }}><div style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#856404', cursor: 'pointer'}}>{noiMedals.gold}</div><div style={{fontSize: '0.65rem', color: '#718096'}}>金牌</div></div>
                  <div onClick={(e) => { e.stopPropagation(); setSelectedCompetition('NOI'); setSelectedMedal('银牌'); }}><div style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#6c757d', cursor: 'pointer'}}>{noiMedals.silver}</div><div style={{fontSize: '0.65rem', color: '#718096'}}>银牌</div></div>
                  <div onClick={(e) => { e.stopPropagation(); setSelectedCompetition('NOI'); setSelectedMedal('铜牌'); }}><div style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#8B4513', cursor: 'pointer'}}>{noiMedals.bronze}</div><div style={{fontSize: '0.65rem', color: '#718096'}}>铜牌</div></div>
                </>}
                {comp.key === 'NOI邀请赛' && <>
                  <div onClick={(e) => { e.stopPropagation(); setSelectedCompetition('NOI邀请赛'); setSelectedMedal('金牌'); }}><div style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#856404', cursor: 'pointer'}}>{noiData.filter(x => x.rank === '邀请赛金牌').length + noiD类Data.gold}</div><div style={{fontSize: '0.65rem', color: '#718096'}}>金牌</div></div>
                  <div onClick={(e) => { e.stopPropagation(); setSelectedCompetition('NOI邀请赛'); setSelectedMedal('银牌'); }}><div style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#6c757d', cursor: 'pointer'}}>{noiData.filter(x => x.rank === '邀请赛银牌').length + noiD类Data.silver}</div><div style={{fontSize: '0.65rem', color: '#718096'}}>银牌</div></div>
                  <div onClick={(e) => { e.stopPropagation(); setSelectedCompetition('NOI邀请赛'); setSelectedMedal('铜牌'); }}><div style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#8B4513', cursor: 'pointer'}}>{noiData.filter(x => x.rank === '邀请赛铜牌').length + noiD类Data.bronze}</div><div style={{fontSize: '0.65rem', color: '#718096'}}>铜牌</div></div>
                </>}
                {comp.key === 'WC' && <>
                  <div onClick={(e) => { e.stopPropagation(); setSelectedCompetition('WC'); setSelectedMedal('金牌'); }}><div style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#856404', cursor: 'pointer'}}>8</div><div style={{fontSize: '0.65rem', color: '#718096'}}>金牌</div></div>
                  <div onClick={(e) => { e.stopPropagation(); setSelectedCompetition('WC'); setSelectedMedal('银牌'); }}><div style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#6c757d', cursor: 'pointer'}}>20</div><div style={{fontSize: '0.65rem', color: '#718096'}}>银牌</div></div>
                  <div onClick={(e) => { e.stopPropagation(); setSelectedCompetition('WC'); setSelectedMedal('铜牌'); }}><div style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#8B4513', cursor: 'pointer'}}>26</div><div style={{fontSize: '0.65rem', color: '#718096'}}>铜牌</div></div>
                </>}
                {comp.key === 'APIO' && <>
                  <div onClick={(e) => { e.stopPropagation(); setSelectedCompetition('APIO'); setSelectedMedal('金牌'); }}><div style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#856404', cursor: 'pointer'}}>{totalAPIO.gold}</div><div style={{fontSize: '0.65rem', color: '#718096'}}>金牌</div></div>
                  <div onClick={(e) => { e.stopPropagation(); setSelectedCompetition('APIO'); setSelectedMedal('银牌'); }}><div style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#6c757d', cursor: 'pointer'}}>{totalAPIO.silver}</div><div style={{fontSize: '0.65rem', color: '#718096'}}>银牌</div></div>
                  <div onClick={(e) => { e.stopPropagation(); setSelectedCompetition('APIO'); setSelectedMedal('铜牌'); }}><div style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#8B4513', cursor: 'pointer'}}>{totalAPIO.bronze}</div><div style={{fontSize: '0.65rem', color: '#718096'}}>铜牌</div></div>
                </>}
                {comp.key === 'NOIP提高' && <>
                  <div onClick={(e) => { e.stopPropagation(); setSelectedCompetition('NOIP提高'); setNoipLevel('一等奖'); }}><div style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#856404', cursor: 'pointer'}}>{noipAwardsData.first}</div><div style={{fontSize: '0.65rem', color: '#718096'}}>一等奖</div></div>
                  <div onClick={(e) => { e.stopPropagation(); setSelectedCompetition('NOIP提高'); setNoipLevel('二等奖'); }}><div style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#3182ce', cursor: 'pointer'}}>{noipAwardsData.second}</div><div style={{fontSize: '0.65rem', color: '#718096'}}>二等奖</div></div>
                  <div onClick={(e) => { e.stopPropagation(); setSelectedCompetition('NOIP提高'); setNoipLevel('三等奖'); }}><div style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#38A169', cursor: 'pointer'}}>{noipAwardsData.third}</div><div style={{fontSize: '0.65rem', color: '#718096'}}>三等奖</div></div>
                </>}
                {comp.key === 'NOIP普及' && <>
                  <div onClick={(e) => { e.stopPropagation(); setSelectedCompetition('NOIP普及'); setNoipPujiLevel('一等奖'); }}><div style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#856404', cursor: 'pointer'}}>{noipPujiAwardsData.first}</div><div style={{fontSize: '0.65rem', color: '#718096'}}>一等奖</div></div>
                  <div onClick={(e) => { e.stopPropagation(); setSelectedCompetition('NOIP普及'); setNoipPujiLevel('二等奖'); }}><div style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#3182ce', cursor: 'pointer'}}>{noipPujiAwardsData.second}</div><div style={{fontSize: '0.65rem', color: '#718096'}}>二等奖</div></div>
                  <div onClick={(e) => { e.stopPropagation(); setSelectedCompetition('NOIP普及'); setNoipPujiLevel('三等奖'); }}><div style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#38A169', cursor: 'pointer'}}>{noipPujiAwardsData.third}</div><div style={{fontSize: '0.65rem', color: '#718096'}}>三等奖</div></div>
                </>}
                {comp.key === 'CSP-S' && <>
                  <div onClick={(e) => { e.stopPropagation(); setSelectedCompetition('CSP-S'); setCspSLevel('一等奖'); }}><div style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#856404', cursor: 'pointer'}}>{cspSData.first}</div><div style={{fontSize: '0.65rem', color: '#718096'}}>一等奖</div></div>
                  <div onClick={(e) => { e.stopPropagation(); setSelectedCompetition('CSP-S'); setCspSLevel('二等奖'); }}><div style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#3182ce', cursor: 'pointer'}}>{cspSData.second}</div><div style={{fontSize: '0.65rem', color: '#718096'}}>二等奖</div></div>
                  <div onClick={(e) => { e.stopPropagation(); setSelectedCompetition('CSP-S'); setCspSLevel('三等奖'); }}><div style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#38A169', cursor: 'pointer'}}>{cspSData.third}</div><div style={{fontSize: '0.65rem', color: '#718096'}}>三等奖</div></div>
                </>}
                {comp.key === 'CSP-J' && <>
                  <div onClick={(e) => { e.stopPropagation(); setSelectedCompetition('CSP-J'); setCspJLevel('一等奖'); }}><div style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#856404', cursor: 'pointer'}}>{cspJData.first}</div><div style={{fontSize: '0.65rem', color: '#718096'}}>一等奖</div></div>
                  <div onClick={(e) => { e.stopPropagation(); setSelectedCompetition('CSP-J'); setCspJLevel('二等奖'); }}><div style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#3182ce', cursor: 'pointer'}}>{cspJData.second}</div><div style={{fontSize: '0.65rem', color: '#718096'}}>二等奖</div></div>
                  <div onClick={(e) => { e.stopPropagation(); setSelectedCompetition('CSP-J'); setCspJLevel('三等奖'); }}><div style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#38A169', cursor: 'pointer'}}>{cspJData.third}</div><div style={{fontSize: '0.65rem', color: '#718096'}}>三等奖</div></div>
                </>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Competition Table - for NOI, NOI邀请赛, WC, APIO */}
      {['NOI', 'NOI邀请赛', 'WC', 'APIO'].includes(selectedCompetition) && (
        <div className="card" style={{marginTop: '1rem'}}>
          <h3 className="card-title">
            {selectedCompetition === 'NOI' && '全国赛获奖选手 (NOI 2010-2025)'}
            {selectedCompetition === 'NOI邀请赛' && '邀请赛获奖选手 (NOI邀请赛 2012-2025)'}
            {selectedCompetition === 'WC' && 'WC冬令营获奖选手 (WC 2015-2026)'}
            {selectedCompetition === 'APIO' && 'APIO亚洲太平洋获奖选手 (APIO 2010-2025)'}
            {selectedMedal && <span style={{color: selectedMedal === '金牌' ? '#856404' : selectedMedal === '银牌' ? '#6c757d' : '#8B4513'}}> {selectedMedal}</span>}
          </h3>
          <div style={{maxHeight: '500px', overflowY: 'auto'}}>
            <table style={{width: '100%'}}>
              <tbody>
                {selectedCompetition === 'NOI' && (() => {
                  const noiItems = noiData.filter(item => {
                    const yearMatch = item.competition.match(/NOI(\d{4})/)
                    if (!yearMatch || parseInt(yearMatch[1]) < 2010) return false
                    if (item.rank?.includes('邀请赛')) return false
                    if (selectedMedal && item.rank !== selectedMedal) return false
                    return true
                  }).map(item => ({
                    name: item.name,
                    contest: item.competition,
                    pride: item.rank
                  }))
                  return noiItems.sort((a, b) => {
                    const yearA = parseInt(a.contest.match(/NOI(\d{4})/)?.[1] || 0)
                    const yearB = parseInt(b.contest.match(/NOI(\d{4})/)?.[1] || 0)
                    if (yearB !== yearA) return yearB - yearA
                    const order = { '金牌': 1, '银牌': 2, '铜牌': 3 }
                    return (order[a.pride] || 99) - (order[b.pride] || 99)
                  }).map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.name}</td>
                      <td style={{fontSize: '0.875rem', color: '#718096'}}>{item.contest}</td>
                      <td>
                        <span style={{
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          background: item.pride === '金牌' ? '#FFD700' : item.pride === '银牌' ? '#C0C0C0' : '#CD7F32',
                          color: item.pride === '金牌' ? '#000' : '#fff'
                        }}>
                          {item.pride}
                        </span>
                      </td>
                    </tr>
                  ))
                })()}
                {selectedCompetition === 'NOI邀请赛' && (() => {
                  const noiInviteItems = noiData.filter(item => {
                    if (!item.rank?.includes('邀请赛')) return false
                    if (selectedMedal && item.rank !== '邀请赛' + selectedMedal) return false
                    return true
                  }).map(item => ({
                    name: item.name,
                    contest: item.competition,
                    pride: item.rank
                  }))
                  const dLeiItems = awardsData.filter(item => {
                    if (!item.contest?.includes('D类')) return false
                    if (selectedMedal && item.pride !== selectedMedal) return false
                    return true
                  }).map(item => ({
                    name: item.name,
                    contest: item.contest,
                    pride: item.pride
                  }))
                  return [...noiInviteItems, ...dLeiItems].sort((a, b) => {
                    const yearA = parseInt(a.contest.match(/NOI(\d{4})/)?.[1] || 0)
                    const yearB = parseInt(b.contest.match(/NOI(\d{4})/)?.[1] || 0)
                    if (yearB !== yearA) return yearB - yearA
                    const order = { '金牌': 1, '银牌': 2, '铜牌': 3, '邀请赛金牌': 1, '邀请赛银牌': 2, '邀请赛铜牌': 3 }
                    return (order[a.pride] || 99) - (order[b.pride] || 99)
                  }).map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.name}</td>
                      <td style={{fontSize: '0.875rem', color: '#718096'}}>{item.contest}</td>
                      <td>
                        <span style={{
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          background: item.pride === '金牌' || item.pride === '邀请赛金牌' ? '#FFD700' : item.pride === '银牌' || item.pride === '邀请赛银牌' ? '#C0C0C0' : '#CD7F32',
                          color: item.pride === '金牌' || item.pride === '邀请赛金牌' ? '#000' : '#fff'
                        }}>
                          {item.pride}
                        </span>
                      </td>
                    </tr>
                  ))
                })()}
                {selectedCompetition === 'WC' && awardsData.filter(item => {
                  if (!item.contest?.startsWith('WC')) return false
                  if (selectedMedal && item.pride !== selectedMedal) return false
                  return true
                }).sort((a, b) => {
                  const yearA = parseInt(a.contest.match(/WC(\d{4})/)?.[1] || 0)
                  const yearB = parseInt(b.contest.match(/WC(\d{4})/)?.[1] || 0)
                  if (yearB !== yearA) return yearB - yearA
                  const order = { '金牌': 1, '银牌': 2, '铜牌': 3 }
                  return (order[a.pride] || 99) - (order[b.pride] || 99)
                }).map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.name}</td>
                    <td style={{fontSize: '0.875rem', color: '#718096'}}>{item.contest}</td>
                    <td>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        background: item.pride === '金牌' ? '#FFD700' : item.pride === '银牌' ? '#C0C0C0' : '#CD7F32',
                        color: item.pride === '金牌' ? '#000' : '#fff'
                      }}>
                        {item.pride}
                      </span>
                    </td>
                  </tr>
                ))}
                {selectedCompetition === 'APIO' && awardsData.filter(item => {
                  if (!item.contest?.startsWith('APIO')) return false
                  if (selectedMedal && item.pride !== selectedMedal) return false
                  return true
                }).sort((a, b) => {
                  const yearA = parseInt(a.contest.match(/APIO(\d{4})/)?.[1] || 0)
                  const yearB = parseInt(b.contest.match(/APIO(\d{4})/)?.[1] || 0)
                  if (yearB !== yearA) return yearB - yearA
                  const order = { '金牌': 1, '银牌': 2, '铜牌': 3 }
                  return (order[a.pride] || 99) - (order[b.pride] || 99)
                }).map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.name}</td>
                    <td style={{fontSize: '0.875rem', color: '#718096'}}>{item.contest}</td>
                    <td>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        background: item.pride === '金牌' ? '#FFD700' : item.pride === '银牌' ? '#C0C0C0' : '#CD7F32',
                        color: item.pride === '金牌' ? '#000' : '#fff'
                      }}>
                        {item.pride}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* NOIP提高组 Table */}
      {selectedCompetition === 'NOIP提高' && (
        <div className="card" style={{marginTop: '1rem'}}>
          <h3 className="card-title">NOIP 提高组成绩 {noipYear === '全部' ? '(全部年份)' : `(NOIP${noipYear})`}</h3>

          {/* Filters */}
          <div style={{display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center'}}>
            <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
              <span style={{fontWeight: 'bold', fontSize: '0.875rem'}}>年份:</span>
              <select
                value={noipYear}
                onChange={(e) => setNoipYear(e.target.value === '全部' ? '全部' : parseInt(e.target.value))}
                style={{
                  padding: '0.4rem',
                  borderRadius: '6px',
                  border: '2px solid var(--border)',
                  fontSize: '0.875rem'
                }}
              >
                <option value="全部">全部</option>
                {noipYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
              <span style={{fontWeight: 'bold', fontSize: '0.875rem'}}>等级:</span>
              <div style={{display: 'flex', gap: '0.25rem'}}>
                {['全部', '一等奖', '二等奖', '三等奖'].map(level => (
                  <button
                    key={level}
                    onClick={() => setNoipLevel(level)}
                    style={{
                      padding: '0.3rem 0.6rem',
                      borderRadius: '6px',
                      border: 'none',
                      cursor: 'pointer',
                      background: noipLevel === level ? 'var(--primary)' : '#E2E8F0',
                      color: noipLevel === level ? 'white' : 'var(--text)',
                      fontSize: '0.75rem',
                      fontWeight: noipLevel === level ? 'bold' : 'normal'
                    }}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={{maxHeight: '500px', overflowY: 'auto'}}>
            <table style={{width: '100%'}}>
              <thead>
                <tr>
                  <th style={{minWidth: '100px'}}>姓名</th>
                  <th>比赛</th>
                  <th>奖项</th>
                </tr>
              </thead>
              <tbody>
                {awardsData.filter(item => {
                  const yearMatch = item.contest.match(/NOIP(\d{4})/)
                  if (!yearMatch) return false
                  if (noipYear !== '全部' && parseInt(yearMatch[1]) !== noipYear) return false
                  if (parseInt(yearMatch[1]) < 2020 && !item.contest?.includes('提高')) return false
                  if (noipLevel !== '全部' && item.pride !== noipLevel) return false
                  return true
                }).sort((a, b) => {
                  const order = { '一等奖': 1, '二等奖': 2, '三等奖': 3 }
                  return (order[a.pride] || 99) - (order[b.pride] || 99)
                }).map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.name}</td>
                    <td style={{fontSize: '0.875rem', color: '#718096'}}>{item.contest}</td>
                    <td>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        background: item.pride === '一等奖' ? '#ED8936' : item.pride === '二等奖' ? '#3182CE' : '#38A169',
                        color: '#fff'
                      }}>
                        {item.pride}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Print button */}
          <div style={{marginTop: '1rem', display: 'flex', justifyContent: 'flex-end'}}>
            <button
              onClick={() => window.print()}
              style={{
                padding: '0.5rem 1rem',
                background: 'var(--primary)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              打印报表
            </button>
          </div>

          {/* Print-only report */}
          <div id="print-noip-tigong" style={{display: 'none'}}>
            <h2 style={{textAlign: 'center', marginBottom: '1rem'}}>NOIP 提高组成绩 {noipYear === '全部' ? '(全部年份)' : `(${noipYear}年)`} {noipLevel !== '全部' ? `- ${noipLevel}` : ''}</h2>
            <p style={{textAlign: 'center', marginBottom: '1rem', color: '#666'}}>
              共 {awardsData.filter(item => {
                const yearMatch = item.contest.match(/NOIP(\d{4})/)
                if (!yearMatch) return false
                if (noipYear !== '全部' && parseInt(yearMatch[1]) !== noipYear) return false
                if (parseInt(yearMatch[1]) < 2020 && !item.contest?.includes('提高')) return false
                if (noipLevel !== '全部' && item.pride !== noipLevel) return false
                return true
              }).length} 条记录
            </p>
            <table style={{width: '100%', borderCollapse: 'collapse'}}>
              <thead>
                <tr style={{background: '#ddd'}}>
                  <th style={{padding: '0.5rem', border: '1px solid #ccc', textAlign: 'left', minWidth: '100px'}}>姓名</th>
                  <th style={{padding: '0.5rem', border: '1px solid #ccc', textAlign: 'left'}}>比赛</th>
                  <th style={{padding: '0.5rem', border: '1px solid #ccc', textAlign: 'left'}}>奖项</th>
                </tr>
              </thead>
              <tbody>
                {awardsData.filter(item => {
                  const yearMatch = item.contest.match(/NOIP(\d{4})/)
                  if (!yearMatch) return false
                  if (noipYear !== '全部' && parseInt(yearMatch[1]) !== noipYear) return false
                  if (parseInt(yearMatch[1]) < 2020 && !item.contest?.includes('提高')) return false
                  if (noipLevel !== '全部' && item.pride !== noipLevel) return false
                  return true
                }).sort((a, b) => {
                  const order = { '一等奖': 1, '二等奖': 2, '三等奖': 3 }
                  return (order[a.pride] || 99) - (order[b.pride] || 99)
                }).map((item, idx) => (
                  <tr key={idx}>
                    <td style={{padding: '0.5rem', border: '1px solid #ccc'}}>{item.name}</td>
                    <td style={{padding: '0.5rem', border: '1px solid #ccc'}}>{item.contest}</td>
                    <td style={{padding: '0.5rem', border: '1px solid #ccc'}}>{item.pride}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* NOIP普及组 Table */}
      {selectedCompetition === 'NOIP普及' && (
        <div className="card" style={{marginTop: '1rem'}}>
          <h3 className="card-title">NOIP 普及组成绩 {noipPujiYear === '全部' ? '(全部年份)' : `(NOIP${noipPujiYear})`}</h3>

          {/* Filters */}
          <div style={{display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center'}}>
            <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
              <span style={{fontWeight: 'bold', fontSize: '0.875rem'}}>年份:</span>
              <select
                value={noipPujiYear}
                onChange={(e) => setNoipPujiYear(e.target.value === '全部' ? '全部' : parseInt(e.target.value))}
                style={{
                  padding: '0.4rem',
                  borderRadius: '6px',
                  border: '2px solid var(--border)',
                  fontSize: '0.875rem'
                }}
              >
                <option value="全部">全部</option>
                {noipPujiYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
              <span style={{fontWeight: 'bold', fontSize: '0.875rem'}}>等级:</span>
              <div style={{display: 'flex', gap: '0.25rem'}}>
                {['全部', '一等奖', '二等奖', '三等奖'].map(level => (
                  <button
                    key={level}
                    onClick={() => setNoipPujiLevel(level)}
                    style={{
                      padding: '0.3rem 0.6rem',
                      borderRadius: '6px',
                      border: 'none',
                      cursor: 'pointer',
                      background: noipPujiLevel === level ? 'var(--primary)' : '#E2E8F0',
                      color: noipPujiLevel === level ? 'white' : 'var(--text)',
                      fontSize: '0.75rem',
                      fontWeight: noipPujiLevel === level ? 'bold' : 'normal'
                    }}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={{maxHeight: '500px', overflowY: 'auto'}}>
            <table style={{width: '100%'}}>
              <thead>
                <tr>
                  <th style={{minWidth: '100px'}}>姓名</th>
                  <th>比赛</th>
                  <th>奖项</th>
                </tr>
              </thead>
              <tbody>
                {awardsData.filter(item => {
                  const yearMatch = item.contest.match(/NOIP(\d{4})/)
                  if (!yearMatch) return false
                  if (noipPujiYear !== '全部' && parseInt(yearMatch[1]) !== noipPujiYear) return false
                  if (!item.contest?.includes('普及')) return false
                  if (noipPujiLevel !== '全部' && item.pride !== noipPujiLevel) return false
                  return true
                }).sort((a, b) => {
                  const order = { '一等奖': 1, '二等奖': 2, '三等奖': 3 }
                  return (order[a.pride] || 99) - (order[b.pride] || 99)
                }).map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.name}</td>
                    <td style={{fontSize: '0.875rem', color: '#718096'}}>{item.contest}</td>
                    <td>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        background: item.pride === '一等奖' ? '#ED8936' : item.pride === '二等奖' ? '#3182CE' : '#38A169',
                        color: '#fff'
                      }}>
                        {item.pride}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Print button */}
          <div style={{marginTop: '1rem', display: 'flex', justifyContent: 'flex-end'}}>
            <button
              onClick={() => window.print()}
              style={{
                padding: '0.5rem 1rem',
                background: 'var(--primary)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              打印报表
            </button>
          </div>

          {/* Print-only report */}
          <div id="print-noip-puji" style={{display: 'none'}}>
            <h2 style={{textAlign: 'center', marginBottom: '1rem'}}>NOIP 普及组成绩 {noipPujiYear === '全部' ? '(全部年份)' : `(${noipPujiYear}年)`} {noipPujiLevel !== '全部' ? `- ${noipPujiLevel}` : ''}</h2>
            <p style={{textAlign: 'center', marginBottom: '1rem', color: '#666'}}>
              共 {awardsData.filter(item => {
                const yearMatch = item.contest.match(/NOIP(\d{4})/)
                if (!yearMatch) return false
                if (noipPujiYear !== '全部' && parseInt(yearMatch[1]) !== noipPujiYear) return false
                if (!item.contest?.includes('普及')) return false
                if (noipPujiLevel !== '全部' && item.pride !== noipPujiLevel) return false
                return true
              }).length} 条记录
            </p>
            <table style={{width: '100%', borderCollapse: 'collapse'}}>
              <thead>
                <tr style={{background: '#ddd'}}>
                  <th style={{padding: '0.5rem', border: '1px solid #ccc', textAlign: 'left', minWidth: '100px'}}>姓名</th>
                  <th style={{padding: '0.5rem', border: '1px solid #ccc', textAlign: 'left'}}>比赛</th>
                  <th style={{padding: '0.5rem', border: '1px solid #ccc', textAlign: 'left'}}>奖项</th>
                </tr>
              </thead>
              <tbody>
                {awardsData.filter(item => {
                  const yearMatch = item.contest.match(/NOIP(\d{4})/)
                  if (!yearMatch) return false
                  if (noipPujiYear !== '全部' && parseInt(yearMatch[1]) !== noipPujiYear) return false
                  if (!item.contest?.includes('普及')) return false
                  if (noipPujiLevel !== '全部' && item.pride !== noipPujiLevel) return false
                  return true
                }).sort((a, b) => {
                  const order = { '一等奖': 1, '二等奖': 2, '三等奖': 3 }
                  return (order[a.pride] || 99) - (order[b.pride] || 99)
                }).map((item, idx) => (
                  <tr key={idx}>
                    <td style={{padding: '0.5rem', border: '1px solid #ccc'}}>{item.name}</td>
                    <td style={{padding: '0.5rem', border: '1px solid #ccc'}}>{item.contest}</td>
                    <td style={{padding: '0.5rem', border: '1px solid #ccc'}}>{item.pride}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CSP-S Table */}
      {selectedCompetition === 'CSP-S' && (
        <div className="card" style={{marginTop: '1rem'}}>
          <h3 className="card-title">CSP-S 提高级成绩 {cspSYear === '全部' ? '(全部年份)' : `(CSP${cspSYear})`}</h3>

          {/* Filters */}
          <div style={{display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center'}}>
            <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
              <span style={{fontWeight: 'bold', fontSize: '0.875rem'}}>年份:</span>
              <select
                value={cspSYear}
                onChange={(e) => setCspSYear(e.target.value === '全部' ? '全部' : parseInt(e.target.value))}
                style={{
                  padding: '0.4rem',
                  borderRadius: '6px',
                  border: '2px solid var(--border)',
                  fontSize: '0.875rem'
                }}
              >
                <option value="全部">全部</option>
                {cspYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
              <span style={{fontWeight: 'bold', fontSize: '0.875rem'}}>等级:</span>
              <div style={{display: 'flex', gap: '0.25rem'}}>
                {['全部', '一等奖', '二等奖', '三等奖'].map(level => (
                  <button
                    key={level}
                    onClick={() => setCspSLevel(level)}
                    style={{
                      padding: '0.3rem 0.6rem',
                      borderRadius: '6px',
                      border: 'none',
                      cursor: 'pointer',
                      background: cspSLevel === level ? 'var(--primary)' : '#E2E8F0',
                      color: cspSLevel === level ? 'white' : 'var(--text)',
                      fontSize: '0.75rem',
                      fontWeight: cspSLevel === level ? 'bold' : 'normal'
                    }}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={{maxHeight: '500px', overflowY: 'auto'}}>
            <table style={{width: '100%'}}>
              <thead>
                <tr>
                  <th style={{minWidth: '100px'}}>姓名</th>
                  <th>比赛</th>
                  <th>奖项</th>
                </tr>
              </thead>
              <tbody>
                {awardsData.filter(item => {
                  const yearMatch = item.contest.match(/CSP(\d{4})/)
                  if (!yearMatch) return false
                  if (cspSYear !== '全部' && parseInt(yearMatch[1]) !== cspSYear) return false
                  if (!item.contest?.includes('-S') && !item.contest?.includes('提高')) return false
                  if (cspSLevel !== '全部' && item.pride !== cspSLevel) return false
                  return true
                }).sort((a, b) => {
                  const order = { '一等奖': 1, '二等奖': 2, '三等奖': 3 }
                  return (order[a.pride] || 99) - (order[b.pride] || 99)
                }).map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.name}</td>
                    <td style={{fontSize: '0.875rem', color: '#718096'}}>{item.contest}</td>
                    <td>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        background: item.pride === '一等奖' ? '#ED8936' : item.pride === '二等奖' ? '#3182CE' : '#38A169',
                        color: '#fff'
                      }}>
                        {item.pride}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Print button */}
          <div style={{marginTop: '1rem', display: 'flex', justifyContent: 'flex-end'}}>
            <button
              onClick={() => window.print()}
              style={{
                padding: '0.5rem 1rem',
                background: 'var(--primary)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              打印报表
            </button>
          </div>

          {/* Print-only report */}
          <div id="print-csp-s" style={{display: 'none'}}>
            <h2 style={{textAlign: 'center', marginBottom: '1rem'}}>CSP-S 提高级成绩 {cspSYear === '全部' ? '(全部年份)' : `(${cspSYear}年)`} {cspSLevel !== '全部' ? `- ${cspSLevel}` : ''}</h2>
            <p style={{textAlign: 'center', marginBottom: '1rem', color: '#666'}}>
              共 {awardsData.filter(item => {
                const yearMatch = item.contest.match(/CSP(\d{4})/)
                if (!yearMatch) return false
                if (cspSYear !== '全部' && parseInt(yearMatch[1]) !== cspSYear) return false
                if (!item.contest?.includes('-S') && !item.contest?.includes('提高')) return false
                if (cspSLevel !== '全部' && item.pride !== cspSLevel) return false
                return true
              }).length} 条记录
            </p>
            <table style={{width: '100%', borderCollapse: 'collapse'}}>
              <thead>
                <tr style={{background: '#ddd'}}>
                  <th style={{padding: '0.5rem', border: '1px solid #ccc', textAlign: 'left', minWidth: '100px'}}>姓名</th>
                  <th style={{padding: '0.5rem', border: '1px solid #ccc', textAlign: 'left'}}>比赛</th>
                  <th style={{padding: '0.5rem', border: '1px solid #ccc', textAlign: 'left'}}>奖项</th>
                </tr>
              </thead>
              <tbody>
                {awardsData.filter(item => {
                  const yearMatch = item.contest.match(/CSP(\d{4})/)
                  if (!yearMatch) return false
                  if (cspSYear !== '全部' && parseInt(yearMatch[1]) !== cspSYear) return false
                  if (!item.contest?.includes('-S') && !item.contest?.includes('提高')) return false
                  if (cspSLevel !== '全部' && item.pride !== cspSLevel) return false
                  return true
                }).sort((a, b) => {
                  const order = { '一等奖': 1, '二等奖': 2, '三等奖': 3 }
                  return (order[a.pride] || 99) - (order[b.pride] || 99)
                }).map((item, idx) => (
                  <tr key={idx}>
                    <td style={{padding: '0.5rem', border: '1px solid #ccc'}}>{item.name}</td>
                    <td style={{padding: '0.5rem', border: '1px solid #ccc'}}>{item.contest}</td>
                    <td style={{padding: '0.5rem', border: '1px solid #ccc'}}>{item.pride}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CSP-J Table */}
      {selectedCompetition === 'CSP-J' && (
        <div className="card" style={{marginTop: '1rem'}}>
          <h3 className="card-title">CSP-J 入门级成绩 {cspJYear === '全部' ? '(全部年份)' : `(CSP${cspJYear})`}</h3>

          {/* Filters */}
          <div style={{display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center'}}>
            <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
              <span style={{fontWeight: 'bold', fontSize: '0.875rem'}}>年份:</span>
              <select
                value={cspJYear}
                onChange={(e) => setCspJYear(e.target.value === '全部' ? '全部' : parseInt(e.target.value))}
                style={{
                  padding: '0.4rem',
                  borderRadius: '6px',
                  border: '2px solid var(--border)',
                  fontSize: '0.875rem'
                }}
              >
                <option value="全部">全部</option>
                {cspYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
              <span style={{fontWeight: 'bold', fontSize: '0.875rem'}}>等级:</span>
              <div style={{display: 'flex', gap: '0.25rem'}}>
                {['全部', '一等奖', '二等奖', '三等奖'].map(level => (
                  <button
                    key={level}
                    onClick={() => setCspJLevel(level)}
                    style={{
                      padding: '0.3rem 0.6rem',
                      borderRadius: '6px',
                      border: 'none',
                      cursor: 'pointer',
                      background: cspJLevel === level ? 'var(--primary)' : '#E2E8F0',
                      color: cspJLevel === level ? 'white' : 'var(--text)',
                      fontSize: '0.75rem',
                      fontWeight: cspJLevel === level ? 'bold' : 'normal'
                    }}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={{maxHeight: '500px', overflowY: 'auto'}}>
            <table style={{width: '100%'}}>
              <thead>
                <tr>
                  <th style={{minWidth: '100px'}}>姓名</th>
                  <th>比赛</th>
                  <th>奖项</th>
                </tr>
              </thead>
              <tbody>
                {awardsData.filter(item => {
                  const yearMatch = item.contest.match(/CSP(\d{4})/)
                  if (!yearMatch) return false
                  if (cspJYear !== '全部' && parseInt(yearMatch[1]) !== cspJYear) return false
                  if (!item.contest?.includes('-J') && !item.contest?.includes('入门')) return false
                  if (cspJLevel !== '全部' && item.pride !== cspJLevel) return false
                  return true
                }).sort((a, b) => {
                  const order = { '一等奖': 1, '二等奖': 2, '三等奖': 3 }
                  return (order[a.pride] || 99) - (order[b.pride] || 99)
                }).map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.name}</td>
                    <td style={{fontSize: '0.875rem', color: '#718096'}}>{item.contest}</td>
                    <td>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        background: item.pride === '一等奖' ? '#ED8936' : item.pride === '二等奖' ? '#3182CE' : '#38A169',
                        color: '#fff'
                      }}>
                        {item.pride}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Print button */}
          <div style={{marginTop: '1rem', display: 'flex', justifyContent: 'flex-end'}}>
            <button
              onClick={() => window.print()}
              style={{
                padding: '0.5rem 1rem',
                background: 'var(--primary)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              打印报表
            </button>
          </div>

          {/* Print-only report */}
          <div id="print-csp-j" style={{display: 'none'}}>
            <h2 style={{textAlign: 'center', marginBottom: '1rem'}}>CSP-J 入门级成绩 {cspJYear === '全部' ? '(全部年份)' : `(${cspJYear}年)`} {cspJLevel !== '全部' ? `- ${cspJLevel}` : ''}</h2>
            <p style={{textAlign: 'center', marginBottom: '1rem', color: '#666'}}>
              共 {awardsData.filter(item => {
                const yearMatch = item.contest.match(/CSP(\d{4})/)
                if (!yearMatch) return false
                if (cspJYear !== '全部' && parseInt(yearMatch[1]) !== cspJYear) return false
                if (!item.contest?.includes('-J') && !item.contest?.includes('入门')) return false
                if (cspJLevel !== '全部' && item.pride !== cspJLevel) return false
                return true
              }).length} 条记录
            </p>
            <table style={{width: '100%', borderCollapse: 'collapse'}}>
              <thead>
                <tr style={{background: '#ddd'}}>
                  <th style={{padding: '0.5rem', border: '1px solid #ccc', textAlign: 'left', minWidth: '100px'}}>姓名</th>
                  <th style={{padding: '0.5rem', border: '1px solid #ccc', textAlign: 'left'}}>比赛</th>
                  <th style={{padding: '0.5rem', border: '1px solid #ccc', textAlign: 'left'}}>奖项</th>
                </tr>
              </thead>
              <tbody>
                {awardsData.filter(item => {
                  const yearMatch = item.contest.match(/CSP(\d{4})/)
                  if (!yearMatch) return false
                  if (cspJYear !== '全部' && parseInt(yearMatch[1]) !== cspJYear) return false
                  if (!item.contest?.includes('-J') && !item.contest?.includes('入门')) return false
                  if (cspJLevel !== '全部' && item.pride !== cspJLevel) return false
                  return true
                }).sort((a, b) => {
                  const order = { '一等奖': 1, '二等奖': 2, '三等奖': 3 }
                  return (order[a.pride] || 99) - (order[b.pride] || 99)
                }).map((item, idx) => (
                  <tr key={idx}>
                    <td style={{padding: '0.5rem', border: '1px solid #ccc'}}>{item.name}</td>
                    <td style={{padding: '0.5rem', border: '1px solid #ccc'}}>{item.contest}</td>
                    <td style={{padding: '0.5rem', border: '1px solid #ccc'}}>{item.pride}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Additional info */}
      <div className="card" style={{marginTop: '1rem'}}>
        <h3 className="card-title">数据说明</h3>
        <ul style={{paddingLeft: '1.5rem', color: '#718096'}}>
          <li>NOIP: 全国青少年信息学联赛，省级奖项</li>
          <li>CSP: 计算机软件能力认证，分为入门级(J)和提高级(S)</li>
          <li>APIO: 亚洲太平洋地区信息学奥林匹克</li>
          <li>NOI: 全国青少年信息学奥林匹克竞赛国家级奖项</li>
        </ul>
      </div>
    </div>
  )
}

export default Statistics