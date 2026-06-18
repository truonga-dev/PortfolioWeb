import { useEffect } from 'react';
import { trackVisitor } from '../utils/api';

const useVisitorTracking = () => {
  useEffect(() => {
    const track = async () => {
      try {
        await trackVisitor({
          userAgent: navigator.userAgent,
          page: window.location.pathname,
          timestamp: new Date(),
        });
      } catch (err) {
        console.error('Failed to track visitor:', err);
      }
    };

    track();
  }, []);
};

export default useVisitorTracking;