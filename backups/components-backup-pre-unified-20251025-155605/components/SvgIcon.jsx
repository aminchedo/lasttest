export default function SvgIcon({ name, size = 20, className = "" }) {
  return (
    <svg className={className} width={size} height={size} aria-hidden="true">
      <use href={`#${name}`} />
    </svg>
  );
}