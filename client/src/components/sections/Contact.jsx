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
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder={t('name')+' *'} required className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-lg text-white" />
            <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder={t('email')+' *'} required className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-lg text-white" />
            <input type="text" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} placeholder={t('subject')} className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-lg text-white" />
            <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} placeholder={t('message')+' *'} required rows="5" className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-lg text-white" />
            <button type="submit" disabled={loading} className="px-6 py-3 bg-primary-600 rounded-lg flex items-center gap-2">
              {loading ? t('sending') : t('send_message')} <FiSend />
            </button>
          </form>
          <div className="space-y-6">
            <div className="flex items-center gap-4"><div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center"><FiMail className="text-primary-400" /></div><div><p className="text-sm text-gray-400">{t('email')}</p><p className="font-medium">{contactInfo.email}</p></div></div>
            <div className="flex items-center gap-4"><div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center"><FiMapPin className="text-primary-400" /></div><div><p className="text-sm text-gray-400">{t('location')}</p><p className="font-medium">{contactInfo.location}</p></div></div>
            <div className="flex items-center gap-4"><div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center"><FiPhone className="text-primary-400" /></div><div><p className="text-sm text-gray-400">{t('phone')}</p><p className="font-medium">{contactInfo.phone}</p></div></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;