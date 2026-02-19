export const API_BASE_URL = 'http://localhost:5000';

export const getImageUrl = (path: string | null | undefined): string => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    // Ensure we don't have double slashes if path already starts with /
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${API_BASE_URL}${normalizedPath}`;
};
