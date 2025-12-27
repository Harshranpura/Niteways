-- Add image URLs to existing nightclubs
UPDATE nightclubs SET "imageUrl" = 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=800' WHERE name = 'Paradise Club';
UPDATE nightclubs SET "imageUrl" = 'https://images.unsplash.com/photo-1571407970349-bc81e7e96a47?w=800' WHERE name = 'Skyline Lounge';
UPDATE nightclubs SET "imageUrl" = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800' WHERE name = 'Neon Pulse';
UPDATE nightclubs SET "imageUrl" = 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800' WHERE name = 'Club Velvet';
UPDATE nightclubs SET "imageUrl" = 'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=800' WHERE name = 'Sky Garden';
UPDATE nightclubs SET "imageUrl" = 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800' WHERE name = 'Velvet Rope';
UPDATE nightclubs SET "imageUrl" = 'https://images.unsplash.com/photo-1571407999684-8c1e0a08c93b?w=800' WHERE name = 'The Underground';
UPDATE nightclubs SET "imageUrl" = 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800' WHERE name = 'Lux Nightclub';
UPDATE nightclubs SET "imageUrl" = 'https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=800' WHERE name = 'Electric Dreams';
UPDATE nightclubs SET "imageUrl" = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800' WHERE name = 'Moonlight Lounge';

-- Query to check all clubs have images
SELECT id, name, city, "imageUrl" FROM nightclubs ORDER BY created_at DESC;
