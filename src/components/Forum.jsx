// src/components/Forum.jsx
import { useState, useEffect } from "react";

const CATEGORIES = [
  { id: "tech_support", label: "Technical Support", desc: "Engine, battery, and electronic troubleshooting", icon: "🔧" },
  { id: "perf_tuning", label: "Performance Tuning", desc: "Suspension, tire, and aerodynamic discussions", icon: "⚡" },
  { id: "race_strategy", label: "Race Strategy", desc: "FSE rule interpretations and event planning", icon: "🏁" },
  { id: "general", label: "General Chat", desc: "Team news, introductions, and announcements", icon: "💬" },
];

const INITIAL_THREADS = [
  // Technical Support
  {
    id: "t1",
    categoryId: "tech_support",
    title: "AMK DD5 phase wiring sequence issues",
    author: "KaanFSAE",
    date: "2026-05-15 10:24",
    replies: [
      { author: "TorqueVector", date: "2026-05-15 11:15", text: "Check the U/V/W terminal connection. Emrax and AMK controllers are extremely sensitive to phase alignment." },
      { author: "Zeynep_EV", date: "2026-05-15 11:45", text: "Agreed, double check isolation resistance as well before power-up. Safety loop might trigger an error if the shield is not grounded." }
    ]
  },
  {
    id: "t2",
    categoryId: "tech_support",
    title: "High voltage accumulator isolation fault (IMD red light)",
    author: "Zeynep_EV",
    date: "2026-05-16 14:12",
    replies: [
      { author: "Emirhan_AMK", date: "2026-05-16 15:02", text: "Check the custom BMS PCB standoffs. Sometimes carbon fiber dust conducts high voltage and drops isolation below 500 ohms/volt." }
    ]
  },
  // Performance Tuning
  {
    id: "t3",
    categoryId: "perf_tuning",
    title: "Hoosier R25B tire pressure for optimal acceleration",
    author: "TorqueVector",
    date: "2026-05-14 09:30",
    replies: [
      { author: "KaanFSAE", date: "2026-05-14 10:05", text: "We found 12.5 PSI hot gives the best launch grip on dry tarmac. Make sure to burnish the tires properly before measuring." }
    ]
  },
  // Race Strategy
  {
    id: "t4",
    categoryId: "race_strategy",
    title: "EV 1.1 maximum voltage threshold validation rules",
    author: "Emirhan_AMK",
    date: "2026-05-17 11:00",
    replies: [
      { author: "Zeynep_EV", date: "2026-05-17 11:30", text: "Keep accumulator charging voltage strictly below 600V DC under all temp states. The tech inspectors measure it very precisely." }
    ]
  },
  // General Chat
  {
    id: "t5",
    categoryId: "general",
    title: "Welcome FSE team members — Say hello here!",
    author: "Admin_FSE",
    date: "2026-05-10 09:00",
    replies: [
      { author: "KaanFSAE", date: "2026-05-10 10:15", text: "Hi everyone, Kaan here from the suspension design division. Let's build a winner this season!" },
      { author: "Emirhan_AMK", date: "2026-05-10 10:42", text: "Hey guys, Emirhan from powertrain. Stoked to get the new carbon monocoque running with the active AMK wheel motors!" }
    ]
  }
];

const AVATAR_COLORS = [
  "#C0001A", // Racing Red
  "#3A86FF", // Royal Blue
  "#8338EC", // Neon Purple
  "#FF006E", // Hot Pink
  "#38B000", // Acid Green
  "#FFBE0B", // Bright Gold
  "#00F5D4", // Turquoise
];

export default function Forum({ user, triggerToast, openLogin }) {
  const [threads, setThreads] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeThread, setActiveThread] = useState(null);
  
  // Modals & Forms
  const [showNewThreadModal, setShowNewThreadModal] = useState(false);
  const [newThreadTitle, setNewThreadTitle] = useState("");
  const [newThreadContent, setNewThreadContent] = useState("");
  const [replyText, setReplyText] = useState("");

  // Initialize/Load Forum Data
  useEffect(() => {
    const saved = localStorage.getItem("fse_forum_threads");
    if (saved) {
      try {
        setThreads(JSON.parse(saved));
      } catch (e) {
        setThreads(INITIAL_THREADS);
      }
    } else {
      localStorage.setItem("fse_forum_threads", JSON.stringify(INITIAL_THREADS));
      setThreads(INITIAL_THREADS);
    }
  }, []);

  const saveThreads = (updatedThreads) => {
    setThreads(updatedThreads);
    localStorage.setItem("fse_forum_threads", JSON.stringify(updatedThreads));
  };

  const getAvatarStyle = (name) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colorIndex = Math.abs(hash) % AVATAR_COLORS.length;
    return {
      width: "36px",
      height: "36px",
      borderRadius: "50%",
      background: AVATAR_COLORS[colorIndex],
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "12px",
      fontWeight: 800,
      color: "white",
      textTransform: "uppercase",
      boxShadow: "0 0 10px rgba(0,0,0,0.3)",
    };
  };

  const handleCreateThread = (e) => {
    e.preventDefault();
    if (!user) {
      triggerToast("You must sign in first!");
      openLogin();
      return;
    }
    if (!newThreadTitle.trim() || !newThreadContent.trim()) {
      triggerToast("Please fill in both title and content.");
      return;
    }

    const newThread = {
      id: "thread_" + Date.now(),
      categoryId: activeCategory.id,
      title: newThreadTitle.trim(),
      author: user.username,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      replies: [
        {
          author: user.username,
          date: new Date().toISOString().replace('T', ' ').slice(0, 16),
          text: newThreadContent.trim()
        }
      ]
    };

    const updated = [newThread, ...threads];
    saveThreads(updated);
    
    // Close modal & reset fields
    setShowNewThreadModal(false);
    setNewThreadTitle("");
    setNewThreadContent("");
    
    // Open new thread directly
    setActiveThread(newThread);
    triggerToast("Discussion thread posted successfully!");
  };

  const handlePostReply = (e) => {
    e.preventDefault();
    if (!user) {
      triggerToast("You must sign in first!");
      openLogin();
      return;
    }
    if (!replyText.trim()) {
      triggerToast("Reply cannot be empty!");
      return;
    }

    const newReply = {
      author: user.username,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      text: replyText.trim()
    };

    const updated = threads.map((t) => {
      if (t.id === activeThread.id) {
        const nextReplies = [...t.replies, newReply];
        // Keep active thread local view in sync
        setActiveThread({ ...t, replies: nextReplies });
        return { ...t, replies: nextReplies };
      }
      return t;
    });

    saveThreads(updated);
    setReplyText("");
    triggerToast("Reply posted successfully!");
  };

  const getThreadList = () => {
    if (!activeCategory) return [];
    return threads.filter(t => t.categoryId === activeCategory.id);
  };

  return (
    <div style={{
      display: "flex",
      width: "100%",
      height: "100%",
      background: "radial-gradient(ellipse 80% 80% at 50% 50%, #151522 0%, #06060a 100%)",
      padding: "40px",
      boxSizing: "border-box",
      overflowY: "auto",
    }}>
      <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "30px" }}>
        
        {/* ── BREADCRUMBS / NAVIGATION CONTROLS ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span 
              onClick={() => { setActiveCategory(null); setActiveThread(null); }}
              style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", fontWeight: 700, letterSpacing: "0.15em", cursor: "pointer", transition: "color 0.2s" }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#C0001A"}
              onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.4)"}
            >
              PIT LANE FORUM
            </span>
            {activeCategory && (
              <>
                <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "12px" }}>/</span>
                <span 
                  onClick={() => setActiveThread(null)}
                  style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", fontWeight: 700, letterSpacing: "0.15em", cursor: "pointer", transition: "color 0.2s" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "#C0001A"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.4)"}
                >
                  {activeCategory.label.toUpperCase()}
                </span>
              </>
            )}
            {activeThread && (
              <>
                <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "12px" }}>/</span>
                <span style={{ fontSize: "12px", color: "#fff", fontWeight: 700, letterSpacing: "0.05em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "200px" }}>
                  {activeThread.title}
                </span>
              </>
            )}
          </div>

          {activeCategory && !activeThread && (
            <button
              onClick={() => {
                if (!user) {
                  triggerToast("You must sign in first!");
                  openLogin();
                } else {
                  setShowNewThreadModal(true);
                }
              }}
              style={{
                background: "#C0001A",
                border: "none",
                borderRadius: "20px",
                color: "white",
                fontSize: "10px",
                fontWeight: 800,
                letterSpacing: "0.1em",
                padding: "8px 18px",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(192, 0, 26, 0.25)",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#E00024";
                e.currentTarget.style.boxShadow = "0 6px 16px rgba(224, 0, 36, 0.45)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#C0001A";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(192, 0, 26, 0.25)";
              }}
            >
              + NEW TOPIC
            </button>
          )}
        </div>

        {/* ── VIEW 1: CATEGORY GRID ── */}
        {!activeCategory && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={{ borderLeft: "4px solid #C0001A", paddingLeft: "16px" }}>
              <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#white", margin: 0, letterSpacing: "0.03em" }}>Pit Lane Categories</h1>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", margin: "6px 0 0", letterSpacing: "0.05em" }}>
                Select a room to discuss and collaborate on FSAE engineering problems.
              </p>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "20px",
              marginTop: "10px",
            }}>
              {CATEGORIES.map((cat) => {
                const count = threads.filter(t => t.categoryId === cat.id).length;
                return (
                  <div
                    key={cat.id}
                    onClick={() => setActiveCategory(cat)}
                    style={{
                      background: "rgba(255, 255, 255, 0.02)",
                      backdropFilter: "blur(12px)",
                      border: "1px solid rgba(255, 255, 255, 0.05)",
                      borderRadius: "20px",
                      padding: "30px",
                      cursor: "pointer",
                      transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                      position: "relative",
                      overflow: "hidden",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.borderColor = "rgba(192, 0, 26, 0.25)";
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.05)";
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)";
                    }}
                  >
                    <div style={{ fontSize: "36px", marginBottom: "16px" }}>{cat.icon}</div>
                    <h2 style={{ fontSize: "16px", fontWeight: 800, color: "#fff", margin: "0 0 8px", letterSpacing: "0.02em" }}>
                      {cat.label}
                    </h2>
                    <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", margin: "0 0 20px", lineHeight: "1.5", minHeight: "33px" }}>
                      {cat.desc}
                    </p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.04)", paddingTop: "14px" }}>
                      <span style={{ fontSize: "10px", color: "#C0001A", fontWeight: 700, letterSpacing: "0.08em" }}>
                        {count} {count === 1 ? "DISCUSSION" : "DISCUSSIONS"}
                      </span>
                      <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>→</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── VIEW 2: THREADS LIST ── */}
        {activeCategory && !activeThread && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "32px" }}>{activeCategory.icon}</span>
              <div style={{ borderLeft: "4px solid #C0001A", paddingLeft: "16px" }}>
                <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#white", margin: 0, letterSpacing: "0.03em" }}>{activeCategory.label} Discussions</h1>
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", margin: "4px 0 0", letterSpacing: "0.03em" }}>
                  {activeCategory.desc}
                </p>
              </div>
            </div>

            {getThreadList().length === 0 ? (
              <div style={{
                background: "rgba(255,255,255,0.02)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: "20px",
                padding: "60px 40px",
                textAlign: "center",
              }}>
                <span style={{ fontSize: "28px" }}>💬</span>
                <h3 style={{ fontSize: "16px", color: "rgba(255,255,255,0.6)", margin: "16px 0 6px" }}>No discussions yet</h3>
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", margin: 0 }}>Be the first to post a question or topic!</p>
              </div>
            ) : (
              <div style={{
                background: "rgba(255, 255, 255, 0.02)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                borderRadius: "20px",
                overflow: "hidden",
              }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.01)" }}>
                      <th style={{ padding: "18px 24px", fontSize: "10px", color: "rgba(255,255,255,0.4)", fontWeight: 700, letterSpacing: "0.1em" }}>TOPIC</th>
                      <th style={{ padding: "18px 24px", fontSize: "10px", color: "rgba(255,255,255,0.4)", fontWeight: 700, letterSpacing: "0.1em", width: "150px" }}>CREATED BY</th>
                      <th style={{ padding: "18px 24px", fontSize: "10px", color: "rgba(255,255,255,0.4)", fontWeight: 700, letterSpacing: "0.1em", width: "150px" }}>DATE</th>
                      <th style={{ padding: "18px 24px", fontSize: "10px", color: "rgba(255,255,255,0.4)", fontWeight: 700, letterSpacing: "0.1em", width: "100px", textAlign: "center" }}>REPLIES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getThreadList().map((t) => (
                      <tr
                        key={t.id}
                        onClick={() => setActiveThread(t)}
                        style={{
                          borderBottom: "1px solid rgba(255,255,255,0.03)",
                          cursor: "pointer",
                          transition: "background 0.2s",
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                      >
                        <td style={{ padding: "20px 24px" }}>
                          <span style={{ fontSize: "13px", fontWeight: 700, color: "#fff", letterSpacing: "0.01em" }}>{t.title}</span>
                        </td>
                        <td style={{ padding: "20px 24px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#C0001A" }} />
                            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>{t.author}</span>
                          </div>
                        </td>
                        <td style={{ padding: "20px 24px" }}>
                          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>{t.date}</span>
                        </td>
                        <td style={{ padding: "20px 24px", textAlign: "center" }}>
                          <span style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            borderRadius: "12px",
                            padding: "4px 10px",
                            fontSize: "10px",
                            color: "#fff",
                            fontWeight: 700,
                          }}>
                            {t.replies.length - 1}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── VIEW 3: SINGLE THREAD DETAILED MESSAGES ── */}
        {activeThread && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            
            {/* Header / Thread Title Banner */}
            <div style={{
              background: "rgba(255, 255, 255, 0.02)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              borderRadius: "20px",
              padding: "30px 40px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
              <div>
                <span style={{
                  fontSize: "9px",
                  background: "rgba(192, 0, 26, 0.15)",
                  border: "1px solid rgba(192, 0, 26, 0.3)",
                  color: "#C0001A",
                  borderRadius: "12px",
                  padding: "4px 10px",
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                }}>
                  ACTIVE THREAD
                </span>
                <h1 style={{ fontSize: "20px", fontWeight: 800, color: "#fff", margin: "12px 0 0", letterSpacing: "0.02em" }}>
                  {activeThread.title}
                </h1>
              </div>
            </div>

            {/* List of messages/replies */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {activeThread.replies.map((reply, index) => {
                const isOp = index === 0;
                return (
                  <div
                    key={index}
                    style={{
                      background: isOp ? "rgba(255,255,255,0.03)" : "rgba(255, 255, 255, 0.01)",
                      backdropFilter: "blur(12px)",
                      border: isOp ? "1px solid rgba(192, 0, 26, 0.2)" : "1px solid rgba(255, 255, 255, 0.04)",
                      boxShadow: isOp ? "0 4px 20px rgba(192,0,26,0.05)" : "none",
                      borderRadius: "20px",
                      padding: "24px 30px",
                      display: "flex",
                      gap: "20px",
                    }}
                  >
                    {/* User profile left column */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                      <div style={getAvatarStyle(reply.author)}>
                        {reply.author.slice(0, 2)}
                      </div>
                      <span style={{ fontSize: "11px", fontWeight: 700, color: "#fff", letterSpacing: "0.03em" }}>{reply.author}</span>
                      {isOp && (
                        <span style={{ fontSize: "8px", background: "#C0001A", color: "white", padding: "2px 6px", borderRadius: "8px", fontWeight: 800 }}>OP</span>
                      )}
                    </div>

                    {/* Message content right column */}
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                      <p style={{
                        fontSize: "13px",
                        lineHeight: "1.6",
                        color: "rgba(255, 255, 255, 0.85)",
                        margin: "0 0 16px",
                        whiteSpace: "pre-wrap",
                      }}>
                        {reply.text}
                      </p>
                      <div style={{ display: "flex", justifyContent: "flex-end", borderTop: "1px solid rgba(255,255,255,0.03)", paddingTop: "10px" }}>
                        <span style={{ fontSize: "10px", color: "rgba(255, 255, 255, 0.3)" }}>
                          Posted on {reply.date}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* En altta Reply / Yanıt Alanı */}
            <div style={{
              background: "rgba(255, 255, 255, 0.02)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              borderRadius: "20px",
              padding: "30px",
              marginTop: "10px",
            }}>
              <h3 style={{ fontSize: "13px", fontWeight: 800, color: "#fff", margin: "0 0 16px", letterSpacing: "0.03em" }}>
                Post a Reply
              </h3>
              <form onSubmit={handlePostReply} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <textarea
                  rows={4}
                  placeholder={user ? "Write your expert comments here..." : "Please sign in to write a reply."}
                  disabled={!user}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "16px",
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "14px",
                    color: "white",
                    fontSize: "13px",
                    outline: "none",
                    boxSizing: "border-box",
                    resize: "vertical",
                    transition: "all 0.2s",
                  }}
                  onFocus={(e) => {
                    if (user) {
                      e.currentTarget.style.borderColor = "#C0001A";
                      e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                    }
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                  }}
                />

                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button
                    type="submit"
                    style={{
                      background: user ? "#C0001A" : "rgba(255,255,255,0.05)",
                      border: "none",
                      borderRadius: "20px",
                      color: user ? "white" : "rgba(255,255,255,0.2)",
                      fontSize: "10px",
                      fontWeight: 800,
                      letterSpacing: "0.1em",
                      padding: "10px 24px",
                      cursor: user ? "pointer" : "not-allowed",
                      boxShadow: user ? "0 4px 12px rgba(192, 0, 26, 0.25)" : "none",
                      textTransform: "uppercase",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      if (user) {
                        e.currentTarget.style.background = "#E00024";
                        e.currentTarget.style.boxShadow = "0 6px 16px rgba(224, 0, 36, 0.45)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (user) {
                        e.currentTarget.style.background = "#C0001A";
                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(192, 0, 26, 0.25)";
                      }
                    }}
                  >
                    POST REPLY
                  </button>
                </div>
              </form>
            </div>

          </div>
        )}

        {/* ── MODAL: CREATE NEW DISCUSSION THREAD ── */}
        {showNewThreadModal && activeCategory && (
          <div style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(4, 4, 6, 0.75)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "modal-fade-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
          }}>
            <div style={{
              width: "500px",
              background: "rgba(12, 12, 18, 0.85)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5), 0 0 30px rgba(192, 0, 26, 0.1)",
              borderRadius: "24px",
              padding: "36px",
              position: "relative",
            }}>
              <button
                onClick={() => setShowNewThreadModal(false)}
                style={{
                  position: "absolute",
                  top: "24px",
                  right: "24px",
                  background: "none",
                  border: "none",
                  color: "rgba(255, 255, 255, 0.4)",
                  fontSize: "18px",
                  cursor: "pointer",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = "#fff"}
                onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255, 255, 255, 0.4)"}
              >
                ✕
              </button>

              <div style={{ marginBottom: "26px" }}>
                <span style={{ fontSize: "10px", color: "#C0001A", fontWeight: 800, letterSpacing: "0.12em" }}>
                  {activeCategory.label.toUpperCase()} ROOM
                </span>
                <h2 style={{ fontSize: "20px", fontWeight: 800, letterSpacing: "0.02em", color: "#fff", margin: "6px 0 0" }}>
                  Start a Discussion
                </h2>
              </div>

              <form onSubmit={handleCreateThread} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                <div>
                  <label style={{ fontSize: "10px", color: "rgba(255, 255, 255, 0.4)", fontWeight: 700, letterSpacing: "0.1em", display: "block", marginBottom: "8px" }}>
                    DISCUSSION TITLE
                  </label>
                  <input
                    type="text"
                    placeholder="Briefly state your topic..."
                    value={newThreadTitle}
                    onChange={(e) => setNewThreadTitle(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: "12px",
                      color: "white",
                      fontSize: "13px",
                      outline: "none",
                      boxSizing: "border-box",
                      transition: "all 0.2s",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "#C0001A";
                      e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                      e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "10px", color: "rgba(255, 255, 255, 0.4)", fontWeight: 700, letterSpacing: "0.1em", display: "block", marginBottom: "8px" }}>
                    MESSAGE CONTENT
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Provide details about what you want to solve, discuss or share..."
                    value={newThreadContent}
                    onChange={(e) => setNewThreadContent(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: "12px",
                      color: "white",
                      fontSize: "13px",
                      outline: "none",
                      boxSizing: "border-box",
                      resize: "vertical",
                      transition: "all 0.2s",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "#C0001A";
                      e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                      e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                    }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    width: "100%",
                    padding: "14px",
                    background: "#C0001A",
                    border: "none",
                    borderRadius: "14px",
                    color: "white",
                    fontSize: "11px",
                    fontWeight: 800,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    marginTop: "10px",
                    boxShadow: "0 4px 20px rgba(192, 0, 26, 0.3)",
                    transition: "all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#E00024";
                    e.currentTarget.style.boxShadow = "0 6px 24px rgba(224, 0, 36, 0.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#C0001A";
                    e.currentTarget.style.boxShadow = "0 4px 20px rgba(192, 0, 26, 0.3)";
                  }}
                >
                  POST DISCUSSION
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
