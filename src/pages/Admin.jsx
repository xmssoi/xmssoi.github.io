import { useState } from 'react'
import { useData } from '../context/DataContext'

function Admin() {
  const [activeTab, setActiveTab] = useState('stats')
  const { awards, noip, csp, apio, noi } = useData()

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 className="page-title" style={{ margin: 0 }}>数据统计</h1>
      </div>

      {/* Tab navigation */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', borderBottom: '2px solid var(--border)' }}>
        {['stats', 'awards', 'noip', 'csp', 'apio', 'noi', 'wc', 'historical'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.75rem 1rem',
              border: 'none',
              background: 'transparent',
              color: activeTab === tab ? 'var(--primary)' : 'var(--text)',
              cursor: 'pointer',
              borderRadius: '6px 6px 0 0',
              fontWeight: 'bold',
              borderBottom: activeTab === tab ? '3px solid var(--primary)' : '3px solid transparent'
            }}
          >
            {tab === 'stats' ? '统计概览' :
             tab === 'awards' ? '获奖记录' :
             tab === 'noip' ? 'NOIP数据' :
             tab === 'csp' ? 'CSP数据' :
             tab === 'apio' ? 'APIO数据' :
             tab === 'noi' ? 'NOI数据' :
             tab === 'wc' ? 'WC冬令营' :
             tab === 'historical' ? '历史数据' : tab}
          </button>
        ))}
      </div>

      {/* Stats Overview */}
      {activeTab === 'stats' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
            <div className="stat-card">
              <div className="stat-value">{awards.length}</div>
              <div className="stat-label">获奖记录</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{noip.length}</div>
              <div className="stat-label">NOIP年份</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{csp.length}</div>
              <div className="stat-label">CSP年份</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{apio.length}</div>
              <div className="stat-label">APIO年份</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{noi.length}</div>
              <div className="stat-label">NOI记录</div>
            </div>
          </div>
        </div>
      )}

      {/* Awards List */}
      {activeTab === 'awards' && (
        <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>获奖记录列表</h3>
            <span style={{ color: '#718096' }}>共 {awards.length} 条记录</span>
          </div>
          <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#F7FAFC', position: 'sticky', top: 0 }}>
                <tr>
                  <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid var(--border)' }}>姓名</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid var(--border)' }}>比赛</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid var(--border)' }}>奖项</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid var(--border)' }}>年级</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid var(--border)' }}>学校</th>
                </tr>
              </thead>
              <tbody>
                {awards.map((award, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #EDF2F7' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 'bold', color: 'var(--primary)' }}>{award.name}</td>
                    <td style={{ padding: '0.75rem' }}>{award.contest}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.875rem',
                        fontWeight: 'bold',
                        background: award.pride.includes('金牌') ? '#FFD700' :
                                   award.pride.includes('银牌') ? '#C0C0C0' :
                                   award.pride.includes('铜牌') ? '#CD7F32' :
                                   '#E2E8F0'
                      }}>
                        {award.pride}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem' }}>{award.grade || '-'}</td>
                    <td style={{ padding: '0.75rem' }}>{award.school || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* NOIP Data */}
      {activeTab === 'noip' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {/* 提高组 */}
          <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', padding: '1rem' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>NOIP 提高组</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F7FAFC' }}>
                  <th style={{ padding: '0.5rem', textAlign: 'center', borderBottom: '1px solid var(--border)', fontSize: '0.875rem' }}>年份</th>
                  <th style={{ padding: '0.5rem', textAlign: 'center', borderBottom: '1px solid var(--border)', fontSize: '0.875rem', color: '#856404' }}>一等奖</th>
                  <th style={{ padding: '0.5rem', textAlign: 'center', borderBottom: '1px solid var(--border)', fontSize: '0.875rem', color: '#3182ce' }}>二等奖</th>
                  <th style={{ padding: '0.5rem', textAlign: 'center', borderBottom: '1px solid var(--border)', fontSize: '0.875rem', color: '#38A169' }}>三等奖</th>
                  <th style={{ padding: '0.5rem', textAlign: 'center', borderBottom: '1px solid var(--border)', fontSize: '0.875rem' }}>人次</th>
                </tr>
              </thead>
              <tbody>
                {[...noip].reverse().map((yearData, idx) => yearData.提高组 && (
                  <tr key={idx} style={{ borderBottom: '1px solid #EDF2F7' }}>
                    <td style={{ padding: '0.5rem', textAlign: 'center', fontWeight: 'bold' }}>{yearData.year}</td>
                    <td style={{ padding: '0.5rem', textAlign: 'center', fontWeight: 'bold', color: '#856404' }}>{yearData.提高组.一等奖 || 0}</td>
                    <td style={{ padding: '0.5rem', textAlign: 'center', fontWeight: 'bold', color: '#3182ce' }}>{yearData.提高组.二等奖 || 0}</td>
                    <td style={{ padding: '0.5rem', textAlign: 'center', fontWeight: 'bold', color: '#38A169' }}>{yearData.提高组.三等奖 || 0}</td>
                    <td style={{ padding: '0.5rem', textAlign: 'center', fontSize: '0.875rem' }}>{yearData.提高组.获奖人次 || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 普及组 */}
          <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', padding: '1rem' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--secondary)' }}>NOIP 普及组</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F7FAFC' }}>
                  <th style={{ padding: '0.5rem', textAlign: 'center', borderBottom: '1px solid var(--border)', fontSize: '0.875rem' }}>年份</th>
                  <th style={{ padding: '0.5rem', textAlign: 'center', borderBottom: '1px solid var(--border)', fontSize: '0.875rem', color: '#856404' }}>一等奖</th>
                  <th style={{ padding: '0.5rem', textAlign: 'center', borderBottom: '1px solid var(--border)', fontSize: '0.875rem', color: '#3182ce' }}>二等奖</th>
                  <th style={{ padding: '0.5rem', textAlign: 'center', borderBottom: '1px solid var(--border)', fontSize: '0.875rem', color: '#38A169' }}>三等奖</th>
                  <th style={{ padding: '0.5rem', textAlign: 'center', borderBottom: '1px solid var(--border)', fontSize: '0.875rem' }}>人次</th>
                </tr>
              </thead>
              <tbody>
                {[...noip].reverse().map((yearData, idx) => yearData.普及组 && (
                  <tr key={idx} style={{ borderBottom: '1px solid #EDF2F7' }}>
                    <td style={{ padding: '0.5rem', textAlign: 'center', fontWeight: 'bold' }}>{yearData.year}</td>
                    <td style={{ padding: '0.5rem', textAlign: 'center', fontWeight: 'bold', color: '#856404' }}>{yearData.普及组.一等奖 || 0}</td>
                    <td style={{ padding: '0.5rem', textAlign: 'center', fontWeight: 'bold', color: '#3182ce' }}>{yearData.普及组.二等奖 || 0}</td>
                    <td style={{ padding: '0.5rem', textAlign: 'center', fontWeight: 'bold', color: '#38A169' }}>{yearData.普及组.三等奖 || 0}</td>
                    <td style={{ padding: '0.5rem', textAlign: 'center', fontSize: '0.875rem' }}>{yearData.普及组.获奖人次 || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CSP Data */}
      {activeTab === 'csp' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', padding: '1rem' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>CSP-S 提高级</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F7FAFC' }}>
                  <th style={{ padding: '0.5rem', textAlign: 'center', borderBottom: '1px solid var(--border)', fontSize: '0.875rem' }}>年份</th>
                  <th style={{ padding: '0.5rem', textAlign: 'center', borderBottom: '1px solid var(--border)', fontSize: '0.875rem', color: '#856404' }}>一等奖</th>
                  <th style={{ padding: '0.5rem', textAlign: 'center', borderBottom: '1px solid var(--border)', fontSize: '0.875rem', color: '#3182ce' }}>二等奖</th>
                  <th style={{ padding: '0.5rem', textAlign: 'center', borderBottom: '1px solid var(--border)', fontSize: '0.875rem', color: '#38A169' }}>三等奖</th>
                </tr>
              </thead>
              <tbody>
                {[...csp].reverse().map((yearData, idx) => yearData['CSP-S'] && (
                  <tr key={idx} style={{ borderBottom: '1px solid #EDF2F7' }}>
                    <td style={{ padding: '0.5rem', textAlign: 'center', fontWeight: 'bold' }}>{yearData.year}</td>
                    <td style={{ padding: '0.5rem', textAlign: 'center', fontWeight: 'bold', color: '#856404' }}>{yearData['CSP-S'].一等奖 || 0}</td>
                    <td style={{ padding: '0.5rem', textAlign: 'center', fontWeight: 'bold', color: '#3182ce' }}>{yearData['CSP-S'].二等奖 || 0}</td>
                    <td style={{ padding: '0.5rem', textAlign: 'center', fontWeight: 'bold', color: '#38A169' }}>{yearData['CSP-S'].三等奖 || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', padding: '1rem' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--secondary)' }}>CSP-J 入门级</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F7FAFC' }}>
                  <th style={{ padding: '0.5rem', textAlign: 'center', borderBottom: '1px solid var(--border)', fontSize: '0.875rem' }}>年份</th>
                  <th style={{ padding: '0.5rem', textAlign: 'center', borderBottom: '1px solid var(--border)', fontSize: '0.875rem', color: '#856404' }}>一等奖</th>
                  <th style={{ padding: '0.5rem', textAlign: 'center', borderBottom: '1px solid var(--border)', fontSize: '0.875rem', color: '#3182ce' }}>二等奖</th>
                  <th style={{ padding: '0.5rem', textAlign: 'center', borderBottom: '1px solid var(--border)', fontSize: '0.875rem', color: '#38A169' }}>三等奖</th>
                </tr>
              </thead>
              <tbody>
                {[...csp].reverse().map((yearData, idx) => yearData['CSP-J'] && (
                  <tr key={idx} style={{ borderBottom: '1px solid #EDF2F7' }}>
                    <td style={{ padding: '0.5rem', textAlign: 'center', fontWeight: 'bold' }}>{yearData.year}</td>
                    <td style={{ padding: '0.5rem', textAlign: 'center', fontWeight: 'bold', color: '#856404' }}>{yearData['CSP-J'].一等奖 || 0}</td>
                    <td style={{ padding: '0.5rem', textAlign: 'center', fontWeight: 'bold', color: '#3182ce' }}>{yearData['CSP-J'].二等奖 || 0}</td>
                    <td style={{ padding: '0.5rem', textAlign: 'center', fontWeight: 'bold', color: '#38A169' }}>{yearData['CSP-J'].三等奖 || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* APIO Data */}
      {activeTab === 'apio' && (
        <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', padding: '1rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>APIO 年度统计</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
            <thead>
              <tr style={{ background: '#F7FAFC' }}>
                <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '1px solid var(--border)' }}>年份</th>
                <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '1px solid var(--border)', color: '#856404' }}>金牌</th>
                <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '1px solid var(--border)', color: '#6c757d' }}>银牌</th>
                <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '1px solid var(--border)', color: '#8B4513' }}>铜牌</th>
                <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '1px solid var(--border)' }}>总数</th>
              </tr>
            </thead>
            <tbody>
              {[...apio].reverse().map((data, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #EDF2F7' }}>
                  <td style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 'bold' }}>{data.year}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 'bold', color: '#856404' }}>{data.金牌 || 0}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 'bold', color: '#6c757d' }}>{data.银牌 || 0}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 'bold', color: '#8B4513' }}>{data.铜牌 || 0}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center' }}>{data.总数 || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* NOI Data */}
      {activeTab === 'noi' && (
        <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', padding: '1rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>NOI 年度统计</h3>
          {(() => {
            const getYear = (comp) => {
              const match = comp.match(/NOI(\d{4})/)
              return match ? match[1] : null
            }
            const yearStats = {}
            noi.forEach(r => {
              const y = getYear(r.competition)
              if (!y) return
              if (!yearStats[y]) {
                yearStats[y] = { 金牌: 0, 银牌: 0, 铜牌: 0, 邀请赛金牌: 0, 邀请赛银牌: 0, 邀请赛铜牌: 0 }
              }
              if (yearStats[y][r.rank] !== undefined) yearStats[y][r.rank]++
            })
            const years = Object.keys(yearStats).sort((a, b) => b - a)
            return (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#F7FAFC' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '1px solid var(--border)' }}>年份</th>
                    <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '1px solid var(--border)', color: '#856404' }}>金牌</th>
                    <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '1px solid var(--border)', color: '#6c757d' }}>银牌</th>
                    <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '1px solid var(--border)', color: '#8B4513' }}>铜牌</th>
                  </tr>
                </thead>
                <tbody>
                  {years.map(y => (
                    <tr key={y} style={{ borderBottom: '1px solid #EDF2F7' }}>
                      <td style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 'bold' }}>{y}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 'bold', color: '#856404' }}>{yearStats[y].金牌}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 'bold', color: '#6c757d' }}>{yearStats[y].银牌}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 'bold', color: '#8B4513' }}>{yearStats[y].铜牌}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          })()}
        </div>
      )}

      {/* WC Data */}
      {activeTab === 'wc' && (
        <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', padding: '1rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>WC 冬令营年度统计</h3>
          {(() => {
            const wcStats = {}
            awards.forEach(a => {
              const contest = a.contest || ''
              if (!contest.includes('WC')) return
              const match = contest.match(/WC(\d{4})/)
              if (!match) return
              const year = match[1]
              if (!wcStats[year]) wcStats[year] = { 金牌: 0, 银牌: 0, 铜牌: 0 }
              if (a.pride === '金牌') wcStats[year].金牌++
              else if (a.pride === '银牌') wcStats[year].银牌++
              else if (a.pride === '铜牌') wcStats[year].铜牌++
            })
            const years = Object.keys(wcStats).sort((a, b) => b - a)
            return (
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
                <thead>
                  <tr style={{ background: '#F7FAFC' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '1px solid var(--border)' }}>年份</th>
                    <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '1px solid var(--border)', color: '#856404' }}>金牌</th>
                    <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '1px solid var(--border)', color: '#6c757d' }}>银牌</th>
                    <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '1px solid var(--border)', color: '#8B4513' }}>铜牌</th>
                    <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '1px solid var(--border)' }}>总数</th>
                  </tr>
                </thead>
                <tbody>
                  {years.map(y => (
                    <tr key={y} style={{ borderBottom: '1px solid #EDF2F7' }}>
                      <td style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 'bold' }}>{y}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 'bold', color: '#856404' }}>{wcStats[y].金牌}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 'bold', color: '#6c757d' }}>{wcStats[y].银牌}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 'bold', color: '#8B4513' }}>{wcStats[y].铜牌}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'center' }}>{wcStats[y].金牌 + wcStats[y].银牌 + wcStats[y].铜牌}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          })()}
        </div>
      )}

      {/* Historical Data */}
      {activeTab === 'historical' && (
        <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', padding: '1rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>全国青少年计算机程序设计竞赛 (1985-1994)</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
            <thead>
              <tr style={{ background: '#F7FAFC' }}>
                <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '1px solid var(--border)' }}>年份</th>
                <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '1px solid var(--border)', color: '#856404' }}>一等奖</th>
                <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '1px solid var(--border)', color: '#3182ce' }}>二等奖</th>
                <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '1px solid var(--border)', color: '#38A169' }}>三等奖</th>
               <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '1px solid var(--border)' }}>人次</th>
              </tr>
            </thead>
            <tbody>
              {noip.filter(y => y.year >= 1985 && y.year <= 1994).map((yearData, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #EDF2F7' }}>
                  <td style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 'bold' }}>{yearData.year}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 'bold', color: '#856404' }}>{(yearData.提高组?.一等奖 || 0) + (yearData.普及组?.一等奖 || 0)}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 'bold', color: '#3182ce' }}>{(yearData.提高组?.二等奖 || 0) + (yearData.普及组?.二等奖 || 0)}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 'bold', color: '#38A169' }}>{(yearData.提高组?.三等奖 || 0) + (yearData.普及组?.三等奖 || 0)}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center' }}>{(yearData.提高组?.获奖人次 || 0) + (yearData.普及组?.获奖人次 || 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Admin