interface PhaseEndMarkerProps {
  currentPhase: number;
  phases: Array<{
    id: number;
    time: number;
    endTime: number;
  }>;
}

export default function PhaseEndMarker({ currentPhase, phases }: PhaseEndMarkerProps) {
  // Don't show marker for the last phase
  if (currentPhase >= phases.length - 1) {
    return null;
  }

  const currentPhaseData = phases[currentPhase];
  const nextPhaseData = phases[currentPhase + 1];

  if (!currentPhaseData || !nextPhaseData) {
    return null;
  }

  // Calculate the progress percentage for the end of current phase based on total timer
  const totalTimerDuration = 180; // 3 minutes = 180 seconds
  const phaseEndProgress = (currentPhaseData.endTime / totalTimerDuration) * 100;
  
  // Convert progress to angle (0-360 degrees), starting from top (0 degrees)
  let angleDegrees = (phaseEndProgress / 100) * 360;
  
  // Normalize to 0-360 range
  angleDegrees = angleDegrees % 360;
  if (angleDegrees < 0) angleDegrees += 360;
  
  // Convert to radians
  const angleRadians = angleDegrees * (Math.PI / 180);
  
  // Calculate position on the circle
  // For SVG coordinate system: 0° = top, 90° = right, 180° = bottom, 270° = left
  const radius = 45;
  const centerX = 50;
  const centerY = 50;
  
  // Convert our angle (0 = top) to standard math coordinates (0 = right)
  const mathAngle = angleRadians - Math.PI / 2;
  
  const x = centerX + radius * Math.cos(mathAngle);
  const y = centerY + radius * Math.sin(mathAngle);

  return (
    <circle
      cx={x}
      cy={y}
      r="2"
      fill="#ef4444"
      stroke="#dc2626"
      strokeWidth="1"
      className="animate-pulse"
    />
  );
} 