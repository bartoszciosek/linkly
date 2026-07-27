import React, { useState, useEffect } from 'react';
import { SavedLink } from './types';
import { Trash2, Link2, Plus, Globe, Loader2 } from 'lucide-react';

const API_URL = 'http://localhost:8080/api/links';

export default function App() {
  const [links, setLinks] = useState<SavedLink[]>([]);
  const [urlInput, setUrlInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // 1. Pobieranie zapisanych linków z Ktora
  const fetchLinks = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Błąd pobierania danych z API');
      const data = await response.json();
      setLinks(data);
    } catch (err) {
      setError('Nie udało się połączyć z backendem Ktor (sprawdź czy serwer działa na porcie 8080).');
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  // 2. Dodawanie nowego linku (POST)
  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlInput }),
      });

      if (!response.ok) throw new Error('Nie udało się dodać linku. Sprawdź URL.');

      const newLink: SavedLink = await response.json();
      setLinks((prev) => [newLink, ...prev]);
      setUrlInput('');
    } catch (err: any) {
      setError(err.message || 'Wystąpił błąd podczas dodawania.');
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Usuwanie linku (DELETE)
  const handleDeleteLink = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Błąd podczas usuwania');
      setLinks((prev) => prev.filter((link) => link.id !== id));
    } catch (err) {
      alert('Nie udało się usunąć linku.');
    }
  };

  return (
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.logo}>
            <Link2 size={36} color="#6366F1" /> Linkly
          </h1>
          <p style={styles.subtitle}>Twój prywatny schowek na ważne artykuły i strony www</p>
        </header>

        <form onSubmit={handleAddLink} style={styles.form}>
          <input
              type="text"
              placeholder="Wklej adres URL (np. github.com lub kotlinlang.org)..."
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              disabled={isLoading}
              style={styles.input}
          />
          <button type="submit" disabled={isLoading} style={styles.button}>
            {isLoading ? (
                <>
                  <Loader2 size={20} /> Pobieram...
                </>
            ) : (
                <>
                  <Plus size={20} /> Zapisz
                </>
            )}
          </button>
        </form>

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.grid}>
          {links.map((link) => (
              <div key={link.id} style={styles.card}>
                <div style={styles.imageContainer}>
                  {link.imageUrl ? (
                      <img src={link.imageUrl} alt={link.title} style={styles.cardImage} />
                  ) : (
                      <div style={styles.imagePlaceholder}>
                        <Globe size={48} color="#9CA3AF" />
                      </div>
                  )}
                </div>
                <div style={styles.cardBody}>
                  <span style={styles.domain}>{link.domain}</span>
                  <h3 style={styles.cardTitle}>{link.title}</h3>
                  <div style={styles.cardFooter}>
                    <a href={link.url} target="_blank" rel="noreferrer" style={styles.linkButton}>
                      Otwórz stronę ↗
                    </a>
                    <button onClick={() => handleDeleteLink(link.id)} style={styles.deleteButton}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
          ))}
        </div>
      </div>
  );
}

const styles = {
  container: { maxWidth: '1100px', margin: '0 auto', padding: '40px 20px', fontFamily: 'system-ui, -apple-system, sans-serif' },
  header: { textAlign: 'center' as const, marginBottom: '32px' },
  logo: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', fontSize: '2.8rem', fontWeight: '800', color: '#0F172A', margin: 0 },
  subtitle: { color: '#64748B', marginTop: '8px', fontSize: '1.1rem' },
  form: { display: 'flex', gap: '12px', maxWidth: '650px', margin: '0 auto 24px auto' },
  input: { flex: 1, padding: '14px 18px', fontSize: '1rem', borderRadius: '10px', border: '1px solid #CBD5E1', outline: 'none' },
  button: { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#6366F1', color: '#fff', border: 'none', padding: '14px 24px', fontSize: '1rem', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' },
  error: { backgroundColor: '#FEE2E2', color: '#991B1B', padding: '12px', borderRadius: '8px', maxWidth: '650px', margin: '0 auto 24px auto', textAlign: 'center' as const },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' },
  card: { display: 'flex', flexDirection: 'column' as const, borderRadius: '14px', border: '1px solid #E2E8F0', overflow: 'hidden', backgroundColor: '#fff', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)' },
  imageContainer: { width: '100%', height: '170px', backgroundColor: '#F8FAFC', borderBottom: '1px solid #F1F5F9' },
  cardImage: { width: '100%', height: '100%', objectFit: 'cover' as const },
  imagePlaceholder: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  cardBody: { padding: '18px', flex: 1, display: 'flex', flexDirection: 'column' as const },
  domain: { fontSize: '0.75rem', color: '#6366F1', fontWeight: '700', textTransform: 'uppercase' as const, letterSpacing: '0.05em' },
  cardTitle: { fontSize: '1.05rem', margin: '8px 0 16px 0', color: '#1E293B', flex: 1, lineHeight: '1.4' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #F1F5F9' },
  linkButton: { color: '#6366F1', textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem' },
  deleteButton: { background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '4px' }
};