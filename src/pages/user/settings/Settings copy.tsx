import React, { useState } from 'react';
import './Settings.css';

/* ── Icons ── */
const IcoUser    = () => (<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>);
const IcoLock    = () => (<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>);
const IcoBell    = () => (<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>);
const IcoCheck   = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>);
const IcoCamera  = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>);
const IcoEye     = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>);
const IcoEyeOff  = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>);

/* ── Toggle switch ── */
const Toggle: React.FC<{ checked: boolean; onChange: () => void }> = ({ checked, onChange }) => (
  <button
    role="switch" aria-checked={checked}
    className={`st-toggle ${checked ? 'st-toggle--on' : ''}`}
    onClick={onChange}
  />
);

/* ── Section tab nav ── */
type Tab = 'profile' | 'security' | 'notifications';

const Settings: React.FC = () => {
  const [tab, setTab] = useState<Tab>('profile');

  /* Profile */
  const [firstName,  setFirstName]  = useState('Alex');
  const [lastName,   setLastName]   = useState('Turner');
  const [email,      setEmail]      = useState('alex.turner@email.com');
  const [phone,      setPhone]      = useState('+1 555 000 1234');
  const [profileSaved, setProfileSaved] = useState(false);

  /* Security */
  const [currentPw,  setCurrentPw]  = useState('');
  const [newPw,      setNewPw]      = useState('');
  const [confirmPw,  setConfirmPw]  = useState('');
  const [showCurrent,setShowCurrent]= useState(false);
  const [showNew,    setShowNew]    = useState(false);
  const [showConf,   setShowConf]   = useState(false);
  const [pwSaved,    setPwSaved]    = useState(false);
  const [pwError,    setPwError]    = useState('');

  /* Notifications */
  const [notifs, setNotifs] = useState({
    depositConfirmed: true,
    withdrawalUpdate: true,
    kycStatus:        true,
    securityAlerts:   true,
    marketing:        false,
    weeklyReport:     false,
  });

  const saveProfile = async () => {
    await new Promise(r => setTimeout(r, 800));
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  const savePassword = async () => {
    setPwError('');
    if (!currentPw) return setPwError('Enter your current password.');
    if (newPw.length < 8) return setPwError('New password must be at least 8 characters.');
    if (newPw !== confirmPw) return setPwError('Passwords do not match.');
    await new Promise(r => setTimeout(r, 900));
    setPwSaved(true);
    setCurrentPw(''); setNewPw(''); setConfirmPw('');
    setTimeout(() => setPwSaved(false), 2500);
  };

  const pwStrength = (pw: string) => {
    if (!pw) return 0;
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
  };
  const strength = pwStrength(newPw);
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength];
  const strengthCls   = ['', 'st-pw-weak', 'st-pw-fair', 'st-pw-good', 'st-pw-strong'][strength];

  const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key:'profile',       label:'Profile',       icon:<IcoUser />  },
    { key:'security',      label:'Security',      icon:<IcoLock />  },
    { key:'notifications', label:'Notifications', icon:<IcoBell />  },
  ];

  const NOTIF_ITEMS: { key: keyof typeof notifs; label: string; desc: string }[] = [
    { key:'depositConfirmed', label:'Deposit Confirmed',   desc:'Get notified when a deposit is confirmed on-chain.' },
    { key:'withdrawalUpdate', label:'Withdrawal Updates',  desc:'Status changes on your withdrawal requests.' },
    { key:'kycStatus',        label:'KYC Status',          desc:'Updates on your identity verification process.' },
    { key:'securityAlerts',   label:'Security Alerts',     desc:'Login attempts and account security events.' },
    { key:'marketing',        label:'Product Updates',     desc:'New features, promotions and announcements.' },
    { key:'weeklyReport',     label:'Weekly Summary',      desc:'A weekly digest of your account activity.' },
  ];

  return (
    <div className="st page-enter">
      <div className="page-hd"><h1>Settings</h1><p>Manage your account preferences</p></div>

      {/* Tab nav */}
      <div className="st-tabs">
        {TABS.map(t => (
          <button key={t.key}
            className={`st-tab ${tab===t.key?'st-tab--active':''}`}
            onClick={() => setTab(t.key)}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {/* ── Profile Tab ── */}
      {tab === 'profile' && (
        <div className="st-card">
          {/* Avatar */}
          <div className="st-avatar-row">
            <div className="st-avatar">
              <span>AT</span>
              <button className="st-avatar-edit" aria-label="Change photo"><IcoCamera /></button>
            </div>
            <div>
              <p className="st-avatar-name">{firstName} {lastName}</p>
              <p className="st-avatar-email">{email}</p>
            </div>
          </div>
          <div className="st-divider"/>
          <div className="st-form">
            <div className="st-row-2">
              <div className="input-wrap">
                <label className="input-label">First Name</label>
                <input className="input-field" value={firstName} onChange={e=>setFirstName(e.target.value)}/>
              </div>
              <div className="input-wrap">
                <label className="input-label">Last Name</label>
                <input className="input-field" value={lastName} onChange={e=>setLastName(e.target.value)}/>
              </div>
            </div>
            <div className="input-wrap">
              <label className="input-label">Email Address</label>
              <input className="input-field" type="email" value={email} onChange={e=>setEmail(e.target.value)}/>
            </div>
            <div className="input-wrap">
              <label className="input-label">Phone Number</label>
              <input className="input-field" type="tel" value={phone} onChange={e=>setPhone(e.target.value)}/>
            </div>
          </div>
          <div className="st-card-footer">
            <button className={`wd-btn-primary ${profileSaved?'st-saved-btn':''}`} onClick={saveProfile}>
              {profileSaved ? <><IcoCheck /> Saved</> : 'Save Changes'}
            </button>
          </div>
        </div>
      )}

      {/* ── Security Tab ── */}
      {tab === 'security' && (
        <div className="st-card">
          <div className="st-section-label">Change Password</div>
          <div className="st-form">
            <div className="input-wrap">
              <label className="input-label">Current Password</label>
              <div className="st-pw-wrap">
                <input className="input-field st-pw-input" type={showCurrent?'text':'password'}
                  placeholder="Enter current password" value={currentPw} onChange={e=>setCurrentPw(e.target.value)}/>
                <button className="st-pw-eye" onClick={()=>setShowCurrent(s=>!s)}>
                  {showCurrent ? <IcoEyeOff /> : <IcoEye />}
                </button>
              </div>
            </div>
            <div className="input-wrap">
              <label className="input-label">New Password</label>
              <div className="st-pw-wrap">
                <input className="input-field st-pw-input" type={showNew?'text':'password'}
                  placeholder="At least 8 characters" value={newPw} onChange={e=>setNewPw(e.target.value)}/>
                <button className="st-pw-eye" onClick={()=>setShowNew(s=>!s)}>
                  {showNew ? <IcoEyeOff /> : <IcoEye />}
                </button>
              </div>
              {newPw && (
                <div className="st-pw-strength">
                  <div className="st-pw-bars">
                    {[1,2,3,4].map(n => (
                      <div key={n} className={`st-pw-bar ${strength >= n ? strengthCls : ''}`}/>
                    ))}
                  </div>
                  <span className={`st-pw-label ${strengthCls}`}>{strengthLabel}</span>
                </div>
              )}
            </div>
            <div className="input-wrap">
              <label className="input-label">Confirm New Password</label>
              <div className="st-pw-wrap">
                <input className="input-field st-pw-input" type={showConf?'text':'password'}
                  placeholder="Repeat new password" value={confirmPw} onChange={e=>setConfirmPw(e.target.value)}/>
                <button className="st-pw-eye" onClick={()=>setShowConf(s=>!s)}>
                  {showConf ? <IcoEyeOff /> : <IcoEye />}
                </button>
              </div>
            </div>
            {pwError && <div className="st-pw-error">{pwError}</div>}
          </div>
          <div className="st-card-footer">
            <button className={`wd-btn-primary ${pwSaved?'st-saved-btn':''}`} onClick={savePassword}>
              {pwSaved ? <><IcoCheck /> Password Updated</> : 'Update Password'}
            </button>
          </div>
        </div>
      )}

      {/* ── Notifications Tab ── */}
      {tab === 'notifications' && (
        <div className="st-card">
          <div className="st-section-label">Email Notifications</div>
          <div className="st-notif-list">
            {NOTIF_ITEMS.map(item => (
              <div key={item.key} className="st-notif-row">
                <div className="st-notif-info">
                  <p className="st-notif-label">{item.label}</p>
                  <p className="st-notif-desc">{item.desc}</p>
                </div>
                <Toggle
                  checked={notifs[item.key]}
                  onChange={() => setNotifs(n => ({ ...n, [item.key]: !n[item.key] }))}
                />
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default Settings;