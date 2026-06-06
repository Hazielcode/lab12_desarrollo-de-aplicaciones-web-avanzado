"use client";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Search, Plus, Trash2, Edit2, Loader2, ChevronLeft, ChevronRight, Terminal } from "lucide-react";

export default function BooksClient({ authors, availableGenres }: any) {
  const [books, setBooks] = useState([]);
  const [pagination, setPagination] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [page, setPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<any>(null);
  const [formData, setFormData] = useState({ title: "", description: "", isbn: "", publishedYear: "", genre: "", pages: "", authorId: "" });

  const fetchBooks = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ search, genre, authorName, sortBy, order, page: page.toString(), limit: "10" });
      const res = await fetch(`/api/books/search?${params.toString()}`);
      const data = await res.json();
      setBooks(data.data);
      setPagination(data.pagination);
    } catch { toast.error("Error al consultar datos"); } finally { setIsLoading(false); }
  }, [search, genre, authorName, sortBy, order, page]);

  useEffect(() => { const t = setTimeout(fetchBooks, 300); return () => clearTimeout(t); }, [fetchBooks]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingBook ? `/api/books/${editingBook.id}` : "/api/books";
      const method = editingBook ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      if (!res.ok) throw new Error();
      toast.success(editingBook ? "Libro actualizado" : "Libro registrado");
      setIsModalOpen(false); fetchBooks();
    } catch { toast.error("Error al guardar libro"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Confirmas la eliminación?")) return;
    try {
      await fetch(`/api/books/${id}`, { method: "DELETE" });
      toast.success("Libro eliminado"); fetchBooks();
    } catch { toast.error("Error al eliminar"); }
  };

  const openEditModal = (book: any) => {
    setEditingBook(book);
    setFormData({ title: book.title, description: book.description || "", isbn: book.isbn || "", publishedYear: book.publishedYear?.toString() || "", genre: book.genre || "", pages: book.pages?.toString() || "", authorId: book.authorId });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/5 pb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white mb-4">Explorador de Libros</h1>
          <p className="text-zinc-400 max-w-lg text-sm md:text-base">Interfaz de consulta avanzada. Filtra, ordena y gestiona el conjunto de datos literarios.</p>
        </div>
        <div className="flex items-center gap-2 text-zinc-400 font-mono text-xs mt-4 md:mt-0">
          <Terminal className="w-4 h-4" /> <span>~/registro/libros</span>
        </div>
      </div>

      <div className="bg-black border border-white/10 p-6 rounded-xl space-y-4">
        <div className="flex justify-between items-center mb-2">
          <p className="text-xs font-mono uppercase tracking-widest text-zinc-500">Parámetros de Consulta</p>
          <button onClick={() => { setEditingBook(null); setFormData({ title: "", description: "", isbn: "", publishedYear: "", genre: "", pages: "", authorId: "" }); setIsModalOpen(true); }} className="bg-white text-black hover:bg-zinc-200 px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" /> Añadir Registro
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
          <input type="text" placeholder="Consultar por título..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-md text-white text-sm focus:outline-none focus:border-white/30 transition-colors" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select value={genre} onChange={e => { setGenre(e.target.value); setPage(1); }} className="bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-white/30">
            <option value="">Cualquier Género</option>
            {availableGenres.map((g: string) => <option key={g} value={g}>{g}</option>)}
          </select>
          <input type="text" placeholder="Coincidencia de autor..." value={authorName} onChange={e => { setAuthorName(e.target.value); setPage(1); }} className="bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-white/30" />
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-white/30">
            <option value="createdAt">Ordenar: Fecha Creación</option>
            <option value="title">Ordenar: Título</option>
            <option value="publishedYear">Ordenar: Año Publicación</option>
          </select>
          <select value={order} onChange={e => setOrder(e.target.value)} className="bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-white/30">
            <option value="desc">Orden: Descendente</option>
            <option value="asc">Orden: Ascendente</option>
          </select>
        </div>
      </div>

      <div className="bg-black border border-white/10 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-white/5 flex justify-between items-center text-xs font-mono text-zinc-500 uppercase tracking-widest">
          <span>{pagination ? `Conjunto: ${pagination.total} registros` : 'Cargando...'}</span>
          {isLoading && <Loader2 className="w-4 h-4 animate-spin text-white" />}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-white/5 text-xs tracking-wider uppercase text-zinc-500 font-mono bg-white/[0.02]">
                <th className="p-4 font-normal">Título</th>
                <th className="p-4 font-normal">Autor</th>
                <th className="p-4 font-normal">Género</th>
                <th className="p-4 font-normal">Año</th>
                <th className="p-4 font-normal text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {!isLoading && books.length === 0 ? (
                <tr><td colSpan={5} className="p-12 text-center text-zinc-500 font-mono">La consulta arrojó 0 resultados.</td></tr>
              ) : books.map((book: any) => (
                <tr key={book.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="p-4 font-medium text-white">{book.title}</td>
                  <td className="p-4 text-zinc-400">{book.author?.name}</td>
                  <td className="p-4"><span className="bg-white/5 px-2 py-1 rounded-sm text-xs border border-white/10 text-zinc-300">{book.genre || "N/A"}</span></td>
                  <td className="p-4 text-zinc-400">{book.publishedYear || "N/A"}</td>
                  <td className="p-4 flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEditModal(book)} className="text-zinc-500 hover:text-white transition-colors"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(book.id)} className="text-zinc-500 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {pagination && pagination.totalPages > 1 && (
          <div className="p-4 border-t border-white/5 flex justify-between items-center">
            <button disabled={!pagination.hasPrev} onClick={() => setPage(p => p - 1)} className="text-xs font-mono uppercase tracking-wider text-zinc-400 hover:text-white disabled:opacity-30 transition-colors flex items-center"><ChevronLeft className="w-4 h-4 mr-1"/> Anterior</button>
            <span className="text-zinc-500 text-xs font-mono">{pagination.page} / {pagination.totalPages}</span>
            <button disabled={!pagination.hasNext} onClick={() => setPage(p => p + 1)} className="text-xs font-mono uppercase tracking-wider text-zinc-400 hover:text-white disabled:opacity-30 transition-colors flex items-center">Siguiente <ChevronRight className="w-4 h-4 ml-1"/></button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-black border border-white/10 rounded-xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col p-6">
            <h3 className="text-lg font-medium text-white mb-6 border-b border-white/5 pb-4">{editingBook ? "Modificar Registro" : "Añadir Registro"}</h3>
            <form onSubmit={handleSubmit} className="overflow-y-auto space-y-4 pr-2">
              <div><label className="block text-xs font-mono text-zinc-500 mb-2 uppercase tracking-wider">Título *</label><input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-white/30" /></div>
              <div><label className="block text-xs font-mono text-zinc-500 mb-2 uppercase tracking-wider">Autor *</label><select required value={formData.authorId} onChange={e => setFormData({...formData, authorId: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-white/30"><option value="">Seleccionar ID de Autor</option>{authors.map((a:any)=><option key={a.id} value={a.id}>{a.name}</option>)}</select></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-mono text-zinc-500 mb-2 uppercase tracking-wider">Género</label><input type="text" value={formData.genre} onChange={e => setFormData({...formData, genre: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-white/30" /></div>
                <div><label className="block text-xs font-mono text-zinc-500 mb-2 uppercase tracking-wider">Año</label><input type="number" value={formData.publishedYear} onChange={e => setFormData({...formData, publishedYear: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-white/30" /></div>
                <div><label className="block text-xs font-mono text-zinc-500 mb-2 uppercase tracking-wider">Páginas</label><input type="number" value={formData.pages} onChange={e => setFormData({...formData, pages: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-white/30" /></div>
                <div><label className="block text-xs font-mono text-zinc-500 mb-2 uppercase tracking-wider">ISBN</label><input type="text" value={formData.isbn} onChange={e => setFormData({...formData, isbn: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-white/30" /></div>
              </div>
              <div><label className="block text-xs font-mono text-zinc-500 mb-2 uppercase tracking-wider">Descripción</label><textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-white/30 resize-none" /></div>
              <div className="flex justify-end gap-3 pt-4"><button type="button" onClick={()=>setIsModalOpen(false)} className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors">Abortar</button><button type="submit" className="bg-white text-black hover:bg-zinc-200 px-4 py-2 rounded-md text-xs font-medium transition-colors">Ejecutar</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
