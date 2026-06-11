import React from 'react';

interface ExpertAvatarProps {
  name: string;
  image?: string | null;
  /** Classes applied to the root element (img or fallback div) — e.g. positioning. */
  className?: string;
  /** Tailwind text-size class for the monogram fallback. */
  initialsClass?: string;
  /** object-position for the photo (faces usually sit high). */
  objectClass?: string;
}

const initialsOf = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase();

// Tasteful, deterministic gradient per name so monogram avatars feel intentional.
const GRADIENTS = [
  'linear-gradient(135deg, #3B4A6B, #1E293B)',
  'linear-gradient(135deg, #4B3B6B, #241B33)',
  'linear-gradient(135deg, #6B4B3B, #33231B)',
  'linear-gradient(135deg, #3B6B5A, #1B332B)',
  'linear-gradient(135deg, #6B3B53, #331B28)',
  'linear-gradient(135deg, #5A5A6B, #2B2B33)',
];

const gradientFor = (name: string): string => {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return GRADIENTS[h % GRADIENTS.length];
};

export const ExpertAvatar: React.FC<ExpertAvatarProps> = ({
  name,
  image,
  className = '',
  initialsClass = 'text-3xl',
  objectClass = 'object-top',
}) => {
  if (image) {
    return (
      <img
        src={image}
        alt={name}
        className={`w-full h-full object-cover ${objectClass} ${className}`}
      />
    );
  }
  return (
    <div
      className={`w-full h-full flex items-center justify-center ${className}`}
      style={{ background: gradientFor(name) }}
      aria-label={name}
    >
      <span className={`font-bold tracking-wide text-white/90 ${initialsClass}`}>
        {initialsOf(name)}
      </span>
    </div>
  );
};

export default ExpertAvatar;
