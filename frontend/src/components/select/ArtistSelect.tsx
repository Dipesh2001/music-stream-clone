import React, { useState, useEffect, useRef } from 'react';
import { useGetArtistsQuery } from '../../store/api/artistApi';
import Label from '../form/Label';

interface ArtistSelectProps {
  selectedArtistIds: string[]; // Array for multi-select (or single-select as an array of 1)
  onArtistChange: (artistIds: string[]) => void; // Callback for selected artist IDs
  label?: string;
  placeholder?: string;
  isMulti?: boolean; // Flag to enable/disable multi-select behavior
  className?: string; // For additional styling on the wrapper div
  disabled?: boolean;
}

const ArtistSelect: React.FC<ArtistSelectProps> = ({
  selectedArtistIds = [],
  onArtistChange,
  label = 'Select Artist(s)',
  placeholder = 'Type to search and select artist(s)...',
  isMulti = false,
  className = '',
  disabled = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false); // To control dropdown visibility
  const selectRef = useRef<HTMLDivElement>(null); // Ref for click outside
  const inputRef = useRef<HTMLInputElement>(null); // Ref for input focus

  const { data, isLoading, isError } = useGetArtistsQuery({ search: searchTerm, limit: 100 });
  const artists = data?.data?.artists || [];

  // Filter artists based on search term
  const filteredArtists = artists.filter(
    (artist) =>
      artist.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !(isMulti && selectedArtistIds.includes(artist._id)) // Hide already selected in multi-select
  );

  // Get display info for selected artists
  // We map IDs to objects to avoid index mismatch when some artists aren't in the current view/search
  const selectedArtistObjects = selectedArtistIds
    .map((id) => {
      const artist = artists.find((a) => a._id === id);
      return artist ? { _id: artist._id, name: artist.name } : null;
    })
    .filter((a): a is { _id: string; name: string } => a !== null);

  const handleSelect = (artistId: string) => {
    if (isMulti) {
      if (!selectedArtistIds.includes(artistId)) {
        onArtistChange([...selectedArtistIds, artistId]);
      }
    } else {
      onArtistChange([artistId]);
      setIsOpen(false); // Close dropdown after single selection
    }
    setSearchTerm(''); // Clear search term after selection
    inputRef.current?.focus(); // Keep focus on input
  };

  const handleRemoveArtist = (artistId: string) => {
    onArtistChange(selectedArtistIds.filter((id) => id !== artistId));
    inputRef.current?.focus(); // Keep focus on input
  };

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Open dropdown when typing
  useEffect(() => {
    if (searchTerm.length > 0) {
      setIsOpen(true);
    }
  }, [searchTerm]);

  return (
    <div className={`relative ${className}`} ref={selectRef}>
      {label && <Label>{label}</Label>}
      <div
        className={`relative flex flex-wrap items-center w-full border rounded-lg shadow-theme-xs bg-white min-h-[44px] px-2 py-1.5 focus-within:ring-3 focus-within:border-brand-300 focus-within:ring-brand-500/20 transition-all ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : 'border-gray-300 dark:border-gray-700 dark:bg-gray-900'
          }`}
        onClick={() => {
          if (!disabled) {
            setIsOpen(true); // Open dropdown on click
            inputRef.current?.focus(); // Focus input
          }
        }}
      >
        {selectedArtistObjects.map((artist) => (
          <span
            key={artist._id}
            className="flex items-center bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-medium mr-1.5 mb-1 pl-2.5 py-1 rounded-md"
          >
            {artist.name}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation(); // Prevent opening dropdown again
                handleRemoveArtist(artist._id);
              }}
              className="ml-1.5 px-1 hover:text-brand-800 dark:hover:text-brand-300 focus:outline-none"
              disabled={disabled}
            >
              &times;
            </button>
          </span>
        ))}

        <input
          ref={inputRef}
          type="text"
          className="flex-grow focus:outline-none border-none p-0 text-gray-900 dark:text-white/90 placeholder-gray-400 dark:placeholder:text-white/30 bg-transparent min-w-[50px] text-sm"
          placeholder={selectedArtistIds.length === 0 ? placeholder : ''} // Only show placeholder if nothing selected
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsOpen(true)}
          disabled={disabled}
        />
      </div>

      {isOpen && (isLoading || isError || filteredArtists.length > 0 || searchTerm.length > 0) && (
        <div className="absolute z-20 w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg mt-1.5 max-h-60 overflow-y-auto custom-scrollbar">
          {isLoading && <div className="p-3 text-sm text-gray-500">Loading artists...</div>}
          {isError && <div className="p-3 text-sm text-red-500">Error loading artists.</div>}
          {!isLoading && !isError && filteredArtists.length === 0 && searchTerm.length > 0 && (
            <div className="p-3 text-sm text-gray-500">No artists found for "{searchTerm}"</div>
          )}
          {!isLoading && !isError && filteredArtists.map((artist) => (
            <div
              key={artist._id}
              className="p-3 text-sm cursor-pointer hover:bg-brand-50 dark:hover:bg-brand-500/10 text-gray-800 dark:text-white/90"
              onClick={() => handleSelect(artist._id)}
            >
              {artist.name}
            </div>
          ))}
          {!isLoading && !isError && filteredArtists.length === 0 && searchTerm.length === 0 && (
            <div className="p-3 text-sm text-gray-500">Start typing to search artists</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ArtistSelect;
