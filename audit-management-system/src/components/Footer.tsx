export default function Footer() {
  return (
    <footer className="bg-primary text-surface py-8 text-center border-t border-border transition-colors duration-300">
      <p className="mb-2 font-medium">
        © {new Date().getFullYear()} CleanAudits
      </p>
      <p className="text-sm text-surface/80">
        Building trust in PharmaTech through digital compliance innovation.
      </p>
    </footer>
  );
}
