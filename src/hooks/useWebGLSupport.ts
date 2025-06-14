
import { useState, useEffect } from 'react';

export function useWebGLSupport() {
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    // Esto se ejecuta solo una vez para verificar el soporte de WebGL en el navegador.
    const canvas = document.createElement('canvas');
    try {
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl || !(gl instanceof WebGLRenderingContext)) {
        console.error('WebGL no está soportado en este navegador.');
        setIsSupported(false);
      }
    } catch (e) {
      console.error('No se pudo verificar el soporte de WebGL:', e);
      setIsSupported(false);
    }
  }, []);

  return isSupported;
}
