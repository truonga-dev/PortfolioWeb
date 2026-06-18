const mongoose = require('mongoose');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const Project = require('./models/Project');
const Skill = require('./models/Skill');
const Blog = require('./models/Blog');
const Settings = require('./models/Settings');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Project.deleteMany({});
    await Skill.deleteMany({});
    await Blog.deleteMany({});
    await Settings.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // ============ SEED PROJECTS ============
    const projects = await Project.insertMany([
      {
        title: 'REACH Church App',
        description: 'Ứng dụng nhà thờ giúp quản lý thành viên, sự kiện và gửi thông báo đến cộng đồng.',
        longDescription: 'REACH Church App là ứng dụng di động và web giúp các nhà thờ quản lý thành viên, tổ chức sự kiện, gửi thông báo đẩy và chia sẻ tài liệu. Xây dựng với React Native cho mobile và React cho web, backend Node.js với MongoDB.',
        technologies: ['React Native', 'React', 'Node.js', 'Express', 'MongoDB', 'Firebase', 'Push Notification'],
        category: 'mobile',
        status: 'completed',
        featured: true,
        liveUrl: 'https://reach-church-app.vercel.app',
        githubUrl: 'https://github.com/truonga-dev/REACH_Church_App',
        challenges: ['Real-time notification', 'Offline mode', 'Đồng bộ dữ liệu đa nền tảng'],
        learnings: ['React Native', 'Firebase Cloud Messaging', 'Real-time sync', 'Mobile UI/UX'],
        startDate: new Date('2024-08-01'),
        endDate: new Date('2024-12-15')
      },
      {
        title: 'Personal Portfolio 3D',
        description: 'Portfolio cá nhân với hiệu ứng 3D, terminal ảo, đa ngôn ngữ và admin panel.',
        longDescription: 'Portfolio full-stack với React, Three.js, Framer Motion. Tích hợp terminal ảo cho phép tương tác qua command line, dark/light theme, đa ngôn ngữ VN/EN, và admin panel CRUD đầy đủ.',
        technologies: ['React', 'Three.js', 'Framer Motion', 'Node.js', 'Express', 'MongoDB', 'Socket.io', 'Tailwind CSS'],
        category: 'web',
        status: 'completed',
        featured: true,
        liveUrl: 'https://truonga.dev',
        githubUrl: 'https://github.com/truonga102005vn',
        challenges: ['3D rendering performance', 'Real-time notification', 'Đa ngôn ngữ'],
        learnings: ['Three.js', 'WebGL', 'Socket.io', 'i18n', 'PWA'],
        startDate: new Date('2025-06-01'),
        endDate: new Date('2025-06-18')
      },
      {
        title: 'E-Commerce Microservices',
        description: 'Nền tảng thương mại điện tử với kiến trúc microservices, hỗ trợ 10,000+ người dùng.',
        longDescription: 'Hệ thống gồm các service: Auth, Product, Order, Payment, Notification được triển khai độc lập với Docker và Kubernetes. Sử dụng RabbitMQ cho message queue và Redis cho caching.',
        technologies: ['Node.js', 'Express', 'MongoDB', 'Redis', 'Docker', 'Kubernetes', 'RabbitMQ', 'React'],
        category: 'web',
        status: 'in-progress',
        featured: true,
        githubUrl: 'https://github.com/truonga-dev/ecommerce-microservices',
        challenges: ['Distributed transactions', 'Service discovery', 'Data consistency'],
        learnings: ['Microservices patterns', 'Kubernetes', 'Message Queue', 'System Design'],
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-08-01')
      },
      {
        title: 'AI Learning Assistant',
        description: 'Trợ lý học tập thông minh sử dụng AI giúp sinh viên tóm tắt tài liệu và tạo câu hỏi ôn tập.',
        longDescription: 'Sử dụng OpenAI API và LangChain để xây dựng chatbot thông minh có khả năng đọc PDF, tóm tắt nội dung, tạo câu hỏi trắc nghiệm và giải thích concepts phức tạp.',
        technologies: ['Python', 'FastAPI', 'LangChain', 'OpenAI', 'MongoDB', 'Docker', 'React'],
        category: 'ai-ml',
        status: 'in-progress',
        featured: false,
        githubUrl: 'https://github.com/truonga102005vn/ai-learning-assistant',
        challenges: ['Xử lý tài liệu tiếng Việt', 'Context window optimization', 'Response time'],
        learnings: ['RAG architecture', 'Prompt engineering', 'Vector databases', 'NLP'],
        startDate: new Date('2025-03-01'),
        endDate: null
      },
      {
        title: 'Task Manager Pro',
        description: 'Ứng dụng quản lý công việc với Kanban board, time tracking và team collaboration.',
        longDescription: 'Task Manager chuyên nghiệp với giao diện kéo thả, phân quyền role-based, thống kê năng suất và tích hợp calendar. Hỗ trợ real-time collaboration qua WebSocket.',
        technologies: ['React', 'TypeScript', 'Node.js', 'Socket.io', 'PostgreSQL', 'Redis', 'Docker'],
        category: 'web',
        status: 'completed',
        featured: false,
        liveUrl: 'https://taskmanager-pro.vercel.app',
        githubUrl: 'https://github.com/truonga-dev/task-manager-pro',
        challenges: ['Real-time sync', 'Drag & drop performance', 'Role-based access'],
        learnings: ['TypeScript', 'WebSocket', 'PostgreSQL', 'Drag & Drop API'],
        startDate: new Date('2024-03-01'),
        endDate: new Date('2024-07-01')
      },
      {
        title: 'DevOps CI/CD Pipeline',
        description: 'Hệ thống CI/CD tự động hóa build, test và deploy cho microservices.',
        longDescription: 'Pipeline tự động với GitHub Actions, Docker, Kubernetes. Tích hợp monitoring với Prometheus và Grafana, logging với ELK stack.',
        technologies: ['Docker', 'Kubernetes', 'GitHub Actions', 'Prometheus', 'Grafana', 'ELK Stack', 'Terraform'],
        category: 'devops',
        status: 'completed',
        featured: false,
        githubUrl: 'https://github.com/truonga102005vn/devops-pipeline',
        challenges: ['Zero-downtime deployment', 'Monitoring setup', 'Secret management'],
        learnings: ['Kubernetes', 'CI/CD', 'Infrastructure as Code', 'Monitoring'],
        startDate: new Date('2024-10-01'),
        endDate: new Date('2025-01-01')
      }
    ]);

    // ============ SEED SKILLS ============
    const skills = await Skill.insertMany([
      { name: 'React.js', category: 'frontend', level: 92, icon: '⚛️', color: '#61DAFB', yearsOfExperience: 3, isHighlighted: true },
      { name: 'React Native', category: 'frontend', level: 80, icon: '📱', color: '#61DAFB', yearsOfExperience: 1.5, isHighlighted: true },
      { name: 'TypeScript', category: 'frontend', level: 85, icon: '📘', color: '#3178C6', yearsOfExperience: 2, isHighlighted: true },
      { name: 'Next.js', category: 'frontend', level: 82, icon: '▲', color: '#000000', yearsOfExperience: 1.5 },
      { name: 'Tailwind CSS', category: 'frontend', level: 90, icon: '🎨', color: '#06B6D4', yearsOfExperience: 2 },
      { name: 'Three.js', category: 'frontend', level: 70, icon: '🧊', color: '#000000', yearsOfExperience: 0.5 },
      { name: 'Node.js', category: 'backend', level: 88, icon: '🟢', color: '#339933', yearsOfExperience: 3, isHighlighted: true },
      { name: 'Express.js', category: 'backend', level: 88, icon: '🚂', color: '#000000', yearsOfExperience: 3 },
      { name: 'Python', category: 'backend', level: 72, icon: '🐍', color: '#3776AB', yearsOfExperience: 2 },
      { name: 'FastAPI', category: 'backend', level: 68, icon: '⚡', color: '#009688', yearsOfExperience: 1 },
      { name: 'GraphQL', category: 'backend', level: 60, icon: '◈', color: '#E10098', yearsOfExperience: 1 },
      { name: 'MongoDB', category: 'database', level: 85, icon: '🍃', color: '#47A248', yearsOfExperience: 3, isHighlighted: true },
      { name: 'PostgreSQL', category: 'database', level: 70, icon: '🐘', color: '#336791', yearsOfExperience: 1.5 },
      { name: 'Redis', category: 'database', level: 65, icon: '🔴', color: '#DC382D', yearsOfExperience: 1 },
      { name: 'Firebase', category: 'database', level: 75, icon: '🔥', color: '#FFCA28', yearsOfExperience: 1.5 },
      { name: 'Docker', category: 'devops', level: 80, icon: '🐳', color: '#2496ED', yearsOfExperience: 2, isHighlighted: true },
      { name: 'Kubernetes', category: 'devops', level: 55, icon: '☸️', color: '#326CE5', yearsOfExperience: 0.5 },
      { name: 'Git', category: 'tools', level: 92, icon: '📦', color: '#F05032', yearsOfExperience: 4 },
      { name: 'GitHub Actions', category: 'devops', level: 70, icon: '🔄', color: '#2088FF', yearsOfExperience: 1 },
      { name: 'AWS', category: 'devops', level: 55, icon: '☁️', color: '#FF9900', yearsOfExperience: 1 }
    ]);

    // ============ SEED BLOGS ============
    const blogs = await Blog.insertMany([
      {
        title: 'Xây dựng CI/CD Pipeline tự động với GitHub Actions',
        slug: 'build-cicd-pipeline-github-actions',
        excerpt: 'Hướng dẫn từng bước thiết lập CI/CD pipeline tự động hóa build, test và deploy ứng dụng lên Vercel chỉ trong 30 phút.',
        coverImage: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800',
        content: '<img src="https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800" alt="CI/CD" style="width:100%; border-radius:12px; margin-bottom:20px;" /><h2>CI/CD là gì?</h2><p>CI/CD (Continuous Integration/Continuous Deployment) là phương pháp phát triển phần mềm giúp tự động hóa quá trình tích hợp code và triển khai sản phẩm. Thay vì deploy thủ công mất hàng giờ, CI/CD giúp bạn deploy chỉ trong vài phút.</p><blockquote style="border-left:4px solid #6366f1; padding-left:16px; color:#94a3b8; margin:20px 0;">💡 CI/CD giúp giảm 80% thời gian deploy và 90% lỗi do con người!</blockquote><h2>Bước 1: Tạo GitHub Actions Workflow</h2><pre style="background:#1e293b; padding:16px; border-radius:8px; overflow-x:auto;"><code>name: Deploy to Vercel\non:\n  push:\n    branches: [main]\n  pull_request:\n    branches: [main]\n\njobs:\n  deploy:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v3\n      - uses: actions/setup-node@v3\n        with:\n          node-version: 18\n      - run: npm ci\n      - run: npm run test\n      - run: npm run build\n      - uses: amondnet/vercel-action@v20\n        with:\n          vercel-token: ${{ secrets.VERCEL_TOKEN }}</code></pre><h2>Bước 2: Cấu hình Secrets</h2><p>Vào Settings → Secrets and variables → Actions → Thêm VERCEL_TOKEN, API_KEY, DATABASE_URL...</p><h2>Kết quả</h2><p>Mỗi khi push code lên main, GitHub Actions tự động chạy test → build → deploy. Bạn chỉ cần ngồi uống cà phê! ☕</p>',
        tags: ['DevOps', 'CI/CD', 'GitHub Actions', 'Docker', 'Tutorial'],
        category: 'tutorial', readingTime: 8, status: 'published', likes: 156,
        comments: [
          { user: 'DevOps Engineer', content: 'Bài viết rất chi tiết! Mình đã áp dụng thành công.', date: new Date('2025-05-10') },
          { user: 'Junior Dev', content: 'Lần đầu mình hiểu CI/CD là gì. Cảm ơn bạn!', date: new Date('2025-05-11') }
        ]
      },
      {
        title: 'Hành trình học ReactJS từ Zero đến Hero trong 6 tháng',
        slug: 'hanh-trinh-hoc-reactjs-tu-zero-den-hero',
        excerpt: 'Chia sẻ lộ trình học ReactJS chi tiết từ con số 0 đến khi thành thạo, kèm theo những dự án thực tế đã xây dựng.',
        coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
        content: '<img src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800" alt="React" style="width:100%; border-radius:12px; margin-bottom:20px;" /><h2>Lộ trình 6 tháng</h2><p>Năm 2024, mình quyết định học ReactJS một cách nghiêm túc. Sau 6 tháng, mình đã build được 4 dự án thực tế và có việc làm. Đây là lộ trình chi tiết:</p><h3>Tháng 1-2: JavaScript Nền Tảng</h3><ul><li>ES6+ (Arrow Functions, Destructuring, Spread/Rest)</li><li>Array Methods (map, filter, reduce)</li><li>Promises & Async/Await</li><li>Fetch API & Axios</li></ul><h3>Tháng 3-4: React Fundamentals</h3><ul><li>Components, Props, State</li><li>Hooks (useState, useEffect, useContext, useReducer)</li><li>React Router</li><li>Form Handling</li></ul><h3>Tháng 5-6: Advanced & Projects</h3><ul><li>State Management (Redux Toolkit, Zustand)</li><li>Performance Optimization (useMemo, useCallback, lazy)</li><li>Testing (Jest, React Testing Library)</li><li>Build 4 dự án thực tế</li></ul><blockquote style="border-left:4px solid #10b981; padding-left:16px; color:#94a3b8; margin:20px 0;">🌟 "Code mỗi ngày ít nhất 2 giờ. Sau 6 tháng bạn sẽ bất ngờ về chính mình!"</blockquote>',
        tags: ['React', 'JavaScript', 'Frontend', 'Career', 'Tutorial'],
        category: 'experience', readingTime: 12, status: 'published', likes: 342,
        comments: [
          { user: 'React Beginner', content: 'Đúng lộ trình mình đang cần! Bắt đầu ngay hôm nay.', date: new Date('2025-06-01') },
          { user: 'Senior Frontend', content: 'Chia sẻ rất thực tế. Mình sẽ recommend cho intern.', date: new Date('2025-06-02') },
          { user: 'Student IT', content: 'Cảm ơn anh! Em đang học React và bài viết giúp em rất nhiều.', date: new Date('2025-06-03') }
        ]
      },
      {
        title: 'Kinh nghiệm thực tập tại công ty công nghệ: Những điều trường không dạy',
        slug: 'kinh-nghiem-thuc-tap-cong-ty-cong-nghe',
        excerpt: '3 tháng thực tập đã thay đổi hoàn toàn tư duy lập trình của mình. Đây là những bài học quý giá không có trong sách vở.',
        coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
        content: '<img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800" alt="Team" style="width:100%; border-radius:12px; margin-bottom:20px;" /><h2>3 Tháng Thay Đổi Mọi Thứ</h2><p>Tháng 6/2024, mình bắt đầu kỳ thực tập tại một công ty công nghệ. Đây là 3 tháng quý giá nhất trong hành trình học lập trình của mình.</p><h3>Điều 1: Code trong production KHÁC xa code trên lớp</h3><p>Trên lớp, bạn code 1 mình. Ở công ty, bạn code cùng team 10-20 người. Code review, coding standards, git workflow - những thứ trường không dạy.</p><h3>Điều 2: Soft skills quan trọng hơn bạn nghĩ</h3><p>Giao tiếp, làm việc nhóm, quản lý thời gian, báo cáo tiến độ - đây mới là thứ quyết định thành công.</p><blockquote style="border-left:4px solid #f59e0b; padding-left:16px; color:#94a3b8; margin:20px 0;">💡 "Đừng ngại hỏi khi không biết. Im lặng là cách nhanh nhất để thất bại."</blockquote><h3>Điều 3: Học cách đọc document</h3><p>Không ai có thời gian chỉ cho bạn từng dòng code. Đọc document là kỹ năng sống còn.</p>',
        tags: ['Career', 'Internship', 'Experience', 'Soft Skills'],
        category: 'career', readingTime: 10, status: 'published', likes: 267,
        comments: [
          { user: 'Sinh viên năm 3', content: 'Bài viết mở mang tầm mắt! Em sẽ chuẩn bị tốt hơn cho kỳ thực tập.', date: new Date('2025-04-20') }
        ]
      },
      {
        title: 'Microservices vs Monolith: Khi nào nên chọn cái nào?',
        slug: 'microservices-vs-monolith',
        excerpt: 'Phân tích ưu nhược điểm của kiến trúc Microservices và Monolithic, giúp bạn chọn đúng kiến trúc cho dự án.',
        coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
        content: '<img src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800" alt="Architecture" style="width:100%; border-radius:12px; margin-bottom:20px;" /><h2>Cuộc chiến muôn thuở</h2><p>Microservices hay Monolith? Đây là câu hỏi mà mọi developer đều gặp phải khi bắt đầu dự án mới.</p><h3>Khi nào chọn Monolith?</h3><ul><li>Dự án nhỏ, team ít hơn 5 người</li><li>MVP cần ra mắt nhanh</li><li>Chưa có kinh nghiệm với distributed systems</li></ul><h3>Khi nào chọn Microservices?</h3><ul><li>Hệ thống lớn, 10,000+ users</li><li>Team lớn, nhiều team độc lập</li><li>Cần scale từng phần riêng biệt</li></ul><blockquote style="border-left:4px solid #6366f1; padding-left:16px; color:#94a3b8; margin:20px 0;">🎯 "Start with Monolith, migrate to Microservices when needed." - Martin Fowler</blockquote>',
        tags: ['Architecture', 'Microservices', 'System Design', 'Backend'],
        category: 'technology', readingTime: 7, status: 'published', likes: 198,
        comments: []
      }
    ]);

    // ============ SEED SETTINGS ============
    const hash = await bcrypt.hash('admin123', 10);
    await Settings.insertMany([
      {
        type: 'profile',
        data: {
          name: 'Truong A',
          email: 'truonga@example.com',
          phone: '+84 123 456 789',
          location: 'Ho Chi Minh City, Vietnam',
          bio: 'Software Engineer specializing in Full-Stack Web & Mobile Development. Passionate about building products that make a difference.',
          title: 'Full-Stack Developer'
        }
      },
      {
        type: 'social',
        data: {
          github: 'https://github.com/truonga102005vn',
          linkedin: 'https://linkedin.com/in/truonga',
          twitter: 'https://twitter.com/truonga',
          devto: 'https://dev.to/truonga',
          website: 'https://truonga.dev'
        }
      },
      {
        type: 'seo',
        data: {
          siteTitle: 'Truong A - Full-Stack Developer Portfolio',
          metaDescription: 'Software Engineer | Full-Stack Developer | React, Node.js, MongoDB',
          keywords: 'developer, portfolio, react, node.js, full stack, truong a',
          googleAnalytics: ''
        }
      },
      {
        type: 'password',
        data: { hash }
      }
    ]);

    console.log('✅ Database seeded successfully!');
    console.log(`   📦 ${projects.length} projects created`);
    console.log(`   🎯 ${skills.length} skills created`);
    console.log(`   📝 ${blogs.length} blog posts created`);
    console.log(`   ⚙️ Settings initialized`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();