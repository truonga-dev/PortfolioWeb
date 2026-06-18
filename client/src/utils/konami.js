export const konamiCode = () => {
    const code = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
    let index = 0;
  
    const handler = (e) => {
      if (e.code === code[index]) {
        index++;
        if (index === code.length) {
          alert('🎉 Konami Code Activated! Easter egg found!');
          index = 0;
        }
      } else {
        index = 0;
      }
    };
  
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  };