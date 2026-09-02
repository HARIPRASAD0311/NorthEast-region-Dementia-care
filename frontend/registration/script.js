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
  let voiceEnabled = false;
  let largeTextEnabled = false;
  let highContrastEnabled = false;
  let capturedPhotoDataUrl = null; // pending photo captured during registration
  let pendingFaceSignature = null; // pending face signature captured during registration

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
    voiceBtn.setAttribute("aria-label", voiceEnabled ? "Turn off voice guidance" : "Turn on voice guidance");
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
      speakMessage("Let's create your profile.");
    } else {
      speakMessage("Welcome back. You can sign in using face scan or your password.");
    }
  }

  tabRegisterBtn.addEventListener("click", () => switchAuthTab("register"));
  tabSigninBtn.addEventListener("click", () => switchAuthTab("signin"));
  $("goToSigninBtn").addEventListener("click", () => switchAuthTab("signin"));
  $("goToRegisterBtn").addEventListener("click", () => switchAuthTab("register"));

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

  function validateRegistrationStep1() {
    let valid = true;

    const fullName = $("fullName").value.trim();
    if (!fullName) {
      setFieldError("fullName", "Please enter your name.");
      valid = false;
    } else setFieldError("fullName", "");

    const age = $("age").value;
    if (!age || Number(age) <= 0 || Number(age) > 120) {
      setFieldError("age", "Please enter your age.");
      valid = false;
    } else setFieldError("age", "");

    const language = $("language").value;
    if (!language) {
      setFieldError("language", "Please select your preferred language.");
      valid = false;
    } else setFieldError("language", "");

    const stateRegion = $("stateRegion").value;
    if (!stateRegion) {
      setFieldError("stateRegion", "Please select your state or region.");
      valid = false;
    } else setFieldError("stateRegion", "");

    return valid;
  }

  $("toStep2Btn").addEventListener("click", () => {
    if (validateRegistrationStep1()) {
      goToStep(2);
    } else {
      showToast("Please fill in the highlighted fields.", "error");
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
    btn.textContent = show ? "Hide" : "Show";
    btn.setAttribute("aria-label", show ? "Hide password" : "Show password");
  }
  $("togglePasswordBtn").addEventListener("click", togglePassword);

  function loginUser() {
    let valid = true;
    const loginId = $("loginId").value.trim();
    const password = $("loginPassword").value;

    if (!loginId) {
      setFieldError("loginId", "Please enter your email or phone number.");
      valid = false;
    } else setFieldError("loginId", "");

    if (!password) {
      setFieldError("loginPassword", "Please enter your password.");
      valid = false;
    } else setFieldError("loginPassword", "");

    if (!valid) return;

    const profile = readProfile();
    if (!profile) {
      showToast("No account found. Please create an account first.", "error");
      return;
    }

    showDashboard(profile);
  }

  $("signInBtn").addEventListener("click", loginUser);
  $("forgotPasswordBtn").addEventListener("click", () => {
    showToast("Please contact your caregiver or clinic to reset your password.");
  });

  function showDashboard(profile) {
    registerPanel.classList.remove("active");
    signinPanel.classList.remove("active");
    dashboardPanel.classList.add("active");
    $("dashboardGreeting").textContent = "Welcome back, " + (profile.fullName || "friend") + "!";
    speakMessage("Welcome back, " + (profile.fullName || "friend") + ". Your dashboard is ready.");
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
