import { Link, useNavigate } from 'react-router-dom';
import { User as FirebaseUser } from 'firebase/auth';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Sparkles, Layout, Download, Zap, Wand2, ChevronDown, CheckCircle2, ArrowRight, ShieldCheck, Globe, HelpCircle, User } from 'lucide-react';
import { useState } from 'react';
import desktopLogo from '../assets/chatcv_desk.webp';

export default function LandingPage({ user }: { user: FirebaseUser | null }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const navigate = useNavigate();

  const faqs = [
    {
      q: "Is this AI resume builder free?",
      a: "Yes! ChatCV offers a completely free online resume builder. You can create, edit, and export your professional CV to PDF without any hidden costs or watermarks."
    },
    {
      q: "What is an ATS-friendly resume?",
      a: "An ATS-friendly resume is designed to be easily read by Applicant Tracking Systems used by recruiters. ChatCV uses professional templates that ensure your data is structured correctly for these systems, increasing your chances of getting an interview."
    },
    {
      q: "Can I export my resume to PDF?",
      a: "Absolutely. Once you're happy with your CV, you can instantly export it to a high-quality, print-ready PDF format that maintains perfect formatting across all devices."
    },
    {
      q: "How does the AI CV Maker work?",
      a: "Our AI CV Maker uses advanced language models to help you write impactful bullet points, summarize your experience, and even extract details from your existing documents or LinkedIn profile through a simple chat interface."
    }
  ];

  return (
    <div className="min-h-screen bg-magic-gradient font-sans">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
        <div className="container mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
          <Link to="/" className="flex items-center flex-shrink-0">
            <img src={desktopLogo} alt="ChatCV Logo" className="h-16 w-auto object-contain" />
          </Link>
          <div className="flex items-center justify-center gap-3 w-full md:w-auto">
            {!user && (
              <Link to="/login" className="text-slate-600 font-semibold hover:text-brand-purple transition-all whitespace-nowrap">
                Sign In
              </Link>
            )}
            <Link 
              to={user ? "/dashboard" : "/login"} 
              className="bg-brand-dark text-white px-6 py-2.5 rounded-full font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 whitespace-nowrap"
            >
              {user ? 'Dashboard' : 'Get Started'}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-8 py-20 lg:py-32 flex flex-col items-center text-center max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-purple/10 text-brand-purple text-xs font-bold uppercase tracking-widest mb-8 border border-brand-purple/20">
            <Sparkles className="w-3 h-3" />
            AI-Powered CV Maker & Resume Builder
          </div>
          <h1 className="text-6xl lg:text-8xl font-black text-slate-900 leading-[0.9] tracking-tighter mb-8">
            Free AI Resume Builder & <span className="text-magic-gradient">ATS-Friendly</span> CV Maker
          </h1>
          <p className="text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            Stop struggling with formatting and writer's block. Build a professional, ATS-friendly resume in minutes using our intuitive <strong>Free Online Resume</strong> builder or just by chatting with our AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              to="/ai-builder" 
              className="bg-button-gradient text-white px-10 py-5 rounded-2xl text-lg font-black flex items-center gap-3 hover:scale-105 transition-all magic-button-glow"
            >
              <Sparkles className="w-6 h-6" />
              Magic AI Builder
            </Link>
            <Link 
              to={user ? "/dashboard" : "/login"} 
              className="bg-brand-dark text-white px-10 py-5 rounded-2xl text-lg font-black flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-slate-900/20"
            >
              <FileText className="w-6 h-6" />
              Standard (Manual)
            </Link>
          </div>

          {/* Resume Mockup Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-20 w-full max-w-4xl mx-auto relative group"
          >
            {/* Background Glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-brand-purple/20 via-brand-pink/20 to-brand-indigo/20 rounded-[40px] blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
            
            {/* Mockup Container */}
            <div className="relative bg-white rounded-[32px] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden aspect-[1.4/1] md:aspect-[1.6/1] flex">
              {/* Sidebar */}
              <div className="w-1/3 bg-slate-50 border-r border-slate-100 p-8 hidden md:block">
                <div className="w-20 h-20 rounded-2xl bg-brand-purple/10 mb-6 flex items-center justify-center">
                  <User className="w-10 h-10 text-brand-purple" />
                </div>
                <div className="space-y-4">
                  <div className="h-4 w-full bg-slate-200 rounded-full" />
                  <div className="h-4 w-3/4 bg-slate-200 rounded-full" />
                  <div className="pt-8 space-y-3">
                    <div className="h-3 w-1/2 bg-brand-purple/20 rounded-full" />
                    <div className="h-2 w-full bg-slate-100 rounded-full" />
                    <div className="h-2 w-full bg-slate-100 rounded-full" />
                    <div className="h-2 w-5/6 bg-slate-100 rounded-full" />
                  </div>
                  <div className="pt-8 space-y-3">
                    <div className="h-3 w-1/2 bg-brand-purple/20 rounded-full" />
                    <div className="h-2 w-full bg-slate-100 rounded-full" />
                    <div className="h-2 w-full bg-slate-100 rounded-full" />
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 p-8 md:p-12 text-left">
                <div className="mb-10">
                  <div className="h-10 w-2/3 bg-slate-900 rounded-xl mb-4" />
                  <div className="h-4 w-1/3 bg-brand-purple rounded-full" />
                </div>

                <div className="space-y-10">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-brand-purple" />
                      <div className="h-4 w-1/4 bg-slate-200 rounded-full" />
                    </div>
                    <div className="pl-5 space-y-2">
                      <div className="h-3 w-full bg-slate-100 rounded-full" />
                      <div className="h-3 w-full bg-slate-100 rounded-full" />
                      <div className="h-3 w-4/5 bg-slate-100 rounded-full" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-brand-purple" />
                      <div className="h-4 w-1/4 bg-slate-200 rounded-full" />
                    </div>
                    <div className="pl-5 space-y-2">
                      <div className="h-3 w-full bg-slate-100 rounded-full" />
                      <div className="h-3 w-full bg-slate-100 rounded-full" />
                      <div className="h-3 w-3/4 bg-slate-100 rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Floating Badge */}
                <div className="absolute bottom-8 right-8 bg-brand-dark text-white px-6 py-3 rounded-2xl flex items-center gap-3 shadow-2xl animate-bounce">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span className="text-sm font-bold">ATS Score: 98/100</span>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-brand-pink/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-brand-indigo/10 rounded-full blur-2xl" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Powerful Features for Your Career</h2>
          <p className="text-slate-500 font-medium">Everything you need in a professional CV Maker</p>
        </div>
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            { 
              icon: Zap, 
              color: 'bg-indigo-100 text-indigo-600',
              title: "AI Content Generation", 
              desc: "Chat naturally with our AI assistant. It extracts your skills and crafts compelling bullet points automatically." 
            },
            { 
              icon: Layout, 
              color: 'bg-purple-100 text-purple-600',
              title: "Live A4 Preview", 
              desc: "See exactly what your resume looks like as you type. Real-time updates with perfect A4 proportions." 
            },
            { 
              icon: Download, 
              color: 'bg-pink-100 text-pink-600',
              title: "Instant PDF Export", 
              desc: "One click download to a high-quality PDF. No watermarks, no paywalls. Ready to send to recruiters." 
            }
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-10 rounded-[32px] bg-white shadow-2xl shadow-slate-200/50 flex flex-col items-center text-center group hover:scale-[1.02] transition-all"
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 ${feature.color} group-hover:scale-110 transition-all`}>
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{feature.title}</h3>
              <p className="text-slate-500 leading-relaxed font-medium">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-8 py-24 bg-slate-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">How It Works</h2>
            <p className="text-slate-500 font-medium">Create your professional CV in three simple steps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
            {[
              { step: "01", title: "Choose Your Builder", desc: "Select between our Magic AI Chat builder or our structured Standard editor for full control." },
              { step: "02", title: "Chat or Fill Details", desc: "Use our AI to generate impactful content or manually enter your professional history into our templates." },
              { step: "03", title: "Export to PDF", desc: "Download your ATS-optimized, high-quality PDF resume instantly and start applying to your dream jobs." }
            ].map((item, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center text-center bg-white p-8 rounded-[32px] shadow-xl shadow-slate-200/30 border border-slate-100">
                <div className="w-12 h-12 rounded-full bg-brand-purple text-white flex items-center justify-center font-black text-lg mb-6 shadow-lg shadow-brand-purple/20">
                  {item.step}
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-8 py-24 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Frequently Asked Questions</h2>
          <p className="text-slate-500 font-medium">Everything you need to know about our Free AI Resume Builder</p>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm transition-all hover:border-brand-purple/30">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full px-6 py-5 flex items-center justify-between text-left transition-colors"
              >
                <span className="font-bold text-slate-900">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-slate-500 text-sm leading-relaxed font-medium border-t border-slate-50 pt-4">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="w-full py-20 px-4 mt-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl shadow-2xl relative overflow-hidden mb-12 max-w-6xl mx-auto">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
            Ready to land your dream job?
          </h2>
          <p className="text-blue-100 text-lg md:text-xl mb-10 max-w-2xl">
            Join thousands of professionals who have successfully built their ATS-friendly resumes with ChatCV. It's free, fast, and secure.
          </p>
          <button 
            onClick={() => navigate(user ? '/dashboard' : '/login')}
            className="px-10 py-5 bg-white text-blue-700 font-bold rounded-full text-lg hover:bg-gray-50 hover:scale-105 transition-all duration-300 shadow-xl flex items-center gap-2"
          >
            <span className="whitespace-nowrap">Get Started for Free</span>
            <span>🚀</span>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 pt-20 pb-12 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="logo-icon-gradient p-2 rounded-full shadow-lg shadow-brand-indigo/20">
                <Sparkles className="text-white w-5 h-5" />
              </div>
              <span className="text-2xl font-black tracking-tighter">
                <span className="text-brand-indigo">Chat</span><span className="text-brand-pink">CV</span>
              </span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed font-medium mb-6">
              The world's most advanced <strong>Free AI Resume Builder</strong>. Create professional templates and ATS-friendly CVs in minutes.
            </p>
            <div className="flex gap-4">
              <Globe className="w-5 h-5 text-slate-400 hover:text-brand-purple cursor-pointer transition-colors" />
              <ShieldCheck className="w-5 h-5 text-slate-400 hover:text-brand-purple cursor-pointer transition-colors" />
              <HelpCircle className="w-5 h-5 text-slate-400 hover:text-brand-purple cursor-pointer transition-colors" />
            </div>
          </div>
          
          <div>
            <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest mb-6">Product</h4>
            <ul className="space-y-4 text-sm font-bold text-slate-500">
              <li><Link to="/ai-builder" className="hover:text-brand-purple transition-colors">Magic AI Builder</Link></li>
              <li><Link to="/dashboard" className="hover:text-brand-purple transition-colors">Standard Editor</Link></li>
              <li><Link to="/" className="hover:text-brand-purple transition-colors">Professional Templates</Link></li>
              <li><Link to="/" className="hover:text-brand-purple transition-colors">ATS-Friendly CV Maker</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest mb-6">Resources</h4>
            <ul className="space-y-4 text-sm font-bold text-slate-500">
              <li><a href="#" className="hover:text-brand-purple transition-colors">Resume Blog</a></li>
              <li><a href="#" className="hover:text-brand-purple transition-colors">Career Guides</a></li>
              <li><a href="#" className="hover:text-brand-purple transition-colors">CV Examples</a></li>
              <li><a href="#" className="hover:text-brand-purple transition-colors">Help Center</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest mb-6">Legal</h4>
            <ul className="space-y-4 text-sm font-bold text-slate-500">
              <li><a href="#" className="hover:text-brand-purple transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-brand-purple transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-brand-purple transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="hover:text-brand-purple transition-colors">GDPR</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center md:justify-start w-full pt-8 mt-12 border-t border-gray-200 gap-2 md:gap-4">
          <p className="text-sm text-gray-500 font-medium text-center md:text-left">
            © {new Date().getFullYear()} ChatCV. All rights reserved.
          </p>
          
          {/* Divider dot (Visible only on desktop) */}
          <span className="hidden md:block text-gray-300">•</span>
          
          <p className="text-sm text-gray-500 font-medium flex items-center gap-1.5">
            Built by
            <span className="relative group cursor-pointer ml-1">
              <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 tracking-wider transition-all duration-300 group-hover:from-blue-500 group-hover:to-indigo-500">
                R-Labs
              </span>
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300 group-hover:w-full rounded-full"></span>
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
}
