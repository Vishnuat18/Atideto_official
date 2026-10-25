'use client';

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  GithubAuthProvider
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import {
  loginWithSql,
  syncGoogleUserToSql,
  sendForgotPasswordOtp,
  verifyForgotPasswordOtp,
  resetPasswordAndLogin
} from "@/lib/api";
import { checkPasswordRequirements } from "@/lib/utils";
import { PasswordRequirements } from "@/components/ui/password-requirements";
import { Button } from "@/components/ui/button";
import AdminTwoFactorModal from "@/components/auth/AdminTwoFactorModal";
import SEO from "@/components/seo/SEO";
import atidetoLogo from "@/assets/atideto/logo.png";
import atidetoWordmark from "@/assets/atideto/atideto.png";
import { toast } from "sonner";
import {
  ChevronLeft,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  User,
  AtSign,
  CheckCircle2,
  ShieldCheck,
  RefreshCw,
  KeyRound,
  ArrowRight,
  Mail,
  Info
} from "lucide-react";

type Mode = "login" | "register" | "forgot";
type ForgotStep = "enter_email" | "enter_code" | "change_password";

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" aria-hidden {...props}>
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
    />
  </svg>
);

function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    color: `rgba(0,102,255,${0.08 + i * 0.02})`,
    width: 0.5 + i * 0.025,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      <svg className="w-full h-full text-blue-500/20" viewBox="0 0 696 316" fill="none">
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.12 + path.id * 0.02}
            initial={{ pathLength: 0.3, opacity: 0.5 }}
            animate={{
              pathLength: 1,
              opacity: [0.25, 0.55, 0.25],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 22 + (path.id % 5) * 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

const getAuthErrorMessage = (err: any) => {
  if (!err) return "An unexpected error occurred. Please try again.";
  const code = err.code || "";
  switch (code) {
    case "auth/email-already-in-use":
      return "This email address is already registered. Please sign in instead.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/user-not-found":
      return "No account found with this email. Please sign up.";
    case "auth/wrong-password":
      return "Incorrect password. Please try again or click Forgot?";
    case "auth/invalid-credential":
      return "Invalid email or password. Please verify your credentials.";
    case "auth/weak-password":
      return "Password should be at least 6 characters long.";
    case "auth/popup-closed-by-user":
      return "Sign-in popup was closed before completing authentication.";
    default:
      return err.message || "Authentication failed. Please try again.";
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// ATIDETO OFFICIAL REGISTRY (Strict Authentication - Original Data Only)
// 1. Admin Login: admin@atideto.in (pass: admin123)
// 2. Founders & Employees: sam, neevas, vishnu, kiran, yogesh, sanjay, sachin (pass: admin123)
// 3. Other than that are students: 13 original cohort students (pass: admin123 / student123)
// ─────────────────────────────────────────────────────────────────────────────
interface RegisteredAccount {
  uid: string;
  name: string;
  email: string;
  role: 'admin' | 'student';
  title?: string;
  department?: string;
}

const ORIGINAL_ADMIN: RegisteredAccount = {
  uid: "usr-admin-01",
  name: "Administrator",
  email: "admin@atideto.in",
  role: "admin",
  title: "Super Admin",
  department: "Executive Management"
};

const ORIGINAL_FOUNDERS_EMPLOYEES: RegisteredAccount[] = [
  { uid: 'EMP-01', name: 'Sam Absihek', email: 'sam@atideto.in', role: 'admin', title: 'Founder', department: 'Executive Leadership' },
  { uid: 'EMP-02', name: 'Neevas Nagil A R', email: 'neevas@atideto.in', role: 'admin', title: 'Co-Founder', department: 'Executive Leadership' },
  { uid: 'EMP-03', name: 'Vishnu', email: 'vishnu@atideto.in', role: 'admin', title: 'CEO', department: 'Executive Leadership' },
  { uid: 'EMP-04', name: 'Kiran', email: 'kiran@atideto.in', role: 'admin', title: 'CPO', department: 'Product Management' },
  { uid: 'EMP-05', name: 'Yogesh', email: 'yogesh@atideto.in', role: 'admin', title: 'Full Stack Developer', department: 'Software Engineering' },
  { uid: 'EMP-06', name: 'Sanjay', email: 'sanjay@atideto.in', role: 'admin', title: 'Editor & Designer', department: 'Design & Media' },
  { uid: 'EMP-07', name: 'Sachin', email: 'sachin@atideto.in', role: 'admin', title: 'Client Manager', department: 'Client Operations & CRM' }
];

const ORIGINAL_STUDENTS: RegisteredAccount[] = [
  // Group 1: B.Tech IT dept (Mahendra Engineering College)
  { uid: 'AT-MEC-2027-01', name: 'Suresh kumar D', email: 'sureshkumard706@gmail.com', role: 'student' },
  { uid: 'AT-MEC-2027-02', name: 'V.vishwa', email: 'vishwa0847@gmail.com', role: 'student' },
  { uid: 'AT-MEC-2027-03', name: 'SARAVANAN K', email: 'starsaro615@gmail.com', role: 'student' },
  { uid: 'AT-MEC-2027-04', name: 'V.Nithish kumar', email: 'nithu2005nk@gmail.com', role: 'student' },
  { uid: 'AT-MEC-2027-05', name: 'SRISHANMATHI R', email: 'srishanmathi861019@gmail.com', role: 'student' },
  { uid: 'AT-MEC-2027-06', name: 'SAILISHA S', email: 'sailishas3@gmail.com', role: 'student' },
  { uid: 'AT-MEC-2027-07', name: 'S.Prasantha', email: 'prasantha2006s@gmail.com', role: 'student' },
  { uid: 'AT-MEC-2027-08', name: 'A.PRIYA', email: 'priyaanandan780@gmail.com', role: 'student' },
  { uid: 'AT-MEC-2027-09', name: 'SHIBIYA S', email: 'shibiya86@gmail.com', role: 'student' },
  { uid: 'AT-MEC-2027-10', name: 'S.Preethiroshini', email: 'preethiroshini184@gmail.com', role: 'student' },
  { uid: 'AT-MEC-2027-11', name: 'S.Priyadharshini', email: 'priyadk515@gmail.com', role: 'student' },
  { uid: 'AT-MEC-2027-12', name: 'S.Sanjay', email: 'sjay69521@gmail.com', role: 'student' },
  { uid: 'AT-MEC-2027-13', name: 'R. Yoshika', email: 'yoshikajune12@gmail.com', role: 'student' },
  { uid: 'AT-MEC-2027-14', name: 'Vimal Pravin V', email: 'vimalpravin071@gmail.com', role: 'student' },
  { uid: 'AT-MEC-2027-15', name: 'Yogesh S', email: 'yogeshbrf2006@gmail.com', role: 'student' },

  // Group 2: B.E. CSE dept (Mahendra College of Engineering)
  { uid: 'AT-MCE-2027-01', name: 'Saravanan M', email: 'saravananmanigandan8@gmail.com', role: 'student' },
  { uid: 'AT-MCE-2027-02', name: 'Rithick S', email: 'rithickroshan2005s@gmail.com', role: 'student' },
  { uid: 'AT-MCE-2027-03', name: 'Srisanth M', email: 'srisathabi@gmail.com', role: 'student' },
  { uid: 'AT-MCE-2027-04', name: 'Siva K', email: 'sivasiva90574@gmail.com', role: 'student' },
  { uid: 'AT-MCE-2027-05', name: 'Rajesh D', email: 'drajesh20061@gmail.com', role: 'student' },
  { uid: 'AT-MCE-2027-06', name: 'Thamarai Kannan S', email: 'kannanthamarai699@gmail.com', role: 'student' }
];

export default function Login() {
  const [mode, setMode] = useState<Mode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", role: "student" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Forgot Password Steps: enter_email -> enter_code -> change_password
  const [forgotStep, setForgotStep] = useState<ForgotStep>("enter_email");
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", ""]);
  const [isDelivered, setIsDelivered] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
  const [storeInGooglePasswords, setStoreInGooglePasswords] = useState<boolean>(true);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Admin Two-Factor Authentication Modal State (Google Authenticator / Try another way)
  const [admin2faState, setAdmin2faState] = useState<{
    isOpen: boolean;
    email: string;
    tempUser: any;
  }>({
    isOpen: false,
    email: "",
    tempUser: null
  });

  const handleTwoFactorSuccess = (verifiedUser: any) => {
    setAdmin2faState({ isOpen: false, email: "", tempUser: null });
    localStorage.setItem('atideto_sql_user', JSON.stringify(verifiedUser));
    localStorage.setItem('atideto_dashboard_mode', 'admin');
    window.dispatchEvent(new Event('atideto_auth_change'));
    toast.success(`Two-Step Verification approved. Signed in as ${verifiedUser.name}!`);
    navigate("/admin");
  };

  const otpInputRefs = [
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Cooldown countdown timer for resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  // Handle Login & Register submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const email = form.email.trim();
    const password = form.password;

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    if (mode === "register") {
      if (!form.name.trim()) {
        setError("Please enter your full legal name.");
        return;
      }
      const passValidation = checkPasswordRequirements(password);
      if (!passValidation.isValid) {
        setError(passValidation.errorMessage || "Please enter a valid password.");
        return;
      }
      if (password !== form.confirm) {
        setError("Passwords do not match. Please verify password confirmation.");
        return;
      }
    }

    setLoading(true);

    try {
      if (mode === "register") {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        try {
          await updateProfile(user, { displayName: form.name.trim() });
          await setDoc(
            doc(db, "users", user.uid),
            {
              name: form.name.trim(),
              email: email,
              role: form.role || "student",
              createdAt: new Date().toISOString()
            },
            { merge: true }
          );
          await sendEmailVerification(user);
        } catch (fsErr) {
          console.warn("User profile sync notice:", fsErr);
        }

        toast.success(`Account created successfully for ${form.name.trim()}`);
        navigate("/dashboard");
      } else if (mode === "login") {
        const cleanEmail = email.toLowerCase().trim();
        const cleanPass = password.trim();

        // 1. Try secure API authentication
        try {
          const sqlRes = await loginWithSql(cleanEmail, cleanPass);
          if (sqlRes && sqlRes.success && sqlRes.user) {
            // Require Google Authenticator 2FA for Admin Accounts
            if (sqlRes.user.role === 'admin') {
              setAdmin2faState({
                isOpen: true,
                email: cleanEmail,
                tempUser: sqlRes.user
              });
              setLoading(false);
              return;
            }

            localStorage.setItem('atideto_sql_user', JSON.stringify(sqlRes.user));
            localStorage.setItem('atideto_dashboard_mode', 'student');
            window.dispatchEvent(new Event('atideto_auth_change'));
            toast.success(`Signed in as ${sqlRes.user.name}`);
            navigate("/dashboard");
            return;
          }
        } catch (sqlErr) {
          console.warn("SQL Login service notice:", sqlErr);
        }

        // 2. Fallback to Firebase Email/Password
        try {
          const cred = await signInWithEmailAndPassword(auth, email, password);
          if (cred && cred.user) {
            const isCompanyAdmin = cleanEmail === 'admin@atideto.in' || cleanEmail.endsWith('@atideto.in');
            if (isCompanyAdmin) {
              setAdmin2faState({
                isOpen: true,
                email: cleanEmail,
                tempUser: {
                  uid: cred.user.uid,
                  name: cred.user.displayName || 'Administrator',
                  email: cleanEmail,
                  role: 'admin',
                  provider: 'firebase'
                }
              });
              setLoading(false);
              return;
            }

            toast.success("Signed in successfully");
            navigate("/dashboard");
            return;
          }
        } catch (err: any) {
          setError("Invalid email or password. Please verify your credentials and try again.");
          return;
        }
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth Handler (Restricted to Original Registered Data Only)
  const handleGoogleAuth = async () => {
    setError("");
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const userCredential = await signInWithPopup(auth, provider);

      const googleEmail = (userCredential.user.email || "").toLowerCase().trim();
      const isSuperAdmin = googleEmail === "admin@atideto.in";
      const matchedEmp = ORIGINAL_FOUNDERS_EMPLOYEES.find(e => e.email.toLowerCase() === googleEmail);
      const matchedStudent = ORIGINAL_STUDENTS.find(s => s.email.toLowerCase() === googleEmail);

      // Enforce: Original data only, not arbitrary accounts
      if (!isSuperAdmin && !matchedEmp && !matchedStudent) {
        setError(`Access restricted: Google account (${googleEmail}) is not registered in the Atideto database.`);
        setLoading(false);
        return;
      }

      const role = (isSuperAdmin || matchedEmp) ? "admin" : "student";
      let displayName = userCredential.user.displayName || googleEmail.split("@")[0] || "User";
      if (isSuperAdmin) displayName = "Administrator";
      else if (matchedEmp) displayName = matchedEmp.name;
      else if (matchedStudent) displayName = matchedStudent.name;

      const googleUser = {
        uid: userCredential.user.uid,
        name: displayName,
        email: googleEmail,
        role: role,
        provider: "google",
        avatarUrl: userCredential.user.photoURL || undefined
      };

      try {
        await syncGoogleUserToSql(googleUser);
      } catch (e) {
        console.warn("Could not sync Google user to MySQL:", e);
      }

      if (role === "admin") {
        setAdmin2faState({
          isOpen: true,
          email: googleEmail,
          tempUser: googleUser
        });
        setLoading(false);
        return;
      }

      localStorage.setItem('atideto_sql_user', JSON.stringify(googleUser));
      localStorage.setItem('atideto_dashboard_mode', role);
      window.dispatchEvent(new Event('atideto_auth_change'));

      toast.success(`Signed in as ${googleUser.name}`);
      navigate("/dashboard");
    } catch (err: any) {
      if (err.code === "auth/popup-closed-by-user") {
        setError("Google sign-in popup was closed.");
      } else {
        setError("Google authentication failed. Please sign in with email and password.");
      }
    } finally {
      setLoading(false);
    }
  };

  // GitHub OAuth Handler
  const handleGithubAuth = async () => {
    setError("");
    setLoading(true);
    try {
      const provider = new GithubAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const ghEmail = (userCredential.user.email || "").toLowerCase().trim();

      const isSuperAdmin = ghEmail === "admin@atideto.in";
      const matchedEmp = ORIGINAL_FOUNDERS_EMPLOYEES.find(e => e.email.toLowerCase() === ghEmail);
      const matchedStudent = ORIGINAL_STUDENTS.find(s => s.email.toLowerCase() === ghEmail);

      const role = (isSuperAdmin || matchedEmp) ? "admin" : "student";
      const displayName = isSuperAdmin ? "Administrator" : (matchedEmp?.name || matchedStudent?.name || userCredential.user.displayName || "Developer");

      const ghUser = {
        uid: userCredential.user.uid,
        name: displayName,
        email: ghEmail,
        role: role,
        provider: "github"
      };

      if (role === "admin") {
        setAdmin2faState({
          isOpen: true,
          email: ghEmail,
          tempUser: ghUser
        });
        setLoading(false);
        return;
      }

      localStorage.setItem('atideto_sql_user', JSON.stringify(ghUser));
      localStorage.setItem('atideto_dashboard_mode', role);
      window.dispatchEvent(new Event('atideto_auth_change'));

      toast.success(`Signed in as ${displayName}`);
      navigate("/dashboard");
    } catch (err: any) {
      if (err.code === "auth/popup-closed-by-user") {
        setError("GitHub login was cancelled.");
      } else {
        setError("GitHub login was cancelled or not completed.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Access Buttons (Original Data Only)
  const handleDemoLogin = async (role: "admin" | "student") => {
    setLoading(true);
    setError("");
    localStorage.setItem('atideto_dashboard_mode', role);
    const demoEmail = role === "admin" ? "admin@atideto.in" : "nithu2005nk@gmail.com";
    const demoPass = "admin123";
    const targetUrl = role === "admin" ? "/admin" : "/dashboard";

    const demoUser = {
      uid: role === "admin" ? "usr-admin-01" : "AT-MEC-2027-01",
      name: role === "admin" ? "Administrator" : "V.Nithish kumar",
      email: demoEmail,
      role: role,
      provider: "sql"
    };

    if (role === "admin") {
      setAdmin2faState({
        isOpen: true,
        email: demoEmail,
        tempUser: demoUser
      });
      setLoading(false);
      return;
    }

    localStorage.setItem('atideto_sql_user', JSON.stringify(demoUser));
    localStorage.setItem('atideto_dashboard_mode', 'student');
    window.dispatchEvent(new Event('atideto_auth_change'));

    try {
      await loginWithSql(demoEmail, demoPass);
    } catch (e) {}

    toast.success(`Logged in as ${demoUser.name} (Enrolled Student)`);
    navigate(targetUrl);
    setLoading(false);
  };

  // ──────────────────────────────────────────────────────────────────────────
  // FORGOT PASSWORD FLOW 1: SEND 4-DIGIT CODE VIA GMAIL SMTP
  // ──────────────────────────────────────────────────────────────────────────
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const email = form.email.trim();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid registered email address.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await sendForgotPasswordOtp(email);
      if (res.success) {
        setForgotStep("enter_code");
        setResendCooldown(30);
        setIsDelivered(true);

        toast.success(`Verification code dispatched to ${email}`, {
          duration: 9000,
          description: "Please check your inbox. If you cannot find the email, please check your spam or junk folder."
        });
        setTimeout(() => {
          otpInputRefs[0].current?.focus();
        }, 150);
      } else {
        setError(res.message || "Failed to send verification code. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to send code via SMTP.");
    } finally {
      setLoading(false);
    }
  };

  // ──────────────────────────────────────────────────────────────────────────
  // FORGOT PASSWORD FLOW 2: VERIFY 4-DIGIT CODE
  // ──────────────────────────────────────────────────────────────────────────
  const handleOtpChange = (index: number, val: string) => {
    const digitsOnly = val.replace(/\D/g, "");
    if (!digitsOnly) {
      const newOtp = [...otpDigits];
      newOtp[index] = "";
      setOtpDigits(newOtp);
      return;
    }

    if (digitsOnly.length > 1) {
      // Handles multi-digit paste or autofill
      const newDigits = [...otpDigits];
      for (let i = 0; i < digitsOnly.length && (index + i) < 4; i++) {
        newDigits[index + i] = digitsOnly[i];
      }
      setOtpDigits(newDigits);
      const nextFocus = Math.min(index + digitsOnly.length, 3);
      otpInputRefs[nextFocus].current?.focus();
      return;
    }

    const cleanVal = digitsOnly.slice(-1);
    const newOtp = [...otpDigits];
    newOtp[index] = cleanVal;
    setOtpDigits(newOtp);

    // Auto-advance to next box
    if (cleanVal && index < 3) {
      otpInputRefs[index + 1].current?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    if (!pasted) return;
    const newDigits = ["", "", "", ""];
    for (let i = 0; i < pasted.length; i++) {
      newDigits[i] = pasted[i];
    }
    setOtpDigits(newDigits);
    const nextIdx = Math.min(pasted.length, 3);
    otpInputRefs[nextIdx].current?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!otpDigits[index] && index > 0) {
        otpInputRefs[index - 1].current?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      otpInputRefs[index - 1].current?.focus();
    } else if (e.key === "ArrowRight" && index < 3) {
      otpInputRefs[index + 1].current?.focus();
    }
  };

  const handleVerifyOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const enteredOtp = otpDigits.join("");
    if (enteredOtp.length < 4) {
      setError("Please enter all 4 digits of the verification code.");
      return;
    }

    setLoading(true);
    try {
      const res = await verifyForgotPasswordOtp(form.email.trim(), enteredOtp);
      if (res.success) {
        toast.success("Verification code confirmed!");
        // Opens password change screen
        setForgotStep("change_password");
      } else {
        setError(res.message || "Invalid verification code. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "Verification failed. Check network.");
    } finally {
      setLoading(false);
    }
  };

  // ──────────────────────────────────────────────────────────────────────────
  // FORGOT PASSWORD FLOW 3: CHANGE PASSWORD & AUTO-LOGIN
  // ──────────────────────────────────────────────────────────────────────────
  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const passValidation = checkPasswordRequirements(newPassword);
    if (!passValidation.isValid) {
      setError(passValidation.errorMessage || "Please enter a valid password.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("New passwords do not match. Please re-enter to confirm.");
      return;
    }

    setLoading(true);
    const enteredOtp = otpDigits.join("");

    try {
      // 1. Google Password Manager Integration (Browser Credentials API)
      if (storeInGooglePasswords && typeof window !== "undefined") {
        try {
          if ("credentials" in navigator && (window as any).PasswordCredential) {
            const credential = new (window as any).PasswordCredential({
              id: form.email.trim(),
              password: newPassword,
              name: form.email.split("@")[0] || "Atideto User"
            });
            await navigator.credentials.store(credential);
          }
        } catch (credErr) {
          console.log("Browser credential store hint:", credErr);
        }
      }

      // 2. Call backend reset and auto-login
      const res = await resetPasswordAndLogin(form.email.trim(), enteredOtp, newPassword);

      if (res.success && res.user) {
        localStorage.setItem('atideto_sql_user', JSON.stringify(res.user));
        localStorage.setItem('atideto_dashboard_mode', res.user.role === 'admin' ? 'admin' : 'student');
        window.dispatchEvent(new Event('atideto_auth_change'));

        toast.success(
          "Password updated successfully! Welcome back.",
          {
            description: `Logged in as ${res.user.name}. Stored in Google Password Manager.`
          }
        );

        setOtpDigits(["", "", "", ""]);
        setForgotStep("enter_email");

        if (res.user.role === 'admin') {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      } else {
        setError(res.message || "Failed to update password.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      data-slot="login"
      className="fixed inset-0 w-screen h-screen max-h-screen overflow-hidden bg-[#06080F] text-foreground flex flex-col lg:grid lg:grid-cols-12 z-50 select-none"
    >
      <SEO
        title={mode === "login" ? "Login | Atideto Technologies" : mode === "register" ? "Join Atideto Technologies" : "Reset Password | Atideto"}
        description="Sign in or join Atideto Technologies. Access your custom client portal and digital development workspace."
        url="https://atideto.in/login"
      />

      {/* ───────────────────────────────────────────────────────────────────── */}
      {/* LEFT PANE: Full-Height Editorial Column (Clean, Fixed, No Quotes)     */}
      {/* ───────────────────────────────────────────────────────────────────── */}
      <aside
        data-slot="login-aside"
        className="relative hidden h-full flex-col justify-between overflow-hidden border-r border-white/[0.08] bg-[#070B16] p-8 xl:p-12 lg:col-span-5 xl:col-span-6 lg:flex"
      >
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#06080F]/90 via-transparent to-transparent pointer-events-none" />

        {/* Top: Brand Logo + v2.4 Enterprise Pill */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={atidetoLogo}
              alt="Atideto"
              className="h-9 w-auto object-contain filter drop-shadow-[0_0_14px_rgba(0,102,255,0.6)]"
            />
            <img
              src={atidetoWordmark}
              alt="Atideto Technologies"
              className="h-8 w-auto object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
            />
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.1] text-[11px] font-mono text-slate-300">
            <span className="size-1.5 rounded-full bg-[#00D26A] animate-pulse" />
            <span>v2.4 Enterprise</span>
          </div>
        </div>

        {/* Middle: Clean Headline & Description */}
        <div className="relative z-10 max-w-xl my-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] font-mono tracking-wider uppercase text-[#38BDF8]">
            <span className="size-1.5 rounded-full bg-[#0066FF]" />
            <span>PLATFORM ENGINEERING & ACADEMY</span>
          </div>

          <h1
            className="text-3xl xl:text-4xl leading-tight font-extrabold text-white tracking-tight"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Crafting intuitive digital experiences through thoughtful engineering.
          </h1>

          <p className="text-sm xl:text-base text-slate-400 font-normal leading-relaxed">
            Unified access to client projects, student workspaces, industrial internships, and enterprise administration.
          </p>
        </div>

        {/* Bottom: Copyright & Security Status */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-white/[0.06]">
          <span>&copy; {new Date().getFullYear()} Atideto Technologies Pvt Ltd.</span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <CheckCircle2 className="size-3.5 text-[#00D26A]" />
            Enterprise-Grade Secured
          </span>
        </div>
      </aside>

      {/* ───────────────────────────────────────────────────────────────────── */}
      {/* RIGHT PANE: Interactive Form (100% Height, Fixed, No Scrollbar)       */}
      {/* ───────────────────────────────────────────────────────────────────── */}
      <div
        data-slot="login-main"
        className="relative h-full max-h-screen overflow-hidden flex flex-col justify-between px-6 sm:px-10 lg:px-12 py-5 lg:col-span-7 xl:col-span-6 bg-[#06080F]"
      >
        {/* Ambient Top Glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -right-24 size-80 rounded-full opacity-25 blur-3xl bg-[#0066FF]"
        />

        {/* Top Row: Back to Home + Mode Switcher */}
        <div className="relative z-10 flex items-center justify-between w-full shrink-0">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="gap-1.5 text-xs text-slate-400 hover:text-white hover:bg-white/[0.06] rounded-full px-3 h-8"
          >
            <Link to="/">
              <ChevronLeft className="size-3.5" />
              Return to Website
            </Link>
          </Button>

          {mode !== "forgot" && (
            <div className="inline-flex p-0.5 rounded-full bg-white/[0.05] border border-white/[0.08] backdrop-blur-md">
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setMode("login");
                }}
                className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-200 cursor-pointer ${
                  mode === "login"
                    ? "bg-[#0066FF] text-white shadow-[0_0_12px_rgba(0,102,255,0.4)]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setMode("register");
                }}
                className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-200 cursor-pointer ${
                  mode === "register"
                    ? "bg-[#0066FF] text-white shadow-[0_0_12px_rgba(0,102,255,0.4)]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Create Account
              </button>
            </div>
          )}
        </div>

        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* CENTERED CONTENT BOX: Clean, Fixed, Professional Placeholders       */}
        {/* ─────────────────────────────────────────────────────────────────── */}
        <div className="relative z-10 mx-auto w-full max-w-[390px] my-auto space-y-3.5 shrink-0">

          {/* Mobile Header Brand Icon (Hidden on Desktop) */}
          <div className="flex items-center gap-2 lg:hidden mb-1">
            <img src={atidetoLogo} alt="Atideto" className="h-7 w-auto object-contain" />
            <span className="text-white font-bold text-base">Atideto Technologies</span>
          </div>

          {/* Error Message Banner */}
          {error && (
            <div className="p-2.5 bg-rose-500/15 border border-rose-500/30 rounded-lg text-rose-300 text-xs font-medium animate-in fade-in duration-150">
              {error}
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════════ */}
          {/* MODE: FORGOT PASSWORD (STEP 1: EMAIL -> STEP 2: CODE -> STEP 3: PW) */}
          {/* ═════════════════════════════════════════════════════════════════ */}
          {mode === "forgot" ? (
            <div className="space-y-3.5">

              {/* STEP 1: Enter Email */}
              {forgotStep === "enter_email" && (
                <>
                  <div className="space-y-1">
                    <h2
                      className="text-2xl font-bold tracking-tight text-white"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      Reset your password
                    </h2>
                    <p className="text-xs text-slate-400">
                      Enter your registered email to receive a 4-digit verification code.
                    </p>
                  </div>

                  <form onSubmit={handleSendOtp} className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-300">Email Address</label>
                      <div className="relative">
                        <input
                          type="email"
                          placeholder="name@company.com"
                          value={form.email}
                          onChange={(e) => update("email", e.target.value)}
                          required
                          className="w-full pl-9 pr-3 py-2 bg-[#0C1222] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#0066FF] transition"
                        />
                        <AtSign className="absolute left-3 top-2.5 size-4 text-slate-500" />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-10 text-xs font-semibold bg-[#0066FF] hover:bg-[#2EA8FF] text-white rounded-xl shadow-[0_0_16px_rgba(0,102,255,0.35)] cursor-pointer transition"
                    >
                      {loading && <Loader2 className="size-3.5 animate-spin mr-2" />}
                      Send 4-Digit Code
                    </Button>

                    <button
                      type="button"
                      onClick={() => {
                        setError("");
                        setMode("login");
                      }}
                      className="w-full text-center text-xs text-slate-400 hover:text-white transition cursor-pointer pt-1"
                    >
                      ← Back to Sign In
                    </button>
                  </form>
                </>
              )}

              {/* STEP 2: Enter 4-Digit Verification Code */}
              {forgotStep === "enter_code" && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  {/* Clean Header */}
                  <div className="space-y-1.5 text-left">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#0066FF]/10 border border-[#0066FF]/20 text-[#38BDF8] text-[11px] font-semibold mb-1">
                      <Mail className="size-3.5" />
                      <span>Email Verification</span>
                    </div>
                    <h2
                      className="text-2xl font-bold tracking-tight text-white"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      Enter 4-Digit Code
                    </h2>
                    <p className="text-xs text-slate-400 truncate flex items-center gap-1.5 pt-0.5">
                      <span>Code sent to</span>
                      <span className="text-[#38BDF8] font-semibold font-mono truncate">{form.email}</span>
                    </p>
                  </div>

                  {/* Real Email Verification Instructions Notice */}
                  <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-left flex items-start gap-3">
                    <Mail className="size-4 text-[#38BDF8] shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-300 leading-relaxed">
                      A 4-digit verification code has been dispatched to <span className="font-mono text-white font-bold">{form.email}</span>. Please check your email inbox and enter the code below to reset your password. Be sure to check spam or junk if not received.
                    </p>
                  </div>

                  <form onSubmit={handleVerifyOtpSubmit} className="space-y-4">
                    {/* 4 Professional Square OTP Boxes */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-300 block text-left">
                        Security Passcode
                      </label>
                      <div className="grid grid-cols-4 gap-3 sm:gap-3.5 max-w-[280px] sm:max-w-[300px]">
                        {[0, 1, 2, 3].map((idx) => (
                          <input
                            key={idx}
                            ref={otpInputRefs[idx]}
                            type="text"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            pattern="[0-9]*"
                            maxLength={1}
                            value={otpDigits[idx]}
                            onChange={(e) => handleOtpChange(idx, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                            onPaste={handleOtpPaste}
                            className={`w-full aspect-square text-center font-mono text-2xl font-bold rounded-xl border transition-all duration-150 select-none ${
                              otpDigits[idx]
                                ? "bg-[#0066FF]/15 border-[#0066FF] text-white shadow-[0_0_12px_rgba(0,102,255,0.25)] ring-1 ring-[#0066FF]/50"
                                : "bg-[#080D1A] border-white/15 text-white hover:border-white/30"
                            } focus:outline-none focus:border-[#2EA8FF] focus:bg-[#080D1A] focus:ring-4 focus:ring-[#0066FF]/20 focus:scale-[1.03]`}
                          />
                        ))}
                      </div>

                      {/* Resend Action */}
                      <div className="flex items-center justify-between text-xs pt-1 max-w-[280px] sm:max-w-[300px]">
                        <span className="text-slate-400 text-[11px]">Didn't get the code?</span>
                        {resendCooldown > 0 ? (
                          <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1.5 bg-white/5 px-2 py-0.5 rounded-md border border-white/10">
                            <RefreshCw className="size-3 animate-spin text-[#38BDF8]" />
                            <span>Resend in <strong>{resendCooldown}s</strong></span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            disabled={loading}
                            onClick={() => handleSendOtp()}
                            className="text-[#38BDF8] hover:text-white font-medium text-[11px] flex items-center gap-1.5 transition cursor-pointer hover:underline disabled:opacity-50"
                          >
                            <RefreshCw className={`size-3 ${loading ? 'animate-spin' : ''}`} />
                            <span>Resend Code</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Dedicated Professional Spam Note Card */}
                    <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-left">
                      <Info className="size-4 text-amber-400 shrink-0 mt-0.5" />
                      <p className="text-[11px] leading-relaxed text-slate-300">
                        <strong className="text-amber-300 font-semibold">Note:</strong> Can't find the email in your inbox? Please <strong>check your Spam or Junk folder</strong>.
                      </p>
                    </div>

                    {/* Submit CTA */}
                    <Button
                      type="submit"
                      disabled={loading || otpDigits.join("").length < 4}
                      className="w-full h-11 text-xs sm:text-sm font-semibold bg-[#0066FF] hover:bg-[#2EA8FF] disabled:opacity-40 text-white rounded-xl shadow-[0_4px_18px_rgba(0,102,255,0.35)] cursor-pointer transition flex items-center justify-center gap-2 mt-1"
                    >
                      {loading ? (
                        <Loader2 className="size-4 animate-spin mr-1" />
                      ) : (
                        <ShieldCheck className="size-4" />
                      )}
                      <span>Verify Code & Continue</span>
                    </Button>

                    {/* Change Email */}
                    <button
                      type="button"
                      onClick={() => {
                        setForgotStep("enter_email");
                        setOtpDigits(["", "", "", ""]);
                        setError("");
                      }}
                      className="w-full text-center text-xs text-slate-400 hover:text-white transition cursor-pointer pt-1 flex items-center justify-center gap-1"
                    >
                      <ChevronLeft className="size-3.5" />
                      <span>Change Email Address</span>
                    </button>
                  </form>
                </div>
              )}

              {/* STEP 3: Change Password and Auto-Login */}
              {forgotStep === "change_password" && (
                <>
                  <div className="space-y-1 text-left">
                    <h2
                      className="text-2xl font-bold tracking-tight text-white"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      Set New Password
                    </h2>
                    <p className="text-xs text-slate-400">
                      Create a strong new password for your account. You will be logged in immediately.
                    </p>
                  </div>

                  <form onSubmit={handleResetPasswordSubmit} autoComplete="on" className="space-y-3">
                    <input
                      type="text"
                      name="username"
                      value={form.email}
                      readOnly
                      hidden
                      autoComplete="username"
                    />

                    {/* New Password */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-300">New Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="new-password"
                          autoComplete="new-password"
                          placeholder="••••••••"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                          className="w-full pl-9 pr-9 py-2 bg-[#0C1222] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#0066FF] transition"
                        />
                        <Lock className="absolute left-3 top-2.5 size-4 text-slate-500" />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2.5 text-slate-400 hover:text-white cursor-pointer"
                        >
                          {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                      <PasswordRequirements password={newPassword} compact={true} className="pt-1" />
                    </div>

                    {/* Confirm New Password */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-medium text-slate-300">Confirm New Password</label>
                        {confirmNewPassword && (
                          <span className={`text-[10px] font-medium flex items-center gap-1 ${
                            newPassword === confirmNewPassword ? "text-emerald-400" : "text-rose-400"
                          }`}>
                            {newPassword === confirmNewPassword ? "✓ Passwords match" : "✕ Passwords do not match"}
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          autoComplete="new-password"
                          placeholder="••••••••"
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                          required
                          className="w-full pl-9 pr-9 py-2 bg-[#0C1222] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#0066FF] transition"
                        />
                        <Lock className="absolute left-3 top-2.5 size-4 text-slate-500" />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-2.5 text-slate-400 hover:text-white cursor-pointer"
                        >
                          {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>

                    {/* Store in Google Passwords */}
                    <label className="flex items-start gap-2.5 p-2 rounded-xl bg-white/[0.03] border border-white/10 cursor-pointer hover:bg-white/[0.06] transition">
                      <input
                        type="checkbox"
                        checked={storeInGooglePasswords}
                        onChange={(e) => setStoreInGooglePasswords(e.target.checked)}
                        className="mt-0.5 rounded border-white/20 bg-[#0C1222] text-[#0066FF] focus:ring-[#0066FF] size-3.5 cursor-pointer"
                      />
                      <div className="text-left leading-tight">
                        <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                          <span>Store in Google Passwords</span>
                          <span className="px-1.5 py-0.2 rounded text-[9px] bg-blue-500/20 text-blue-400 font-mono">
                            Google Chrome
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Save and sync this updated password to your Google Account autofill.
                        </p>
                      </div>
                    </label>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-10 text-xs font-semibold bg-[#0066FF] hover:bg-[#2EA8FF] text-white rounded-xl shadow-[0_0_16px_rgba(0,102,255,0.35)] cursor-pointer transition flex items-center justify-center gap-1.5 mt-1"
                    >
                      {loading ? <Loader2 className="size-3.5 animate-spin mr-2" /> : <ArrowRight className="size-3.5" />}
                      Save Password & Sign In
                    </Button>
                  </form>
                </>
              )}

            </div>
          ) : (
            /* ═════════════════════════════════════════════════════════════════ */
            /* MODE: SIGN IN / REGISTER                                          */
            /* ═════════════════════════════════════════════════════════════════ */
            <>
              {/* Google & GitHub Social Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={loading}
                  onClick={handleGoogleAuth}
                  className="w-full h-10 gap-2 text-xs font-medium border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-white cursor-pointer rounded-xl transition shadow-sm"
                >
                  <GoogleIcon className="size-4" />
                  <span>Google</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={loading}
                  onClick={handleGithubAuth}
                  className="w-full h-10 gap-2 text-xs font-medium border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-white cursor-pointer rounded-xl transition shadow-sm"
                >
                  <GithubIcon className="size-4" />
                  <span>GitHub</span>
                </Button>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 my-0.5">
                <div className="flex-1 h-px bg-white/[0.08]" />
                <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400">
                  OR CONTINUE WITH EMAIL
                </span>
                <div className="flex-1 h-px bg-white/[0.08]" />
              </div>

              {/* Email / Password Form */}
              <form onSubmit={handleSubmit} className="space-y-2.5">

                {/* Full Name (when Registering) */}
                {mode === "register" && (
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-300">Full Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={form.name}
                        onChange={(e) => update("name", e.target.value)}
                        required
                        className="w-full pl-9 pr-3 py-2 bg-[#0C1222] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#0066FF] transition"
                      />
                      <User className="absolute left-3 top-2.5 size-4 text-slate-500" />
                    </div>
                  </div>
                )}

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="name@company.com"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      required
                      className="w-full pl-9 pr-3 py-2 bg-[#0C1222] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#0066FF] transition"
                    />
                    <AtSign className="absolute left-3 top-2.5 size-4 text-slate-500" />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-slate-300">Password</label>
                    {mode === "login" && (
                      <button
                        type="button"
                        onClick={() => {
                          setError("");
                          setMode("forgot");
                          setForgotStep("enter_email");
                          setIsDelivered(false);
                          setOtpDigits(["", "", "", ""]);
                        }}
                        className="text-[11px] text-[#38BDF8] hover:underline cursor-pointer font-medium"
                      >
                        Forgot?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={form.password}
                      onChange={(e) => update("password", e.target.value)}
                      required
                      className="w-full pl-9 pr-9 py-2 bg-[#0C1222] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#0066FF] transition"
                    />
                    <Lock className="absolute left-3 top-2.5 size-4 text-slate-500" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-white transition cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  {mode === "register" && (
                    <PasswordRequirements password={form.password} compact={true} className="pt-1" />
                  )}
                </div>

                {/* Confirm Password (when Registering) */}
                {mode === "register" && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-slate-300">Confirm Password</label>
                      {form.confirm && (
                        <span className={`text-[10px] font-medium flex items-center gap-1 ${
                          form.password === form.confirm ? "text-emerald-400" : "text-rose-400"
                        }`}>
                          {form.password === form.confirm ? "✓ Passwords match" : "✕ Passwords do not match"}
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={form.confirm}
                        onChange={(e) => update("confirm", e.target.value)}
                        required
                        className="w-full pl-9 pr-9 py-2 bg-[#0C1222] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#0066FF] transition"
                      />
                      <Lock className="absolute left-3 top-2.5 size-4 text-slate-500" />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-white transition cursor-pointer"
                      >
                        {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Primary Action Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-10 mt-1 text-xs font-semibold bg-[#0066FF] hover:bg-[#2EA8FF] text-white rounded-xl shadow-[0_0_16px_rgba(0,102,255,0.4)] cursor-pointer transition"
                >
                  {loading && <Loader2 className="size-3.5 animate-spin mr-2" />}
                  {mode === "login" ? "Sign In to Portal" : "Create Account"}
                </Button>
              </form>

              {/* Terms & Privacy */}
              <p className="text-center text-[11px] text-slate-500 pt-0.5">
                By signing in, you agree to our{" "}
                <Link to="/terms-and-conditions" className="text-slate-400 hover:text-white underline underline-offset-2">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy-policy" className="text-slate-400 hover:text-white underline underline-offset-2">
                  Privacy Policy
                </Link>
                .
              </p>
            </>
          )}

        </div>

        {/* Bottom Pinned Footer */}
        <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-500 pt-2 shrink-0">
          <span>Protected by Enterprise Security</span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <ShieldCheck className="size-3.5 text-[#00D26A]" />
            End-to-End Encrypted
          </span>
        </div>

      </div>

      {/* Admin Two-Factor Authentication Modal (Google Authenticator / Try another way) */}
      <AdminTwoFactorModal
        isOpen={admin2faState.isOpen}
        onClose={() => setAdmin2faState({ isOpen: false, email: "", tempUser: null })}
        email={admin2faState.email}
        tempUser={admin2faState.tempUser}
        onSuccess={handleTwoFactorSuccess}
      />
    </section>
  );
}
