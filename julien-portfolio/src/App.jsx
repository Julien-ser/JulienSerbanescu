import React, { useState, useEffect, useRef } from 'react';
import { heroTimeline, fadeUpBlur, parallaxTilt, breathingGlow } from './motion.js';
import './react-styles.css';

// Import images from assets
import profileImage from './assets/Untitled.png';
import heroImage from './assets/Untitled.png';
import guelphLogo from './assets/guelp.png';
import cySciLogo from './assets/cybersci.png';
import coOperatorsLogo from './assets/cooperators.png';
import athenaGuardLogo from './assets/aguard.jpg';
import radarImage from './assets/radar.png';
import ganImage from './assets/gan.png';
import jarvImage from './assets/jarv.jpg';
import jusImage from './assets/jus.png';
import roboticsImage from './assets/robotics.png';
import AKOImage from './assets/ako.png';
import resqImage from './assets/resq.png';
import suaveImage from './assets/squave.png';
import resumeworthyImage from './assets/resumeworthy.png';

// App definitions (each section becomes an app)
const APPS = {
  about: {
    id: 'about',
    title: 'About Me',
    icon: '👤',
    component: 'AboutApp',
  },
  experience: {
    id: 'experience',
    title: 'Experience',
    icon: '💼',
    component: 'ExperienceApp',
  },
  research: {
    id: 'research',
    title: 'Research',
    icon: '🔬',
    component: 'ResearchApp',
  },
  projects: {
    id: 'projects',
    title: 'Projects',
    icon: '📁',
    component: 'ProjectsApp',
  },
  robots: {
    id: 'robots',
    title: 'Robots & Gadgets',
    icon: '🤖',
    component: 'RobotsApp',
  },
  competitions: {
    id: 'competitions',
    title: 'Competitions',
    icon: '🏆',
    component: 'CompetitionsApp',
  },
  organizations: {
    id: 'organizations',
    title: 'Organizations',
    icon: '👥',
    component: 'OrgsApp',
  },
  certificates: {
    id: 'certificates',
    title: 'Certificates',
    icon: '🎓',
    component: 'CertsApp',
  },
  contact: {
    id: 'contact',
    title: 'Contact',
    icon: '📬',
    component: 'ContactApp',
  },
  terminal: {
    id: 'terminal',
    title: 'Terminal',
    icon: '⌨️',
    component: 'TerminalApp',
  },
};

function App() {
  const [openWindows, setOpenWindows] = useState([]);
  const [zIndexCounter, setZIndexCounter] = useState(1000);
  const [terminalHistory, setTerminalHistory] = useState([
    { type: 'output', text: 'Welcome to JulienOS. Type "help" for commands.' },
  ]);
  const [terminalInput, setTerminalInput] = useState('');
  const [dragging, setDragging] = useState(null); // { winId, offsetX, offsetY }
  const [resizing, setResizing] = useState(null); // { winId, startX, startY, startW, startH }
  const terminalRef = useRef(null);
  const googleScholarUrl = 'https://scholar.google.ca/citations?hl=en&user=mnpXcUwAAAAJ';
  const apiUrl = 'https://dajulster-julienserbanescu-rag.hf.space/api/query';

  // Data arrays (preserved verbatim)
  const projects = [
    {
      id: 'resume-worthy',
      title: 'ResumeWorthy',
      image: resumeworthyImage,
      alt: 'ResumeWorthy',
      summary: 'AI-powered platform to find jobs, tailor resumes/cover letters, and discover recruiters using Agents and LangChain.',
      description:
        'ResumeWorthy is a comprehensive job search and career advancement platform powered by AI Agents and LangChain. It enables users to discover job opportunities, generate customized resumes and cover letters, and connect with recruiters. The platform leverages intelligent agents to streamline the entire job application process.',
      href: 'https://github.com/Julien-ser/ResumeWorthy',
      demoUrl: 'https://resume-worthy.vercel.app/'
    },
    {
      id: 'ako-agentic-kernel-optimization',
      title: 'AKO: Agentic Kernel Optimization',
      image: AKOImage,
      alt: 'AKO Agentic Kernel Optimization',
      summary: 'Built an agentic system for kernel-level optimization workflows.',
      description:
        'AKO explores agent-driven optimization pipelines targeting kernel-level decisions, combining automation and iterative reasoning to improve execution performance.',
      href: 'https://github.com/Julien-ser/AKO-Agentic-Kernel-Optimization'
    },
    {
      id: 'suaveai-detection-model',
      title: 'SuaveAI Detection Multitask Model V1',
      image: suaveImage,
      alt: 'SuaveAI Detection Multitask Model V1',
      summary: 'Published a multitask detection model on Hugging Face Hub.',
      description:
        'SuaveAI Detection Multitask Model V1 is a published Hugging Face model focused on multitask detection workflows, with a deployable checkpoint and model documentation.',
      href: 'https://huggingface.co/DaJulster/SuaveAI-Dectection-Multitask-Model-V1'
    },
    {
      id: 'abb-irb-120',
      title: 'ABB IRB-120 Robotics Motion Analysis',
      image: roboticsImage,
      alt: 'ABB IRB-120 Robotics Motion Analysis',
      summary: 'Analyzed and modeled robot-arm motion patterns for ABB IRB-120 systems.',
      description:
        'A robotics motion analysis project focused on ABB IRB-120 behavior, movement trajectories, and performance characteristics to better understand and optimize robot control workflows.',
      href: 'https://github.com/Julien-ser/ABB-IRB-120-Robotics-motion-analysis'
    },
    {
      id: 'resq-ai-agentic-dispatcher',
      title: 'ResQ-AI Agentic Dispatcher',
      image: resqImage,
      alt: 'ResQ-AI Agentic Dispatcher',
      summary: 'Designed an agentic dispatcher for intelligent coordination and routing.',
      description:
        'ResQ-AI is an agentic dispatching project focused on coordinating tasks and responses through AI-driven decision logic for faster and more reliable operational flow.',
      href: 'https://github.com/Julien-ser/ResQ-AI_AgenticDispatcher'
    },
    {
      id: 'clinical-reasoning',
      title: 'Clinical Reasoning Model Benchmarking and Fine-Tuning',
      image: radarImage,
      alt: 'Clinical Reasoning Model',
      summary: 'Benchmarked and fine-tuned clinical NLP models for medical QA tasks.',
      description:
        'Developed and benchmarked clinical reasoning models for medical QA tasks, including dataset curation, evaluation, and fine-tuning of transformer-based architectures. Explored robustness, factuality, and reasoning capabilities in clinical NLP.',
      href: 'https://github.com/Julien-ser/Clinical-Reasoning-Model-Benchmarking-and-Fine-Tuning'
    },
    {
      id: 'gan-jerseys',
      title: 'GAN to Generate Soccer Jerseys',
      image: ganImage,
      alt: 'GAN Soccer Jerseys',
      summary: 'Built a PyTorch GAN to generate synthetic soccer jersey designs.',
      description:
        'Developed a Generative Adversarial Network (GAN) to create soccer jersey designs. Constructed generator and discriminator networks with PyTorch, using a custom dataset obtained by web scraping images of soccer jerseys. Implemented key model layers including Conv2D, Conv2DTranspose, along with tanh and sigmoid activations.',
      href: 'https://www.kaggle.com/code/julienserbanescu/pytorch-test'
    },
    {
      id: 'jarvis-ai',
      title: 'Jarvis AI For the Toronto Tech Expo',
      image: jarvImage,
      alt: 'Jarvis AI Tech Expo',
      summary: 'Led development of a voice-enabled assistant showcased at IBM TTE.',
      description:
        'Lead a team to create an AI assistant similar to Jarvis from Iron Man. Using technology such as a 3rd party openAI api to answer general questions. Implementation of SpeechRecognition libraries in Python(likely Google\'s speech recognition library). Automation of processes such as application opening, online search. etc. Showcased and presented to the IBM Toronto Tech Expo (TTE)',
      href: 'https://github.com/Julien-ser/Jarvis-ai-TTE'
    },
    {
      id: 'orange-juice-dispenser',
      title: 'Orange Juice Dispenser',
      image: jusImage,
      alt: 'Orange Juice Dispenser',
      summary: 'Built an ESP8266-controlled smart dispenser triggered by text input.',
      description:
        'Created a device that would activate a pump via the ESP8266, dispensing water into a glass with OJ powder, activating whenever orange was typed in. Selenium to communicate and interact with ESP8266 web server to send the command to activate the pump. Usage of a relay and motorized pump in my ESP8266 circuit, usage of C++ for programming the ESP webpage and pump activation.',
      href: 'https://drive.google.com/file/d/1uF_2dDhc9ZC9fWEBjcScDP96S59U_V4C/view?usp=sharing'
    }
  ];
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0].id);
  const selectedProject = projects.find((project) => project.id === selectedProjectId) || projects[0];

  const robotVideos = [
    {
      id: 'x-status-2026306411378962805',
      title: 'RFID Scanner Encryption',
      description: 'Clip from X.',
      provider: 'x',
      embedUrl: 'https://platform.twitter.com/embed/Tweet.html?id=2026306411378962805',
      sourceUrl: 'https://x.com/i/status/2026306411378962805'
    },
    {
      id: 'x-status-2026306727935676634',
      title: 'ESP Wearable live bus monitoring',
      description: 'Clip from X.',
      provider: 'x',
      embedUrl: 'https://platform.twitter.com/embed/Tweet.html?id=2026306727935676634',
      sourceUrl: 'https://x.com/i/status/2026306727935676634'
    },
    {
      id: 'x-status-2026307503022109164',
      title: 'Robotic Phone Blocker',
      description: 'Clip from X.',
      provider: 'x',
      embedUrl: 'https://platform.twitter.com/embed/Tweet.html?id=2026307503022109164',
      sourceUrl: 'https://x.com/i/status/2026307503022109164'
    },
    {
      id: 'x-status-2027018004160991270',
      title: '4WD Mecanum Robot With Personality',
      description: 'Clip from X.',
      provider: 'x',
      embedUrl: 'https://platform.twitter.com/embed/Tweet.html?id=2027018004160991270',
      sourceUrl: 'https://x.com/i/status/2027018004160991270'
    },
    {
      id: 'robotics-drive-demo',
      title: 'Transforming Remote Controlled ESP32 Robot',
      description: 'Clip from Google Drive.',
      embedUrl: 'https://drive.google.com/file/d/14VT9dYURoKVtWJtiwtv4SivmbhJS0I4Y/preview',
      sourceUrl: 'https://drive.google.com/file/d/14VT9dYURoKVtWJtiwtv4SivmbhJS0I4Y/view?usp=sharing'
    },
    {
      id: 'x-status-demo',
      title: 'Robotic Weapon',
      description: 'Clip from X.',
      provider: 'x',
      embedUrl: 'https://platform.twitter.com/embed/Tweet.html?id=1908004346043715673',
      sourceUrl: 'https://x.com/i/status/1908004346043715673'
    },
    {
      id: 'drive-demo-2',
      title: 'Transforming Web-Controlled ESP32 Robot',
      description: 'Clip from Google Drive.',
      embedUrl: 'https://drive.google.com/file/d/1aOHEPNl7Mv8j02Qbf2r2c0NeIjK7jQhv/preview',
      sourceUrl: 'https://drive.google.com/file/d/1aOHEPNl7Mv8j02Qbf2r2c0NeIjK7jQhv/view?usp=sharing'
    },
    {
      id: 'drive-demo-3',
      title: 'Arduino Robot with Movement and Personality',
      description: 'Clip from Google Drive.',
      embedUrl: 'https://drive.google.com/file/d/1w_u6A3DBWKDnzZgh6Zbgkb0nAsM1sGKQ/preview',
      sourceUrl: 'https://drive.google.com/file/d/1w_u6A3DBWKDnzZgh6Zbgkb0nAsM1sGKQ/view?usp=sharing'
    }
  ];
  const [activeRobotVideoIndex, setActiveRobotVideoIndex] = useState(0);
  const activeRobotVideo = robotVideos[activeRobotVideoIndex];

  // Window management: open/focus a window
  const openWindow = (appId) => {
    setOpenWindows((prev) => {
      const exists = prev.find((w) => w.id === appId);
      if (exists) {
        return prev.map((w) => (w.id === appId ? { ...w, zIndex: zIndexCounter + 1 } : w));
      } else {
        const newWin = {
          id: appId,
          title: APPS[appId].title,
          x: leeway(prev.length),
          y: leeway(prev.length),
          width: 740,
          height: 580,
          zIndex: zIndexCounter + 1,
          minimized: false,
        };
        return [...prev, newWin];
      }
    });
    setZIndexCounter((c) => c + 1);
  };

  const leeway = (count) => 40 + (count * 20);

  const closeWindow = (appId) => {
    setOpenWindows((prev) => prev.filter((w) => w.id !== appId));
  };

  const bringToFront = (appId) => {
    setZIndexCounter((c) => c + 1);
    setOpenWindows((prev) =>
      prev.map((w) => (w.id === appId ? { ...w, zIndex: zIndexCounter + 1 } : w))
    );
  };

  // Dragging handlers
  const startDrag = (winId, e) => {
    const win = openWindows.find((w) => w.id === winId);
    if (!win) return;
    bringToFront(winId);
    setDragging({
      winId,
      offsetX: e.clientX - win.x,
      offsetY: e.clientY - win.y,
    });
  };

  useEffect(() => {
    if (!dragging) return;
    const onMouseMove = (e) => {
      setOpenWindows((prev) =>
        prev.map((w) =>
          w.id === dragging.winId
            ? { ...w, x: e.clientX - dragging.offsetX, y: e.clientY - dragging.offsetY }
            : w
        )
      );
    };
    const onMouseUp = () => setDragging(null);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [dragging]);

  const startResize = (winId, e) => {
    const win = openWindows.find((w) => w.id === winId);
    if (!win || win.maximized) return;
    e.stopPropagation();
    setResizing({
      winId,
      startX: e.clientX,
      startY: e.clientY,
      startW: win.width,
      startH: win.height,
    });
  };

  useEffect(() => {
    if (!resizing) return;
    const onMouseMove = (e) => {
      const dx = e.clientX - resizing.startX;
      const dy = e.clientY - resizing.startY;
      setOpenWindows((prev) =>
        prev.map((w) => {
          if (w.id !== resizing.winId) return w;
          const newW = Math.max(380, resizing.startW + dx);
          const newH = Math.max(300, resizing.startH + dy);
          return { ...w, width: newW, height: newH };
        })
      );
    };
    const onMouseUp = () => setResizing(null);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [resizing]);

  // Terminal commands
  const handleTerminalSubmit = async (e) => {
    e.preventDefault();
    const cmd = terminalInput.trim();
    if (!cmd) return;
    setTerminalHistory((h) => [...h, { type: 'input', text: cmd }]);
    setTerminalInput('');
    const lower = cmd.toLowerCase();
    if (lower === 'help') {
      setTerminalHistory((h) => [
        ...h,
        {
          type: 'output',
          text:
            'Commands:\n' +
            '  open <app>   - open an app window (home, about, experience, research, projects, robots, competitions, organizations, certificates, contact)\n' +
            '  close <app>  - close a window\n' +
            '  list         - list open windows\n' +
            '  clear        - clear terminal\n' +
            '  ask <query>  - ask RAG a question\n' +
            '  help         - show this message',
        },
      ]);
    } else if (lower === 'clear') {
      setTerminalHistory([]);
    } else if (lower === 'list') {
      const names = openWindows.map((w) => w.title).join(', ') || '(none)';
      setTerminalHistory((h) => [...h, { type: 'output', text: `Open windows: ${names}` }]);
    } else if (lower.startsWith('open ')) {
      const app = lower.slice(5);
      if (APPS[app]) {
        openWindow(app);
        setTerminalHistory((h) => [...h, { type: 'output', text: `Opening ${APPS[app].title}...` }]);
      } else {
        setTerminalHistory((h) => [...h, { type: 'output', text: `Unknown app: ${app}` }]);
      }
    } else if (lower.startsWith('close ')) {
      const app = lower.slice(6);
      if (APPS[app]) {
        closeWindow(app);
        setTerminalHistory((h) => [...h, { type: 'output', text: `Closed ${APPS[app].title}` }]);
      } else {
        setTerminalHistory((h) => [...h, { type: 'output', text: `Unknown app: ${app}` }]);
      }
    } else if (lower.startsWith('ask ')) {
      const query = cmd.slice(4);
      setTerminalHistory((h) => [...h, { type: 'output', text: `Querying RAG: "${query}"...` }]);
      try {
        const res = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setTerminalHistory((h) => [...h, { type: 'output', text: data.response || 'No response.' }]);
        if (data.sources?.length) {
          setTerminalHistory((h) => [
            ...h,
            {
              type: 'output',
              text: `Sources: ${data.sources.map((s) => `#${s.id}`).join(', ')}`,
            },
          ]);
        }
      } catch (err) {
        setTerminalHistory((h) => [...h, { type: 'output', text: `Error: ${err.message}` }]);
      }
    } else {
      setTerminalHistory((h) => [...h, { type: 'output', text: `Unknown command. Type "help".` }]);
    }
  };

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalHistory]);

  // Render content per app
  const renderAppContent = (appId) => {
    switch (appId) {
      case 'about':
        return <AboutApp />;
      case 'experience':
        return <ExperienceApp coOperatorsLogo={coOperatorsLogo} cySciLogo={cySciLogo} guelphLogo={guelphLogo} athenaGuardLogo={athenaGuardLogo} />;
      case 'research':
        return <ResearchApp />;
      case 'projects':
        return (
          <ProjectsApp
            projects={projects}
            selectedProjectId={selectedProjectId}
            setSelectedProjectId={setSelectedProjectId}
          />
        );
      case 'robots':
        return (
          <RobotsApp
            robotVideos={robotVideos}
            activeRobotVideoIndex={activeRobotVideoIndex}
            setActiveRobotVideoIndex={setActiveRobotVideoIndex}
          />
        );
      case 'competitions':
        return <CompetitionsApp />;
      case 'organizations':
        return <OrgsApp />;
      case 'certificates':
        return <CertsApp />;
      case 'contact':
        return <ContactApp />;
      case 'terminal':
        return (
          <div className="terminal-window">
            <div className="terminal-header">Terminal — JulienOS</div>
            <div className="terminal-body" ref={terminalRef}>
              {terminalHistory.map((line, i) => (
                <div key={i} className={line.type === 'input' ? 'term-input' : 'term-output'}>
                  {line.type === 'input' ? (
                    <span>
                      <span className="prompt">julien@portfolio:~$</span> {line.text}
                    </span>
                  ) : (
                    <pre>{line.text}</pre>
                  )}
                </div>
              ))}
            </div>
            <form className="terminal-input-line" onSubmit={handleTerminalSubmit}>
              <span className="prompt">julien@portfolio:~$</span>
              <input
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                autoFocus
                spellCheck={false}
              />
            </form>
          </div>
        );
      default:
        return <div>App not found</div>;
    }
  };

  return (
    <div className="desktop-ui">
      {/* Desktop background */}
      <div className="desktop-bg"></div>
      {/* Home layer (behind windows, above background) */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'auto', pointerEvents: 'none' }}>
        <HomeApp avatarIdle={profileImage} avatarLoading={profileImage} heroImage={heroImage} />
      </div>

      {/* Dock */}
      <div className="dock">
        {Object.values(APPS).map((app) => (
          <div
            key={app.id}
            className="dock-item"
            onClick={() => openWindow(app.id)}
            title={app.title}
          >
            <span className="dock-icon">{app.icon}</span>
          </div>
        ))}
      </div>

      {/* Windows */}
      {openWindows
        .sort((a, b) => a.zIndex - b.zIndex)
        .map((win) => (
          <div
            key={win.id}
            className={`window ${win.minimized ? 'minimized' : ''}`}
            style={{
              left: win.x,
              top: win.y,
              width: win.width,
              height: win.height,
              zIndex: win.zIndex,
              position: 'absolute',
            }}
            onClick={() => bringToFront(win.id)}
          >
            <div className="window-titlebar" onMouseDown={(e) => startDrag(win.id, e)}>
              <span className="window-title">{win.title}</span>
              <div className="window-controls">
                <button className="win-btn close" onClick={() => closeWindow(win.id)} onMouseDown={(e) => e.stopPropagation()}>×</button>
              </div>
            </div>
            <div className="window-content">{renderAppContent(win.id)}</div>
            <div className="resize-handle" onMouseDown={(e) => startResize(win.id, e)}></div>
          </div>
        ))}

    </div>
  );
}

// ===================== Sub-app components ====================

function HomeApp({ heroImage }) {
  return (
    <div className="home-app">
      <div className="hero-container">
        <div className="hero-text">
          <h1 className="hero-title">Julien Serbanescu</h1>
          <p className="hero-subtitle">Building production AI systems, resilient cloud infrastructure, and intelligent robotics.</p>
          <p className="typer">Computer Engineering & Entrepreneurship</p>
          <p className="typer">AI Engineer | Cloud & Cybersecurity | Robotics</p>

          <p className="hero-description">
            Two-time NSERC USRA recipient, published researcher (SIGIR-AP, CIKM), and Cloud Engineer at Co-Operators.
            I focus on reliable systems that move from research prototypes to real-world deployment.
          </p>

          <div className="tech-badges">
            <a href="#research" className="tech-badge">AI/ML</a>
            <a href="#experience" className="tech-badge">Cloud Engineering</a>
            <a href="#organizations" className="tech-badge">Robotics</a>
            <a href="#research" className="tech-badge">Research</a>
          </div>

          <div className="hero-metrics">
            <div className="hero-metric">
              <span className="hero-metric-value">3</span>
              <span className="hero-metric-label">Conference Papers</span>
            </div>
            <div className="hero-metric">
              <span className="hero-metric-value">2x</span>
              <span className="hero-metric-label">NSERC USRA</span>
            </div>
            <div className="hero-metric">
              <span className="hero-metric-value">3.94</span>
              <span className="hero-metric-label">University GPA</span>
            </div>
          </div>

          <div className="hero-links">
            <a href="https://www.linkedin.com/in/julien-serbanescu-6ba52a241/" target="_blank" rel="noopener noreferrer" className="hero-link-btn">LinkedIn</a>
            <a href="https://github.com/Julien-ser" target="_blank" rel="noopener noreferrer" className="hero-link-btn">GitHub</a>
            <a href="https://scholar.google.com/citations?user=mnpXcUwAAAAJ&hl=en" target="_blank" rel="noopener noreferrer" className="hero-link-btn">Scholar</a>
          </div>
        </div>
        <div className="profile-container">
          <a href="https://www.linkedin.com/in/julien-serbanescu-6ba52a241/" target="_blank" rel="noopener noreferrer" className="profile-link">
            <img src={heroImage} alt="Julien Serbanescu" className="profile-image" />
            <div className="profile-glow"></div>
          </a>
        </div>
      </div>
    </div>
  );
}

function AboutApp() {
  return (
    <div className="about-app">
      <h2 className="section-title">About Me</h2>
      <div className="section-divider"></div>
      <div className="about-text">
        <p className="par">
          I'm Julien Serbanescu, a Computer Engineering student at the University of Guelph with co-op, minoring in Entrepreneurship. My expertise spans artificial intelligence, cloud infrastructure, cybersecurity, and cutting-edge research. I build systems that combine deep technical innovation with measurable real-world impact.
        </p>
        <p className="par">
          As a two-time NSERC USRA recipient, I've conducted research on robust multi-hop question answering with retrieval-augmented LLMs and adversarial robustness in LLMs and CNNs. I co-developed Latent Twin Retrieval (LTR) for evaluating misinformation resilience in QA systems, and built RL-based defenses for LLM jailbreak detection and mitigation.
        </p>
        <p className="par">
          Professionally, I serve as Cloud Engineer and Administrator at Co-Operators, where I optimize Azure infrastructure, automate workflows, and drive compliance initiatives. Previously, I co-founded AthenaGuard, a cybersecurity startup where I architected phishing detection systems using GradientBoost models and built full-stack applications. I also lead the Guelph AI Club and the software subteam of the university's Robotics team, mentoring the next generation of engineers.
        </p>
      </div>
    </div>
  );
}

function ExperienceApp({ coOperatorsLogo, cySciLogo, guelphLogo, athenaGuardLogo }) {
  return (
    <div className="experience-app">
      <h2 className="section-title">Experience</h2>
      <div className="section-divider"></div>

      <div className="experience-item">
        <h3 className="job-title">Cloud Engineer and Administrator</h3>
        <img src={coOperatorsLogo} alt="Co-operators Logo" className="image" />
        <p className="job-date">
          <span className="date-range">Jan 2026 - Present</span>
          <span className="location">Co-Operators, Guelph, ON</span>
        </p>
        <p className="job-description">Leading cloud infrastructure optimization and automation initiatives at one of Canada's largest insurance and financial services cooperatives, driving operational excellence and compliance improvements.</p>
        <ul className="job-highlights">
          <li>Optimized alerting infrastructure for internal monitoring of Azure pay-as-you-go disk storage across <strong>209 file share instances</strong> using Azure PowerShell modules, improving system observability and reducing operational overhead.</li>
          <li>Recognized for <strong>"Execute with accountability"</strong> by leading the identification and removal of <strong>233 unused service accounts (16.1% reduction)</strong> from Azure Active Directory, advancing IGA/PAM compliance initiatives using PowerShell with custom Azure portal packages.</li>
          <li>Developed a Python automation system for Jira and Confluence using <strong>FastAPI</strong>, <strong>Jinja2</strong>, and Jira API, applying bulk changes to <strong>10+ projects</strong> and adding custom fields to <strong>30+ screens</strong>, significantly reducing manual configuration time.</li>
          <li>Upgraded production <strong>PostgreSQL databases from v13 to v16</strong> using <strong>Terraform (IaC)</strong> across Azure infrastructure, validating deployments against JFrog Artifactory instances hosted on both Azure and AWS.</li>
        </ul>
      </div>

      <div className="experience-item">
        <h3 className="job-title">Cyber Science Lab Research Assistant</h3>
        <img src={cySciLogo} alt="University of Guelph Logo" className="image" />
        <p className="job-date">
          <span className="date-range">May 2025 - Present</span>
          <span className="location">University of Guelph, Guelph, ON</span>
        </p>
        <p className="job-description">At the Cyber Science Lab, I develop cutting-edge adversarial robustness strategies for language and vision models, and pioneer reinforcement learning techniques to mitigate LLM jailbreak attacks.</p>
        <ul className="job-highlights">
          <li>Implemented baseline and inference pipelines for psychologically inspired LLM jailbreak methods, achieving up to <strong>97% attack success rate</strong> and reducing model <strong>perplexity to 23.6</strong> across multiple LLMs.</li>
          <li><a href="https://github.com/CyberScienceLab/Julien-Reinforcement-Learning-for-Real-Time-Jailbreak-Recovery-" target="_blank" rel="noopener noreferrer" className="subtle-link">Developed a real-time, adaptive RL-based defense system</a> against LLM jailbreaks using <strong>Gymnasium</strong> and <strong>Stable Baselines3</strong>, achieving a <strong>96% true positive rate</strong> on malicious prompt detection, with only a <strong>39%</strong> false positive rate. Deployed the trained policy via <strong>ONNX</strong> on <strong>FastAPI</strong> for lightweight, low-latency inference. Developed auto-patching layer using <strong>SentenceTransformers embeddings</strong> for detecting and defending against malicious/harmful prompts.</li>
          <li>Pioneered auto-vaccination techniques for Vision-Language Models (VLMs), dramatically reducing Attack Success Rate (ASR): <strong>BLIP-2 (100%→25%)</strong> and <strong>LLaVA (99.2%→6.3%)</strong>, while maintaining task quality and model performance.</li>
        </ul>
      </div>

      <div className="experience-item">
        <h3 className="job-title">USRA AI Research Intern – Robust Multi-hop QA with Retrieval-Augmented LLMs</h3>
        <img src={guelphLogo} alt="University of Guelph Logo" className="image" />
        <p className="job-date">
          <span className="date-range">May 2025 - Aug 2025</span>
          <span className="location">University of Guelph, Guelph, ON</span>
        </p>
        <p className="job-description">Awarded a second NSERC Undergraduate Student Research Award (USRA) and conducted research on robust multi-hop QA using retrieval-augmented language models (RALMs).</p>
        <ul className="job-highlights">
          <li>Developed a <strong>Latent Twin Retrieval (LTR)</strong> method for adversarial entity substitution with knowledge graph DBpedia embeddings.</li>
          <li>Used LTR to create a robustness benchmark for multi-hop QA, injecting factually plausible fabrications that reduced model accuracy by <strong>30%</strong>, exposing reasoning failures in <strong>GPT-3.5 Turbo</strong>, <strong>Mixtral-8x7B</strong>, and <strong>LLaMA 2</strong>.</li>
        </ul>
      </div>

      <div className="experience-item">
        <h3 className="job-title">AthenaGuard CTO and Cofounder</h3>
        <img src={athenaGuardLogo} alt="AthenaGuard Logo" className="image" />
        <p className="job-date">
          <span className="date-range">Aug 2024 - Mar 2025</span>
          <span className="location">AthenaGuard, Guelph, ON</span>
        </p>
        <p className="job-description">AthenaGuard is a startup focused on leveraging AI to detect suspicious content in communications such as emails, SMS, and calls. As CTO and cofounder, I lead the development of the core platform and models.</p>
        <ul className="job-highlights">
          <li>Built a Flask web app with OAuth and Flutter SMS detection; trained <strong>GradientBoost</strong> models achieving <strong>87% accuracy</strong> for email/text phishing detection.</li>
        </ul>
      </div>

      <div className="experience-item">
        <h3 className="job-title">USRA AI Research Intern – Machine Reading Comprehension Data and Model Training</h3>
        <img src={guelphLogo} alt="University of Guelph Logo" className="image" />
        <p className="job-date">
          <span className="date-range">May 2024 - Aug 2024</span>
          <span className="location">University of Guelph, Guelph, ON</span>
        </p>
        <p className="job-description">Awarded a NSERC USRA research position, collaborating remotely with master's students on publications.</p>
        <ul className="job-highlights">
          <li><a href="https://github.com/Julien-ser/UnAnswGen" target="_blank" rel="noopener noreferrer" className="subtle-link">Utilized various NLP methods</a> such as <strong>NLTK</strong> and <strong>SpaCy</strong> in Python to generate unanswerable questions, producing <strong>944,326 candidate</strong> questions and refining them into a final dataset of <strong>130,319 instances</strong>.</li>
          <li><a href="https://github.com/Hadis-mrd/Answerable_Suggestion_Model/" target="_blank" rel="noopener noreferrer" className="subtle-link">Designed and implemented a <strong>multi-task learning (MTL)</strong> AI model</a> for classification and generation, <strong>outperforming baseline generative models by 6%</strong> for unanswerability detection and answerable generation.</li>
        </ul>
      </div>
    </div>
  );
}

function ResearchApp() {
  return (
    <div className="research-app">
      <h2 className="section-title">Research History</h2>

      <div className="experience-item">
        <h3 className="job-title">FalseCoTQA: Adversarial Multi-Hop QA via Knowledge-Grounded False Chains of Thought</h3>
        <p className="job-date-location">
          <span className="date-range">Sep. 2025</span> |
          <span className="location">SIGIR-AP 2025</span>
        </p>
        <p className="par">
          I co-authored a research paper titled <i>"FalseCoTQA: Adversarial Multi-Hop QA via Knowledge-Grounded False Chains of Thought"</i>, which was <strong>nominated for best paper</strong> at SIGIR-AP 2025.
        </p>
        <div className="pdf-preview">
          <h4>Read the Paper:</h4>
          <div className="pdf-options">
            <a
              href="https://dl.acm.org/doi/pdf/10.1145/3767695.3769494"
              target="_blank"
              rel="noreferrer"
              className="pdf-link preview-link"
            >
              <span className="pdf-icon"></span> View on ACM
            </a>
          </div>
        </div>
      </div>

      <div className="experience-item">
        <h3 className="job-title">UnAnswGen: Generating Unanswerable Questions</h3>
        <p className="job-date-location">
          <span className="date-range">Aug. 2024</span> |
          <span className="location">SIGIR-AP 2024 Submission</span>
        </p>
        <p className="par">
          I co-authored a research paper titled <i>"UnAnswGen: A Systematic Approach for Generating Unanswerable Questions in Machine Reading Comprehension"</i>, exploring dataset generation strategies for evaluating LLM robustness under incomplete or misleading contexts.
        </p>
        <div className="pdf-preview">
          <h4>Read the Paper:</h4>
          <div className="pdf-options">
            <a
              href="https://dl.acm.org/doi/pdf/10.1145/3673791.3698413"
              target="_blank"
              rel="noreferrer"
              className="pdf-link preview-link"
            >
              <span className="pdf-icon"></span> View on ACM
            </a>
          </div>
        </div>
      </div>

      <div className="experience-item">
        <h3 className="job-title">Uncovering the Persuasive Fingerprint of LLMs in Jailbreaking Attacks</h3>
        <p className="job-date-location">
          <span className="date-range">Aug. 2025</span> |
          <span className="location">CIKM 2025</span>
        </p>
        <p className="par">
          I co-authored a research paper titled <i>"Uncovering the Persuasive Fingerprint of LLMs in Jailbreaking Attacks"</i>, investigating the persuasive patterns and techniques used by large language models in jailbreaking scenarios.
        </p>
        <div className="pdf-preview">
          <h4>Read the Paper:</h4>
          <div className="pdf-options">
            <a
              href="https://dl.acm.org/doi/pdf/10.1145/3746252.3760929"
              target="_blank"
              rel="noreferrer"
              className="pdf-link preview-link"
            >
              <span className="pdf-icon"></span> View on ACM
            </a>
          </div>
        </div>
      </div>

      <div className="experience-item">
        <h3 className="job-title">Google Scholar Profile</h3>
        <p className="par">
          You can explore more of my publications and citations on my <a href="https://scholar.google.com/citations?user=mnpXcUwAAAAJ&hl=en" target="_blank" rel="noopener noreferrer" className="subtle-link">Google Scholar profile</a>.
        </p>
      </div>
    </div>
  );
}

function ProjectsApp({ projects, selectedProjectId, setSelectedProjectId }) {
  const selected = projects.find((p) => p.id === selectedProjectId) || projects[0];
  const selectedIndex = projects.indexOf(selected);
  return (
    <div className="projects-app">
      <h2 className="section-title">Projects</h2>
      <div className="section-divider"></div>
      <p className="projects-instruction">Click a dot to view project details.</p>
      {/* Dot nav */}
      <div className="carousel-dots">
        {projects.map((p, idx) => (
          <button key={p.id} type="button" className={`carousel-dot ${idx === selectedIndex ? 'active' : ''}`} onClick={() => setSelectedProjectId(p.id)} aria-label={p.title} />
        ))}
      </div>
      {/* Carousel main */}
      <div className="carousel-view">
        <div className="carousel-item active">
          <h3>{selected.title}</h3>
          <img src={selected.image} alt={selected.alt} className="project-details-image" />
          <p>{selected.description}</p>
          <div className="project-links">
            <a href={selected.href} target="_blank" rel="noreferrer">View Project</a>
            {selected.demoUrl && <a href={selected.demoUrl} target="_blank" rel="noreferrer">Live Demo</a>}
          </div>
        </div>
      </div>
    </div>
  );
}

function RobotsApp({ robotVideos, activeRobotVideoIndex, setActiveRobotVideoIndex }) {
  const activeRobotVideo = robotVideos[activeRobotVideoIndex];
  return (
    <div className="robots-app">
      <h2 className="section-title">Robots and Gadgets</h2>
      <div className="section-divider"></div>
      <p className="projects-instruction">Use dots to select a video.</p>
      {/* Dot nav at top */}
      <div className="carousel-dots">
        {robotVideos.map((video, index) => (
          <button
            key={video.id}
            type="button"
            className={`carousel-dot ${index === activeRobotVideoIndex ? 'active' : ''}`}
            onClick={() => setActiveRobotVideoIndex(index)}
            aria-label={video.title}
          />
        ))}
      </div>
      {/* Carousel main */}
      <div className="carousel-view">
        <div className={`robot-video-frame ${activeRobotVideo.provider === 'x' ? 'is-x' : ''}`}>
          <iframe src={activeRobotVideo.embedUrl} title={activeRobotVideo.title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
        </div>
        <div className="robot-video-meta">
          <h3>{activeRobotVideo.title}</h3>
          <p>{activeRobotVideo.description}</p>
          <a href={activeRobotVideo.sourceUrl} target="_blank" rel="noreferrer">Open Source Video</a>
        </div>
      </div>
    </div>
  );
}

function CompetitionsApp() {
  return (
    <div className="competitions-app">
      <h2 className="section-title">Competitions and Events</h2>
      <div className="section-divider"></div>

      <div className="experience-item">
        <h3 className="job-title">Hackathons</h3>
        <p className="job-date-location">
          <span className="date-range">March 2024 - Jan. 2025</span> |
          <span className="location">University of Waterloo, University of Guelph, University of Toronto, McMaster (Waterloo, Guelph, Toronto, Hamilton, ON)</span>
        </p>
        <ul className="job-highlights">
          <li>
            <strong>HackTheNorth, Canada's biggest hackathon:</strong> Used Dynamsoft, Groq, ExaAI, Flowbite frontend, and Flask bridging for a web app that scanned NDC medicine codes and answered general questions about medicines.
            <a href="https://devpost.com/software/medisense-x3f5ul" target="_blank" rel="noopener noreferrer" className="subtle-link">Learn more</a>
          </li>
          <li>
            <strong>GenesisAI Hackathon UofT, largest AI hackathon:</strong> Used PyTorch, Transformers, Django, and Javascript, HTML, CSS frontend to create a software assistant for the elderly and others suffering from loneliness.
            <a href="https://devpost.com/software/s-a-m-67ho5f" target="_blank" rel="noopener noreferrer" className="subtle-link">Learn more</a>
          </li>
          <li>
            <strong>GDSC Guelph Hackathon UofG:</strong> Used Tensorflow, JS, Gemini API for JS, and Flask to make a Chrome extension providing AI insights into LinkedIn pages, including sector prediction, conversation tips, and overall summaries.
            <a href="https://devpost.com/software/justin" target="_blank" rel="noopener noreferrer" className="subtle-link">Learn more</a>
          </li>
          <li>
            <strong>DeltaHacks XI McMaster:</strong> Constructed a software that scans garbage using Roboflow, YOLO, Streamlit and OpenCV, and gives the proper recycling category and reusability methods using OpenAI api, using a ReactJS frontend.
            <a href="https://devpost.com/software/bin-there-ai" target="_blank" rel="noopener noreferrer" className="subtle-link">Learn more</a>
            <div className="demo-video">
              <h4>Watch Demo</h4>
              <iframe src="https://www.youtube.com/embed/0-X8YIOtzBA" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </div>
          </li>
          <li>
            <strong>GenesisAI 2025:</strong> MCP Research dashboard (Cohere, Pinecone) Synthia.
            <a href="https://devpost.com/software/synthia-by-nuvelaai" target="_blank" rel="noopener noreferrer" className="subtle-link">Learn more</a>
            <div className="demo-video">
              <h4>Watch Demo</h4>
              <iframe src="https://www.youtube.com/embed/qqNyOJyrqvU" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </div>
          </li>
          <li>
            <strong>GDSC Hacks 2025:</strong> A2A emotional/task framework Neuralbloom.
            <a href="https://devpost.com/software/neuralbloom" target="_blank" rel="noopener noreferrer" className="subtle-link">Learn more</a>
            <div className="demo-video">
              <h4>Watch Demo</h4>
              <iframe src="https://www.youtube.com/embed/BAi9m_QdGBs" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </div>
          </li>
        </ul>
      </div>

      <div className="experience-item">
        <h3 className="job-title">Crack The Code, CyberSci Regionals</h3>
        <p className="job-date-location">
          <span className="date-range">Nov. 2024</span> |
          <span className="location">Canada Cyber Foundry, Guelph & KPMG Office, Toronto, ON</span>
        </p>
        <ul className="job-highlights">
          <li>
            <strong>Crack The Code Ontario:</strong> Performed queries on Splunk using its search process language (SPL) to traverse logs and locate information about attacks and malicious code in version control systems like GitHub.
          </li>
          <li>
            <strong>CyberSci Regionals:</strong> Using a Kali VM and OpenVPN, navigated localhost files, manipulated file types for proper upload, and used tools like Burp Suite and htop to locate malicious files and processes in an SSH server.
          </li>
        </ul>
      </div>
    </div>
  );
}

function OrgsApp() {
  return (
    <div className="orgs-app">
      <h2 className="section-title">Organizations</h2>
      <div className="section-divider"></div>
      <div className="experience-section">
        <div className="experience-item">
          <h3 className="job-title">Guelph AI Club – Technical Lead and President</h3>
          <div className="job-date-location">
            <span className="date-range">Jan 2024 - Present</span>
            <span className="location">University of Guelph, Guelph, ON</span>
          </div>
          <div className="job-description">
            <p>Led workshops on <strong>scikit-learn, Hugging Face, PyTorch</strong>, and <strong>Google Colab/Kaggle</strong>; mentored beginners and promoted ethical AI practices to <strong>20+ members</strong></p>
          </div>
        </div>

        <div className="experience-item">
          <h3 className="job-title">CyberSecurity Club – Jarvis AI Project Lead</h3>
          <div className="job-date-location">
            <span className="date-range">Jan 2024 - Mar 2024</span>
            <span className="location">University of Guelph, Guelph, ON</span>
          </div>
          <div className="job-description">
            <p><a href="https://github.com/Julien-ser/Jarvis-ai-TTE" target="_blank" rel="noopener noreferrer">Built a gesture-controlled AI assistant</a> using <strong>OpenAI API, SpeechRecognition, Mediapipe, and OpenCV</strong>; showcased at <strong>IBM Toronto Tech Expo</strong></p>
          </div>
        </div>

        <div className="experience-item">
          <h3 className="job-title">UoG Robotics Team – Software Subteam Leader</h3>
          <div className="job-date-location">
            <span className="date-range">Sep 2023 - Present</span>
            <span className="location">University of Guelph, Guelph, ON</span>
          </div>
          <div className="job-description">
            <p>Leading a <strong>10 member</strong> software team for CIRC (Canadian International Rover Challenge) using <strong>Docker, Python, YOLO, Webots, ROS (Robot Operating System)</strong>, and coordinating across sub-teams with <strong>GitHub</strong> workflows</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CertsApp() {
  return (
    <div className="certs-app">
      <h2 className="section-title">Certificates</h2>
      <div className="section-divider"></div>
      <div className="experience-section">
        <div className="experience-item">
          <h3 className="job-title">Professional Certifications</h3>
          <div className="job-date-location">
            <span className="date-range">May 2021 - Present</span>
          </div>
          <div className="job-description">
            <p>I've earned multiple professional certifications across AI/ML, cloud computing, and specialized technologies. These include:</p>
            <ul className="cert-list">
              <li><strong>Kaggle Certificates:</strong> Machine Learning, Deep Learning, Pandas, Time Series, Feature Engineering, Computer Vision, Intro to SQL, Advanced SQL</li>
              <li><strong>Google Cloud Badges:</strong> Big Data and Machine Learning Fundamentals, Build and Deploy Machine Learning Solutions on Vertex AI</li>
              <li><strong>Care AI Certificate:</strong> Introducing Artificial Intelligence: The Road Ahead</li>
              <li><strong>DeepLearning.AI Courses:</strong> LangChain Chat with Your Data, Reinforcement Fine-Tuning LLMs With GRPO, Attention in Transformers: Concepts and Code in PyTorch, DSPy: Build and Optimize Agentic Apps, ACP: Agent Communication Protocol</li>
            </ul>
            <p>View all my detailed certifications and badges on my <a href="https://www.linkedin.com/in/julien-serbanescu-6ba52a241/details/certifications/" target="_blank" rel="noopener noreferrer" className="subtle-link">LinkedIn</a>.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactApp() {
  return (
    <div className="contact-app">
      <h2 className="section-title">Get In Touch</h2>
      <div className="section-divider"></div>
      <div className="contact-container">
        <div className="contact-intro">
          <p className="par">Ready to collaborate on the next big thing? Let's connect and build something amazing together! 🚀</p>
        </div>

        <div className="contact-grid">
          <div className="contact-card">
            <div className="contact-icon">📧</div>
            <h3>Personal Email</h3>
            <p>Let's start a conversation</p>
            <a href="mailto:julien.serbanescu@gmail.com" className="contact-link">
              <span style={{ wordBreak: 'break-all', whiteSpace: 'normal', display: 'inline-block', maxWidth: '100%' }}>julien.serbanescu@gmail.com</span>
              <div className="link-arrow">→</div>
            </a>
          </div>

          <div className="contact-card">
            <div className="contact-icon">🎓</div>
            <h3>School Email</h3>
            <p>Academic & research inquiries</p>
            <a href="mailto:serbanej@uoguelph.ca" className="contact-link">
              <span>serbanej@uoguelph.ca</span>
              <div className="link-arrow">→</div>
            </a>
          </div>

          <div className="contact-card">
            <div className="contact-icon">💼</div>
            <h3>LinkedIn</h3>
            <p>Professional network & updates</p>
            <a href="https://www.linkedin.com/in/julien-serbanescu-6ba52a241/" target="_blank" rel="noreferrer" className="contact-link">
              <span>Connect on LinkedIn</span>
              <div className="link-arrow">→</div>
            </a>
          </div>

          <div className="contact-card">
            <div className="contact-icon">🐙</div>
            <h3>GitHub</h3>
            <p>Check out my code & projects</p>
            <a href="https://github.com/Julien-ser" target="_blank" rel="noreferrer" className="contact-link">
              <span>View GitHub Profile</span>
              <div className="link-arrow">→</div>
            </a>
          </div>

          <div className="contact-card">
            <div className="contact-icon">🏆</div>
            <h3>Kaggle</h3>
            <p>Data science & ML competitions</p>
            <a href="https://www.kaggle.com/julienserbanescu" target="_blank" rel="noreferrer" className="contact-link">
              <span>View Kaggle Profile</span>
              <div className="link-arrow">→</div>
            </a>
          </div>

          <div className="contact-card">
            <div className="contact-icon">🐦</div>
            <h3>Twitter</h3>
            <p>Thoughts & tech updates</p>
            <a href="https://x.com/Da_Julster" target="_blank" rel="noreferrer" className="contact-link">
              <span>Follow on Twitter</span>
              <div className="link-arrow">→</div>
            </a>
          </div>
        </div>

        <div className="contact-cta">
          <h3>Let's Build Something Together!</h3>
          <p>Whether it's AI research, cybersecurity projects, robotics development, or just a great conversation about tech - I'm always excited to connect with fellow innovators and problem-solvers.</p>
          <div className="cta-badges">
            <span className="cta-badge">AI/ML Collaboration</span>
            <span className="cta-badge">Research Projects</span>
            <span className="cta-badge">Startup Ideas</span>
            <span className="cta-badge">Tech Discussion</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
