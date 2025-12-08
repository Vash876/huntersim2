import { ref, onMounted, onUnmounted } from 'vue';

/**
 * Composable to detect mobile screen size
 * Uses 768px (md breakpoint in Tailwind) as default threshold
 */
export function useIsMobile(breakpoint = 768) {
  // Initialize with current value if window is available (client-side)
  const getIsMobile = () => typeof window !== 'undefined' ? window.innerWidth < breakpoint : false;
  const isMobile = ref(getIsMobile());

  function checkMobile() {
    isMobile.value = window.innerWidth < breakpoint;
  }

  onMounted(() => {
    // Re-check on mount in case value changed
    checkMobile();
    window.addEventListener('resize', checkMobile);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', checkMobile);
  });

  return { isMobile };
}
