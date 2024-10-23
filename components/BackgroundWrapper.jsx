export default function BackgroundWrapper({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-red-50">
      {children}
    </div>
  );
}
