function stable(value) {
  return typeof value === 'string' && /^\d+\.\d+\.\d+$/.test(value) ? value.split('.').map(Number) : null;
}
export function dependencySecurityErrors({ declaredNext, lockedNext, installedNext, lockedSharp, installedSharp }) {
  const errors = [];
  const next = stable(declaredNext);
  if (!next || next[0] !== 16 || next[1] < 4 || (next[1] === 4 && next[2] < 1)) errors.push('Next.js must be pinned to an approved stable 16.x release at or above 16.4.1.');
  if (declaredNext !== lockedNext || declaredNext !== installedNext) errors.push('Declared, locked and installed Next.js versions must match.');
  const sharp = stable(installedSharp);
  if (!sharp || sharp[0] !== 0 || sharp[1] < 35 || (sharp[1] === 35 && sharp[2] < 5)) errors.push('The installed image library sharp must be at least 0.35.5 within the approved 0.x series.');
  if (lockedSharp !== installedSharp) errors.push('Locked and installed sharp versions must match.');
  return errors;
}
