import React, { useState } from 'react';
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';

export function PropertyGallery({ images = [], mainImage = '', title = 'Property Image' }) {
  const allImages = Array.from(new Set([mainImage, ...(images || [])].filter(Boolean)));
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (allImages.length === 0) {
    allImages.push('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80');
  }

  const currentImage = allImages[selectedIndex] || allImages[0];

  const handlePrev = (e) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-4">
      {/* Main Image Banner */}
      <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 group shadow-luxury">
        <img
          src={currentImage}
          alt={`${title} - View ${selectedIndex + 1}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Expand Lightbox Button */}
        <button
          onClick={() => setIsLightboxOpen(true)}
          className="absolute top-4 right-4 p-3 rounded-xl bg-slate-950/80 backdrop-blur-md text-white hover:text-gold-400 hover:bg-slate-900 border border-slate-700 transition-all shadow-lg"
          title="Full-screen image viewer"
        >
          <Maximize2 className="w-5 h-5" />
        </button>

        {/* Navigation Arrows for Main Display */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-slate-950/80 backdrop-blur-md text-white hover:text-gold-400 hover:bg-slate-900 border border-slate-700 transition-all shadow-lg opacity-80 hover:opacity-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-slate-950/80 backdrop-blur-md text-white hover:text-gold-400 hover:bg-slate-900 border border-slate-700 transition-all shadow-lg opacity-80 hover:opacity-100"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        <div className="absolute bottom-3 left-4 px-3 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-xs font-semibold text-slate-300 border border-slate-800">
          Photo {selectedIndex + 1} of {allImages.length}
        </div>
      </div>

      {/* Thumbnails Row */}
      {allImages.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative aspect-square rounded-xl overflow-hidden bg-slate-950 border-2 transition-all ${
                selectedIndex === idx
                  ? 'border-gold-500 ring-2 ring-gold-500/40 scale-95'
                  : 'border-slate-800 opacity-60 hover:opacity-100'
              }`}
            >
              <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-8 animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between text-white">
            <span className="font-serif text-lg font-bold text-gold-400">{title}</span>
            <span className="text-sm text-slate-400">
              {selectedIndex + 1} / {allImages.length}
            </span>
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-gold-500 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Lightbox Center Display */}
          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
            <img
              src={currentImage}
              alt={`Fullscreen ${selectedIndex + 1}`}
              className="max-h-[80vh] max-w-full object-contain rounded-lg shadow-2xl"
            />

            {allImages.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-2 sm:left-6 p-3 rounded-full bg-slate-900/90 text-white hover:text-gold-400 border border-slate-700 transition-all shadow-xl"
                >
                  <ChevronLeft className="w-7 h-7" />
                </button>

                <button
                  onClick={handleNext}
                  className="absolute right-2 sm:right-6 p-3 rounded-full bg-slate-900/90 text-white hover:text-gold-400 border border-slate-700 transition-all shadow-xl"
                >
                  <ChevronRight className="w-7 h-7" />
                </button>
              </>
            )}
          </div>

          {/* Lightbox Bottom Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex items-center justify-center space-x-2 overflow-x-auto py-2">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedIndex(idx)}
                  className={`w-14 h-14 rounded-lg overflow-hidden border-2 shrink-0 ${
                    selectedIndex === idx ? 'border-gold-500 scale-105' : 'border-slate-800 opacity-50'
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
