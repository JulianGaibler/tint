<div>
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="10" cy="2" r="2" />
    <circle cx="18" cy="10" r="2" />
    <circle cx="10" cy="18" r="2" />
    <circle cx="2" cy="10" r="2" />
  </svg>
</div>

<style>div {
  line-height: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

svg {
  fill: var(--tint-text-accent);
  animation: rotate 1s cubic-bezier(0.65, 0.05, 0.36, 1) infinite;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(45deg);
  }
  100% {
    transform: rotate(90deg);
  }
}</style>
