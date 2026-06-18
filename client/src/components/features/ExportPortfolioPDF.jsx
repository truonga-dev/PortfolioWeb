import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiDownload, FiLoader, FiFileText, FiClipboard, FiAward } from 'react-icons/fi';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import toast from 'react-hot-toast';

// Register fonts
pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts.vfs;

// Roboto font đã có sẵn trong pdfmake, hỗ trợ ký tự Latin + 1 số Unicode
pdfMake.fonts = {
  Roboto: {
    normal: 'Roboto-Regular.ttf',
    bold: 'Roboto-Medium.ttf',
    italics: 'Roboto-Italic.ttf',
    bolditalics: 'Roboto-MediumItalic.ttf'
  }
};

const ExportPortfolioPDF = ({ profile, projects, skills }) => {
  const [loading, setLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  // Helper: Tạo star rating text
  const getStars = (rating) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(5 - full - (half ? 1 : 0));
  };

  // ═══════════════════════════════════════
  // FULL PORTFOLIO PDF
  // ═══════════════════════════════════════
  const exportFullPDF = async () => {
    setLoading(true);
    try {
      const today = new Date().toLocaleDateString('vi-VN');

      // Build skills table
      const skillCategories = {};
      if (skills && skills.length > 0) {
        skills.forEach(s => {
          if (!skillCategories[s.category]) skillCategories[s.category] = [];
          skillCategories[s.category].push(s);
        });
      }

      const skillSections = [];
      Object.entries(skillCategories).forEach(([category, categorySkills]) => {
        skillSections.push({
          text: category.toUpperCase(),
          style: 'skillCategory',
          margin: [0, 8, 0, 4]
        });
        
        categorySkills.forEach(skill => {
          skillSections.push({
            columns: [
              { text: skill.name, style: 'skillName', width: '25%' },
              {
                table: {
                  body: [[
                    { text: '', fillColor: '#6366f1', border: [0, 0, 0, 0] }
                  ]],
                  widths: [`${skill.level}%`]
                },
                layout: 'noBorders',
                width: '55%',
                margin: [0, 3, 0, 0]
              },
              { text: `${skill.level}%`, style: 'skillLevel', width: '20%', alignment: 'right' }
            ],
            columnGap: 8,
            margin: [0, 2, 0, 0]
          });
        });
      });

      // Build projects list
      const projectList = [];
      if (projects && projects.length > 0) {
        projects.slice(0, 6).forEach(project => {
          projectList.push({
            stack: [
              { text: project.title, style: 'projectTitle' },
              { text: project.description || '', style: 'projectDesc', margin: [0, 3, 0, 5] },
              project.technologies ? {
                text: project.technologies.slice(0, 6).join('  •  '),
                style: 'projectTech',
                margin: [0, 0, 0, 8]
              } : {},
              project.averageRating ? {
                text: `${getStars(project.averageRating)}  ${project.averageRating}/5  (${project.totalRatings || 0} reviews)`,
                style: 'ratingText',
                margin: [0, 0, 0, 12]
              } : {},
            ],
            margin: [0, 0, 0, 8]
          });
        });
      }

      const docDefinition = {
        pageSize: 'A4',
        pageMargins: [25, 25, 25, 25],
        defaultStyle: { font: 'Roboto', fontSize: 10, color: '#333333' },
        
        content: [
          // ═══════ HEADER ═══════
          {
            canvas: [
              { type: 'rect', x: 0, y: 0, w: 515.28, h: 90, color: '#6366f1' }
            ],
            absolutePosition: { x: 0, y: 0 }
          },
          {
            text: profile?.name || 'YOUR NAME',
            style: 'nameTitle',
            color: '#FFFFFF',
            margin: [0, 15, 0, 0]
          },
          {
            text: profile?.title || 'Software Engineer',
            style: 'jobTitle',
            color: '#E0E7FF',
            margin: [0, 2, 0, 20]
          },

          // ═══════ CONTACT INFO ═══════
          {
            columns: [
              { text: `📧 ${profile?.email || 'email@example.com'}`, style: 'contactText', width: '50%' },
              { text: `📱 ${profile?.phone || '+84 123 456 789'}`, style: 'contactText', width: '50%' }
            ],
            margin: [0, 0, 0, 3]
          },
          {
            columns: [
              { text: `📍 ${profile?.location || 'Vietnam'}`, style: 'contactText', width: '50%' },
              { text: `🌐 ${profile?.website || 'yourname.dev'}`, style: 'contactText', width: '50%' }
            ],
            margin: [0, 0, 0, 25]
          },

          // ═══════ ABOUT ═══════
          { text: '📋 ABOUT ME', style: 'sectionHeader', margin: [0, 0, 0, 8] },
          { text: profile?.bio || 'Software Engineer passionate about building amazing products.', style: 'bodyText', margin: [0, 0, 0, 20] },

          // ═══════ SKILLS ═══════
          { text: '🎯 SKILLS', style: 'sectionHeader', margin: [0, 0, 0, 8] },
          ...skillSections,
          { text: '', margin: [0, 10, 0, 0] },

          // ═══════ PROJECTS ═══════
          { text: '💻 PROJECTS', style: 'sectionHeader', margin: [0, 15, 0, 8], pageBreak: 'before' },
          ...projectList,
        ],

        styles: {
          nameTitle: { fontSize: 28, bold: true, font: 'Roboto' },
          jobTitle: { fontSize: 13, font: 'Roboto', italics: true },
          contactText: { fontSize: 9, color: '#555555', font: 'Roboto' },
          sectionHeader: { fontSize: 16, bold: true, color: '#6366f1', font: 'Roboto', decoration: 'underline', decorationColor: '#6366f1' },
          bodyText: { fontSize: 10, lineHeight: 1.5, color: '#444444', font: 'Roboto' },
          skillCategory: { fontSize: 11, bold: true, color: '#6366f1', font: 'Roboto' },
          skillName: { fontSize: 9, font: 'Roboto' },
          skillLevel: { fontSize: 8, color: '#888888', font: 'Roboto' },
          projectTitle: { fontSize: 13, bold: true, color: '#1F2937', font: 'Roboto' },
          projectDesc: { fontSize: 9, color: '#666666', lineHeight: 1.4, font: 'Roboto' },
          projectTech: { fontSize: 8, color: '#6366f1', font: 'Roboto' },
          ratingText: { fontSize: 8, color: '#F59E0B', font: 'Roboto' },
        },

      };

      pdfMake.createPdf(docDefinition).download(`Portfolio-${profile?.name?.replace(/\s/g, '-') || 'Your-Name'}.pdf`);
      toast.success('Full Portfolio PDF downloaded! 🎉');
    } catch (err) {
      toast.error('Failed to export PDF');
      console.error(err);
    } finally {
      setLoading(false);
      setShowOptions(false);
    }
  };

  // ═══════════════════════════════════════
  // SIMPLE RESUME PDF
  // ═══════════════════════════════════════
  const exportSimplePDF = async () => {
    setLoading(true);
    try {
      const docDefinition = {
        pageSize: 'A4',
        pageMargins: [30, 30, 30, 30],
        content: [
          // Header
          {
            canvas: [
              { type: 'rect', x: 0, y: 0, w: 515.28, h: 80, color: '#6366f1' }
            ],
            absolutePosition: { x: 0, y: 0 }
          },
          { text: profile?.name || 'YOUR NAME', style: 'name', color: '#FFFFFF', margin: [0, 12, 0, 0] },
          { text: profile?.title || 'Software Engineer', style: 'title', color: '#E0E7FF', margin: [0, 4, 0, 0] },

          // Contact
          { text: 'CONTACT INFORMATION', style: 'section', margin: [0, 40, 0, 10] },
          { text: `📧  ${profile?.email || 'email@example.com'}`, style: 'info', margin: [0, 0, 0, 5] },
          { text: `📱  ${profile?.phone || '+84 123 456 789'}`, style: 'info', margin: [0, 0, 0, 5] },
          { text: `📍  ${profile?.location || 'Vietnam'}`, style: 'info', margin: [0, 0, 0, 5] },
          { text: `🌐  ${profile?.website || 'yourname.dev'}`, style: 'info', margin: [0, 0, 0, 20] },

          // About
          { text: 'ABOUT', style: 'section', margin: [0, 0, 0, 10] },
          { text: profile?.bio || 'Software Engineer passionate about building amazing products.', style: 'about', margin: [0, 0, 0, 20] },

          // Skills Summary
          skills && skills.length > 0 ? { text: 'KEY SKILLS', style: 'section', margin: [0, 0, 0, 10] } : {},
          skills && skills.length > 0 ? {
            text: skills.slice(0, 8).map(s => s.name).join('  •  '),
            style: 'skills',
            margin: [0, 0, 0, 20]
          } : {},

          // Projects Summary
          projects && projects.length > 0 ? { text: 'FEATURED PROJECTS', style: 'section', margin: [0, 0, 0, 10] } : {},
          ...(projects && projects.length > 0 ? projects.slice(0, 3).map(p => ({
            text: `▸ ${p.title}`,
            style: 'projectItem',
            margin: [0, 0, 0, 5]
          })) : []),
        ],
        styles: {
          name: { fontSize: 26, bold: true },
          title: { fontSize: 13, italics: true },
          section: { fontSize: 14, bold: true, color: '#6366f1', decoration: 'underline', decorationColor: '#6366f1' },
          info: { fontSize: 11, color: '#444444' },
          about: { fontSize: 11, color: '#555555', lineHeight: 1.5 },
          skills: { fontSize: 10, color: '#6366f1' },
          projectItem: { fontSize: 11, color: '#333333', bold: true },
        }
      };

      pdfMake.createPdf(docDefinition).download(`Resume-${profile?.name?.replace(/\s/g, '-') || 'Your-Name'}.pdf`);
      toast.success('Simple Resume PDF downloaded! 📄');
    } catch (err) {
      toast.error('Failed to export');
    } finally {
      setLoading(false);
      setShowOptions(false);
    }
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowOptions(!showOptions)}
        className="px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg shadow-primary-500/20 text-white"
      >
        {loading ? <FiLoader className="animate-spin" /> : <FiDownload />}
        {loading ? 'Exporting...' : 'Download CV'}
      </motion.button>

      <AnimatePresence>
        {showOptions && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full mt-2 right-0 bg-dark-800 border border-white/10 rounded-2xl p-3 shadow-2xl z-50 w-72"
          >
            <button onClick={exportFullPDF} disabled={loading}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl transition-colors text-left">
              <span className="w-10 h-10 bg-primary-500/20 rounded-xl flex items-center justify-center text-xl"><FiAward /></span>
              <div><p className="font-medium text-white text-sm">Full Portfolio</p><p className="text-xs text-gray-400">Complete CV with projects & skills</p></div>
            </button>
            <button onClick={exportSimplePDF} disabled={loading}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl transition-colors text-left">
              <span className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center text-xl"><FiClipboard /></span>
              <div><p className="font-medium text-white text-sm">Simple Resume</p><p className="text-xs text-gray-400">One-page contact summary</p></div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExportPortfolioPDF;