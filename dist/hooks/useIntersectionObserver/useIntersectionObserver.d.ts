import type { RefObject } from 'react';
/**
 * Custom hook to check if a DOM element is visible on the screen using Intersection Observer API.
 * @param ref A ref object pointing to the DOM element to observe.
 * @param options Intersection Observer options.
 * @returns A boolean indicating whether the element is intersecting.
 */
export default function useIntersectionObserver<T extends HTMLElement>(ref: RefObject<T>, options?: IntersectionObserverInit): boolean;
