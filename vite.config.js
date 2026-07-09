import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';
import nunjucks from 'nunjucks';

// Function to render Nunjucks templates
function renderTemplate(templatePath, data) {
  const templatesDir = resolve(__dirname, 'src/templates');
  nunjucks.configure(templatesDir, { autoescape: true });
  return nunjucks.render(templatePath, data);
}

// Custom Vite plugin
function nunjucksVitePlugin() {
  return {
    name: 'nunjucks-vite-plugin',
    
    // Handle development server
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url;
        
        // Map URLs to templates
        const routeMap = {
          '/': 'pages/index.njk',
          '/index.html': 'pages/index.njk',
          '/about': 'pages/about.njk',
          '/about.html': 'pages/about.njk',
          '/contact': 'pages/contact.njk',
          '/contact.html': 'pages/contact.njk'
        };
        
        const templatePath = routeMap[url];
        if (templatePath) {
          const page = url === '/' || url === '/index.html' ? 'home' : 
                      url.includes('about') ? 'about' : 'contact';
          try {
            const html = renderTemplate(templatePath, { page });
            res.setHeader('Content-Type', 'text/html');
            res.end(html);
          } catch (err) {
            console.error('Error rendering template:', err);
            res.statusCode = 500;
            res.end('Error rendering template');
          }
          return;
        }
        next();
      });
    },
    
    // Handle production build
    buildStart() {
      const pages = [
        { name: 'index', template: 'pages/index.njk', data: { page: 'home' } },
        { name: 'about', template: 'pages/about.njk', data: { page: 'about' } },
        { name: 'contact', template: 'pages/contact.njk', data: { page: 'contact' } }
      ];
      
      const outDir = resolve(__dirname, 'dist');
      if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
      }
      
      pages.forEach(({ name, template, data }) => {
        try {
          const html = renderTemplate(template, data);
          fs.writeFileSync(resolve(outDir, `${name}.html`), html);
          console.log(`✅ Built: ${name}.html`);
        } catch (err) {
          console.error(`❌ Error building ${name}.html:`, err);
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [nunjucksVitePlugin()],
  
  // Tell Vite to treat .njk files as assets
  assetsInclude: ['**/*.njk'],
  
  server: {
    port: 3000,
    open: true
  },
  
  build: {
    // Don't try to process .njk files as JavaScript
    rollupOptions: {
      input: {
        // We don't need actual input files since we're generating HTML
      },
      output: {
        // Only output the HTML files we generate
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      }
    },
    // Skip processing .njk files
    assetsInclude: ['**/*.njk']
  }
});