// Scroll order of the experience. The 3D camera and the side-nav both read this,
// so the world and the DOM stay in lockstep.
export const SECTIONS = [
  { id: 'hero', label: 'Start', scene: 'hero' },
  { id: 'composition', label: 'Body', scene: 'composition' },
  { id: 'journey', label: 'Descent', scene: 'journey' },
  { id: 'targets', label: 'Fuel', scene: 'targets' },
  { id: 'system', label: 'System', scene: 'system' },
  { id: 'flags', label: 'Flags', scene: 'flags' },
];

export const TOTAL_DEPTH = 130; // world units the camera travels top-to-bottom

// Vertical center of each scene in world space, aligned so a scene is dead-center
// on screen exactly when its DOM section is centered in the viewport.
// Section i is centered at scroll progress i/(N-1); the camera looks at
// y = -progress * TOTAL_DEPTH, so the scene must live at that same y.
export function sceneY(index) {
  const n = SECTIONS.length - 1;
  return -(index / n) * TOTAL_DEPTH;
}
