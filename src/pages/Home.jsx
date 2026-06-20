import { Link, useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import { useData } from '../context/DataContext'

function Home() {
  const [showLightbox, setShowLightbox] = useState(false)
  const [expandedAward, setExpandedAward] = useState(null)
  const { awards: awardsData, noip: noipData, csp: cspData, apio: apioData, noi: noiData } = useData()

  const totalYears = 2025 - 1985 + 1

  // NOIP stats from awards.json (consistent with timeline)
  const noipTotalFirst = awardsData.filter(a => {
    const match = a.contest.match(/NOIP(\d{4})/)
    if (!match) return false
    if (parseInt(match[1]) >= 2020) return a.pride === '一等奖'
    return a.contest.includes('提高') && a.pride === '一等奖'
  }).length

  const noipTotalSecond = awardsData.filter(a => {
    const match = a.contest.match(/NOIP(\d{4})/)
    if (!match) return false
    if (parseInt(match[1]) >= 2020) return a.pride === '二等奖'
    return a.contest.includes('提高') && a.pride === '二等奖'
  }).length

  const noipTotalThird = awardsData.filter(a => {
    const match = a.contest.match(/NOIP(\d{4})/)
    if (!match) return false
    if (parseInt(match[1]) >= 2020) return a.pride === '三等奖'
    return a.contest.includes('提高') && a.pride === '三等奖'
  }).length

  const latestYear = noipData[noipData.length - 1]?.year

  // NOIP total awards count
  const totalAwards = noipData.reduce((sum, y) => {
    return sum + (y.提高组?.获奖人次 || 0) + (y.普及组?.获奖人次 || 0)
  }, 0)

  // CSP stats
  const cspTotal = cspData.reduce((sum, y) => {
    return sum + (y['CSP-S']?.获奖人次 || 0) + (y['CSP-J']?.获奖人次 || 0)
  }, 0)

  // APIO stats
  const apioTotal = apioData.reduce((sum, y) => sum + (y.总数 || 0), 0)
  const apioGold = apioData.reduce((sum, y) => sum + (y.金牌 || 0), 0)

  // NOI stats (only noi.json, NOT D类)
  const noiGold = noiData.filter(x => x.rank === '金牌').length
  const noiSilver = noiData.filter(x => x.rank === '银牌').length
  const noiBronze = noiData.filter(x => x.rank === '铜牌').length

  // NOI D类 records from awards.json (D类 = NOI邀请赛)
  const noiD类Data = {
    gold: awardsData.filter(a => a.contest?.includes('D类') && a.pride === '金牌').length,
    silver: awardsData.filter(a => a.contest?.includes('D类') && a.pride === '银牌').length,
    bronze: awardsData.filter(a => a.contest?.includes('D类') && a.pride === '铜牌').length,
  }

  // NOI邀请赛 stats (D类 =邀请赛, same award type)
  const noiInviteGold = noiData.filter(x => x.rank === '邀请赛金牌').length + noiD类Data.gold
  const noiInviteSilver = noiData.filter(x => x.rank === '邀请赛银牌').length + noiD类Data.silver
  const noiInviteBronze = noiData.filter(x => x.rank === '邀请赛铜牌').length + noiD类Data.bronze

  // WC stats (from awards.json WC entries)
  const wcGold = 8
  const wcSilver = 20
  const wcBronze = 26

  return (
    <div>
      {/* Two column layout: left 1985 milestone (1/3), right history image (2/3) */}
      <div style={{display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', marginBottom: '2rem', alignItems: 'stretch'}}>
        {/* Left column: 1985 Milestone */}
        <div style={{background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderLeft: '4px solid var(--accent)', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
          <div style={{marginBottom: '1rem'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
              <div style={{background: 'var(--primary)', color: 'white', padding: '0.5rem 1rem', borderRadius: '8px', textAlign: 'center', minWidth: '90px'}}>
                <div style={{fontSize: '0.8rem'}}>1985年</div>
                <div style={{fontSize: '1.5rem', fontWeight: 'bold'}}>10月8日</div>
              </div>
              <div style={{flex: 1, textAlign: 'left'}}>
                <div style={{fontSize: '1rem', fontWeight: 'bold', color: 'var(--primary)'}}>建校67周年庆祝大会</div>
                <div style={{fontSize: '0.9rem', color: 'var(--primary)', marginTop: '0.5rem'}}>微电脑实验室开机典礼</div>
              </div>
            </div>
          </div>
          <div style={{fontSize: '0.9rem', color: '#4a5568', lineHeight: '1.8'}}>
            海外校友韩振东、余金波共同捐赠IBM—PC电脑16台、APPLE—Ⅱ电脑18台。
          </div>
        </div>

        {/* Right column: History Image */}
        <div style={{display: 'flex', alignItems: 'center'}}>
          <img
            src="/history.JPG"
            alt="双十中学信息学竞赛历程"
            onClick={() => setShowLightbox(true)}
            style={{width: '100%', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', cursor: 'pointer'}}
          />
        </div>
      </div>

      {/* Stats - full width below */}
      <div className="hero-section" style={{padding: '1rem', marginBottom: '2rem'}}>
        <div className="quick-stats" style={{gap: '2rem'}}>
          <Link to="/timeline" style={{textDecoration: 'none', color: 'inherit'}}>
            <div className="quick-stat" style={{cursor: 'pointer'}}>
              <div className="quick-stat-value" style={{fontSize: '1.5rem'}}>{totalYears}</div>
              <div className="quick-stat-label">年历史</div>
            </div>
          </Link>
          <Link to="/statistics?comp=NOIP" style={{textDecoration: 'none', color: 'inherit'}}>
            <div className="quick-stat" style={{cursor: 'pointer'}}>
              <div className="quick-stat-value" style={{fontSize: '1.5rem'}}>{totalAwards}</div>
              <div className="quick-stat-label">NOIP获奖人次</div>
            </div>
          </Link>
          <Link to="/statistics?comp=APIO&medal=金牌" style={{textDecoration: 'none', color: 'inherit'}}>
            <div className="quick-stat" style={{cursor: 'pointer'}}>
              <div className="quick-stat-value" style={{fontSize: '1.5rem'}}>{apioGold}</div>
              <div className="quick-stat-label">APIO金牌</div>
            </div>
          </Link>
          <Link to="/statistics?comp=NOI&medal=金牌" style={{textDecoration: 'none', color: 'inherit'}}>
            <div className="quick-stat" style={{cursor: 'pointer'}}>
              <div className="quick-stat-value" style={{fontSize: '1.5rem'}}>{noiGold}</div>
              <div className="quick-stat-label">NOI金牌</div>
            </div>
          </Link>
          <Link to="/statistics?comp=WC&medal=金牌" style={{textDecoration: 'none', color: 'inherit'}}>
            <div className="quick-stat" style={{cursor: 'pointer'}}>
              <div className="quick-stat-value" style={{fontSize: '1.5rem'}}>{wcGold}</div>
              <div className="quick-stat-label">WC金牌</div>
            </div>
          </Link>
        </div>
      </div>

      {/* Lightbox Modal */}
      {showLightbox && (
        <div
          onClick={() => setShowLightbox(false)}
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
            zIndex: 1000,
            cursor: 'pointer'
          }}
        >
          <img
            src={showLightbox === true ? '/history.JPG' : showLightbox}
            alt="奖状"
            style={{maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain'}}
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

      {/* Competition Summary Cards */}
     <div style={{marginBottom: '2rem'}}>
        {/* Row 1: NOI, NOI邀请赛, WC, APIO */}
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1rem'}}>
          {/* NOI */}
          <div style={{background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
            <h3 style={{color: 'var(--primary)', marginBottom: '0.25rem', fontSize: '1rem'}}>NOI 全国赛</h3>
            <p style={{color: '#718096', fontSize: '0.75rem', marginBottom: '0.75rem'}}>2010-2025</p>
            <div style={{display: 'flex', justifyContent: 'space-around', textAlign: 'center'}}>
              <div>
                <div style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#856404'}}>{noiGold}</div>
                <div style={{fontSize: '0.65rem', color: '#718096'}}>金牌</div>
              </div>
              <div>
                <div style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#6c757d'}}>{noiSilver}</div>
                <div style={{fontSize: '0.65rem', color: '#718096'}}>银牌</div>
              </div>
              <div>
                <div style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#8B4513'}}>{noiBronze}</div>
                <div style={{fontSize: '0.65rem', color: '#718096'}}>铜牌</div>
              </div>
            </div>
          </div>

          {/* NOI邀请赛 */}
          <div style={{background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
            <h3 style={{color: 'var(--primary)', marginBottom: '0.25rem', fontSize: '1rem'}}>NOI 邀请赛</h3>
            <p style={{color: '#718096', fontSize: '0.75rem', marginBottom: '0.75rem'}}>2012-2025</p>
            <div style={{display: 'flex', justifyContent: 'space-around', textAlign: 'center'}}>
              <div>
                <div style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#856404'}}>{noiInviteGold}</div>
                <div style={{fontSize: '0.65rem', color: '#718096'}}>金牌</div>
              </div>
              <div>
                <div style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#6c757d'}}>{noiInviteSilver}</div>
                <div style={{fontSize: '0.65rem', color: '#718096'}}>银牌</div>
              </div>
              <div>
                <div style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#8B4513'}}>{noiInviteBronze}</div>
                <div style={{fontSize: '0.65rem', color: '#718096'}}>铜牌</div>
              </div>
            </div>
          </div>

          {/* WC */}
          <div style={{background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
            <h3 style={{color: 'var(--primary)', marginBottom: '0.25rem', fontSize: '1rem'}}>WC 冬令营</h3>
            <p style={{color: '#718096', fontSize: '0.75rem', marginBottom: '0.75rem'}}>2015-2026</p>
            <div style={{display: 'flex', justifyContent: 'space-around', textAlign: 'center'}}>
              <div>
                <div style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#856404'}}>{wcGold}</div>
                <div style={{fontSize: '0.65rem', color: '#718096'}}>金牌</div>
              </div>
              <div>
                <div style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#6c757d'}}>{wcSilver}</div>
                <div style={{fontSize: '0.65rem', color: '#718096'}}>银牌</div>
              </div>
              <div>
                <div style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#8B4513'}}>{wcBronze}</div>
                <div style={{fontSize: '0.65rem', color: '#718096'}}>铜牌</div>
              </div>
            </div>
          </div>

          {/* APIO */}
          <div style={{background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
            <h3 style={{color: 'var(--primary)', marginBottom: '0.25rem', fontSize: '1rem'}}>APIO亚洲太平洋</h3>
            <p style={{color: '#718096', fontSize: '0.75rem', marginBottom: '0.75rem'}}>2010-2025</p>
            <div style={{display: 'flex', justifyContent: 'space-around', textAlign: 'center'}}>
              <div>
                <div style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#856404'}}>{apioGold}</div>
                <div style={{fontSize: '0.65rem', color: '#718096'}}>金牌</div>
              </div>
              <div>
                <div style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#6c757d'}}>{apioData.reduce((sum, y) => sum + (y.银牌 || 0), 0)}</div>
                <div style={{fontSize: '0.65rem', color: '#718096'}}>银牌</div>
              </div>
              <div>
                <div style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#8B4513'}}>{apioData.reduce((sum, y) => sum + (y.铜牌 || 0), 0)}</div>
                <div style={{fontSize: '0.65rem', color: '#718096'}}>铜牌</div>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: NOIP提高, NOIP普及, CSP-S, CSP-J */}
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem'}}>
          {/* NOIP提高 */}
          <div style={{background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
            <h3 style={{color: 'var(--primary)', marginBottom: '0.25rem', fontSize: '1rem'}}>NOIP 提高组</h3>
            <p style={{color: '#718096', fontSize: '0.75rem', marginBottom: '0.75rem'}}>1988-2025</p>
            <div style={{display: 'flex', justifyContent: 'space-around', textAlign: 'center'}}>
              <div>
                <div style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#856404'}}>{noipTotalFirst}</div>
                <div style={{fontSize: '0.65rem', color: '#718096'}}>一等奖</div>
              </div>
              <div>
                <div style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#3182ce'}}>{noipTotalSecond}</div>
                <div style={{fontSize: '0.65rem', color: '#718096'}}>二等奖</div>
              </div>
              <div>
                <div style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#38A169'}}>{noipTotalThird}</div>
                <div style={{fontSize: '0.65rem', color: '#718096'}}>三等奖</div>
              </div>
            </div>
          </div>

          {/* NOIP普及 */}
          <div style={{background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
            <h3 style={{color: 'var(--secondary)', marginBottom: '0.25rem', fontSize: '1rem'}}>NOIP 普及组</h3>
            <p style={{color: '#718096', fontSize: '0.75rem', marginBottom: '0.75rem'}}>1988-2025</p>
            <div style={{display: 'flex', justifyContent: 'space-around', textAlign: 'center'}}>
              <div>
                <div style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#856404'}}>{noipData.reduce((sum, y) => sum + (y.普及组?.一等奖 || 0), 0)}</div>
                <div style={{fontSize: '0.65rem', color: '#718096'}}>一等奖</div>
              </div>
              <div>
                <div style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#3182ce'}}>{noipData.reduce((sum, y) => sum + (y.普及组?.二等奖 || 0), 0)}</div>
                <div style={{fontSize: '0.65rem', color: '#718096'}}>二等奖</div>
              </div>
              <div>
                <div style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#38A169'}}>{noipData.reduce((sum, y) => sum + (y.普及组?.三等奖 || 0), 0)}</div>
                <div style={{fontSize: '0.65rem', color: '#718096'}}>三等奖</div>
              </div>
            </div>
          </div>

          {/* CSP-S */}
          <div style={{background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
            <h3 style={{color: 'var(--primary)', marginBottom: '0.25rem', fontSize: '1rem'}}>CSP-S 提高级</h3>
            <p style={{color: '#718096', fontSize: '0.75rem', marginBottom: '0.75rem'}}>2019-2025</p>
            <div style={{display: 'flex', justifyContent: 'space-around', textAlign: 'center'}}>
              <div>
                <div style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#856404'}}>{cspData.reduce((sum, y) => sum + (y['CSP-S']?.一等奖 || 0), 0)}</div>
                <div style={{fontSize: '0.65rem', color: '#718096'}}>一等奖</div>
              </div>
              <div>
                <div style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#3182ce'}}>{cspData.reduce((sum, y) => sum + (y['CSP-S']?.二等奖 || 0), 0)}</div>
                <div style={{fontSize: '0.65rem', color: '#718096'}}>二等奖</div>
              </div>
              <div>
                <div style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#38A169'}}>{cspData.reduce((sum, y) => sum + (y['CSP-S']?.三等奖 || 0), 0)}</div>
                <div style={{fontSize: '0.65rem', color: '#718096'}}>三等奖</div>
              </div>
            </div>
          </div>

          {/* CSP-J */}
          <div style={{background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
            <h3 style={{color: 'var(--secondary)', marginBottom: '0.25rem', fontSize: '1rem'}}>CSP-J 入门级</h3>
            <p style={{color: '#718096', fontSize: '0.75rem', marginBottom: '0.75rem'}}>2019-2025</p>
            <div style={{display: 'flex', justifyContent: 'space-around', textAlign: 'center'}}>
              <div>
                <div style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#856404'}}>{cspData.reduce((sum, y) => sum + (y['CSP-J']?.一等奖 || 0), 0)}</div>
                <div style={{fontSize: '0.65rem', color: '#718096'}}>一等奖</div>
              </div>
              <div>
                <div style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#3182ce'}}>{cspData.reduce((sum, y) => sum + (y['CSP-J']?.二等奖 || 0), 0)}</div>
                <div style={{fontSize: '0.65rem', color: '#718096'}}>二等奖</div>
              </div>
              <div>
                <div style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#38A169'}}>{cspData.reduce((sum, y) => sum + (y['CSP-J']?.三等奖 || 0), 0)}</div>
                <div style={{fontSize: '0.65rem', color: '#718096'}}>三等奖</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Awards Section */}
      <div style={{marginTop: '2rem'}}>
        <h2 style={{fontSize: '1.25rem', color: 'var(--primary)', marginBottom: '1rem', fontWeight: 'bold'}}>团队荣誉</h2>
        <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center'}}>
          {[
            { year: '2004年', name: 'NOIP2003', award: '优秀参赛学校', img: '/picture/2003.jpg' },
            { year: '2005年', name: 'NOIP2004', award: '优秀参赛学校', img: '/picture/2004.jpg' },
            { year: '2014年', name: 'NOI30周年', award: '特色学校奖', img: '/picture/2014.jpg' },
            { year: '2019年', name: 'NOI35周年', award: '优秀学校', img: '/picture/2019.jpg' },
            { year: '2024年', name: 'NOI40周年', award: '优秀学校', img: '/picture/2024.jpg' },
          ].map((item, idx) => (
            <div
              key={idx}
              onClick={() => item.img && setShowLightbox(item.img)}
              style={{
                background: 'white',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                cursor: item.img ? 'pointer' : 'default',
                fontSize: '0.875rem',
                transition: 'all 0.2s',
                width: '180px',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}
            >
              <div>
                <div style={{fontWeight: 'bold', color: 'var(--primary)'}}>{item.year} {item.name}</div>
                <div style={{fontWeight: 'bold', color: 'var(--accent)'}}>{item.award}</div>
              </div>
              {item.img ? (
                <div style={{
                  width: '100%',
                  aspectRatio: '4 / 3',
                  overflow: 'hidden',
                  borderRadius: '4px',
                  background: '#f7fafc'
                }}>
                  <img
                    src={item.img}
                    alt={`${item.year} ${item.name}`}
                    style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}}
                  />
                </div>
              ) : (
                <div style={{
                  width: '100%',
                  aspectRatio: '4 / 3',
                  borderRadius: '4px',
                  background: 'repeating-linear-gradient(45deg, #f7fafc, #f7fafc 8px, #edf2f7 8px, #edf2f7 16px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#a0aec0',
                  fontSize: '0.75rem'
                }}>
                  暂无图片
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home