import React, { useState, useEffect, useRef } from "react";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  X, 
  ChevronRight, 
  BookOpen, 
  Users, 
  ShieldAlert, 
  Award
} from "lucide-react";

export default function VideoDemoModal({ isOpen, onClose }) {
  const [selectedRole, setSelectedRole] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [currentScene, setCurrentScene] = useState(0);

  const synthRef = useRef(window.speechSynthesis);
  const playIntervalRef = useRef(null);

  const roles = [
    {
      id: "STUDENT",
      title: "Student Portal Video Tour",
      description: "Learn how students search, purchase, study, and level up with experience points.",
      icon: <BookOpen className="w-5 h-5" />,
      color: "text-blue-400 border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10"
    },
    {
      id: "TRAINER",
      title: "Trainer Center Video Tour",
      description: "Observe course outline curriculum creation, student grading, and sessions management.",
      icon: <Users className="w-5 h-5" />,
      color: "text-purple-400 border-purple-500/30 bg-purple-500/5 hover:bg-purple-500/10"
    },
    {
      id: "ADMIN",
      title: "Admin Panel Video Tour",
      description: "Audit pending instructor verifications, monitor operational statistics, and view log tables.",
      icon: <ShieldAlert className="w-5 h-5" />,
      color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10"
    }
  ];

  const scripts = {
    STUDENT: [
      {
        duration: 12,
        subtitle: "The Student Catalog is where learners explore technical courses, filter programming subjects like React, Java, or Spring Boot, and review course ratings and descriptions.",
        visual: "CATALOG",
        backgroundImage: "/demo_student_dash.jpg"
      },
      {
        duration: 11,
        subtitle: "Students can register for course learning tracks instantly. When checked out, the system automatically enrolls them and configures their progress syllabus.",
        visual: "CHECKOUT",
        backgroundImage: "/demo_student_dash.jpg"
      },
      {
        duration: 12,
        subtitle: "Inside the Study Player, students access organized curriculum outlines, check off completed lectures, save customized study notes, and write questions on peer discuss boards.",
        visual: "PLAYER",
        backgroundImage: "/demo_course_player.jpg"
      },
      {
        duration: 11,
        subtitle: "Every completed module and passed quiz awards experience points (XP) to level up their student card and display achievements on the global dashboard leaderboard.",
        visual: "GAMIFICATION",
        backgroundImage: "/demo_student_dash.jpg"
      }
    ],
    TRAINER: [
      {
        duration: 11,
        subtitle: "The Trainer Dashboard provides tutors with quick revenue sales analytics, course enrollment numbers, calendar appointments, and aggregate teacher ratings.",
        visual: "TRAINER_DASH",
        backgroundImage: "/demo_trainer_dash.jpg"
      },
      {
        duration: 11,
        subtitle: "Tutors can manage syllabus builder outlines by organizing sections, adding lessons, inserting notes, and editing requirements details.",
        visual: "CURRICULUM",
        backgroundImage: "/demo_trainer_dash.jpg"
      },
      {
        duration: 11,
        subtitle: "Instructors review assignment submissions here. Tutors can grade files, type feedback, and score homework to sync student progression levels.",
        visual: "GRADING",
        backgroundImage: "/demo_trainer_dash.jpg"
      }
    ],
    ADMIN: [
      {
        duration: 11,
        subtitle: "The System Admin Panel monitors system-wide platform statistics, total active users, course counts, and security server health indicators.",
        visual: "ADMIN_STATS",
        backgroundImage: "/demo_admin_dash.jpg"
      },
      {
        duration: 11,
        subtitle: "Pending instructor registrations are audited in this section. Administrators verify credentials and bios before granting course publishing privileges.",
        visual: "VERIFICATIONS",
        backgroundImage: "/demo_admin_dash.jpg"
      },
      {
        duration: 12,
        subtitle: "Admins inspect operational security logs here. Every administrative action, profile verification status, and transaction updates are recorded in an audit table.",
        visual: "AUDIT_LOGS",
        backgroundImage: "/demo_admin_dash.jpg"
      }
    ]
  };

  const activeScript = selectedRole ? scripts[selectedRole] : [];
  const totalDuration = activeScript.reduce((sum, item) => sum + item.duration, 0);

  // Sync scene changes based on currentTime
  useEffect(() => {
    if (!selectedRole || activeScript.length === 0) return;

    let accum = 0;
    for (let i = 0; i < activeScript.length; i++) {
      accum += activeScript[i].duration;
      if (currentTime < accum) {
        if (currentScene !== i) {
          setCurrentScene(i);
        }
        break;
      }
    }
  }, [currentTime, selectedRole, activeScript, currentScene]);

  // Handle Speech Narration on scene change
  useEffect(() => {
    if (!isPlaying || !selectedRole || activeScript.length === 0) return;

    speakText(activeScript[currentScene]?.subtitle);
  }, [currentScene, isPlaying, selectedRole]);

  // Handle Play Timer with smart speech synchronization
  useEffect(() => {
    if (isPlaying) {
      playIntervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          const currentSceneDuration = activeScript[currentScene]?.duration || 8;
          const sceneStartOffset = activeScript.slice(0, currentScene).reduce((sum, item) => sum + item.duration, 0);
          const sceneEndOffset = sceneStartOffset + currentSceneDuration;

          // If we reach the end of the current scene's timeline, freeze progress if narrator is still speaking
          if (prev >= sceneEndOffset - 0.2) {
            if (synthRef.current && synthRef.current.speaking && !isMuted) {
              return prev; // Wait here until voice narration completes!
            }
            
            // Proceed to next scene
            if (currentScene < activeScript.length - 1) {
              return sceneEndOffset; 
            } else {
              handleRestart();
              return 0;
            }
          }

          return prev + 0.1;
        });
      }, 100);
    } else {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
      stopSpeaking();
    }

    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    };
  }, [isPlaying, currentScene, activeScript, isMuted]);

  // Reset states on close
  useEffect(() => {
    if (!isOpen) {
      handleClose();
    }
  }, [isOpen]);

  const speakText = (text) => {
    if (!synthRef.current) return;
    synthRef.current.cancel(); 

    if (isMuted) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = volume;
    utterance.rate = 0.95; // Slightly slower for better explanation clarity
    
    const voices = synthRef.current.getVoices();
    const englishVoice = voices.find(v => v.lang.includes("en-US") || v.lang.includes("en-GB"));
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
  };

  const handleClose = () => {
    stopSpeaking();
    setIsPlaying(false);
    setSelectedRole(null);
    setCurrentTime(0);
    setCurrentScene(0);
  };

  const handleSelectRole = (role) => {
    setSelectedRole(role);
    setCurrentTime(0);
    setCurrentScene(0);
    setIsPlaying(true);
  };

  const handleRestart = () => {
    stopSpeaking();
    setCurrentTime(0);
    setCurrentScene(0);
    setIsPlaying(true);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted) {
      stopSpeaking();
    } else {
      setTimeout(() => {
        speakText(activeScript[currentScene]?.subtitle);
      }, 50);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#020617]/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in font-sans">
      
      {/* Container Card */}
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[520px] relative text-left">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950/40">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-650 flex items-center justify-center text-white font-extrabold text-xs">
              LS
            </div>
            <h3 className="text-sm font-extrabold text-slate-100 uppercase tracking-wider">
              {selectedRole ? `${selectedRole} Video Tour` : "Choose a Demo Video"}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded-lg transition-colors border-0 bg-transparent cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Dynamic Body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-950">
          
          {/* STEP 1: CHOOSE ROLE */}
          {!selectedRole ? (
            <div className="flex-1 p-6 md:p-8 flex flex-col justify-center items-center text-center space-y-6 overflow-y-auto bg-slate-900">
              <div className="space-y-1">
                <h4 className="text-xl font-extrabold text-white tracking-tight">Interactive Video Catalog</h4>
                <p className="text-xs text-slate-400 max-w-md leading-relaxed">
                  Select a target interface below to play an animated feature tour narrated aloud by the system.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => handleSelectRole(role.id)}
                    className={`p-5 rounded-2xl border text-left flex flex-col gap-3 transition-all duration-200 cursor-pointer ${role.color}`}
                  >
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-850 shrink-0 h-10 w-10 flex items-center justify-center">
                      {role.icon}
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-slate-100 flex items-center gap-1">
                        <span>{role.title}</span>
                        <ChevronRight size={12} className="opacity-60" />
                      </div>
                      <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                        {role.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* STEP 2: VIDEO PLAYER VIEW */
            <div className="flex-1 flex flex-col relative overflow-hidden">
              
              {/* Media Display Viewport */}
              <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden bg-slate-950">
                
                {/* Visual Video Screen */}
                <div 
                  className="w-full max-w-2xl aspect-video bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between shadow-2xl relative overflow-hidden bg-cover bg-center transition-all duration-300"
                  style={{
                    backgroundImage: `url(${process.env.PUBLIC_URL + activeScript[currentScene]?.backgroundImage})`,
                  }}
                >
                  
                  {/* Backdrop Overlay for Visual Highlights */}
                  <div className="absolute inset-0 bg-slate-950/20"></div>

                  {/* Top Header Badge inside Viewport */}
                  <div className="flex justify-between items-center border-b border-white/10 p-3 bg-slate-950/60 backdrop-blur-sm z-10">
                    <span className="text-[9px] font-mono text-indigo-400 font-bold bg-indigo-950/80 px-1.5 py-0.5 rounded uppercase tracking-wider">
                      {selectedRole} PORTAL
                    </span>
                    <span className="text-[8px] font-mono text-slate-300">
                      SCENE {currentScene + 1} OF {activeScript.length}
                    </span>
                  </div>

                  {/* Dynamic HUD Overlays depending on Visual Type */}
                  <div className="flex-1 flex items-center justify-center p-4 z-10 relative">
                    
                    {/* CHECKOUT OVERLAY */}
                    {activeScript[currentScene]?.visual === "CHECKOUT" && (
                      <div className="w-52 bg-slate-900/95 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-2xl animate-scale-up text-left">
                        <span className="text-[9px] font-bold text-slate-300 block uppercase tracking-wider">Secure Payment Gateway</span>
                        <div className="h-6 bg-slate-950 border border-slate-800 rounded px-2.5 flex items-center text-[10px] text-slate-400 font-mono">
                          •••• •••• •••• 4242
                        </div>
                        <button className="w-full py-1.5 bg-indigo-650 rounded text-[9px] font-bold text-white border-0 hover:bg-indigo-600 transition-colors">
                          Complete Purchase ($149.00)
                        </button>
                      </div>
                    )}

                    {/* GAMIFICATION OVERLAY */}
                    {activeScript[currentScene]?.visual === "GAMIFICATION" && (
                      <div className="p-5 bg-slate-900/95 border border-amber-500/30 rounded-2xl text-center space-y-2.5 shadow-2xl animate-bounce">
                        <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
                          <Award size={20} />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white block">Course Module Complete!</span>
                          <span className="text-[10px] text-indigo-400 font-bold font-mono">+150 XP Level Up</span>
                        </div>
                      </div>
                    )}

                    {/* CURRICULUM OVERLAY */}
                    {activeScript[currentScene]?.visual === "CURRICULUM" && (
                      <div className="absolute top-4 right-4 bg-indigo-600/90 text-white px-3 py-1.5 rounded-lg border border-indigo-400/20 text-[9px] font-bold shadow-lg animate-pulse">
                        Curriculum: Java OOP Basics Added
                      </div>
                    )}

                    {/* GRADING OVERLAY */}
                    {activeScript[currentScene]?.visual === "GRADING" && (
                      <div className="absolute inset-y-0 right-0 w-36 bg-slate-900/95 border-l border-slate-850 p-3 flex flex-col justify-between shadow-2xl text-left">
                        <div className="space-y-2">
                          <span className="text-[8px] font-bold text-slate-400 block uppercase">Grading Panel</span>
                          <span className="text-[9px] font-bold text-slate-200 block">Jane Doe</span>
                          <div className="p-1 bg-slate-950 border border-slate-850 rounded text-[7px] text-slate-400">
                            "Completed Spring security token validation filters."
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <select className="w-full bg-slate-950 border border-slate-800 rounded px-1.5 py-1 text-[8px] text-slate-300">
                            <option>Grade: A+</option>
                            <option>Grade: B</option>
                          </select>
                          <button className="w-full py-1 bg-emerald-600 rounded text-[8px] font-bold text-white border-0">Submit Grade</button>
                        </div>
                      </div>
                    )}

                    {/* VERIFICATIONS OVERLAY */}
                    {activeScript[currentScene]?.visual === "VERIFICATIONS" && (
                      <div className="w-60 bg-slate-900/95 border border-slate-800 rounded-2xl p-4 flex justify-between items-center shadow-2xl text-left">
                        <div>
                          <span className="text-[9px] font-bold text-white block">Dr. Sarah Jenkins</span>
                          <span className="text-[8px] text-slate-400 block">Skills: Spring, Microservices</span>
                        </div>
                        <div className="flex gap-1.5">
                          <button className="py-1 px-2.5 bg-emerald-600 rounded text-[8px] font-bold text-white border-0 hover:bg-emerald-500 transition-colors">Approve</button>
                          <button className="py-1 px-2.5 bg-slate-800 rounded text-[8px] font-bold text-slate-400 border-0 hover:bg-slate-700 transition-colors">Reject</button>
                        </div>
                      </div>
                    )}

                    {/* AUDIT LOGS OVERLAY */}
                    {activeScript[currentScene]?.visual === "AUDIT_LOGS" && (
                      <div className="absolute bottom-4 left-4 bg-slate-950/90 border border-slate-850 px-3 py-1.5 rounded-lg text-left text-[8px] font-mono text-emerald-400 shadow-xl animate-pulse">
                        [AUDIT LOG] ADMIN: Approved Trainer Sarah Jenkins (192.168.1.45)
                      </div>
                    )}

                  </div>

                  {/* Mock Seekbar Timeline inside Viewport */}
                  <div className="w-full h-1 bg-slate-950/60 z-10">
                    <div 
                      className="h-full bg-indigo-500 transition-all duration-100" 
                      style={{ width: `${(currentTime / totalDuration) * 100}%` }}
                    ></div>
                  </div>

                </div>
              </div>

              {/* Narrator Subtitles Drawer */}
              <div className="bg-slate-950/90 border-t border-slate-800 p-4 min-h-[70px] text-center flex items-center justify-center px-8 relative z-10">
                <span className="text-xs text-slate-200 leading-relaxed font-semibold italic text-center max-w-2xl">
                  "{activeScript[currentScene]?.subtitle}"
                </span>
              </div>

              {/* Player Navigation Bottom Bar */}
              <div className="p-4 bg-slate-900 border-t border-slate-850 flex justify-between items-center text-xs relative z-10">
                
                {/* Left Controls */}
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-2 bg-indigo-650 hover:bg-indigo-600 rounded-full text-white flex items-center justify-center border-0 cursor-pointer shadow-md"
                  >
                    {isPlaying ? <Pause size={13} /> : <Play size={13} className="fill-current ml-0.5" />}
                  </button>
                  <button 
                    onClick={handleRestart}
                    className="p-2 text-slate-400 hover:text-slate-200 bg-transparent border-0 cursor-pointer"
                    title="Restart Video"
                  >
                    <RotateCcw size={13} />
                  </button>
                  <button 
                    onClick={() => setSelectedRole(null)}
                    className="text-xs font-bold text-indigo-400 hover:text-indigo-300 bg-transparent border-0 cursor-pointer"
                  >
                    Choose Another Portal
                  </button>
                </div>

                {/* Center Progress */}
                <span className="font-mono text-[10px] text-slate-500">
                  {Math.floor(currentTime)}s / {totalDuration}s
                </span>

                {/* Right Mute & Volume */}
                <div className="flex items-center gap-2">
                  <button 
                    onClick={toggleMute}
                    className="p-1.5 text-slate-400 hover:text-white bg-transparent border-0 cursor-pointer"
                  >
                    {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      setVolume(v);
                      if (v === 0) {
                        setIsMuted(true);
                      } else {
                        setIsMuted(false);
                      }
                    }}
                    className="w-16 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                </div>

              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
