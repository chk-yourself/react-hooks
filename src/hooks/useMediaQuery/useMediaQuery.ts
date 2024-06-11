import { useEffect, useState } from 'react';

/**
 * Custom hook to track the state of a media query using the Match Media API
 * 
 * @param query - The media query string to match
 * @returns A boolean indicating whether the media query matches
 */
export default function useMediaQuery(query: string): boolean {
  // State to track the match status of the media query
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    // Create a MediaQueryList object
    const mediaQueryList = window.matchMedia(query);

    // Event listener to update state when the media query match status changes
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Attach the listener
    mediaQueryList.addEventListener('change', handleChange);

    // Initial check to set the state
    setMatches(mediaQueryList.matches);

    // Cleanup listener on component unmount
    return () => {
      mediaQueryList.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
}
