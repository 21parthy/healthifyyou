/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { 
  Activity, 
  Dumbbell, 
  Utensils, 
  MessageSquare, 
  User, 
  CheckCircle2, 
  TrendingUp, 
  Mail, 
  ArrowRight, 
  Menu, 
  X,
  LayoutDashboard,
  LogOut,
  Quote,
  Scale,
  Target,
  Clock,
  Waves,
  Calendar,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---

interface UserProfile {
  name: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other' | '';
  weight: number;
  height: number;
  weightUnit: 'kg' | 'lb';
  heightUnit: 'cm' | 'ft';
  bmi: number;
  goal: string;
  targetWeight: number;
  timeline: string;
  activityLevel: string;
  dietaryPrefs: string[];
  allergies: string[];
  waterGoal: number;
  dailyCalories: number;
  macros: { protein: number; carbs: number; fats: number };
  isComplete: boolean;
  avatar?: string;
  email?: string;
}

// --- Constants & Helpers ---

const GOALS = [
  { id: 'lose', label: 'Lose Weight', color: 'bg-blue-500' },
  { id: 'build', label: 'Build Muscle', color: 'bg-primary' },
  { id: 'stay', label: 'Stay Fit', color: 'bg-green-500' },
  { id: 'endurance', label: 'Improve Endurance', color: 'bg-orange-500' },
  { id: 'gain', label: 'Gain Weight', color: 'bg-purple-500' }
];

const ACTIVITY_LEVELS = [
  { id: 'sedentary', label: 'Sedentary', value: 1.2, desc: 'Office job, little exercise' },
  { id: 'light', label: 'Light', value: 1.375, desc: 'Exercise 1-3 times/week' },
  { id: 'moderate', label: 'Moderate', value: 1.55, desc: 'Exercise 3-5 times/week' },
  { id: 'active', label: 'Very Active', value: 1.725, desc: 'Daily intense exercise' },
  { id: 'athlete', label: 'Athlete', value: 1.9, desc: '2x per day intense training' }
];

const DIETARY_PREFS = ['No Preference', 'Vegetarian', 'Vegan', 'Keto', 'Paleo', 'Gluten-Free'];
const ALLERGIES = ['Nuts', 'Dairy', 'Gluten', 'Soy', 'Eggs', 'None'];

const calculateCalories = (profile: UserProfile): { calories: number; macros: { protein: number; carbs: number; fats: number } } => {
  const { weight, height, weightUnit, heightUnit, dob, gender, activityLevel, goal } = profile;
  
  // Convert to metric
  const weightKg = weightUnit === 'lb' ? weight * 0.453592 : weight;
  let heightCm = height;
  if (heightUnit === 'ft') {
    // Expected height in inches for simplified FT input or direct CM
  }

  const age = new Date().getFullYear() - new Date(dob).getFullYear();
  
  // Mifflin-St Jeor
  let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age;
  bmr += gender === 'Male' ? 5 : (gender === 'Female' ? -161 : -78);

  const multiplier = ACTIVITY_LEVELS.find(a => a.id === activityLevel)?.value || 1.2;
  let tdee = bmr * multiplier;

  if (goal === 'lose') tdee -= 500;
  if (goal === 'gain') tdee += 300;

  const calories = Math.round(tdee);
  
  // Macros: 30/45/25
  return {
    calories,
    macros: {
      protein: Math.round((calories * 0.3) / 4),
      carbs: Math.round((calories * 0.45) / 4),
      fats: Math.round((calories * 0.25) / 9)
    }
  };
};

const getBMICategory = (bmi: number) => {
  if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-500', bg: 'bg-blue-50' };
  if (bmi < 25) return { label: 'Normal', color: 'text-green-500', bg: 'bg-green-50' };
  if (bmi < 30) return { label: 'Overweight', color: 'text-orange-500', bg: 'bg-orange-50' };
  return { label: 'Obese', color: 'text-red-500', bg: 'bg-red-50' };
};

// --- Components ---

const Navbar = ({ onGetStarted }: { onGetStarted: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-navy/90 backdrop-blur-md py-3 shadow-lg' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <Activity className="text-white" size={24} />
          </div>
          <span className="text-2xl font-display font-bold text-white">Healthify<span className="text-primary">You</span></span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {['Features', 'How it Works', 'Pricing', 'Reviews'].map((item) => (
            <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-sm font-medium text-gray-300 hover:text-primary transition-colors">
              {item}
            </a>
          ))}
          <button 
            onClick={onGetStarted}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-full font-semibold transition-all shadow-lg hover:shadow-primary/20 active:scale-95"
          >
            Get Started
          </button>
        </div>

        <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-navy border-t border-white/10 p-6 flex flex-col gap-4 md:hidden shadow-2xl"
          >
            {['Features', 'How it Works', 'Pricing', 'Reviews'].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-lg font-medium text-gray-300" onClick={() => setIsMobileMenuOpen(false)}>
                {item}
              </a>
            ))}
            <button onClick={() => { setIsMobileMenuOpen(false); onGetStarted(); }} className="bg-primary text-white py-4 rounded-xl font-bold mt-2">
              Get Started Free
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const LoginScreen = ({ onLogin }: { onLogin: (user: any) => void }) => {
  const handleGoogleLogin = () => {
    // AI Studio Popup-Based OAuth integration
    const width = 600;
    const height = 700;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      '/api/auth/google/url',
      'google_login_popup',
      `width=${width},height=${height},left=${left},top=${top}`
    );

    const handleOAuthMessage = (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        onLogin(event.data.user);
        window.removeEventListener('message', handleOAuthMessage);
      }
    };

    window.addEventListener('message', handleOAuthMessage);
  };

  const handleGuestLogin = () => {
    onLogin({ name: '', email: 'guest@healthify.you', avatar: null });
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_#2A1B3D_0%,_transparent_50%)]" />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[2rem] p-10 md:p-14 w-full max-w-lg shadow-2xl relative z-10 text-center"
      >
        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-primary/20">
          <Activity className="text-white" size={32} />
        </div>
        <h2 className="text-3xl font-display font-black text-navy mb-2">Healthify<span className="text-primary">You</span></h2>
        <p className="text-gray-400 font-medium mb-12 uppercase tracking-widest text-xs">Your AI Health Companion</p>
        
        <div className="space-y-4">
          <button 
            onClick={handleGoogleLogin}
            className="w-full bg-white border border-gray-100 py-4 rounded-xl flex items-center justify-center gap-3 font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm active:scale-95"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="18" height="18" alt="Google" />
            Sign in with Google
          </button>
          <div className="flex items-center gap-4 py-2">
            <div className="h-px bg-gray-100 flex-grow" />
            <span className="text-gray-300 text-xs font-bold uppercase">or</span>
            <div className="h-px bg-gray-100 flex-grow" />
          </div>
          <button 
            onClick={handleGuestLogin}
            className="w-full bg-navy text-white py-4 rounded-xl font-bold hover:bg-black transition-all shadow-lg active:scale-95"
          >
            Continue as Guest
          </button>
        </div>
        <p className="mt-10 text-[10px] text-gray-400 leading-relaxed">
          By continuing, you agree to HealthifyYou's Terms of Service and Privacy Policy. Free trial includes 14 days of Premium AI features.
        </p>
      </motion.div>
    </div>
  );
};

const OnboardingWizard = ({ initialUser, onComplete }: { initialUser: any, onComplete: (profile: UserProfile) => void }) => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    name: initialUser.name || '',
    email: initialUser.email || '',
    avatar: initialUser.avatar || '',
    dob: '',
    gender: '',
    weight: 70,
    height: 175,
    weightUnit: 'kg',
    heightUnit: 'cm',
    goal: 'stay',
    targetWeight: 70,
    timeline: '3',
    activityLevel: 'moderate',
    dietaryPrefs: ['No Preference'],
    allergies: ['None'],
    waterGoal: 2,
  });

  const bmi = useMemo(() => {
    const w = profile.weightUnit === 'lb' ? profile.weight! * 0.453592 : profile.weight!;
    const h = (profile.heightUnit === 'ft' ? profile.height! * 30.48 : profile.height!) / 100;
    return Number((w / (h * h)).toFixed(1));
  }, [profile.weight, profile.height, profile.weightUnit, profile.heightUnit]);

  const toggleList = (list: string[], item: string, exclusiveNone = false) => {
    if (exclusiveNone && item === 'None') return ['None'];
    if (exclusiveNone && list.includes('None')) return [item];
    
    const newList = list.includes(item) 
      ? list.filter(i => i !== item) 
      : [...list, item];
    
    return newList.length === 0 ? (exclusiveNone ? ['None'] : []) : newList;
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else {
      const finalProfile = { ...profile, bmi, isComplete: true } as UserProfile;
      const { calories, macros } = calculateCalories(finalProfile);
      onComplete({ ...finalProfile, dailyCalories: calories, macros });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header & Progress */}
      <div className="bg-white border-b border-gray-100 p-6 sticky top-0 z-20">
        <div className="container mx-auto max-w-2xl">
          <div className="flex items-center justify-between mb-4">
             <div className="flex items-center gap-2">
                <Activity className="text-primary" size={24} />
                <span className="font-display font-black text-navy">HealthifyYou</span>
             </div>
             <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Step {step} of 4</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary"
              animate={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <main className="flex-grow flex items-center justify-center p-6">
        <motion.div 
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white rounded-[2rem] p-8 md:p-12 w-full max-w-2xl shadow-xl shadow-gray-200/50"
        >
          {step === 1 && (
            <div className="space-y-8">
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-display font-bold text-navy mb-2">The Basics</h2>
                <p className="text-gray-400">Let's start with who you are.</p>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-black uppercase text-gray-400 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    value={profile.name}
                    onChange={e => setProfile({...profile, name: e.target.value})}
                    placeholder="e.g. John Doe"
                    className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-primary outline-none transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-gray-400 mb-2">Date of Birth</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                    <input 
                      type="date" 
                      value={profile.dob}
                      onChange={e => setProfile({...profile, dob: e.target.value})}
                      className="w-full bg-gray-50 border-none rounded-2xl p-4 pl-12 focus:ring-2 focus:ring-primary outline-none transition-all font-medium"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-gray-400 mb-2">Gender</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Male', 'Female', 'Other'].map(g => (
                      <button 
                        key={g}
                        onClick={() => setProfile({...profile, gender: g as any})}
                        className={`py-4 rounded-2xl font-bold transition-all border-2 ${profile.gender === g ? 'bg-primary border-primary text-white shadow-lg' : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'}`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-display font-bold text-navy mb-2">Your Body</h2>
                <p className="text-gray-400">Physical metrics help our AI tailor your plan.</p>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-8">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-black uppercase text-gray-400">Current Weight</label>
                      <button 
                        onClick={() => setProfile({...profile, weightUnit: profile.weightUnit === 'kg' ? 'lb' : 'kg'})}
                        className="text-[10px] font-black uppercase bg-gray-100 px-2 py-1 rounded-md text-gray-500"
                      >
                        {profile.weightUnit}
                      </button>
                    </div>
                    <div className="flex items-center gap-4 bg-gray-50 rounded-2xl p-4">
                      <Scale className="text-gray-300" size={20} />
                      <input 
                        type="number" 
                        value={profile.weight}
                        onChange={e => setProfile({...profile, weight: Number(e.target.value)})}
                        className="bg-transparent border-none outline-none w-full font-display font-black text-2xl"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-black uppercase text-gray-400">Height</label>
                      <button 
                        onClick={() => setProfile({...profile, heightUnit: profile.heightUnit === 'cm' ? 'ft' : 'cm'})}
                        className="text-[10px] font-black uppercase bg-gray-100 px-2 py-1 rounded-md text-gray-500"
                      >
                        {profile.heightUnit}
                      </button>
                    </div>
                    <div className="flex items-center gap-4 bg-gray-50 rounded-2xl p-4">
                      <TrendingUp className="text-gray-300 transform rotate-90" size={20} />
                      <input 
                        type="number" 
                        value={profile.height}
                        onChange={e => setProfile({...profile, height: Number(e.target.value)})}
                        className="bg-transparent border-none outline-none w-full font-display font-black text-2xl"
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-[2rem] p-8 text-center flex flex-col justify-center items-center">
                  <p className="text-xs font-black text-gray-400 uppercase mb-4 tracking-widest">Calculated BMI</p>
                  <p className={`text-6xl font-display font-black mb-2 ${getBMICategory(bmi).color}`}>{bmi}</p>
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${getBMICategory(bmi).bg} ${getBMICategory(bmi).color}`}>
                    {getBMICategory(bmi).label}
                  </span>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8">
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-display font-bold text-navy mb-2">Goal & Activity</h2>
                <p className="text-gray-400">Tell us what you want to achieve.</p>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-black uppercase text-gray-400 mb-4">Select Your Primary Goal</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {GOALS.map(g => (
                      <button 
                        key={g.id}
                        onClick={() => setProfile({...profile, goal: g.id})}
                        className={`p-4 rounded-2xl text-left transition-all border-2 flex flex-col gap-2 ${profile.goal === g.id ? 'bg-navy border-navy text-white shadow-xl' : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'}`}
                      >
                        <Target size={20} className={profile.goal === g.id ? 'text-lime' : 'text-primary'} />
                        <span className="text-xs font-bold leading-tight">{g.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                   <div>
                      <label className="block text-xs font-black uppercase text-gray-400 mb-2">Target Weight ({profile.weightUnit})</label>
                      <input 
                        type="number"
                        value={profile.targetWeight}
                        onChange={e => setProfile({...profile, targetWeight: Number(e.target.value)})}
                        className="w-full bg-gray-50 rounded-2xl p-4 font-bold outline-none border-none focus:ring-2 focus:ring-primary"
                      />
                   </div>
                   <div>
                      <label className="block text-xs font-black uppercase text-gray-400 mb-2">Timeframe (Months)</label>
                      <div className="grid grid-cols-4 gap-2">
                        {['1', '3', '6', '12'].map(m => (
                          <button 
                            key={m}
                            onClick={() => setProfile({...profile, timeline: m})}
                            className={`py-4 rounded-xl text-sm font-bold border-2 transition-all ${profile.timeline === m ? 'bg-primary border-primary text-white shadow-md' : 'bg-white border-gray-100 text-gray-400'}`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                   </div>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-gray-400 mb-4">Activity Level</label>
                  <div className="space-y-2">
                    {ACTIVITY_LEVELS.map(a => (
                      <button 
                        key={a.id}
                        onClick={() => setProfile({...profile, activityLevel: a.id})}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${profile.activityLevel === a.id ? 'bg-primary border-primary shadow-lg text-white' : 'bg-white border-gray-100 text-gray-400'}`}
                      >
                        <div className="text-left">
                          <p className={`font-bold ${profile.activityLevel === a.id ? 'text-white' : 'text-navy'}`}>{a.label}</p>
                          <p className={`text-[10px] ${profile.activityLevel === a.id ? 'text-white/70' : 'text-gray-400'}`}>{a.desc}</p>
                        </div>
                        {profile.activityLevel === a.id && <CheckCircle2 size={20} className="text-lime" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-8">
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-display font-bold text-navy mb-2">Lifestyle</h2>
                <p className="text-gray-400">Dietary preferences and water goals.</p>
              </div>
              <div className="space-y-8">
                <div>
                   <label className="block text-xs font-black uppercase text-gray-400 mb-4">Dietary Preference</label>
                   <div className="flex flex-wrap gap-2">
                     {DIETARY_PREFS.map(p => (
                       <button 
                        key={p}
                        onClick={() => setProfile({...profile, dietaryPrefs: toggleList(profile.dietaryPrefs || [], p)})}
                        className={`px-6 py-3 rounded-full text-xs font-bold transition-all border-2 ${profile.dietaryPrefs?.includes(p) ? 'bg-primary border-primary text-white shadow-md' : 'bg-white border-gray-200 text-gray-500'}`}
                       >
                         {p}
                       </button>
                     ))}
                   </div>
                </div>
                <div>
                   <label className="block text-xs font-black uppercase text-gray-400 mb-4">Food Allergies</label>
                   <div className="flex flex-wrap gap-2">
                     {ALLERGIES.map(a => (
                       <button 
                        key={a}
                        onClick={() => setProfile({...profile, allergies: toggleList(profile.allergies || [], a, true)})}
                        className={`px-6 py-3 rounded-full text-xs font-bold transition-all border-2 ${profile.allergies?.includes(a) ? 'bg-orange-500 border-orange-500 text-white shadow-md' : 'bg-white border-gray-200 text-gray-500'}`}
                       >
                         {a}
                       </button>
                     ))}
                   </div>
                </div>
                <div>
                  <div className="flex justify-between items-baseline mb-4">
                    <label className="block text-xs font-black uppercase text-gray-400">Daily Water Goal</label>
                    <span className="font-display font-black text-primary text-2xl">{profile.waterGoal}L</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Waves className="text-primary" />
                    <input 
                      type="range"
                      min="1"
                      max="5"
                      step="0.5"
                      value={profile.waterGoal}
                      onChange={e => setProfile({...profile, waterGoal: Number(e.target.value)})}
                      className="w-full h-3 bg-gray-100 rounded-full appearance-none cursor-pointer accent-primary"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-12 flex items-center justify-between gap-4">
            {step > 1 ? (
              <button 
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-2 text-gray-400 font-bold hover:text-navy transition-colors px-6"
              >
                <ChevronLeft size={20} /> Back
              </button>
            ) : <div />}
            <button 
              onClick={handleNext}
              className="flex-grow bg-primary text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all active:scale-95"
            >
              {step === 4 ? 'Complete Setup' : 'Continue'} <ChevronRight size={20} />
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

const LandingPage = ({ onGetStarted }: { onGetStarted: () => void }) => {
  return (
    <div className="font-sans bg-navy min-h-screen text-white overflow-hidden">
      <Navbar onGetStarted={onGetStarted} />
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_#2A1B3D_0%,_transparent_50%)]" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-5xl md:text-8xl font-display font-black leading-[0.95] tracking-tight mb-8">
              Your AI-Powered <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-lime">Health Companion</span>
            </h1>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Personalized workouts, nutrition intelligence, and real-time coaching designed to transform your lifestyle.
            </p>
            <button onClick={onGetStarted} className="bg-primary text-white text-lg px-10 py-5 rounded-2xl font-bold flex items-center gap-2 mx-auto shadow-2xl">
              Start My Journey Free <ArrowRight size={20} />
            </button>
          </motion.div>
        </div>
      </section>
      {/* Footer minimal for prompt context */}
      <footer className="py-20 text-center text-gray-600 text-xs border-t border-white/5">© 2026 HealthifyYou Inc.</footer>
    </div>
  );
};

const AppShell = ({ userProfile, onLogout }: { userProfile: UserProfile, onLogout: () => void }) => {
  const [activeTab, setActiveTab] = useState('Dashboard');

  const tabs = [
    { id: 'Dashboard', icon: LayoutDashboard },
    { id: 'Workouts', icon: Dumbbell },
    { id: 'Meals', icon: Utensils },
    { id: 'AI Coach', icon: MessageSquare },
    { id: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col md:flex-row">
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-100 h-screen sticky top-0 p-6">
        <div className="flex items-center gap-2 mb-10 px-2">
          <Activity className="text-primary" size={28} />
          <span className="text-xl font-display font-bold text-navy">Healthify<span className="text-primary">You</span></span>
        </div>
        <nav className="flex-grow space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold transition-all ${
                activeTab === tab.id ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-navy hover:bg-gray-50'
              }`}
            >
              <tab.icon size={20} />
              {tab.id}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-grow p-6 md:p-10 pb-24 md:pb-10 overflow-y-auto">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-display font-black text-navy">{activeTab}</h1>
            <p className="text-gray-400 text-sm">Welcome back, {userProfile.name || 'Champion'}!</p>
          </div>
          <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden border-2 border-white shadow-sm">
            <img src={userProfile.avatar || "https://picsum.photos/seed/profile/100/100"} alt="Avatar" referrerPolicy="no-referrer" />
          </div>
        </header>

        <div className="max-w-5xl mx-auto">
           {activeTab === 'Dashboard' && (
             <div className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                   <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                      <p className="text-[10px] font-bold text-primary uppercase mb-2">Daily Target</p>
                      <p className="text-2xl font-display font-black text-navy">{userProfile.dailyCalories} kcal</p>
                   </div>
                   <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                      <p className="text-[10px] font-bold text-blue-500 uppercase mb-2">Protein</p>
                      <p className="text-2xl font-display font-black text-navy">{userProfile.macros.protein}g</p>
                   </div>
                   <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                      <p className="text-[10px] font-bold text-orange-500 uppercase mb-2">Carbs</p>
                      <p className="text-2xl font-display font-black text-navy">{userProfile.macros.carbs}g</p>
                   </div>
                   <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                      <p className="text-[10px] font-bold text-purple-500 uppercase mb-2">Fats</p>
                      <p className="text-2xl font-display font-black text-navy">{userProfile.macros.fats}g</p>
                   </div>
                </div>
                <div className="bg-white p-12 rounded-[2rem] border-2 border-dashed border-gray-200 flex flex-col justify-center items-center text-center">
                   <TrendingUp className="text-gray-200 mb-4" size={48} />
                   <p className="text-gray-400 font-bold">Comprehensive Analytics for {userProfile.goal.toUpperCase()}</p>
                </div>
             </div>
           )}

           {activeTab === 'Profile' && (
             <div className="max-w-md mx-auto">
                <div className="bg-white p-8 rounded-[2rem] shadow-lg border border-gray-100 text-center">
                   <div className="w-24 h-24 bg-navy rounded-full mx-auto mb-4 border-4 border-white shadow-md overflow-hidden">
                      <img src={userProfile.avatar || "https://picsum.photos/seed/health/200/200"} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                   </div>
                   <h3 className="text-2xl font-display font-bold text-navy">{userProfile.name}</h3>
                   <p className="text-gray-400 text-sm mb-6 uppercase border-b border-gray-50 pb-4">{userProfile.goal.replace('-', ' ')}</p>
                   
                   <div className="grid grid-cols-2 gap-4 text-left mb-10">
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <p className="text-[8px] font-black uppercase text-gray-400 mb-1">BMI</p>
                        <p className="font-display font-black text-navy">{userProfile.bmi}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <p className="text-[8px] font-black uppercase text-gray-400 mb-1">Target</p>
                        <p className="font-display font-black text-navy">{userProfile.targetWeight}{userProfile.weightUnit}</p>
                      </div>
                   </div>

                   <button 
                    onClick={onLogout}
                    className="flex justify-center items-center gap-2 w-full text-red-500 font-bold py-4 hover:bg-red-50 rounded-2xl transition-all"
                  >
                    <LogOut size={20} /> Log Out and Reset
                  </button>
                </div>
             </div>
           )}

           {['Workouts', 'Meals', 'AI Coach'].includes(activeTab) && (
              <div className="h-64 flex flex-col items-center justify-center bg-white rounded-[2rem] border-2 border-dashed border-gray-100 italic text-gray-300">
                {activeTab} Content Loading...
              </div>
           )}
        </div>
      </main>

      <nav className="md:hidden fixed bottom-6 left-6 right-6 bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl p-3 flex items-center justify-around z-50">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex flex-col items-center gap-1 p-3 rounded-2xl ${activeTab === tab.id ? 'text-primary' : 'text-gray-400'}`}>
            <tab.icon size={20} />
            <span className="text-[8px] font-black uppercase">{tab.id.split(' ')[0]}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

// --- Main App Entry ---

export default function App() {
  const [view, setView] = useState<'landing' | 'login' | 'onboarding' | 'app'>('landing');
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('userProfile');
    if (saved) {
      const p = JSON.parse(saved);
      setProfile(p);
      setView('app');
    }
  }, []);

  const handleLogin = (u: any) => {
    setUser(u);
    setView('onboarding');
  };

  const handleOnboardingComplete = (p: UserProfile) => {
    setProfile(p);
    localStorage.setItem('userProfile', JSON.stringify(p));
    setView('app');
  };

  const handleLogout = () => {
    localStorage.removeItem('userProfile');
    setProfile(null);
    setView('landing');
  };

  return (
    <AnimatePresence mode="wait">
      {view === 'landing' && (
        <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <LandingPage onGetStarted={() => setView('login')} />
        </motion.div>
      )}
      {view === 'login' && (
        <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <LoginScreen onLogin={handleLogin} />
        </motion.div>
      )}
      {view === 'onboarding' && (
        <motion.div key="onboarding" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <OnboardingWizard initialUser={user} onComplete={handleOnboardingComplete} />
        </motion.div>
      )}
      {view === 'app' && profile && (
        <motion.div key="app" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <AppShell userProfile={profile} onLogout={handleLogout} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
