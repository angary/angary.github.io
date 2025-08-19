import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { execSync } from 'child_process';

// Cache directory for compiled TikZ diagrams
const CACHE_DIR = path.join(process.cwd(), 'public', 'tikz-cache');

// Ensure cache directory exists during build
function ensureCacheDir(): void {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
    console.log('✓ Created TikZ cache directory');
  }
}

// Initialize on module load
ensureCacheDir();

export interface TikzDiagram {
  id: string;
  tikzCode: string;
  svgPath: string;
}

/**
 * Check if required tools are available
 */
function checkRequiredTools(): { hasLatex: boolean; hasConverter: boolean } {
  try {
    execSync('which pdflatex', { stdio: 'ignore' });
    const hasLatex = true;
    
    let hasConverter = false;
    try {
      execSync('which pdf2svg', { stdio: 'ignore' });
      hasConverter = true;
    } catch {
      try {
        execSync('which inkscape', { stdio: 'ignore' });
        hasConverter = true;
      } catch {
        hasConverter = false;
      }
    }
    
    return { hasLatex, hasConverter };
  } catch {
    return { hasLatex: false, hasConverter: false };
  }
}

/**
 * Compile TikZ code to SVG using local LaTeX installation
 */
export async function compileTikzToSvg(tikzCode: string): Promise<string> {
  // Check if required tools are available
  const { hasLatex, hasConverter } = checkRequiredTools();
  
  if (!hasLatex || !hasConverter) {
    throw new Error('Required tools (pdflatex and pdf2svg/inkscape) not available');
  }

  // Create a hash of the TikZ code for caching
  const hash = crypto.createHash('md5').update(tikzCode).digest('hex');
  const svgFileName = `tikz-${hash}.svg`;
  const svgPath = path.join(CACHE_DIR, svgFileName);
  const publicSvgPath = `/tikz-cache/${svgFileName}`;

  // Check if SVG already exists in cache
  if (fs.existsSync(svgPath)) {
    return publicSvgPath;
  }

  // Create temporary directory
  const tempDir = fs.mkdtempSync(path.join(__dirname, 'tikz-'));
  const texFileName = `tikz-${hash}.tex`;
  const texPath = path.join(tempDir, texFileName);
  const baseName = path.basename(texFileName, '.tex');

  try {
    // Create LaTeX document
    const latexDocument = `\\documentclass[border=2pt]{standalone}
\\usepackage{tikz}
\\usepackage{pgfplots}
\\pgfplotsset{compat=1.18}
\\usetikzlibrary{arrows.meta,positioning,calc,shapes.misc}
\\begin{document}
\\begin{tikzpicture}
${tikzCode}
\\end{tikzpicture}
\\end{document}`;

    // Write LaTeX file
    fs.writeFileSync(texPath, latexDocument);

    // Compile LaTeX to PDF
    try {
      execSync(`pdflatex -interaction=batchmode "${baseName}.tex"`, { 
        cwd: tempDir, 
      });
    } catch (error) {
      const logFile = path.join(tempDir, `${baseName}.log`);
      if (fs.existsSync(logFile)) {
        const logContent = fs.readFileSync(logFile, 'utf-8');
        console.error('pdflatex log:', logContent);
      }
      throw error;
    }

    // Log files in temp directory
    const files = fs.readdirSync(tempDir);
    console.log('Files in temp dir:', files);

    const pdfPath = path.join(tempDir, `${baseName}.pdf`);
    if (!fs.existsSync(pdfPath)) {
      throw new Error('LaTeX compilation failed');
    }

    // Convert PDF to SVG
    try {
      execSync(`pdf2svg "${pdfPath}" "${svgPath}"`, { stdio: 'ignore' });
    } catch {
      // Fallback to inkscape
      execSync(`inkscape --pdf-page=1 --export-type=svg --export-filename="${svgPath}" "${pdfPath}"`, { 
        stdio: 'ignore' 
      });
    }

    if (!fs.existsSync(svgPath)) {
      throw new Error('PDF to SVG conversion failed');
    }

    console.log(`✓ Compiled TikZ diagram: ${svgFileName}`);
    return publicSvgPath;
  } catch (error) {
    console.error('Error compiling TikZ:', error);
    throw new Error(`Failed to compile TikZ: ${error}`);
  } finally {
    // Clean up temporary directory
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch (cleanupError) {
      console.warn('Failed to clean up temp directory:', cleanupError);
    }
  }
}

/**
 * Extract TikZ diagrams from markdown content and compile them
 */
export async function processTikzInMarkdown(content: string): Promise<string> {
  const tikzRegex = /```tikz\n([\s\S]*?)\n```/g;
  const diagrams: TikzDiagram[] = [];
  let processedContent = content;
  
  let match;
  while ((match = tikzRegex.exec(content)) !== null) {
    const tikzCode = match[1].trim();
    const id = crypto.createHash('md5').update(tikzCode).digest('hex').substring(0, 8);
    
    try {
      const svgPath = await compileTikzToSvg(tikzCode);
      diagrams.push({ id, tikzCode, svgPath });
      
      // Replace TikZ code block with img tag
      const replacement = `<div class="tikz-diagram">
  <img src="${svgPath}" alt="TikZ Diagram" class="tikz-svg" />
</div>`;
      
      processedContent = processedContent.replace(match[0], replacement);
    } catch (error) {
      console.error(`Failed to compile TikZ diagram: ${error}`);
      // Keep original TikZ code block if compilation fails
    }
  }
  
  return processedContent;
}

/**
 * Clean up old cached SVG files
 */
export function cleanTikzCache(): void {
  if (fs.existsSync(CACHE_DIR)) {
    const files = fs.readdirSync(CACHE_DIR);
    files.forEach(file => {
      if (file.endsWith('.svg')) {
        fs.unlinkSync(path.join(CACHE_DIR, file));
      }
    });
    console.log('✓ Cleaned TikZ cache');
  }
}
