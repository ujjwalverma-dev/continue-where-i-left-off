type WaveformProps = { active: boolean };

const heights = [18, 32, 46, 26, 54, 37, 22, 43, 58, 29, 48, 20, 35, 52, 25, 40, 18, 31];

export function Waveform({ active }: WaveformProps) {
  return <div className={`waveform ${active ? "active" : ""}`} aria-hidden="true">{heights.map((height, index) => <span className="wave-bar" key={index} style={{ height }} />)}</div>;
}
