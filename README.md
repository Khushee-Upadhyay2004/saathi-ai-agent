# Saathi (साथी) — Universal AI Accessibility Companion

> **"Aapki har sense, hamesha aapke saath"**  
> *AI that replaces what you can't do, so you never have to depend on someone else.*

Built for the **Razorpay Buildathon**, **Saathi (साथी)** is an all-in-one, multimodal AI accessibility agent designed to give true independence to visually impaired, hearing-impaired, and non-verbal individuals across India. 

Saathi combines computer vision, real-time audio analysis, speech recognition, speech synthesis, and seamless fintech micro-sponsorships in a single high-accessibility web application.

---

## 🌟 Key Features (Grouped by Senses)

### 👁️ 1. Dekho Mere Liye (देखें मेरे लिए — Vision Assistant)
*Designed for Blind & Low-Vision Users*

* **Real-Time Camera AI & Scene Description:** Live video stream captured via `navigator.mediaDevices.getUserMedia` and analyzed using Google Gemini 2.5 Flash Vision AI to describe surrounding rooms, people, obstacles, and general settings out loud.
* **Indian Currency Reader:** Dedicated scanning mode tuned specifically for Indian Rupee banknotes (recognizes **₹10, ₹20, ₹50, ₹100, ₹200, ₹500, and ₹2000 notes** instantly).
* **OCR Printed Text Reader:** Scans and reads document text, signs, and labels out loud.
* **Tactile Screen-Free Controls:** Full-screen giant tap targets allowing users to scan by tapping anywhere on the screen, pressing <kbd>Spacebar</kbd>, or long-pressing.
* **Audio Beep Feedback:** Web Audio API sound generator providing immediate audio cues on scan trigger and completion.
* **Demo Fail-Safe System:** 6-second `AbortController` timeout auto-recovering with realistic fail-safe responses if network connection drops during live presentations.

---

### 👂 2. Suno Mere Liye (सुनें मेरे लिए — Hearing Assistant)
*Designed for Deaf & Hard-of-Hearing Users*

* **Live Multilingual Speech Captions:** Real-time continuous speech-to-text captions supporting **20 world languages** (English, Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati, Punjabi, Urdu, Spanish, French, etc.).
* **Environmental Sound Hazard Radar:** Web Audio API frequency analyzer with rolling average noise floor logic detecting loud environmental sound spikes (*Siren, Doorbell, Horns, Knocking, Baby Cry*).
* **Visual Flash & Vibration Alerts:** High-intensity screen flash overlay and browser vibration alerts on hazard detection.
* **Quick Reply Presets:** Single-tap visual response buttons for instant two-way conversation.

---

### 🗣️ 3. Bolo Mere Liye (बोलें मेरे लिए — Speech Assistant)
*Designed for Mute & Non-Verbal Users*

* **Type-to-Speak Synthesizer:** Custom text box with adjustable speech speed slider (0.5x to 1.5x) powered by Web Speech `SpeechSynthesis`.
* **Categorized Quick Phrase Cards:** Single-tap audio cards organized into *Emergency*, *Medical*, *Needs*, and *Daily Conversation* (e.g., *"Mujhe madad chahiye"*, *"Doctor ko bulao"*, *"Paani chahiye"*).
* **AAC Sentence Builder:** Interactive symbol and word grid allowing non-verbal users to construct custom sentences on the fly.

---

### ♿ 4. Universal Accessibility Suite (WCAG 2.1 AAA Compliant)

* **High-Contrast Theme Switcher:** Standard Dark, High-Contrast Yellow (Yellow-on-Black), and High-Contrast White (White-on-Black).
* **Font Scaling:** Dynamic text scaling (Normal, Large, Extra Large).
* **Multi-Language Switcher:** Instant toggling between English (`en-US`), Hindi (`hi-IN`), and Hinglish voice narration.
* **Global Keyboard Shortcuts:**
  * <kbd>Alt + H</kbd> ➔ Home Landing Page
  * <kbd>Alt + V</kbd> ➔ Dekho Mere Liye (Blind Mode)
  * <kbd>Alt + A</kbd> ➔ Suno Mere Liye (Deaf Mode)
  * <kbd>Alt + B</kbd> ➔ Bolo Mere Liye (Mute Mode)
  * <kbd>Alt + C</kbd> ➔ Toggle High Contrast
  * <kbd>Alt + S</kbd> ➔ Mute / Unmute Voice Narrator
  * <kbd>Alt + K</kbd> ➔ View Keyboard Shortcuts Guide
  * <kbd>Alt + P</kbd> ➔ Sponsor a User Modal
* **Screen Reader Live Region:** Dynamic `aria-live="assertive"` region ensuring announcements are vocalized by screen readers.

---

## 💳 Razorpay Micro-Sponsorship Integration

Built specifically for the **Razorpay Buildathon**, Saathi includes a complete micro-sponsorship flow (**"Sponsor a Saathi User"**):

* **Fintech Micro-Donations:** Enables supporters to contribute micro-amounts (**₹100 / ₹250 / ₹500**) to directly fund AI vision and speech processing for underprivileged users in India.
* **Razorpay Checkout SDK Integration:** Powered by `https://checkout.razorpay.com/v1/checkout.js` using Razorpay Test Mode keys (`rzp_test_1DP5mmOlF5G5ag`).
* **Bypassed Detail Entry:** Pre-filled user parameters (`name: 'Test', email: 'test@example.com', contact: '9999999999'`) to jump directly to UPI and Card payment methods during demos.
* **Celebratory Receipt & Confetti:** Triggers `canvas-confetti` fireworks, voice thank-you narration, and an itemized receipt with a copyable `razorpay_payment_id`.

---

## 🛠️ Tech Stack & Integrations

| Layer | Technology / API | Purpose |
| :--- | :--- | :--- |
| **Core Framework** | React 18, Vite 6 | Fast modular UI development & HMR |
| **Styling** | Tailwind CSS v4 | Dark-mode glassmorphism & accessible UI system |
| **Vision AI** | Google Gemini 2.5 Flash API (`gemini-2.5-flash:generateContent`) | Multimodal image description, OCR & currency detection |
| **Fintech SDK** | Razorpay Checkout SDK | Micro-sponsorships & payment checkout flow |
| **Speech Recognition** | Web Speech API (`SpeechRecognition`) | Continuous speech-to-text live captioning |
| **Speech Synthesis** | Web Speech API (`SpeechSynthesis`) | Screen narrator & TTS voice output |
| **Audio Processing** | Web Audio API (`AudioContext`, `AnalyserNode`, `OscillatorNode`) | Sound spike detection & tactile beep feedback |
| **UI Components** | Lucide React Icons, Canvas Confetti | Accessible icons & celebratory animations |

---

## 📂 Codebase Structure

```
saathi-app/
├── index.html                    # Root HTML file with Razorpay Checkout SDK & Google Fonts
├── package.json                  # Dependencies (React 18, Vite, Tailwind v4, Lucide, Confetti)
├── vite.config.js                # Vite build configuration
├── .env                          # Environment variables (Gemini API Key & Razorpay Key)
├── .env.example                  # Environment template file
└── src/
    ├── main.jsx                  # React application entry point
    ├── index.css                 # Global CSS & Tailwind CSS tokens
    ├── App.jsx                   # Central Router, Voice Synthesis Engine & Keyboard Listener
    └── components/
        ├── LandingPage.jsx       # Main landing page, Hero section, & Impact stats
        ├── DekhoMereLiye.jsx     # Blind assistant (Camera AI, OCR, Currency Reader)
        ├── SunoMereLiye.jsx      # Deaf assistant (Speech-to-Text & Sound Hazard Radar)
        ├── BoloMereLiye.jsx      # Mute assistant (Type-to-Speak & AAC Builder)
        ├── AccessibilityToolbar.jsx # High contrast, text scaler, language & narrator toolbar
        ├── SponsorModal.jsx      # Razorpay micro-sponsorship checkout modal & receipt
        ├── KeyboardShortcutsModal.jsx # Accessibility keyboard shortcuts dialog
        ├── PermissionModal.jsx   # Camera & Microphone permission handler
        ├── SplashScreen.jsx      # Animated welcome screen
        └── ErrorBoundary.jsx     # React error boundary component
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** (v18.0.0 or higher)
* **npm** (v9.0.0 or higher)
* A valid **Google Gemini API Key** (from [Google AI Studio](https://aistudio.google.com/))

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Khushee-Upadhyay2004/saathi-ai-agent.git
   cd saathi-ai-agent/scratch/saathi-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   VITE_RAZORPAY_KEY_ID=rzp_test_1DP5mmOlF5G5ag
   ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

5. **Build for Production:**
   ```bash
   npm run build
   ```

6. **Preview Production Build:**
   ```bash
   npm run preview
   ```

---

## 📜 Compliance & Accessibility Standards

* **WCAG 2.1 AAA Compliant:** Formatted contrast ratios, touch targets ($\ge 44\text{px}$), ARIA live regions, and full keyboard navigation.
* **Privacy First:** Video and audio streams are processed locally in real-time and never saved or stored.

---

## 🏆 Razorpay Buildathon Submission

Developed with ❤️ for the **Razorpay Buildathon** to demonstrate how AI and Fintech can converge to empower millions of people with disabilities.
