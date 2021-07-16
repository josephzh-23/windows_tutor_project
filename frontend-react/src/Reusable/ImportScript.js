// Used to import js file into React component 
// Safe to use

// The script is removed in return - which means when the component unmounts

import { useEffect } from 'react';
const ImportScript = resourceUrl=> {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = resourceUrl;
    script.async = true;
    document.body.appendChild(script);
return () => {
      document.body.removeChild(script);
    }
  }, [resourceUrl]);
};

export default ImportScript