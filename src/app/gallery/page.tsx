import Image from "next/image";

// Simulating the 200+ photo structure for initial testing
const MOCK_GALLERY = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  url: `/placeholder-${(i % 3) + 1}.jpg`, 
  height: i % 2 === 0 ? "h-64" : "h-96",
}));

// Renders an optimized masonry grid for high-volume media
export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-black py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-12 tracking-tighter">
          The Vault
        </h1>
        
        {/* Native CSS Masonry Grid for extreme performance */}
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {MOCK_GALLERY.map((photo) => (
            <div 
              key={photo.id} 
              className={`relative w-full overflow-hidden rounded-2xl bg-neutral-900 border border-neutral-800 group break-inside-avoid ${photo.height}`}
            >
              <Image
                src={photo.url}
                alt="Memory Component"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}