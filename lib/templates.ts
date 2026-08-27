import { Template } from '@/types/html-file';

export const TEMPLATES: Template[] = [
  {
    id: 'blank',
    name: 'Blank Document',
    description: 'Start from scratch with an empty HTML file',
    icon: 'FilePlus',
    content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Page</title>
</head>
<body>
    <h1>Hello World</h1>
    <p>Start editing your HTML here.</p>
</body>
</html>`,
  },
  {
    id: 'landing',
    name: 'Landing Page',
    description: 'A modern hero section landing page',
    icon: 'LayoutTemplate',
    content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Landing Page</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, sans-serif; }
        .hero { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: linear-gradient(135deg, #0f172a, #1e3a5f); color: white; text-align: center; padding: 2rem; }
        .hero h1 { font-size: 3rem; margin-bottom: 1rem; }
        .hero p { font-size: 1.25rem; margin-bottom: 2rem; opacity: 0.85; }
        .btn { padding: 14px 40px; background: #3b82f6; color: white; border: none; border-radius: 8px; font-size: 1.1rem; cursor: pointer; transition: background 0.3s; }
        .btn:hover { background: #2563eb; }
        .features { max-width: 900px; margin: 0 auto; padding: 3rem 2rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; }
        .feature { text-align: center; }
        .feature h3 { margin-bottom: 0.5rem; color: #1e3a5f; }
    </style>
</head>
<body>
    <section class="hero">
        <h1>Your Amazing Product</h1>
        <p>Build something beautiful today</p>
        <button class="btn">Get Started</button>
    </section>
    <section class="features">
        <div class="feature">
            <h3>Fast</h3>
            <p>Lightning quick performance</p>
        </div>
        <div class="feature">
            <h3>Secure</h3>
            <p>Built with security in mind</p>
        </div>
        <div class="feature">
            <h3>Reliable</h3>
            <p>Always there when you need it</p>
        </div>
    </section>
</body>
</html>`,
  },
  {
    id: 'portfolio',
    name: 'Portfolio Card',
    description: 'A clean personal portfolio card',
    icon: 'User',
    content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, sans-serif; min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #f0f4f8; padding: 2rem; }
        .card { background: white; border-radius: 20px; padding: 3rem; max-width: 400px; text-align: center; box-shadow: 0 20px 60px rgba(0,0,0,0.1); }
        .avatar { width: 100px; height: 100px; border-radius: 50%; background: linear-gradient(135deg, #3b82f6, #1e3a5f); margin: 0 auto 1.5rem; display: flex; align-items: center; justify-content: center; color: white; font-size: 2.5rem; font-weight: bold; }
        .card h1 { font-size: 1.5rem; color: #1a1a2e; margin-bottom: 0.25rem; }
        .card .role { color: #3b82f6; font-size: 1rem; margin-bottom: 1.5rem; }
        .card .bio { color: #555; line-height: 1.6; margin-bottom: 2rem; }
        .links { display: flex; justify-content: center; gap: 1rem; }
        .links a { padding: 10px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; transition: transform 0.2s; }
        .links a:hover { transform: translateY(-2px); }
        .links .primary { background: #3b82f6; color: white; }
        .links .secondary { background: #e2e8f0; color: #334155; }
    </style>
</head>
<body>
    <div class="card">
        <div class="avatar">JD</div>
        <h1>Jane Doe</h1>
        <p class="role">Frontend Developer</p>
        <p class="bio">I create beautiful, responsive web experiences with a focus on clean design and smooth interactions.</p>
        <div class="links">
            <a href="#" class="primary">View Work</a>
            <a href="#" class="secondary">Contact</a>
        </div>
    </div>
</body>
</html>`,
  },
  {
    id: 'article',
    name: 'Blog Article',
    description: 'A readable article layout',
    icon: 'Newspaper',
    content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blog Article</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Georgia, serif; background: #fff; color: #1a1a1a; }
        .container { max-width: 700px; margin: 0 auto; padding: 3rem 1.5rem; }
        .tag { display: inline-block; background: #e0f2fe; color: #0369a1; padding: 4px 12px; border-radius: 4px; font-size: 0.85rem; margin-bottom: 1rem; }
        h1 { font-size: 2.5rem; line-height: 1.2; margin-bottom: 1rem; color: #0f172a; }
        .meta { color: #666; font-size: 0.9rem; margin-bottom: 2rem; }
        p { font-size: 1.15rem; line-height: 1.8; margin-bottom: 1.5rem; }
        blockquote { border-left: 4px solid #3b82f6; padding-left: 1.5rem; margin: 2rem 0; font-style: italic; color: #444; }
    </style>
</head>
<body>
    <article class="container">
        <span class="tag">Technology</span>
        <h1>The Future of Web Development</h1>
        <p class="meta">By Author - August 27, 2026</p>
        <p>The web is constantly evolving, and with it the tools we use to build experiences. In this article, we explore emerging trends.</p>
        <blockquote>"The best way to predict the future is to invent it." - Alan Kay</blockquote>
        <p>From responsive design to progressive web apps, the journey has been remarkable. What comes next will be even more exciting.</p>
    </article>
</body>
</html>`,
  },
];
