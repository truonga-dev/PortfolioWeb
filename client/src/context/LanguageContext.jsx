import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};

const translations = {
  en: {
    // Navbar
    home: 'Home',
    about: 'About',
    projects: 'Projects',
    skills: 'Skills',
    blog: 'Blog',
    contact: 'Contact',
    lab: 'Lab',

    // Hero
    hello: "Hello, I'm",
    contact_me: 'Contact Me',
    view_work: 'View Work',
    hours_coding: 'Hours Coding',
    projects_done: 'Projects Done',
    coffee_cups: 'Coffee Cups',
    github_stars: 'GitHub Stars',

    // About
    about_me: 'About Me',
    about_desc: 'Software Technology student passionate about creating innovative solutions and learning cutting-edge technologies.',
    who_i_am: 'Who I Am',
    who_i_am_desc1: "I'm a dedicated Software Technology student with a passion for building web applications that solve real-world problems.",
    who_i_am_desc2: "When I'm not coding, you'll find me exploring new technologies, contributing to open-source projects, or sharing knowledge through technical blog posts.",
    who_i_am_desc3: 'Currently looking for internship opportunities where I can apply my skills and grow as a developer.',
    frontend: 'Frontend',
    backend: 'Backend',
    database: 'Database',
    devops: 'DevOps',
    database_devops: 'Database & DevOps',

    // Projects
    featured_projects: 'Featured Projects',
    projects_desc: 'A selection of my recent work. Each project represents unique challenges and learning experiences.',
    all: 'All',
    web: 'Web',
    mobile: 'Mobile',
    ai_ml: 'AI/ML',
    demo: 'Demo',
    code: 'Code',
    technologies_used: 'Technologies Used',
    challenges: 'Challenges',
    what_i_learned: 'What I Learned',
    view_live_demo: 'View Live Demo',
    view_source_code: 'View Source Code',

    // Skills
    my_skills: 'My Skills',
    skills_desc: 'Technologies I work with on a daily basis',

    // Blog
    latest_articles: 'Latest Articles',
    blog_desc: 'Sharing knowledge, experiences, and insights about software development and technology.',
    read_more: 'Read More',
    min_read: 'min read',
    views: 'views',
    likes: 'Likes',
    comments: 'Comments',
    leave_comment: 'Leave a Comment',
    your_name: 'Your name',
    write_comment: 'Write your comment...',
    send: 'Send',
    share: 'Share',
    copy_link: 'Copy Link',

    // Contact
    get_in_touch: 'Get In Touch',
    contact_desc: "Have a project in mind? Let's work together.",
    name: 'Name',
    email: 'Email',
    subject: 'Subject',
    message: 'Message',
    send_message: 'Send Message',
    sending: 'Sending...',
    location: 'Location',
    phone: 'Phone',

    // Testimonials
    what_people_say: 'What People Say',
    testimonials_desc: "Feedback from people I've worked with",
    testimonial1_quote: "Working with A was an absolute pleasure. Their code quality and attention to detail are exceptional.",
    testimonial1_name: "Mentor XYZ",
    testimonial1_role: "Senior Developer at Tech Co",
    testimonial2_quote: "Clean architecture, great communication, and delivered ahead of schedule. Highly recommended!",
    testimonial2_name: "Client ABC",
    testimonial2_role: "Startup Founder",
    testimonial3_quote: "Fast learner, creative problem solver, and a great team player. A rising star in tech.",
    testimonial3_name: "Team Lead",
    testimonial3_role: "University Project Supervisor",

    // Lab
    the_lab: 'The Lab',
    lab_desc: 'Experimental mini-apps and side projects built for fun',
    lab_css_title: 'CSS Art Generator',
    lab_css_desc: 'Create beautiful CSS art with visual editor',
    lab_pathfinder_title: 'Pathfinder Visualizer',
    lab_pathfinder_desc: 'Visualize pathfinding algorithms in action',
    lab_calculator_title: 'AI Calculator',
    lab_calculator_desc: 'Smart calculator with natural language input',
    lab_markdown_title: 'Markdown Editor',
    lab_markdown_desc: 'Real-time markdown preview editor',

    // Footer
    all_rights_reserved: 'All rights reserved',
  },

  vi: {
    // Navbar
    home: 'Trang chủ',
    about: 'Giới thiệu',
    projects: 'Dự án',
    skills: 'Kỹ năng',
    blog: 'Blog',
    contact: 'Liên hệ',
    lab: 'Lab',

    // Hero
    hello: 'Xin chào, tôi là',
    contact_me: 'Liên hệ',
    view_work: 'Xem dự án',
    hours_coding: 'Giờ code',
    projects_done: 'Dự án',
    coffee_cups: 'Ly cà phê',
    github_stars: 'Sao GitHub',

    // About
    about_me: 'Về tôi',
    about_desc: 'Sinh viên Công nghệ Phần mềm đam mê tạo ra giải pháp sáng tạo và học hỏi công nghệ mới.',
    who_i_am: 'Tôi là ai',
    who_i_am_desc1: 'Tôi là sinh viên Công nghệ Phần mềm đam mê xây dựng ứng dụng web giải quyết vấn đề thực tế.',
    who_i_am_desc2: 'Khi không code, tôi khám phá công nghệ mới, đóng góp mã nguồn mở, hoặc chia sẻ kiến thức qua blog.',
    who_i_am_desc3: 'Đang tìm kiếm cơ hội thực tập để áp dụng kỹ năng và phát triển bản thân.',
    frontend: 'Giao diện',
    backend: 'Máy chủ',
    database: 'Cơ sở dữ liệu',
    devops: 'Triển khai',
    database_devops: 'CSDL & Triển khai',

    // Projects
    featured_projects: 'Dự án nổi bật',
    projects_desc: 'Một số dự án gần đây. Mỗi dự án là thử thách và bài học riêng.',
    all: 'Tất cả',
    web: 'Web',
    mobile: 'Di động',
    ai_ml: 'AI/ML',
    demo: 'Demo',
    code: 'Code',
    technologies_used: 'Công nghệ sử dụng',
    challenges: 'Thử thách',
    what_i_learned: 'Bài học',
    view_live_demo: 'Xem Demo',
    view_source_code: 'Xem Mã nguồn',

    // Skills
    my_skills: 'Kỹ năng',
    skills_desc: 'Công nghệ tôi làm việc hàng ngày',

    // Blog
    latest_articles: 'Bài viết mới',
    blog_desc: 'Chia sẻ kiến thức, kinh nghiệm về phát triển phần mềm.',
    read_more: 'Đọc thêm',
    min_read: 'phút đọc',
    views: 'lượt xem',
    likes: 'Thích',
    comments: 'Bình luận',
    leave_comment: 'Để lại bình luận',
    your_name: 'Tên bạn',
    write_comment: 'Viết bình luận...',
    send: 'Gửi',
    share: 'Chia sẻ',
    copy_link: 'Sao chép',

    // Contact
    get_in_touch: 'Liên lạc',
    contact_desc: 'Có dự án trong đầu? Hãy cùng làm việc.',
    name: 'Tên',
    email: 'Email',
    subject: 'Tiêu đề',
    message: 'Nội dung',
    send_message: 'Gửi tin nhắn',
    sending: 'Đang gửi...',
    location: 'Địa chỉ',
    phone: 'Điện thoại',

    // Testimonials
    what_people_say: 'Mọi người nói gì',
    testimonials_desc: 'Phản hồi từ những người tôi đã làm việc cùng',
    testimonial1_quote: "Làm việc với A là một niềm vui. Chất lượng code và sự tỉ mỉ thật xuất sắc.",
    testimonial1_name: "Nguyễn Văn XYZ",
    testimonial1_role: "Senior Developer tại Tech Co",
    testimonial2_quote: "Kiến trúc sạch, giao tiếp tốt, và luôn bàn giao trước hạn. Rất đáng giới thiệu!",
    testimonial2_name: "Trần Thị ABC",
    testimonial2_role: "Founder Startup",
    testimonial3_quote: "Học nhanh, sáng tạo, và làm việc nhóm tốt. Một ngôi sao đang lên trong ngành công nghệ.",
    testimonial3_name: "Thầy Lead",
    testimonial3_role: "Giảng viên hướng dẫn Đại học",

    // Lab
    the_lab: 'Phòng thí nghiệm',
    lab_desc: 'Ứng dụng nhỏ và dự án phụ được xây dựng cho vui',
    lab_css_title: 'Tạo CSS Art',
    lab_css_desc: 'Tạo hình nghệ thuật CSS với trình chỉnh sửa trực quan',
    lab_pathfinder_title: 'Mô phỏng Pathfinder',
    lab_pathfinder_desc: 'Trực quan hóa thuật toán tìm đường',
    lab_calculator_title: 'Máy tính AI',
    lab_calculator_desc: 'Máy tính thông minh với nhập liệu ngôn ngữ tự nhiên',
    lab_markdown_title: 'Soạn thảo Markdown',
    lab_markdown_desc: 'Trình soạn thảo Markdown xem trước thời gian thực',

    // Footer
    all_rights_reserved: 'Đã đăng ký bản quyền',
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'en');
  useEffect(() => { localStorage.setItem('lang', lang); }, [lang]);
  const toggleLang = () => setLang(prev => prev === 'en' ? 'vi' : 'en');
  const t = (key) => translations[lang]?.[key] || key;
  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};