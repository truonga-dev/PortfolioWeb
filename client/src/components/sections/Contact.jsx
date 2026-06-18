import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { submitContact } from '../../utils/api';
import toast from 'react-hot-toast';
import { FiSend, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';
import axios from 'axios';
import { useLanguage } from '../../context/LanguageContext';

const Contact = () => {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '', budget: '' });
  const [loading, setLoading] = useState(false);
  const [contactInfo, setContactInfo] = useState({ email: '...', phone: '...', location: '...' });

  useEffect(() => {
    axios.get('https://portfoliowebapi.onrender.com/api/settings/public')
      .then(({ data }) => { if (data.data?.profile) setContactInfo(data.data.profile); })
      .catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try { await submitContact(form); toast.success('Message sent!'); setForm({ name: '', email: '', subject: '', message: '', budget: '' }); }
    catch { toast.error('Failed to send.'); }
    finally { setLoading(false); }
  };

  return (
    <section id="contact" className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">{t('get_in_touch')}</h2>
          <p className="text-gray-400">{t('contact_desc')}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Form - bên trái */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input 
              type="text" 
              value={form.name} 
              onChange={e => setForm({...form, name: e.target.value})} 
              placeholder={t('name')+' *'} 
              required 
              className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-lg text-white focus:border-primary-500 outline-none transition-colors" 
            />
            <input 
              type="email" 
              value={form.email} 
              onChange={e => setForm({...form, email: e.target.value})} 
              placeholder={t('email')+' *'} 
              required 
              className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-lg text-white focus:border-primary-500 outline-none transition-colors" 
            />
            <input 
              type="text" 
              value={form.subject} 
              onChange={e => setForm({...form, subject: e.target.value})} 
              placeholder={t('subject')} 
              className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-lg text-white focus:border-primary-500 outline-none transition-colors" 
            />
            <textarea 
              value={form.message} 
              onChange={e => setForm({...form, message: e.target.value})} 
              placeholder={t('message')+' *'} 
              required 
              rows="5" 
              className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-lg text-white focus:border-primary-500 outline-none transition-colors resize-none" 
            />
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full md:w-auto px-8 py-3 bg-primary-600 hover:bg-primary-700 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 font-semibold"
            >
              {loading ? t('sending') : t('send_message')} <FiSend />
            </button>
          </form>

          {/* Contact Info - bên phải, hiển thị cả trên mobile */}
          <div className="space-y-6 md:space-y-6">
            {/* Email */}
            <div className="flex items-center gap-4 p-4 bg-dark-800/50 border border-white/10 rounded-2xl hover:border-primary-500/30 transition-all">
              <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <FiMail className="text-primary-400 text-xl" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-400 uppercase tracking-wider">{t('email')}</p>
                <p className="font-medium text-sm md:text-base truncate">{contactInfo.email}</p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-4 p-4 bg-dark-800/50 border border-white/10 rounded-2xl hover:border-primary-500/30 transition-all">
              <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <FiMapPin className="text-primary-400 text-xl" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-400 uppercase tracking-wider">{t('location')}</p>
                <p className="font-medium text-sm md:text-base truncate">{contactInfo.location}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-4 p-4 bg-dark-800/50 border border-white/10 rounded-2xl hover:border-primary-500/30 transition-all">
              <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <FiPhone className="text-primary-400 text-xl" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-400 uppercase tracking-wider">{t('phone')}</p>
                <p className="font-medium text-sm md:text-base truncate">{contactInfo.phone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;