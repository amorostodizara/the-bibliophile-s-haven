import { useState, useMemo } from "react";
import AppSidebar from "@/components/AppSidebar";
import MobileNav from "@/components/MobileNav";
import SearchBar from "@/components/SearchBar";
import GenreFilter from "@/components/GenreFilter";
import BookCard from "@/components/BookCard";
import BookDetail from "@/components/BookDetail";
import StatsBar from "@/components/StatsBar";
import { books as initialBooks, type Book } from "@/data/books";

const Index = () => {
  const [activeView, setActiveView] = useState("discover");
  const [search, setSearch] = useState("");
  const [activeGenre, setActiveGenre] = useState("Tous");
  const [bookList, setBookList] = useState<Book[]>(initialBooks);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const toggleFavorite = (id: string) => {
    setBookList((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isFavorite: !b.isFavorite } : b))
    );
    if (selectedBook?.id === id) {
      setSelectedBook((prev) => prev ? { ...prev, isFavorite: !prev.isFavorite } : null);
    }
  };

  const filteredBooks = useMemo(() => {
    let result = bookList;

    if (activeView === "favorites") {
      result = result.filter((b) => b.isFavorite);
    } else if (activeView === "top-rated") {
      result = [...result].sort((a, b) => b.rating - a.rating);
    } else if (activeView === "recent") {
      result = [...result].sort((a, b) => b.year - a.year);
    }

    if (activeGenre !== "Tous") {
      result = result.filter((b) => b.genre === activeGenre);
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
      );
    }

    return result;
  }, [bookList, activeView, activeGenre, search]);

  const viewTitles: Record<string, string> = {
    discover: "Découvrir",
    catalog: "Catalogue",
    favorites: "Mes Favoris",
    trending: "Tendances",
    recent: "Ajouts Récents",
    "top-rated": "Mieux Notés",
  };

  const favCount = bookList.filter((b) => b.isFavorite).length;

  return (
    <div className="flex min-h-screen bg-surface-warm">
      <AppSidebar activeView={activeView} onViewChange={setActiveView} />

      <div className="flex-1 flex flex-col">
        <MobileNav activeView={activeView} onViewChange={setActiveView} />

        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          {activeView === "discover" && (
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
                Bonjour, <span className="text-gradient">Jean</span> 👋
              </h2>
              <p className="text-muted-foreground">Qu'allez-vous lire aujourd'hui ?</p>
            </div>
          )}

          {activeView === "discover" && (
            <div className="mb-8">
              <StatsBar totalBooks={bookList.length} favorites={favCount} />
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
            <h3 className="text-2xl font-display font-bold text-foreground">
              {viewTitles[activeView] || "Catalogue"}
            </h3>
            <SearchBar value={search} onChange={setSearch} />
          </div>

          <div className="mb-6">
            <GenreFilter activeGenre={activeGenre} onGenreChange={setActiveGenre} />
          </div>

          {filteredBooks.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">Aucun livre trouvé</p>
              <p className="text-muted-foreground text-sm mt-1">Essayez un autre filtre ou une autre recherche</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {filteredBooks.map((book, i) => (
                <BookCard
                  key={book.id}
                  book={book}
                  index={i}
                  onToggleFavorite={toggleFavorite}
                  onSelect={setSelectedBook}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      <BookDetail
        book={selectedBook}
        onClose={() => setSelectedBook(null)}
        onToggleFavorite={toggleFavorite}
      />
    </div>
  );
};

export default Index;
