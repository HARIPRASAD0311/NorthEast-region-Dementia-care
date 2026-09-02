/* =========================================================
   SMRITI — prototype logic (vanilla JS)
   Frontend-only demo. Auth, storage and face-match are all
   simulated with localStorage so a real backend (accounts API
   + face-recognition service) can be dropped in later without
   restructuring the UI flow.
   ========================================================= */

(function () {
  "use strict";

  /* ---------- shared state ---------- */
  const STORAGE_KEY = "smriti_profile_v1";
  const LANGUAGE_KEY = "smriti_ui_lang";
  let voiceEnabled = false;
  let largeTextEnabled = false;
  let highContrastEnabled = false;
  let capturedPhotoDataUrl = null; // pending photo captured during registration
  let pendingFaceSignature = null; // pending face signature captured during registration

  const translations = {
    English: {
      registerTab: "Register",
      signinTab: "Sign In",
      createAccountTitle: "Create Your Account",
      createAccountSubtitle: "Let's set up your profile for a personalized cognitive-care experience.",
      stepLabel: "Step {step} of 2",
      personalInfo: "Personal Information",
      fullName: "Full Name",
      age: "Age",
      language: "Preferred Language",
      stateRegion: "State / Region",
      accessibility: "Accessibility Preferences",
      voiceAssist: "Voice Assistance",
      voiceAssistDesc: "Enable voice guidance",
      largeText: "Large Text",
      largeTextDesc: "Use larger text throughout the application",
      highContrast: "High Contrast",
      highContrastDesc: "Improve visual contrast",
      faceVerification: "Face Verification",
      faceVerificationSub: "Set up face sign-in for easier access to your account.",
      addYourFace: "Add Your Face",
      useCamera: "Use your camera to securely set up face sign-in.",
      positionFace: "Position your face inside the oval guide",
      openCamera: "Open Camera",
      skipForNow: "Skip for now",
      faceEnrolled: "Face enrolled successfully",
      next: "Next",
      caregiverInfo: "Caregiver Information",
      optional: "Optional",
      caregiverInfoSub: "A caregiver can help monitor activities, reminders, and progress.",
      caregiverName: "Caregiver Name",
      relationship: "Relationship",
      caregiverPhone: "Caregiver Phone Number",
      back: "Back",
      createAccount: "Create Account",
      alreadyHaveAccount: "Already have an account?",
      welcomeBack: "Welcome Back",
      welcomeBackSubtitle: "Sign in to continue your personalized cognitive-care journey.",
      quickSignIn: "Quick Sign In",
      lookAtCamera: "Look at the camera to sign in",
      scanFace: "Scan My Face",
      or: "OR",
      signInPassword: "Sign in with Password",
      emailPhone: "Email or Phone Number",
      password: "Password",
      rememberMe: "Remember me",
      forgotPassword: "Forgot Password?",
      signIn: "Sign In",
      noAccount: "Don't have an account?",
      createAccountLink: "Create Account",
      dashboardGreeting: "Welcome back!",
      dashboardReady: "Your dashboard is ready.",
      dashboardNote: "Cognitive screening, personalized activities, and progress tracking will appear here next.",
      signOut: "Sign Out",
      footerNote: "Smriti supports cognitive-care activities and screening. It does not replace professional medical diagnosis or treatment.",
      enterName: "Please enter your name.",
      enterAge: "Please enter your age.",
      selectLanguage: "Please select your preferred language.",
      selectRegion: "Please select your state or region.",
      fillFields: "Please fill in the highlighted fields.",
      noProfile: "No account found. Please create an account first.",
      welcomeVoice: "Welcome back, {name}. Taking you to your assessment.",
      voiceOn: "Voice guidance is on.",
      voiceOff: "Turn off voice guidance",
      voiceOnLabel: "Turn on voice guidance",
      loginError: "Please enter your email or phone number.",
      passwordError: "Please enter your password.",
      caregiverPhoneError: "Please enter a valid caregiver phone number.",
      show: "Show",
      hide: "Hide",
      linkText: "Sign In",
      registerHint: "Let's create your profile.",
      fullNamePlaceholder: "Enter your full name",
      agePlaceholder: "Enter your age",
      emailPhonePlaceholder: "Enter your email or phone number",
      passwordPlaceholder: "Enter your password",
      caregiverNamePlaceholder: "Enter caregiver's name",
      caregiverPhonePlaceholder: "Enter phone number",
      selectRelationship: "Select relationship",
      selectLanguageOption: "Select language",
      selectState: "Select state"
    },
    Assamese: {
      registerTab: "নবাইন",
      signinTab: "সাইন ইন",
      createAccountTitle: "আপোনাৰ একাউন্ট সৃষ্টি কৰক",
      createAccountSubtitle: "আপোনাৰ ব্যক্তিগত জ্ঞানীয় যত্ন অভিজ্ঞতাৰ বাবে প্ৰফাইল সাজু কৰক।",
      stepLabel: "ধাপ {step} of 2",
      personalInfo: "ব্যক্তিগত তথ্য",
      fullName: "সম্পূৰ্ণ নাম",
      age: "বয়স",
      language: "পছন্দৰ ভাষা",
      stateRegion: "ৰাজ্য / অঞ্চল",
      accessibility: "অভিগম্যতা পছন্দ",
      voiceAssist: "ভইচ সহায়",
      voiceAssistDesc: "ভইচ গাইডেন্স সক্ষম কৰক",
      largeText: "বৃহৎ লিখনী",
      largeTextDesc: "সকলো পৃষ্ঠাত বৃহৎ লিখনী ব্যৱহাৰ কৰক",
      highContrast: "উচ্চ কনট্ৰাষ্ট",
      highContrastDesc: "দৃশ্যমানতা উন্নত কৰক",
      faceVerification: "ফেচ ভেরিফিকেশ্বন",
      faceVerificationSub: "আপোনাৰ একাউন্টৰ সহজতর প্ৰবেশৰ বাবে ফেচ সাইন-ইন স্থাপন কৰক।",
      addYourFace: "আপোনাৰ মুখ যোগ কৰক",
      useCamera: "আপোনাৰ কেমেৰাৰে নিৰাপদে ফেচ সাইন-ইন স্থাপন কৰক।",
      positionFace: "আপোনাৰ মুখ অকলটি গাইডৰ ভিতৰত ৰাখক",
      openCamera: "কেমৰা খোলক",
      skipForNow: "এখনহি এদৌ এৰি যাওক",
      faceEnrolled: "ফেচ সফলভাবে নিবন্ধিত হৈছে",
      next: "পৰবৰ্তী",
      caregiverInfo: "কেয়ারগিভাৰ তথ্য",
      optional: "ঐচ্ছিক",
      caregiverInfoSub: "একজন কেয়ারগিভাৰ কার্যকলাপ, অনুস্মাৰক আৰু অগ্ৰগতি নিৰীক্ষণত সহায় কৰিব পাৰে।",
      caregiverName: "কেয়ারগিভাৰৰ নাম",
      relationship: "সম্পৰ্ক",
      caregiverPhone: "কেয়ারগিভাৰৰ ফোন নম্বৰ",
      back: "পিছলৈ",
      createAccount: "একাউন্ট সৃষ্টি কৰক",
      alreadyHaveAccount: "ইয়াত আগেয়ে একাউন্ট আছে?",
      welcomeBack: "ফিরি আহিয়াছ",
      welcomeBackSubtitle: "আপোনাৰ ব্যক্তিগত জ্ঞানীয় যত্ন যাত্ৰা অব্যাহত কৰিবলৈ সাইন ইন কৰক।",
      quickSignIn: "দ্রুত সাইন ইন",
      lookAtCamera: "কেমেৰালৈ চাওক সাইন ইন কৰিবলৈ",
      scanFace: "মোৰ মুখ স্কেন কৰক",
      or: "অথবা",
      signInPassword: "পাছওয়ার্ডৰে সাইন ইন",
      emailPhone: "ইমেইল বা ফোন নম্বৰ",
      password: "পাছওয়ার্ড",
      rememberMe: "মোক মনত ৰাখি",
      forgotPassword: "পাছওয়ার্ড পাহৰিয়াছ?",
      signIn: "সাইন ইন",
      noAccount: "একাউন্ট নাই?",
      createAccountLink: "একাউন্ট সৃষ্টি কৰক",
      dashboardGreeting: "ফিরি আপোচ!",
      dashboardReady: "আপোনাৰ ড্যাশবোর্ড সাজু হৈছে।",
      dashboardNote: "জ্ঞানীয় মূল্যায়ন, ব্যক্তিগত কার্যকলাপ আৰু অগ্ৰগতি ইয়াত দেখুৱা হ'ব।",
      signOut: "সাইন আউট",
      footerNote: "Smriti জ্ঞানীয় যত্ন কার্যকলাপ আৰু স্ক্ৰিনিং সমৰ্থন কৰে। ই চিকিৎসা বিশেষজ্ঞৰ diagnosis অথবা চিকিৎসাক সলনি নকৰে।",
      enterName: "অনুগ্ৰহ কৰি আপোনাৰ নাম লিখক।",
      enterAge: "অনুগ্ৰহ কৰি বয়স লিখক।",
      selectLanguage: "অনুগ্ৰহ কৰি আপোনাৰ ভাষা বাছনি কৰক।",
      selectRegion: "অনুগ্ৰহ কৰি আপোনাৰ ৰাজ্য বা অঞ্চল বাছনি কৰক।",
      fillFields: "অনুগ্ৰহ কৰি হাইলাইট কৰা ক্ষেত্ৰসমূহ পূৰণ কৰক।",
      noProfile: "কোনো একাউন্ট পোৱা নগ'ল। অনুগ্ৰহ কৰি প্ৰথমে একাউন্ট সৃষ্টি কৰক।",
      welcomeVoice: "ফিরি আপোচ, {name}. আপোনাক মূল্যায়ন পৃষ্ঠালৈ লৈ যাওঁ।",
      voiceOn: "ভইচ গাইডেন্স অন হৈছে।",
      voiceOff: "ভইচ গাইডেন্স অফ কৰক",
      voiceOnLabel: "ভইচ গাইডেন্স অন কৰক",
      loginError: "অনুগ্ৰহ কৰি ইমেইল বা ফোন নম্বৰ লিখক।",
      passwordError: "অনুগ্ৰহ কৰি পাছওয়ার্ড লিখক।",
      caregiverPhoneError: "অনুগ্ৰহ কৰি বৈধ ফোন নম্বৰ লিখক।",
      show: "দেখুৱাওক",
      hide: "লুকাওক",
      linkText: "সাইন ইন",
      registerHint: "আমাক আপোনাৰ প্ৰফাইল সৃষ্টি কৰিবলৈ দাওঁ।",
      fullNamePlaceholder: "আপোনাৰ সম্পূৰ্ণ নাম লিখক",
      agePlaceholder: "আপোনাৰ বয়স লিখক",
      emailPhonePlaceholder: "আপোনাৰ ইমেইল বা ফোন নম্বৰ লিখক",
      passwordPlaceholder: "আপোনাৰ পাছওয়ার্ড লিখক",
      caregiverNamePlaceholder: "কেয়ারগিভাৰৰ নাম লিখক",
      caregiverPhonePlaceholder: "ফোন নম্বৰ লিখক",
      selectRelationship: "সম্পৰ্ক বাছনি কৰক",
      selectLanguageOption: "ভাষা বাছি লওক",
      selectState: "ৰাজ্য বাছি লওক"
    },
    Bengali: {
      registerTab: "রেজিস্টার",
      signinTab: "সাইন ইন",
      createAccountTitle: "আপনার অ্যাকাউন্ট তৈরি করুন",
      createAccountSubtitle: "ব্যক্তিগত কগনিটিভ কেয়ার অভিজ্ঞতার জন্য আপনার প্রোফাইল সেট আপ করুন।",
      stepLabel: "ধাপ {step} এর 2",
      personalInfo: "ব্যক্তিগত তথ্য",
      fullName: "পুরো নাম",
      age: "বয়স",
      language: "পছন্দের ভাষা",
      stateRegion: "রাজ্য / অঞ্চল",
      accessibility: "অ্যাক্সেসিবিলিটি পছন্দ",
      voiceAssist: "ভয়েস সহায়তা",
      voiceAssistDesc: "ভয়েস গাইডেন্স চালু করুন",
      largeText: "বড় লেখা",
      largeTextDesc: "সারা অ্যাপ জুড়ে বড় লেখা ব্যবহার করুন",
      highContrast: "উচ্চ কনট্রাস্ট",
      highContrastDesc: "ভিজ্যুয়াল কনট্রাস্ট উন্নত করুন",
      faceVerification: "ফেস ভেরিফিকেশন",
      faceVerificationSub: "সহজে অ্যাক্সেসের জন্য ফেস সাইন-ইন সেট আপ করুন।",
      addYourFace: "আপনার মুখ যোগ করুন",
      useCamera: "ক্যামেরা ব্যবহার করে নিরাপদে ফেস সাইন-ইন সেট করুন।",
      positionFace: "আপনার মুখ ডিম্বাকৃতি গাইডের ভেতরে রাখুন",
      openCamera: "ক্যামেরা খুলুন",
      skipForNow: "এখনই এড়িয়ে যান",
      faceEnrolled: "ফেস সফলভাবে নথিভুক্ত হয়েছে",
      next: "পরবর্তী",
      caregiverInfo: "কেয়ারগিভার তথ্য",
      optional: "ঐচ্ছিক",
      caregiverInfoSub: "একজন কেয়ারগিভার কার্যক্রম, রিমাইন্ডার এবং অগ্রগতি পর্যবেক্ষণ করতে সাহায্য করতে পারেন।",
      caregiverName: "কেয়ারগিভারের নাম",
      relationship: "সম্পর্ক",
      caregiverPhone: "কেয়ারগিভারের ফোন নম্বর",
      back: "পিছনে",
      createAccount: "অ্যাকাউন্ট তৈরি করুন",
      alreadyHaveAccount: "ইতিমধ্যে অ্যাকাউন্ট আছে?",
      welcomeBack: "স্বাগতম",
      welcomeBackSubtitle: "আপনার ব্যক্তিগত কগনিটিভ কেয়ার যাত্রা চালিয়ে যেতে সাইন ইন করুন।",
      quickSignIn: "দ্রুত সাইন ইন",
      lookAtCamera: "সাইন ইন করতে ক্যামেরার দিকে তাকান",
      scanFace: "আমার মুখ স্ক্যান করুন",
      or: "অথবা",
      signInPassword: "পাসওয়ার্ড দিয়ে সাইন ইন",
      emailPhone: "ইমেইল বা ফোন নম্বর",
      password: "পাসওয়ার্ড",
      rememberMe: "আমাকে মনে রাখুন",
      forgotPassword: "পাসওয়ার্ড ভুলে গেছেন?",
      signIn: "সাইন ইন",
      noAccount: "অ্যাকাউন্ট নেই?",
      createAccountLink: "অ্যাকাউন্ট তৈরি করুন",
      dashboardGreeting: "স্বাগতম আবার!",
      dashboardReady: "আপনার ড্যাশবোর্ড প্রস্তুত।",
      dashboardNote: "কগনিটিভ স্ক্রিনিং, ব্যক্তিগত কার্যকলাপ এবং অগ্রগতি এখানে দেখা যাবে।",
      signOut: "সাইন আউট",
      footerNote: "Smriti কগনিটিভ কেয়ার কার্যক্রম ও স্ক্রিনিং সমর্থন করে। এটি চিকিৎসা নির্ণয় বা চিকিৎসার বিকল্প নয়।",
      enterName: "অনুগ্রহ করে আপনার নাম লিখুন।",
      enterAge: "অনুগ্রহ করে আপনার বয়স লিখুন।",
      selectLanguage: "অনুগ্রহ করে আপনার পছন্দের ভাষা নির্বাচন করুন।",
      selectRegion: "অনুগ্রহ করে আপনার রাজ্য বা অঞ্চল নির্বাচন করুন।",
      fillFields: "অনুগ্রহ করে হাইলাইট করা ফিল্ড পূরণ করুন।",
      noProfile: "কোনো অ্যাকাউন্ট পাওয়া যায়নি। প্রথমে একটি অ্যাকাউন্ট তৈরি করুন।",
      welcomeVoice: "স্বাগতম, {name}. আপনার মূল্যায়নে নিয়ে যাওয়া হচ্ছে।",
      voiceOn: "ভয়েস গাইডেন্স চালু হয়েছে।",
      voiceOff: "ভয়েস গাইডেন্স বন্ধ করুন",
      voiceOnLabel: "ভয়েস গাইডেন্স চালু করুন",
      loginError: "অনুগ্রহ করে ইমেইল বা ফোন নম্বর লিখুন।",
      passwordError: "অনুগ্রহ করে পাসওয়ার্ড লিখুন।",
      caregiverPhoneError: "অনুগ্রহ করে বৈধ কেয়ারগিভারের ফোন নম্বর লিখুন।",
      show: "দেখান",
      hide: "লুকান",
      linkText: "সাইন ইন",
      registerHint: "চলুন আপনার প্রোফাইল তৈরি করি।",
      fullNamePlaceholder: "আপনার পুরো নাম লিখুন",
      agePlaceholder: "আপনার বয়স লিখুন",
      emailPhonePlaceholder: "আপনার ইমেইল বা ফোন নম্বর লিখুন",
      passwordPlaceholder: "আপনার পাসওয়ার্ড লিখুন",
      caregiverNamePlaceholder: "কেয়ারগিভারের নাম লিখুন",
      caregiverPhonePlaceholder: "ফোন নম্বর লিখুন",
      selectRelationship: "সম্পর্ক নির্বাচন করুন",
      selectLanguageOption: "ভাষা নির্বাচন করুন",
      selectState: "রাজ্য নির্বাচন করুন"
    }
  };

  function t(key, replacements = {}) {
    const lang = localStorage.getItem(LANGUAGE_KEY) || "English";
    const dict = translations[lang] || translations.English;
    let value = dict[key] || translations.English[key] || key;
    Object.entries(replacements).forEach(([placeholder, replacement]) => {
      value = value.replace(`{${placeholder}}`, replacement);
    });
    return value;
  }

  function getSelectedLanguage() {
    const saved = localStorage.getItem(LANGUAGE_KEY);
    return saved && translations[saved] ? saved : "English";
  }

  function applyTranslations() {
    const lang = getSelectedLanguage();
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.dataset.i18n;
      const text = t(key);
      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
        el.placeholder = text;
      } else if (el.tagName === "BUTTON" || el.tagName === "LABEL" || el.tagName === "H1" || el.tagName === "H2" || el.tagName === "P" || el.tagName === "SPAN") {
        el.textContent = text;
      }
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      el.placeholder = t(el.dataset.i18nPlaceholder);
    });

    const langSelect = $("language");
    if (langSelect && !langSelect.value) {
      langSelect.value = lang;
    }
  }

  function setPageLanguage(lang) {
    if (!translations[lang]) return;
    localStorage.setItem(LANGUAGE_KEY, lang);
    applyTranslations();
  }

  /* ---------- helpers ---------- */
  const $ = (id) => document.getElementById(id);
  const canvas = $("captureCanvas");

  /**
   * Very lightweight, on-device "face signature": downsamples the just-
   * captured frame to a tiny grayscale grid. This is NOT real biometric
   * face recognition — it's a rough prototype match so the demo can tell
   * two captures apart. A production build would send the frame to a
   * real face-recognition service instead.
   */
  const FACE_SIG_SIZE = 20;
  function computeFaceSignature() {
    const sigCanvas = document.createElement("canvas");
    sigCanvas.width = FACE_SIG_SIZE;
    sigCanvas.height = FACE_SIG_SIZE;
    const sctx = sigCanvas.getContext("2d");
    sctx.drawImage(canvas, 0, 0, FACE_SIG_SIZE, FACE_SIG_SIZE);
    const data = sctx.getImageData(0, 0, FACE_SIG_SIZE, FACE_SIG_SIZE).data;
    const gray = [];
    for (let i = 0; i < data.length; i += 4) {
      gray.push(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
    }
    return gray;
  }

  function compareFaceSignatures(sigA, sigB) {
    if (!sigA || !sigB || sigA.length !== sigB.length) return 1;
    let sum = 0;
    for (let i = 0; i < sigA.length; i++) sum += Math.abs(sigA[i] - sigB[i]);
    return sum / sigA.length / 255; // normalized 0 (identical) .. 1 (opposite)
  }
  const FACE_MATCH_THRESHOLD = 0.18;

  function showToast(message, type) {
    const toast = $("toast");
    toast.textContent = message;
    toast.className = "toast show" + (type ? " " + type : "");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => {
      toast.classList.remove("show");
    }, 3200);
  }

  function speakMessage(text) {
    if (!voiceEnabled) return;
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.95;
    utter.pitch = 1;
    window.speechSynthesis.speak(utter);
  }

  function getFormLanguage() {
    return $("language")?.value || getSelectedLanguage();
  }

  function readProfile() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function writeProfile(profile) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      return true;
    } catch (e) {
      return false;
    }
  }

  /* =========================================================
     ACCESSIBILITY
     ========================================================= */
  function setSwitch(btn, on) {
    btn.setAttribute("aria-checked", on ? "true" : "false");
  }

  function applyAccessibilitySettings() {
    document.documentElement.style.fontSize = largeTextEnabled ? "19px" : "16px";
    document.body.classList.toggle("large-text", largeTextEnabled);
    document.body.classList.toggle("high-contrast", highContrastEnabled);

    const onIcon = document.querySelector(".icon-speaker-on");
    const offIcon = document.querySelector(".icon-speaker-off");
    const voiceBtn = $("voiceToggleBtn");
    voiceBtn.setAttribute("aria-pressed", voiceEnabled ? "true" : "false");
    voiceBtn.setAttribute("aria-label", voiceEnabled ? t("voiceOff") : t("voiceOn"));
    onIcon.style.display = voiceEnabled ? "block" : "none";
    offIcon.style.display = voiceEnabled ? "none" : "block";
    setSwitch($("toggleVoiceAssist"), voiceEnabled);
  }

  function toggleVoice() {
    voiceEnabled = !voiceEnabled;
    applyAccessibilitySettings();
    if (voiceEnabled) speakMessage("Voice guidance is on.");
  }

  $("voiceToggleBtn").addEventListener("click", toggleVoice);

  $("toggleVoiceAssist").addEventListener("click", () => {
    voiceEnabled = !voiceEnabled;
    applyAccessibilitySettings();
    if (voiceEnabled) speakMessage("Voice guidance is on.");
  });

  $("toggleLargeText").addEventListener("click", () => {
    largeTextEnabled = !largeTextEnabled;
    setSwitch($("toggleLargeText"), largeTextEnabled);
    applyAccessibilitySettings();
  });

  $("toggleHighContrast").addEventListener("click", () => {
    highContrastEnabled = !highContrastEnabled;
    setSwitch($("toggleHighContrast"), highContrastEnabled);
    applyAccessibilitySettings();
  });

  /* =========================================================
     TABS: switchAuthTab()
     ========================================================= */
  const tabRegisterBtn = $("tabRegisterBtn");
  const tabSigninBtn = $("tabSigninBtn");
  const tabsEl = document.querySelector(".tabs");
  const registerPanel = $("registerPanel");
  const signinPanel = $("signinPanel");
  const dashboardPanel = $("dashboardPanel");

  function initLanguageFromStoredPreference() {
    const stored = localStorage.getItem(LANGUAGE_KEY) || "English";
    if (translations[stored]) {
      const select = $("language");
      if (select) select.value = stored;
      setPageLanguage(stored);
    }
  }

  function switchAuthTab(target) {
    // target: "register" | "signin"
    stopCamera(regCtx);
    stopCamera(signinCtx);
    if (target === "register") renderIdle(regCtx);

    const toRegister = target === "register";
    tabRegisterBtn.setAttribute("aria-selected", toRegister ? "true" : "false");
    tabSigninBtn.setAttribute("aria-selected", !toRegister ? "true" : "false");
    tabsEl.classList.toggle("on-signin", !toRegister);

    registerPanel.classList.toggle("active", toRegister);
    signinPanel.classList.toggle("active", !toRegister);
    dashboardPanel.classList.remove("active");

    if (toRegister) {
      speakMessage(t("registerHint"));
    } else {
      speakMessage(t("welcomeBackSubtitle"));
    }
  }

  tabRegisterBtn.addEventListener("click", () => switchAuthTab("register"));
  tabSigninBtn.addEventListener("click", () => switchAuthTab("signin"));
  $("goToSigninBtn").addEventListener("click", () => switchAuthTab("signin"));
  $("goToRegisterBtn").addEventListener("click", () => switchAuthTab("register"));
  initLanguageFromStoredPreference();

  /* =========================================================
     REGISTRATION — step navigation
     ========================================================= */
  const formStep1 = $("formStep1");
  const formStep2 = $("formStep2");
  const progressStep1 = $("progressStep1");
  const progressStep2 = $("progressStep2");
  const progressLine = $("progressLine");
  const progressLabel = $("progressLabel");

  function goToStep(step) {
    formStep1.classList.toggle("active", step === 1);
    formStep2.classList.toggle("active", step === 2);
    progressStep1.classList.toggle("active", step === 1);
    progressStep1.classList.toggle("done", step === 2);
    progressStep2.classList.toggle("active", step === 2);
    progressLine.classList.toggle("done", step === 2);
    progressLabel.textContent = "Step " + step + " of 2";
    // Camera lives in step 1 — stop stream when leaving, reset widget when returning
    if (step === 2) stopCamera(regCtx);
    if (step === 1) { stopCamera(regCtx); renderIdle(regCtx); }
  }

  function setFieldError(id, message) {
    const input = $(id);
    const err = $("err-" + id);
    if (message) {
      input.classList.add("invalid");
      err.textContent = message;
    } else {
      input.classList.remove("invalid");
      err.textContent = "";
    }
  }

  $("language")?.addEventListener("change", (event) => {
    setPageLanguage(event.target.value);
  });

  function validateRegistrationStep1() {
    let valid = true;

    const fullName = $("fullName").value.trim();
    if (!fullName) {
      setFieldError("fullName", t("enterName"));
      valid = false;
    } else setFieldError("fullName", "");

    const age = $("age").value;
    if (!age || Number(age) <= 0 || Number(age) > 120) {
      setFieldError("age", t("enterAge"));
      valid = false;
    } else setFieldError("age", "");

    const language = $("language").value;
    if (!language) {
      setFieldError("language", t("selectLanguage"));
      valid = false;
    } else setFieldError("language", "");

    const stateRegion = $("stateRegion").value;
    if (!stateRegion) {
      setFieldError("stateRegion", t("selectRegion"));
      valid = false;
    } else setFieldError("stateRegion", "");

    return valid;
  }

  $("toStep2Btn").addEventListener("click", () => {
    if (validateRegistrationStep1()) {
      setPageLanguage(getFormLanguage());
      goToStep(2);
    } else {
      showToast(t("fillFields"), "error");
    }
  });

  $("backToStep1Btn").addEventListener("click", () => goToStep(1));

  /* =========================================================
     REGISTRATION — submit: registerUser()
     ========================================================= */
  function validateRegistration() {
    // Step 1 fields are the required ones per spec; caregiver phone is
    // optional but validated lightly if provided.
    const step1Valid = validateRegistrationStep1();
    const phone = $("caregiverPhone").value.trim();
    if (phone && phone.replace(/[^0-9]/g, "").length < 7) {
      setFieldError("caregiverPhone", "Please enter a valid phone number.");
      return false;
    } else {
      setFieldError("caregiverPhone", "");
    }
    return step1Valid;
  }

  function registerUser() {
    const profile = {
      fullName: $("fullName").value.trim(),
      age: $("age").value,
      language: $("language").value,
      stateRegion: $("stateRegion").value,
      accessibility: {
        voice: voiceEnabled,
        largeText: largeTextEnabled,
        highContrast: highContrastEnabled,
      },
      caregiver: {
        name: $("caregiverName").value.trim(),
        relationship: $("relationship").value,
        phone: $("caregiverPhone").value.trim(),
      },
      photo: capturedPhotoDataUrl || null,
      faceSignature: pendingFaceSignature || null,
      createdAt: new Date().toISOString(),
    };

    if (!writeProfile(profile)) {
      showToast("We couldn't save your profile on this device. Please try again.", "error");
      return;
    }

    showToast("Account created successfully!", "success");
    speakMessage("Account created successfully.");

    setTimeout(() => {
      $("registerForm").reset();
      capturedPhotoDataUrl = null;
      pendingFaceSignature = null;
      resetCameraWidget(regCtx);
      goToStep(1);
      switchAuthTab("signin");
    }, 900);
  }

  $("registerForm").addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validateRegistration()) {
      goToStep(1);
      showToast("Please fill in the highlighted fields.", "error");
      return;
    }
    registerUser();
  });

  /* =========================================================
     SIGN IN — password path: loginUser()
     ========================================================= */
  function togglePassword() {
    const input = $("loginPassword");
    const btn = $("togglePasswordBtn");
    const show = input.type === "password";
    input.type = show ? "text" : "password";
    btn.textContent = show ? t("hide") : t("show");
    btn.setAttribute("aria-label", show ? "Hide password" : "Show password");
  }
  $("togglePasswordBtn").addEventListener("click", togglePassword);

  function loginUser() {
    let valid = true;
    const loginId = $("loginId").value.trim();
    const password = $("loginPassword").value;

    if (!loginId) {
      setFieldError("loginId", t("loginError"));
      valid = false;
    } else setFieldError("loginId", "");

    if (!password) {
      setFieldError("loginPassword", t("passwordError"));
      valid = false;
    } else setFieldError("loginPassword", "");

    if (!valid) return;

    const profile = readProfile();
    if (!profile) {
      showToast(t("noProfile"), "error");
      return;
    }

    showDashboard(profile);
  }

  $("signInBtn").addEventListener("click", loginUser);
  $("forgotPasswordBtn").addEventListener("click", () => {
    showToast(t("forgotPassword"));
  });

  function showDashboard(profile) {
    // Mark the user as authenticated so the React app can verify it.
    try {
      localStorage.setItem("smriti_auth", JSON.stringify({
        authenticated: true,
        fullName: profile.fullName || "",
        loginTime: new Date().toISOString(),
      }));
    } catch (e) { /* storage unavailable — proceed anyway */ }

    const userName = profile.fullName || "friend";
    speakMessage(t("welcomeVoice", { name: userName }));

    // Send the user straight to the assessment flow after a successful login.
    setTimeout(() => {
      window.location.href = "/assessment";
    }, 600);
  }

  $("signOutBtn").addEventListener("click", () => {
    dashboardPanel.classList.remove("active");
    switchAuthTab("signin");
  });

  /* =========================================================
     CAMERA — shared controller for register + sign-in widgets
     ========================================================= */
  function buildCameraContext(prefix, mode) {
    return {
      prefix: prefix,
      mode: mode, // "photo" | "face"
      frame: document.querySelector("#" + prefix + "Camera .camera-frame"),
      video: $(prefix + "Video"),
      guide: $(prefix + "FaceGuide"),
      img: $(prefix + "CapturedImg"),
      statusIcon: $(prefix + "CameraIcon"),
      statusText: $(prefix + "CameraText"),
      statusSub: $(prefix + "CameraSub"),
      instruction: $(prefix + "CameraInstruction"),
      actions: $(prefix + "CameraActions"),
      successMsg: prefix === "reg" ? $("regPhotoSuccess") : null,
      stream: null,
    };
  }

  const regCtx = buildCameraContext("reg", "photo");
  const signinCtx = buildCameraContext("signin", "face");

  const ICONS = {
    camera: '<svg viewBox="0 0 24 24" width="30" height="30" fill="none" aria-hidden="true"><rect x="3" y="7" width="18" height="13" rx="3" stroke="currentColor" stroke-width="1.8"/><path d="M8 7l1.6-2.4A2 2 0 0 1 11.2 3.7h1.6a2 2 0 0 1 1.6.9L16 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="13.5" r="3.6" stroke="currentColor" stroke-width="1.8"/></svg>',
    cameraOff: '<svg viewBox="0 0 24 24" width="30" height="30" fill="none" aria-hidden="true"><rect x="3" y="7" width="18" height="13" rx="3" stroke="currentColor" stroke-width="1.8"/><path d="M3 3l18 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    face: '<svg viewBox="0 0 24 24" width="30" height="30" fill="none" aria-hidden="true"><circle cx="12" cy="9" r="4" stroke="currentColor" stroke-width="1.8"/><path d="M4.5 20c1.2-3.6 4.2-5.5 7.5-5.5s6.3 1.9 7.5 5.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    check: '<svg viewBox="0 0 24 24" width="30" height="30" fill="none" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  };

  function setCameraState(ctx, state) {
    ctx.frame.setAttribute("data-state", state);
  }

  function renderIdle(ctx) {
    setCameraState(ctx, "idle");
    ctx.video.style.display = "none";
    ctx.guide.style.display = "none";
    ctx.img.style.display = "none";
    ctx.instruction.style.display = "none";
    ctx.statusIcon.innerHTML = ctx.mode === "face" ? ICONS.face : ICONS.camera;
    ctx.statusText.textContent = ctx.mode === "face" ? "Look at the camera to sign in" : "Add Your Face";
    ctx.statusSub.textContent = ctx.mode === "face" ? "" : "Use your camera to securely set up face sign-in.";
    if (ctx.mode === "face") {
      ctx.actions.innerHTML = '<button type="button" class="btn-primary btn-block" id="' + ctx.prefix + 'ScanBtn">Scan My Face</button>';
      $(ctx.prefix + "ScanBtn").addEventListener("click", () => openCamera(ctx));
    } else {
      ctx.actions.innerHTML =
        '<button type="button" class="btn-primary" id="' + ctx.prefix + 'OpenCameraBtn">Open Camera</button>' +
        '<button type="button" class="link-btn" id="' + ctx.prefix + 'SkipBtn">Skip for now</button>';
      $(ctx.prefix + "OpenCameraBtn").addEventListener("click", () => openCamera(ctx));
      $(ctx.prefix + "SkipBtn").addEventListener("click", () => showToast("You can set up face sign-in later."));
    }
    if (ctx.successMsg) ctx.successMsg.style.display = "none";
  }

  function renderRequesting(ctx) {
    setCameraState(ctx, "requesting");
    ctx.statusIcon.innerHTML = ICONS.camera;
    ctx.statusText.textContent = "Requesting camera access...";
    ctx.statusSub.textContent = "";
    ctx.actions.innerHTML = "";
  }

  function renderLive(ctx) {
    setCameraState(ctx, "live");
    ctx.video.style.display = "block";
    ctx.guide.style.display = "block";
    ctx.instruction.style.display = "block";
    ctx.instruction.textContent = "Position your face inside the frame";
    const label = ctx.mode === "face" ? "Scan Face" : "Capture Face";
    ctx.actions.innerHTML = '<button type="button" class="btn-primary btn-block" id="' + ctx.prefix + 'TakeBtn">' + label + "</button>";
    $(ctx.prefix + "TakeBtn").addEventListener("click", () => capturePhoto(ctx));
  }

  function renderCaptured(ctx) {
    setCameraState(ctx, "captured");
    ctx.instruction.style.display = "none";
    ctx.actions.innerHTML =
      '<button type="button" class="btn-secondary" id="' + ctx.prefix + 'RetakeBtn">Retake</button>' +
      '<button type="button" class="btn-primary" id="' + ctx.prefix + 'UseBtn">Use Photo</button>';
    $(ctx.prefix + "RetakeBtn").addEventListener("click", () => retakePhoto(ctx));
    $(ctx.prefix + "UseBtn").addEventListener("click", () => saveProfilePhoto(ctx));
  }

  function renderScanning(ctx) {
    setCameraState(ctx, "scanning");
    ctx.instruction.style.display = "none";
    ctx.actions.innerHTML = "";
  }

  function renderDenied(ctx) {
    setCameraState(ctx, "denied");
    ctx.video.style.display = "none";
    ctx.guide.style.display = "none";
    ctx.img.style.display = "none";
    ctx.instruction.style.display = "none";
    ctx.statusIcon.innerHTML = ICONS.cameraOff;
    ctx.statusText.textContent = "Camera access was not allowed.";
    ctx.statusSub.textContent = ctx.mode === "face" ? "You can sign in with your password instead." : "You can continue registration without a profile photo.";
    renderRetryActions(ctx);
  }

  function renderUnavailable(ctx) {
    setCameraState(ctx, "unavailable");
    ctx.video.style.display = "none";
    ctx.guide.style.display = "none";
    ctx.img.style.display = "none";
    ctx.instruction.style.display = "none";
    ctx.statusIcon.innerHTML = ICONS.cameraOff;
    ctx.statusText.textContent = "We couldn't access the camera.";
    ctx.statusSub.textContent = ctx.mode === "face" ? "You can sign in with your password instead." : "You can continue registration without a profile photo.";
    renderRetryActions(ctx);
  }

  function renderRetryActions(ctx) {
    if (ctx.mode === "face") {
      ctx.actions.innerHTML =
        '<button type="button" class="btn-secondary" id="' + ctx.prefix + 'RetryBtn">Try Again</button>' +
        '<button type="button" class="btn-primary" id="' + ctx.prefix + 'PwdBtn">Sign in with Password</button>';
      $(ctx.prefix + "PwdBtn").addEventListener("click", () => {
        document.getElementById("loginId").focus();
      });
    } else {
      ctx.actions.innerHTML =
        '<button type="button" class="btn-secondary" id="' + ctx.prefix + 'RetryBtn">Try Again</button>' +
        '<button type="button" class="link-btn" id="' + ctx.prefix + 'SkipBtn">Skip for now</button>';
      $(ctx.prefix + "SkipBtn").addEventListener("click", () => showToast("You can set up face sign-in later."));
    }
    $(ctx.prefix + "RetryBtn").addEventListener("click", () => openCamera(ctx));
  }

  function renderFaceFailure(ctx) {
    setCameraState(ctx, "failure");
    ctx.statusIcon.innerHTML = ICONS.cameraOff;
    ctx.statusText.textContent = "We couldn't verify your profile.";
    ctx.statusSub.textContent = "You can try again or sign in using your password.";
    renderRetryActions(ctx);
  }

  function renderFaceNoProfile(ctx) {
    setCameraState(ctx, "failure");
    ctx.statusIcon.innerHTML = ICONS.cameraOff;
    ctx.statusText.textContent = "No profile found.";
    ctx.statusSub.textContent = "Please create an account first, or sign in with your password.";
    renderRetryActions(ctx);
  }

  function renderFaceNotRegistered(ctx) {
    setCameraState(ctx, "failure");
    ctx.statusIcon.innerHTML = ICONS.cameraOff;
    ctx.statusText.textContent = "Face Sign-In isn't set up yet.";
    ctx.statusSub.textContent = "Register your face from the Register tab, or sign in with your password.";
    renderRetryActions(ctx);
  }

  function renderFaceSuccess(ctx, name) {
    setCameraState(ctx, "success");
    ctx.statusIcon.innerHTML = ICONS.check;
    ctx.statusText.textContent = "Welcome back, " + name;
    ctx.statusSub.textContent = "";
    ctx.actions.innerHTML = '<button type="button" class="btn-primary btn-block" id="' + ctx.prefix + 'ContinueBtn">Continue</button>';
    $(ctx.prefix + "ContinueBtn").addEventListener("click", () => showDashboard(readProfile()));
  }

  function resetCameraWidget(ctx) {
    ctx.img.removeAttribute("src");
    renderIdle(ctx);
  }

  async function openCamera(ctx) {
    renderRequesting(ctx);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
      ctx.stream = stream;
      ctx.video.srcObject = stream;
      renderLive(ctx);
    } catch (err) {
      handleCameraError(ctx, err);
    }
  }

  function stopCamera(ctx) {
    if (ctx.stream) {
      ctx.stream.getTracks().forEach((track) => track.stop());
      ctx.stream = null;
    }
    if (ctx.video) {
      ctx.video.srcObject = null;
    }
  }

  function capturePhoto(ctx) {
    const video = ctx.video;
    const w = video.videoWidth || 480;
    const h = video.videoHeight || 360;
    canvas.width = w;
    canvas.height = h;
    const context2d = canvas.getContext("2d");
    // Mirror the capture to match the mirrored preview
    context2d.translate(w, 0);
    context2d.scale(-1, 1);
    context2d.drawImage(video, 0, 0, w, h);
    const dataUrl = canvas.toDataURL("image/png");
    const signature = computeFaceSignature();

    ctx.img.src = dataUrl;
    ctx.img.style.display = "block";
    ctx.video.style.display = "none";
    ctx.guide.style.display = "none";
    stopCamera(ctx);

    if (ctx.mode === "photo") {
      capturedPhotoDataUrl = dataUrl;
      pendingFaceSignature = signature;
      renderCaptured(ctx);
    } else {
      renderScanning(ctx);
      speakMessage("Checking your profile.");
      setTimeout(() => faceSignIn(ctx, dataUrl, signature), 1400);
    }
  }

  function retakePhoto(ctx) {
    ctx.img.style.display = "none";
    if (ctx.mode === "photo") {
      capturedPhotoDataUrl = null;
      pendingFaceSignature = null;
    }
    openCamera(ctx);
  }

  function saveProfilePhoto(ctx) {
    if (ctx.successMsg) {
      ctx.successMsg.style.display = "flex";
    }
    ctx.actions.innerHTML =
      '<button type="button" class="link-btn" id="' + ctx.prefix + 'ChangeBtn">Change Photo</button>';
    $(ctx.prefix + "ChangeBtn").addEventListener("click", () => retakePhoto(ctx));
    showToast("Face registered for sign-in.");
  }

  function handleCameraError(ctx, err) {
    const name = err && err.name ? err.name : "";
    if (name === "NotAllowedError" || name === "PermissionDeniedError" || name === "SecurityError") {
      renderDenied(ctx);
    } else {
      renderUnavailable(ctx);
    }
  }

  function faceSignIn(ctx, capturedDataUrl, capturedSignature) {
    const profile = readProfile();
    if (!profile) {
      renderFaceNoProfile(ctx);
      return;
    }
    if (!profile.faceSignature) {
      renderFaceNotRegistered(ctx);
      return;
    }
    // Demo matching only: compares a rough on-device signature against the
    // one saved at registration. A real implementation would send the
    // captured frame to a secure backend face-recognition service instead.
    const distance = compareFaceSignatures(capturedSignature, profile.faceSignature);
    if (distance <= FACE_MATCH_THRESHOLD) {
      renderFaceSuccess(ctx, profile.fullName || "friend");
    } else {
      renderFaceFailure(ctx);
    }
  }

  /* ---------- camera cleanup on navigation ---------- */
  window.addEventListener("beforeunload", () => {
    stopCamera(regCtx);
    stopCamera(signinCtx);
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopCamera(regCtx);
      stopCamera(signinCtx);
    }
  });

  /* =========================================================
     INIT
     ========================================================= */
  function init() {
    applyAccessibilitySettings();
    renderIdle(regCtx);
    renderIdle(signinCtx);
    switchAuthTab("register");
  }

  document.addEventListener("DOMContentLoaded", init);
})();
