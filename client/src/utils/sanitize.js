import DOMPurify from 'dompurify';

export const sanitizeHTML = (html) => {
  if (!html) return '';
  
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'strong', 'em', 'u', 's', 'a',
      'ul', 'ol', 'li',
      'blockquote', 'pre', 'code',
      'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'div', 'span', 'hr',
      'iframe'
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'rel', 'src', 'alt', 'width', 'height',
      'class', 'id', 'style', 'title',
      'frameborder', 'allowfullscreen', 'loading'
    ],
    ALLOW_DATA_ATTR: false,
    ALLOWED_URI_REGEXP: /^(?:(?:https?|ftp):\/\/|mailto:|tel:|\/|data:image\/)/i,
  });
};

export const stripHTML = (html) => {
  if (!html) return '';
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};