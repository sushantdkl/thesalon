import type { GalleryItem } from '../types';
import { studioPhotos } from './studio-photos';

// Fallback gallery when the database has none: the salon's own photo shoot.
export const galleryItems: GalleryItem[] = studioPhotos.map((photo) => ({
  title: photo.title,
  description: photo.alt,
  image: photo.src,
  altText: photo.alt,
  category: photo.category,
}));
