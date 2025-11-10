export default function Footer() {
  return (
    <footer className="bg-purple text-white py-8 text-center">
      <p className="mb-2">
        © {new Date().getFullYear()} Clean Audits
      </p>
      <p className="text-sm opacity-80">
        Building trust in PharmaTech through digital compliance innovation.
      </p>
    </footer>
  );
}
