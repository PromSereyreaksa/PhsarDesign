import React from 'react';

export const showToast = (message, type = 'success', duration = 6000) => {
  const toastId = `toast-${Date.now()}`;
  
  const toast = document.createElement('div');
  toast.id = toastId;
  toast.className = `
    fixed top-4 right-4 z-[99999] p-5 rounded-xl shadow-2xl max-w-md min-w-[320px]
    transform translate-x-full transition-all duration-300 ease-out
    ${type === 'success' ? 'bg-gradient-to-r from-green-500 to-green-600 text-white border border-green-400' : ''}
    ${type === 'error' ? 'bg-gradient-to-r from-red-500 to-red-600 text-white border border-red-400' : ''}
    ${type === 'info' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border border-blue-400' : ''}
    backdrop-blur-sm
  `;
  
  const icon = type === 'success' 
    ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>'
    : type === 'error'
    ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>'
    : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>';
  
  const getTitle = () => {
    switch(type) {
      case 'success': return '🎉 Success!';
      case 'error': return '❌ Error!';
      case 'info': return 'ℹ️ Info';
      default: return 'Notification';
    }
  };
  
  toast.innerHTML = `
    <div class="flex items-start">
      <div class="flex-shrink-0">
        <svg class="w-7 h-7 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          ${icon}
        </svg>
      </div>
      <div class="flex-1 min-w-0">
        <p class="font-semibold text-lg mb-1">${getTitle()}</p>
        <p class="text-sm leading-relaxed opacity-95">${message}</p>
      </div>
      <button onclick="document.getElementById('${toastId}').remove()" class="ml-3 p-1 rounded-lg hover:bg-white/20 transition-colors flex-shrink-0">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
    ${type === 'success' ? `
      <div class="absolute bottom-0 left-0 h-1 bg-white/30 rounded-b-xl transition-all duration-${duration} ease-linear" style="width: 100%; animation: shrink ${duration}ms linear forwards;"></div>
    ` : ''}
  `;
  
  // Add CSS for progress bar animation
  if (type === 'success' && !document.getElementById('toast-styles')) {
    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.textContent = `
      @keyframes shrink {
        from { width: 100%; }
        to { width: 0%; }
      }
    `;
    document.head.appendChild(style);
  }
  
  document.body.appendChild(toast);
  
  // Animate in
  setTimeout(() => {
    toast.style.transform = 'translateX(0)';
  }, 10);
  
  // Auto-remove
  const timeoutId = setTimeout(() => {
    if (document.getElementById(toastId)) {
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }
  }, duration);
  
  return { toastId, timeoutId };
};

export default { showToast };