import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

const Testimonials = () => {
  const { t } = useLanguage();

  const testimonials = [
    {
      quote: t('testimonial1_quote') || "Working with A was an absolute pleasure. Their code quality and attention to detail are exceptional.",
      name: t('testimonial1_name') || "Mentor XYZ",
      role: t('testimonial1_role') || "Senior Developer at Tech Co",
    },
    {
      quote: t('testimonial2_quote') || "Clean architecture, great communication, and delivered ahead of schedule. Highly recommended!",
      name: t('testimonial2_name') || "Client ABC",
      role: t('testimonial2_role') || "Startup Founder",
    },
    {
      quote: t('testimonial3_quote') || "Fast learner, creative problem solver, and a great team player. A rising star in tech.",
      name: t('testimonial3_name') || "Team Lead",
      role: t('testimonial3_role') || "University Project Supervisor",
    },
  ];

  return (
    <section id="testimonials" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {t('what_people_say') || 'What People Say'}
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {t('testimonials_desc') || "Feedback from people I've worked with"}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative"
            >
              <div className="text-4xl text-primary-400 mb-4">"</div>
              <p className="text-gray-300 mb-6 italic">{item.quote}</p>
              <div>
                <p className="font-bold">{item.name}</p>
                <p className="text-gray-400 text-sm">{item.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;