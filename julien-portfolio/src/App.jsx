import React, { useState, useEffect, useRef } from 'react';
import { heroTimeline, fadeUpBlur, parallaxTilt, breathingGlow } from './motion.js';
import './react-styles.css';

// Import images from assets
import avatarIdle from './assets/Untitled.png';
import avatarLoading from './assets/Untitled2.png';
import profileImage from './assets/Untitled.png';
import heroImage from './assets/cb.png';
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

function App() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [sources, setSources] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('home');
  const [menuActive, setMenuActive] = useState(false);
  const googleScholarUrl = 'https://scholar.google.ca/citations?hl=en&user=mnpXcUwAAAAJ';
  const apiUrl = 'https://dajulster-julienserbanescu-rag.hf.space/api/query';
  const galaxyRef = useRef(null);

  const projects = [
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
      title: 'Robotics Demo (X Post 1)',
      description: 'Embedded robotics clip from X.',
      provider: 'x',
      embedUrl: 'https://platform.twitter.com/embed/Tweet.html?id=2026306411378962805',
      sourceUrl: 'https://x.com/i/status/2026306411378962805'
    },
    {
      id: 'x-status-2026306727935676634',
      title: 'Robotics Demo (X Post 2)',
      description: 'Embedded robotics clip from X.',
      provider: 'x',
      embedUrl: 'https://platform.twitter.com/embed/Tweet.html?id=2026306727935676634',
      sourceUrl: 'https://x.com/i/status/2026306727935676634'
    },
    {
      id: 'x-status-2026307503022109164',
      title: 'Robotics Demo (X Post 3)',
      description: 'Embedded robotics clip from X.',
      provider: 'x',
      embedUrl: 'https://platform.twitter.com/embed/Tweet.html?id=2026307503022109164',
      sourceUrl: 'https://x.com/i/status/2026307503022109164'
    },
    {
      id: 'x-status-2026308272546849015',
      title: 'Robotics Demo (X Post 4)',
      description: 'Embedded robotics clip from X.',
      provider: 'x',
      embedUrl: 'https://platform.twitter.com/embed/Tweet.html?id=2026308272546849015',
      sourceUrl: 'https://x.com/i/status/2026308272546849015'
    },
    {
      id: 'robotics-drive-demo',
      title: 'Robotics and Gadget Demo Reel',
      description: 'Featured robotics/gadget demo video hosted on Google Drive.',
      embedUrl: 'https://drive.google.com/file/d/14VT9dYURoKVtWJtiwtv4SivmbhJS0I4Y/preview',
      sourceUrl: 'https://drive.google.com/file/d/14VT9dYURoKVtWJtiwtv4SivmbhJS0I4Y/view?usp=sharing'
    },
    {
      id: 'x-status-demo',
      title: 'Robotics Demo (X Post)',
      description: 'Embedded demo from your X post.',
      provider: 'x',
      embedUrl: 'https://platform.twitter.com/embed/Tweet.html?id=1908004346043715673',
      sourceUrl: 'https://x.com/i/status/1908004346043715673'
    },
    {
      id: 'drive-demo-2',
      title: 'Robotics and Gadgets Demo 2',
      description: 'Embedded Google Drive demo video.',
      embedUrl: 'https://drive.google.com/file/d/1aOHEPNl7Mv8j02Qbf2r2c0NeIjK7jQhv/preview',
      sourceUrl: 'https://drive.google.com/file/d/1aOHEPNl7Mv8j02Qbf2r2c0NeIjK7jQhv/view?usp=sharing'
    },
    {
      id: 'drive-demo-3',
      title: 'Robotics and Gadgets Demo 3',
      description: 'Additional embedded Google Drive demo video.',
      embedUrl: 'https://drive.google.com/file/d/1w_u6A3DBWKDnzZgh6Zbgkb0nAsM1sGKQ/preview',
      sourceUrl: 'https://drive.google.com/file/d/1w_u6A3DBWKDnzZgh6Zbgkb0nAsM1sGKQ/view?usp=sharing'
    }
  ];
  const [activeRobotVideoIndex, setActiveRobotVideoIndex] = useState(0);
  const activeRobotVideo = robotVideos[activeRobotVideoIndex];

  const showPrevRobotVideo = () => {
    setActiveRobotVideoIndex((currentIndex) => (currentIndex === 0 ? robotVideos.length - 1 : currentIndex - 1));
  };

  const showNextRobotVideo = () => {
    setActiveRobotVideoIndex((currentIndex) => (currentIndex === robotVideos.length - 1 ? 0 : currentIndex + 1));
  };

  // Determine which avatar image to display based on loading state
  const currentAvatar = isLoading ? avatarLoading : avatarIdle;
  const profileImageRef = useRef(null);

  useEffect(() => {
    try {
      initGalaxyBackground();
      heroTimeline();
      
      // Add parallax tilt effect to profile image
      const profileImage = document.querySelector('.profile-image');
      let cleanupParallax = null;
      if (profileImage) {
        cleanupParallax = parallaxTilt(profileImage, { maxTilt: 8, speed: 300 });
      }
      
      // Add event listener for navigation
      const navLinks = document.querySelectorAll('.nav-links a');
      navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const targetId = link.getAttribute('href').substring(1);
          setActiveSection(targetId);
          if (menuActive) setMenuActive(false);
          
          // Scroll to the section
          const targetElement = document.getElementById(targetId);
          if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
          }
        });
      });

      // Setup intersection observer for scroll animations
      const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            fadeUpBlur(entry.target, { duration: 800 });
            entry.target.classList.add('animated');
          }
        });
      }, observerOptions);

      // Observe all sections and cards
      document.querySelectorAll('section, .experience-item').forEach(el => {
        observer.observe(el);
      });

      return () => {
        observer.disconnect();
        if (cleanupParallax) cleanupParallax();
        if (window.animationFrameId) {
          cancelAnimationFrame(window.animationFrameId);
        }
      };
    } catch (error) {
      console.error('Error in main useEffect:', error);
      // Return cleanup function even on error
      return () => {};
    }
  }, [menuActive]);

  // Animate avatar loading state
  useEffect(() => {
    const avatar = document.querySelector('.hero-avatar-image');
    if (avatar) {
      if (isLoading) {
        avatar.classList.add('loading');
        breathingGlow(avatar, { loop: true });
      } else {
        avatar.classList.remove('loading');
      }
    }
  }, [isLoading]);

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!query.trim()) {
      setError('Please enter a question.');
      return;
    }

    setIsLoading(true);
    setError('');
    setResponse('');
    setSources([]);

    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query }),
      });

      if (!res.ok) {
        let errorMsg = `HTTP error! Status: ${res.status}`;
        try {
          const errorData = await res.json();
          errorMsg = errorData.error || errorMsg;
        } catch (parseError) { }
        throw new Error(errorMsg);
      }

      const data = await res.json();
      setResponse(data.response || 'No response text received.');
      setSources(data.sources || []);

    } catch (err) {
      console.error("API call failed:", err);
      setError(err.message || 'Failed to fetch response from the backend. Is the server running?');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to initialize the galaxy background
  function initGalaxyBackground() {
    // This would be where you'd implement the Three.js code from your HTML
    // For simplicity, we'll leave this as a placeholder
    console.log("Galaxy background would be initialized here");
    // The actual implementation would require importing Three.js and other libraries
  }

  return (
    <div className="App-container">
      {/* Floating Tech Particles - Reduced for performance */}
      <div className="particle-container">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>
      
      {/* Galaxy background would be a div here that gets initialized by useEffect */}
      <div id="background" ref={galaxyRef}></div>

      <header>
        <div className="header-flex">
          <h1 className="site-title" style={{ textAlign: "center" }}>
  Julien Serbanescu
</h1>

          <nav>
            <div className="menu-icon" onClick={toggleMenu}>&#9776;</div>
            <ul className={`nav-links ${menuActive ? 'active' : ''}`}>
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#experience">Experience</a></li>
              <li><a href="#research">Research</a></li>
              <li><a href="#competitions">Competitions</a></li>
              <li><a href="#projects">Projects</a></li>
              <li><a href="#robots-gadgets">Robots & Gadgets</a></li>
              <li><a href="#organizations">Organizations</a></li>
              <li><a href="#certificates">Certificates</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <div className="content">
        {/* Portfolio Sections */}
        <section id="home">
          <div className="hero-container">
            <div className="hero-text">
              <h1 className="hero-title">Howdy 🤠</h1>
              <h1>I'm <span className='gradient-text'>Julien Serbanescu</span></h1>
              <p className="typer">Computer Engineering and Entrepreneurship Student</p>
              <p className="typer">AI Engineer & Researcher</p>
              <p className="typer">Cloud, Cybersecurity and Robotics Practitioner</p>
              <p className="typer">Published Author & Top Talent</p>
              <div className="tech-badges">
                <a href="#research" className="tech-badge">AI/ML</a>
                <a href="#experience" className="tech-badge">Cloud Engineering</a>
                <a href="#organizations" className="tech-badge">Robotics</a>
                <a href="#research" className="tech-badge">Research</a>
              </div>
            </div>
            <div className="profile-container">
              <a href="https://www.linkedin.com/in/julien-serbanescu-6ba52a241/" target="_blank" rel="noopener noreferrer" className="profile-link">
                <img src={heroImage} alt="Julien Serbanescu" className="profile-image" />
                <div className="profile-glow"></div>
              </a>
            </div>
          </div>
          
          {/* Ask Me Anything Section - Integrated into Hero */}
          <div className="hero-chat-section">
            <h2 className="hero-chat-title">Ask Me Anything</h2>
            <p className="hero-chat-subtitle">Curious about my work? Ask me anything about my research, projects, or experience!</p>
            
            <div className="hero-chat-container">
              <div className="hero-avatar-container">
                <img
                  src={currentAvatar}
                  alt={isLoading ? "Processing request..." : "Assistant Avatar"}
                  className="hero-avatar-image"
                />
              </div>
              
              <div className="hero-chat-form">
                <form onSubmit={handleSubmit} className="query-form">
                  <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask a question about my research, projects, or experience..."
                    rows="3"
                    disabled={isLoading}
                  />
                  <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Asking...' : 'Ask Question'}
                  </button>
                </form>

                {isLoading && <div className="loading-indicator">Processing...</div>}
                {error && <div className="error-message">Error: {error}</div>}

                {response && !isLoading && (
                  <div className="results-section">
                    <h3>Response:</h3>
                    <div className="response-text">
                      {response.split('\n').map((line, index) => (
                        <React.Fragment key={index}>
                          {line}
                          <br />
                        </React.Fragment>
                      ))}
                    </div>

                    {sources.length > 0 && (
                      <div className="sources-section">
                        <h4>Sources Used (Top {sources.length}):</h4>
                        <ul>
                          {sources.map((source) => (
                            <li key={source.id}>
                              <strong>Source {source.id}</strong> (Score: {source.score})<br />
                              File: {source.metadata?.source || 'N/A'}<br />
                              Type: {source.metadata?.type || 'N/A'}
                              {source.metadata?.page !== undefined && ` | Page: ${source.metadata.page + 1}`}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section id="about">
        <h2 className="section-title">About Me</h2>
        <div className="section-divider"></div>
        <div className="about-text">
          <p className="par">
            I'm Julien Serbanescu, a Computer Engineering student at the University of Guelph with co-op, minoring in Entrepreneurship. My expertise spans artificial intelligence, cloud infrastructure, cybersecurity, and cutting-edge research. I build systems that combine deep technical innovation with measurable real-world impact.
          </p>
          <p className="par">
            As a two-time NSERC USRA recipient, I’ve conducted research on robust multi-hop question answering with retrieval-augmented LLMs and adversarial robustness in LLMs and CNNs. I co-developed Latent Twin Retrieval (LTR) for evaluating misinformation resilience in QA systems, and built RL-based defenses for LLM jailbreak detection and mitigation.
          </p>
          <p className="par">
            Professionally, I serve as Cloud Engineer and Administrator at Co-Operators, where I optimize Azure infrastructure, automate workflows, and drive compliance initiatives. Previously, I co-founded AthenaGuard, a cybersecurity startup where I architected phishing detection systems using GradientBoost models and built full-stack applications. I also lead the Guelph AI Club and the software subteam of the university's Robotics team, mentoring the next generation of engineers.
          </p>
        </div>
        </section>

                 <section id="experience" className="experience-section">
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
             

         </section>

        <section id="research" className="experience-section">
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
      </section>

        <section id="competitions" className="experience-section">
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
                  <iframe 
                    src="https://www.youtube.com/embed/0-X8YIOtzBA" 
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen>
                  </iframe>
                </div>
              </li>
              <li>
                <strong>GenesisAI 2025:</strong> MCP Research dashboard (Cohere, Pinecone) Synthia.
                <a href="https://devpost.com/software/synthia-by-nuvelaai" target="_blank" rel="noopener noreferrer" className="subtle-link">Learn more</a>
                <div className="demo-video">
                  <h4>Watch Demo</h4>
                  <iframe 
                    src="https://www.youtube.com/embed/qqNyOJyrqvU" 
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen>
                  </iframe>
                </div>
              </li>
              <li>
                <strong>GDSC Hacks 2025:</strong> A2A emotional/task framework Neuralbloom.
                <a href="https://devpost.com/software/neuralbloom" target="_blank" rel="noopener noreferrer" className="subtle-link">Learn more</a>
                <div className="demo-video">
                  <h4>Watch Demo</h4>
                  <iframe 
                    src="https://www.youtube.com/embed/BAi9m_QdGBs" 
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen>
                  </iframe>
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
        </section>

        <section id="projects" className="experience-section">
          <h2 className="section-title">Projects</h2>
          <div className="section-divider"></div>
          <p className="projects-instruction">Click any project card to view more details.</p>
          <div className="projects-grid">
            {projects.map((project) => (
              <button
                key={project.id}
                type="button"
                className={`project-card ${selectedProjectId === project.id ? 'active' : ''}`}
                onClick={() => setSelectedProjectId(project.id)}
                aria-pressed={selectedProjectId === project.id}
              >
                <img src={project.image} alt={project.alt} className="project-card-image" />
                <h3>{project.title}</h3>
                <p>{project.summary}</p>
              </button>
            ))}
          </div>

          <div className="project-details-panel" aria-live="polite">
            <h3>{selectedProject.title}</h3>
            <img src={selectedProject.image} alt={selectedProject.alt} className="project-details-image" />
            <p>{selectedProject.description}</p>
            <a href={selectedProject.href} target="_blank" rel="noreferrer">View Project</a>
          </div>
        </section>

        <section id="robots-gadgets" className="experience-section">
          <h2 className="section-title">Robots and Gadgets</h2>
          <div className="section-divider"></div>
          <p className="projects-instruction">A carousel of embedded robotics and gadget demos.</p>

          <div className="robot-carousel">
            <button type="button" className="robot-carousel-nav" onClick={showPrevRobotVideo} aria-label="Previous video">
              ‹
            </button>

            <div className={`robot-video-frame ${activeRobotVideo.provider === 'x' ? 'is-x' : ''}`}>
              <iframe
                src={activeRobotVideo.embedUrl}
                title={activeRobotVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            <button type="button" className="robot-carousel-nav" onClick={showNextRobotVideo} aria-label="Next video">
              ›
            </button>
          </div>

          <div className="robot-video-meta">
            <h3>{activeRobotVideo.title}</h3>
            <p>{activeRobotVideo.description}</p>
            <a href={activeRobotVideo.sourceUrl} target="_blank" rel="noreferrer">Open Source Video</a>
          </div>

          <div className="robot-video-track" role="tablist" aria-label="Robot and gadget videos">
            {robotVideos.map((video, index) => (
              <button
                key={video.id}
                type="button"
                role="tab"
                aria-selected={index === activeRobotVideoIndex}
                className={`robot-video-chip ${index === activeRobotVideoIndex ? 'active' : ''}`}
                onClick={() => setActiveRobotVideoIndex(index)}
              >
                {video.title}
              </button>
            ))}
          </div>
        </section>

      <section id="organizations">
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
        </section>

                 <section id="certificates">
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
         </section>

                 <section id="contact">
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
                    <span style={{wordBreak: 'break-all', whiteSpace: 'normal', display: 'inline-block', maxWidth: '100%'}}>julien.serbanescu@gmail.com</span>
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
         </section>

      </div>
    </div>
  );
}

export default App;