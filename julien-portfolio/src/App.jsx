import React, { useState, useEffect, useRef } from 'react';
import './react-styles.css';

// Import images from assets
import avatarIdle from './assets/avatar1.png';
import avatarLoading from './assets/avatar2.jpeg';
import profileImage from './assets/avatar1.png';
import guelphLogo from './assets/guelp.png';
import cySciLogo from './assets/cybersci.png';
import athenaGuardLogo from './assets/aguard.jpg';

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

  // Determine which avatar image to display based on loading state
  const currentAvatar = isLoading ? avatarLoading : avatarIdle;

  useEffect(() => {
    initGalaxyBackground();
    
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

    return () => {
      // Cleanup
      if (window.animationFrameId) {
        cancelAnimationFrame(window.animationFrameId);
      }
    };
  }, [menuActive]);

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
      {/* Galaxy background would be a div here that gets initialized by useEffect */}
      <div id="background" ref={galaxyRef}></div>

      <header>
        <nav>
          <h1 className="site-title">Julien Serbanescu</h1>
          <div className="menu-icon" onClick={toggleMenu}>&#9776;</div>
          <ul className={`nav-links ${menuActive ? 'active' : ''}`}>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About Me</a></li>
            <li><a href="#experience">Experience</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><a href="#chat">Ask Me</a></li>
          </ul>
        </nav>
      </header>

      <div className="content">
        {/* Portfolio Sections */}
        <section id="home">
          <div className="hero-container">
            <div className="hero-text">
              <h1 className="hero-title">Hi there 👋</h1>
              <h1>I'm <span className='gradient-text'>Julien Serbanescu</span></h1>
              <p className="typer">AI Engineer</p>
              <p className="typer">Robotics Enthusiast</p>
              <p className="typer">Aspiring Entrepreneur</p>
            </div>
            <img src={profileImage} alt="Julien Serbanescu" className="profile-image" />
          </div>
        </section>

        <section id="about">
        <h2 className="section-title">About Me</h2>
        <div className="about-text">
          <p className="par">
            I'm Julien Serbanescu, a Computer Engineering Co-op student at the University of Guelph, minoring in Entrepreneurship. My interests lie at the intersection of artificial intelligence, cybersecurity, and innovative problem-solving. I enjoy building systems that blend deep technical research with real-world impact.
          </p>
          <p className="par">
            As a two-time NSERC USRA recipient, I’ve conducted research on robust multi-hop question answering with retrieval-augmented LLMs and adversarial robustness in LLMs and CNNs. I co-developed Latent Twin Retrieval (LTR) for evaluating misinformation resilience in QA systems, and built RL-based defenses for LLM jailbreak detection and mitigation.
          </p>
          <p className="par">
            Outside academia, I co-founded <b>AthenaGuard</b>, a cybersecurity startup where I led development of phishing detection systems using GradientBoost models and built full-stack mobile and web applications. I also lead the Guelph AI Club and the software subteam of the university's Robotics team.
          </p>
        </div>
        </section>
        <section id="experience" className="experience-section">
          <h2 className="section-title">Experience</h2>
        <div className="experience-item">
          <h3 className="job-title">USRA Research Work Term – Multi-hop QA Robustness</h3>
          <img src={guelphLogo} alt="University of Guelph Logo" className="image" />
          <p className="job-date">
            <span className="date-range">May. 2025 - Aug. 2025</span>
            <span className="location">University of Guelph, Guelph, ON</span>
          </p>
          <p className="job-description">As a returning NSERC USRA recipient, I focused on enhancing robustness in multi-hop question answering systems using retrieval-augmented language models (RALMs).</p>
          <ul className="job-highlights">
            <li>Designed the Latent Twin Retrieval (LTR) method for simulating misinformation via adversarial entity substitution based on DBpedia embeddings.</li>
            <li>Generated a benchmark to test RALM resilience by injecting factually coherent fabrications that reduced model accuracy by up to 30%.</li>
            <li>Evaluated QA systems including GPT-3.5 Turbo, Mixtral-8x7B, and LLaMA 2 under fabricated multi-hop reasoning scenarios.</li>
          </ul>
        </div>

        <div className="experience-item">
          <h3 className="job-title">Cyber Science Lab Research Assistant</h3>
          <img src={cySciLogo} alt="University of Guelph Logo" className="image" />
          <p className="job-date">
            <span className="date-range">May. 2025 - Aug. 2025</span>
            <span className="location">University of Guelph, Guelph, ON</span>
          </p>
          <p className="job-description">At the Cyber Science Lab, I developed adversarial robustness strategies for language and vision models, and explored reinforcement learning techniques to mitigate LLM jailbreak attacks.</p>
          <ul className="job-highlights">
            <li>Implemented psychologically inspired LLM jailbreak methods, achieving 97% attack success rates across diverse model APIs.</li>
            <li>Trained RL agents to rewire computational graphs in backdoored CNNs and image-language models.</li>
            <li>Developed an RL-based defense system with a 90% detection rate for jailbreak prompts; deployed via ONNX for real-time performance in production environments.</li>
          </ul>
        </div>
          
          <div className="experience-item">
            <h3 className="job-title">USRA Research Work Term</h3>
            <img src={guelphLogo} alt="University of Guelph Logo" className="image" />
            <p className="job-date">
              <span className="date-range">May. 2024 - Aug. 2024</span>
              <span className="location">University of Guelph, Guelph, ON</span>
            </p>
            <p className="job-description">As part of the Undergraduate Student Research Award (USRA) program, I researched and worked on Question Answering frameworks, focusing on large language model evaluation, dataset generation, and multi-task learning (MTL) model development.</p>
            <ul className="job-highlights">
              <li>Trained and evaluated large language models to improve the generation of unanswerable questions.</li>
              <li>Developed AI models using NLP libraries like NLTK and SpaCy.</li>
              <li>Coauthored a research paper, "UnAnswGen: A Systematic Approach for Generating Unanswerable Questions in Machine Reading Comprehension," submitted to the SIGIR-AP 2024 conference.</li>
            </ul>
          </div>
          
          <div className="experience-item">
            <h3 className="job-title">AthenaGuard CTO and Cofounder</h3>
            <img src={athenaGuardLogo} alt="AthenaGuard Logo" className="image" />
            <p className="job-date">
              <span className="date-range">Aug. 2024 - Mar. 2025</span>
              <span className="location">AthenaGuard, Guelph, ON</span>
            </p>
            <p className="job-description">AthenaGuard is a startup focused on leveraging AI to detect suspicious content in communications such as emails, SMS, and calls. As CTO and cofounder, I lead the development of the core platform and models.</p>
            <ul className="job-highlights">
              <li>Developed AI-based classification models to detect suspicious information in text and embedded links.</li>
              <li>Designed and implemented OAuth login for Flask web applications and integrated SMS detection with Flutter.</li>
            </ul>
          </div>
        </section>

        <section id="research" className="experience-section">
        <h2 className="section-title">Research History</h2>

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
                href="/JulienSerbanescu/paper.pdf" 
                target="_blank" 
                rel="noreferrer" 
                className="pdf-link preview-link"
              >
                <span className="pdf-icon">👁️</span> Preview Paper
              </a>
              <a 
                href="/JulienSerbanescu/paper.pdf" 
                className="pdf-link download-link"
                download="Julien_Serbanescu_Research_Paper.pdf"
              >
                <span className="pdf-icon">📥</span> Download Paper
              </a>
            </div>
          </div>
        </div>

        <div className="experience-item">
          <h3 className="job-title">Google Scholar Profile</h3>
          <p className="par">
            You can explore more of my publications and citations on my <a href="https://scholar.google.com/citations?user=YOUR_ID_HERE" target="_blank" rel="noreferrer">Google Scholar profile</a>.
          </p>
        </div>
      </section>

        <section id="competitions" className="experience-section">
          <h2 className="section-title">Competitions and Events</h2>
        
          <div className="experience-item">
            <h3 className="job-title">HackTheNorth, GDSC Guelph, GenesisAI Hackathons, DeltaHacks XI</h3>
            <p className="job-date-location">
              <span className="date-range">March 2024 - Jan. 2025</span> |
              <span className="location">University of Waterloo, University of Guelph, University of Toronto, McMaster (Waterloo, Guelph, Toronto, Hamilton, ON)</span>
            </p>
            <ul className="job-highlights">
              <li>
                <strong>HackTheNorth, Canada's biggest hackathon:</strong> Used Dynamsoft, Groq, ExaAI, Flowbite frontend, and Flask bridging for a web app that scanned NDC medicine codes and answered general questions about medicines.
                <a href="https://devpost.com/software/medisense-x3f5ul" target="_blank" rel="noreferrer">Learn more</a>
              </li>
              <li>
                <strong>GenesisAI Hackathon UofT, largest AI hackathon:</strong> Used PyTorch, Transformers, Django, and Javascript, HTML, CSS frontend to create a software assistant for the elderly and others suffering from loneliness.
                <a href="https://devpost.com/software/s-a-m-67ho5f" target="_blank" rel="noreferrer">Learn more</a>
              </li>
              <li>
                <strong>GDSC Guelph Hackathon UofG:</strong> Used Tensorflow, JS, Gemini API for JS, and Flask to make a Chrome extension providing AI insights into LinkedIn pages, including sector prediction, conversation tips, and overall summaries.
                <a href="https://devpost.com/software/justin" target="_blank" rel="noreferrer">Learn more</a>
              </li>
              <li>
                <strong>DeltaHacks XI McMaster:</strong> Constructed a software that scans garbage using Roboflow, YOLO, Streamlit and OpenCV, and gives the proper recycling category and reusability methods using OpenAI api, using a ReactJS frontend.
                <a href="https://devpost.com/software/bin-there-ai" target="_blank" rel="noreferrer">Learn more</a>
              </li>
            </ul>
            <h4>Watch me!</h4>
            <iframe 
              src="https://www.youtube.com/embed/0-X8YIOtzBA" 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen>
            </iframe>
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
          <div className="experience-item">
            <h3>GAN to Generate Soccer Jerseys</h3>
            <p className="par">
              Developed a Generative Adversarial Network (GAN) to create soccer jersey designs. Constructed generator and discriminator networks with PyTorch, using a custom dataset obtained by web scraping images of soccer jerseys. Implemented key model layers including Conv2D, Conv2DTranspose, along with tanh and sigmoid activations.
            </p>
            <a href="https://www.kaggle.com/code/julienserbanescu/pytorch-test" target="_blank" rel="noreferrer">View Project</a>
          </div>
          
          <div className="experience-item">
            <h3>Jarvis AI For the Toronto Tech Expo</h3>
            <p className="par">
              Lead a team to create an AI assistant similar to Jarvis from Iron Man. Using technology such as a 3rd party openAI api to answer general questions. Implementation of SpeechRecognition libraries in Python(likely Google's speech recognition library). Automation of processes such as application opening, online search. etc. Showcased and presented to the IBM Toronto Tech Expo (TTE)
            </p>
            <a href="https://github.com/Julien-ser/Jarvis-ai-TTE" target="_blank" rel="noreferrer">View Project</a>
          </div>
          
          <div className="experience-item">
            <h3>Orange Juice Dispenser</h3>
            <p className="par">
              Created a device that would activate a pump via the ESP8266, dispensing water into a glass with OJ powder, activating whenever orange was typed in. Selenium to communicate and interact with ESP8266 web server to send the command to activate the pump. Usage of a relay and motorized pump in my ESP8266 circuit, usage of C++ for programming the ESP webpage and pump activation.
            </p>
            <a href="https://drive.google.com/file/d/1uF_2dDhc9ZC9fWEBjcScDP96S59U_V4C/view?usp=sharing" target="_blank" rel="noreferrer">View Project</a>
          </div>
        </section>

        <section id="contact">
          <h2 className="section-title">Contact</h2>
          <p className="par">If you'd like to get in touch with me, feel free to reach out through any of the following methods:</p>
          <ul>
            <li>  <a href="mailto:julien.serbanescu@gmail.com" target="_blank" rel="noreferrer">julien.serbanescu@gmail.com</a></li>
            <li> <a href="https://www.linkedin.com/in/julien-serbanescu-6ba52a241/" target="_blank" rel="noreferrer">LinkedIn Profile</a></li>
            <li> <a href="https://github.com/Julien-ser" target="_blank" rel="noreferrer">GitHub Profile</a></li>
            <li> <a href="https://x.com/Da_Julster" target="_blank" rel="noreferrer">Twitter Profile</a></li>
          </ul>
        </section>

        {/* Julien AI Chat Interface */}
        <section id="chat" className="chat-interface">
          <h2 className="section-title">Ask Me Anything</h2>
          <div className="avatar-container">
            <img
              src={currentAvatar}
              alt={isLoading ? "Processing request..." : "Assistant Avatar"}
              className="avatar-image"
            />
          </div>
          
          <main className="App-main">
            <form onSubmit={handleSubmit} className="query-form">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask a question about Julien Serbanescu's documents..."
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
                <h2>Response:</h2>
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
                    <h3>Sources Used (Top {sources.length}):</h3>
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
          </main>
        </section>
      </div>
    </div>
  );
}

export default App;