'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Home() {
  useEffect(() => {
    // --- INTERNATIONALIZATION (i18n) LOGIC ---
    const translations = {
      pl: {
        "nav.logo": 'Streść<span>.to</span>',
        "nav.logo_plain": 'Streść.to',
        "nav.app": "Otwórz Aplikację",
        "nav.login": "Zaloguj się",
        "hero.title": "Zrozum historię,<br>nie tylko <em>słowa</em>.",
        "hero.subtitle": "Inteligentne streszczenia, które wyciągają esencję. Plany wydarzeń, profile postaci i kontekst – wszystko w jednym, minimalistycznym notesie.",
        "btn.app": "Przejdź do aplikacji",
        "mockup.book_title": "Lalka (B. Prus)",
        "feat1.title": "Chronologia i <br>Plany Wydarzeń",
        "feat1.desc": "Gubisz się w wątkach? Nasz algorytm układa fabułę w przejrzystą oś czasu. Zobacz przyczynę i skutek każdego zwrotu akcji, bez konieczności wertowania setek stron.",
        "feat1.quote": "\"Kto co zrobił i kiedy?\" – teraz już wiesz.",
        "mockup.timeline": "Oś czasu: Rozdział IV",
        "feat2.title": "Profile i <br>Motywacje Postaci",
        "feat2.desc": "Każdy bohater dostaje swoją kartotekę. Zrozum powiązania, cechy charakteru i ukryte motywy. Streść.to tworzy mapę relacji, która sprawia, że nawet najtrudniejsze lektury stają się zrozumiałe.",
        "mockup.characters": "Postacie",
        "mockup.main": "Główni",
        "feat3.title": "Interaktywne <br>Quizy i Testy",
        "feat3.desc": "Sprawdź swoją wiedzę po każdej lekturze. Nasze quizy pomagają utrwalić najważniejsze fakty i motywy, przygotowując Cię do sprawdzianów i matury w mgnieniu oka.",
        "feat4.title": "Perfekcyjna <br>Rozprawka",
        "feat4.desc": "Generuj gotowe argumenty, tezy i konteksty do Twojej rozprawki. Zrozum, jak wykorzystać lekturę w tematach maturalnych.",
        "mockup.quizzes": "Quizy",
        "mockup.essay": "Rozprawka",
        "footer.title": "Gotowy na czystą wiedzę?",
        "btn.download": "Pobierz Aplikację"
      },
      en: {
        "nav.logo": 'Summarize<span>.it</span>',
        "nav.logo_plain": 'Summarize.it',
        "nav.app": "Open App",
        "nav.login": "Log in",
        "hero.title": "Understand the story,<br>not just the <em>words</em>.",
        "hero.subtitle": "Intelligent summaries that extract the essence. Event timelines, character profiles, and context – all in one minimalist notebook.",
        "btn.app": "Go to App",
        "mockup.book_title": "The Great Gatsby",
        "feat1.title": "Chronology & <br>Event Timelines",
        "feat1.desc": "Lost in the plot? Our algorithm arranges the story into a clear timeline. See the cause and effect of every plot twist without flipping through hundreds of pages.",
        "feat1.quote": "\"Who did what and when?\" – now you know.",
        "mockup.timeline": "Timeline: Chapter IV",
        "feat2.title": "Profiles & <br>Character Motivations",
        "feat2.desc": "Every character gets a file. Understand relationships, traits, and hidden motives. Streść.to creates a relationship map that makes even the most complex readings clear.",
        "mockup.characters": "Characters",
        "mockup.main": "Main",
        "feat3.title": "Interactive <br>Quizzes & Tests",
        "feat3.desc": "Test your knowledge after every reading. Our quizzes help you memorize key facts and themes, preparing you for exams and finals in no time.",
        "feat4.title": "Perfect <br>Essay",
        "feat4.desc": "Generate ready-made arguments, thesis statements, and contexts for your essay. Understand how to use the book in exam topics.",
        "mockup.quizzes": "Quizzes",
        "mockup.essay": "Essay",
        "footer.title": "Ready for pure knowledge?",
        "btn.download": "Download App"
      }
    };

    function setLanguage(lang) {
      // 1. Save choice
      localStorage.setItem('strescto_lang', lang);
      
      // 2. Update buttons (styling)
      document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if(btn.textContent.toLowerCase() === lang) {
          btn.classList.add('active');
        }
      });

      // 3. Swap texts
      const elements = document.querySelectorAll('[data-i18n]');
      elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
          // Use innerHTML to handle <br> and <em> tags in headers
          el.innerHTML = translations[lang][key];
        }
      });
    }

    function detectAndInitLanguage() {
      // Check if user already chose language
      const savedLang = localStorage.getItem('strescto_lang');
      
      if (savedLang) {
        setLanguage(savedLang);
      } else {
        // If not, check browser language
        const userLang = navigator.language || navigator.userLanguage; 
        // If Polish, set 'pl', otherwise 'en'
        const defaultLang = userLang.startsWith('pl') ? 'pl' : 'en';
        setLanguage(defaultLang);
      }
    }

    // Initialize
    detectAndInitLanguage();
    
    // Attach to window for button clicks
    window.setLanguage = setLanguage;

    // Scroll observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal-on-scroll').forEach((el) => {
      observer.observe(el);
    });

    return () => {
        // Cleanup if needed
    };
  }, []);

  return (
    <>
      <style jsx global>{`
        /* --- VARIABLES & THEME --- */
        :root {
            --paper: #F2F0E9;
            --ink: #232323;
            --burnt-orange: #E05D44;
            --forest-green: #2D6A4F;
            --surface: #FFFFFF;
            --border: #E5E0D5;
            --text-secondary: #5D5D5D;
            --font-serif: 'Fraunces', serif;
            --font-sans: 'Manrope', sans-serif;
            --container-width: 1200px;
            --radius: 16px;
        }

        /* --- BASE --- */
        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
            background-color: var(--paper);
            color: var(--ink);
            font-family: var(--font-sans);
            overflow-x: hidden;
            line-height: 1.5;
            transition: opacity 0.3s ease;
        }

        /* Noise Texture */
        body::before {
            content: "";
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            pointer-events: none; z-index: 9999; opacity: 0.05;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }

        .container {
            max-width: var(--container-width);
            margin: 0 auto;
            padding: 0 24px;
        }

        /* --- NAV & LANG SWITCHER --- */
        nav {
            padding: 48px 0 32px 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .nav-right {
            display: flex;
            align-items: center;
            gap: 24px;
        }

        .logo {
            font-family: var(--font-serif);
            font-weight: 800;
            font-size: 1.5rem;
            color: var(--ink);
            text-decoration: none;
        }
        .logo span { color: var(--burnt-orange); }

        /* Language Switcher Style */
        .lang-switch {
            display: flex;
            border: 1px solid var(--border);
            border-radius: 20px;
            padding: 4px;
            background: var(--surface);
        }

        .lang-btn {
            background: none;
            border: none;
            padding: 4px 12px;
            border-radius: 16px;
            font-family: var(--font-sans);
            font-size: 0.8rem;
            font-weight: 700;
            color: var(--text-secondary);
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .lang-btn.active {
            background-color: var(--ink);
            color: var(--surface);
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .nav-login {
            text-decoration:none; 
            color: var(--ink); 
            font-weight:600; 
            font-size: 0.9rem;
        }

        /* --- HERO SECTION --- */
        .hero {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            min-height: 100vh;
            padding: 80px 0;
            gap: 60px;
        }

        .hero-content {
            max-width: 800px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .hero-content h1 {
            font-family: var(--font-serif);
            font-size: clamp(3rem, 6vw, 5rem);
            line-height: 1.1;
            font-weight: 300;
            margin-bottom: 24px;
            font-variation-settings: "SOFT" 50;
        }

        .hero-content h1 em {
            font-style: italic;
            color: var(--forest-green);
            font-weight: 500;
        }

        .hero-content p {
            font-size: 1.25rem;
            color: var(--text-secondary);
            max-width: 600px;
            margin-bottom: 40px;
            line-height: 1.6;
        }

        .btn-group { display: flex; gap: 16px; flex-wrap: wrap; }

        .btn {
            padding: 16px 28px;
            border-radius: 12px;
            font-weight: 600;
            text-decoration: none;
            transition: transform 0.2s;
            display: inline-flex;
            align-items: center;
            gap: 10px;
            white-space: nowrap;
        }

        .btn-primary {
            background: var(--ink);
            color: var(--surface);
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
        .btn-primary:hover { transform: translateY(-2px); background: #000; }

        .btn-secondary {
            background: var(--surface);
            color: var(--ink);
            border: 1px solid var(--border);
        }
        .btn-secondary:hover { transform: translateY(-2px); border-color: var(--ink); }

        /* HERO IMAGE - 3D Mockup */
        .hero-visual {
            width: 100%;
            display: flex;
            justify-content: center;
        }

        .phone-mockup {
            width: 320px;
            height: 640px;
            background: var(--surface);
            border: 8px solid var(--ink);
            border-radius: 32px;
            margin: 0 auto;
            position: relative;
            box-shadow: 20px 20px 60px rgba(0,0,0,0.15);
            transform: rotateY(-15deg) rotateX(5deg) rotateZ(-2deg);
            transition: transform 0.5s ease;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }
        
        .phone-mockup:hover {
            transform: rotateY(-5deg) rotateX(0deg) rotateZ(0deg);
        }

        .ui-header { height: 60px; border-bottom: 1px solid var(--border); display: flex; align-items: center; padding: 0 20px; font-family: var(--font-serif); font-weight: 700; }
        .ui-content { padding: 20px; flex: 1; background: linear-gradient(to bottom, #fff 0%, #FAF9F6 100%); }
        .ui-line { height: 10px; background: #EEE; margin-bottom: 12px; border-radius: 4px; }
        .ui-line.short { width: 60%; }
        .ui-line.title { height: 20px; width: 80%; background: var(--ink); margin-bottom: 24px; }
        .ui-card { background: #fff; padding: 15px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); margin-bottom: 15px; border: 1px solid var(--border); }

        /* --- SECTIONS --- */
        .feature-section {
            padding: 100px 0;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 80px;
            align-items: center;
        }

        .feature-section.reversed { direction: rtl; }
        .feature-section.reversed > * { direction: ltr; }

        .feature-text h2 {
            font-family: var(--font-serif);
            font-size: 2.5rem;
            margin-bottom: 20px;
            position: relative;
            display: inline-block;
        }

        .feature-text h2::after {
            content: '';
            position: absolute;
            bottom: 2px;
            left: 0;
            width: 100%;
            height: 12px;
            background-color: var(--burnt-orange);
            opacity: 0.2;
            z-index: -1;
            transform: skewX(-15deg);
        }

        .feature-text p {
            color: var(--text-secondary);
            font-size: 1.1rem;
            line-height: 1.8;
            margin-bottom: 32px;
        }

        .feature-visual {
            display: flex;
            justify-content: center;
            align-items: center;
            perspective: 1200px;
        }

        /* --- SCREENSHOTS --- */
        .screen-container {
            position: relative;
            width: 100%;
            aspect-ratio: 4/3;
            perspective: 1000px;
        }

        .app-screen {
            width: 90%;
            height: 100%;
            background: var(--surface);
            border-radius: 16px;
            border: 1px solid var(--border);
            box-shadow: 0 10px 40px rgba(0,0,0,0.08);
            position: absolute;
            top: 0; left: 0;
            overflow: hidden;
            padding: 30px;
            transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        /* Timeline UI */
        .timeline-ui { display: flex; flex-direction: column; gap: 20px; }
        .timeline-item { display: flex; gap: 15px; align-items: flex-start; }
        .t-dot { width: 12px; height: 12px; border-radius: 50%; background: var(--burnt-orange); margin-top: 6px; position: relative; }
        .t-dot::after { content: ''; position: absolute; top: 12px; left: 50%; width: 2px; height: 40px; background: var(--border); transform: translateX(-50%); }
        .t-content { flex: 1; }
        .t-title { height: 14px; width: 40%; background: var(--ink); margin-bottom: 8px; border-radius: 4px; }
        .t-desc { height: 8px; width: 90%; background: #ddd; border-radius: 4px; margin-bottom: 4px; }

        /* Characters UI */
        .chars-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
        .char-card { background: var(--paper); padding: 16px; border-radius: 12px; text-align: center; }
        .char-avatar { width: 48px; height: 48px; background: var(--forest-green); border-radius: 50%; margin: 0 auto 12px; opacity: 0.8; }
        .char-name { height: 12px; width: 70%; background: var(--ink); margin: 0 auto 8px; border-radius: 4px; }
        .char-role { height: 8px; width: 50%; background: #bbb; margin: 0 auto; border-radius: 4px; }

        /* Quizzes UI */
        .quiz-ui { display: flex; flex-direction: column; gap: 12px; }
        .quiz-question { height: 14px; width: 80%; background: var(--ink); margin-bottom: 12px; border-radius: 4px; }
        .quiz-option { 
            background: var(--paper); 
            padding: 12px; 
            border-radius: 10px; 
            border: 1px solid var(--border);
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .quiz-check { width: 16px; height: 16px; border: 2px solid var(--border); border-radius: 50%; }
        .quiz-option.correct { border-color: var(--forest-green); background: rgba(45, 106, 79, 0.05); }
        .quiz-option.correct .quiz-check { background: var(--forest-green); border-color: var(--forest-green); }
        .quiz-text { height: 8px; width: 60%; background: #ccc; border-radius: 4px; }

        /* Essay UI */
        .essay-ui { display: flex; flex-direction: column; gap: 16px; }
        .essay-block { background: var(--paper); border-radius: 8px; border: 1px solid var(--border); padding: 12px; }
        .essay-label { width: 60px; height: 8px; background: var(--ink); border-radius: 4px; margin-bottom: 8px; opacity: 0.8; }
        .essay-line { height: 6px; background: #ddd; border-radius: 3px; margin-bottom: 6px; }
        .essay-line.short { width: 70%; }
        .essay-badge { width: 80px; height: 16px; background: var(--accent); border-radius: 12px; margin-bottom: 12px; opacity: 0.1; }

        .reveal-on-scroll { opacity: 0; transform: translateY(40px); transition: all 0.8s ease-out; }
        .reveal-on-scroll.visible { opacity: 1; transform: translateY(0); }
        .screen-container:hover .app-screen { transform: translateY(-10px) rotateX(5deg); }
        
        .screen-decor {
            position: absolute; width: 100%; height: 100%; top: 20px; left: 20px;
            background-color: var(--ink); border-radius: 16px; z-index: -1; opacity: 0.05;
        }

        /* --- FOOTER --- */
        .footer-cta {
            text-align: center;
            padding: 120px 24px;
            background: linear-gradient(180deg, rgba(242,240,233,0) 0%, rgba(224,93,68,0.05) 100%);
        }
        .footer-cta h2 { font-family: var(--font-serif); font-size: 3rem; margin-bottom: 32px; }

        /* Showcase Layout */
        .web-screen-mockup {
            width: 100%;
            max-width: 400px;
            height: 300px;
            background: var(--surface);
            border-radius: 12px;
            border: 1px solid var(--border);
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            overflow: hidden;
            position: relative;
            transition: transform 0.4s ease;
            perspective: 1000px;
        }
        .web-screen-mockup:hover { transform: translateY(-10px); }
        .web-header {
            height: 24px;
            background: #F5F5F5;
            border-bottom: 1px solid var(--border);
            display: flex;
            align-items: center;
            padding: 0 10px;
            gap: 6px;
        }
        .web-dot { width: 6px; height: 6px; border-radius: 50%; background: #ddd; }
        .web-content { padding: 20px; }

        @media (max-width: 1100px) {
            .showcase-grid { flex-direction: column; gap: 60px; }
            .web-screen-mockup { width: 100%; max-width: 500px; height: auto; min-height: 300px; transform: none !important; }
            .phone-mockup { order: -1; }
        }

        @media (max-width: 900px) {
            nav { padding: 32px 16px; }
            .hero { padding: 60px 16px; min-height: auto; }
            .feature-section { padding: 60px 16px; gap: 40px; }
            .hero, .feature-section { grid-template-columns: 1fr; }
            .feature-section.reversed { direction: ltr; }
            .hero-visual { display: flex; justify-content: center; margin-top: 40px; }
            .phone-mockup { transform: rotateY(0) rotateZ(0); }
            .screen-container { width: 100%; max-width: 400px; margin: 0 auto; }
            .nav-right { gap: 12px; }
        }

        @media (max-width: 480px) {
            .container { padding: 0 16px; }
            .hero-content h1 { font-size: 2.5rem; }
            .btn { width: 100%; justify-content: center; }
            .nav-right .btn { display: none; } /* Hide app button on small mobile header, maybe? Or keep icon only. Let's keep it but smaller or adjust */
            .logo { font-size: 1.2rem; }
        }

        /* App Mockup Specifics */
        .mockup-search {
            background: #F5F5F5; border-radius: 12px; padding: 12px; display: flex; align-items: center; gap: 10px; margin-bottom: 16px;
            border: 1px solid #E0E0E0;
        }
        .mockup-search-icon { width: 16px; height: 16px; border: 2px solid #999; border-radius: 50%; position: relative; }
        .mockup-search-icon::after { content:''; position: absolute; bottom: -4px; right: -4px; width: 6px; height: 2px; background: #999; transform: rotate(45deg); }
        .mockup-search-text { width: 100px; height: 8px; background: #ddd; border-radius: 4px; }
        
        .mockup-btn-gen {
            background: var(--ink); color: #fff; text-align: center; padding: 12px; border-radius: 12px; font-weight: bold; font-size: 0.8rem; margin-bottom: 24px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
      `}</style>

      <nav className="container">
        <a href="#" className="logo" data-i18n="nav.logo">Streść<span>.to</span></a>
        
        <div className="nav-right">
                <div className="lang-switch">
                    <button className="lang-btn active" onClick={() => window.setLanguage('pl')}>PL</button>
                    <button className="lang-btn" onClick={() => window.setLanguage('en')}>EN</button>
                </div>
                
                <a href="https://app.strescto.pl" className="btn btn-primary" style={{padding: '10px 20px', fontSize: '0.9rem'}} data-i18n="nav.app">Otwórz Aplikację</a>
            </div>
      </nav>

      <header className="container hero">
        <div className="hero-content">
            <h1 data-i18n="hero.title">Zrozum historię,<br/>nie tylko <em>słowa</em>.</h1>
            <p data-i18n="hero.subtitle">Inteligentne streszczenia, które wyciągają esencję. Plany wydarzeń, profile postaci i kontekst – wszystko w jednym, minimalistycznym notesie.</p>
            <div className="btn-group">
                <a href="https://app.strescto.pl" className="btn btn-primary" data-i18n="btn.app">Przejdź do aplikacji</a>
                <a href="https://play.google.com/store/apps/details?id=com.ronimstudio.strescto" className="btn btn-secondary">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.54,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/></svg>
                    Google Play
                </a>
            </div>
        </div>

        <div className="hero-visual">
            <div className="phone-mockup">
                <div className="ui-header" data-i18n="nav.logo_plain">Streść.to</div>
                <div className="ui-content">
                    <div className="mockup-search">
                        <div className="mockup-search-icon"></div>
                        <div className="mockup-search-text"></div>
                    </div>
                    <div className="mockup-btn-gen">Generuj Streszczenie</div>
                    <div className="ui-card">
                        <div className="ui-line title"></div>
                        <div className="ui-line"></div>
                        <div className="ui-line short"></div>
                    </div>
                </div>
            </div>
        </div>
      </header>

      <section className="container feature-section reveal-on-scroll">
        <div className="feature-text">
            <h2 data-i18n="feat1.title">Chronologia i <br/>Plany Wydarzeń</h2>
            <p data-i18n="feat1.desc">Gubisz się w wątkach? Nasz algorytm układa fabułę w przejrzystą oś czasu. Zobacz przyczynę i skutek każdego zwrotu akcji, bez konieczności wertowania setek stron.</p>
            <div style={{fontFamily: 'var(--font-serif)', color: 'var(--burnt-orange)', fontStyle: 'italic'}} data-i18n="feat1.quote">"Kto co zrobił i kiedy?" – teraz już wiesz.</div>
        </div>
        <div className="feature-visual">
            <div className="web-screen-mockup" style={{transform: 'rotateY(10deg) rotateX(5deg)'}}>
                <div className="web-header">
                    <div className="web-dot"></div><div className="web-dot"></div><div className="web-dot"></div>
                    <div style={{fontSize: '8px', color: '#999', marginLeft: 'auto'}} data-i18n="mockup.timeline">Oś czasu</div>
                </div>
                <div className="web-content">
                    <div className="timeline-ui">
                        <div className="timeline-item">
                            <div className="t-dot"></div>
                            <div className="t-content">
                                <div className="t-title" style={{height: '10px', width: '60%'}}></div>
                                <div className="t-desc" style={{height: '6px', width: '80%'}}></div>
                            </div>
                        </div>
                        <div className="timeline-item">
                            <div className="t-dot" style={{background: 'var(--ink)'}}></div>
                            <div className="t-content">
                                <div className="t-title" style={{height: '10px', width: '40%'}}></div>
                                <div className="t-desc" style={{height: '6px', width: '70%'}}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      <section className="container feature-section reversed reveal-on-scroll">
        <div className="feature-text">
            <h2 data-i18n="feat2.title">Profile i <br/>Motywacje Postaci</h2>
            <p data-i18n="feat2.desc">Każdy bohater dostaje swoją kartotekę. Zrozum powiązania, cechy charakteru i ukryte motywy. Streść.to tworzy mapę relacji, która sprawia, że nawet "Wesele" staje się zrozumiałe.</p>
        </div>
        <div className="feature-visual">
            <div className="web-screen-mockup" style={{transform: 'rotateY(-10deg) rotateX(5deg)'}}>
                <div className="web-header">
                    <div className="web-dot"></div><div className="web-dot"></div><div className="web-dot"></div>
                    <div style={{fontSize: '8px', color: '#999', marginLeft: 'auto'}} data-i18n="mockup.characters">Postacie</div>
                </div>
                <div className="web-content">
                    <div className="chars-grid">
                        <div className="char-card">
                            <div className="char-avatar"></div>
                            <div className="char-name"></div>
                            <div className="char-role"></div>
                        </div>
                        <div className="char-card">
                            <div className="char-avatar" style={{backgroundColor: 'var(--burnt-orange)'}}></div>
                            <div className="char-name"></div>
                            <div className="char-role"></div>
                        </div>
                        <div className="char-card">
                            <div className="char-avatar" style={{backgroundColor: '#ddd'}}></div>
                            <div className="char-name"></div>
                            <div className="char-role"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      <section className="container feature-section reveal-on-scroll">
        <div className="feature-text">
            <h2 data-i18n="feat3.title">Interaktywne <br/>Quizy i Testy</h2>
            <p data-i18n="feat3.desc">Sprawdź swoją wiedzę po każdej lekturze. Nasze quizy pomagają utrwalić najważniejsze fakty i motywy, przygotowując Cię do sprawdzianów i matury w mgnieniu oka.</p>
        </div>
        <div className="feature-visual">
            <div className="web-screen-mockup" style={{transform: 'rotateY(10deg) rotateX(5deg)'}}>
                <div className="web-header">
                    <div className="web-dot"></div><div className="web-dot"></div><div className="web-dot"></div>
                    <div style={{fontSize: '8px', color: '#999', marginLeft: 'auto'}} data-i18n="mockup.quizzes">Quizy</div>
                </div>
                <div className="web-content">
                    <div className="quiz-ui">
                        <div className="quiz-question" style={{height: '14px', marginBottom: '16px'}}></div>
                        <div className="quiz-option correct" style={{padding: '12px', marginBottom: '8px'}}>
                            <div className="quiz-check"></div>
                            <div className="quiz-text" style={{width: '70%', height: '8px'}}></div>
                        </div>
                        <div className="quiz-option" style={{padding: '12px', marginBottom: '8px'}}>
                            <div className="quiz-check"></div>
                            <div className="quiz-text" style={{width: '50%', height: '8px'}}></div>
                        </div>
                        <div className="quiz-option" style={{padding: '12px'}}>
                            <div className="quiz-check"></div>
                            <div className="quiz-text" style={{width: '60%', height: '8px'}}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      <section className="container feature-section reversed reveal-on-scroll">
        <div className="feature-text">
            <h2 data-i18n="feat4.title">Perfekcyjna <br/>Rozprawka</h2>
            <p data-i18n="feat4.desc">Generuj gotowe argumenty, tezy i konteksty do Twojej rozprawki. Zrozum, jak wykorzystać lekturę w tematach maturalnych.</p>
        </div>
        <div className="feature-visual">
            <div className="web-screen-mockup" style={{transform: 'rotateY(-10deg) rotateX(5deg)'}}>
                <div className="web-header">
                    <div className="web-dot"></div><div className="web-dot"></div><div className="web-dot"></div>
                    <div style={{fontSize: '8px', color: '#999', marginLeft: 'auto'}} data-i18n="mockup.essay">Rozprawka</div>
                </div>
                <div className="web-content">
                    <div className="essay-ui">
                        <div style={{display: 'flex', gap: '8px', marginBottom: '12px'}}>
                            <div style={{padding: '4px 8px', borderRadius: '12px', border: '1px solid var(--ink)', fontSize: '8px'}}>Tezy</div>
                            <div style={{padding: '4px 8px', borderRadius: '12px', background: 'var(--ink)', color: '#fff', fontSize: '8px'}}>Argumenty</div>
                            <div style={{padding: '4px 8px', borderRadius: '12px', border: '1px solid var(--ink)', fontSize: '8px'}}>Kontekst</div>
                        </div>
                        <div className="essay-block">
                            <div className="essay-label" style={{width: '40px', background: 'var(--forest-green)'}}></div>
                            <div className="essay-line" style={{height: '8px', width: '90%', marginBottom: '12px'}}></div>
                            <div className="essay-line"></div>
                            <div className="essay-line"></div>
                            <div className="essay-line short"></div>
                        </div>
                        <div className="essay-block">
                            <div className="essay-label" style={{width: '60px', background: 'var(--burnt-orange)'}}></div>
                            <div className="essay-line" style={{height: '8px', width: '80%', marginBottom: '12px'}}></div>
                            <div className="essay-line"></div>
                            <div className="essay-line short"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      <div className="footer-cta reveal-on-scroll">
        <h2 data-i18n="footer.title">Gotowy na czystą wiedzę?</h2>
        <div className="btn-group" style={{justifyContent: 'center'}}>
            <a href="https://play.google.com/store/apps/details?id=com.ronimstudio.strescto" className="btn btn-primary" data-i18n="btn.download">Pobierz Aplikację</a>
        </div>
      </div>
    </>
  )
}
