import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { checkoutCourse, validateCouponCode, exploreCourses } from "../../Api/studentApi";
import { CreditCard, Ticket, Search, Layers, Award, Sparkles, ChevronRight } from "lucide-react";

const StudentHome = () => {
  const user = useSelector((state) => state.auth.user);
  const studentId = user?.id;
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Search & category states
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // Checkout states
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(null);

  // Card inputs (mock state)
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const { data: courses, isLoading, isError, error } = useQuery({
    queryKey: ["courses", searchQuery, activeCategory],
    queryFn: () => exploreCourses({ search: searchQuery, category: activeCategory }),
  });

  const validateCouponMutation = useMutation({
    mutationFn: validateCouponCode,
    onSuccess: (data) => {
      setCouponDiscount(data.discountPercent);
      setCouponApplied(true);
      toast.success(`Coupon applied! ${data.discountPercent}% Discount`);
    },
    onError: () => {
      toast.error("Invalid or expired coupon code");
      setCouponDiscount(0);
      setCouponApplied(false);
    }
  });

  const checkoutMutation = useMutation({
    mutationFn: checkoutCourse,
    onSuccess: (data) => {
      setPaymentSuccess(data);
      toast.success("Checkout successful! Enrolled.");
      queryClient.invalidateQueries(["courses"]);
      queryClient.invalidateQueries(["enrolledCourses"]);
      queryClient.invalidateQueries(["studentDashboard"]);
    },
    onError: (err) => {
      toast.error(`Checkout failed: ${err.message || "Please try again."}`);
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center bg-red-50/50 border border-red-100 rounded-3xl max-w-xl mx-auto my-10">
        <p className="text-rose-500 font-bold text-sm">Failed to retrieve course catalog: {error.message}</p>
      </div>
    );
  }

  const handleCheckoutClick = (courseId) => {
    if (!studentId) {
      toast.error("Please login to enroll in courses");
      return;
    }
    setSelectedCourseId(courseId);
    setCouponCode("");
    setCouponDiscount(0);
    setCouponApplied(false);
    setPaymentSuccess(null);
    setCardName("");
    setCardNumber("");
    setCardExpiry("");
    setCardCvv("");
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    validateCouponMutation.mutate(couponCode);
  };

  const handlePaySubmit = (e) => {
    e.preventDefault();
    checkoutMutation.mutate({ courseId: selectedCourseId, couponCode: couponApplied ? couponCode : null });
  };

  // Filter courses
  const filteredCourses = courses || [];

  const currentCourse = courses?.find(c => c.id === selectedCourseId);
  const basePrice = currentCourse?.price != null ? currentCourse.price : 99.0;
  const finalPrice = basePrice * (100 - couponDiscount) / 100.0;

  const categories = ["All", "Backend Engineering", "Frontend Engineering", "DevOps"];

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10 text-left animate-fade-in">
      
      {/* 🔮 PREMIUM CORE HERO SECTION */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-8 md:p-12 shadow-xl shadow-slate-900/10">
        <div className="absolute top-[-20%] right-[-10%] w-[350px] h-[350px] bg-blue-500/20 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[300px] h-[300px] bg-indigo-500/20 blur-[90px] rounded-full pointer-events-none"></div>

        <div className="max-w-2xl space-y-6 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold tracking-wider text-blue-200 uppercase">
            <Sparkles size={12} className="animate-pulse" />
            <span>Unleash Your Dev Career</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Master Tomorrow's <span className="bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">Technical Skills</span> Today
          </h1>
          <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-xl">
            Learn directly from verified industry practitioners, submit production-grade capstones, and earn resume-ready skill badges.
          </p>

          {/* Search bar inside Hero */}
          <div className="pt-2 max-w-md">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search courses, frameworks, concepts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/10 border border-white/10 focus:border-white/30 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all backdrop-blur-md"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 🧭 FILTER CONTROLS */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/60 pb-5">
        <div className="flex items-center gap-2">
          <Layers size={16} className="text-indigo-500" />
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">Browse Class Categories</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeCategory === cat
                  ? "bg-slate-900 text-white shadow-md shadow-slate-900/10 scale-[1.02]"
                  : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/70"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 📚 COURSE GRID */}
      {filteredCourses.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white border border-slate-200/70 rounded-[32px] overflow-hidden shadow-sm flex flex-col justify-between group hover:border-slate-300 hover:shadow-xl hover:translate-y-[-2px] transition-all duration-300"
            >
              <div>
                {/* Visual Placeholder Header */}
                <div className="h-48 relative overflow-hidden bg-gradient-to-tr from-slate-900 to-indigo-950 flex items-center justify-center p-6 text-left">
                  <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/10 backdrop-blur-md text-white/95 text-[9px] font-bold rounded-lg uppercase tracking-wider">
                      {course.category || "Engineering"}
                    </span>
                  </div>
                  <div className="space-y-1.5 relative z-10 w-full">
                    <Sparkles size={24} className="text-blue-400" />
                    <h3 className="text-white font-extrabold text-base line-clamp-2 leading-snug">
                      {course.title}
                    </h3>
                  </div>
                </div>

                <div className="p-6 space-y-4 text-left">
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                    {course.description}
                  </p>

                  <div className="flex justify-between items-center border-t border-slate-100 pt-4 text-xs font-semibold text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Award size={14} className="text-indigo-500" />
                      <span>{course.level || "Intermediate"}</span>
                    </div>
                    <span className="text-base font-extrabold text-slate-800">
                      ${course.price != null ? course.price.toFixed(2) : "99.00"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  onClick={() => handleCheckoutClick(course.id)}
                  className="w-full py-3 bg-slate-900 hover:bg-blue-600 hover:shadow-md text-white rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 group"
                >
                  <CreditCard size={14} className="group-hover:scale-105 transition-transform" />
                  <span>Buy Learning Track</span>
                  <ChevronRight size={12} className="transform group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-16 text-center border border-dashed border-slate-200 rounded-[32px] text-sm text-slate-400 font-medium">
          No courses found matching the active search filters.
        </div>
      )}

      {/* Checkout Sheet Overlay Modal */}
      {selectedCourseId && currentCourse && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-150 animate-fade-in flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block">Secure Payment Gateway</span>
                <h3 className="font-extrabold text-slate-900 text-lg">Checkout Course</h3>
              </div>
              <button
                onClick={() => setSelectedCourseId(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {!paymentSuccess ? (
                <div className="space-y-6">
                  {/* Course price card summary */}
                  <div className="p-4 bg-slate-50 border border-slate-200/50 rounded-2xl flex justify-between items-center text-left">
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-sm">{currentCourse.title}</h4>
                      <p className="text-[11px] text-slate-400">Class mentor: {currentCourse.trainerName ?? "Assigned"}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs text-slate-400 line-through block">
                        {couponApplied ? `$${basePrice.toFixed(2)}` : ""}
                      </span>
                      <span className="font-extrabold text-slate-800 text-base">
                        ${finalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Coupon Code validator */}
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <Ticket size={14} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Apply Voucher Coupon..."
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        disabled={couponApplied}
                        className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={couponApplied}
                      className="px-4 py-2.5 bg-slate-900 hover:bg-blue-600 disabled:bg-slate-100 disabled:text-slate-400 text-white rounded-xl text-xs font-bold transition-all"
                    >
                      {couponApplied ? "Applied" : "Apply"}
                    </button>
                  </form>

                  {/* Credit Card simulated payment forms */}
                  <form onSubmit={handlePaySubmit} className="space-y-4 text-left">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Cardholder Name</label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Card Number</label>
                      <div className="relative">
                        <CreditCard size={14} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          required
                          placeholder="4111 2222 3333 4444"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                          maxLength="19"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Expiration Date</label>
                        <input
                          type="text"
                          required
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          maxLength="5"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">CVV</label>
                        <input
                          type="password"
                          required
                          placeholder="***"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          maxLength="3"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={checkoutMutation.isPending}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 mt-4"
                    >
                      {checkoutMutation.isPending ? "Processing Security Checkout..." : `Pay $${finalPrice.toFixed(2)} & Enroll`}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="py-8 text-center space-y-6 animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto text-2xl font-bold shadow-lg shadow-emerald-500/20">
                    ✓
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xl font-extrabold text-slate-800">Payment Completed!</h4>
                    <p className="text-xs text-slate-400">
                      Successfully enrolled in <strong>{paymentSuccess.courseTitle}</strong>.
                    </p>
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-left max-w-sm mx-auto space-y-1.5 mt-4">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-400">Transaction ID:</span>
                        <span className="font-bold text-slate-700">{paymentSuccess.transactionId}</span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-400">Amount Charged:</span>
                        <span className="font-bold text-slate-700">${paymentSuccess.amountPaid?.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-400">Status:</span>
                        <span className="font-bold text-emerald-600 uppercase tracking-wider">{paymentSuccess.status}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCourseId(null);
                      navigate("/mylearning");
                    }}
                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow transition-all"
                  >
                    Go to My Workspace
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(StudentHome);