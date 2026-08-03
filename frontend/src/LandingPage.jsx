import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Login } from "./auth/Login";
import { Registerpage } from "./auth/Registerpage";
import { Button } from "./components/ui/button";
import VideoDemoModal from "./components/demo/VideoDemoModal";
import {
  BookOpen,
  Award,
  Search,
  ArrowRight,
  GraduationCap,
  Star,
  Sparkles,
  ChevronDown,
  CheckCircle2,
  Users,
  ShieldCheck,
  Zap,
  HelpCircle,
  Mail,
  ArrowUpRight,
  Play
} from "lucide-react";

// AuthModal wrapper with glassmorphism and subtle animations
const AuthModal = ({ mode, onClose, onModeChange }) => {
  const showLogin = mode === "login";

  const title = useMemo(() => {
    return mode === "register" ? "Create your LearnSpear Account" : "Welcome back to LearnSpear";
  }, [mode]);

  if (!mode) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all duration-300 animate-fade-in">
      <div className="bg-white/80 backdrop-blur-2xl rounded-3xl p-6 md:p-8 w-full max-w-md border border-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] relative transform transition-transform duration-300 scale-100">
        
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-slate-100/50 hover:bg-slate-100 p-1.5 rounded-full transition-all duration-150"
          onClick={onClose}
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 bg-blue-50 text-blue-600 rounded-2xl mb-3">
            {mode === "register" ? <Sparkles size={24} /> : <GraduationCap size={24} />}
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">{title}</h2>
          <p className="text-xs text-slate-500 mt-1">
            {mode === "register"
              ? "Join thousands of students learning from experts today"
              : "Access your dashboard and continue learning"}
          </p>
        </div>

        {/* Form Body */}
        <div className="transition-all duration-200">
          {showLogin ? (
            <Login onSuccess={onClose} onSwitch={() => onModeChange("register")} />
          ) : (
            <Registerpage onSuccess={onClose} onSwitch={() => onModeChange("login")} />
          )}
        </div>
      </div>
    </div>
  );
};

// Features data
const features = [
  {
    icon: <Users className="text-blue-500" size={24} />,
    title: "1-on-1 Mentorship",
    description: "Get personalized, direct feedback from industry trainers on your custom path.",
  },
  {
    icon: <BookOpen className="text-indigo-500" size={24} />,
    title: "Curated Learning Paths",
    description: "Follow structural curricula tailored specifically for job-market demands.",
  },
  {
    icon: <ShieldCheck className="text-emerald-500" size={24} />,
    title: "Verified Trainers",
    description: "Every trainer undergoes strict portfolio screening and background checks.",
  },
  {
    icon: <Award className="text-purple-500" size={24} />,
    title: "Project Certification",
    description: "Earn shareable, verified credentials based on real-world capstone projects.",
  },
];

// Student Journey path
const journeySteps = [
  {
    step: "01",
    title: "Discover Your Path",
    description: "Choose from 100+ modern domains matching your career objectives.",
  },
  {
    step: "02",
    title: "Match with Trainers",
    description: "Filter trainers by professional background, schedule, and portfolio.",
  },
  {
    step: "03",
    title: "Build Capstone Projects",
    description: "Receive practical tasks and code reviews rather than theoretical slides.",
  },
  {
    step: "04",
    title: "Succeed Globally",
    description: "Get certified and present your portfolio directly to corporate partners.",
  },
];

// FAQ Accordion items
const faqsList = [
  {
    q: "How does the matching between students and trainers work?",
    a: "Students can browse trainer profiles, check ratings, filter by subjects, and directly request mock-ups or bookings. LearnSpear handles the secure scheduling and virtual classrooms.",
  },
  {
    q: "Are the courses self-paced or live?",
    a: "It is a hybrid system! While you have self-paced modules, the key differentiator is the live sessions, direct feedback loops, and interactive forums hosted by your assigned trainer.",
  },
  {
    q: "How do you verify trainer credentials?",
    a: "All potential trainers submit professional portfolios, proof of industry experience, and pass an initial teaching demo. Only the top 8% of applicants are verified to teach on LearnSpear.",
  },
  {
    q: "Can I switch trainers if I'm not satisfied?",
    a: "Absolutely. Student satisfaction is our top priority. If you feel a mentor's teaching style isn't matching your pace, you can change your trainer anytime without extra costs.",
  },
];

export default function LandingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDemoModal, setShowDemoModal] = useState(false);

  // Track scrolling to toggle glass navbar styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    document.title = "LearnSpear | Educational Student-Trainer Network";
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update modal auth states from routing paths
  useEffect(() => {
    const path = location.pathname.toLowerCase();
    if (path === "/login") setAuthMode("login");
    else if (path === "/register") setAuthMode("register");
    else setAuthMode(null);
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setAuthMode("register"); // Guide guest searches to start registration
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50 overflow-x-hidden selection:bg-blue-500 selection:text-white">
      
      {/* Dynamic Background Blob Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-300/10 blur-[130px] rounded-full animate-blob pointer-events-none z-0"></div>
      <div className="absolute top-[600px] left-[-100px] w-[600px] h-[600px] bg-indigo-300/10 blur-[150px] rounded-full animate-blob pointer-events-none z-0"></div>

      {/* 🧭 PREMIUM GLASS NAVBAR */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? "py-3 px-6 md:px-12 glass-nav shadow-sm"
            : "py-5 px-6 md:px-12 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-extrabold shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
              LS
            </div>
            <span className="text-xl font-extrabold bg-gradient-to-r from-slate-800 to-slate-900 bg-clip-text text-transparent tracking-tight">
              LearnSpear
            </span>
          </div>

          {/* Nav Links & CTA */}
          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={() => {
                const el = document.getElementById("student-benefits");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="hidden md:inline-block text-sm font-semibold text-slate-600 hover:text-blue-600 px-4 py-2 rounded-xl hover:bg-slate-100/50 transition-colors"
            >
              Benefits
            </button>
            <button
              onClick={() => {
                const el = document.getElementById("how-it-works");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="hidden md:inline-block text-sm font-semibold text-slate-600 hover:text-blue-600 px-4 py-2 rounded-xl hover:bg-slate-100/50 transition-colors"
            >
              How It Works
            </button>
            
            <span className="w-px h-6 bg-slate-200 hidden md:block"></span>

            <button
              onClick={() => setShowDemoModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-2.5 text-sm font-bold shadow-sm flex items-center gap-1.5 border-0 cursor-pointer transition-all duration-200"
            >
              <Play size={12} className="fill-current" />
              <span>Video Demo</span>
            </button>

            <Button
              variant="secondary"
              onClick={() => setAuthMode("login")}
              className="bg-transparent hover:bg-slate-100 text-slate-700 shadow-none border-0 px-4"
            >
              Sign In
            </Button>
            <Button
              onClick={() => setAuthMode("register")}
              className="bg-slate-900 text-white hover:bg-slate-800 rounded-xl px-5 py-2 text-sm shadow-sm"
            >
              Join Free
            </Button>
          </div>
        </div>
      </header>

      {/* 🚀 STUDENT HERO SECTION (Primary Focus) */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 max-w-7xl mx-auto px-6 grid md:grid-cols-12 gap-12 items-center z-10">
        
        {/* Left Side: Copywriting & Actions */}
        <div className="md:col-span-7 space-y-6 text-left">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50/80 border border-blue-100 rounded-full text-blue-600 text-xs font-semibold tracking-wide uppercase">
            <Sparkles size={14} className="text-blue-500 animate-spin" style={{ animationDuration: '3s' }} />
            <span>Interactive Educational Network</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
            Learn from verified trainers, not just pre-recorded <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-transparent bg-clip-text">videos.</span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
            Bridge the gap between curiosity and career. Connect directly with specialized mentors, build live projects, and get verified certificates.
          </p>

          {/* Interactive Course Search */}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="What skill do you want to learn?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all"
              />
            </div>
            <Button type="submit" className="py-3 px-6 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700">
              Find My Trainer
            </Button>
          </form>

          {/* Statistics/Social Proof Badges */}
          <div className="pt-6 flex flex-wrap gap-6 items-center border-t border-slate-200">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((num) => (
                <div key={num} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                  <img
                    src={`https://images.unsplash.com/photo-${
                      num === 1
                        ? "1534528741775-53994a69daeb"
                        : num === 2
                        ? "1507003211169-0a1dd7228f2d"
                        : "1494790108377-be9c29b29330"
                    }?auto=format&fit=crop&w=100&q=80`}
                    alt="Student user"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center text-amber-500">
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <span className="ml-1.5 font-bold text-slate-900 text-sm">4.9/5</span>
              </div>
              <p className="text-xs font-semibold text-slate-500">trusted by 15,000+ active students</p>
            </div>
          </div>
        </div>

        {/* Right Side: Floating Student Illustration Frame */}
        <div className="md:col-span-5 relative flex justify-center">
          {/* Glowing backlighting */}
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-400 to-indigo-500 rounded-full blur-[100px] opacity-15 w-[350px] h-[350px] mx-auto top-10 pointer-events-none"></div>

          {/* Floating Student Frame */}
          <div className="relative w-full max-w-[360px] aspect-square rounded-[36px] bg-gradient-to-tr from-white/90 to-white/40 p-4 border border-white/70 shadow-[0_20px_50px_-12px_rgba(30,41,59,0.08)] animate-float">
            <div className="w-full h-full rounded-[28px] overflow-hidden bg-slate-100 shadow-inner">
              <img
                src="/student_hero.jpg"
                alt="Student learning 3D illustration"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Float Badge 1 (Student Status) */}
            <div className="absolute -left-6 bottom-10 p-3 rounded-2xl glass-card border border-white shadow-lg flex items-center gap-2.5 max-w-[170px] animate-float-delayed">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <CheckCircle2 size={16} />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Assignment</span>
                <span className="text-xs font-bold text-slate-800">100% Approved</span>
              </div>
            </div>

            {/* Float Badge 2 (Live Connection) */}
            <div className="absolute -right-6 top-10 p-3.5 rounded-2xl bg-slate-900 text-white shadow-xl flex items-center gap-3 animate-float">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <div className="text-left">
                <span className="text-xs font-bold block">Live Mentoring</span>
                <span className="text-[9px] text-slate-400">Trainer is online</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🧩 STUDENT FEATURES GRID */}
      <section id="student-benefits" className="py-20 border-t border-slate-100 bg-white/40 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-blue-600 tracking-widest uppercase block">Why LearnSpear?</span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Built around student success</h2>
            <p className="text-slate-500">Every resource, tool, and feature is designed to speed up your path to industry standards.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {features.map((feat, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-start text-left space-y-4 group"
              >
                <div className="p-3 bg-slate-50 group-hover:bg-blue-50 group-hover:text-blue-600 rounded-2xl transition-colors duration-200">
                  {feat.icon}
                </div>
                <h3 className="font-bold text-slate-800 text-lg">{feat.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🧑‍🎓 INTERACTIVE STUDENT JOURNEY ROADMAP */}
      <section id="how-it-works" className="py-20 bg-slate-50 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-indigo-600 tracking-widest uppercase block">The Roadmap</span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Your Journey on LearnSpear</h2>
            <p className="text-slate-500">From picking your subject to global career readiness. Here is how we make it happen.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 relative">
            {journeySteps.map((step, idx) => (
              <div key={idx} className="relative p-6 bg-white border border-slate-100 rounded-3xl text-left shadow-sm hover:shadow-md transition-all duration-300">
                <span className="text-4xl font-extrabold bg-gradient-to-br from-blue-600 to-indigo-600 text-transparent bg-clip-text opacity-15 absolute top-4 right-6">
                  {step.step}
                </span>
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm mb-6">
                  {idx + 1}
                </div>
                <h4 className="font-extrabold text-slate-800 mb-2">{step.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 💼 SUBTLE TRAINER CTA SECTION (Secondary Focus) */}
      <section className="py-20 bg-white relative z-10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="p-8 md:p-12 rounded-[40px] bg-gradient-to-tr from-slate-900 to-slate-800 text-white border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center gap-10">
            {/* Background glowing blob */}
            <div className="absolute top-[-100px] right-[-100px] w-80 h-80 bg-blue-500/20 blur-[90px] rounded-full pointer-events-none"></div>

            {/* Left side: Trainer details */}
            <div className="flex-1 space-y-6 text-left relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-blue-300 text-xs font-semibold uppercase tracking-wider">
                <Zap size={12} />
                <span>Join our Faculty</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
                Are you an expert? <br/>
                <span className="text-blue-400">Share your knowledge.</span>
              </h2>
              <p className="text-sm text-slate-400 max-w-md leading-relaxed">
                Connect with passionate students, design custom curriculums, and earn on your schedule. We provide the tools, support, and billing management.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setAuthMode("register")}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-md shadow-blue-600/10 group"
                >
                  <span>Apply as Trainer</span>
                  <ArrowRight size={16} className="transform group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* Right side: floating trainer image */}
            <div className="w-full max-w-[240px] aspect-square rounded-3xl p-2.5 bg-white/5 border border-white/10 shadow-lg animate-float relative z-10">
              <div className="w-full h-full rounded-[18px] overflow-hidden bg-slate-800">
                <img
                  src="/trainer_hero.jpg"
                  alt="Trainer lecturer 3D illustration"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ❔ INTERACTIVE FAQ SECTION */}
      <section className="py-20 bg-slate-50 relative z-10">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-blue-600 tracking-widest uppercase block flex items-center justify-center gap-1.5">
              <HelpCircle size={14} />
              <span>Questions & Answers</span>
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Frequently Asked Questions</h2>
            <p className="text-slate-500">Got questions? We have compiled the answers to the most common queries below.</p>
          </div>

          <div className="space-y-4">
            {faqsList.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow transition-shadow duration-200"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full py-5 px-6 flex justify-between items-center text-left font-bold text-slate-800 hover:text-blue-600 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={18}
                      className={`text-slate-400 transition-transform duration-300 ${isOpen ? "transform rotate-180 text-blue-600" : ""}`}
                    />
                  </button>
                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isOpen ? "max-h-[200px] border-t border-slate-50" : "max-h-0"
                    }`}
                  >
                    <p className="p-6 text-sm text-slate-500 leading-relaxed bg-slate-50/30">
                      {faq.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 📨 NEWSLETTER SECTION */}
      <section className="py-16 bg-white relative z-10 border-t border-slate-100">
        <div className="max-w-3xl mx-auto px-6 text-center space-y-6">
          <div className="inline-flex p-3 bg-blue-50 text-blue-600 rounded-full">
            <Mail size={24} />
          </div>
          <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Stay updated with learn guides</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            Get career insights, course announcements, and educational resources directly in your inbox. No spam, ever.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
            />
            <Button className="bg-slate-900 text-white hover:bg-slate-800 px-6 py-3 rounded-xl flex items-center justify-center gap-1.5">
              <span>Subscribe</span>
              <ArrowUpRight size={16} />
            </Button>
          </div>
        </div>
      </section>

      {/* 🚀 PREMIUM FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 text-left">
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-extrabold text-sm shadow">
                LS
              </div>
              <span className="text-lg font-extrabold text-white tracking-tight">
                LearnSpear
              </span>
            </div>
            <p className="text-xs max-w-sm leading-relaxed text-slate-500">
              The premier interactive educational network. Connect, learn, build, and certified directly with verified trainers.
            </p>
          </div>
          <div className="space-y-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider">Platform</span>
            <ul className="space-y-2 text-xs">
              <li><span className="hover:text-white cursor-pointer transition-colors" onClick={() => setAuthMode("register")}>Browse Courses</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors" onClick={() => setAuthMode("register")}>Verify Credentials</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors" onClick={() => setAuthMode("register")}>Pricing Model</span></li>
            </ul>
          </div>
          <div className="space-y-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider">Company</span>
            <ul className="space-y-2 text-xs">
              <li><span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Contact Support</span></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-6 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-600">
          <p>© {new Date().getFullYear()} LearnSpear Inc. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Twitter</span>
            <span className="hover:text-slate-400 cursor-pointer">LinkedIn</span>
            <span className="hover:text-slate-400 cursor-pointer">GitHub</span>
          </div>
        </div>
      </footer>

      {/* Auth Modal Overlay */}
      <AuthModal
        mode={authMode}
        onClose={() => {
          setAuthMode(null);
          navigate("/"); // Clear url routing modal state
        }}
        onModeChange={setAuthMode}
      />

      {/* Video Demo Modal Overlay */}
      <VideoDemoModal
        isOpen={showDemoModal}
        onClose={() => setShowDemoModal(false)}
      />
    </div>
  );
}