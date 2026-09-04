import React from 'react';

/**
 * NostalgicSun Component
 * Renders a dreamy, late-afternoon golden-hour sun in the upper sky.
 * Includes a glowing solar core, soft atmospheric corona, radiant halos, and warm sunbeams.
 */
export default function NostalgicSun() {
  return (
    <div className="nostalgic-sun-container" aria-hidden="true">
      {/* Soft Wide Atmospheric Sky Haze */}
      <div className="sun-ambient-haze" />

      {/* Radiant Sun Rays (Soft Golden Hour Beams) */}
      <div className="sun-light-beams" />

      {/* Outer Golden Corona Ring */}
      <div className="sun-outer-corona" />

      {/* Inner Atmospheric Halo */}
      <div className="sun-inner-halo" />

      {/* Radiant Golden Sun Disc */}
      <div className="sun-core-disc" />
    </div>
  );
}
