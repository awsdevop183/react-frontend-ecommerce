export default function QuantityStepper({ value, onChange, max = 99, min = 1, label = 'Quantity' }) {
  const clamp = (next) => Math.max(min, Math.min(next, max))

  return (
    <div className="stepper" role="group" aria-label={label}>
      <button
        type="button"
        onClick={() => onChange(clamp(value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        −
      </button>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        aria-label={label}
        onChange={(event) => {
          const parsed = Number.parseInt(event.target.value, 10)
          if (!Number.isNaN(parsed)) onChange(clamp(parsed))
        }}
      />
      <button
        type="button"
        onClick={() => onChange(clamp(value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  )
}
