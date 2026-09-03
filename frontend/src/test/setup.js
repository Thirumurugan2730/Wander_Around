import '@testing-library/jest-dom';

// Polyfill URL.createObjectURL and URL.revokeObjectURL for jsdom
if (typeof window !== 'undefined') {
  window.URL.createObjectURL = () => 'blob:http://localhost:5173/fake-preview-url';
  window.URL.revokeObjectURL = () => {};
}
