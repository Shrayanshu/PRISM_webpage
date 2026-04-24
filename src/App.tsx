import { useEffect, useRef, useState } from 'react';
import { motion, useInView, animate } from 'motion/react';

// Common Animation Variants
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const staggerItems = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

// Reusable Components
function AnimatedNumber({ value, suffix = "", duration = 1.5 }: { value: number, suffix?: string, duration?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (inView) {
      const controls = animate(0, value, {
        duration,
        ease: "easeOut",
        onUpdate: (v) => setCurrent(Math.round(v)),
      });
      return controls.stop;
    }
  }, [inView, value, duration]);

  return <span ref={ref}>{current}{suffix}</span>;
}

function Typewriter({ text, speed = 40 }: { text: string, speed?: number }) {
  const [displayed, setDisplayed] = useState("");
  
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);
  
  return <p className="font-body-md text-on-surface m-0 leading-relaxed">{displayed}</p>;
}

function AskAISequence() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px 0px" });
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!inView) return;
    
    const runSequence = async () => {
      setStep(1); // Typewriter
      await new Promise(r => setTimeout(r, 1800)); 
      setStep(2); // Processing
      await new Promise(r => setTimeout(r, 1200));
      setStep(3); // Alert
      await new Promise(r => setTimeout(r, 600));
      setStep(4); // Bullets
      await new Promise(r => setTimeout(r, 1500));
      setStep(5); // Recommendation
    };
    
    runSequence();
  }, [inView]);

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-xl border border-slate-200" ref={ref}>
      <div className="bg-slate-50 border-b border-slate-200 p-sm flex items-center justify-between">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-error"></div>
          <div className="w-3 h-3 rounded-full bg-tertiary-fixed-dim"></div>
          <div className="w-3 h-3 rounded-full bg-secondary-fixed-dim"></div>
        </div>
        <span className="font-label-caps text-label-caps text-slate-400">PRISM CONSOLE V4.2</span>
      </div>
      
      <div className="p-lg space-y-md min-h-[400px]">
        {step >= 1 && (
          <div className="flex justify-end">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, originX: 1, originY: 1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-surface-container-high p-md rounded-lg max-w-[80%]"
            >
              <Typewriter text="Can we submit the bid today?" speed={30} />
            </motion.div>
          </div>
        )}

        {step === 2 && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="flex justify-start mb-2"
          >
            <div className="flex items-center space-x-2 px-md">
              <motion.div 
                animate={{ opacity: [0.3, 1, 0.3] }} 
                transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }} 
                className="w-2 h-2 bg-primary rounded-full"
              />
              <p className="text-[10px] font-code uppercase text-slate-400 tracking-widest m-0 leading-none">Pre-submission validation running...</p>
            </div>
          </motion.div>
        )}

        {step >= 3 && (
          <div className="flex justify-start">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white border border-outline-variant p-md rounded-lg max-w-[90%] shadow-sm w-full"
            >
              <motion.p 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="font-label-caps text-error text-label-caps mb-sm tracking-widest font-bold m-0"
              >
                CRITICAL: PRE-SUBMISSION CHECK FAILED
              </motion.p>
              
              {step >= 4 && (
                <motion.ul 
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="space-y-xs mb-md mt-sm"
                >
                  <motion.li variants={staggerItems} className="flex items-start text-body-sm text-on-surface">
                    <span className="material-symbols-outlined text-error text-[18px] mr-2">close</span>
                    3 clarifications pending from Engineering lead
                  </motion.li>
                  <motion.li variants={staggerItems} className="flex items-start text-body-sm text-on-surface">
                    <span className="material-symbols-outlined text-error text-[18px] mr-2">close</span>
                    Delivery timeline risk detected (Clause 4.2 contradicts internal logistics)
                  </motion.li>
                  <motion.li variants={staggerItems} className="flex items-start text-body-sm text-on-surface">
                    <span className="material-symbols-outlined text-error text-[18px] mr-2">close</span>
                    Warranty terms unresolved in last 3 email exchanges
                  </motion.li>
                </motion.ul>
              )}

              {step >= 5 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-slate-900 text-white p-sm rounded border border-slate-700"
                >
                  <p className="font-body-sm font-semibold m-0">Recommendation: Do Not Submit</p>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="font-body-md antialiased text-on-background bg-background min-h-screen">
      {/* CLOUDFLARE DEBUG BANNER */}
      <div className="bg-red-600 text-white text-center py-4 font-bold tracking-widest uppercase z-[9999] relative">
        CLOUDFLARE DEPLOYMENT TEST - IF YOU SEE THIS, THE LATEST BUILD IS LIVE
      </div>
      
      {/* TopNavBar */}
      <nav className="sticky top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="flex justify-between items-center h-16 px-8 max-w-7xl mx-auto">
          <div className="text-xl font-bold tracking-tight text-slate-900">PRISM</div>
          <div className="hidden md:flex space-x-8">
            <a className="text-slate-600 hover:text-slate-900 transition-colors font-body-md text-body-sm font-medium" href="#system">System</a>
            <a className="text-slate-600 hover:text-slate-900 transition-colors font-body-md text-body-sm font-medium" href="#impact">Impact</a>
            <a className="text-slate-600 hover:text-slate-900 transition-colors font-body-md text-body-sm font-medium" href="#agents">Platform</a>
            <a className="text-slate-600 hover:text-slate-900 transition-colors font-body-md text-body-sm font-medium" href="#security">Security</a>
            <a className="text-slate-600 hover:text-slate-900 transition-colors font-body-md text-body-sm font-medium" href="#contact">Contact</a>
          </div>
          <a href="#contact" className="bg-primary text-on-primary px-sm py-xs rounded-lg font-label-caps text-label-caps hover:bg-slate-800 transition-all shadow hover:shadow-md hover:scale-[1.02] active:scale-[0.98] inline-block">
            Deploy PRISM
          </a>
        </div>
      </nav>

      <main className="mt-16">
        {/* HERO SECTION */}
        <section className="py-xl px-margin max-w-7xl mx-auto relative cursor-default">
          <div className="absolute inset-0 bg-grid-motion -z-10 bg-opacity-50"></div>
          
          <div className="grid lg:grid-cols-2 gap-lg items-center relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="font-h1 text-h1 text-on-background mb-md leading-tight">
                We don’t guess before execution. <span className="text-primary">We know — before we submit.</span>
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-lg">
                Every commitment, risk, and dependency is tracked before submission — so nothing is missed when it matters most.
              </p>
              <p className="font-body-md text-on-surface-variant mb-lg mt-[-16px]">
                Used across live bids to ensure zero missed commitments and full clarity before submission.
              </p>
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-md mt-6">
                <a href="#contact" className="w-full sm:w-auto text-center bg-primary text-on-primary px-8 py-4 rounded-lg font-label-caps text-label-caps tracking-widest hover:bg-slate-800 transition-all shadow-lg hover:shadow-[0_0_20px_rgba(0,0,0,0.15)] hover:scale-[1.02] cursor-pointer">
                  DEPLOY PRISM TODAY
                </a>
                <a href="#system" className="w-full sm:w-auto text-center border border-outline text-on-surface px-8 py-4 rounded-lg font-label-caps text-label-caps tracking-widest hover:bg-slate-50 transition-all hover:shadow-sm hover:scale-[1.02] cursor-pointer">
                  SEE HOW IT WORKS
                </a>
              </div>
            </motion.div>

            {/* Bid Control Panel Mockup */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-surface-container-lowest border border-outline-variant p-md rounded-xl shadow-lg bg-opacity-95"
            >
              <div className="flex justify-between items-center mb-md border-b border-outline-variant pb-sm">
                <div className="flex items-center space-x-sm">
                  <span className="material-symbols-outlined text-primary">dashboard_customize</span>
                  <span className="font-label-caps text-label-caps uppercase tracking-wider">Bid Control Panel</span>
                </div>
                <motion.div 
                  animate={{ boxShadow: ['0 0 0px rgba(186,26,26,0)', '0 0 16px rgba(186,26,26,0.4)', '0 0 0px rgba(186,26,26,0)'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="bg-error-container text-on-error-container px-sm py-xs rounded text-body-sm font-semibold flex items-center"
                >
                  <span className="material-symbols-outlined text-[16px] mr-1">warning</span>
                  Status: Not Ready to Submit
                </motion.div>
              </div>

              <div className="grid grid-cols-2 gap-sm mb-md">
                <div className="bg-surface-container p-sm rounded border border-outline-variant">
                  <p className="font-label-caps text-[10px] text-on-surface-variant uppercase mb-xs m-0">Submission Readiness</p>
                  <p className="font-h2 text-h2 text-error m-0 leading-none mt-1">
                    <AnimatedNumber value={34} suffix="%" />
                  </p>
                  <div className="w-full bg-surface-container-highest h-1 rounded-full mt-2">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "34%" }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="bg-error h-1 rounded-full"
                    />
                  </div>
                </div>
                
                <div className="bg-surface-container p-sm rounded border border-outline-variant">
                  <p className="font-label-caps text-[10px] text-on-surface-variant uppercase mb-xs m-0">Action Items</p>
                  <p className="font-h2 text-h2 text-on-surface m-0 leading-none mt-1">
                    <AnimatedNumber value={3} suffix=" Pending" />
                  </p>
                  <p className="text-[10px] text-on-surface-variant mt-1 m-0">Clarifications required</p>
                </div>
              </div>

              <motion.div 
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="space-y-sm"
              >
                <motion.div variants={staggerItems} className="flex items-center justify-between p-sm border-l-4 border-error bg-error-container/20">
                  <div className="flex items-center space-x-sm">
                    <span className="material-symbols-outlined text-error">report</span>
                    <span className="text-body-sm font-semibold">
                      <AnimatedNumber value={2} suffix=" Risks Identified" />
                    </span>
                  </div>
                  <span className="text-xs text-error font-bold uppercase">Critical</span>
                </motion.div>
                
                <motion.div variants={staggerItems} className="p-sm bg-surface-container-low border border-outline-variant rounded flex items-center space-x-sm">
                  <span className="material-symbols-outlined text-secondary">mail</span>
                  <span className="text-body-sm text-on-surface-variant">Unresolved Warranty Clause (Email Thread #12)</span>
                </motion.div>
                
                <motion.div variants={staggerItems} className="p-sm bg-surface-container-low border border-outline-variant rounded flex items-center space-x-sm">
                  <span className="material-symbols-outlined text-secondary">history</span>
                  <span className="text-body-sm text-on-surface-variant">Last update: 4 mins ago by AI Core</span>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section className="border-y border-outline-variant bg-white py-6">
          <div className="max-w-7xl mx-auto px-margin flex flex-wrap justify-center gap-x-12 gap-y-4 text-center">
            <div className="flex items-center space-x-2">
              <span className="material-symbols-outlined text-primary text-[20px]">verified</span>
              <span className="font-label-caps text-label-caps uppercase">Used across 50+ active bids</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
              <span className="font-label-caps text-label-caps uppercase">0 missed commitments in recent submissions</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="material-symbols-outlined text-primary text-[20px]">timer</span>
              <span className="font-label-caps text-label-caps uppercase">Avg bid review time: 20 minutes</span>
            </div>
          </div>
        </section>

        {/* PROBLEM SECTION */}
        <section className="bg-surface-container-low py-xl">
          <div className="max-w-7xl mx-auto px-margin">
            <div className="text-center mb-lg">
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">The Risk Gap</span>
              <h2 className="font-h2 text-h2 mt-xs text-on-background m-0">Why bids fail after winning.</h2>
            </div>
            
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
              className="grid md:grid-cols-4 gap-md mb-lg"
            >
              {[
                { icon: "mail_off", text: "100+ emails across threads → critical details get lost" },
                { icon: "inventory_2", text: "Commitments buried in conversations → risk of missed obligations" },
                { icon: "timer_off", text: "No visibility into pending actions → delays before submission" },
                { icon: "error", text: "Risks discovered too late → impact after project starts" }
              ].map((card, i) => (
                <motion.div 
                  key={i} 
                  variants={fadeUp} 
                  whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)" }}
                  className="p-md bg-white border border-slate-200 rounded-lg shadow-sm transition-all hover:border-slate-300"
                >
                  <span className="material-symbols-outlined text-error mb-sm text-[28px]">{card.icon}</span>
                  <p className="font-body-md text-on-surface m-0 leading-relaxed">{card.text}</p>
                </motion.div>
              ))}
            </motion.div>
            
            <div className="text-center">
              <p className="font-h3 text-h3 text-on-surface italic m-0">Result: Delays. Cost overruns. Lost bids.</p>
            </div>
          </div>
        </section>

        {/* SYSTEM FLOW */}
        <section id="system" className="py-xl px-margin max-w-7xl mx-auto text-center scroll-mt-20">
          <h2 className="font-h2 text-h2 mb-xl mt-0">Institutional Intelligence Engine</h2>
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: { 
                opacity: 1, 
                transition: { staggerChildren: 0.25 }
              }
            }}
            className="flex flex-col md:flex-row items-center justify-between space-y-lg md:space-y-0 relative"
          >
            {/* Connector lines hidden on mobile */}
            <div className="hidden md:block absolute top-[50%] left-0 w-full h-[1px] bg-slate-200 -z-10 overflow-hidden">
              <motion.div 
                initial={{ x: "-100%" }}
                whileInView={{ x: "100%" }}
                transition={{ duration: 2.5, ease: "linear", repeat: Infinity }}
                className="w-1/3 h-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-40 ml-[-30%]"
              />
            </div>

            {[
              { title: "Input", desc: "Project Communication", icon: "inbox", bg: "bg-primary" },
              { title: "Process", desc: "PRISM Intelligence Engine", icon: "memory", bg: "bg-primary-container" },
              { title: "Analyze", desc: "Risk & Action Detection", icon: "analytics", bg: "bg-surface-tint" },
              { title: "Output", desc: "Bid Control Dashboard", icon: "terminal", bg: "bg-primary" },
            ].map((node, i) => (
              <motion.div 
                key={i}
                variants={fadeUp} 
                whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)" }}
                className="w-full md:w-64 bg-white p-md border border-outline-variant rounded-xl shadow-sm z-10 transition-all hover:border-slate-300 cursor-default"
              >
                <div className={`w-12 h-12 ${node.bg} rounded-lg flex items-center justify-center mx-auto mb-sm`}>
                  <span className="material-symbols-outlined text-white">{node.icon}</span>
                </div>
                <h3 className="font-label-caps text-label-caps mb-xs uppercase m-0">{node.title}</h3>
                <p className="font-body-sm text-on-surface-variant m-0">{node.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ASK AI DEMO */}
        <section className="bg-on-primary-fixed py-xl">
          <div className="max-w-4xl mx-auto px-margin">
            <AskAISequence />
          </div>
        </section>

        {/* BUSINESS IMPACT */}
        <section id="impact" className="py-xl max-w-7xl mx-auto px-margin scroll-mt-16">
          <div className="grid md:grid-cols-3 gap-md mb-xl">
            <motion.div whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)" }} className="text-center p-lg border border-outline-variant rounded-xl bg-white transition-all hover:border-slate-300">
              <p className="font-h1 text-[48px] text-primary mb-xs mt-0">Minutes</p>
              <p className="font-body-lg text-on-surface-variant m-0 mb-4">Bid status review instead of hours</p>
              <p className="font-body-md text-on-surface-variant m-0">Used across live bids to ensure zero missed commitments and full clarity before submission.</p>
            </motion.div>
            
            <motion.div whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)" }} className="text-center p-lg border border-outline-variant rounded-xl bg-white transition-all hover:border-slate-300">
              <p className="font-h1 text-[48px] text-primary mb-xs mt-0">Zero</p>
              <p className="font-body-lg text-on-surface-variant m-0 mb-4">Missed commitments across active bids</p>
              <p className="font-body-md text-on-surface-variant m-0">Used across live bids to ensure zero missed commitments and full clarity before submission.</p>
            </motion.div>
            
            <motion.div whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)" }} className="text-center p-lg border border-outline-variant rounded-xl relative overflow-hidden bg-white transition-all hover:border-slate-300">
              <p className="font-h1 text-[48px] text-primary mb-xs mt-0">
                <AnimatedNumber value={100} suffix="%" duration={2} />
              </p>
              <p className="font-body-lg text-on-surface-variant m-0 mb-4">Clarity before submission</p>
              <p className="font-body-md text-on-surface-variant m-0">Used across live bids to ensure zero missed commitments and full clarity before submission.</p>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto bg-surface-container-low p-lg border border-outline-variant rounded-xl relative"
          >
            <span className="material-symbols-outlined absolute -top-4 left-8 text-[40px] text-primary/10">format_quote</span>
            <p className="font-h3 text-h3 text-on-background mb-sm leading-relaxed mt-0">
              "Bid review time cut from 3 hours to 20 minutes."
            </p>
            <div className="flex items-center space-x-sm">
              <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center overflow-hidden">
                <img 
                  className="w-full h-full object-cover" 
                  alt="professional portrait" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjPdgFphbDuQVK-6hsSpo6mQ0z2AuCZ0-iJBWbx-1bhK0PIqNcLzKPM8nj22Nr8zl4fmlixsHyC43zAFxOFpHtpQJDFqcpzyYkH9Ik3REog4Lf3dh-_x3NqHZW9JRo-opGTP7ZeWIRPSonj91rdBU1uFNyLqiYZ2490jGQG3JmPR0Xnfe9-U13yZ3jBMub8YzPJmWxbTFeOVIB7MV9QuZUwC8T648XwHbNxZAado8zVTZ9-hV5fzpUgfMxFA23wQY_yvQPjaUvQuRe"
                />
              </div>
              <div>
                <p className="font-label-caps text-label-caps text-on-surface m-0">BD Manager</p>
                <p className="text-xs text-on-surface-variant m-0 mt-1">EPC Contractor</p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* COMPARISON SECTION */}
        <section className="bg-surface-container py-xl">
          <div className="max-w-7xl mx-auto px-margin">
            <h2 className="font-h2 text-h2 text-center mb-xl mt-0">Engineered for Certainty</h2>
            
            <motion.div 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true, margin: "-50px" }} 
              variants={staggerContainer}
              className="grid md:grid-cols-2 gap-0 border border-outline-variant rounded-xl overflow-hidden shadow-sm"
            >
              <motion.div 
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.6 } } }} 
                className="p-lg bg-white"
              >
                <div className="flex items-center mb-md">
                  <span className="material-symbols-outlined text-error mr-2">block</span>
                  <h3 className="font-h3 text-h3 m-0">Without PRISM</h3>
                </div>
                <ul className="space-y-md p-0 m-0 list-none">
                  {[
                    "Commitments buried in email threads",
                    "No real-time visibility into bid status",
                    "Context lost across teams",
                    "Risks identified too late"
                  ].map((text, i) => (
                    <li key={i} className="flex items-start text-on-surface-variant text-body-md">
                      <span className="material-symbols-outlined text-error mr-2 text-[20px]">close</span>
                      {text}
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div 
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.8, delay: 0.2 } } }} 
                className="p-lg bg-slate-900 text-white relative"
              >
                <div className="flex items-center mb-md">
                  <span className="material-symbols-outlined text-tertiary-fixed mr-2">verified</span>
                  <h3 className="font-h3 text-h3 m-0">With PRISM</h3>
                </div>
                <ul className="space-y-md p-0 m-0 list-none relative z-10">
                  {[
                    "Every commitment extracted and tracked",
                    "Live bid dashboard with full visibility",
                    "Institutional memory preserved",
                    "Risks identified before submission"
                  ].map((text, i) => (
                    <li key={i} className="flex items-start text-slate-300 text-body-md">
                      <span className="material-symbols-outlined text-tertiary-fixed mr-2 text-[20px]">check_circle</span>
                      {text}
                    </li>
                  ))}
                </ul>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.1 }}
                  transition={{ duration: 2, delay: 1 }}
                  className="absolute inset-0 bg-gradient-to-tr from-transparent via-tertiary-fixed to-transparent z-0 pointer-events-none"
                />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* AGENTS SECTION */}
        <section id="agents" className="bg-slate-50 border-y border-outline-variant py-xl scroll-mt-16">
          <div className="max-w-7xl mx-auto px-margin">
            <div className="text-center mb-xl">
              <h2 className="font-h2 text-h2 mt-0 mb-xs text-on-background">Our Agents — One Platform Across the EPC Lifecycle</h2>
              <p className="font-body-lg text-on-surface-variant m-0">6 AI agents working together from bid decision to project execution</p>
            </div>
            
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md mb-xl"
            >
              {[
                { 
                  title: "SIL Brain", 
                  subtitle: "Bid / No-Bid Intelligence", 
                  desc: "Decides which tenders to pursue using structured risk, capability, and effort analysis.",
                  highlight: false
                },
                { 
                  title: "PRISM", 
                  subtitle: "Proposal Intelligence", 
                  desc: "Tracks bid state, risks, commitments, and builds memory across the proposal lifecycle.",
                  highlight: true
                },
                { 
                  title: "Paige", 
                  subtitle: "Procurement Manager", 
                  desc: "Automates vendor coordination, quote comparison, and engineering evaluation workflows.",
                  highlight: false
                },
                { 
                  title: "Dorits", 
                  subtitle: "Document Controller", 
                  desc: "Manages document indexing, revisions, approvals, and full audit trails.",
                  highlight: false
                },
                { 
                  title: "Clive", 
                  subtitle: "Change Order Agent", 
                  desc: "Identifies change orders early by comparing communication with baseline scope.",
                  highlight: false
                },
                { 
                  title: "Project Control Agent", 
                  subtitle: "Execution Intelligence", 
                  desc: "Tracks real-time project progress from communication and updates the PMS automatically.",
                  highlight: false
                }
              ].map((agent, i) => (
                <motion.div 
                  key={i}
                  variants={fadeUp}
                  whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)" }}
                  className={`p-lg bg-white rounded-xl shadow-sm transition-all flex flex-col justify-start relative ${agent.highlight ? 'border-2 border-primary shadow-[0_4px_20px_-5px_rgba(0,102,255,0.15)] ring-1 ring-primary/20 hover:border-primary/80' : 'border border-outline-variant hover:border-slate-300'}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-h3 text-h3 m-0 text-on-surface">{agent.title}</h3>
                    {agent.highlight && (
                      <span className="bg-primary-container text-on-primary-container text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                        Core Focus
                      </span>
                    )}
                  </div>
                  <p className="font-label-caps text-primary text-xs tracking-wider uppercase m-0 mb-4 font-semibold">{agent.subtitle}</p>
                  <p className="font-body-md text-on-surface-variant m-0 leading-relaxed">{agent.desc}</p>
                </motion.div>
              ))}
            </motion.div>
            
            <p className="text-center font-body-md text-on-surface-variant m-0">
              <span className="font-semibold text-on-surface">PRISM</span> is the proposal intelligence layer within a larger end-to-end EPC platform.
            </p>
          </div>
        </section>

        {/* TRUST SECTION */}
        <section id="security" className="py-xl max-w-7xl mx-auto px-margin scroll-mt-16">
          <h2 className="font-h2 text-h2 text-center mb-xl mt-0">Institutional Trust</h2>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid md:grid-cols-3 gap-md"
          >
            {[
              { icon: "shield", title: "Data Security", text: "All bid data stays within your controlled environment" },
              { icon: "lan", title: "Source Traceability", text: "Every insight is linked to its original email, document, or MOM" },
              { icon: "psychology", title: "Institutional Memory", text: "Full bid context preserved even when team members change" },
            ].map((item, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)" }}
                className="p-lg border border-outline-variant rounded-lg bg-white transition-all hover:border-slate-300"
              >
                <span className="material-symbols-outlined text-primary mb-sm text-[28px]">{item.icon}</span>
                <h4 className="font-h3 text-h3 mb-xs text-on-surface m-0">{item.title}</h4>
                <p className="font-body-md text-on-surface-variant m-0">{item.text}</p>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-lg p-md bg-surface-container-low border border-dashed border-primary/50 text-center rounded-lg"
          >
            <p className="font-body-md text-primary font-semibold m-0">
              "No hallucination — every response is traceable to a real source"
            </p>
          </motion.div>
        </section>

        {/* FINAL CTA */}
        <section id="contact" className="py-xl bg-primary text-on-primary">
          <div className="max-w-4xl mx-auto px-margin text-center">
            <h2 className="font-h1 text-h1 mb-md mt-0 leading-tight">Copilot helps you read a tender. PRISM helps you manage and win the bid.</h2>
            <p className="font-body-lg text-slate-300 mb-lg">Win more bids. Deliver with certainty.</p>
            <motion.a 
              href="mailto:contact@prism.example.com"
              whileHover={{ y: -2, boxShadow: "0px 10px 20px rgba(0,0,0,0.2)", backgroundColor: "#f8fafc" }}
              whileTap={{ scale: 0.98 }}
              transition={{ ease: "easeOut", duration: 0.2 }}
              className="inline-block bg-white text-primary px-xl py-md rounded-lg font-label-caps text-label-caps tracking-widest transition-colors shadow-lg cursor-pointer"
            >
              DEPLOY PRISM TODAY
            </motion.a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 items-center gap-8">
          <div>
            <div className="text-lg font-bold text-slate-900 mb-xs">PRISM</div>
            <p className="text-sm font-body-md text-slate-500 m-0">© 2024 PRISM Infrastructure Systems. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap md:justify-end gap-x-md gap-y-xs">
            <span className="text-slate-500 text-sm font-body-md cursor-default">Privacy Policy</span>
            <span className="text-slate-500 text-sm font-body-md cursor-default">Terms of Service</span>
            <span className="text-slate-500 text-sm font-body-md cursor-default">Cookie Policy</span>
            <span className="text-slate-500 text-sm font-body-md cursor-default">Contact Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
