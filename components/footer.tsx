export function Footer() {
  return (
    <footer className="border-t border-neutral-800 bg-black py-8"> {/* yahan py-8 kiya hai */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex flex-col items-center md:items-start">
            <span className="text-lg font-bold text-white">VeriDrive<span className="text-teal-400">.ai</span></span>
          </div>
          
          <div className="flex gap-6">
            <a href="#" className="text-xs text-neutral-500 hover:text-teal-400 transition-colors">Privacy</a>
            <a href="#" className="text-xs text-neutral-500 hover:text-teal-400 transition-colors">Terms</a>
            <a href="#" className="text-xs text-neutral-500 hover:text-teal-400 transition-colors">Contact</a>
          </div>
        </div>
        
        <div className="mt-6 border-t border-neutral-900 pt-6 text-center">
          <p className="text-[10px] text-neutral-700">
            © {new Date().getFullYear()} VeriDrive AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}